# Product Backlog — Montajım Var Platform

> **Generated:** July 2026
> **Project:** Montajım Var — Turkish assembly/installation marketplace
> **Stack:** Next.js 16 + React 19 + Tailwind 4 + Prisma + PostgreSQL (NeonDB) + NextAuth v4

---

## Priority Legend

| Priority | Definition | Expected Timeline |
|----------|-----------|-------------------|
| P0 | **Critical** — Blocks production launch or causes data loss | Immediate (0–2 weeks) |
| P1 | **High** — Major feature gap or significant technical debt | This sprint / next sprint |
| P2 | **Medium** — Important improvement, clear ROI | This quarter |
| P3 | **Low** — Nice to have, dependent on higher-priority work | Future roadmap |

---

## P0 — CRITICAL (Blocking Production)

---

### P0-001 Real Payment Gateway Integration (Iyzico/PayTR/Stripe)

**Business Value:** High
**Technical Value:** High
**Risk:** High
**Dependencies:** None
**Estimated Complexity:** L
**Estimated Effort:** 2–3 weeks
**Description:**
The platform uses `MockProvider` in `src/lib/payment.ts` — a random-based mock that never processes real money. The `PaymentProvider` interface supports `iyzico`, `paytr`, and `stripe` types but none are implemented. The business model depends on commission revenue from completed jobs. Without real payments, the platform cannot transact, generate revenue, or build trust.
**Acceptance Criteria:**
- At least one real payment provider integrated (iyzico recommended for Turkish market fit)
- `MockProvider` replaced as default; mock retained only for dev/test environments
- `createPayment()` creates real charge via provider API with idempotency key
- `refundPayment()` triggers real refund via provider API
- Webhook endpoint implemented for async payment status updates (confirmed, failed, refunded)
- Escrow payment flow: customer pays → platform holds → job completed → funds released to artisan
- Provider API keys stored in environment variables, validated on startup
- Fallback to mock provider when `NEXT_PUBLIC_APP_ENV=development` or no provider keys configured
- Commission calculation (`calculateCommission` in `payment.ts`) tied to real captured amounts
- Error handling: network failures, declined cards, insufficient funds all show user-friendly messages in Turkish
- Test mode (sandbox) available for end-to-end testing without real money
- Migration: existing `Payment` records with `mock_*` provider IDs flagged as test data
**Owner Recommendation:** Fullstack

---

### P0-002 SMTP Email Configuration for Production

**Business Value:** High
**Technical Value:** High
**Risk:** High
**Dependencies:** None
**Estimated Complexity:** XS
**Estimated Effort:** 1–2 days
**Description:**
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` are all empty in `.env`. The `sendEmail()` function in `src/lib/email.ts` falls back to `devLog()` which only prints to console. Email verification, password reset, welcome emails, and premium reminders are all broken in production. Users cannot verify accounts, cannot reset passwords, and miss critical transactional notifications.
**Acceptance Criteria:**
- SMTP credentials configured in production `.env` (or transactional email service like Resend/SendGrid/Mailgun)
- `sendEmail()` sends real emails in production; `devLog()` fallback only in development
- Email verification flow end-to-end working: register → receive email → click link → verified
- Password reset flow end-to-end working: request → receive email → click link → reset password
- Welcome email sent on registration
- Premium reminder emails triggered before plan expiry
- Email delivery health check: admin panel shows email service status
- HTML templates render correctly across major email clients (Gmail, Outlook, Yahoo)
- Bounce handling: failed deliveries logged; admin notified of persistent failures
**Owner Recommendation:** Backend

---

### P0-003 Fix Mixed CSS Class System (Legacy vs Design System Tokens)

**Business Value:** Medium
**Technical Value:** High
**Risk:** Medium
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 1 week
**Description:**
`globals.css` defines modern `@theme` design tokens (`--color-primary: #0B5FFF`) alongside legacy dark-mode classes (`bg-dark-bg`, `bg-dark-card`, `bg-dark-section`, `border-dark-border`, `text-muted-text`, `text-sub-text`). Auth pages, search pages, and other public routes use the legacy classes extensively. This creates visual inconsistency — some pages render with the blue theme, others with old dark classes. The legacy classes may also break if base styles change.
**Acceptance Criteria:**
- Every legacy class reference (`bg-dark-bg`, `bg-dark-card`, `bg-dark-section`, `border-dark-border`, `text-muted-text`, `text-sub-text`) replaced with current design token equivalents
- Auth pages (`/auth/giris`, `/auth/kayit`, `/auth/sifre-unuttum`, `/auth/sifre-sifirla`, `/auth/email-dogrula`) audited and migrated
- Search page (`/ara`) and its loading state audited and migrated
- Legacy CSS class definitions removed from `globals.css` after confirming zero references
- Visual regression check: no unintended styling changes on any public page
- `--color-montaj` legacy variable usage (`text-montaj`, `hover:text-montaj`) mapped to `--color-primary` or kept as semantic alias
**Owner Recommendation:** Frontend

---

### P0-004 Add Form Validation Library (Zod)

**Business Value:** Medium
**Technical Value:** High
**Risk:** Medium
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 2–3 weeks
**Description:**
No validation library exists in `package.json`. All form validation is manual string checking scattered across components. Forms include: login, registration, profile creation, job posting, offer submission, messaging, password reset, admin CRUD. This leads to inconsistent validation UX, verbose error-prone code, and security gaps where malformed data can reach the database.
**Acceptance Criteria:**
- Zod added to `package.json` dependencies
- Schemas defined for every form: `RegisterFormData`, `ProfileFormData`, `MessageFormData`, `JobFormData`, `OfferFormData`, `LoginFormData`, `PasswordResetFormData`, `PasswordChangeFormData`
- Each schema enforces: required fields, email format, password minimum length (6), phone format (Turkish), URL format, number ranges
- Client-side validation via Zod + native form integration (or react-hook-form if beneficial)
- Server-side validation on every API route: request body parsed with Zod schema before processing
- Consistent error display: field-level errors shown below inputs in Turkish
- Existing manual validation code removed and replaced with Zod-based approach
- Admin CRUD forms also covered (user create/edit, profile edit, job edit, etc.)
**Owner Recommendation:** Fullstack

