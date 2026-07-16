# Release Process — Montajım Var

## 1. Release Vehicles

- **Scheduled release**: her 2-4 hafta (MINOR bump)
- **Hotfix**: §4
- **Patch**: ihtiyaç oldukça

## 2. Release Branch Flow

```
develop (PR'lerden biriken değişiklikler)
  ↓
git checkout -b release/v1.0.0 develop
  ↓
Bump package.json version
Update CHANGELOG.md
Final QA on staging
  ↓
PR release/v1.0.0 → main
  ↓
Merge to main
  ↓
git tag v1.0.0
git push origin v1.0.0
  ↓
CI triggers production.yml workflow
  ↓
Deploy + health check + smoke + GitHub Release
  ↓
Merge main back to develop
```

## 3. Pre-Release Checklist

Bu doküman Cross-ref: `docs/devops/PRODUCTION_CHECKLIST.md`

## 4. Hotfix Flow

```
main (v1.0.0) — production
  ↓ issue discovered
git checkout -b hotfix/auth-jwt-bug main
  ↓ fix + tests
git commit -m "fix(auth): handle expired JWT gracefully"
  ↓
PR → main + develop (paralel)
  ↓
Bump version 1.0.0 → 1.0.1
  ↓
git tag v1.0.1
  ↓
CI → production deploy
```

## 5. Release Notes (Auto)

GitHub Release'lerde "Generate release notes" kullanılır. Template:

```
## 🚀 What's New
...

## 🐛 Fixes
...

## 🔒 Security
...

## ⚠️ Breaking
...

## 📦 Migration
...

Thanks: @contributors
```

## 6. Release Manager Rotation

Her release bir Release Manager sorumluluğunda. RM:
- Tüm quality gate'leri doğrular
- Deploy'u tetikler
- Post-deploy health check
- Rollback kararı alır (gerekirse)

Her sprint RM'i rotaryasyon: ekibin her üyesi sırayla.

## 7. Communication

| Kanal | Mesaj | Zaman |
|---|---|---|
- Discord `#releases` | "🚀 Releasing v1.0.0" | Deploy öncesi |
- Discord `#releases` | "✅ v1.0.0 live" | Health check sonrası |
- Status page | Active maintenance window | Deploy anı |
- Email (VIP) | Release notes | 1 saat içinde |

## 8. Database Migration Coordination

1. **Risk-free migration** (add column, add table) → auto migrate deploy
2. **Risky migration** (drop column, rename) → 2-phase:
   - Phase 1: deploy app that supports both old & new schema
   - Phase 2: (next release) deploy migration after all old code gone

**Asla** prod DB'de backward-incompatible migration tek seferde.

## 9. Rollback Drill

Her 3 ay: rollback drill
1. Staging tagged release'i kırmak için test verisi gir
2. Rollback uygula
3. Verify: veri kaybı yok, app çalışır
4. `docs/devops/drills/<date>-rollback.md`
