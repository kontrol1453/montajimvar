# Change Management — Montajım Var

Her sprint sonunda/implementation batch sonunda bu dosyalar updated:

| Dosya | İçerik |
|---|---|
| `CHANGELOG.md` | Yeni değişiklikler, breaking, fixes |
| `FILES_CHANGED.md` | Etkilenen dosya listesi |
| `QA_REPORT.md` | QA özeti, geçen/kalan testler |
| `TEST_RESULTS.md` | Coverage %, failing tests |
| `KNOWN_ISSUES.md` | Açık bug'lar, eksikler |
| `ROLLBACK_PLAN.md` | Rollback talimatları |
| `ARCHITECTURE_DECISIONS.md` | ADR'ler |

## CHANGELOG.md Template

```markdown
# Changelog

## [Unreleased]

### Added
- ...
### Changed
- ...
### Fixed
- ...
### Security
- ...
### Breaking
- ...

## [1.0.0] - 2026-07-17
...
```

## FILES_CHANGED.md Template

```markdown
# Files Changed — Sprint <X>

## Added
- src/middleware.ts
- src/lib/sanitize.ts
- src/lib/cookie-sign.ts
- docs/devops/*.md

## Modified
- src/lib/auth.ts (auth hardening)
- next.config.js (HSTS, CSP)

## Removed
- (none this sprint)
```

## QA_REPORT.md Template

```markdown
# QA Report — <sprint>

## Build
- TS errors: 0
- Lint errors: 0
- Build duration: 39s

## Tests
- Unit tests: X passing / Y total
- Coverage: Z%
- Integration: (P2)

## Security
- npm audit: 4 moderate, 1 high
- P0 fixed: 9
- P1 fixed: 14
- P2 fixed: 3 (session timeout, lockout, suspicious detection)

## Performance
- LCP: 2.1s (target ≤ 2.5s) ✅
- CLS: 0.05 (target ≤ 0.1) ✅
- Bundle first load: 380KB (target ≤ 600KB) ✅

## Accessibility
- WCAG AA: PASS
- Keyboard nav: PASS
- Screen reader: PASS

## Manual Smoke Tests
- [x] Homepage loads
- [x] Login flow
- [x] Job creation
- [x] Admin panel

## Known Issues
- See KNOWN_ISSUES.md
```

## TEST_RESULTS.md Template

```markdown
# Test Results — <date>

## Summary
- Total: 24 tests
- Passing: 24
- Failing: 0
- Skipped: 0
- Duration: 3.2s

## Coverage
| File | Lines | Funcs | Branch |
|---|---|---|---|
| src/lib/validation.ts | 100% | 100% | 92% |
| src/lib/sanitize.ts | 95% | 100% | 87% |
- Overall | 65% | 70% | 55% |

## Suites
- auth-validation.test.ts: 12 tests, 0 fail
- sanitization.test.ts: 9 tests, 0 fail
- smoke.test.ts: 3 tests, 0 fail
```

## KNOWN_ISSUES.md Template

```markdown
# Known Issues — <sprint>

## Active

### KI-001 — React 19 RC kullanılıyor
- **Priority**: P2
- **Date**: 2026-07-17
- **File**: package.json
- **Description**: React 19.2.3 RC, production için stable değil
- **Workaround**: None — RC çok kararlı ama yine de RC
- **Fix**: Stable çıkınca minor bump

### KI-002 — next-auth v5 beta
- **Priority**: P2
- ...
```

## ROLLBACK_PLAN.md Template

```markdown
# Rollback Plan — <sprint>

## Last good tag
- v0.1.0-presecurity (commit: ed8bfe9→77365f1 arası)

## Steps
1. `git checkout <last-good-tag>` (Pi'da)
2. `npm ci --omit=dev`
3. `npx prisma generate`
4. `pm2 reload montajimvar --update-env`
5. Verify: `curl /api/health` → 200

## Data Loss
- Bu rollback DB migration içermez → veri kaybı yok
- Account lockout fields DB'de kalır (nullable, eski app yine çalışır)

## Post-Rollback
- Sentry release annotation
- Post-mortem 24 saat içinde
```

## ARCHITECTURE_DECISIONS.md (ADR Index)

```markdown
# ADR Index

## ADR-001: JWT instead of DB sessions
- **Status**: Accepted
- **Date**: 2026-07-17
- **Context**: ...
- **Decision**: JWT strategy with tokenVersion invalidation
- **Consequences**: Fast, stateless, rol değişimi için DB check gerekir
```