---

### P0-005 Fix Layout/Visibility Issues on Auth Pages (text-white on Light Backgrounds)

**Business Value:** Medium
**Technical Value:** Low
**Risk:** Medium
**Dependencies:** P0-003 (CSS cleanup may fix some instances)
**Estimated Complexity:** XS
**Estimated Effort:** 1–2 days
**Description:**
Auth pages use `text-white` class on heading elements (`<h1 className="text-2xl font-bold text-white">Giriş Yap</h1>` at `auth/giris/page.tsx:77`) while the card background is light (`bg-dark-card` which resolves to white or near-white). This makes heading text invisible or very hard to read. The same pattern may exist in other auth pages (`auth/kayit`, `auth/sifre-unuttum`, `auth/sifre-sifirla`, `auth/email-dogrula`).
**Acceptance Criteria:**
- All `text-white` usages on light-background elements in auth pages changed to appropriate dark text color (`text-text-primary`, `text-gray-900`, or current design token equivalent)
- Auth pages visually inspected: headings, labels, help text all have sufficient contrast (WCAG AA minimum 4.5:1)
- `auth/giris/page.tsx` line 77 fixed
- Sister auth pages (`/kayit`, `/sifre-unuttum`, `/sifre-sifirla`, `/email-dogrula`) similarly audited and fixed
- Any other public pages with same `text-white` on light background issue fixed
**Owner Recommendation:** Frontend

---

### P0-006 Replace Mock Dashboard Data with Real Queries

**Business Value:** High
**Technical Value:** High
**Risk:** High
**Dependencies:** P0-001 (payment data), P0-002 (email stats)
**Estimated Complexity:** M
**Estimated Effort:** 1–2 weeks
**Description:**
Dashboard pages display hardcoded mock values: `"₺12,450"` revenue, `"+12%"` growth, `"3 yeni"` new messages, `"+2"` profile views at `dashboard/page.tsx`. The `NotificationBell.tsx` shows a hardcoded `"3"` badge. Dashboard stats, charts, and activity feeds all use placeholder data. Users see fake numbers, and the admin panel cannot provide actual business insights.
**Acceptance Criteria:**
- Dashboard revenue/money stats sourced from real `Payment` table (sum of completed payments, filtered by date range)
- Dashboard growth percentages calculated from period-over-period comparison
- New messages count sourced from real `Message` table (unread messages for current user)
- Profile view count sourced from `ProfileViewLog` table
- Job stats (active, completed, cancelled) sourced from `Job` table
- Notification badge count in `NotificationBell` sourced from real unread notification count
- Dashboard charts (if any) render real data with proper loading states
- All seven role-based dashboard variants (CUSTOMER, ASSEMBLER, MANUFACTURER, ADMIN + sub-roles) source from real queries
- Performance: dashboard queries optimized with proper indexes and selective field fetching
- Fallback/empty states: graceful display when no data exists (new user, no jobs yet)
**Owner Recommendation:** Fullstack

---

### P0-007 Add middleware.ts for Centralized Auth/Role Protection

**Business Value:** High
**Technical Value:** High
**Risk:** Medium
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
No `middleware.ts` exists. Route protection is decentralized — ~20+ locations independently check `session.user.roles?.includes("CUSTOMER")` or `useSession()`. Some pages may be accidentally exposed. Role strings like `"CUSTOMER"`, `"ASSEMBLER"`, `"MANUFACTURER"`, `"ADMIN"` are hardcoded throughout. There's no single place to audit access control.
**Acceptance Criteria:**
- `src/middleware.ts` created with route-based protection
- Public routes (`/`, `/ara`, `/firma/*`, `/blog/*`, `/auth/*`, `/sehir/*`, `/hakkimizda`, `/iletisim`, etc.) allowed unauthenticated
- `/dashboard/*` routes require authenticated session (any role)
- `/admin/*` routes require `ADMIN` role
- `/admin/api/*` routes protected at middleware level (in addition to per-route checks)
- API routes (`/api/admin/*`) require admin role at middleware level
- Role constants defined in shared location (not hardcoded strings)
- Unauthorized users redirected to `/auth/giris` with return URL
- Forbidden users (wrong role) shown 403 page or redirected
- Existing per-page auth checks remain as defense-in-depth but simplified
- Middleware also handles: CSP nonce generation, rate limiting pre-check, locale detection (future i18n)
**Owner Recommendation:** Fullstack

---

### P0-008 Remove console.log Statements from Production Auth Flow

**Business Value:** Low
**Technical Value:** Medium
**Risk:** Medium
**Dependencies:** None
**Estimated Complexity:** XS
**Estimated Effort:** 1 day
**Description:**
`src/lib/auth.ts` contains 5 `console.log("[JWT] ...")` statements logging token creation, user lookup, version checks, and mismatch details. `src/lib/email.ts` logs full email content and links in dev mode. These leak sensitive session details (token IDs, user IDs, token versions, email addresses) to stdout in production.
**Acceptance Criteria:**
- All `console.log("[JWT] ...")` calls in `src/lib/auth.ts` removed or gated behind `process.env.NODE_ENV === "development"`
- `src/lib/email.ts` `devLog()` function gated to development environment only
- Production logging uses structured approach (pino/winston or Next.js built-in `logger` config) if logging is needed
- No sensitive data (tokens, versions, user details) logged in production
- `console.log`/`console.error` audit across all `src/lib/`, `src/app/api/`, and `src/app/(public)/` files — any production-relevant logs either removed or gated
**Owner Recommendation:** Backend

---

## P1 — HIGH (Major Features/Fixes)

---

### P1-001 Test Framework Setup (Vitest + Playwright)

