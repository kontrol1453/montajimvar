# Technical Debt Analysis — Montajım Var Platform

> **Audit Date:** July 2026
> **Scope:** Full-stack Next.js monorepo (web + mobile) with Prisma ORM, NextAuth v4, Tailwind CSS v4

---

## Overview

Montajım Var is a Turkish marketplace connecting customers with assembly/repair artisans. The platform consists of a Next.js 16 App Router web application with an Expo mobile client. It was built rapidly, resulting in significant structural and code-quality debt across the stack. This document catalogs every identified issue with priority, impact, risk, and remediation guidance.

**Total debt items cataloged: 28** across 7 categories. Estimated full remediation effort: 12–18 weeks for a single developer.

---

## Critical Technical Debt

### CRIT-1: Zero Test Coverage

| Attribute | Detail |
|-----------|--------|
| **Problem** | The entire project contains zero test files. No unit, integration, E2E, or component tests exist anywhere in `src/`. The only `.test.*` files found are inside `node_modules/`. |
| **Impact** | Every regression must be caught manually. Refactoring is高风险 — there is no safety net. Deploy confidence is low. |
| **Risk** | Breaking changes in production are inevitable. Auth flows, payment processing, and data mutations are untested. |
| **Solution** | Integrate Vitest + React Testing Library for unit/component tests, Playwright for E2E. Start with critical paths: auth, payment, search, admin CRUD. |
| **Effort** | 4–6 weeks initial setup + core coverage |
| **Priority** | **Critical** |

### CRIT-2: No Middleware — Distributed Auth Logic

| Attribute | Detail |
|-----------|--------|
| **Problem** | No `middleware.ts` exists. Route protection is not centralized — each page/component independently checks session and role via `useSession()` + `roles.includes("CUSTOMER")`. |
| **Impact** | ~20+ locations with redundant auth checks. Inconsistent protection — some pages may be accidentally exposed. Role checks are hardcoded strings throughout the codebase. |
| **Risk** | Authorization gaps; privilege escalation possible. No single place to audit access control. |
| **Solution** | Implement `middleware.ts` with route-based protection. Centralize role checks into a `withAuth` wrapper or permission middleware. |
| **Effort** | 1 week |
| **Priority** | **Critical** |

### CRIT-3: Mock Payment Provider in Production

| Attribute | Detail |
|-----------|--------|
| **Problem** | `src/lib/payment.ts` uses `MockProvider` as the default (and effectively only) payment provider. It uses `Math.random() > 0.1` for success/failure simulation. Three real provider interfaces (`iyzico`, `paytr`, `stripe`) are declared in the type but never wired. |
| **Impact** | No real payment processing. Every financial transaction (`createPayment`, `refundPayment`) runs through a random mock. The platform cannot process real money. |
| **Risk** | This is not just debt — the platform is non-functional for its core value proposition. If deployed, all transactions are fake. |
| **Solution** | Integrate at least one real payment provider (iyzico is the market fit for Turkey). Replace `MockProvider` with real implementation. Add proper error handling, idempotency, webhook verification. |
| **Effort** | 2–3 weeks |
| **Priority** | **Critical** |

---

## High Priority

### HIGH-1: Next-Auth v4 (Outdated)

| Attribute | Detail |
|-----------|--------|
| **Problem** | `next-auth` at `^4.24.14` (v4). NextAuth v5 has been stable for over a year. v4 lacks newer RSC/best practice support. |
| **Impact** | Blocks upgrades to latest Next.js patterns. v4's middleware approach differs from v5. Cannot use `auth()` server-side helper from v5. |
| **Risk** | Security patches for v4 may stop. Migration pain increases over time. |
| **Solution** | Upgrade to NextAuth v5 (now `auth.js` v5). Migrate `[...nextauth]/route.ts` to `auth.ts` factory pattern. |
| **Effort** | 1–2 weeks |
| **Priority** | **High** |

### HIGH-2: No Form Validation Library

