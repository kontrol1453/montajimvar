# Operations — Montajım Var

## 1. Runbooks

### 1.1 Deploy to Production

```bash
# 1. Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. GitHub Actions runs:
#    - CI (lint, typecheck, test, build)
#    - Production deploy workflow
#    - SSH to Pi, pull, npm ci, prisma migrate, pm2 reload
#    - Health check + smoke tests
#    - GitHub Release created

# 3. Verify
curl https://test.montajimvar.xyz/api/health
# {"status":"ok","service":"montajimvar","version":"1.0.0"}

# 4. Monitor 10 min
# - Sentry: no new errors
# - pm2 logs montajimvar
# - Vercel Analytics: traffic normal
```

### 1.2 Rollback Production

```bash
# On Pi
cd /home/pi/montajimvar
git fetch --all
git checkout v<previous-tag>
npm ci --omit=dev
npx prisma migrate deploy
pm2 reload montajimvar --update-env

# Verify
curl https://test.montajimvar.xyz/api/health

# Sentry annotation
sentry-cli releases new montajimvar@v<previous>
sentry-cli releases set-commits --commit "kontrol1453/montajimvar@v<previous>" montajimvar@v<previous>
```

### 1.3 Database Migration (Safe)

```bash
# 1. Backup (run on Pi or dev machine)
pg_dump "$DATABASE_URL" -F c -f backup-$(date +%Y%m%d).dump

# 2. Apply
npx prisma migrate deploy

# 3. Verify
npx prisma migrate status

# Rollback (if needed)
npx prisma migrate resolve --rolled-back <migration-name>
# Then restore dump:
pg_restore -d "$DATABASE_URL" backup-YYYYMMDD.dump --clean --if-exists
```

### 1.4 Scale / Restart App

```bash
# Graceful reload (zero-downtime)
pm2 reload montajimvar --update-env

# Hard restart (if stuck)
pm2 restart montajimvar

# Scale (not applicable single-instance)
# pm2 scale montajimvar 2  # requires sticky sessions + shared store
```

### 1.5 Secret Rotation

```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update in 1Password / Vault
# 3. Update Pi .env
ssh pi@192.168.0.38 "sed -i 's/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=<new>/' /home/pi/montajimvar/.env"

# 4. Force logout (bump tokenVersion)
npx prisma db execute --stdin <<< "UPDATE \"User\" SET \"tokenVersion\" = \"tokenVersion\" + 1;"

# 5. Reload
pm2 reload montajimvar --update-env
```

## 2. Monitoring & Alerting

### 2.1 Key Dashboards
- **Sentry**: `https://sentry.io/organizations/<org>/projects/montajimvar/`
- **Vercel Analytics**: `https://vercel.com/<team>/montajimvar/analytics`
- **PM2**: `pm2 monit` (on Pi)

### 2.2 Alert Rules (Current)
| Alert | Channel | Threshold |
|---|---|---|
| Sentry error (new) | Email | Any |
| Sentry error (fatal) | Email | Any |
| GitHub Actions fail | Email | Any |
| Deploy fail | Email | Any |

### 2.3 Alert Rules (Target P2)
| Alert | Channel | Threshold |
|---|---|---|
| 500 error rate | Slack | >1% / 5min |
| API p95 latency | Slack | >2s |
| Uptime down | Slack + Email | 3 failed pings |
| DB connections | Slack | >80% pool |
| Memory (Pi) | Slack | >85% |
| Disk (Pi) | Slack | >90% |

## 3. Backup Operations

### 3.1 Schedule
| What | When | Where | Retention |
|---|---|---|---|
| Neon PITR | Continuous | Neon | 7 days |
| Manual pg_dump (pre-release) | On release | S3 (encrypted) | 30 days |
| Quarterly full | Quarterly | S3 Glacier | 1 year |

### 3.2 Verify Restore (Quarterly Drill)
```bash
# 1. Create test DB
createdb montajimvar-drill

# 2. Restore latest
pg_restore -d montajimvar-drill backup-YYYYMMDD.dump --clean --if-exists

# 3. Verify counts
psql montajimvar-drill -c "SELECT COUNT(*) FROM \"User\";"
psql montajimvar-drill -c "SELECT MAX(\"createdAt\") FROM \"Job\";"
```

## 4. Incident Response

### 4.1 Severity Levels
| Sev | Definition | Response |
|---|---|---|
| **P0** | Data breach, auth bypass, total outage | 15 min, all hands |
| **P1** | Major feature down, high error rate | 1 hour, on-call |
| **P2** | Degraded performance, partial outage | 4 hours |
| **P3** | Minor bug, cosmetic | Next sprint |