**Business Value:** High
**Technical Value:** High
**Risk:** High
**Dependencies:** None
**Estimated Complexity:** L
**Estimated Effort:** 4–6 weeks
**Description:**
Zero test coverage across the entire project. No unit, integration, component, or E2E tests exist in `src/`. Every regression must be caught manually. Auth flows, payment processing, and data mutations are untested. The recommended stack is Vitest (unit/integration), React Testing Library (component), Playwright (E2E).
**Acceptance Criteria:**
- Vitest configured with `@testing-library/react` and `@testing-library/jest-dom`
- Playwright configured with Chrome/Firefox browser targets
- Unit tests for: all `src/lib/*` utilities (auth helpers, payment calculations, permissions, utils)
- Component tests for: Button, Input, Card, Badge, Navbar, Footer, SearchForm (critical paths)
- Integration tests for: register → login → create profile flow, job posting → offer submission flow
- E2E tests for: login, registration (email + Google OAuth), search, profile view, admin CRUD
- API route tests for: `/api/auth/kayit`, `/api/jobs`, `/api/offers`, `/api/payments`
- Payment flow tests with mock provider: create payment → escrow → release → refund
- Tests run in CI pipeline (GitHub Actions or Vercel)
- Coverage threshold: minimum 60% for `src/lib/`, 40% for components
- Documentation: how to run tests, write new tests, interpret coverage reports
**Owner Recommendation:** Fullstack

---

### P1-002 Replace Placeholder/Mock Data Throughout

**Business Value:** Medium
**Technical Value:** High
**Risk:** Medium
**Dependencies:** P0-006 (dashboard data), P1-004 (service layer)
**Estimated Complexity:** L
**Estimated Effort:** 2–3 weeks
**Description:**
Beyond the dashboard, mock/placeholder data exists in multiple locations: hardcoded stats (`"₺12,450"`, `"+12%"`), hardcoded notification counts (`"3"`), hardcoded colors (`#0B5FFF10`, `#00C853`, `#EF4444`), hardcoded page sizes (`12`), hardcoded commission rate (`8%` in `payment.ts`). These must be replaced with real data queries and configurable constants.
**Acceptance Criteria:**
- All hardcoded monetary values replaced with real DB queries (sum, count, avg from `Payment`, `Job` tables)
- All hardcoded percentage values replaced with real period-over-period calculations
- All hardcoded badge/count numbers replaced with real count queries
- All hardcoded hex colors replaced with CSS variable references (`var(--color-*)`)
- Page size (`12` in search) replaced with configurable constant from `src/lib/constants.ts`
- Commission rate (`8%` in `calculateCommission`) moved to `constants.ts` or env variable
- `role.includes("CUSTOMER")` hardcoded strings replaced with enum/constant references
- Constants file created at `src/lib/constants.ts` for all magic numbers
- Admin token system (`--admin-*`) aligned with main `--color-*` tokens; duplicate values derived not duplicated
**Owner Recommendation:** Fullstack

---

### P1-003 Build Search Indexing for Full-Text Search

**Business Value:** High
**Technical Value:** High
**Risk:** Medium
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 2–3 weeks
**Description:**
The current search (`/ara` page, `src/lib/search.ts`) likely relies on basic Prisma `contains` queries which don't scale. No full-text search indexing exists. As profile and job counts grow, search performance will degrade. Turkish language support (stemming, stop words) is critical for relevance.
**Acceptance Criteria:**
- PostgreSQL full-text search (GIN indexes on `Profile.companyName`, `Profile.description`, `Profile.city`, `Category.name`) implemented
- Turkish text search configuration (`.tr` stemmer) applied where applicable
- `src/lib/search.ts` rewritten to use Prisma raw queries with `tsvector`/`tsquery` or dedicated search library
- Search ranks by relevance: exact name match > description match > category match > city match
- Premium/featured profiles boosted in search results
- Pagination (cursor or offset) with consistent page size from constants
- Fallback to basic `contains` search if full-text index not available (dev environments)
- Search analytics: popular search terms logged for business insights
**Owner Recommendation:** Backend

---

### P1-004 Split Large Components (Navbar 381 lines, SearchForm 362 lines)

**Business Value:** Low
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
`Navbar.tsx` (381 lines) handles navigation, user menu, mobile menu, search bar, and auth state in one component. `SearchForm.tsx` (362 lines) combines autocomplete, filters, mobile/desktop responsive views, and city/category data fetching. These violate Single Responsibility Principle, making them difficult to test, understand, and modify without regression.
**Acceptance Criteria:**
- `Navbar.tsx` split into: `NavLinks.tsx` (navigation links), `UserMenu.tsx` (user dropdown), `MobileMenu.tsx` (mobile drawer), `NavbarSearch.tsx` (search bar in nav)
- `SearchForm.tsx` split into: `SearchInput.tsx` (autocomplete input), `SearchFilters.tsx` (category/city/price filters), `SearchResults.tsx` (result rendering), `SearchViewToggle.tsx` (list/map toggle)
- Each extracted component under 150 lines
- Props interfaces defined with TypeScript
- Existing functionality preserved: no visual or behavioral regressions
- No new dependencies introduced for splitting
**Owner Recommendation:** Frontend

---

### P1-005 Add Error Boundaries (Public Routes)

**Business Value:** Medium
**Technical Value:** High
**Risk:** Medium
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 3–5 days
**Description:**
`SectionErrorBoundary` exists only in admin components. There are zero error boundaries on public routes. No `error.tsx` files exist in `src/app/(public)/`. Any runtime error in a public page crashes the entire component tree, showing users white screens or Next.js error overlays.
**Acceptance Criteria:**
- `error.tsx` files created at `(public)/` segment level (root public, auth, dashboard, search, profile, job routes)
- Each `error.tsx` displays user-friendly message in Turkish with option to retry or go home
- High-risk components wrapped with individual error boundaries: `SearchForm`, `PaymentFlow`, `JobDetail`, `ProfileDetail`, `ReviewForm`
- `error.tsx` respects dark/light theme from design tokens
- Admin routes: `SectionErrorBoundary` coverage verified across all 18 admin sections
- Boundary fallback UI logged to console (dev) or error reporting service (production)
**Owner Recommendation:** Frontend

---

### P1-006 Real-Time Messaging with WebSockets/Supabase Realtime

