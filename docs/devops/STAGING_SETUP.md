# Staging Environment Setup Guide

> **Sprint 11** — Staging environment for pre-production validation

## 1. Overview

The staging environment mirrors production as closely as possible, using a separate Neon database branch and a separate Supabase project. It runs on the same Raspberry Pi via PM2 on a different port (3001), proxied through nginx at `staging.montajimvar.xyz`.

### Architecture

```
Internet → nginx (Pi) → staging.montajimvar.xyz → localhost:3001 (PM2: montajimvar-staging)
                                                   ↓
                                              Neon (staging branch)
                                              Supabase (staging project)
```

### URLs

| Environment | URL | Port | PM2 Process |
|---|---|---|---|
| Production | https://montajimvar.xyz | 3000 | montajimvar |
| Staging | https://staging.montajimvar.xyz | 3001 | montajimvar-staging |
| Preview | https://preview-{branch}.test.montajimvar.xyz | 3002+ | montajimvar-preview-{branch} |

---

## 2. Neon Database (Staging Branch)

### 2.1 Create Staging Branch

```bash
# Install Neon CLI
npm install -g neonctl

# Login
neonctl auth

# List projects
neonctl projects list

# Create staging branch from main
neonctl branches create \
  --project-id <PROJECT_ID> \
  --name staging \
  --parent main \
  --database montajimvar_staging

# Get connection string
neonctl connection-string --project-id <PROJECT_ID> --branch staging --database montajimvar_staging
# → postgresql://...@ep-staging-xxx.region.aws.neon.tech/montajimvar_staging
```

### 2.2 Run Migrations on Staging

```bash
# Set staging DATABASE_URL
export DATABASE_URL="postgresql://...@ep-staging-xxx.../montajimvar_staging"

# Apply schema
npx prisma migrate deploy
npx prisma db push

# Seed minimal data
npx prisma db seed
```

---

## 3. Supabase Storage (Staging Project)

### 3.1 Create Separate Supabase Project

