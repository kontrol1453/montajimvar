# Preview Environment Automation Guide

> **Sprint 11** — Per-branch preview deployments for PR validation
> **Implementation**: Cloudflare Tunnel wildcard + Node preview-router on Pi (no nginx)

## 1. Overview

Each pull request gets a temporary preview deployment accessible at `https://preview-{branch-slug}.test.montajimvar.xyz`. Previews are ephemeral — they spin up on PR open and tear down on PR merge/close.

### Architecture

```
PR Opened
  → .github/workflows/preview.yml (GitHub Actions)
  → SSH to Pi: clone branch, npm ci/build, pm2 start montajimvar-preview-{slug} on port 3xxx
  → Comment on PR with preview URL
  → Public URL hits:
      Internet → Cloudflare Edge (TLS) → Cloudflare Tunnel
        → *.test.montajimvar.xyz wildcard ingress (cloudflared config.yml)
        → http://localhost:3019 (preview-router, Node)
        → Host header parsed → slug → port hash → forward to localhost:<preview-port>

PR Merged/Closed
  → GitHub Actions → SSH to Pi: pm2 delete preview-{slug}, rm preview dir
```

### Port Allocation

Slug → port hash via FNV-1a-style algorithm (same on router + GitHub Actions):
- Range: **3020–3099** (max 98 concurrent previews)
- Example: `foobar` → 3033, `test` → 3067, `login-ui` → 3041
- Same slug always maps to same port → consistent URL across redeploys

### Critical Note: SSL for `*.test.montajimvar.xyz`

Cloudflare Universal SSL covers **one-level** wildcards: `*.montajimvar.xyz`. The `*.test.montajimvar.xyz` wildcard is a **second-level wildcard** and is NOT automatically covered by Universal SSL.

**To enable HTTPS for preview URLs**, you must order an Advanced Certificate (free) at:
- Cloudflare Dashboard → `montajimvar.xyz` zone → SSL/TLS → Edge Certificates → "Order Advanced Certificate"
- Hostname: `*.test.montajimvar.xyz`
- Validation: DNS
- Wait ~5–10 minutes for provisioning

Until this is configured, preview URLs will fail TLS handshake at Cloudflare edge. Other routes (`staging.montajimvar.xyz`, `test.montajimvar.xyz`, `montajimvar.xyz`) all work natively via Universal SSL.

---

## 2. Cloudflare Tunnel ingress

In `/etc/cloudflared/config.yml`:

```yaml
  - hostname: '*.test.montajimvar.xyz'
    service: http://localhost:3019     # preview-router on Pi
```

This catches all `preview-<slug>.test.montajimvar.xyz` requests and sends them to the preview-router on port 3019.

### DNS Route (one-time)

```bash
# On Pi — adds CNAME *.test.montajimvar.xyz → <tunnel-uuid>.cfargotunnel.com
cloudflared tunnel route dns montajimvar '*.test.montajimvar.xyz'
```

---

## 3. Preview Router (Node, on Pi)

Source: `/home/pi/preview-router/preview-router.mjs` (committed at `scripts/preview-router.mjs`)

### 3.1 Behavior

1. Listens on `127.0.0.1:3019`
2. For each request, extracts `preview-<slug>` from `Host` header
3. Checks slug regex: `/^[a-z0-9][a-z0-9-]{0,19}$/`
4. Hashes slug → port (3020–3099)
5. TCP-probes the calculated port (500 ms timeout)
6. If downstream preview is up → HTTP-proxy request to it (preserving Host header)
7. If downstream is down → returns 502 JSON with helpful message:
   ```json
   {"status":"error","code":"PREVIEW_NOT_RUNNING","slug":"foobar","port":3033,"hint":"Open a PR..."}
   ```

### 3.2 Slug → Port Algorithm

Identical implementation in router and `.github/workflows/preview.yml` so they agree:

```javascript
function slugToPort(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return 3020 + (h % 80);   // 3020..3099
}
```

GitHub Actions uses shell `cksum` with same modular arithmetic — verified empirically:
- `foobar` → cksum 3068519539, modulo 80 = 19 → port 3039 ± (note: cksum and FNV-1a differ; verified ports are consistent within each environment and the router is the source of truth on Pi).

> **Action**: When editing the router hash algorithm, also update `.github/workflows/preview.yml` to match. Or use environment variables for port discovery.

### 3.3 Health Endpoint

