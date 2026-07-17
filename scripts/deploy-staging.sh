#!/bin/bash
# =============================================================================
# Montajım Var — Staging Deploy Script (runs on Pi)
# Sprint 11 — Deploys to staging environment at staging.montajimvar.xyz
#
# Usage:
#   bash deploy-staging.sh [branch]      # default: develop
#   bash deploy-staging.sh main
#   bash deploy-staging.sh feat/my-branch
#
# Target:
#   Port: 3010 (behind cloudflared ingress → staging.montajimvar.xyz)
#   PM2 process: montajimvar-staging
#   Dir: /home/pi/staging
# =============================================================================

set -euo pipefail

BRANCH=${1:-develop}
APP_DIR=${STAGING_DIR:-/home/pi/staging}
PORT=${STAGING_PORT:-3010}
PM2_NAME="montajimvar-staging"

log() { echo "[$(date '+%H:%M:%S')] $*"; }
err() { echo "[$(date '+%H:%M:%S')] ERROR: $*" >&2; exit 1; }

log "=========================================="
log "  Montajım Var — Staging Deploy"
log "=========================================="
log "Branch: $BRANCH"
log "Dir:    $APP_DIR"
log "Port:   $PORT"
log "PM2:    $PM2_NAME"
log ""

# Pre-flights
command -v git >/dev/null || err "git not installed"
command -v npm >/dev/null || err "npm not installed"
command -v pm2 >/dev/null || err "pm2 not installed (npm install -g pm2)"

# Create dir if first deploy
if [ ! -d "$APP_DIR/.git" ]; then
  log "First staging deploy — cloning..."
  mkdir -p "$APP_DIR"
  cd "$APP_DIR"
  git clone https://github.com/kontrol1453/montajimvar.git .
fi

cd "$APP_DIR"

# Pull latest
log "[1/6] Fetching branch: $BRANCH"
git fetch --all --prune
git checkout "$BRANCH" || err "Branch $BRANCH not found"
git pull origin "$BRANCH" --ff-only || log "  (no upstream tracking; using current state)"
log "  OK — HEAD: $(git rev-parse --short HEAD)"

# Env file check
if [ ! -f "$APP_DIR/.env.staging" ]; then
  err ".env.staging not found in $APP_DIR.\n  Copy .env.staging.example → .env.staging and fill in values."
fi

# Load env
log "[2/6] Loading .env.staging"
set -a
. "$APP_DIR/.env.staging"
set +a
log "  OK — DATABASE_URL: $(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:***@/')"

# Install
log "[3/6] Installing dependencies"
npm ci --omit=dev --no-audit --no-fund
log "  OK"

# Prisma
log "[4/6] Prisma generate + migrate"
npx prisma generate
npx prisma migrate deploy || log "  (migrate deploy failed; running db push)"
npx prisma db push --skip-generate || log "  (db push skipped)"
log "  OK"

# Build
log "[5/6] Building Next.js (standalone)"
npm run build
log "  OK"

# PM2 restart
log "[6/6] Restarting PM2 process: $PM2_NAME on port $PORT"
pm2 delete "$PM2_NAME" 2>/dev/null || true
pm2 start npm --name "$PM2_NAME" \
  --env staging \
  --max-memory-restart 512M \
  -- start -- --port "$PORT"
pm2 save
log "  OK"

# Health check
log "  Waiting for health..."
sleep 5
for i in 1 2 3 4 5; do
  HEALTH=$(curl -s --max-time 3 "http://localhost:$PORT/api/health" 2>/dev/null || echo "")
  if echo "$HEALTH" | grep -q '"status":"ok"'; then
    log "  OK — health: $HEALTH"
    break
  fi
  log "  Attempt $i/5: no healthy response yet, retrying in 3s..."
  sleep 3
done

if ! echo "$HEALTH" | grep -q '"status":"ok"'; then
  err "Health check failed after 5 attempts. Check: pm2 logs $PM2_NAME --lines 50"
fi

log ""
log "=========================================="
log "  Staging deploy complete!"
log "=========================================="
log "URL:    https://staging.montajimvar.xyz"
log "Health: https://staging.montajimvar.xyz/api/health"
log "Local:  http://localhost:$PORT"
log "PM2:    pm2 status $PM2_NAME"
log "Logs:   pm2 logs $PM2_NAME --lines 100"
log "=========================================="
