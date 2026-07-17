# Staging Environment Setup Guide

> **Sprint 11** — Staging environment for pre-production validation
> **Implementation**: Cloudflare Tunnel (cloudflared) + PM2 — no nginx required

## 1. Overview

The staging environment runs on the same Raspberry Pi as production, behind Cloudflare Tunnel (`cloudflared`). SSL termination happens at Cloudflare edge — no nginx, no Let's Encrypt, no port forwarding.

### Architecture

```
Internet → Cloudflare Edge (TLS) → Cloudflare Tunnel → Pi
                                 staging.montajimvar.xyz → localhost:3010 (PM2: montajimvar-staging)
```

### URLs

| Environment | URL | Port | PM2 Process | CF Routing |
|---|---|---|---|---|
| Production | https://montajimvar.xyz | 3000 | montajimvar | CNAME → cfargotunnel |
| Test (prod) | https://test.montajimvar.xyz | 3000 | montajimvar (shared) | CNAME → cfargotunnel |
| **Staging** | **https://staging.montajimvar.xyz** | **3010** | **montajimvar-staging** | CNAME → cfargotunnel |
| Preview | https://preview-{slug}.test.montajimvar.xyz | 3019 → 3020-3099 | montajimvar-preview-router → preview processes | CNAME wildcard → cfargotunnel |
| Push | https://push.montajimvar.xyz | 3001 | (push-service) | CNAME → cfargotunnel |

> Staging port `3010` chosen to avoid conflict with `3001` (push-service), `3002` (smoke-test sidelines).

---

## 2. Cloudflare Tunnel Configuration

### 2.1 Tunnel Info

| | |
|---|---|
| Tunnel name | `montajimvar` |
| Tunnel UUID | `413b8130-5421-4766-9078-40a3389abf3d` |
| Credentials | `/home/pi/.cloudflared/413b8130-...json` |
| Config | `/etc/cloudflared/config.yml` |
| Service | `cloudflared.service` (systemd, enabled) |

### 2.2 Ingress Map (config.yml)

```yaml
tunnel: montajimvar
credentials-file: /home/pi/.cloudflared/413b8130-5421-4766-9078-40a3389abf3d.json

ingress:
  - hostname: test.montajimvar.xyz       # production app
    service: http://localhost:3000
  - hostname: staging.montajimvar.xyz    # ← STAGING (new)
    service: http://localhost:3010
  - hostname: montajimvar.xyz
    service: http://localhost:3000
  - hostname: www.montajimvar.xyz
    service: http://localhost:3000
  - hostname: push.montajimvar.xyz
    service: http://localhost:3001
  - hostname: linkedin.montajimvar.xyz
    service: http://localhost:3003
  - hostname: '*.test.montajimvar.xyz'   # ← PREVIEW WILDCARD (see PREVIEW_AUTOMATION.md)
    service: http://localhost:3019       # preview-router on Pi (PM2)
  - service: http_status:404
```

### 2.3 Add Staging DNS Route (one-time)

```bash
# On Pi — creates CNAME staging.montajimvar.xyz → <tunnel-uuid>.cfargotunnel.com
cloudflared tunnel route dns montajimvar staging.montajimvar.xyz
# ✅ Added CNAME staging.montajimvar.xyz → tunnel
```

### 2.4 Apply Updated Config

```bash
# Backup current config
sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.bak-$(date +%Y%m%d)

# Apply new config (with staging + preview ingress lines)
# Either: nano /etc/cloudflared/config.yml
# Or: copy new file → sudo cp new.yml /etc/cloudflared/config.yml

# Validate (optional)
cloudflared tunnel ingress validate  # reads from default config

# Restart systemd service
sudo systemctl restart cloudflared

# Verify
systemctl status cloudflared | head -5
# Expected: Active: active (running)
```

---

## 3. Database Strategy

**Current (per user decision, 2026-07-17)**: Staging shares production Neon DB.
- `DATABASE_URL` in `.env.staging` is identical to production `.env`
- Reads: staging app reads/writes the same Neon database
- Risk: staging test actions mutate real data (e.g., creating users)
- Recommended migration path: open separate Neon branch when ready (see §8)

### Neon Alternative (Future: separate staging branch)