**Business Value:** High
**Technical Value:** High
**Risk:** Medium
**Dependencies:** P0-008 (clean console logs)
**Estimated Complexity:** L
**Estimated Effort:** 2–3 weeks
**Description:**
Current messaging (`/api/messages`, `/api/job-messages`) uses poll-based HTTP fetch. No real-time updates. Users must refresh or poll to see new messages. The platform has Supabase installed (`@supabase/supabase-js`) which includes Realtime capabilities, but the messaging UI (`JobMessagesPanel.tsx`, message pages) doesn't use it.
**Acceptance Criteria:**
- WebSocket or Supabase Realtime channel established for authenticated user connections
- New message appears in recipient's UI without manual refresh (push-based)
- JobMessagesPanel updates in real-time for both customer and artisan
- Unread message count updates reactively across all pages (Navbar, Dashboard, NotificationBell)
- Connection state indicator: shows connected/reconnecting/disconnected status
- Graceful degradation to polling if WebSocket connection fails
- Reconnection with exponential backoff on connection loss
- Message read receipts update in real-time
- Backend: Supabase Realtime enabled on `Message` and `JobMessage` tables (or dedicated channel)
- Mobile: real-time message support via Expo WebSocket client
**Owner Recommendation:** Fullstack

---

### P1-007 Notifications System (In-App + Push)

**Business Value:** High
**Technical Value:** High
**Risk:** Medium
**Dependencies:** P1-006 (real-time), P0-002 (email)
**Estimated Complexity:** L
**Estimated Effort:** 2–3 weeks
**Description:**
The `Notification` Prisma model exists but in-app notifications are not fully wired. Push notification infrastructure (`push-service/`, `PushSubscription` model, `web-push` dependency) exists but is not connected to application events. Users don't get notified of: new job offers, messages, review received, job status changes, payment events.
**Acceptance Criteria:**
- In-app notifications triggered for: new offer received, offer accepted/rejected, new message, job status change, payment received, review received
- Notification bell in Navbar shows unread count (sourced from real `Notification` query — P0-006 prerequisite)
- Notification dropdown/list shows recent notifications with timestamps, click navigates to relevant page
- Mark-as-read on click or bulk mark-all-read
- Push notifications via service worker for: new offer (artisan), job completed (customer), payment released (artisan)
- Push subscription management: subscribe on login, unsubscribe on logout, handle expired subscriptions
- Notification preferences page: which notification types to receive, push vs in-app vs email
- Notification deduplication: same event doesn't trigger multiple notifications
- Admin notifications: new user registration, new dispute, failed payment
**Owner Recommendation:** Fullstack

---

### P1-008 Mobile App API Bridge Completion

**Business Value:** High
**Technical Value:** Medium
**Risk:** High
**Dependencies:** P0-001, P0-002, P1-007
**Estimated Complexity:** M
**Estimated Effort:** 2–4 weeks
**Description:**
The Expo mobile app in `mobile/` exists but the API bridge between the Next.js backend and mobile client is incomplete. `src/mobile/api/` is an empty directory. `mobile/src/api/client.ts` exists but may not be wired to all endpoints. The mobile app cannot fully function as a companion to the web platform.
**Acceptance Criteria:**
- API client in `mobile/src/api/client.ts` connected to all required backend endpoints
- Auth flow mobile: login (email + Google), token refresh, session persistence
- Profile management mobile: view/edit profile, upload photos, manage portfolio
- Job system mobile: browse jobs, submit offers, view job status, job messaging
- Push notifications mobile: receive and handle push notifications via Expo Push API
- Real-time messaging mobile: WebSocket/Supabase Realtime for chat
- All mobile screens handle loading, error, and empty states
- `src/mobile/` directory in web project removed or consolidated into canonical `mobile/` project
- Web `package.json` cleaned of unnecessary React Native/Expo dependencies
- API routes that are mobile-only (like `api/auth/mobile-login`) fully functional
**Owner Recommendation:** Fullstack

---

### P1-009 Image Optimization with next/image

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 1 week
**Description:**
Project uses standard `<img>` tags or inline styles for images. `next/image` is not used consistently, missing automatic optimization, WebP/AVIF conversion, lazy loading, responsive sizes, and blur placeholder support. 46 instances of inline `style={{}}` props include hardcoded image dimensions.
**Acceptance Criteria:**
- All profile, company, blog, and category images migrated to `next/image`
- `remotePatterns` configured in `next.config.js` for Supabase storage and external image sources
- Appropriate `sizes` attribute on every `next/image` for responsive loading
- `priority` attribute on hero/LCP images for above-the-fold content
- `placeholder="blur"` with `blurDataURL` for profile/company images where possible
- Image Gallery component (`ImageGallery.tsx`) uses `next/image`
- Legacy `<img>` tags removed from all components
- Inline `style={{}}` with hardcoded dimensions replaced with Tailwind classes or `next/image` intrinsic sizing
**Owner Recommendation:** Frontend

---

### P1-010 Google Fonts Optimization with next/font

**Business Value:** Low
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 2–3 days
**Description:**
Google Fonts (Inter + Manrope) are loaded via `<link>` tags in `layout.tsx` head, causing external network requests, render-blocking, and no self-hosting. `next/font` can self-host these fonts with zero external requests, automatic subsetting, and `font-display: optional`.
**Acceptance Criteria:**
- `Inter` font loaded via `next/font/google` (or self-hosted) in root layout
- `Manrope` font loaded via `next/font/google` for heading typography
- External `<link>` tags for Google Fonts removed from `layout.tsx`
- Font CSS `@font-face` declarations self-hosted in `globals.css` or handled by `next/font`
- `font-family` in `globals.css` body updated to use CSS variable from `next/font`
- Performance verified: no render-blocking font requests, Cumulative Layout Shift (CLS) minimized
- Fallback fonts remain functional if font loading fails
**Owner Recommendation:** Frontend

---

## P2 — MEDIUM (Important Improvements)

---

