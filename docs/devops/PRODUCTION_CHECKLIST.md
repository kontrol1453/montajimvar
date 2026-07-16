# Production Checklist — Montajım Var

> Bu listedeki tüm maddeler TAMAMLANMADAN production deploy YASAKTIR.

## Pre-Deploy (24 saat önce)

- [ ] **Backup alınmış** (`pg_dump` → backup)
- [ ] **Database migration** test edilmiş (staging'de apply edildi)
- [ ] **Feature branch** PR ile birleştirilmiş
- [ ] **Code review** tamamlanmış (en az 1 approval)
- [ ] **Build pass** — `npm run build` 0 hata
- [ ] **Lint pass** — `npm run lint` 0 hata
- [ ] **Typecheck pass** — `tsc --noEmit` 0 hata
- [ ] **Unit tests pass** — `npm run test:unit`
- [ ] **Security audit** — `npm audit` (high yakını değerlendirildi)
- [ ] **CHANGELOG.md** güncellenmiş
- [ ] **Migration notes** yazılmış
- [ ] **Breaking changes** dokümante
- [ ] **Rollback plan** hazır
- [ ] **User approval** alınmış

## Deploy (anında)

- [ ] **Kommit** tag'lenmiş: `v<x>.<y>.<z>`
- [ ] **GitHub Release** oluşturulmuş
- [ ] **CI workflow** tetiklenmiş
- [ ] **SSH deploy** başarılı (exit code 0)
- [ ] **PM2** online (`pm2 status`)
- [ ] **Health check** — `/api/health` 200 döndü
- [ ] **Smoke tests** — ana sayfalar + API'ler cevap verir

## Post-Deploy (5-30 dakika)

- [ ] **Sentry** — yeni hata yok (son 5 dak)
- [ ] **Vercel Analytics** — traffic geliyor
- [ ] **DB** — `prisma migrate status` clean
- [ ] **Logs** — `pm2 logs montajimvar --lines 50` hata içermez
- [ ] **Login** — manuel test (test user)
- [ ] **Admin panel** — ulaşılabilir
- [ ] **Critical path** — kullanıcı akışı manuel test
- [ ] **Slack/Discord** release notify

## Rollback Triggers

Aşağıdakilerden herhangi biri → ANINDA rollback:

- ❌ Sentry'de kritik hata patlaması (>10/dak)
- ❌ Health check 500 vermeye başlar
- ❌ Login akışı kırılır
- ❌ Ana sayfa boş beyaz ekran
- ❌ DB connection errors
- ❌ Memory leak (PM2 restart >10/dak)

## Rollback Process

```bash
# 1. Tag'ı bul
git tag --list 'v*'

# 2. Pi'da rollback
ssh pi@192.168.0.38
cd /home/pi/montajimvar
git fetch --all
git checkout v<previous-release>
npm ci --omit=dev
npx prisma migrate deploy  # downstream migrations (P2)
pm2 reload montajimvar --update-env

# 3. Sentry release annotation
sentry-cli releases new montajimvar@v<previous-release>
sentry-cli releases set-commits --commit "kontrol1453/montajimvar@v<previous-release>" montajimvar@v<previous-release>

# 4. Notify
# Discord: "Rollback applied to v<previous>. Investigating v<failed>."

# 5. Post-mortem 24 saat içinde
```

## Quality Gate Summary

| Gate | Tool | Required | Min |
|---|---|---|---|
| Build | `next build` | ✅ | 0 errors |
| Lint | `eslint` | ✅ | 0 errors |
| Typecheck | `tsc --noEmit` | ✅ | 0 errors |
| Unit tests | `vitest` | ✅ | passing |
| Coverage | `vitest --coverage` | ⚠ advisor | 60% |
| Security | `npm audit` | ⚠ advisor | no critical |
| Bundle size | `@next/bundle-analyzer` | ⚠ advisor | ≤600KB |
| Lighthouse | `@lhci/cli` (P2) | ⚠ advisor | ≥85 |