```bash
# Install Neon CLI on dev machine
npm install -g neonctl
neonctl auth

# Create staging branch from main
neonctl branches create \
  --project-id <PROJECT_ID> \
  --name staging \
  --parent main \
  --database montajimvar_staging

# Get connection string, replace DATABASE_URL in /home/pi/staging/.env.staging
neonctl connection-string --branch staging
```

Then on Pi:
```bash
cd /home/pi/staging
# Update .env.staging with new DATABASE_URL
# Apply schema
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma db push
npm run build
pm2 restart montajimvar-staging --update-env
```

---

## 4. Pi Setup — Staging Instance

### 4.1 One-Time Bootstrap (`scripts/setup-staging-env.sh`)

```bash
# Upload script to Pi and run
pscp -pw <PI_PWD> scripts/setup-staging-env.sh pi@192.168.0.38:/tmp/
plink -pw <PI_PWD> pi@192.168.0.38 "bash /tmp/setup-staging-env.sh && rm /tmp/setup-staging-env.sh"
```

This script:
1. Copies `/home/pi/montajimvar/.env` → `/home/pi/staging/.env.staging`
2. Updates staging-specific vars:
   - `PORT=3010`
   - `NEXTAUTH_URL=https://staging.montajimvar.xyz`
   - `NEXT_PUBLIC_APP_URL=https://staging.montajimvar.xyz`
   - `SENTRY_ENVIRONMENT=staging`
3. Keeps `DATABASE_URL` from production (per current decision)

### 4.2 Staging Directory Layout

```
/home/pi/staging/
├── .env                  # symlink to .env.staging OR copied (pm2 env)
├── .env.staging          # staging env template (with production DB)
├── .next/                # build output
│   └── standalone/
│       └── server.js     # PM2 starts this
├── node_modules/
├── public/
├── prisma/
├── package.json
├── next.config.js
└── scripts/
    └── deploy-staging.sh
```

### 4.3 Start Staging PM2 Process

```bash
# SSH to Pi
ssh pi@192.168.0.38

cd /home/pi/staging
PORT=3010 pm2 start .next/standalone/server.js \
  --name montajimvar-staging \
  --max-memory-restart 512M
pm2 save

# Set up PM2 startup (one-time)
pm2 startup systemd -u pi --hp /home/pi
# (already set; PM2 saves to /home/pi/.pm2/dump.pm2)

# Verify
pm2 list | grep staging
# └── montajimvar-staging | fork | online | 22-60 MB | app v0.1.0
```

### 4.4 Health Check

```bash
# Local on Pi
curl -s http://localhost:3010/api/health
# Expected: {"status":"ok","timestamp":"...","service":"montajimvar","version":"0.1.0"}

# Through cloudflared + Cloudflare edge
curl -s https://staging.montajimvar.xyz/api/health
# Expected: same JSON, TLS via Cloudflare

# Production unaffected
curl -s https://test.montajimvar.xyz/api/health
# 200 — same JSON
```

---

## 5. Deploy Script — `scripts/deploy-staging.sh`

Runs on Pi when invoked by `deploy-staging.bat` (dev machine) or manually.

### 5.1 From Dev Machine (recommended)

```cmd
:: Windows (PowerShell / cmd)
.\deploy-staging.bat develop          :: default branch = develop
.\deploy-staging.bat main
.\deploy-staging.bat feat/my-branch
```

The .bat script:
1. Pings Pi (connectivity check)
2. `pscp` uploads: src, public, prisma, package.json, package-lock.json, next.config.js, tsconfig.json, postcss.config.mjs, deploy-staging.sh, `.env.staging` (if local exists)
3. `plink` invokes `bash deploy-staging.sh <branch>` on Pi

### 5.2 On Pi (invoked by .bat)

```bash
bash /home/pi/staging/deploy-staging.sh <branch>
```

The script:
1. Fetches and checks out `<branch>` (clones if first run)
2. Verifies `.env.staging` exists (errors if missing)
3. Sources `.env.staging` to apply env vars
4. `npm ci --omit=dev` — install production deps
5. `npx prisma generate` + `npx prisma migrate deploy` + `npx prisma db push`
6. `npm run build` — build standalone output
7. `pm2 delete montajimvar-staging` (if exists)
8. `pm2 start npm --name montajimvar-staging -- start -- --port 3010`
9. Polls `/api/health` up to 5 times (3s apart)
10. Reports success or fails with `pm2 logs` hint

