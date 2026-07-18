# Montajım Var — Sprint Roadmap

> **Timeline:** 20 weeks (10 sprints × 2 weeks)
> **Start Date:** 2026-07-21
> **End Date:** 2026-11-27
> **Stack:** Next.js 16 + React 19 + Tailwind 4 + Prisma + PostgreSQL + NextAuth v4
> **Platform:** SaaS marketplace (web + PWA) with Expo mobile client

---

## Sprint 1: Foundation Fix

**Duration:** 2 weeks (2026-07-21 → 2026-08-01)
**Theme:** Patch the roof before decorating the house
**Goal:** Eliminate critical stability, security, and code-quality blocking issues

**Objectives:**
- Centralize route protection via `middleware.ts` — eliminate distributed auth checks
- Add Zod validation library and schemas for all forms
- Fix CSS token inconsistency (remove legacy dark classes, unify design tokens)
- Remove `console.log` statements from production auth and email code paths
- Add React error boundaries to all public route segments
- Replace hardcoded `NEXTAUTH_SECRET` fallback with env-only configuration

**Key Deliverables:**
- `src/middleware.ts` — centralized route protection with role-based access
- `src/lib/validations/` — Zod schemas for auth, job, profile, payment forms
- `src/app/(public)/error.tsx` — global error boundary for public routes
- Updated `globals.css` — removed `bg-dark-*`, `text-dark-*` legacy classes
- Updated `src/lib/auth.ts` — structured logging, no console.log, env-only secret
- `src/app/admin/error.tsx` + segment-level error boundaries

**Risks:**
- Middleware may conflict with existing ad-hoc auth patterns — need careful rollback plan
- CSS migration may cause visual regressions on pages not in active testing
- Removing `console.log` could hide debugging info needed for production issues

**Dependencies:** None (foundation sprint)

**Success Criteria:**
- `middleware.ts` covers all protected routes with ≤ 3 auth check patterns (down from 20+)
- Zero `console.log` statements in `src/lib/auth.ts` and `src/lib/email.ts`
- All page forms use Zod schemas for validation
- Legacy CSS classes reduced to zero in page components
- `error.tsx` files exist at root, admin, and dashboard route segments

**Backlog Items:** CRIT-2 (middleware), HIGH-2 (form validation), HIGH-5 (error boundaries), HIGH-6 (CSS consolidation), HIGH-7 (console logs), MED-2 (legacy classes), MED-3 (admin tokens), MED-4 (inline styles)

**Team:** 1 full-stack engineer, 1 frontend engineer

---

## Sprint 2: Payment & Email

**Duration:** 2 weeks (2026-08-04 → 2026-08-15)
**Theme:** Make the platform revenue-ready
**Goal:** Replace mock payment provider with real Iyzico integration and production email

**Objectives:**
- Integrate Iyzico (or PayTR) payment gateway for Turkish market
- Configure production SMTP with Nodemailer + react-email templates
- Build complete escrow payment flow (charge → hold → release → refund)
- Implement payment webhook handling with signature verification
- Generate PDF invoices for completed payments
- Add email queue with retry logic for transactional emails

**Key Deliverables:**
- `src/lib/payment/providers/iyzico.ts` — Iyzico provider implementation
- `src/lib/payment/index.ts` — refactored payment abstraction with real provider
- `src/app/api/webhooks/iyzico/route.ts` — webhook handler with HMAC verification
- `src/emails/` — react-email templates (welcome, verification, payment receipt, invoice)
- `src/lib/email/queue.ts` — Bull/bull-board compatible email queue
- `src/app/dashboard/faturalar/` — invoice listing and download pages
- `src/lib/payment/escrow.ts` — escrow release/refund business logic

**Risks:**
- Iyzico API changes or sandbox instability during integration
- Payment workflow complexity — escrow, release, refund edge cases
- Webhook reliability — missed webhooks mean inconsistent payment state
- SMTP deliverability — emails marked as spam if domain reputation is low

**Dependencies:** Sprint 1 (stable auth middleware, error boundaries for payment pages, Zod validation for payment forms)

**Success Criteria:**
- End-to-end payment flow works in sandbox: charge → hold → release
- Webhook handler processes success/failure/refund events with idempotency
- Invoice PDF generates correctly for completed payments
- Transactional emails deliver within 30 seconds of trigger
- Email queue retries failed sends up to 3 times with exponential backoff

**Backlog Items:** CRIT-3 (mock payment provider), MED-5 (hardcoded commission rate), FEATURE_STATUS #7 (payments), FEATURE_STATUS #18 (email system), FEATURE_STATUS #29 (subscriptions)

