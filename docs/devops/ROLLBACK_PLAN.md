# Rollback Plan — Montajım Var Sprint #10

> Bu doküman, sprint sırasındaki değişikliklerin rollback sürecini tanımlar.

## 1. Last Known Good State

| Component | Last Good Version |
|---|---|
| Git commit | `77365f1` (security P2 hardening) — son başarılı deploy |
| Tag | `v0.1.0-pre-devops` (henüz yok — P0) |
| DB migration | Latest 9 migrations applied (https://test.montajimvar.xyz sağlıklı) |

## 2. What Changed in This Sprint (Risk-Assessed)

| Change | Risk | Rollback необходимость |
|---|---|---|
| `package.json` yeni scripts (`test`, `typecheck`, vb.) | Düşük | None — geri alınabilir |
| `.nvmrc` + `engines` | Düşük | None |
| `.github/workflows/ci.yml` | Düşük | Dosyayı sil |
| `.github/workflows/production.yml` | Düşük | Dosyayı sil |
| `vitest.config.ts` + `tests/` | Yok | `tests/` dizinini sil |
| `src/app/api/health/route.ts` | Çok düşük | Yeni route — silinebilir |
| `docs/mveds/`, `docs/devops/` | Yok | Silence sil |
- `package.json` devDependencies (vitest, testing-library) | Düşük | `npm install` revert |

## 3. Rollback Steps (Sprint Içeriği İçin)

```bash
# 1. Revert son commit
git revert HEAD --no-edit
# veya
git reset --hard HEAD~1

# 2. Reinstall deps (vitest eklenmiş olabilir)
npm ci

# 3. Build doğrula
npm run build

# 4. Deploy
.\deploy-local.bat
```

## 4. Rollback Triggers

Aşağıdakilerden biri olursa sprint rollback:

- ❌ `npm run build` 0 hata veremezse
- ❌ Test framework (vitest) çatışıyor → build bozulursa
- ❌ CI workflow hatalı → push'lar fail ediyorsa

## 5. Post-Rollback

1. Sentry annotation: "Rollback to <commit>"
2. Post-mortem 24 saat içinde
3. Sorumlu kişi ataması
4. Etkileyen kullanıcı sayısı tahmini

## 6. Data Impact

**Sprint rollback veri kaybına yol açMAZ**:
- Yeni API route (`/api/health`) — DB yazmaz
- Yeni test dosyaları — DB yazmaz
- Dokümanlar — DB yazmaz
- `.nvmrc`/`engines` — DB yazmaz

## 7. Continuous Backup Verification

Her release öncesi backup alınır (P2):
```bash
pg_dump "$DATABASE_URL" -F c -f "backups/pre-release-$(git rev-parse --short HEAD).dump"
```

Restore test (quarterly):
```bash
pg_restore -d "$STAGING_DB_URL" backups/pre-release-XXX.dump --clean --if-exists
```

## 8. Contact

| Rol | Sorumluluk |
|---|---|
| Release Manager | Rollback karar + iletişim |
| DevOps | Teknik uygulama |
| SRE | Monitoring doğrulama |