| Attribute | Detail |
|-----------|--------|
| **Problem** | No Zod, Yup, or any validation library in dependencies (confirmed in `package.json`). All form validation is manual string checking scattered across components. |
| **Impact** | Inconsistent validation UX. Verbose, error-prone validation code. Missing edge cases. |
| **Risk** | Malformed data can reach the database. SQL injection vectors if validation is weak. |
| **Solution** | Add Zod (already in `mobile/node_modules` — implies team knows it). Define schemas per form, integrate with react-hook-form or use native Zod parsing. |
| **Effort** | 2–3 weeks across all forms |
| **Priority** | **High** |

### HIGH-3: No API Client Abstraction

| Attribute | Detail |
|-----------|--------|
| **Problem** | Each component does direct `fetch()` to API routes. No shared API client, no base URL config, no auth header injection, no error normalization, no retry logic. |
| **Impact** | ~30+ API route files in `src/app/api/` are called ad-hoc. Changing API structure means updating every call site. No centralized error handling. |
| **Risk** | Inconsistent error UX. Auth token mismanagement. Hard to implement features like request dedup, caching, optimistic updates. |
| **Solution** | Build an API client layer (`src/lib/api-client.ts`) with auth interceptor, error normalization, and typed methods. Consider SWR/React Query for data fetching. |
| **Effort** | 1–2 weeks |
| **Priority** | **High** |

### HIGH-4: No State Management

| Attribute | Detail |
|-----------|--------|
| **Problem** | No Zustand, Redux, Jotai, or any client state management. State is managed via URL search params, `useSession()`, and direct server component DB queries. |
| **Impact** | Cross-component state sharing is ad-hoc. Global UI state (sidebar, modals, notifications) must be prop-drilled or lifted to nearest parent. |
| **Risk** | Complex UI interactions become unwieldy. State synchronization bugs. |
| **Solution** | Add Zustand (lightweight, minimal boilerplate) for UI state. Keep server state in RSC/React Query. |
| **Effort** | 1 week |
| **Priority** | **High** |

### HIGH-5: No React Error Boundaries (Public Routes)

| Attribute | Detail |
|-----------|--------|
| **Problem** | `SectionErrorBoundary` exists only in admin components (`src/components/admin/SectionContainer.tsx`). There are zero error boundaries on public routes. No `error.tsx` files exist anywhere in `src/app/(public)/`. |
| **Impact** | Any runtime error in a public page crashes the entire page/component tree. Users see white screens or Next.js error overlays (in dev). |
| **Risk** | Poor user experience; complete UI failure for recoverable errors. |
| **Solution** | Add `error.tsx` boundary files at each route segment level. Wrap high-risk components (SearchForm, JobDetail, Payment) with individual error boundaries. |
| **Effort** | 3–5 days |
| **Priority** | **High** |

### HIGH-6: Duplicated Button & Card Systems

| Attribute | Detail |
|-----------|--------|
| **Problem** | Two UI systems coexist: CSS class-based (`.btn-primary`, `.btn-secondary`, `.btn-accent`, `.card`) in inline classes AND React components (`Button.tsx`, `Card.tsx`). The CSS classes reference `--admin-*` tokens; the components reference the same tokens differently. Both are used in the codebase. |
| **Impact** | Inconsistent styling. Buttons look different depending on which system they use. Maintenance doubles — a change must be made in two places. |
| **Risk** | UI drift over time; brand inconsistency. |
| **Solution** | Deprecate CSS class-based approach. Migrate all usages to `Button.tsx`/`Card.tsx` components. Remove legacy CSS classes from globals.css. |
| **Effort** | 1 week |
| **Priority** | **High** |

### HIGH-7: Console Logs in Production Auth Flow