**Team:** 2 full-stack engineers, 1 DevOps engineer (SMTP/webhook config)

---

## Sprint 3: Testing Infrastructure

**Duration:** 2 weeks (2026-08-18 → 2026-08-29)
**Theme:** Build the safety net
**Goal:** Establish comprehensive test infrastructure covering critical paths

**Objectives:**
- Configure Vitest + React Testing Library for unit/component tests
- Configure Playwright for E2E tests
- Write unit tests for all `src/lib/` utility functions
- Write integration tests for auth, search, job creation, payment API routes
- Write E2E tests for critical user flows
- Add CI pipeline (GitHub Actions) with automated test runs

**Key Deliverables:**
- `vitest.config.ts` — Vitest configuration with path aliases, coverage thresholds
- `playwright.config.ts` — Playwright configuration with auth state persistence
- `src/lib/__tests__/` — unit tests for permissions, price-analyzer, admin-audit, validations
- `src/app/api/__tests__/` — API route integration tests
- `e2e/` — Playwright test suite (auth, search, job creation, messaging, admin CRUD)
- `.github/workflows/test.yml` — CI pipeline with parallel test runners
- `src/components/__tests__/` — component tests for Button, DataTable, Navbar, SearchForm

**Risks:**
- Test setup time may be underestimated — mocking Prisma + NextAuth requires careful configuration
- Flaky E2E tests due to timing/async issues in CI environment
- No existing test patterns in codebase — team must learn and establish conventions
- CI pipeline may hit free-tier GitHub Actions limits

**Dependencies:** Sprint 1 (Zod schemas provide deterministic validation targets; middleware provides stable auth patterns)

**Success Criteria:**
- Test suite achieves ≥ 60% line coverage on `src/lib/`
- All critical API routes have at least one happy-path + one error-path test
- 5 E2E flows passing consistently in CI (registration, login, job creation, search, payment)
- CI pipeline runs all tests in < 10 minutes
- `npm test` passes with zero failures before any merge

**Backlog Items:** CRIT-1 (zero test coverage), HIGH-3 (API client — needed for testability), FEATURE_STATUS #40 (tests)

**Team:** 1 full-stack engineer (test infrastructure), 1 QA engineer (test writing)

---

## Sprint 4: Dashboard & Data

**Duration:** 2 weeks (2026-09-01 → 2026-09-12)
**Theme:** Make every number real
**Goal:** Replace all placeholder/mock data with live database queries and real-time analytics

**Objectives:**
- Replace hardcoded dashboard stats with real Prisma aggregate queries
- Build analytics service layer with caching for dashboard/CRM metrics
- Fix notification badge counts with real unread query logic
- Add time-series data for dashboard charts (recharts integration)
- Implement role-specific dashboard views (CUSTOMER vs ASSEMBLER vs ADMIN)
- Replace hardcoded role strings with centralized Role enum

**Key Deliverables:**
- `src/services/analytics.ts` — analytics service with aggregated queries and Redis/Next.js cache
- `src/services/dashboard.ts` — per-role dashboard data service
- `src/app/dashboard/page.tsx` — refactored with real data, role-specific rendering
- `src/lib/constants.ts` — centralized Role enum, page sizes, commission rate
- `src/components/dashboard/` — split DashboardStats, DashboardActivity, DashboardQuickActions
- Updated `NotificationBell.tsx` — real unread count from DB
- Recharts integration for time-series charts (income, job volume, profile views)

**Risks:**
- Real-time dashboard queries may cause database load — need query optimization and caching
- Some data fields may not exist yet in the schema — may need schema migrations mid-sprint
- Performance of aggregate queries on large datasets (100k+ rows) is unknown

**Dependencies:** Sprint 2 (payment data needed for income stats), Sprint 3 (tests verify data correctness)

**Success Criteria:**
- Zero hardcoded mock values remain in dashboard pages
- Dashboard loads in < 2 seconds with real data (with caching)
- Notification badge shows correct unread count (verified against DB)
- Role-specific dashboards show only relevant sections
- Analytics service covers: income, job volume, user growth, conversion funnel

**Backlog Items:** MED-1 (monolithic components — Dashboard refactor), MED-5 (hardcoded values), MED-4 (inline styles in dashboard), FEATURE_STATUS #8 (dashboard), FEATURE_STATUS #19 (analytics)

**Team:** 2 full-stack engineers

---

## Sprint 5: Search & Discovery

**Duration:** 2 weeks (2026-09-15 → 2026-09-26)
**Theme:** Help users find what they need
**Goal:** Deliver enterprise-grade search with full-text indexing, autocomplete, and map-based discovery

