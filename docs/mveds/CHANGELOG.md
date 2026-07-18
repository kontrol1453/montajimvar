# Changelog — Montajım Var

## [Unreleased]

### Added
- DevOps foundation (Sprint 10): CI/CD workflows, vitest, health endpoint, Platform Constitution
- 17 DevOps docs + 13 Security docs + 9 MVEDS docs
- Preview/Staging/Production deployment specs
- Backup & Disaster Recovery plans
- Monitoring guide with SLI/SLO

### Changed
- `package.json`: added `test`, `typecheck`, `engines`, `.nvmrc`
- `src/lib/auth.ts`: session absolute timeout (24h), account lockout (5→15min), suspicious IP detection
- `src/middleware.ts`: rate limiting (auth 10/min, API 100/min), admin guard, security headers

### Fixed
- All `dangerouslySetInnerHTML` sanitized with DOMPurify
- Hardcoded secret fallbacks removed (env required)
- `hasPermission` fail-closed

### Security
- HMAC-signed Google OAuth role cookie
- CSP `frame-ancestors 'none'`, HSTS header
- zod validation on all auth endpoints

---

## [0.1.0] - 2026-07-16 (Security Sprint 9)

### Added
- 13 comprehensive security documents (`docs/security/00-13`)
- Middleware rate limiting
- DOMPurify sanitization
- HMAC cookie signing
- zod validation schemas

### Fixed
- P0: Hardcoded secret fallbacks (3 files)
- P0: `hasPermission` fail-open → fail-closed
- P0: `Math.random()` → `crypto.randomBytes()` (3 files)
- P1: Missing HSTS, CSP gaps, no rate limit, XSS via `dangerouslySetInnerHTML`
- P1: Google OAuth role cookie tamperable

---

## [0.0.9] - 2026-07-10 (Admin Command Center)

### Added
- Admin detail pages: Users, Companies, Jobs, Disputes, Certificates
- Bulk actions + row selection on all admin tables
- CSV export on all admin lists
- Column visibility toggle
- Row click navigation
- Keyboard shortcuts help (Shift+?)
- CopyButton + Sonner toaster integration

---

## [0.0.8] - 2026-07-05 (Admin Tables v2)

### Added
- Server-side pagination on job list
- Admin table component refactor

---

## [0.0.7] - 2026-06-28 (Admin Foundation)

### Added
- Admin layout + navigation
- Users/Companies/Jobs/Disputes list pages
- AdminTable component with sorting/filtering

---

## [0.0.6] - 2026-06-20 (AI Vision)

### Added
- Google Gemini Vision integration (photo analysis)
- AI security sanitization
- Vision analyzer service

---

## [0.0.5] - 2026-06-10 (CRM)

### Added
- Customer management (CRUD)
- Timeline events
- Reminders

---

## [0.0.4] - 2026-05-25 (Marketplace Core)

### Added
- Job creation + offers + reviews
- Messaging system
- Favorites
- Profile management

---

## [0.0.3] - 2026-05-10 (Auth & Profiles)

### Added
- NextAuth v5 (Credentials + Google OAuth)
- JWT strategy + tokenVersion invalidation
- Profile CRUD + image upload (Supabase)
- Email verification + password reset

---

## [0.0.2] - 2026-04-20 (Foundation)

### Added
- Next.js 16 App Router setup
- Prisma + Neon PostgreSQL
- Tailwind + Design System primitives
- Base layout + routing

---

## [0.0.1] - 2026-04-01 (Inception)

### Added
- Repository initialization
- Basic project structure