| Attribute | Detail |
|-----------|--------|
| **Problem** | `src/lib/auth.ts` contains 5 `console.log("[JWT] ...")` statements that log token creation, user lookup results, version checks, and version mismatch details. Also `src/lib/email.ts` logs full email content in dev mode. |
| **Impact** | Sensitive session details logged to stdout in production. Verbose log noise. |
| **Risk** | Token/version info leaks. GDPR/BVKV compliance risk if log aggregation exposes user data. |
| **Solution** | Replace `console.log` with structured logging (pino/winston) or remove in production. Use `process.env.NODE_ENV` gating for dev-only logs. |
| **Effort** | 1 day |
| **Priority** | **High** |

---

## Medium Priority

### MED-1: Large Monolithic Components

| Component | Lines | Issue |
|-----------|-------|-------|
| `Navbar.tsx` | 366 | Navigation, user menu, mobile menu, search bar, auth state — all in one component |
| `SearchForm.tsx` | 339 | Autocomplete, filters, mobile/desktop responsive views, city/category data fetching |
| `DashboardLayout.tsx` | 167 | Inline navigation data with all routes hardcoded |
| `Dashboard/page.tsx` | 318 | Stats, charts, quick actions, recent activity — single server component |

These components violate the Single Responsibility Principle. They are difficult to test, understand, and modify without regression.

**Solution:** Extract distinct features into smaller sub-components. Split Dashboard into `DashboardStats`, `DashboardActivity`, `DashboardQuickActions`. Extract Navbar sections into `NavLinks`, `UserMenu`, `MobileMenu`.

**Effort:** 2 weeks

### MED-2: Mixed Color Systems & Legacy Classes

| Attribute | Detail |
|-----------|--------|
| **Problem** | `globals.css` uses `@theme` design tokens (`--color-primary: #0B5FFF`). But legacy dark-mode classes (`bg-dark-bg`, `bg-dark-card`, `bg-dark-section`, `border-dark-border`, `text-muted-text`, `text-sub-text`) are still in active use in auth pages and search page (confirmed in `ara/page.tsx`, `ara/loading.tsx`, `auth/email-dogrula/*`). |
| **Impact** | The platform has two color systems. Some pages render with the blue theme, others with old dark classes that may not map to current tokens. Brand inconsistency. |
| **Risk** | Color drift; dark legacy classes may break if base styles change. |
| **Solution** | Replace all legacy class references with current design tokens. Audit every page for compliance. Remove legacy definitions from CSS. |
| **Effort** | 1 week |

### MED-3: Admin Token System Duplicates Main Tokens

| Attribute | Detail |
|-----------|--------|
| **Problem** | Admin components exclusively use `--admin-*` CSS variables (`--admin-surface`, `--admin-border`, `--admin-primary`, `--admin-text-*`, `--admin-danger`, etc.). These duplicate many values from the main `--color-*` token system. |
| **Impact** | Changing the brand color requires updating two sets of tokens. Admin UI is isolated from global theming. ~15 admin components and 6 UI components depend on `--admin-*` variables. |
| **Risk** | Theme drift between admin and public sections. |
| **Solution** | Align admin tokens with the main token system. Either derive admin tokens from main tokens, or eliminate the duplicate set. |
| **Effort** | 3–5 days |

### MED-4: 46 Instances of Inline Styles

| Attribute | Detail |
|-----------|--------|
| **Problem** | 46 occurrences of `style={{...}}` props across the codebase (mostly in `dashboard/page.tsx`, `dashboard/teklifler/page.tsx`, and `firma/[id]/opengraph-image.tsx`). These include hardcoded colors, font families, dynamic background calculations. |
| **Impact** | Inline styles bypass Tailwind's utility system, the `@theme` design tokens, and the purging/optimization pipeline. They also prevent dark mode theming. |
| **Risk** | Theme changes don't apply to inline-styled elements. Maintainability problem. |
| **Solution** | Convert inline styles to Tailwind classes or CSS variables. For dynamic styles, use Tailwind's `style` prop with token-based values only. |
| **Effort** | 2–3 days |

### MED-5: Hardcoded Values & Magic Numbers