**Objectives:**
- Implement PostgreSQL full-text search (tsvector/tsquery) replacing `contains` + `mode: insensitive`
- Add debounced autocomplete with recent searches and trending categories
- Implement map-based filtering — re-fetch results when map bounds change
- Add saved searches and email/push alerts when matching jobs/profiles appear
- Optimize search page performance with React.cache, streaming, and ISR
- Add breadcrumb structured data to search results

**Key Deliverables:**
- `prisma/migrations/` — full-text search index on Profile and Job tables
- `src/services/search.ts` — search service with FTS queries, filters, pagination
- `src/app/(public)/ara/page.tsx` — refactored with debounced autocomplete, map re-fetch
- `src/components/search/SearchAutocomplete.tsx` — debounced autocomplete dropdown
- `src/components/search/SavedSearchButton.tsx` — save search UI
- `src/app/api/search/alerts/route.ts` — saved search alert API
- `src/app/api/search/suggestions/route.ts` — autocomplete suggestions API
- `src/lib/search-index.ts` — background job to maintain search index

**Risks:**
- Full-text search performance may degrade without proper indexing strategy
- Turkish language stemming/lexemes need special PostgreSQL configuration
- Map-based filtering adds complexity to search query construction
- Saved search alerts could generate excessive notification volume

**Dependencies:** Sprint 1 (Zod for search filter validation), Sprint 4 (real data in profiles/jobs)

**Success Criteria:**
- Full-text search returns results in < 500ms for 10k+ profiles
- Autocomplete responds within 200ms of user typing (debounced 300ms)
- Map bounds filtering returns results in < 1s
- Saved search alerts trigger within 5 minutes of matching data appearing
- Search page Lighthouse performance score ≥ 85

**Backlog Items:** FEATURE_STATUS #3 (search), FEATURE_STATUS #21 (map features), FEATURE_STATUS #23 (SEO — structured data)

**Team:** 1 full-stack engineer, 1 backend engineer (PostgreSQL FTS expertise)

---

## Sprint 6: Messaging & Notifications

**Duration:** 2 weeks (2026-09-29 → 2026-10-10)
**Theme:** Real-time communication across the platform
**Goal:** Replace page-refresh messaging with real-time chat and comprehensive notification system

**Objectives:**
- Implement real-time messaging via Supabase Realtime or WebSockets
- Build in-app notification center with read/unread/timestamp
- Wire business events (new offer, job status change, payment) to push notifications
- Add email notification triggers for off-line users
- Support message attachments (images, files) with Supabase storage
- Add typing indicators and message search

**Key Deliverables:**
- `src/lib/realtime.ts` — Supabase Realtime / WebSocket client for messaging
- `src/app/(public)/mesajlar/page.tsx` — real-time message list with auto-update
- `src/app/(public)/mesajlar/[id]/page.tsx` — real-time conversation view
- `src/components/messaging/MessageInput.tsx` — with file attachment support
- `src/components/messaging/TypingIndicator.tsx` — typing status
- `src/components/notifications/NotificationCenter.tsx` — in-app notification dropdown
- `src/lib/notifications/triggers.ts` — business event → notification mapping
- `src/app/api/upload/message/route.ts` — message file upload endpoint

**Risks:**
- Supabase Realtime may have connection limits on the free tier — need monitoring
- Real-time messaging introduces state synchronization complexity
- Push notification delivery reliability on iOS/Android varies
- Message attachments need file size limits and virus scanning

**Dependencies:** Sprint 2 (email system for notification triggers), Sprint 4 (real notification data)

**Success Criteria:**
- Messages appear in real-time (≤ 1s latency) without page refresh
- In-app notification center shows correct unread count across all notification types
- Business events trigger appropriate push/email notifications within 30 seconds
- Message attachments upload successfully (max 10MB, image/pdf/document types)
- Typing indicators show within 500ms of partner typing

**Backlog Items:** FEATURE_STATUS #6 (messaging), FEATURE_STATUS #17 (push notifications), FEATURE_STATUS #28 (file uploads)

**Team:** 2 full-stack engineers, 1 DevOps (WebSocket infrastructure)

---

## Sprint 7: Admin Evolution

**Duration:** 2 weeks (2026-10-13 → 2026-10-24)
**Theme:** Empower the platform operators
**Goal:** Complete the admin panel with analytics, CRM, data export, and bulk operations

**Objectives:**
- Build admin analytics dashboard with charts, trends, and exportable reports
- Add CSV/Excel data export for all admin entity tables
- Implement bulk operations (select → action) for users, jobs, companies
- Add admin notification preferences and alert configuration
- Enhance audit log dashboard with filtering, date range, and export
- Wire `hasPermission()` into all admin routes — enforce RBAC