### 4.2 Communication
| Audience | Channel | Timing |
|---|---|---|
| Internal | Slack `#incidents` | Immediate |
| Users | Status page + banner | 5 min (P0/P1) |
| Regulatory (KVKK) | Formal letter | 72h (if data breach) |

### 4.3 Post-Mortem Template
1. **Summary** (what, when, duration)
2. **Timeline** (key events)
3. **Root Cause** (5 Whys)
4. **Impact** (users, data, revenue)
5. **Action Items** (prevent recurrence)
6. **Follow-up** (owner, due date)

## 5. Maintenance Windows

| Window | Frequency | Duration | Activities |
|---|---|---|---|
| **Weekly** | Sunday 03:00-04:00 TRT | 60 min | OS updates, npm audit, backup verify |
| **Monthly** | 1st Saturday 02:00 | 120 min | Dependency upgrades, Prisma version, Node LTS |
| **Quarterly** | Scheduled | 4 hours | DR drill, secret rotation, capacity review |

**No-deploy Fridays** — No production deploys Friday 14:00 – Monday 09:00 TRT.

## 6. Capacity Planning

| Resource | Current | Threshold | Action |
|---|---|---|---|
| Pi RAM | 4GB (2.1GB used) | 80% (3.2GB) | Upgrade to 8GB Pi |
| Pi Disk | 32GB (8GB used) | 80% (25GB) | Clean logs, expand |
| Neon Storage | 500MB | 80% (4GB) | Archive old data |
| Neon Compute | 0.5 vCPU | 80% | Scale tier |
| Supabase Storage | 2GB | 80% (8GB) | Cleanup orphaned |

## 7. Contacts

| Role | Name | Channel |
|---|---|---|
| Release Manager | — | Slack `@release` |
| On-Call (Primary) | — | Phone + Slack |
| On-Call (Secondary) | — | Phone + Slack |
| Security Champion | — | Slack `@security` |
| DBA (Neon) | Neon Support | `support@neon.tech` |
| Storage (Supabase) | Supabase Support | Dashboard ticket |

---

## 8. Docker Operations

### 8.1 Build Docker Image Locally

```bash
# Build Next.js app image
docker build -t montajimvar:local --target runner .

# Build push-service image
docker build -t montajimvar-push:local -f push-service/Dockerfile --target runner .

# Verify
docker run --rm -it --entrypoint sh montajimvar:local -c "node -v && ls -la .next/standalone"
```

### 8.2 Run Full Stack via Docker Compose

```bash
# Development (with hot reload, mailhog, localstack)
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Production-like staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# With DB admin tools
docker compose --profile tools up -d

# Stop
docker compose down

# Stop and wipe volumes (DESTRUCTIVE)
docker compose down -v
```

### 8.3 Docker Image Registry (GHCR)

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u kontrol1453 --password-stdin

# Pull
docker pull ghcr.io/kontrol1453/montajimvar:latest
docker pull ghcr.io/kontrol1453/montajimvar-push:latest

# Run on Pi
docker run -d \
  --name montajimvar-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  ghcr.io/kontrol1453/montajimvar:latest
```

### 8.4 Docker Backup & Restore

```bash
# Backup volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/pg-volume-$(date +%Y%m%d).tar.gz -C /data .

# Restore volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/pg-volume-YYYYMMDD.tar.gz -C /data
```

---

## 9. Staging Operations

### 9.1 Deploy to Staging

```bash
# Local machine
.\deploy-staging.bat develop

# Or directly on Pi
ssh pi@192.168.0.38
cd /home/pi/staging
bash deploy-staging.sh develop
```

### 9.2 Verify Staging

```bash
# Health check
curl https://staging.montajimvar.xyz/api/health
# Expected: {"status":"ok","service":"montajimvar","version":"..."}

# Check PM2
pm2 status montajimvar-staging

# Check nginx
sudo nginx -t && sudo systemctl status nginx

# Check logs
pm2 logs montajimvar-staging --lines 50
```

### 9.3 Reset Staging Database

```bash
ssh pi@192.168.0.38
cd /home/pi/staging
export DATABASE_URL="<staging Neon URL>"
npx prisma migrate reset --force  # Wipes & reseeds staging DB
```

### 9.4 Staging Neon Branch Management

```bash
# List branches
neonctl branches list --project-id <PROJECT_ID>

# Create new branch from staging
neonctl branches create --project-id <PROJECT_ID> --name staging-refresh --parent staging

# Delete staging branch (careful)
neonctl branches delete --project-id <PROJECT_ID> staging