| Item | Location | Issue |
|------|----------|-------|
| `"₺12,450"`, `"+12%"`, `"3 yeni"`, `"+2"` | `dashboard/page.tsx` | Mock/placeholder dashboard stats — no real data fetching |
| `"3"` | `NotificationBell.tsx` | Hardcoded notification badge count |
| `roles.includes("CUSTOMER")`, `roles.includes("ASSEMBLER")` | Multiple files | Hardcoded role strings everywhere |
| `#0B5FFF10`, `#00C853`, `#EF4444` | `dashboard/page.tsx` | Hardcoded hex colors instead of `var(--color-*)` |
| `12` | Search pages | Hardcoded page size — not configurable |
| `8%` | `payment.ts` | Hardcoded commission rate in `calculateCommission` |

**Solution:** Replace mock data with real DB queries. Extract magic numbers to constants files. Centralize role strings into enums. Use CSS variables for colors. Make page size configurable.

**Effort:** 1 week

### MED-6: Mobile Code Embedded in Web Project

| Attribute | Detail |
|-----------|--------|
| **Problem** | `src/mobile/api/` is an empty directory within the web project. Additionally, `package.json` lists `expo`, `react-native`, and `@types/react-native` as web dependencies (likely for future mobile support). The project root also has a separate `mobile/` directory with its own Expo project. |
| **Impact** | Confusion about which mobile code is active. Web bundle includes unnecessary RN polyfills. |
| **Risk** | Build size bloat. Developer confusion about mobile vs web architecture. |
| **Solution** | Remove `src/mobile/`. Ensure web `package.json` does not depend on RN/Expo unless absolutely needed. Finalize whether `mobile/` is the canonical mobile project. |
| **Effort** | 1–2 days |

### MED-7: CSS Animation vs. Framer Motion Duality

| Attribute | Detail |
|-----------|--------|
| **Problem** | `globals.css` defines CSS keyframe animations (`@keyframes fade-in-up`, `fade-in`, `count-up`, `scale-in`) and applies them via Tailwind classes. Meanwhile, `framer-motion` (`^12.42.0`) is a dependency and used in some components for JS-driven animations. |
| **Impact** | Two animation systems. CSS animations are static; framer-motion offers dynamic/interactive animations. Inconsistent UX feel. |
| **Risk** | Developer confusion about which system to use. CSS keyframes may conflict with framer-motion on the same elements. |
| **Solution** | Standardize on framer-motion for interactive/animated elements. Remove unused CSS keyframes or keep only for static transitions. |
| **Effort** | 2–3 days |

### MED-8: fetch-nodeshim Dependency

| Attribute | Detail |
|-----------|--------|
| **Problem** | `fetch-nodeshim` (`^0.4.10`) is a dependency. Its purpose in this project is unclear — Next.js 16 has native `fetch` support. This may be a leftover from earlier architecture. |
| **Impact** | Unnecessary dependency adds bundle size and potential compatibility issues. |
| **Risk** | Deprecated shim may conflict with Node.js native fetch. |
| **Solution** | Investigate usage. If unused, remove from `package.json`. |
| **Effort** | 1–2 hours |

### MED-9: Google OAuth Role Selection via Cookie

| Attribute | Detail |
|-----------|--------|
| **Problem** | Role selection during Google OAuth is persisted via a cookie (fragile, client-side only). The role cookie could be manipulated or lost. |
| **Impact** | Role assignment depends on a non-secure cookie value. |
| **Risk** | Potential for role manipulation if cookie is tampered with. |
| **Solution** | Move role selection to the OAuth callback flow server-side. Validate against allowed roles on the server. |
| **Effort** | 1–2 days |

---

## Low Priority

### LOW-1: Empty/Unused Directories

| Directory | Issue |
|-----------|-------|
| `src/mobile/api/` | Empty directory |
| `src/app/blog/BlogSection.tsx` | Exists at root of `(public)/` while also imported from within blog routes — may be dead code |

**Solution:** Clean up empty dirs. Audit `BlogSection.tsx` usage.

### LOW-2: Unused Type Definitions

