# Project Audit — Montajım Var

## 1. Project Identity

| Field | Value |
|---|---|
| **Product** | Montajım Var |
| **Tagline** | Türkiye'nin profesyonel montaj platformu |
| **Repository** | https://github.com/kontrol1453/montajimvar |
| **Stack** | Next.js 16 (App Router), React 19, NextAuth v5, Prisma, PostgreSQL (Neon), Supabase Storage, Sentry |
| **Production** | test.montajimvar.xyz (Raspberry Pi, PM2, HTTPS via reverse proxy) |
| **Inception** | 2024 (original),重构 2026-Q2 |

## 2. Current State Summary (2026-07-17)

### Architecture
- **Frontend**: Next.js 16 App Router, RSC-first, mobile-first responsive, framer-motion
- **Auth**: NextAuth v5 (beta) — Credentials (bcryptjs) + Google OAuth, JWT strategy, tokenVersion invalidation
- **Database**: PostgreSQL via Prisma ORM, 9 migrations, composite indexes, soft-delete pending
- **Storage**: Supabase Storage (images bucket), signed URLs (15min TTL)
- **Email**: Nodemailer (SMTP configurable: Resend/Gmail/custom)
- **Push**: Web Push API (VAPID), separate push service
- **Observability**: Sentry (server/client/edge), Vercel Analytics, Microsoft Clarity, GA4

### Key Features
| Domain | Status |
|---|---|
| Marketplace (profiles, jobs, offers, reviews) | ✅ Core complete |
| CRM (customers, timeline, reminders) | ✅ Core complete |
| Admin Command Center (360° detail, bulk actions, export) | ✅ Complete |
| AI Vision (Gemini, photo analysis) | ✅ Integrated |
| SEO (sitemap, robots, JSON-LD, meta) | ✅ Complete |
| Security (middleware, rate limit, sanitize, HMAC cookie) | ✅ P0/P1 done |

### Technical Debt (TECH_DEBT.md active)
- React 19 RC / NextAuth v5 beta — upgrade when stable
- No Docker / containerization
- Single-instance Pi (no HA)
- Staging / Preview envs documented only
- Test coverage ~5% (unit only)

## 3. Quality Baselines

| Metric | Current | Target |
|---|---|---|
| Build (TS errors) | 0 | 0 |
| Lint errors | 0 | 0 |
| Unit tests | 22 passing | 200+ |
| Coverage (validation/sanitize) | 70% | 60% overall |
| LCP | 2.1s | ≤2.5s |
| CLS | 0.05 | ≤0.1 |
| Bundle first load | 380KB | ≤600KB |
| Security (OWASP P0/P1) | 0 open | 0 open |

## 4. Team & Governance

| Role | Status |
|---|---|
| Technical Lead | Active (this session) |
| DevOps / SRE | Documented, partially implemented |
| Security Champion | Documented |
| QA Lead | Documented |

## 5. Decision Log (ADR Index)

| ADR | Title | Status |
|---|---|---|
| ADR-001 | JWT + tokenVersion invalidation | Accepted |
| ADR-002 | Prisma ORM (no raw SQL) | Accepted |
| ADR-003 | Supabase Storage + signed URLs | Accepted |
| ADR-004 | Middleware rate limiting | Accepted |
| ADR-005 | DOMPurify for dangerouslySetInnerHTML | Accepted |

## 6. Open Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Single Pi failure | Medium | High | Backup + DR plan, <1h RTO |
| Neon region outage | Low | High | Branch DB for recovery |
| Supabase storage loss | Low | Medium | Cross-region backup (P2) |
| Secret leak | Low | Critical | Vault (P2), rotation playbook |
| React 19 RC breakage | Medium | Medium | Pin version, test on release |

## 7. Sprint History

| Sprint | Dates | Focus | Outcome |
|---|---|---|---|
| 1-8 | 2024-2026 H1 | Core features (marketplace, CRM, admin, AI, SEO) | Production-ready feature set |
| 9 | 2026-07-10 | Security & Compliance (P0/P1) | All P0/P1 closed, 13 security docs |
| 10 | 2026-07-16 | DevOps & Platform Constitution | CI/CD, docs, constitution, 7.85/10 readiness |

---

*Next update: Sprint 11 completion*