### P2-001 Dark Mode Implementation

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** P0-003 (CSS cleanup)
**Estimated Complexity:** M
**Estimated Effort:** 1–2 weeks
**Description:**
`ThemeToggle.tsx` exists but the app uses a fixed light theme with no functional toggle. No dark mode CSS variables, `prefers-color-scheme` media query, or theme persistence. Users cannot switch to a dark theme for reduced eye strain in low-light environments.
**Acceptance Criteria:**
- Dark mode CSS variables defined in `globals.css` under `.dark` class and/or `prefers-color-scheme: dark`
- All `--color-*` tokens have corresponding dark mode values with adequate contrast (WCAG AA 4.5:1)
- `ThemeToggle.tsx` connected to toggle between light/dark
- Theme preference persisted in `localStorage` and synced with system preference via `prefers-color-scheme`
- No flash of wrong theme on page load (critical: script in `<head>` before render)
- Admin panel also supports dark mode via admin token set
- Images/illustrations have dark mode variants or use CSS filters
- `next/font` fonts remain legible on dark backgrounds
**Owner Recommendation:** Frontend

---

### P2-002 Internationalization (i18n) Infrastructure

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** L
**Estimated Effort:** 2–4 weeks
**Description:**
All UI text, error messages, and labels are hardcoded in Turkish directly in components. No i18n library or message extraction exists. While Turkish is the primary market, adding i18n infrastructure now prevents a costly full rewrite later when international expansion is needed.
**Acceptance Criteria:**
- `next-intl` or `react-intl` added to dependencies
- Messages extracted from all public pages into Turkish locale file (`tr.json`)
- Message extraction from all components, error messages, and form validation messages
- Locale detection: URL-based (`/en/`, `/tr/`) or cookie/header-based
- `middleware.ts` updated to handle locale routing (integration with P0-007)
- English locale file (`en.json`) with placeholder translations for key user-facing strings
- Date, number, and currency formatting localized per locale (`date-fns` locale support)
- Form validation messages support i18n via Zod `.describe()` or custom error maps
- Admin panel also supports locale switching (lower priority — can be Turkish-only initially)
- Language switcher in Navbar or Footer
- SEO: `hreflang` tags in layout for multi-language support
**Owner Recommendation:** Fullstack

---

### P2-003 Dashboard Charts with Real Data

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** P0-006 (real dashboard data)
**Estimated Complexity:** M
**Estimated Effort:** 1–2 weeks
**Description:**
Dashboard currently shows text-based stats. No charts, graphs, or visualizations exist for revenue trends, job volume, user growth, or category distribution. Adding charts with real data provides actionable business insights.
**Acceptance Criteria:**
- Revenue chart: daily/weekly/monthly revenue over time (line chart)
- Job volume chart: jobs created vs completed over time (area chart)
- Category distribution: jobs/profiles by category (pie or bar chart)
- User growth: new registrations over time (line chart)
- Conversion funnel: page views → profile views → contact requests → jobs (for artisan profiles)
- All charts use real data from aggregated DB queries
- Responsive: charts resize for mobile/tablet/desktop
- Loading skeleton states while chart data loads
- Chart library: lightweight (recharts, chart.js, or native SVG)
- Date range picker to filter chart data (7d, 30d, 90d, custom)
- Export chart data as CSV for further analysis
**Owner Recommendation:** Frontend

---

### P2-004 Advanced Admin Analytics

**Business Value:** High
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** P0-006, P2-003
**Estimated Complexity:** L
**Estimated Effort:** 2–3 weeks
**Description:**
Admin panel has 18 sections but lacks a dedicated analytics dashboard. Administrators cannot view platform-wide KPIs, growth trends, user segmentation, or financial reports without manual DB queries.
**Acceptance Criteria:**
- Admin analytics page at `/admin/analytics` (or within `komuta-merkezi`)
- KPIs displayed: total users (by role), total profiles, total jobs, total revenue (with commission), conversion rates
- User segmentation: CUSTOMER vs ASSEMBLER vs MANUFACTURER counts, growth trends
- Geographic distribution: users/profiles by city (map or table)
- Category analytics: most popular categories by profile count, job count, revenue
- Premium analytics: premium subscriber count, churn rate, MRR, LTV estimate
- Job analytics: average time from posting to completion, most common job categories
- Review analytics: average rating, review volume, rating distribution
- Financial report: revenue by month, commission collected, refund amounts, failed payments
- Data export: all analytics tables exportable as CSV
- Date range filter across all analytics panels
- Performance: analytics queries optimized with materialized views or cached aggregates
**Owner Recommendation:** Fullstack

---

### P2-005 Blog SEO Optimization

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
Blog system exists (`BlogPost`, `BlogCategory` models, `/blog` routes, `/api/blog`) but SEO metadata may be incomplete. No JSON-LD article schema, OpenGraph article tags, breadcrumb structured data, or proper heading hierarchy. Blog content renders via `dangerouslySetInnerHTML` without sanitization.
**Acceptance Criteria:**
- JSON-LD `Article` schema on each blog post page
- OpenGraph tags: `og:type: article`, `og:title`, `og:description`, `og:image`, `og:published_time`, `og:author`
- Twitter card tags for blog posts
- Breadcrumb structured data (`BreadcrumbList` schema)
- Proper `<h1>`, `<h2>` heading hierarchy on blog pages
- Blog sitemap integration with `sitemap.ts` (include blog posts with `lastmod` dates)
- `metaTitle` and `metaDesc` from `BlogPost` model rendered in `<head>`
- Blog content sanitized with DOMPurify or isomorphic-dompurify before rendering
- Blog category pages have proper SEO metadata with category name and description
- Related posts section at bottom of each article with internal linking
- Read time estimate displayed on blog cards
- Blog content images optimized with `next/image` (integration with P1-009)
**Owner Recommendation:** Frontend

---