# Restore from Neon PITR
neonctl branches create --project-id <PROJECT_ID> --name staging-restored --parent main --point-in-time "2026-07-01T00:00:00Z"
```

---

## 10. Preview Operations

### 10.1 List Active Previews

```bash
# On Pi
pm2 list | grep preview

# Check what's running
for port in $(seq 3002 3010); do
  echo -n "Port $port: "
  curl -s --max-time 2 http://localhost:$port/api/health | grep -o '"status":"[^"]*"' || echo "DOWN"
done
```

### 10.2 Manual Cleanup of Stale Previews

```bash
# Stop all preview processes
pm2 list --no-colors | grep "montajimvar-preview" | awk '{print $2}' | xargs -I{} pm2 delete {}
pm2 save

# Remove preview directories
rm -rf /home/pi/previews/*

# Verify clean
pm2 list | grep preview  # should be empty
```

### 10.3 Preview Resource Guard

```bash
# Check Pi memory
free -m
# If available < 300MB, preview deploys will be skipped automatically

# Check disk
df -h /
# If available < 500MB, clean up:
docker system prune -f
pm2 jlist | jq -r '.[] | select(.name | startswith("montajimvar-preview")) | .name' | xargs -I{} pm2 delete {}
rm -rf /home/pi/previews/*
```

### 10.4 Preview nginx Wildcard

```bash
# Test wildcard DNS
dig *.test.montajimvar.xyz

# Check nginx wildcard cert
sudo certbot certificates -d "*.test.montajimvar.xyz"

# Reload nginx after config change
sudo nginx -t && sudo systemctl reload nginx
```

---

## 11. Backup Operations (Enhanced)

### 11.1 Automated Backup Cron (Pi)

```bash
# Install crontab for daily backup at 02:00 TRT
crontab -e

# Add:
0 2 * * * /home/pi/montajimvar/scripts/backup-db.sh --s3 >> /var/log/montajimvar-backup.log 2>&1

# Test manually
ssh pi@192.168.0.38
cd /home/pi/montajimvar
./scripts/backup-db.sh --s3
```

### 11.2 Required Environment Variables (Pi .env)

```bash
# .env additions for backup
BACKUP_ENCRYPTION_KEY=<openssl rand -base64 32>
S3_BUCKET=montajimvar-backups
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
BACKUP_RETENTION_DAYS=30
BACKUP_WEBHOOK_URL=<slack/discord webhook optional>
```

### 11.3 Manual Backup (Pre-Release)

```bash
ssh pi@192.168.0.38
cd /home/pi/montajimvar
./scripts/backup-db.sh  # local
./scripts/backup-db.sh --s3  # S3 encrypted

# Verify backup
ls -la backups/
pg_restore --list backups/montajimvar_YYYYMMDD_HHMMSS.dump | head -20
```

### 11.4 Restore from Backup

```bash
# From local dump
pg_restore -d "$DATABASE_URL" backup-YYYYMMDD.dump --clean --if-exists

# From encrypted S3 backup
aws s3 cp s3://montajimvar-backups/backups/YYYY/MM/montajimvar_YYYYMMDD.dump.enc /tmp/
echo "$BACKUP_ENCRYPTION_KEY" | gpg --decrypt /tmp/montajimvar_YYYYMMDD.dump.enc > /tmp/backup.dump
pg_restore -d "$DATABASE_URL" /tmp/backup.dump --clean --if-exists
```

### 11.5 Backup Verification (Quarterly Drill)

```bash
# 1. Create test DB
createdb montajimvar-drill

# 2. Restore latest from S3
LATEST=$(aws s3 ls s3://montajimvar-backups/backups/ --recursive | sort | tail -1 | awk '{print $4}')
aws s3 cp "s3://montajimvar-backups/$LATEST" /tmp/backup.enc
echo "$BACKUP_ENCRYPTION_KEY" | gpg --decrypt /tmp/backup.enc > /tmp/backup.dump
pg_restore -d montajimvar-drill /tmp/backup.dump --clean --if-exists

# 3. Verify data
psql montajimvar-drill -c "SELECT COUNT(*) FROM \"User\";"
psql montajimvar-drill -c "SELECT MAX(\"createdAt\") FROM \"Job\";"
psql montajimvar-drill -c "SELECT COUNT(*) FROM \"Job\" WHERE \"status\" = 'COMPLETED';"

# 4. Cleanup
dropdb montajimvar-drill
rm /tmp/backup.*
```

---

*Last updated: 2026-07-17 • Sprint 11 • Review quarterly*