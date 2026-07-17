#!/bin/bash
# =============================================================================
# Montajım Var — Database Backup Script
# Sprint 11 — Daily automated pg_dump → encrypted → S3 (or local)
#
# Usage:
#   ./scripts/backup-db.sh                    # backup to local ./backups/
#   ./scripts/backup-db.sh --s3                # backup to S3
#   S3_BUCKET=montajimvar-backups ./scripts/backup-db.sh --s3
#
# Cron (daily at 02:00 TRT):
#   0 2 * * * /home/pi/montajimvar/scripts/backup-db.sh --s3 >> /var/log/montajimvar-backup.log 2>&1
#
# Environment variables (from .env):
#   DATABASE_URL          — PostgreSQL connection string
#   BACKUP_ENCRYPTION_KEY — GPG passphrase for encryption (optional)
#   S3_BUCKET            — AWS S3 bucket name (if --s3)
#   AWS_ACCESS_KEY_ID    — AWS credentials (if --s3)
#   AWS_SECRET_ACCESS_KEY — AWS credentials (if --s3)
#   BACKUP_RETENTION_DAYS — Days to keep backups (default: 30)
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE=$(date +%Y-%m-%d)
BACKUP_NAME="montajimvar_${TIMESTAMP}"
BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.dump"
ENCRYPTED_FILE="$BACKUP_DIR/${BACKUP_NAME}.dump.enc"
LOG_FILE="${LOG_FILE:-/var/log/montajimvar-backup.log}"

# Load .env
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

DATABASE_URL="${DATABASE_URL:?DATABASE_URL is not set}"
BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"
S3_BUCKET="${S3_BUCKET:-}"

USE_S3=false
if [ "${1:-}" = "--s3" ]; then
  USE_S3=true
fi

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE" 2>/dev/null || echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2 | tee -a "$LOG_FILE" 2>/dev/null || echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2
  exit 1
}

trap 'error "Backup failed at line $LINENO"' ERR

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------
log "=== Montajım Var Database Backup ==="
log "Date: $DATE"
log "Database: $(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:***@/')"
log "Target: $([ "$USE_S3" = true ] && echo "S3 ($S3_BUCKET)" || echo "Local ($BACKUP_DIR)")"

# Check pg_dump
command -v pg_dump >/dev/null 2>&1 || error "pg_dump not found. Install: sudo apt install postgresql-client"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check disk space (need at least 500MB free)
AVAILABLE_MB=$(df -m "$BACKUP_DIR" | awk 'NR==2 {print $4}')
if [ "$AVAILABLE_MB" -lt 500 ]; then
  error "Insufficient disk space: ${AVAILABLE_MB}MB available (need 500MB)"
fi

# ---------------------------------------------------------------------------
# Step 1: pg_dump (custom format for parallel restore)
# ---------------------------------------------------------------------------
log "Step 1: Creating pg_dump..."

pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=6 \
  --no-owner \
  --no-privileges \
  --verbose \
  --file="$BACKUP_FILE" 2>&1 | while read -r line; do
    log "  pg_dump: $line"
  done

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log "  Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# ---------------------------------------------------------------------------
# Step 2: Encrypt (if key is set)
# ---------------------------------------------------------------------------
if [ -n "$BACKUP_ENCRYPTION_KEY" ]; then
  log "Step 2: Encrypting backup (GPG AES256)..."

  echo "$BACKUP_ENCRYPTION_KEY" | gpg --batch --yes --passphrase-fd 0 \
    --cipher-algo AES256 \
    --compress-algo none \
    --output "$ENCRYPTED_FILE" \
    --symmetric "$BACKUP_FILE"

  rm "$BACKUP_FILE"
  log "  Encrypted: $ENCRYPTED_FILE ($(du -h "$ENCRYPTED_FILE" | cut -f1))"

  # Verify decryption
  echo "$BACKUP_ENCRYPTION_KEY" | gpg --batch --passphrase-fd 0 \
    --decrypt "$ENCRYPTED_FILE" > /dev/null 2>&1 && log "  Decryption verified: OK" || error "Decryption verification failed"

  FINAL_FILE="$ENCRYPTED_FILE"
else
  log "Step 2: Encryption skipped (no BACKUP_ENCRYPTION_KEY set)"
  FINAL_FILE="$BACKUP_FILE"
fi