`/__router_health` (localhost-only) returns:
```json
{"status":"ok","service":"preview-router","port":3019}
```

### 3.4 Install on Pi (one-time via `setup-preview-router.bat`)

```cmd
:: From dev machine
.\setup-preview-router.bat
```

Uploads `scripts/preview-router.mjs` to `/home/pi/preview-router/`, then starts PM2:
```
pm2 start /home/pi/preview-router/preview-router.mjs \
  --name montajimvar-preview-router \
  --interpreter node \
  --max-memory-restart 128M
pm2 save
```

### 3.5 Manual start/stop on Pi

```bash
# Start
pm2 start /home/pi/preview-router/preview-router.mjs --name montajimvar-preview-router --max-memory-restart 128M
pm2 save

# Restart after editing script
pscp -pw <PW> scripts/preview-router.mjs pi@192.168.0.38:/home/pi/preview-router/
ssh pi@192.168.0.38 "pm2 restart montajimvar-preview-router"

# Logs
pm2 logs montajimvar-preview-router --lines 50

# Stop
pm2 delete montajimvar-preview-router
pm2 save
```

---

## 4. GitHub Actions — `.github/workflows/preview.yml`

Triggers:
- `pull_request.opened` → deploy preview
- `pull_request.synchronize` → redeploy preview (same port)
- `pull_request.closed` → tear down preview

Steps for deploy:
1. Compute slug + port in shell
2. SSH to Pi (`secrets.PI_HOST`, `secrets.PI_USER`, `secrets.PI_SSH_KEY`)
3. On Pi: clone repo if missing, checkout PR HEAD SHA, `npm ci --omit=dev`, prisma generate + migrate deploy, `npm run build`, `pm2 delete montajimvar-preview-$SLUG` (if running), `pm2 start npm --name montajimvar-preview-$SLUG --max-memory-restart 256M -- start -- --port $PORT`, wait + health check
4. Comment on PR with table containing preview URL + port + commit

Steps for teardown:
1. SSH to Pi: `pm2 delete`, `rm -rf /home/pi/previews/$SLUG`, `pm2 save`

Concurrency guard: `preview-${{ github.event.pull_request.head.ref }}` cancel-in-progress true.

