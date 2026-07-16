# Deployment Guide — Montajım Var

## 1. Environments

| Env | URL | DB | Storage | Auth |
|---|---|---|---|---|
| Local | http://localhost:3000 | NL Neon (shared dev) | Supabase (shared) | same secrets |
| Preview | https://preview-<branch>.test.montajimvar.xyz | shared dev | shared | shared secrets |
| Staging | https://staging.montajimvar.xyz | staging Neon | staging Supabase | separate secrets (P2) |
| Production | https://test.montajimvar.xyz | prod Neon | prod Supabase | prod secrets |

## 2. Deploy Mechanism

### Current (Manual via `deploy-local.bat`)
1. Build on dev machine (`npm run build`)
2. PSCP files to Pi
3. SSH exec `deploy-on-pi.sh` (npm ci, prisma generate, migrate, pm2 reload)

### Future (CI/CD via GitHub Actions)
1. Tag pushed (`v1.0.0`)
2. CI builds + tests
3. CI SSH into Pi, git pull + restart PM2
4. CI runs smoke tests
5. CI creates GitHub Release

## 3. Prerequisites

### On Pi
- Node 20.11+
- npm 10+
- PM2 installed globally
- SSH key for GitHub Actions deploy user
- Network access to Neon Postgres + Supabase

### On Dev Machine
- `plink` + `pscp` (PuTTY suite) for manual deploys
- SSH key (for future CI deploy)

## 4. Rollback Strategy

### Quick Rollback (PM2 symlink swap)
```bash
# On Pi
ls /home/pi/deploy/  # list available versions
rm /home/pi/montajimvar
ln -s /home/pi/deploy/montajimvar-<previous-commit> /home/pi/montajimvar
pm2 reload montajimvar
```

### DB Rollback (P2)
```bash
npx prisma migrate resolve --rolled-back <migration-name>
```

**Not**: Şu an DB migration rollback yok — `prisma migrate deploy` ileriye dönük. Bu yüzden her release öncesi backup zorunlu.

## 5. Health Check

After deploy, verify:
```bash
curl https://test.montajimvar.xyz/api/health
# Expected: {"status":"ok","timestamp":"...","service":"montajimvar","version":"0.1.0"}
```

## 6. Smoke Tests

```bash
# Public pages
curl https://test.montajimvar.xyz/  # homepage
curl https://test.montajimvar.xyz/blog
curl https://test.montajimvar.xyz/ara

# APIs
curl https://test.montajimvar.xyz/api/health
curl https://test.montajimvar.xyz/api/categories

# Auth (should be 401)
curl https://test.montajimvar.xyz/api/favorites

# Admin (should be 403 for non-admin)
curl https://test.montajimvar.xyz/api/admin/users
```

## 7. Monitoring Activation

After deploy:
- Verify Sentry received no new errors in last 5 min
- Verify Vercel Analytics receiving traffic
- Check `pm2 status` and `pm2 logs montajimvar --lines 50`
- Confirm `https://test.montajimvar.xyz/` loads in browser