# ---------------------------------------------------------------------------
# Step 3: Upload to S3 (if --s3)
# ---------------------------------------------------------------------------
if [ "$USE_S3" = true ]; then
  if [ -z "$S3_BUCKET" ]; then
    error "S3_BUCKET is not set"
  fi

  command -v aws >/dev/null 2>&1 || error "aws CLI not found. Install: pip install awscli"

  S3_KEY="backups/$(date +%Y/%m)/${BACKUP_NAME}.dump.enc"
  [ "${FINAL_FILE##*.}" = "dump" ] && S3_KEY="${S3_KEY%.enc}"

  log "Step 3: Uploading to S3: s3://$S3_BUCKET/$S3_KEY"

  aws s3 cp "$FINAL_FILE" "s3://$S3_BUCKET/$S3_KEY" \
    --storage-class STANDARD_IA \
    --metadata "Date=$DATE,Service=montajimvar,Type=db-backup"

  log "  Upload complete"

  # ---------------------------------------------------------------------------
  # Step 3b: S3 Lifecycle cleanup (delete old backups)
  # ---------------------------------------------------------------------------
  log "Step 3b: Cleaning S3 backups older than $RETENTION_DAYS days..."

  aws s3 ls "s3://$S3_BUCKET/backups/" --recursive | while read -r etag date time key; do
    # Parse date from key path (YYYY/MM/) or use S3 date
    BACKUP_DATE=$(echo "$key" | grep -oP '\d{8}_' | head -1 | tr -d '_')
    if [ -n "$BACKUP_DATE" ]; then
      BACKUP_TIMESTAMP=$(date -d "${BACKUP_DATE:0:4}-${BACKUP_DATE:4:2}-${BACKUP_DATE:6:2}" +%s 2>/dev/null || echo 0)
      CUTOFF_TIMESTAMP=$(date -d "$RETENTION_DAYS days ago" +%s)

      if [ "$BACKUP_TIMESTAMP" -lt "$CUTOFF_TIMESTAMP" ] 2>/dev/null; then
        log "  Deleting old: $key"
        aws s3 rm "s3://$S3_BUCKET/$key" 2>/dev/null || true
      fi
    fi
  done

  log "  S3 cleanup complete"

  # Remove local copy after successful S3 upload
  rm "$FINAL_FILE"
  log "  Local copy removed (uploaded to S3)"
else
  # ---------------------------------------------------------------------------
  # Local retention cleanup
  # ---------------------------------------------------------------------------
  log "Step 3: Cleaning local backups older than $RETENTION_DAYS days..."

  find "$BACKUP_DIR" -name "montajimvar_*.dump*" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

  LOCAL_COUNT=$(find "$BACKUP_DIR" -name "montajimvar_*.dump*" | wc -l)
  log "  Local backups retained: $LOCAL_COUNT"
fi

# ---------------------------------------------------------------------------
# Step 4: Verify backup integrity
# ---------------------------------------------------------------------------
log "Step 4: Verifying backup integrity..."

if [ "$USE_S3" = true ]; then
  S3_SIZE=$(aws s3 ls "s3://$S3_BUCKET/$S3_KEY" | awk '{print $3}')
  if [ "$S3_SIZE" -lt 1000 ]; then
    error "Backup too small ($S3_SIZE bytes) — likely corrupted"
  fi
  log "  S3 backup size: $S3_SIZE bytes — OK"
else
  if [ -f "$FINAL_FILE" ]; then
    LOCAL_SIZE=$(stat -c%s "$FINAL_FILE" 2>/dev/null || stat -f%z "$FINAL_FILE")
    if [ "$LOCAL_SIZE" -lt 1000 ]; then
      error "Backup too small ($LOCAL_SIZE bytes) — likely corrupted"
    fi
    log "  Local backup size: $LOCAL_SIZE bytes — OK"
  fi
fi

# ---------------------------------------------------------------------------
# Step 5: Send notification (optional webhook)
# ---------------------------------------------------------------------------
if [ -n "${BACKUP_WEBHOOK_URL:-}" ]; then
  log "Step 5: Sending webhook notification..."

  STATUS="success"
  MESSAGE="Backup completed: $BACKUP_NAME ($BACKUP_SIZE)"

  curl -s -X POST "$BACKUP_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{\"status\":\"$STATUS\",\"message\":\"$MESSAGE\",\"date\":\"$DATE\",\"service\":\"montajimvar\"}" \
    >/dev/null 2>&1 || log "  Webhook failed (non-critical)"

  log "  Webhook sent"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
log ""
log "=== Backup Summary ==="
log "  Status: SUCCESS"
log "  Date: $DATE"
log "  File: $([ "$USE_S3" = true ] && echo "s3://$S3_BUCKET/$S3_KEY" || echo "$FINAL_FILE")"
log "  Size: $BACKUP_SIZE"
log "  Encrypted: $([ -n "$BACKUP_ENCRYPTION_KEY" ] && echo "Yes (AES256)" || echo "No")"
log "  Retention: $RETENTION_DAYS days"
log "==="

exit 0