**Key Deliverables:**
- `src/app/admin/analytics/page.tsx` — analytics dashboard with Recharts visualizations
- `src/lib/admin/export.ts` — CSV/Excel export service for all admin entities
- `src/app/admin/kullanicilar/page.tsx` — with bulk select → action (suspend, verify, delete)
- `src/app/admin/isler/page.tsx` — with bulk operations
- `src/app/admin/komuta-merkezi/` — enhanced command center with live metrics
- `src/lib/permissions/enforcer.ts` — middleware-level permission checking
- `src/app/admin/audit-logs/page.tsx` — with date range, action type, entity filters
- `src/app/admin/bildirim/page.tsx` — admin notification preferences

**Risks:**
- Bulk operations without proper transaction handling could cause data corruption
- Data export of large datasets could timeout API routes
- Admin analytics queries may be expensive — need caching and query optimization
- Permission enforcement could break existing admin workflows if misconfigured

**Dependencies:** Sprint 3 (tests verify admin changes), Sprint 4 (analytics service layer), Sprint 6 (notification triggers)

**Success Criteria:**
- Admin analytics page loads in < 3 seconds with pre-cached data
- CSV export of 10k+ rows completes in < 10 seconds
- Bulk operations process correctly with rollback on failure
- `hasPermission()` enforced on all admin API routes (deny by default)
- Audit log supports filter, date range, and export

**Backlog Items:** CRIT-4 / FEATURE_STATUS #35 (permissions enforcement), FEATURE_STATUS #12 (admin panel), FEATURE_STATUS #13 (admin components), FEATURE_STATUS #34 (audit logging)

**Team:** 1 full-stack engineer, 1 frontend engineer (dashboard/analytics UI)

---

## Sprint 8: Performance & SEO

**Duration:** 2 weeks (2026-10-27 → 2026-11-07)
**Theme:** Lay the growth foundation
**Goal:** Optimize Core Web Vitals, implement structured data, and establish performance budgets

**Objectives:**
- Implement `next/font` for Google Fonts with preload and display swap
- Add `next/image` optimization for all user-uploaded and static images
- Implement Incremental Static Regeneration (ISR) for blog posts and city pages
- Add JSON-LD structured data (BreadcrumbList, LocalBusiness, Article, FAQ) to all pages
- Add Twitter Cards and OpenGraph improvements
- Set up performance budget with Lighthouse CI
- Add loading states and Suspense boundaries to all slow-loading pages

**Key Deliverables:**
- Updated `src/app/layout.tsx` — next/font integration with proper preloading
- `src/components/ui/OptimizedImage.tsx` — next/image wrapper with fallback
- `src/app/(public)/blog/[slug]/page.tsx` — ISR with `revalidate: 3600`
- `src/app/(public)/sehir/[city]/page.tsx` — ISR with `revalidate: 86400`
- `src/lib/seo/structured-data.ts` — JSON-LD generators for all schema types
- Updated `src/app/layout.tsx` — BreadcrumbList, WebSite, Organization schemas
- `src/app/(public)/blog/page.tsx` — Article schema per post
- Updated `next.config.js` — image domains, performance headers
- `.github/workflows/lighthouse.yml` — Lighthouse CI with performance budgets
- Added `loading.tsx` and `Suspense` boundaries to dashboard, profile, and search pages

**Risks:**
- next/image optimization for user-uploaded images requires proper remote pattern config
- ISR on dynamically generated city pages may not trigger correctly
- Structured data errors could cause Google Search Console warnings
- Performance budgets may be initially failing — need realistic baselines

**Dependencies:** Sprint 4 (real data in blog/city pages), Sprint 5 (search performance baseline)

**Success Criteria:**
- Lighthouse Performance score ≥ 90 for homepage, blog, and city pages
- First Contentful Paint (FCP) < 1.5s on mobile 3G simulated
- All pages have BreadcrumbList structured data
- Blog and city pages serve from ISR cache (stale-while-revalidate)
- Image optimization reduces total page weight by ≥ 40%
- Lighthouse CI passes against established budgets in CI

**Backlog Items:** FEATURE_STATUS #23 (SEO), FEATURE_STATUS #14 (blog), FEATURE_STATUS #15 (city pages), FEATURE_STATUS #38 (loading states), FEATURE_STATUS #39 (error handling)

**Team:** 1 frontend engineer (performance), 1 full-stack engineer (ISR/structured data)

---

