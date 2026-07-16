# Secrets Management

## Mevcut Durum

### Environment Variables (.env)

| Secret | Kullanım | Rotation | Durum |
|--------|----------|----------|-------|
| `DATABASE_URL` | Neon Postgres | Yıllık | ✓ |
| `NEXTAUTH_SECRET` | JWT signing | 6 ay | ✓ (fallback kaldırıldı) |
| `REFRESH_TOKEN_SECRET` | Mobil refresh JWT | 6 ay | ✓ (fallback kaldırıldı) |
| `GOOGLE_CLIENT_ID` | Google OAuth | — | ✓ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | Google panel | ✓ |
| `SUPABASE_URL` | Storage | — | ✓ |
| `SUPABASE_ANON_KEY` | Storage (client) | — | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage (admin) | Per Supabase | ✓ |
| `SMTP_HOST` | Email | — | ✓ |
| `SMTP_USER` | Email | — | ✓ |
| `SMTP_PASS` | Email | Per SMTP provider | ✓ |
| `EMAIL_FROM` | Email | — | ✓ |
| `GEMINI_API_KEY` | AI vision | Per Google | ✓ |
| `SENTRY_DSN` | Error tracking | — | ✓ |
| `SENTRY_AUTH_TOKEN` | Sentry CLI | Per Sentry | ✓ |
| `NEXT_PUBLIC_APP_URL` | Public URL | — | ✓ |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push | — | ✓ |
| `VAPID_PRIVATE_KEY` | Push | — | ✓ |

### Git'te Olmayanlar

- `.env` `.gitignore`'da
- `.env.local` `.gitignore`'da
- Hiçbir secret commit geçmişinde yok

## Güvenlik İyileştirmeleri (Bu Sprint)

### Hardcoded Fallback'ler Kaldırıldı

| Dosya | Önce | Sonra |
|-------|------|-------|
| `src/lib/auth.ts` | `\|\| "montajimvar-gizli-anahtar-degistirin"` | Sadece env |
| `src/app/api/auth/refresh/route.ts` | `\|\| "montajimvar-refresh-secret"` | Sadece env |
| `src/app/api/auth/mobile-login/route.ts` | `\|\| "montajimvar-gizli-anahtar-degistirin"` | Sadeca env |

**Sonuç**: Environment değişkeni eksikse uygulama **başlatılamaz** (fail-fast).

### HMAC Cookie Signing

`src/lib/cookie-sign.ts` `NEXTAUTH_SECRET` kullanır — ayrı secret gerekmez.

### Non-null Assertions

`JWT_SECRET!` ve `REFRESH_SECRET!` ile TypeScript'a "her zaman tanımlı" garantisi.

## Secret Rotation

### Süreç

| Secret | Rotation Adımı | Etki |
|--------|---------------|------|
| `NEXTAUTH_SECRET` | 1. Yeni secret üret 2. .env güncelle 3. PM2 restart 4. Tüm kullanıcılar re-login | Tüm session'lar düşer |
| `REFRESH_TOKEN_SECRET` | 1. Yeni secret üret 2. .env güncelle 3. Restart 4. Mobil kullanıcılar re-login | Mobil token'lar invalid |
| `DATABASE_URL` | 1. Neon'da yeni credential 2. .env güncelle 3. Restart | Bağlantı refresh |
| `GOOGLE_CLIENT_SECRET` | 1. Google Console'da rotate 2. .env güncelle 3. Restart | OAuth users re-auth |
| `SUPABASE_SERVICE_ROLE_KEY` | 1. Supabase panel rotate 2. .env güncelle | Storage erişim refresh |
| `GEMINI_API_KEY` | 1. Google AI Studio rotate 2. .env güncelle | AI vision refresh |

### Üretim

```bash
# NEXTAUTH_SECRET üretimi
openssl rand -base64 32
# veya
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Secrets Pipeline

### Yerel Geliştirme

1. `.env.local` (geliştirici, `.gitignore`'da)
2. Paylaşılan `.env` (proje, `.gitignore`'da)

### Production (Raspberry Pi)

1. `deploy-local.bat` `.env`'i PSCP ile Pi'ye kopyalar
2. Pi'da `.env` `/home/pi/montajimvar/.env` konumunda
3. PM2 `env` olarak okur

**P2 risk**: Deploy sirasında `.env` network'te düz metin olarak transfer ediliyor (PSCP/SFTP). **Sinerji için SSH key-based auth** zaten var.

## P2 Öneriler

### Vault (HashiCorp Vault)

| Secret | Vault Path |
|--------|------------|
| `NEXTAUTH_SECRET` | `secret/montajimvar/auth/jwt` |
| `DATABASE_URL` | `secret/montajimvar/db/neon` |
| ... | ... |

### CI/CD Secrets

GitHub Actions / depolama:
- Repository secrets (encrypted)
- Environment secrets (per-env)

### Secret Scanning

```bash
# git-secrets veya trufflehog
trufflehog --regex --entropy .git
```

- [ ] Pre-commit hook: secret taraması
- [ ] Git history audit: secret leak kontrolü
- [ ] GitHub secret scanning (free for public repos)

## P2 Eylemler

- [ ] HashiCorp Vault (self-hosted) veya Doppler/AWS Secrets Manager
- [ ] Pre-commit hook (git-secrets/trufflehog)
- [ ] Secret rotation playbook (6 aylık periyodik)
- [ ] `.env` şifreli deploy (age/SOPS)
- [ ] GitHub secret scanning enable
- [ ] Secret leak incident plan
- [ ] NEXTAUTH_SECRET rotation test