### P2-006 City Page Bulk Generation

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 1–2 weeks
**Description:**
City service pages (`CityServicePage` model, `sehir/[city]` routes) exist for SEO — targeting "[service] [city]" keyword combinations. Currently requires manual creation. A bulk generation system can automatically create city+service pages for all major Turkish cities and service categories.
**Acceptance Criteria:**
- Bulk generation script or admin tool creates `CityServicePage` entries for all combinations of: top 81 Turkish cities × top 20 service categories
- Each page has unique, SEO-optimized content (templated with city and service name)
- Meta titles and descriptions follow SEO best practices (`[Service] Hizmeti [City] | Montajım Var`)
- Duplicate detection: skip existing combinations instead of overwriting
- Content quality: templates include city-specific info (districts, landmarks, demographics) via data file
- Admin panel: manage generated pages, regenerate individual pages, view page performance
- Generated pages auto-published with `isPublished: true`
- Performance: batch inserts with progress tracking
- Sitemap integration: all published city pages included in sitemap
**Owner Recommendation:** Fullstack

---

### P2-007 Email Notification Templates

**Business Value:** Medium
**Technical Value:** Low
**Risk:** Low
**Dependencies:** P0-002 (SMTP working)
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
Currently only four email templates exist (`verifyEmailHtml`, `resetPasswordHtml`, `welcomeEmailHtml`, `premiumReminderHtml`). Missing templates: offer received, job completed, payment received, payment released, new review, account suspended, dispute opened/resolved. All templates are inline HTML strings — hard to maintain and test.
**Acceptance Criteria:**
- Email templates for all transactional events: job offer received, offer accepted, job completed, payment received, payment released to artisan, new review received, account suspended, dispute opened, dispute resolved
- Templates moved from inline HTML strings to a template system (React Email, MJML, or Handlebars)
- Templates responsive and tested in: Gmail, Outlook, Yahoo Mail, Apple Mail
- All templates respect brand colors and design system
- Template preview in admin panel: admin can preview any email template with sample data
- Unsubscribe link in marketing/notification emails
- Email sending wrapped in try-catch with retry logic for transient failures
- Email send history: admin panel shows sent emails with status (sent, failed, bounced)
**Owner Recommendation:** Backend

---

### P2-008 User Activity Logging

**Business Value:** Low
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
`AdminAuditLog` model exists for admin actions only. No general user activity tracking exists. The platform cannot answer: when a user last logged in, what searches they performed, what profiles they viewed, what actions led to a dispute, or user engagement patterns.
**Acceptance Criteria:**
- Activity log model created (or `AdminAuditLog` extended) to track user actions: login, register, profile view, search, message send, job post, offer submit, payment, review
- Activity logged server-side via middleware or service wrapper (not client-side)
- Search queries logged (anonymized): search terms, category, city, result count, clicks
- Profile views logged (existed in `ProfileViewLog` — ensure fully wired)
- Admin panel: view user activity timeline per user
- Privacy: logs retained for configurable period (default 90 days), auto-purge old logs
- Privacy: user activity not exposed to other users (admin-only)
- Performance: async logging (fire-and-forget, no impact on request latency)
- GDPR compliance: user has right to request/download their activity data
**Owner Recommendation:** Backend

---

### P2-009 Rate Limiting on API Routes

**Business Value:** Medium
**Technical Value:** High
**Risk:** Medium
**Dependencies:** P0-007 (middleware)
**Estimated Complexity:** S
**Estimated Effort:** 3–5 days
**Description:**
Security review (H-1) identified no rate limiting on auth endpoints: registration, login, password reset, email verification, mobile login. An attacker can brute-force credentials or mass-register accounts without throttling. No other API routes have rate limiting either.
**Acceptance Criteria:**
- Rate limiting implemented on all auth endpoints: `/api/auth/kayit`, `/api/auth/[...nextauth]`, `/api/auth/sifre-sifirla`, `/api/auth/email-verify`, `/api/auth/mobile-login`
- Rate limit thresholds: login (5 attempts/min per IP), register (3/min per IP), password reset (2/min per email), general API (60/min per IP)
- Rate limit implemented in `middleware.ts` or as a reusable wrapper for API routes
- Rate limit storage: in-memory (development), Redis/Vercel KV (production) or `@upstash/ratelimit`
- Rate limit exceeded response: `429 Too Many Requests` with `Retry-After` header and Turkish error message
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Admin panel: view rate-limited requests, whitelist admin IPs
- Distributed rate limiting: works across multiple Vercel instances (not per-instance)
**Owner Recommendation:** Backend

---

### P2-010 File Upload Validation and Optimization

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
Current upload (`/api/upload/route.ts`) validates file type (JPEG/PNG/WebP/GIF) and size (5MB). Missing: file dimension validation, image compression, virus scanning, CDN caching headers, progress indicators, drag-and-drop UX, EXIF data stripping, and multiple file upload support.
**Acceptance Criteria:**
- Image dimension validation: minimum/maximum dimensions enforced for profile photos, portfolio images, job photos
- Image compression: uploaded images compressed (sharp or similar) to reduce storage and bandwidth
- EXIF data stripped from uploaded images (privacy: remove GPS location, camera info)
- Upload progress indicator: percentage/bytes shown during upload
- Drag-and-drop upload area on portfolio and profile image sections
- Multiple file upload: portfolio and job photos support batch upload
- CDN caching: uploaded images served with `Cache-Control: public, max-age=31536000, immutable`
- File type validation extended to reject SVGs (XSS vector in some SVG uploads) unless explicitly needed
- Virus scanning: integration with ClamAV or similar (or at minimum: reject executable extensions)
- Upload error handling: network failure, file too large, invalid type — all show user-friendly Turkish messages
- Image Gallery component (`ImageGallery.tsx`) supports reordering and deletion
**Owner Recommendation:** Fullstack

---

## P3 — LOW (Nice to Have)

---