1. Go to https://supabase.com/dashboard
2. Create new project: `montajimvar-staging`
3. Region: same as production (eu-central-1)
4. Copy the following keys:
   - `NEXT_PUBLIC_SUPABASE_URL` (staging URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (staging anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (staging service role key)

### 3.2 Create Storage Buckets

```sql
-- Run in Supabase SQL Editor (staging project)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('portfolio', 'portfolio', true),
  ('job-files', 'job-files', false),
  ('review-photos', 'review-photos', true),
  ('certificates', 'certificates', false),
  ('company-logos', 'company-logos', true),
  ('videos', 'videos', true);
```

---

## 4. Pi Setup — Staging Instance

### 4.1 Clone & Configure

```bash
# SSH to Pi
ssh pi@192.168.0.38

# Create staging directory
mkdir -p /home/pi/staging
cd /home/pi/staging

# Clone (or symlink from existing)
git clone https://github.com/kontrol1453/montajimvar.git .
git checkout develop  # or main

# Create staging .env
cp .env.example .env.staging
nano .env.staging
```

### 4.2 Staging .env Configuration

```bash
# .env.staging
NODE_ENV=staging
PORT=3001
NEXTAUTH_URL=https://staging.montajimvar.xyz
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
DATABASE_URL=postgresql://...@ep-staging-xxx.../montajimvar_staging
NEXT_PUBLIC_APP_URL=https://staging.montajimvar.xyz
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co  # staging project
NEXT_PUBLIC_SUPABASE_ANON_KEY=<staging anon key>
SUPABASE_SERVICE_ROLE_KEY=<staging service role key>
SENTRY_DSN=<same as prod, or separate staging project>
SENTRY_ENVIRONMENT=staging
GOOGLE_CLIENT_ID=<same as prod>
GOOGLE_CLIENT_SECRET=<same as prod>
# ... other keys same as prod or using test values
```

### 4.3 Build & Start with PM2

```bash
# Install deps
npm ci

# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
pm2 start npm --name montajimvar-staging -- start -- --port 3001
pm2 save

# Set staging env
pm2 restart montajimvar-staging --env staging --update-env
```

---

## 5. nginx Configuration

### 5.1 Staging Server Block

```nginx
# /etc/nginx/sites-available/staging.montajimvar.xyz
server {
    listen 80;
    listen 443 ssl;
    server_name staging.montajimvar.xyz;

    # SSL (use same cert or separate Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/staging.montajimvar.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.montajimvar.xyz/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.2 Enable & Reload

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/staging.montajimvar.xyz /etc/nginx/sites-enabled/

# Get SSL cert
sudo certbot --nginx -d staging.montajimvar.xyz

# Test & reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Deploy Script — Staging

### 6.1 deploy-staging.sh (on Pi)

```bash
#!/bin/bash
set -euo pipefail

APP_DIR=/home/pi/staging
BRANCH=${1:-develop}

echo "=== Staging Deploy: $BRANCH ==="

cd $APP_DIR
git fetch --all
git checkout $BRANCH
git pull origin $BRANCH

# Install deps
npm ci --omit=dev

# Prisma
npx prisma generate
npx prisma migrate deploy
npx prisma db push --skip-generate

# Build
npm run build

# Reload PM2
pm2 reload montajimvar-staging --update-env

# Health check
sleep 5
curl -fsS http://localhost:3001/api/health || {
    echo "STAGING HEALTH CHECK FAILED"
    pm2 restart montajimvar-staging
    exit 1
}

echo "=== Staging deploy complete ==="
echo "URL: https://staging.montajimvar.xyz"
echo "Health: $(curl -s http://localhost:3001/api/health)"
```

### 6.2 Local Deploy Script — deploy-staging.bat (Windows)

```batch
@echo off
set BRANCH=%1
if "%BRANCH%"=="" set BRANCH=develop

echo Deploying branch %BRANCH% to staging...

REM Push current code to Pi
pscp -r -batch src pi@192.168.0.38:/home/pi/staging/src
pscp -r -batch public pi@192.168.0.38:/home/pi/staging/public
pscp -r -batch prisma pi@192.168.0.38:/home/pi/staging/prisma
pscp -batch package.json pi@192.168.0.38:/home/pi/staging/package.json
pscp -batch next.config.js pi@192.168.0.38:/home/pi/staging/next.config.js
pscp -batch tsconfig.json pi@192.168.0.38:/home/pi/staging/tsconfig.json

REM Execute deploy script on Pi
plink -batch pi@192.168.0.38 "bash /home/pi/staging/deploy-staging.sh %BRANCH%"
```

---

## 7. DNS Configuration

| Record | Type | Value |
|---|---|---|
| staging.montajimvar.xyz | A | <Pi public IP> |
| staging.montajimvar.xyz | AAAA | <Pi IPv6> (if available) |

---

## 8. Usage Workflow

```bash
# 1. Developer pushes to develop branch
git push origin develop

# 2. Deploy to staging (from dev machine)
.\deploy-staging.bat develop

# 3. QA validates on staging
#    - Visit https://staging.montajimvar.xyz
#    - Run through test checklist
#    - Verify data is separate from production

# 4. If pass → merge to main → production deploy
# 5. If fail → fix on branch → re-deploy staging
```

---

## 9. Data Isolation Rules

| Rule | Enforcement |
|---|---|
| Staging DB is separate from prod | Neon branch isolation |
| Staging Supabase is separate project | Separate project ID |
| Staging secrets are different | Separate NEXTAUTH_SECRET |
| No cross-environment API calls | Separate DATABASE_URL |
| Test data clearly marked | Seed script uses `@staging.test` emails |

---

## 10. Cleanup

```bash
# Reset staging DB
npx prisma migrate reset --force

# Delete staging Neon branch (careful!)
neonctl branches delete --project-id <PROJECT_ID> staging

# Stop PM2 staging
pm2 delete montajimvar-staging
pm2 save
```

---

*Last updated: 2026-07-17 • Sprint 11*