## Sprint 9: Mobile & PWA

**Duration:** 2 weeks (2026-11-10 → 2026-11-21)
**Theme:** Take the platform everywhere
**Goal:** Bridge the gap between web PWA and native mobile experience

**Objectives:**
- Complete mobile API bridge — ensure all mobile API endpoints are production-ready
- Polish mobile app UI with native-feel animations and navigation
- Upgrade PWA with background sync for offline actions
- Harden push notification service for production scale
- Add offline support for critical read operations (profile viewing, message reading)
- Implement periodic background sync for data freshness

**Key Deliverables:**
- `mobile/` — updated Expo app with real data fetching (search, profiles, jobs, messages)
- `mobile/src/screens/` — company detail, job creation, messaging screens
- `public/sw.js` — updated service worker with Workbox
- Background sync registration for offline job creation and message sending
- `src/app/api/mobile/` — mobile-optimized API endpoints with reduced payload
- Push notification service hardening (subscription cleanup, rate limiting, delivery tracking)
- PWA install prompt improvements (custom install UI, deferred prompt)
- Offline fallback pages with cached content

**Risks:**
- Expo SDK 56 + React Native 0.85 are very new — may have breaking changes or undocumented issues
- iOS push notification delivery requires Apple Developer Program membership and APNs setup
- Background sync API has limited browser support (Chromium only)
- Mobile app store review timeline unpredictable (App Store: 1-3 days, Google Play: Same day)
- Service worker updates may cause client-side caching issues

**Dependencies:** Sprint 2 (payment API stable for mobile), Sprint 6 (messaging API complete), Sprint 8 (optimized image endpoints for mobile bandwidth)

**Success Criteria:**
- Mobile app builds successfully for both iOS and Android
- 5 core screens functional: Home, Search, Profile, Messages, Job Creation
- PWA passes all Lighthouse PWA audit checks (installable, offline, fast)
- Push notifications deliver with ≥ 95% success rate
- Background sync queues offline actions and replays on connectivity
- Service worker cache strategy is versioned and auto-cleanup works

**Backlog Items:** FEATURE_STATUS #25 (mobile app), FEATURE_STATUS #16 (PWA), FEATURE_STATUS #17 (push notifications)

**Team:** 1 React Native engineer, 1 full-stack engineer (API bridge), 1 DevOps (push notification infrastructure)

---

## Sprint 10: Production Launch

**Duration:** 2 weeks (2026-11-24 → 2026-12-05)
**Theme:** Ship with confidence
**Goal:** Final security audit, load testing, monitoring, and launch readiness

**Objectives:**
- Conduct full security audit remediation (OWASP Top 10, dependency audit, penetration testing)
- Perform load testing with k6 or Artillery (target: 1000 concurrent users)
- Set up production monitoring (Sentry, Vercel Analytics, uptime monitoring)
- Complete documentation (API docs, deployment guide, runbooks, architecture overview)
- Finalize launch checklist: DNS, SSL, CDN, backups, rollback plan, incident response
- Run full test suite and verify all UAT criteria from PRODUCT_BACKLOG.md

**Key Deliverables:**
- `SECURITY_REMEDIATION.md` — security audit findings and fixes
- `k6/` or `artillery/` — load test scripts for critical flows
- Sentry integration for error tracking + performance monitoring
- Vercel Analytics / custom dashboard for business metrics
- `docs/` — API documentation, deployment guide, architecture docs, runbooks
- `.env.production` template with all required variables documented
- Production monitoring dashboard (Sentry + Vercel + custom health endpoint)
- `src/app/api/health/route.ts` — health check endpoint with dependency status
- Incident response runbook in `docs/runbook.md`

**Risks:**
- Security audit may find critical issues requiring sprint extension
- Load testing may reveal performance bottlenecks requiring sprint 8 rework
- Sentry/Vercel Analytics configuration may have cost implications at scale
- Documentation takes longer than estimated — prioritize API docs and deployment guide
- Last-minute bugs from integration between all sprint deliverables

**Dependencies:** All sprints 1-9 (complete feature set, tested, optimized)

**Success Criteria:**
- Zero critical or high-severity security findings
- Load test passes: 1000 concurrent users with < 2s P95 response time
- Error tracking (Sentry) catches all unhandled exceptions with stack traces
- All API endpoints documented
- Deployment runbook tested end-to-end
- Rollback procedure tested and documented
- Launch checklist fully signed off

**Backlog Items:** All remaining CRITICAL/HIGH items from TECH_DEBT.md, FEATURE_STATUS #24 (GDPR/Legal remediation)