### P3-001 AI-Powered Price Suggestions

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 2–3 weeks
**Description:**
`PriceAnalyzer.tsx` and `src/lib/price-analyzer.ts` exist but may not be fully integrated. An AI-powered price suggestion system can help customers set realistic budgets when posting jobs, and help artisans price their offers competitively. Uses historical job data and market rates.
**Acceptance Criteria:**
- Price suggestion shown when customer posts a job: suggested min/max range based on similar jobs in same city/category
- Price suggestion shown to artisan when submitting offer: suggested competitive range
- Suggestions based on: completed job amounts in same city + category, urgency level, job description keywords
- AI model: simple statistical model (average, median, percentiles) from historical data; ML model as future enhancement
- Suggestion UI non-intrusive: shown as info box, not blocking submission
- Fallback when insufficient data: show national averages or category averages
- Batch re-calculation: suggestions updated periodically as new job data accumulates
**Owner Recommendation:** Fullstack

---

### P3-002 Automated Review Moderation (AI)

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 2–3 weeks
**Description:**
Reviews are posted without any content moderation. Inappropriate, spam, or fake reviews can damage platform trust. An AI-powered moderation system can automatically flag or reject problematic reviews before publication.
**Acceptance Criteria:**
- Review content checked for: profanity (Turkish + English), spam patterns, competitor mentions, contact information, duplicate content
- Automated flagging: flagged reviews hidden from profile but visible to admin for review
- Admin panel: review moderation queue showing flagged reviews with AI analysis (why flagged)
- Admin actions: approve, reject, or edit flagged reviews
- Review analysis: sentiment score, helpfulness prediction, verified-purchase indicator
- False positive handling: approved reviews train the model to reduce future false flags
- Platform reputation: reviews from verified job completions (customer <-> artisan) marked as "Doğrulanmış İş"
- Privacy: no user data sent to external AI APIs unless anonymized
**Owner Recommendation:** Fullstack

---

### P3-003 Company Verification Badges

**Business Value:** High
**Technical Value:** Low
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
Business profiles have an `isVerified` boolean field but no visual verification badge system. Verified companies (ID verified, insurance verified, physical address confirmed) should display a trust badge. A verification process with submitted documents would increase platform trust.
**Acceptance Criteria:**
- Verification badge designed and displayed on verified company profiles (profile page, search results, company cards)
- Verification levels: Email verified (automatic), Identity verified (manual), Insurance verified (document upload), Premium member (paid)
- Verification application form: company uploads documents (tax ID, insurance cert, ID card)
- Admin panel: verification request queue with document viewer and approve/reject actions
- Verification badge design: distinct per level, WCAG AA contrast, works in dark mode
- Badge visible in: search results, profile page, company card component, review section
- Badge tooltip: "Bu firma kimliğini doğrulamıştır" (or similar)
- Search filter: filter by verified companies only
**Owner Recommendation:** Fullstack

---

### P3-004 Social Media Sharing

**Business Value:** Low
**Technical Value:** Low
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** XS
**Estimated Effort:** 2–3 days
**Description:**
No social sharing buttons on company profiles, blog posts, or job listings. Users cannot easily share a great artisan profile or an interesting blog article to WhatsApp, Twitter, Facebook, or LinkedIn — the primary social channels in Turkey.
**Acceptance Criteria:**
- Share buttons on: company profile page (`/firma/[id]`), blog post (`/blog/[slug]`), job listing (`/isler/[id]`)
- Share channels: WhatsApp (most popular in Turkey), Twitter, Facebook, LinkedIn, copy link
- Share content uses OpenGraph tags (already partially implemented) for rich previews
- Share button design: subtle icon buttons, not intrusive
- Analytics: share events tracked for measuring content virality
- No external JavaScript loaded from social platforms (static share URLs only)
- Mobile: share button triggers native share sheet on mobile browsers
**Owner Recommendation:** Frontend

---

### P3-005 Advanced Filtering (Price Range, Service Area Map)

**Business Value:** Medium
**Technical Value:** Medium
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 1–2 weeks
**Description:**
Current search on `/ara` has basic category/city filtering. Missing: price range filter for jobs, service area map (artisans can set a `serviceArea` in km — filter by coverage), working cities multi-select, availability filter, rating range filter, and premium-only filter.
**Acceptance Criteria:**
- Price range slider for job search (min/max budget)
- Service area filter: search artisans who cover a given city or area (based on `Profile.serviceArea` km radius)
- Working cities multi-select filter: artisans can serve multiple cities
- Rating filter: minimum rating (1–5) filter for company profiles
- Premium filter: show only premium/featured companies
- Availability filter: filter by artisans who are currently accepting jobs
- Filter design: collapsible sidebar on desktop, bottom sheet on mobile
- Filter state persisted in URL search params for shareability
- Filter reset: single "Temizle" button to reset all filters
- Active filter chips: show active filters as removable chips above results
- Performance: all filters backed by indexed DB columns
**Owner Recommendation:** Fullstack

---

### P3-006 Customer Loyalty Program

**Business Value:** Medium
**Technical Value:** Low
**Risk:** Low
**Dependencies:** P0-001 (real payments)
**Estimated Complexity:** S
**Estimated Effort:** 1–2 weeks
**Description:**
No customer loyalty or rewards system. Repeat customers (those who post multiple jobs) are not incentivized. A loyalty program with points, discounts on commission, or premium features for frequent users would increase retention.
**Acceptance Criteria:**
- Loyalty points awarded for: job completion (per job), review written, profile completion, referral signup
- Points redeemable for: commission discount on next job, free profile premium for 1 month, priority support
- Loyalty tier system: Bronze (1–5 jobs), Silver (6–15 jobs), Gold (16+ jobs) with increasing benefits
- Points balance visible in user dashboard
- Transaction history: points earned and spent
- Points expire after 12 months of inactivity
- Admin panel: manage loyalty tiers, view points distribution, manually adjust points
- Points system integreated with existing `User` model (no new heavy dependencies)
- Notifications: points earned notification, tier upgrade congratulations
**Owner Recommendation:** Fullstack

---

### P3-007 Referral System