---

## 6. Environment Variables (Staging)

`.env.staging` template is committed at `.env.staging.example`. Critical staging-only overrides:

| Variable | Staging Value | prod Value |
|---|---|---|
| `PORT` | `3010` | `3000` |
| `NEXTAUTH_URL` | `https://staging.montajimvar.xyz` | `https://test.montajimvar.xyz` |
| `NEXT_PUBLIC_APP_URL` | `https://staging.montajimvar.xyz` | `https://test.montajimvar.xyz` |
| `SENTRY_ENVIRONMENT` | `staging` | `production` |
| `DATABASE_URL` | (current: same as prod) | Neon prod DB |
| `NEXT_PUBLIC_SUPABASE_URL` | (current: same as prod) | prod Supabase |
| `NEXTAUTH_SECRET` | (current: same as prod) | prod secret |
| `GOOGLE_CLIENT_ID/SECRET` | (same as prod, **update OAuth redirect URI in Google Cloud Console to include staging URL**) | prod |

### Google OAuth Redirect URI

Add to Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client:
```
https://staging.montajimvar.xyz/api/auth/callback/google
```

---

## 7. Usage Workflow

```bash
# 1. Developer pushes to a feature/bugfix branch
git checkout -b feat/noaic-feature
git push origin feat/noaic-feature

# 2. Open PR targeting develop (or main) — CI runs (lint, typecheck, build, test)
# 3. Auto preview deploy via .github/workflows/preview.yml — PM2 on Pi port 3020-3099

# 4. Deploy to STAGING (manual, when branch could be tested on a more stable env)
.\deploy-staging.bat feat/noaic-feature
# → Result: https://staging.montajimvar.xyz running that branch
# → Database is shared with production (READ notes in §3)

# 5. QA verifies behavior on staging URL

# 6. Merge PR → main → automatic production deploy via .github/workflows/production.yml
# 7. Production deploy rolls staging forward — staging stays at the branch it was last set to
```

---

## 8. Cleanup & Reset

```bash
# Reset staging DB (WIPES — only when DATABASE_URL is staging-exclusive)
ssh pi@192.168.0.38
cd /home/pi/staging
export $(grep -v '^#' .env.staging | xargs)
npx prisma migrate reset --force

# Stop staging PM2 process
pm2 delete montajimvar-staging
pm2 save

# Remove staging dir entirely
ssh pi@192.168.0.38 "rm -rf /home/pi/staging"

# Remove Cloudflare DNS route (advanced)
# Go to Cloudflare Dashboard → DNS → delete CNAME staging.montajimvar.xyz
```

---

## 9. Verification: Tunnel & Processes

```bash
# Tunnel
ssh pi@192.168.0.38 "systemctl status cloudflared | head -5"

# PM2
ssh pi@192.168.0.38 "pm2 jlist | python3 -c 'import json,sys; [print(p[\"name\"], p[\"pm2_env\"].get(\"status\", \"?\"), p[\"pid\"]) for p in json.load(sys.stdin) if \"montajimvar\" in p[\"name\"] or p[\"name\"] in (\"linkedin-dashboard\",)]'"

# End-to-end
curl -fsS https://staging.montajimvar.xyz/api/health
curl -fsS https://test.montajimvar.xyz/api/health
```

---

## 10. Known Issues

1. **Cloudflare Universal SSL doesn't cover `*.test.montajimvar.xyz`** — only wildcard one level deep (`*.montajimvar.xyz`). For preview subdomain HTTPS, use Advanced Certificate Manager (free) or skip subdomain preview and use a path-based approach. See `PREVIEW_AUTOMATION.md`.

2. **Staging shares production DB (current state)** — staging test actions mutate real data. Read-only experiments fine; destructive tests (user signup, job creation) affect prod. Move to separate Neon branch when ready (§3).

3. **Google OAuth callback URL** — must include staging URL in Google Cloud Console → otherwise Google login will fail on staging.

---

*Last updated: 2026-07-17 • Sprint 11 • Verified: staging.montajimvar.xyz live*