| Item | Detail |
|------|--------|
| `MessageFormData` in `src/types/index.ts` (35 lines total) | May not be used by the actual message form — verify and remove if dead |

**Solution:** Audit type usage; remove or implement.

### LOW-3: ThemeToggle.tsx — Possibly Non-Functional

| Attribute | Detail |
|-----------|--------|
| **Problem** | `ThemeToggle.tsx` exists in `src/components/`. The app uses a fixed dark theme (`bg-dark-*` classes) with no light mode toggle. This component may have no functional connection. |
| **Impact** | Dead component confuses developers. |
| **Solution** | Either implement full theme switching or remove the component. |

### LOW-4: Token Version Control Complexity

| Attribute | Detail |
|-----------|--------|
| **Problem** | `User.tokenVersion` field exists in Prisma schema and is checked in auth JWT callback. This adds complexity for session invalidation that may not be fully utilized. |
| **Impact** | Extra DB query on every JWT callback. Additional code path with logging. |
| **Solution** | Evaluate if token version is actively used for forced logouts. If not, simplify the auth flow. |

### LOW-5: Code Duplication — admin-nav.ts

| Attribute | Detail |
|-----------|--------|
| **Problem** | `src/lib/admin-nav.ts` contains hardcoded navigation data. `DashboardLayout.tsx` also contains inline navigation data. These may overlap or conflict. |
| **Impact** | Adding a nav item requires updating multiple files. |
| **Solution** | Consolidate navigation data into a single source of truth. |

---

## Architecture Issues

### ARCH-1: Database Queries in Page Components

Many server components contain direct Prisma queries inline rather than calling a service/repository layer. Examples include Dashboard pages, search pages, and profile pages. This couples data access to the presentation layer, making it impossible to:

- Unit test data access logic
- Reuse queries across pages
- Implement caching layers cleanly

**Solution:** Introduce a service layer (`src/services/*.ts`) that encapsulates all Prisma queries. Pages should call services, not Prisma directly.

**Effort:** 2–3 weeks

### ARCH-2: Large Prisma Schema — 27 Models / 533 Lines

The schema at `prisma/schema.prisma` contains 27 models with complex bidirectional relations. Key concerns:

- `User` has 15 relation fields — extremely coupled
- Mixed concerns: job system, payments, blog, SEO, notifications, permissions all in one schema
- Some fields store serialized JSON in String columns (`photos String @default("[]")`, `features String @default("[]")`) — losing relational integrity
- Commented Turkish text in schema (`// kuruş cinsinden`, `// JSON array`) mixed with code

**Solution:** Consider schema modularization (multi-file Prisma schema in v5+). Migrate JSON string fields to proper relations or PostgreSQL JSONB columns.

**Effort:** 1–2 weeks (schema refactor risk is high — requires migration planning)

### ARCH-3: Supabase + Prisma Dual Data Access

`src/lib/supabase.ts` exists alongside `src/lib/prisma.ts`. The project appears to use Prisma as primary ORM but retains Supabase client. This dual-access pattern can lead to:

- Inconsistent data access patterns
- Confusion about which client to use
- Potential for stale data if both access the same tables

**Solution:** Resolve whether Supabase is needed. If not, remove. If yes, define clear boundaries (Supabase for auth/storage, Prisma for business data).

### ARCH-4: 22 API Route Groups — No Standardization

The `src/app/api/` directory contains 22 route groups (admin, auth, blog, categories, jobs, messages, etc.) with no consistent pattern for:

- Error response format
- Authentication checks
- Input validation
- Rate limiting
- Pagination conventions

**Solution:** Define API conventions document. Create base handler utilities. Standardize response shape (`{ success, data, error, meta }`).

### ARCH-5: JSON Fields in SQL Columns

Several Prisma models store structured data as JSON strings in `String` columns:

- `Profile.workingCities: String? // JSON array`
- `Job.photos: String @default("[]") // JSON`
- `BlogPost.tags: String @default("[]") // JSON`
- `SubscriptionPlan.features: String @default("[]") // JSON`
- `ProfileImage.tags: String @default("[]") // JSON array`
- `PushSubscription.schedules: String? // JSON array`