**Team:** 1 security engineer, 1 DevOps engineer, 1 full-stack engineer, 1 QA engineer

---

## Sprint Dependency Graph

```
Sprint 1: Foundation Fix
  │
  ├──► Sprint 2: Payment & Email
  │     │
  │     ├──► Sprint 3: Testing Infrastructure
  │     │     │
  │     │     ├──► Sprint 4: Dashboard & Data
  │     │     │     │
  │     │     │     ├──► Sprint 5: Search & Discovery
  │     │     │     │     │
  │     │     │     │     └──► Sprint 8: Performance & SEO
  │     │     │     │             │
  │     │     │     │             └──► Sprint 10: Production Launch
  │     │     │     │
  │     │     │     ├──► Sprint 6: Messaging & Notifications
  │     │     │     │     │
  │     │     │     │     ├──► Sprint 7: Admin Evolution
  │     │     │     │     │     │
  │     │     │     │     │     └──► Sprint 10: Production Launch
  │     │     │     │     │
  │     │     │     │     └──► Sprint 9: Mobile & PWA
  │     │     │     │             │
  │     │     │     │             └──► Sprint 10: Production Launch
  │     │     │     │
  │     │     │     └────────────► Sprint 10: Production Launch
  │     │     │
  │     │     └──────────────────► Sprint 7: Admin Evolution
  │     │
  │     └────────────────────────► Sprint 9: Mobile & PWA
  │
  └──────────────────────────────► Sprint 5: Search & Discovery
```

**Parallelization opportunities:**
- Sprints 5 and 6 can run in parallel (both depend on Sprint 4)
- Sprint 8 can start after Sprint 5 completes (needs search performance baseline)
- Sprint 7 depends on Sprint 3 (tests) and Sprint 6 (notifications)
- Sprint 9 depends on Sprints 2, 6, 8 (payment, messaging, optimization)
- Sprint 10 depends on all sprints

**Optimal team allocation for parallel tracks:**
- Track A: Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5 → Sprint 8 → Sprint 10
- Track B: (starts Sprint 4) → Sprint 6 → Sprint 7 → Sprint 10
- Track C: (starts Sprint 8) → Sprint 9 → Sprint 10

With a team of 4-5 engineers, Tracks A and B can run concurrently from Sprint 4 onward, reducing total elapsed time from 20 weeks to ~16 weeks.

---

## Resource Requirements

### Total Team Size: 4-6 people (expandable to 8 at peak)

| Role | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 | Sprint 7 | Sprint 8 | Sprint 9 | Sprint 10 |
|------|----------|----------|----------|----------|----------|----------|----------|----------|----------|-----------|
| Full-Stack Engineer | 1 | 2 | 1 | 2 | 1 | 2 | 1 | 1 | 1 | 1 |
| Frontend Engineer | 1 | — | — | — | 1 | — | 1 | 1 | — | — |
| Backend Engineer | — | — | — | — | 1 | — | — | — | — | — |
| QA Engineer | — | — | 1 | — | — | — | — | — | — | 1 |
| DevOps Engineer | — | 1 | — | — | — | 1 | — | — | 1 | 1 |
| React Native Engineer | — | — | — | — | — | — | — | — | 1 | — |
| Security Engineer | — | — | — | — | — | — | — | — | — | 1 |

### Key Skills Required
- **Next.js 16 App Router** — all sprints
- **Prisma ORM + PostgreSQL** — sprints 2, 4, 5, 7
- **Payment Gateway Integration** — sprint 2 (Iyzico/PayTR experience preferred)
- **Test Infrastructure** — sprint 3 (Vitest, Playwright, CI/CD)
- **Full-Text Search (PostgreSQL)** — sprint 5
- **Real-time Communication** — sprint 6 (WebSockets, Supabase Realtime)
- **React Native / Expo** — sprint 9
- **Security / Penetration Testing** — sprint 10
- **Performance Optimization** — sprint 8 (Core Web Vitals, Lighthouse)

---

## Risk Register

