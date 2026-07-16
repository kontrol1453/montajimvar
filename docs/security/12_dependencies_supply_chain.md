# Dependencies & Supply Chain

## npm audit

### Mevcut Durum (2026-07-16)

```
5 vulnerabilities (4 moderate, 1 high)
```

### Tarama

```bash
npm audit
```

| Tür | Sayı | Öneri |
|-----|------|-------|
| High | 1 | `npm audit fix` |
| Moderate | 4 | Review + `npm audit fix` |
| Low | 0 | — |
| Critical | 0 | — |

### `npm audit fix --force`

**Dikkat**: Breaking changes içerebilir. Commit + test sonrası çalıştır.

## Kritik Dependencies

| Package | Versiyon | Risk | Not |
|---------|----------|------|-----|
| `next` | 16.2.9 | ✓ | Stable |
| `react` | 19.0.0-rc | ⚠ RC | P2: stable'a geç |
| `next-auth` | beta (v5) | ⚠ Beta | P2: stable'a geç |
| `bcryptjs` | latest | ✓ | Pure JS, 12 rounds |
| `@prisma/client` | latest | ✓ | ORM |
| `@sentry/nextjs` | latest | ✓ | Error tracking |
| `zod` | latest | ✓ | Validation (yeni) |
| `isomorphic-dompurify` | latest | ✓ | HTML sanitize (yeni) |
| `framer-motion` | latest | ✓ | Animation |
| `sharp` | latest | ✓ | Image optimization |

## Dependency Yönetimi

### Lock File

- `package-lock.json` commit altında
- `npm ci` production deploy'da (deterministic install)

### Güncelleme Stratejisi

| Sıklık | İşlem |
|--------|-------|
| Haftalık | `npm audit` review |
| Aylık | `npm outdated` review |
| 3 aylık | Minor version bumps |
| 6 aylık | Major version bumps + test |

## SBOM (Software Bill of Materials) — P2

```bash
npm install -g @cyclonedx/cyclonedx-npm
cyclonedx-npm --output-file ./sbom.json
```

## Dependency Hardening — P2 Öneriler

| # | Madde | Öneri |
|---|-------|-------|
| 1 | React 19 RC → Stable | Stable release çıkınca |
| 2 | next-auth v5 beta → stable | Stable release çıkınca |
| 3 | `npm audit fix --force` | Breaking changes review |
| 4 | Renovate/Dependabot | Automated PR |
| 5 | Snyk/Socket.dev | Supply chain analizi |
| 6 | License audit | `npm-license-crawler` |
| 7 | Bundle size monitoring | `@next/bundle-analyzer` |
| 8 | Tree-shaking review | Unused dependencies cleanup |

## Script Security (P2)

`package.json` script'leri:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- **Pre/post hooks**: yok (güvenli)
- **Install scripts**: `sharp` native build — güvenilir

## Supply Chain Risk

| Risk | Azaltma |
|------|---------|
| Compromised package | `npm audit` + Snyk |
| Typosquatting | Lock file |
| Malicious update | Lock file + `npm ci` |
| License issue | License audit |
| Bundle bloat | Bundle analyzer |

## P2 Eylemler

- [ ] `npm audit fix --force` (test + commit sonrası)
- [ ] React 19 stable'a geçiş
- [ ] next-auth v5 stable'a geçiş
- [ ] Renovate/Dependabot kurulumu
- [ ] SBOM generation (CI'da)
- [ ] Snyk free tier integration
- [ ] `npm outdated` 3 aylık review
- [ ] Unused dependencies temizliği (`depcheck`)