These lose the ability to query nested data at the database level and require parsing/marshaling in application code.

**Solution:** Migrate to PostgreSQL `Jsonb` type where indexing is needed, or create normalized relations where querying is required.

---

## Code Quality Issues

### CQ-1: No Query/Mutation Hooks

No `react-query` (TanStack Query) or `swr`. Every page implements its own data fetching with `useEffect` + `fetch()` or server-side `prisma` calls. This means:

- No caching or deduplication
- No stale-while-revalidate pattern
- No loading/error state hooks
- Every page reinvents data fetching patterns

### CQ-2: Hardcoded Turkish Strings Throughout

UI text, error messages, and labels are hardcoded in Turkish directly in components. This makes:

- Internationalization impossible without full rewrite
- Text changes require code changes
- No i18n library (next-intl, react-intl) in dependencies

### CQ-3: Admin Route Group — 18 Subdirectories with Inconsistent Patterns

The admin panel has 18 route groups (`kullanicilar`, `isler`, `firmalar`, `komuta-merkezi`, `abonelik-plani`, etc.) with varying implementations:
- Some use client components with `SectionErrorBoundary`, some don't
- Some have detail `[id]` routes, some are flat
- `komuta-merkezi` has 11 sub-files; `kategoriler` has 2

### CQ-4: Prisma Seed Files Not Versioned

Three seed scripts (`seed.ts`, `seed-city-pages.ts`, `seed-blog.ts`) exist but no migration strategy for production data seeding. Seeds may overwrite or duplicate data.

---

## Testing Gaps

| Area | Status | Risk |
|------|--------|------|
| Unit tests | None | High |
| Component tests | None | High |
| Integration tests | None | High |
| E2E tests | None | High |
| API route tests | None | High |
| Auth flow tests | None | Critical |
| Payment flow tests | None | Critical |
| Admin CRUD tests | None | High |
| Search tests | None | Medium |
| Mobile tests | None (separate project) | Medium |

**Recommended test stack:**
- **Vitest** — unit + integration (already in ecosystem, fast)
- **React Testing Library** — component tests
- **Playwright** — E2E for critical flows
- **MSW** — API mocking for tests

---

## Documentation Gaps

| Document | Status |
|----------|--------|
| API documentation | None |
| Component storybook/style guide | None |
| Environment setup guide | None |
| Deployment guide | None |
| Database schema documentation | Only Prisma schema comments (Turkish) |
| Auth flow documentation | None |
| Payment integration docs | None |
| Contribution guidelines | None |
| CHANGELOG | None |

---

## Summary Table