| ID | Risk | Likelihood | Impact | Sprint | Mitigation |
|----|------|-----------|--------|--------|------------|
| R1 | Payment integration delayed by Iyzico sandbox issues | Medium | Critical | S2 | Start sandbox registration before sprint; have PayTR as backup provider; build provider abstraction for hot-swap |
| R2 | Middleware breaks existing auth patterns | Medium | High | S1 | Run middleware alongside existing checks for 1 week; feature-flag middleware; audit all 20+ auth locations before cutover |
| R3 | CSS migration causes visual regressions | High | Medium | S1 | Create visual regression test page; screenshot comparison before/after; involve designer for QA pass |
| R4 | Test flakiness blocks CI pipeline | High | High | S3 | Retry flaky tests up to 3 times; quarantine consistently flaky tests; use Playwright trace viewer for debugging |
| R5 | Dashboard queries too slow with real data | Medium | High | S4 | Profile queries on staging DB with production-like data volume; implement Redis/Next.js caching layer; add pagination everywhere |
| R6 | Full-text search performance degrades at scale | Medium | High | S5 | Create composite indexes before launch; benchmark with 50k+ rows; plan for read-replica if needed |
| R7 | Real-time messaging WebSocket connection limits | Medium | High | S6 | Monitor concurrent connections; plan Supabase/Ably/WSS upgrade path; fallback to polling for critical users |
| R8 | Permission enforcement breaks admin workflows | Medium | Critical | S7 | Gradual rollout: log-only mode → warn mode → enforce mode; comprehensive test suite before enable |
| R9 | ISR cache invalidation not triggering correctly | Low | Medium | S8 | Add manual revalidation endpoint; monitor revalidation logs; implement on-demand revalidation with webhook |
| R10 | Mobile app build fails due to SDK compatibility | Medium | High | S9 | Lock SDK versions; test builds weekly from Sprint 6; have fallback to PWA-only launch |
| R11 | Security audit finds critical vulnerabilities | Medium | Critical | S10 | Run dependency audit (npm audit) from Sprint 1; conduct preliminary security review in Sprint 8; budget 1 week buffer |
| R12 | Load testing reveals architectural bottlenecks | High | High | S10 | Run load tests early (Sprint 8-9); have read-replica and connection pooling ready; plan vertical scaling headroom |
| R13 | Team capacity insufficient for parallel tracks | Medium | High | S4-S10 | Prioritize Track A as critical path; defer non-blocking features; consider contractor for Sprint 9 (React Native) |
| R14 | Documentation not completed in time | High | Medium | S10 | Write docs incrementally (each sprint documents its deliverables); enforce "doc as you code" policy; use README-driven development |

### Risk Heat Map

| Impact ↓ \ Likelihood → | Low | Medium | High |
|-------------------------|-----|--------|------|
| **Critical** | R9 | R1, R8 | R11 |
| **High** | — | R5, R6, R7, R13 | R2, R4, R10, R12 |
| **Medium** | — | — | R3, R14 |

---

## Success Metrics

### Quantitative Metrics

| Metric | Current Baseline | Sprint 5 Target | Sprint 10 Target | Measurement Method |
|--------|-----------------|-----------------|------------------|-------------------|
| Test coverage (lines) | 0% | 30% | 70% | Vitest --coverage |
| E2E test count | 0 | 5 | 20+ | Playwright test count |
| Lighthouse Performance | ~60-70 | 80 | 90+ | Lighthouse CI |
| Lighthouse PWA | ~60 | 70 | 100 | Lighthouse CI |
| FCP (mobile 3G) | ~3.5s | 2.5s | < 1.5s | Lighthouse / Web Vitals |
| API response time (P95) | ~800ms | 500ms | < 300ms | Sentry / custom logging |
| Auth page load time | ~2.5s | 1.5s | < 1s | Lighthouse / RUM |
| console.log in production | 5+ | 0 | 0 | Code search audit |
| placeholder/mock values | 7+ | 0 | 0 | Code review check |
| middleware.ts | Does not exist | Exists & enforced | Exists & enforced | File existence |
| Error boundaries (public routes) | 0 | 5+ | 10+ | Code search audit |
| Payment provider | Mock | Real (Iyzico) | Real (Iyzico) | Integration test |
| CI pipeline | None | Running | Passing | GitHub Actions status |
| Security findings (critical/high) | Unknown | N/A | 0 | Penetration test report |

### Qualitative Success Indicators

| Indicator | Sprint 5 Check | Sprint 10 Check |
|-----------|---------------|-----------------|
| New user can register, create profile, and be found in search | Manual UAT | Automated E2E |
| Customer can create a job, receive offers, select an artisan | Manual UAT | Automated E2E |
| Full payment flow works end-to-end | Manual UAT | Automated E2E |
| Admin can manage users, jobs, payments, and view analytics | Manual UAT | Automated E2E |
| Mobile app shows real data and supports core flows | N/A | Manual UAT |
| Platform handles 1000 concurrent users without degradation | N/A | Load test pass |
| Rollback procedure tested and documented | N/A | Runbook verified |
| API documentation is accurate and complete | N/A | Docs review pass |

### Business Impact Metrics (Post-Launch Tracking)