**Business Value:** Medium
**Technical Value:** Low
**Risk:** Low
**Dependencies:** P3-006 (loyalty program would integrate well)
**Estimated Complexity:** S
**Estimated Effort:** 1 week
**Description:**
No referral/invite system. Users cannot invite friends or colleagues to the platform. A referral system with rewards (free premium days, commission discount) would drive user acquisition at low cost.
**Acceptance Criteria:**
- Referral code generated per user (unique alphanumeric code)
- Referral link: `montajimvar.xyz/kayit?ref=CODE`
- Referral landing page: shows referrer name, welcome message, signup form
- Referral reward: referrer gets 30 days free premium OR 1 free job posting
- Referral reward: referee gets first job posting fee waived or 10% discount
- Referral tracking: dashboard shows number of referrals, rewards earned
- Referral fraud prevention: require verified email + at least one profile/job before reward
- Referral notification: "Tebrikler! [name] kaydoldu. Premium üyeliğiniz aktifleştirildi."
- Admin panel: referral stats, top referrers, fraud detection
- Email/WhatsApp share for referral link (integration with P3-004)
**Owner Recommendation:** Fullstack

---

### P3-008 API Documentation (OpenAPI/Swagger)

**Business Value:** Low
**Technical Value:** High
**Risk:** Low
**Dependencies:** None
**Estimated Complexity:** M
**Estimated Effort:** 2–3 weeks
**Description:**
22 API route groups exist with no external documentation. No OpenAPI/Swagger spec, no API reference page, no Postman collection. External developers cannot integrate with the platform. Internal developers must read source code to understand API contracts.
**Acceptance Criteria:**
- OpenAPI 3.1 specification generated for all public API routes (not admin)
- Specification covers: endpoints, methods, request/response schemas, auth requirements, error codes
- Swagger UI or Scalar API reference page at `/api/docs` or `/docs`
- All endpoints documented with correct auth requirements (public, authenticated, admin-only)
- Request/response examples for each endpoint
- API changelog for version tracking
- Mobile API endpoints also documented
- Webhook endpoints documented (payment callbacks)
- Rate limiting info included in API docs
- Spec validated: no broken references, valid OpenAPI schema
**Owner Recommendation:** Backend

---

### P3-009 Multi-Language Support

**Business Value:** Medium
**Technical Value:** High
**Risk:** Medium
**Dependencies:** P2-002 (i18n infrastructure must exist first)
**Estimated Complexity:** XL
**Estimated Effort:** 4–8 weeks
**Description:**
Full multi-language support beyond Turkish. Primary targets: English (international users), German (large Turkish diaspora in Germany), Arabic (potential Middle East expansion), Russian, Kurdish. Requires i18n infrastructure first (P2-002), then full translation effort.
**Acceptance Criteria:**
- Full translation for Turkish (existing) and English (primary target)
- Translation files for: German, Arabic (if expansion planned)
- All user-facing text in translation files (not hardcoded)
- RTL support for Arabic locale (layout, text direction, form inputs)
- Locale-specific: date formats, number formats, currency formatting
- Locale-specific SEO: `hreflang` tags, localized sitemaps, translated slugs
- Language detection: browser preference, geolocation-based default
- Language switcher prominent in UI (Navbar or Footer)
- Admin panel translations: admin UI can stay Turkish-only initially
- Translation workflow: translation files in git, CI checks for missing keys
- Content translation: blog posts, city pages can have locale-specific versions
**Owner Recommendation:** Fullstack

---

### P3-010 White-Label Solution for Enterprise

**Business Value:** High
**Technical Value:** High
**Risk:** High
**Estimated Complexity:** XL
**Estimated Effort:** 6–12 weeks
**Description:**
Enterprise clients (large furniture retailers, home improvement chains, appliance brands) may want a white-labeled version of Montajım Var for their own customer base. This requires: multi-tenant architecture, custom domain support, branded UI, separate admin panel, custom pricing, and API access.
**Acceptance Criteria:**
- Multi-tenant architecture: each enterprise client gets isolated environment (database schema or tenant ID)
- Custom domain: enterprise.montajimvar.com or client's own domain
- Branded UI: client logo, colors, fonts configured per tenant
- White-labeled mobile app: Expo app fork with client branding
- Custom pricing: enterprise-specific commission rates, subscription plans, feature sets
- Enterprise admin panel: manage their artisans, view analytics, handle disputes
- API access: enterprise can integrate with their own systems via API
- Billing: Montajım Var bills enterprise monthly (separate from end-customer payments)
- SLA: enterprise-grade uptime, support, SLAs
- Implementation complexity: requires schema changes, deployment strategy, and sales/support infrastructure
**Owner Recommendation:** Fullstack

---

## Backlog Summary

| Priority | Count | Total Est. Effort |
|----------|-------|-------------------|
| P0 | 8 | ~9–18 weeks |
| P1 | 10 | ~18–31 weeks |
| P2 | 10 | ~13–25 weeks |
| P3 | 10 | ~22–43 weeks |
| **Total** | **38** | **~62–117 weeks** |

> **Note:** Many items can be parallelized across frontend/backend. Total calendar time is significantly less with a team of 2+ developers.

## Execution Order Recommendation

### Wave 1 (Month 1–2) — Production Readiness
1. P0-002 SMTP email configuration
2. P0-004 Zod form validation (start with auth forms)
3. P0-005 Auth page CSS fix
4. P0-008 Remove console.logs
5. P0-007 middleware.ts
6. P0-001 Real payment gateway (2–3 week effort, start early)
7. P0-003 CSS class migration (can parallelize with payment)

### Wave 2 (Month 2–4) — Data Integrity & Testing
8. P0-006 Real dashboard data
9. P1-001 Test framework setup (Vitest + Playwright)
10. P1-002 Replace all mock data
11. P1-005 Error boundaries
12. P1-010 Google Fonts optimization

### Wave 3 (Month 4–6) — User Experience
13. P1-004 Split large components
14. P1-009 Image optimization
15. P1-003 Search indexing
16. P1-006 Real-time messaging
17. P1-007 Notifications system
18. P1-008 Mobile API bridge

### Wave 4 (Month 6–9) — Platform Maturity
19. P2 items (dark mode, i18n, charts, analytics, email templates, rate limiting, etc.)
20. P3-001 through P3-008 as capacity allows

### Wave 5 (Future)
21. P3-009 Multi-language support
22. P3-010 White-label enterprise solution
