# Preview Environment Automation Guide

> **Sprint 11** — Per-branch preview deployments for PR validation

## 1. Overview

Each pull request gets a temporary preview deployment accessible at `https://preview-{branch-slug}.test.montajimvar.xyz`. Previews are ephemeral — they spin up on PR open and tear down on PR merge/close.

### Architecture

```
PR Opened → GitHub Actions → Build Docker image → Deploy to Pi (PM2, port 3002+)
         → Comment on PR with preview URL
PR Merged → GitHub Actions → Stop & delete preview PM2 process → Cleanup
```

### Port Allocation

Previews use ports 3002–3099 (max 98 concurrent previews). The port is derived from a hash of the branch name to ensure consistency across deploys.

---

## 2. GitHub Actions — Preview Workflow

### 2.1 .github/workflows/preview.yml

```yaml
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  preview:
    name: Preview (${{ github.event.action }})
    runs-on: ubuntu-latest
    if: github.event.pull_request.head.repo.full_name == github.repository
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4

      - name: Compute preview config
        id: config
        run: |
          BRANCH="${{ github.head_ref }}"
          # Sanitize branch name for subdomain
          SLUG=$(echo "$BRANCH" | tr -cd 'a-z0-9-' | tr 'A-Z' 'a-z' | head -c 20)
          if [ -z "$SLUG" ]; then SLUG="pr-${{ github.event.pull_request.number }}"; fi

          # Port: hash branch to 3002-3099
          PORT=$(( 3002 + $(echo "$SLUG" | cksum | cut -d' ' -f1) % 98 ))

          echo "slug=$SLUG" >> $GITHUB_OUTPUT
          echo "port=$PORT" >> $GITHUB_OUTPUT
          echo "process=montajimvar-preview-$SLUG" >> $GITHUB_OUTPUT

      - name: Deploy to Pi (on open/sync)
        if: github.event.action == 'opened' || github.event.action == 'synchronize'
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PI_HOST }}
          username: ${{ secrets.PI_USER }}
          key: ${{ secrets.PI_SSH_KEY }}
          script: |
            set -euo pipefail
            SLUG="${{ steps.config.outputs.slug }}"
            PORT="${{ steps.config.outputs.port }}"
            PROCESS="montajimvar-preview-$SLUG"
            APP_DIR="/home/pi/previews/$SLUG"

            echo "=== Preview Deploy: $SLUG on port $PORT ==="

            # Create preview directory
            mkdir -p $APP_DIR
            cd $APP_DIR

            # Clone or update
            if [ ! -d ".git" ]; then
              git clone https://github.com/kontrol1453/montajimvar.git .
            fi
            git fetch --all
            git checkout ${{ github.event.pull_request.head.sha }}

            # Install deps
            npm ci --omit=dev

            # Prisma
            npx prisma generate
            npx prisma migrate deploy

            # Build
            npm run build

            # Kill existing if running
            pm2 delete $PROCESS 2>/dev/null || true

            # Start with PM2
            pm2 start npm --name $PROCESS -- start -- --port $PORT
            pm2 save

            # Health check
            sleep 5
            curl -fsS http://localhost:$PORT/api/health || exit 1

            echo "Preview URL: https://preview-$SLUG.test.montajimvar.xyz"

      - name: Teardown preview (on close/merge)
        if: github.event.action == 'closed'
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PI_HOST }}
          username: ${{ secrets.PI_USER }}
          key: ${{ secrets.PI_SSH_KEY }}
          script: |
            set -euo pipefail
            SLUG="${{ steps.config.outputs.slug }}"
            PROCESS="montajimvar-preview-$SLUG"
            APP_DIR="/home/pi/previews/$SLUG"

            echo "=== Preview Teardown: $SLUG ==="
            pm2 delete $PROCESS 2>/dev/null || true
            pm2 save
            rm -rf $APP_DIR
            echo "Cleaned up $SLUG"

      - name: Comment on PR
        if: github.event.action == 'opened' || github.event.action == 'synchronize'
        uses: actions/github-script@v7
        with:
          script: |
            const slug = '${{ steps.config.outputs.slug }}';
            const port = '${{ steps.config.outputs.port }}';
            const url = `https://preview-${slug}.test.montajimvar.xyz`;

            const body = `## Preview Deployment
            
            | | |
            |---|---|
            | URL | ${url} |
            | Port | ${port} |
            | Commit | ${{ github.event.pull_request.head.sha }} |
            | Health | ${url}/api/health |
            
            Preview will auto-destroy when this PR is merged or closed.`;

            // Find existing preview comment
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            const existing = comments.data.find(c => c.body.includes('Preview Deployment'));
            
            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existing.id,
                body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body,
              });
            }