| Metric | Target (3 months post-launch) | 
|--------|-------------------------------|
| Transaction volume (monthly) | 100+ paid jobs |
| Payment success rate | ≥ 95% |
| User onboarding completion rate | ≥ 60% |
| Search-to-offer conversion | ≥ 30% |
| Mobile app adoption | ≥ 25% of traffic |
| Platform uptime | ≥ 99.9% |
| Average job completion time | ≤ 48 hours |
| Customer satisfaction (rating) | ≥ 4.2 / 5 |

---

## Executive Summary

**Montajım Var** is a Turkish SaaS marketplace connecting customers with assembly/installation professionals. The platform has been built rapidly with Next.js 16 + React 19 + Tailwind 4 + Prisma + PostgreSQL, achieving comprehensive feature coverage (40 feature areas, 27 DB models, 18 admin sections). However, it ships with critical gaps: zero tests, mock payments, no form validation, no middleware, and console.log in production auth flows.

### The 10-Sprint Plan (20 weeks: July 21 → December 5, 2026)

| Sprint | Focus | Key Outcome | Team |
|--------|-------|-------------|------|
| **S1** | Foundation Fix | Middleware, Zod, error boundaries, CSS cleanup, no console.log | 2 engineers |
| **S2** | Payment & Email | Real Iyzico integration, SMTP, escrow flow, invoices | 3 engineers |
| **S3** | Testing Infrastructure | Vitest + Playwright + CI, 60% lib coverage, 5+ E2E flows | 2 engineers |
| **S4** | Dashboard & Data | Zero mock data, real-time stats, role-specific dashboards | 2 engineers |
| **S5** | Search & Discovery | PostgreSQL FTS, autocomplete, map filtering, saved searches | 2 engineers |
| **S6** | Messaging & Notifications | Real-time chat, push/email triggers, attachments | 3 engineers |
| **S7** | Admin Evolution | Analytics, bulk ops, data export, RBAC enforcement | 2 engineers |
| **S8** | Performance & SEO | Core Web Vitals, structured data, ISR, performance budgets | 2 engineers |
| **S9** | Mobile & PWA | Native mobile app, PWA background sync, push hardening | 3 engineers |
| **S10** | Production Launch | Security audit, load testing, monitoring, docs, launch | 4 engineers |

### Architectural Strategy

The roadmap follows a **foundation-first, revenue-second, quality-third, growth-fourth** sequence:

1. **Phase 1 (S1-S2):** Fix what's broken — middleware, validation, CSS, logging, payments, email. The platform cannot ship without these.
2. **Phase 2 (S3-S4):** Build quality infrastructure — tests catch regressions, real data replaces mock data.
3. **Phase 3 (S5-S7):** Core marketplace depth — search, messaging, admin tools. Feature-complete for production.
4. **Phase 4 (S8-S9):** Growth & cross-platform — performance, SEO, mobile. Scalability and reach.
5. **Phase 5 (S10):** Final validation — security, load testing, monitoring, launch readiness.

### Critical Path

**S1 → S2 → S3 → S4 → S5 → S8 → S10** is the minimum critical path for a production launch. Total: 14 weeks.

Parallel tracks (S6 + S7 after S4, S9 after S8) allow feature-complete launch in **16 weeks** with a team of 4-5 engineers.

### Key Risks

- **R1 (Payment Integration):** The single highest-risk item. Iyzico sandbox delays could block the entire roadmap. Mitigation: start early, have PayTR backup, build provider-swappable abstraction.
- **R11 (Security Findings):** Unknown current security posture. Mitigation: run `npm audit` from S1, preliminary pen-test in S8, budget buffer in S10.
- **R4 (Test Flakiness):** Could erode confidence in CI pipeline. Mitigation: trace viewer, retry logic, quarantine unstable tests.

### Resource Ask

- **Core team (full-time):** 4-5 engineers (2 full-stack, 1 frontend, 1 DevOps, 1 QA)
- **Specialist contractors:** React Native engineer (Sprint 9), Security engineer (Sprint 10)
- **External dependencies:** Iyzico/PayTR merchant account, SMTP provider (SendGrid/Resend), Sentry subscription, Vercel Pro/Enterprise

### Success at a Glance

At the end of 20 weeks, Montajım Var will be:
- Taking real payments through Iyzico escrow
- Protected by centralized middleware + enforced RBAC
- Backed by 70%+ test coverage with CI-enforced quality gates
- Loading in under 1.5s on mobile 3G (90+ Lighthouse)
- Available as both PWA and native mobile app
- Monitored by Sentry + Vercel Analytics with documented runbooks
- Ready for growth marketing and scale