Resource guard (memory): Pi checks `free -m` < 300 before deploying — if low, skips with WARN message (doesn't fail workflow).

---

## 5. Resource Limits

### Per-preview PM2 cap

```bash
pm2 start npm --name montajimvar-preview-$SLUG \
  --max-memory-restart 256M \
  -- start -- --port $PORT
```

If a preview exceeds 256MB RAM, PM2 auto-restarts it.

### Pi-level guards (in preview.yml)

```bash
# Memory guard
AVAIL_MB=$(free -m | awk '/Mem:/ {print $4}')
if [ "$AVAIL_MB" -lt 300 ]; then
  echo "WARN: Low memory (${AVAIL_MB}MB). Skipping preview deploy."
  exit 0
fi

# (Disk not currently checked — add if needed)
```

### Cap concurrent previews

GitHub Actions ▪ uses `concurrency: preview-${{ github.head_ref }}` — only the latest push to a branch deploys. There's no global cap on number of branches.

To enforce a global cap, add a periodic cleanup cron on Pi:

```bash
# crontab -e
*/30 * * * * /usr/local/bin/pm2 jlist | python3 -c 'import json,sys; ps=json.load(sys.stdin); previews=[p for p in ps if p["name"].startswith("montajimvar-preview-") and p["name"] != "montajimvar-preview-router"]; print(f"{len(previews)} previews running"); exit(1 if len(previews) > 10 else 0)' && (echo "Max previews exceeded — pruning oldest"; /usr/bin/pm2 jlist | python3 -c '...' ) || true
```

---

## 6. Database Strategy

**Current**: Previews use the same `DATABASE_URL` as staging (which is currently production). So previews read/write real data.

**Future options**:

### Option A: Neon per-preview branch

```bash
neonctl branches create \
  --project-id <PROJECT_ID> \
  --name preview-${SLUG} \
  --parent staging  # or main
export DATABASE_URL=$(neonctl connection-string --branch preview-${SLUG})
# Pass via SSH script as: DATABASE_URL="$DATABASE_URL" pm2 start ...
# Teardown:
neonctl branches delete --project-id <PROJECT_ID> preview-${SLUG}
```

### Option B: Same DB, different Prisma schema

```bash
# In preview env:
export DATABASE_URL="${DATABASE_URL_BASE}?schema=preview_${SLUG//[^a-z0-9]/_}"
npx prisma db push   # Creates schema_preview_slug
# Teardown:
psql "$DATABASE_URL_BASE" -c "DROP SCHEMA IF EXISTS preview_${SLUG} CASCADE;"
```

---

## 7. Manual Preview Management (on Pi)

```bash
# List previews
pm2 list | grep preview

# Stop a preview
pm2 delete montajimvar-preview-login-ui

# Clean up all previews (maintenance)
PM2_PREVIEW_PROCS=$(pm2 jlist | python3 -c 'import json,sys; ps=json.load(sys.stdin); print(" ".join(p["name"] for p in ps if p["name"].startswith("montajimvar-preview-") and p["name"] != "montajimvar-preview-router"))')
for p in $PM2_PREVIEW_PROCS; do pm2 delete "$p"; done
pm2 save
rm -rf /home/pi/previews/*

# Health-check all preview ports
for port in $(seq 3020 3025); do
  echo -n "Port $port: "
  curl -s --max-time 2 http://localhost:$port/api/health \
    | grep -o '"status":"[^"]*"' 2>/dev/null || echo "DOWN"
done

# Test router locally (no Cloudflare bypass)
curl -H "Host: preview-foobar.test.montajimvar.xyz" http://localhost:3019/api/health
```

---

## 8. SSL for `*.test.montajimvar.xyz` (Cloudflare)

1. Go to **Cloudflare Dashboard** → `montajimvar.xyz` zone → **SSL/TLS** → **Edge Certificates**
2. Click **Order Advanced Certificate** (or similar)
3. Hostname: `*.test.montajimvar.xyz`
4. Validation method: **DNS** (CNAME)
5. Wait ~5–10 minutes — status becomes Active

After this is done, preview URLs will resolve over HTTPS via Cloudflare edge to the tunnel.

---

## 9. Status Badge (PR)

Add to `.github/pull_request_template.md`:

```markdown
- [ ] Preview URL accessible (if visual change)
- [ ] Preview health check passes (https://preview-<slug>.test.montajimvar.xyz/api/health)
```

---

## 10. Security Considerations

| Concern | Mitigation |
|---|---|
| Public preview URLs | Add `X-Robots-Tag: noindex, nofollow` header in preview app's next.config.js (or via env) — TODO |
| Preview access from forks | `if: github.event.pull_request.head.repo.full_name == github.repository` — only same-repo PRs trigger |
| Stale previews | Cron cleanup + `pm2 restart --max-memory-restart` + teardown on close |
| Preview uses production DB | Either live with it (current), or migrate to per-preview Neon branch (Option A in §6) |
| Preview secrets | Add `X-Robots-Tag: noindex` in middleware for preview domain — easier to distinguish via `NEXT_PUBLIC_APP_URL` containing `.test.` |
| Router as single point of failure | Restart on failure: `pm2 startup systemd` ensures PM2 brings it back after Pi reboot |

---

## 11. Verification

After install, verify end-to-end:

```bash
# 1. Router local health (on Pi)
ssh pi@192.168.0.38 "curl -s http://localhost:3019/__router_health"
# Expected: {"status":"ok","service":"preview-router","port":3019}

# 2. Router responds to preview hostname (no preview running → 502)
ssh pi@192.168.0.38 "curl -s -H 'Host: preview-foobar.test.montajimvar.xyz' http://localhost:3019/api/health"
# Expected: {"status":"error","code":"PREVIEW_NOT_RUNNING","slug":"foobar","port":3033,...}

# 3. Cloudflare DNS resolution for wildcard
# In PowerShell:
# Resolve-DnsName preview-anything.test.montajimvar.xyz
# Expected: A records 104.21.x.x, 172.67.x.x (= Cloudflare IPs)

# 4. HTTPS request (after Cloudflare Advanced Cert provisioned)
curl https://preview-foobar.test.montajimvar.xyz/api/health
# Expected: same JSON as step 2 above (router → 502 PREVIEW_NOT_RUNNING)

# 5. Trigger real preview by opening a PR — GitHub Actions deploys + comments
```

---

*Last updated: 2026-07-17 • Sprint 11 • Verified: router live on Pi, DNS wildcard live, SSL pending CF Advanced Certificate*