```

---

## 3. nginx Wildcard Configuration

### 3.1 Wildcard Server Block

```nginx
# /etc/nginx/sites-available/preview.test.montajimvar.xyz
server {
    listen 80;
    listen 443 ssl;
    server_name ~^preview-(?<branch>[a-z0-9-]+)\.test\.montajimvar\.xyz$;

    # Wildcard SSL cert (or Let's Encrypt wildcard)
    ssl_certificate /etc/letsencrypt/live/test.montajimvar.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.montajimvar.xyz/privkey.pem;

    # Compute port from branch slug using map
    # Port resolution is handled by a Lua script or map directive
    
    location / {
        # Default to port 3002; override per-branch as needed
        # For production, use a map or Lua to compute port from host
        proxy_pass http://127.0.0.1:3002;
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

### 3.2 Port Mapping via nginx map

```nginx
# In http block
map $host $preview_port {
    default 3002;
    ~^preview-login-ui\.  3003;
    ~^preview-payment\.   3004;
    ~^preview-blog-redesign\. 3005;
    # ... auto-generated or maintained manually
}

# In server block, use:
# proxy_pass http://127.0.0.1:$preview_port;
```

### 3.3 Enable

```bash
# Wildcard DNS
# *.test.montajimvar.xyz → <Pi public IP>

# Enable site
sudo ln -s /etc/nginx/sites-available/preview.test.montajimvar.xyz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Wildcard SSL
sudo certbot --nginx -d "*.test.montajimvar.xyz" --server https://acme-v02.api.letsencrypt.org/directory
```

---

## 4. DNS Configuration

| Record | Type | Value |
|---|---|---|
| *.test.montajimvar.xyz | A | <Pi public IP> |
| test.montajimvar.xyz | A | <Pi public IP> |

---

## 5. Database Strategy

### Option A: Shared Neon DB (Simple)

Previews connect to the staging Neon branch. Each preview uses the same schema but preview data is ephemeral and can be cleaned up via:

```bash
npx prisma migrate reset --force  # WARNING: resets staging DB
```

### Option B: Per-Preview Neon Branch (Isolated)

```bash
# Create per-PR Neon branch
neonctl branches create \
  --project-id <PROJECT_ID> \
  --name preview-${SLUG} \
  --parent staging

# Pass connection string as env var
export DATABASE_URL=$(neonctl connection-string --branch preview-${SLUG})

# Teardown
neonctl branches delete --project-id <PROJECT_ID> preview-${SLUG}
```

**Recommended**: Start with Option A for simplicity. Move to Option B when preview isolation becomes critical.

---

## 6. Resource Limits

```bash
# PM2 max memory per preview (256MB)
pm2 start npm --name preview-$SLUG \
  --max-memory-restart 256M \
  -- start -- --port $PORT

# Limit concurrent previews
# GitHub Actions: only 2 preview deploys in parallel
concurrency:
  group: preview-${{ github.head_ref }}
  cancel-in-progress: true
```

### Pi Resource Guard

```bash
# Check available memory before deploy
AVAIL_MB=$(free -m | awk '/Mem:/ {print $4}')
if [ "$AVAIL_MB" -lt 300 ]; then
  echo "Insufficient memory for preview (available: ${AVAIL_MB}MB)"
  exit 1
fi

# Check disk
AVAIL_DISK=$(df -m / | awk 'NR==2 {print $4}')
if [ "$AVAIL_DISK" -lt 500 ]; then
  echo "Insufficient disk for preview"
  exit 1
fi
```

---

## 7. Manual Preview Management

```bash
# List all preview processes
pm2 list | grep preview

# Stop a specific preview
pm2 delete montajimvar-preview-login-ui

# Cleanup all previews (maintenance)
pm2 list --no-colors | grep "preview-" | awk '{print $2}' | xargs -I{} pm2 delete {}
rm -rf /home/pi/previews/*

# Check preview health
for port in $(seq 3002 3010); do
  echo -n "Port $port: "
  curl -s --max-time 2 http://localhost:$port/api/health || echo "DOWN"
done
```

---

## 8. Alternative: Docker-based Previews

If PM2-based previews are too heavy on Pi resources:

```yaml
# docker-compose.preview.yml
services:
  preview:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    container_name: preview-${BRANCH_SLUG}
    environment:
      - NODE_ENV=preview
      - PORT=3000
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${PREVIEW_SECRET}
    ports:
      - "${PORT}:3000"
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
    profiles:
      - preview
```

```bash
# Deploy
docker-compose -f docker-compose.preview.yml \
  --profile preview \
  -e BRANCH_SLUG=$SLUG \
  -e PORT=$PORT \
  up -d

# Teardown
docker-compose -f docker-compose.preview.yml down -v
```

---

## 9. Security Considerations

| Concern | Mitigation |
|---|---|
| Preview uses staging DB | Staging DB reset regularly; no real user data |
| Preview URLs are public | Add `X-Robots-Tag: noindex` header |
| Preview uses production secrets | Use staging-only secrets for previews |
| Preview can exhaust Pi resources | Resource limits + concurrent deploy cap |
| Malicious branch code | Only trigger on same-repo PRs (no forks) |

---

## 10. Status Badge

Add to PR template:

```markdown
<!-- Preview status -->
![Preview](https://img.shields.io/endpoint?url=<preview-status-endpoint>)
```

---

*Last updated: 2026-07-17 • Sprint 11*