| ID | Item | Priority | Effort | Impact | Category |
|----|------|----------|--------|--------|----------|
| CRIT-1 | Zero test coverage | **Critical** | 4–6 wks | 🔴 Platform-wide regression risk | Testing |
| CRIT-2 | No middleware | **Critical** | 1 wk | 🔴 Authorization gaps | Architecture |
| CRIT-3 | Mock payment provider | **Critical** | 2–3 wks | 🔴 Cannot process real payments | Functionality |
| HIGH-1 | NextAuth v4 outdated | **High** | 1–2 wks | 🟠 Upgrade blockers, security | Dependencies |
| HIGH-2 | No form validation lib | **High** | 2–3 wks | 🟠 Data integrity risk | Code Quality |
| HIGH-3 | No API client abstraction | **High** | 1–2 wks | 🟠 Inconsistent API usage | Architecture |
| HIGH-4 | No state management | **High** | 1 wk | 🟠 State sync bugs | Architecture |
| HIGH-5 | No error boundaries (public) | **High** | 3–5 days | 🟠 White-screen crashes | Resilience |
| HIGH-6 | Duplicated button/card systems | **High** | 1 wk | 🟠 UI drift | Code Quality |
| HIGH-7 | Console logs in auth | **High** | 1 day | 🟠 Info leak / log noise | Security |
| MED-1 | Large monolithic components | **Medium** | 2 wks | 🟡 Maintainability | Code Quality |
| MED-2 | Mixed color systems / legacy classes | **Medium** | 1 wk | 🟡 Visual inconsistency | UI |
| MED-3 | Admin token duplication | **Medium** | 3–5 days | 🟡 Theme drift | UI |
| MED-4 | Inline styles (46 instances) | **Medium** | 2–3 days | 🟡 Bypasses theming | Code Quality |
| MED-5 | Hardcoded values / magic numbers | **Medium** | 1 wk | 🟡 Maintenance burden | Code Quality |
| MED-6 | Mobile code in web project | **Medium** | 1–2 days | 🟡 Build bloat, confusion | Architecture |
| MED-7 | CSS anims vs framer-motion | **Medium** | 2–3 days | 🟡 Inconsistent animations | Code Quality |
| MED-8 | fetch-nodeshim dependency | **Medium** | 1–2 hrs | 🟡 Unnecessary dep | Dependencies |
| MED-9 | OAuth role cookie | **Medium** | 1–2 days | 🟡 Role manipulation risk | Security |
| LOW-1 | Empty/unused directories | **Low** | 1 hr | 🟢 Cleanliness | Structure |
| LOW-2 | Unused type definitions | **Low** | 1 hr | 🟢 Dead code | Code Quality |
| LOW-3 | ThemeToggle possibly dead | **Low** | 1 hr | 🟢 Dead component | Code Quality |
| LOW-4 | Token version complexity | **Low** | 1 day | 🟢 Unnecessary complexity | Architecture |
| LOW-5 | Navigation data duplication | **Low** | 1 day | 🟢 Maintenance burden | Code Quality |
| ARCH-1 | DB queries in page components | **Medium** | 2–3 wks | 🟡 Coupled architecture | Architecture |
| ARCH-2 | Large Prisma schema (27 models) | **Medium** | 1–2 wks | 🟡 Schema rigidity | Architecture |
| ARCH-3 | Supabase + Prisma dual access | **Low** | 1 wk | 🟢 Confusion | Architecture |
| ARCH-4 | 22 API routes, no standards | **Medium** | 2 wks | 🟡 Inconsistent APIs | Architecture |
| ARCH-5 | JSON in SQL string columns | **Low** | 1–2 wks | 🟢 Query limitations | Architecture |

---

## Recommended Remediation Roadmap

### Phase 1 — Firefighting (Weeks 1–3)
1. **CRIT-3:** Integrate real payment provider (iyzico)
2. **CRIT-2:** Implement `middleware.ts` with centralized auth
3. **HIGH-7:** Strip console logs; add structured logging
4. **MED-9:** Secure OAuth role assignment server-side

### Phase 2 — Foundation (Weeks 4–8)
1. **CRIT-1:** Set up Vitest + RTL + Playwright; test critical paths
2. **HIGH-1:** Upgrade to NextAuth v5
3. **HIGH-2:** Add Zod + standardize form validation
4. **HIGH-3:** Build API client abstraction
5. **HIGH-4:** Add Zustand for UI state

### Phase 3 — Code Quality (Weeks 9–14)
1. **HIGH-5:** Add error boundaries to all public routes
2. **HIGH-6:** Consolidate UI components, deprecate CSS classes
3. **MED-1:** Refactor large components (Navbar, SearchForm, Dashboard)
4. **MED-2/3:** Unify color systems and admin tokens
5. **MED-4/5:** Eliminate inline styles and magic numbers

### Phase 4 — Architecture (Weeks 15–18)
1. **ARCH-1:** Extract service layer from page components
2. **ARCH-4:** Standardize API conventions
3. **ARCH-2/5:** Schema refactoring (JSON fields → proper types)
4. **MED-6/7/8:** Cleanup (mobile code, animation duality, dead deps)
5. **LOW items:** Housekeeping
