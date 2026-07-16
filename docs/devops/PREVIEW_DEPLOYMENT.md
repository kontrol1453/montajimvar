# Preview Deployment — Montajım Var

Her feature branch için izole Preview/Test ortamı.

## 1. URL Pattern

```
preview-<branch-slug>.test.montajimvar.xyz
```

Örnekler:
- `feature/security-middleware` → `preview-security-middleware.test.montajimvar.xyz`
- `feature/admin-crm-export` → `preview-admin-crm-export.test.montajimvar.xyz`
- `hotfix/auth-jwt-bug` → `preview-auth-jwt-bug.test.montajimvar.xyz`

## 2. Allocation

### Local Pi Allocation (Current)

Pi'da kaynak kısıtlı — aynı anda en fazla 3 preview çalıştırılabilir (port 3101-3199).

```bash
# Create preview instance
ssh pi@192.168.0.38 <<EOF
  cd /home/pi/previews
  git clone <feature-branch-url> preview-<slug>
  cd preview-<slug>
  npm ci --omit=dev
  PORT=31<NN> pm2 start npm --name "preview-<slug>" -- start
EOF
```

### Reverse Proxy (nginx/Pi)

```nginx
server {
  listen 80;
  server_name ~^preview-(?<slug>.+)\.test\.montajimvar\.xyz$;
  location / {
    proxy_pass http://localhost:31<NN>;
  }
}
```

## 3. Auto-Cleanup

Tüm preview'lar **7 gün** sonra otomatik silinir. Uzatma için `expiry.json` ekleyin.

```bash
# Cron (her gece 03:00)
0 3 * * * /home/pi/scripts/preview-cleanup.sh
```

## 4. Database Sharing

Preview'lar **staging DB**'yi paylaşır (P2). Her preview seed eder:
```bash
npm run seed:staging  # idempotent, clean state
```

## 5. Secrets

Preview'lar `.env.preview` kullanır (staging secret'ları, prod DB değil).

## 6. Workflow Status Updates

GitHub Actions PR'a comment ekler:
- "Preview URL: https://preview-..."
- "Status: live (expires in 7 days)"

## 7. Current Status

**P2 Backlog**: şu an preview ortamı yok. Manuel deploy ile test ediliyor.

Acil çözüm:
- Her feature branch `npm run build` sonra `npm run start` ikinci bir Pi veya port
- Veya ngrok tunnel: `ngrok http 3000` → geçici URL

## 8. DoD Requirement

**Definition of Done** için preview URL zorunlu. Preview olmadan merge YASAK.
