# MONTAJIM VAR ADMIN V4 DISCOVERY REPORT

---

## Executive Summary

Montajım Var runs on **Next.js 16** (App Router) with **Prisma ORM** (PostgreSQL), **NextAuth v4** (JWT), **Tailwind CSS v4**, and **TypeScript**. Admin V3 is fully functional with 15+ CRUD pages, a dedicated Admin shell (sidebar + header), role-based permissions, and basic dashboard analytics.

Admin V4 aims to transform this into a **Marketplace Management Platform** with a **Command Center** dashboard and **User/Company/Job 360° workspaces**.

**Key finding: The codebase has a solid foundation for Admin V4 but lacks several critical systems:**
- No centralized admin activity/audit log
- No "last active" tracking for users
- No direct Job↔Company relationship
- No over-due/reporting time fields on jobs
- No approval workflow system
- No aggregated admin API endpoints

All 360° workspaces and Command Center sections must be built within these constraints.

---

## Git Status

| Item | Status |
|------|--------|
| **Current Branch** | `feature/admin-v3` |
| **Base Branch** | `master` |
| **Changes not staged** | 24 files modified (V3 improvements in progress) |
| **Untracked files** | `MONTAJIM_VAR_ADMIN_V3_AUDIT.md`, `src/app/admin/loading.tsx`, `src/components/admin/Pagination.tsx` |
| **Recent commits** | V3 shell, design tokens, Dialog migration, dashboard IA redesign |

No staged changes. Working tree is dirty with V3 changes. Recommend checkpointing before V4 work.

---

## Admin V3 Validation

### Layout & Shell
- ✅ `AdminShell.tsx` — Client component with sidebar + header + skip-link
- ✅ `AdminSidebar.tsx` — Three variants: collapsed/expanded/drawer
- ✅ `AdminHeader.tsx` — Breadcrumb, notification bell, profile menu
- ✅ Mobile drawer via `MobileSidebarDrawer.tsx`
- ✅ `lg` breakpoint toggle for sidebar collapse
- ✅ Admin layout at `src/app/admin/layout.tsx` — guards with ADMIN role check

### Existing Pages (15 routes)

| Route | Component Type | Data Source | Notes |
|-------|---------------|-------------|-------|
| `/admin` | Server Component | `prisma` direct queries | 9 stat cards + 9 quick actions + revenue summary |
| `/admin/kullanicilar` | Server Component | `prisma` server-side | Table + create/roles/premium/delete via dialogs |
| `/admin/firmalar` | Server Component | `prisma` server-side | Table + verify/featured/category/delete |
| `/admin/isler` | Client Component | `fetch(/api/jobs?admin=all)` | Client-side filter, detail expand, cancel/delete |
| `/admin/yorumlar` | Client Component | `fetch(/api/reviews + /api/jobs/reviews)` | Combined firm/job reviews, client filter + delete |
| `/admin/sertifikalar` | Client Component | `fetch(/api/admin/skills)` | Verify toggle |
| `/admin/anlasmazliklar` | Client Component | `fetch(/api/admin/disputes)` | Dropdown resolution |
| `/admin/bildirim` | Client Component | `fetch(/api/admin/notifications)` | Notification list + push send form |
| `/admin/izinler` | Server Component | `prisma` server-side | Permission matrix |
| `/admin/abonelik-plani` | Server Component | `prisma` server-side | Plans CRUD |
| `/admin/crm` | Server + Client | `prisma` server + client dashboard | CRM stats cards + job table + call reminder |
| `/admin/blog` | (not examined) | — | Blog CRUD |
| `/admin/kategoriler` | (not examined) | — | Category tree |
| `/admin/sehir-sayfalari` | (not examined) | — | City page CRUD |
| `/admin/google-firma-ekle` | (not examined) | — | Google Business integration |

### Shared Components (Admin V3)
- `PageHeader` — Title + description + actions slot
- `StatCard` — Icon + label + value + optional trend/href
- `AdminTable` — Generic table with columns, actions slot, pagination, responsive hidden breakpoints
- `Pagination` — Client + server (Link-based) pagination
- `Dialog` — Modal with focus trap, Escape close, actions
- `RowActionsDropdown` — Three-dot menu with keyboard nav
- `AdminToolbar` + `SearchInput` — Filter/search bar
- `LoadingSkeleton` — Page/card/table-row/text variants
- `EmptyState` — Icon + title + description + action
- `Badge` — Status badge variants
- `Button` — Button component
- `Typography` — PageTitle, SectionTitle, PageContainer, Stack

### Data Quality
- All server components use `force-dynamic` or `revalidate=0`
- Client components fetch on mount with `useEffect`
- All API routes check ADMIN role via `session.user.roles.includes("ADMIN")`
- No centralized error boundary for admin pages
- No centralized data fetching layer

---

## Database Architecture

### Models Summary

| Model | Key Fields | Relations |
|-------|-----------|-----------|
| **User** | id, name, email, password, roles[], city, emailVerified, premiumUntil | Profile, Jobs(customer), Offers(artisan), Reviews, Messages, Disputes, Payments, Skills, Videos |
| **Profile** (Company) | id, companyName, categoryId, city, isVerified, isFeatured, ratingAvg, reviewCount, subscriptionId, premiumUntil | User, Category, Reviews, Favorites, SubscriptionPlan |
| **Category** | id, name, slug, parentId | self-referencing tree, Profiles, Jobs |
| **Job** | id, customerId, title, description, status, city, budgetMin/Max | Customer(User), Offers, Timeline, Messages, Review, Payment, Dispute, Invoices |
| **Offer** | id, jobId, artisanId, amount, status, duration | Job, Artisan(User) |
| **Payment** | id, jobId, customerId, artisanId, amount, commission, status, method | Job, Customer/Artisan(User), Dispute |
| **Dispute** | id, jobId, paymentId, openedById, reason, resolution, status | Job, Payment, OpenedBy(User) |
| **Review** (Company) | id, profileId, userId, rating, comment | Profile, User |
| **JobReview** | id, jobId(unq), rating, comment, photos | Job |
| **JobTimeline** | id, jobId, status, note | Job |
| **JobMessage** | id, jobId, senderId, message, fileUrl, isRead | Job, Sender(User) |
| **ArtisanSkill** (Certificate) | id, userId, categoryId, title, certificate(URL), verified | User, Category |
| **Notification** | id, type, title, message, link, isRead | None (standalone) |
| **RolePermission** | id, role, feature, enabled | None |
| **SubscriptionPlan** | id, name, slug, price, durationDays, features | Profiles |
| **Invoice** | id, jobId, paymentId, invoiceNo, amount, recipientId | Job, Payment, Recipient(User) |

### Key Observations
- **Company = Profile** — No separate Company entity; companies are User Profiles
- **No AdminAuditLog model** — Admin actions are not recorded
- **No ActivityLog model** — No centralized activity tracking
- **No JobDeadline/DueDate** — Cannot detect overdue jobs
- **No ReportedReview model** — No moderation/reporting queue
- **Jobs not linked to Company** — Jobs belong to User(customer), not to Profile/Company
- **User.lastActiveAt** — Does not exist
- **User.approvedAt** — Does not exist; approval is via emailVerified only
- **Profile.city** — Single city, no multi-location support

---

## API Architecture

### Admin API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/users` | POST/DELETE | Create/delete user |
| `/api/admin/users/[id]/roles` | PUT | Update user roles |
| `/api/admin/users/[id]/premium` | PUT | Update premium status |
| `/api/admin/profiles` | PATCH/DELETE | Update/delete company profile |
| `/api/admin/disputes` | GET | List disputes |
| `/api/admin/disputes/[id]` | PATCH | Resolve dispute |
| `/api/admin/skills` | GET | List certificates |
| `/api/admin/skills/[id]/verify` | PATCH | Toggle certificate verification |
| `/api/admin/notifications` | GET/POST | List/mark-read notifications |
| `/api/admin/send-push` | POST | Send push notification |
| `/api/admin/permissions` | GET/POST | List/update permissions |
| `/api/admin/subscription-plans` | GET/POST/PATCH/DELETE | CRUD subscription plans |
| `/api/admin/export` | GET | CSV export (users/profiles) |
| `/api/admin/categories` | * | Category CRUD |
| `/api/admin/blog-categories` | * | Blog category CRUD |
| `/api/admin/city-pages` | * | City page CRUD |

### Public API Endpoints (relevant to Admin)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/jobs` | GET | List jobs (admin=all returns all with offers) |
| `/api/jobs/[id]` | GET/PATCH/DELETE | Job detail/update/delete |
| `/api/jobs/reviews` | GET | List job reviews |
| `/api/offers` | GET/POST | List/create offers |
| `/api/reviews` | GET/POST/DELETE | List/create/delete company reviews |
| `/api/analytics/[id]` | GET | Profile view analytics |

### API Pattern
- All admin endpoints check `session.user.roles.includes("ADMIN")`
- Some admin endpoints use `(prisma as any).dispute?.findMany()` (optional chaining) indicating some models were added later
- No dedicated admin dashboard aggregation endpoint exists
- Job listing for admin returns ALL jobs (no pagination) via `admin=all`

---

## Entity Relationship Map

```
User (id, name, email, roles, city, premiumUntil, createdAt)
 ├── Profile (userId) [1:1] — Company profile
 │    ├── Category (categoryId)
 │    ├── Review (profileId) [1:N]
 │    ├── Favorite (profileId) [1:N]
 │    ├── SubscriptionPlan (subscriptionId)
 │    └── ProfileImage (profileId) [1:N]
 ├── Job (customerId) [1:N] — Jobs created by user
 │    ├── JobCategory (jobId) [1:N]
 │    ├── Offer (jobId) [1:N]
 │    ├── JobTimeline (jobId) [1:N]
 │    ├── JobMessage (jobId) [1:N]
 │    ├── JobReview (jobId) [1:1]
 │    ├── Payment (jobId) [1:1]
 │    │    └── Invoice (paymentId) [1:N]
 │    ├── Dispute (jobId) [1:1]
 │    └── Invoice (jobId) [1:N]
 ├── Offer (artisanId) [1:N] — Offers made by user
 ├── Review (userId) [1:N] — Reviews written by user
 ├── Message (senderId/receiverId) [1:N]
 ├── Dispute (openedById) [1:N]
 ├── Payment (customerId/artisanId) [1:N]
 ├── ArtisanSkill (userId) [1:N]
 ├── ArtisanVideo (userId) [1:N]
 └── Invoice (recipientId) [1:N]

Notification (standalone — no FK to User)

RolePermission (standalone)

SubscriptionPlan (standalone)
 └── Profile (subscriptionId) [1:N]
 └── SubscriptionPayment (planId) [1:N]
      └── Profile (profileId)

Category (self-referential tree)
 ├── Profile (categoryId)
 ├── JobCategory (categoryId)
 └── ArtisanSkill (categoryId)
```

---

## Data Capability Matrix

| Capability | Database | API | UI | Data Quality | Missing | Recommendation |
|---|---|---|---|---|---|---|
| **User profile (name, email, phone, city)** | ✅ User model | ✅ | ✅ | Good | — | — |
| **User roles** | ✅ roles[] | ✅ | ✅ | Good | — | — |
| **User premium status** | ✅ premiumUntil | ✅ | ✅ | Good | — | — |
| **User email verification** | ✅ emailVerified | ✅ | ✅ | Good | — | — |
| **User phone verification** | ✅ isPhoneVerified | — | — | Not used in UI | No admin display | Show in User 360 |
| **User identity verification** | ✅ identityVerified | — | — | Not used in UI | No admin display | Show in User 360 |
| **User last activity** | ❌ | ❌ | ❌ | — | No lastActiveAt field | Cannot implement now |
| **User registration date** | ✅ createdAt | ✅ | ✅ | Good | — | — |
| **User created jobs** | ✅ Job.customerId | ✅ | ✅ | Good | — | Use in User 360 |
| **User offers** | ✅ Offer.artisanId | ✅ | ✅ | Good | — | Use in User 360 |
| **User reviews written** | ✅ Review.userId | ✅ | ✅ | Good | — | Use in User 360 |
| **User certificates** | ✅ ArtisanSkill | ✅ | ✅ | Good | — | Use in User 360 |
| **User disputes** | ✅ Dispute.openedById | ✅ | ✅ | Good | — | Use in User 360 |
| **User payments made** | ✅ Payment.customerId | — | — | Limited | No admin payments list | Add to User 360 |
| **User payments received** | ✅ Payment.artisanId | — | — | Limited | No admin payments list | Add to User 360 |
| **Company profile** | ✅ Profile model | ✅ | ✅ | Good | — | — |
| **Company owner** | ✅ Profile.userId | ✅ | ✅ | Good | — | — |
| **Company verification** | ✅ isVerified | ✅ | ✅ | Good | — | — |
| **Company featured status** | ✅ isFeatured | ✅ | ✅ | Good | — | — |
| **Company team members** | ❌ | ❌ | ❌ | — | No team model | Cannot implement |
| **Company jobs** | ❌ | ❌ | ❌ | — | No Job.companyId | Cannot show directly; derive via owner's jobs |
| **Company reviews** | ✅ Review.profileId | ✅ | ✅ | Good | — | — |
| **Company subscription** | ✅ subscriptionId | ✅ | ✅ | Good | — | — |
| **Company payment history** | ✅ SubscriptionPayment | — | — | Limited | No admin view | Add to Company 360 |
| **Company disputes** | ❌ | ❌ | ❌ | — | No companyId on Dispute | Cannot link directly |
| **Job title/description** | ✅ | ✅ | ✅ | Good | — | — |
| **Job status** | ✅ status | ✅ | ✅ | Good | — | — |
| **Job status history** | ✅ JobTimeline | ✅ | ✅ | Good | — | — |
| **Job creator** | ✅ customerId | ✅ | ✅ | Good | — | — |
| **Job offers** | ✅ Offer model | ✅ | ✅ | Good | — | — |
| **Job accepted offer** | ✅ Offer.status=accepted | ✅ | ✅ | Good | — | — |
| **Job messages** | ✅ JobMessage | — | — | Not in admin | No admin messages view | Add to Job 360 |
| **Job files/photos** | ✅ photos (JSON) | — | — | Not in admin | No admin files view | Add to Job 360 |
| **Job payment** | ✅ Payment | ✅ | ✅ | Limited | No admin payment detail | Add to Job 360 |
| **Job review** | ✅ JobReview | ✅ | ✅ | Good | — | — |
| **Job dispute** | ✅ Dispute | ✅ | ✅ | Good | — | — |
| **Job timeline** | ✅ JobTimeline | ✅ | — | Not exposed in admin | No admin timeline view | Add to Job 360 |
| **Job due date/overdue** | ❌ | ❌ | ❌ | — | No dueDate field | Cannot implement overdue detection |
| **Total users count** | ✅ User.count() | ✅ | ✅ | Good | — | — |
| **Total companies count** | ✅ Profile.count() | ✅ | ✅ | Good | — | — |
| **Total jobs count** | ✅ Job.count() | ✅ | ✅ | Good | — | — |
| **Jobs with offers** | ✅ Offer grouped by jobId | — | — | Can compute | No pre-computed metric | Server query per dashboard |
| **Jobs without offers** | ✅ Offer grouped by jobId | — | — | Can compute | No pre-computed metric | Server query per dashboard |
| **Average offers per job** | ✅ Offer grouped by jobId | — | — | Can compute | No pre-computed metric | Server query per dashboard |
| **Offer acceptance rate** | ✅ Offer.status counts | — | — | Can compute | No pre-computed metric | Server query per dashboard |
| **Job completion rate** | ✅ Job.status=completed | — | — | Can compute | No pre-computed metric | Server query per dashboard |
| **Transaction volume** | ✅ Payment.amount sum | — | — | Can compute | No pre-computed metric | Server query per dashboard |
| **Total commission** | ✅ Payment.commission sum | ✅ | ✅ | Good | — | Reuse existing |
| **Pending payments** | ✅ Payment.status=escrow | — | — | Can compute | No admin pending payments view | Server query per dashboard |
| **Refunds** | ✅ Payment.status=refunded | — | — | Can compute | No admin refunds view | Server query per dashboard |
| **Open disputes** | ✅ Dispute.status=open | ✅ | ✅ | Good | — | — |
| **Resolved disputes** | ✅ Dispute.status=resolved | ✅ | ✅ | Good | — | — |
| **Pending certificates** | ✅ ArtisanSkill.verified=false | ✅ | ✅ | Good | — | — |
| **Admin notifications** | ✅ Notification model | ✅ | ✅ | Good | — | — |
| **Admin activity/audit log** | ❌ | ❌ | ❌ | — | No audit model | Cannot implement |
| **Pending user approvals** | ❌ | ❌ | ❌ | — | No approval workflow | Cannot implement (emailVerified exists but not an admin workflow) |
| **Pending company approvals** | ✅ isVerified=false | ✅ | ✅ | Good | — | Use existing |
| **Reported reviews** | ❌ | ❌ | ❌ | — | No report model | Cannot implement |
| **Failed payments** | ❌ | ❌ | ❌ | — | No failure tracking beyond status | Limited |
| **Active users (last 7/30 days)** | ❌ | ❌ | ❌ | — | No lastActiveAt | Cannot implement |
| **Jobs per city** | ✅ Job.city | — | — | Can compute | — | — |
| **Users per role** | ✅ User.roles | — | — | Can compute | — | — |

---

## Metric Registry

| Metric | Purpose | Source | Formula | Time Window | Caveats |
|--------|---------|--------|---------|-------------|---------|
| **Total Users** | Platform scale | `User.count()` | COUNT(id) | All time | — |
| **Total Companies** | Platform scale | `Profile.count()` | COUNT(id) | All time | — |
| **Total Jobs** | Marketplace activity | `Job.count()` | COUNT(id) | All time | — |
| **Pending Company Approvals** | Operations | `Profile.count({isVerified:false})` | COUNT(id) WHERE verified=false | All time | Includes all unverified |
| **Active Jobs** | Marketplace health | `Job.count({status:in-progress/en_route/assigned})` | COUNT(id) WHERE status IN active | Current | Define active statuses |
| **Completed Jobs** | Marketplace health | `Job.count({status:completed})` | COUNT(id) WHERE status=completed | All time | — |
| **Cancelled Jobs** | Operations | `Job.count({status:cancelled})` | COUNT(id) WHERE status=cancelled | All time | — |
| **Open Disputes** | Operations | `Dispute.count({status:open})` | COUNT(id) WHERE status=open | Current | — |
| **Pending Certificates** | Operations | `ArtisanSkill.count({verified:false})` | COUNT(id) WHERE verified=false | Current | Skills without cert not included |
| **Total Offers** | Marketplace activity | `Offer.count()` | COUNT(id) | All time | — |
| **Accepted Offers** | Marketplace health | `Offer.count({status:accepted})` | COUNT(id) WHERE status=accepted | All time | — |
| **Jobs With Offers** | Marketplace health | Job offers > 0 | COUNT(DISTINCT jobId) WHERE offer count > 0 | All time | Exclude cancelled? Needs definition |
| **Jobs Without Offers** | Marketplace health | Job offers = 0 | COUNT(DISTINCT jobId) WHERE offer count = 0 | All time | Exclude cancelled/pending? Needs definition |
| **Average Offers Per Job** | Marketplace health | Offers / Jobs with offers | AVG(offer count per job) | All time | Include zero-offer jobs in avg? Product decision needed |
| **Offer Acceptance Rate** | Marketplace health | Accepted / Total non-withdrawn | COUNT(accepted) / COUNT(all - withdrawn) * 100 | All time | Needs definition |
| **Total Revenue** | Financial | `Payment.amount sum` | SUM(amount) WHERE status=released | All time | Only released payments |
| **Total Commission** | Financial | `Payment.commission sum` | SUM(commission) | All time | — |
| **Pending Payments** | Financial | `Payment.count({status:escrow})` | COUNT(id) WHERE status=escrow | Current | — |
| **Open Dispute Amount** | Financial | Dispute payment sums | SUM(amount) WHERE dispute.open | Current | Payment may not exist |
| **Total Reviews** | Platform activity | `Review.count()` + `JobReview.count()` | COUNT(review) + COUNT(jobReview) | All time | Two separate models |
| **Pending Resolved Rate** | Operations | Resolved/Total disputes | COUNT(resolved) / COUNT(total) * 100 | All time | — |

---

## Existing Dashboard Analysis

**Current Dashboard** (`/admin/page.tsx`):
- **Type**: Server Component
- **Data**: 9 parallel Prisma queries
- **Layout**: PageContainer > Stack > PageHeader > SectionTitle > StatCard grid(4x) > SectionTitle > StatCard grid(3x) > SectionTitle > QuickActions grid(3x)
- **Metrics displayed**: Total Users, Companies, Jobs, Pending Approvals, Firm Reviews, Job Reviews, Blog Posts, Role Permissions, Revenue, Commission, Payment count
- **Quick Actions**: 9 links to management pages

**Strengths**:
- ✅ Uses server-side aggregation (no N+1)
- ✅ Parallel Promise.all for independent queries
- ✅ Clean StatCard component with icons and navigation
- ✅ Responsive grid layout
- ✅ Revenue section exists (real data)

**Weaknesses**:
- ❌ No section-level error isolation (one failure breaks all)
- ❌ No loading states needed (server component, but 9 queries sequential)
- ❌ No "attention required" indicators
- ❌ No marketplace health metrics
- ❌ No recent activity
- ❌ No operational alerts
- ❌ Static refresh (no auto-refresh or "last updated" indicator)
- ❌ Metrics mix platform and content stats (blog/perm counts not operational)
- ❌ Quick Actions are simple links, no contextual guidance

---

## Existing Detail Page Analysis

**No detail pages exist for Admin V3.** All entity management is via list pages with:

- **Users**: Table with inline actions (roles, premium, delete via dialogs)
- **Companies**: Table with inline actions (verify, featured, categories, delete)
- **Jobs**: Card list with inline detail expand + cancel/delete
- **Reviews**: Table with delete action
- **Certificates**: Table with verify toggle
- **Disputes**: Table with resolution dropdown
- **Notifications**: Card list with read marking

**Missing for Admin V4**:
- ❌ No `/admin/users/[id]` detail route
- ❌ No `/admin/companies/[id]` detail route
- ❌ No `/admin/jobs/[id]` detail route
- ❌ No entity header component
- ❌ No tab navigation pattern
- ❌ No entity relationship navigation

---

## Permission Architecture

**Model**: `RolePermission` — role + feature + enabled
**Roles**: CUSTOMER, ASSEMBLER, MANUFACTURER (but NOT ADMIN in permissions table)
**Admin check**: Hard-coded `session.user.roles.includes("ADMIN")` in every API route and layout
**Features**: Frontend-facing (view_profiles, send_message, etc.) — NOT admin features
**Admin permissions**: Not managed via DB; hard-coded ADMIN role check

**Implications for Admin V4**:
- Admin V4 actions must continue using the hard-coded ADMIN role check
- The existing RolePermission system is for public platform features, not admin features
- No need to create admin-specific permissions unless we add multi-admin-role support
- All current and new admin pages/API routes must maintain the ADMIN role guard

---

## Reusable Components

| Component | File | Reusable for V4? |
|-----------|------|-------------------|
| `AdminTable` | `src/components/admin/DataTable/AdminTable.tsx` | ✅ Yes — tables in 360° |
| `Pagination` | `src/components/admin/Pagination.tsx` | ✅ Yes |
| `PageHeader` | `src/components/admin/PageHeader.tsx` | ✅ Yes — for new pages |
| `StatCard` | `src/components/admin/StatCard.tsx` | ✅ Yes — for Command Center |
| `Dialog` | `src/components/admin/Dialog.tsx` | ✅ Yes — confirmations |
| `RowActionsDropdown` | `src/components/admin/DataTable/RowActionsDropdown.tsx` | ✅ Yes |
| `AdminToolbar` + `SearchInput` | `src/components/admin/DataTable/AdminToolbar.tsx` | ✅ Yes |
| `LoadingSkeleton` | `src/components/admin/LoadingSkeleton.tsx` | ✅ Yes |
| `EmptyState` | `src/components/admin/EmptyState.tsx` | ✅ Yes |
| `Badge` | `src/components/ui/Badge.tsx` | ✅ Yes |
| `Button` | `src/components/ui/Button.tsx` | ✅ Yes |
| `SectionTitle` | `src/components/ui/Typography.tsx` | ✅ Yes |
| `PageContainer` | `src/components/ui/Typography.tsx` | ✅ Yes |
| `Stack` | `src/components/ui/Typography.tsx` | ✅ Yes |
| `NotificationBell` | `src/app/admin/NotificationBell.tsx` | ✅ Yes |
| `AdminShell` | `src/components/admin/AdminShell.tsx` | ✅ Yes — preserve as-is |

---

## Missing Technical Capabilities

| Capability | Priority | Impact | Recommendation |
|------------|----------|--------|----------------|
| Admin activity/audit log | P0 | Cannot track admin actions | Create `AdminAuditLog` model + API |
| User last activity tracking | P1 | Cannot show "recently active" | Add `lastActiveAt` field to User |
| Aggregated admin dashboard API | P1 | Multiple page-level Prisma queries duplicated | Create `/api/admin/summary` endpoint |
| Error isolation for dashboard sections | P1 | One query failure breaks entire page | Section-level error boundaries |
| Entity detail routes (users/[id], etc.) | P0 | Need for 360° navigation | Create route groups + shared layout |
| Tab-based entity navigation | P1 | Need for 360° workspaces | Create reusable tab component |
| Loading/error/empty for each tab | P1 | Required for robust UX | Per-tab loading/error boundaries |
| EntityLink component | P2 | Cross-entity navigation | Create reusable EntityLink |
| Status semantics components | P2 | Consistent status display | Create status badge mapping per entity |
| Responsive page header with details | P2 | Entity header for 360° | Create EntityHeader component |
| Timeline component | P2 | Job 360 timeline | Create Timeline from JobTimeline data |
| URL state for tabs/filters | P2 | Refresh-safe navigation | Use searchParams for active tab |
| Overdue job detection | P2 | Missing field | Add dueDate or use time-in-status heuristic |
| Admin notification creation | P2 | Can create notifications | Already exists in bildirim page |

---

## Required Database Changes

| Change | Priority | Rationale | Risk |
|--------|----------|-----------|------|
| `AdminAuditLog` model (id, adminId, action, entity, entityId, details, ip, createdAt) | P0 | Track admin actions — critical for V4 | Low — new model |
| `User.lastActiveAt` field | P1 | Show "last active" in User 360 | Low — new nullable field |
| No other DB changes required for Command Center & 360° MVP | — | All V4 features can use existing models | — |

**V4 can be implemented with 2 DB additions** — the rest is UI/API architecture.

---

## Required API Changes

| Change | Priority | Rationale |
|--------|----------|-----------|
| `GET /api/admin/summary` — Aggregated dashboard endpoint | P1 | Replace 9+ page-level Prisma queries |
| `GET /api/admin/users/[id]` — Full user detail | P1 | User 360 data |
| `GET /api/admin/users/[id]/jobs` — User's jobs | P1 | User 360 jobs tab |
| `GET /api/admin/users/[id]/offers` — User's offers | P2 | User 360 offers tab |
| `GET /api/admin/users/[id]/reviews` — User's reviews | P2 | User 360 reviews tab |
| `GET /api/admin/users/[id]/disputes` — User's disputes | P2 | User 360 disputes tab |
| `GET /api/admin/users/[id]/certificates` — User's certs | P2 | User 360 certificates tab |
| `GET /api/admin/users/[id]/financial` — User payments | P3 | User 360 financial tab |
| `GET /api/admin/profiles/[id]` — Full company detail | P1 | Company 360 data |
| `GET /api/admin/profiles/[id]/jobs` — Company jobs | P2 | Company 360 jobs tab (via owner) |
| `GET /api/admin/profiles/[id]/team` — Company team | P3 | Only if team feature added |
| `GET /api/admin/profiles/[id]/subscription` — Sub history | P2 | Company 360 subscription tab |
| `GET /api/admin/jobs/[id]/detail` — Full job detail (admin) | P1 | Job 360 data |
| `GET /api/admin/jobs/[id]/timeline` — Job timeline | P2 | Job 360 timeline tab |
| `GET /api/admin/jobs/[id]/messages` — Job messages | P2 | Job 360 messages tab |
| `GET /api/admin/jobs/[id]/files` — Job files | P3 | Job 360 files tab |

**Alternative**: Many 360° detail pages can be built using existing API endpoints (`/api/jobs/[id]`, `/api/offers`, `/api/reviews`, `/api/admin/disputes`) with additional includes, avoiding the need for new endpoints.

---

## P0 Issues (Critical — Must Address Before Implementation)

1. **Working tree has 24 uncommitted changes** — Must checkpoint/stash before V4 work
2. **No admin activity/audit log** — Admin actions untracked; need `AdminAuditLog` model
3. **No entity detail routes** — 360° workspace requires `/admin/users/[id]`, `/admin/companies/[id]`, `/admin/jobs/[id]` routes
4. **Existing Admin V3 pages must be preserved** — Cannot regress existing CRUD operations
5. **ADMIN role guard must be preserved** — All new routes/endpoints must maintain auth check

## P1 Issues (High — Should Address in V4 Foundation)

1. No aggregated admin summary API — Duplicated Prisma queries across pages
2. No section-level error isolation — Dashboard sections should load independently
3. No User.lastActiveAt — Cannot show user activity recency
4. Need reusable 360° tab + entity header pattern
5. Need loading/error/empty state for each section
6. Job listing loads ALL records client-side — Needs pagination

## P2 Issues (Medium — Address per 360° Implementation)

1. Cross-entity navigation (User↔Company↔Job links)
2. Timeline component from JobTimeline data
3. Status badge system per entity type
4. URL state for tabs and filters
5. Responsive entity headers on mobile
6. Keyboard navigation for tables and tabs

## P3 Issues (Low — Future)

1. Financial overview (depends on payment data volume)
2. Multi-location support for companies
3. Team member management
4. Automated overdue detection
5. Admin notification creation API
6. CSV/export for new pages

---

## File Impact Map

### New Files Required

```
src/app/admin/komuta-merkezi/
  ├── page.tsx                          — Command Center main page
  ├── CommandHeader.tsx                  — Command header
  ├── AttentionCenter.tsx                — Attention items
  ├── PlatformPulse.tsx                  — KPI metrics
  ├── MarketplaceHealth.tsx              — Job/offer metrics
  ├── OperationsCenter.tsx               — Operational metrics
  ├── FinancialOverview.tsx              — Financial metrics
  ├── RecentActivity.tsx                 — Recent activity feed
  └── QuickActions.tsx                   — Action shortcuts

src/app/admin/kullanicilar/[id]/
  ├── page.tsx                           — User 360 page
  ├── UserHeader.tsx                     — User identity + status + actions
  ├── UserOverview.tsx                   — Account info + summary
  ├── UserJobs.tsx                       — User's jobs tab
  ├── UserOffers.tsx                     — User's offers tab
  ├── UserReviews.tsx                    — User's reviews tab
  ├── UserCertificates.tsx              — User's certificates tab
  ├── UserDisputes.tsx                   — User's disputes tab
  └── UserFinancial.tsx                  — User's financial tab (P3)

src/app/admin/firmalar/[id]/
  ├── page.tsx                           — Company 360 page
  ├── CompanyHeader.tsx                  — Company identity + status + actions
  ├── CompanyOverview.tsx                — Company info + summary
  ├── CompanyTeam.tsx                    — Team members tab (limited)
  ├── CompanyJobs.tsx                    — Company jobs tab
  ├── CompanyReviews.tsx                 — Company reviews tab
  ├── CompanySubscription.tsx           — Subscription tab
  └── CompanyFinancial.tsx              — Financial tab (P3)

src/app/admin/isler/[id]/
  ├── page.tsx                           — Job 360 page
  ├── JobHeader.tsx                      — Job identity + status + actions
  ├── JobOverview.tsx                    — Job info + summary
  ├── JobOffers.tsx                      — Job offers tab
  ├── JobParticipants.tsx                — Participants tab
  ├── JobTimeline.tsx                    — Timeline tab
  ├── JobMessages.tsx                    — Messages tab (read-only)
  ├── JobFiles.tsx                       — Files tab (P3)
  ├── JobPayments.tsx                    — Payment tab (P3)
  └── JobReviewsDisputes.tsx            — Reviews + disputes tab

src/components/admin/
  ├── EntityHeader.tsx                   — Shared entity header
  ├── EntityTabs.tsx                     — Shared tab navigation
  ├── EntityLink.tsx                     — Cross-entity link component
  ├── EntityStatus.tsx                   — Status badge per entity type
  ├── EntityActivity.tsx                 — Activity/composed timeline
  ├── AttentionCard.tsx                  — Attention item card
  ├── KpiCard.tsx                        — KPI metric card
  ├── MetricCard.tsx                     — Metric card with definition
  └── Timeline.tsx                       — Timeline component

src/app/api/admin/
  └── summary/
       └── route.ts                     — Aggregated dashboard API

prisma/
  └── migrations/                       — New AdminAuditLog migration
```

### Modified Files

```
src/lib/admin-nav.ts                    — Add Command Center + 360° nav items
src/app/admin/layout.tsx                — No change needed (already uses AdminShell)
src/components/admin/AdminShell.tsx      — No change needed
src/app/globals.css                     — May add Admin V4 specific tokens
```

---

## Technical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Dashboard query performance** — 9+ Prisma queries in server component may slow page load as data grows | Medium | Add aggregate caching or dedicated `/api/admin/summary` endpoint |
| **Job listing loads all records** — `/api/jobs?admin=all` returns all jobs without pagination | High | Add server-side pagination to admin job listing |
| **No error isolation** — Single dashboard query failure breaks entire page | High | Use section-level error boundaries + Suspense boundaries |
| **360° tab data loading** — Loading all tabs on mount creates N+1 queries | Medium | Lazy-load tabs, parallel requests per tab |
| **Cross-entity navigation without detail routes** — 360° pages need stable routes for browser navigation | Low | Use [id] route params with searchParams for tabs |
| **Permission model** — All admin features use hard-coded ADMIN role check; new pages must maintain this | Low | Consistent auth guard pattern across all routes |
| **Financial data availability** — Payment model exists but may have limited production data | Medium | Show real data; document if empty |
| **Company↔Job relationship absence** — Jobs belong to User, not Profile/Company | Medium | Derive company jobs via Profile owner; document limitation |
| **No activity/audit system** — Cannot show historical admin actions | High | Create AdminAuditLog model; implement before V4 actions |
| **Working tree conflict** — 24 uncommitted changes may conflict with V4 work | Low | Stash or checkpoint before starting |

---

## Implementation Plan

### Phase 0 — Safety (30 min)
- Git status check and stash/checkpoint
- Create `feature/admin-v4-command-center` branch from admin-v3
- Document current state

### Phase 1 — Discovery & Data Audit (COMPLETE)
- This document constitutes Phase 1

### Phase 2 — Admin V4 Foundation (2-3 days)
- Create `AdminAuditLog` migration + Prisma model
- Create `/api/admin/summary` endpoint (aggregated dashboard data)
- Create nav items for Command Center + 360° routes (`admin-nav.ts`)
- Create `EntityLink`, `EntityStatus`, `EntityTabs`, `EntityHeader` shared components
- Create error boundaries + Suspense wrappers
- [STOP FOR APPROVAL]

### Phase 3 — Command Center (3-4 days)
- Create `src/app/admin/komuta-merkezi/page.tsx` (new main dashboard)
- Build CommandHeader, AttentionCenter, PlatformPulse sections
- Build MarketplaceHealth, OperationsCenter sections
- Build RecentActivity, QuickActions sections
- Wire navigation to existing admin pages
- Server component with section-level error isolation
- Loading, empty, and error states per section
- [STOP FOR APPROVAL]

### Phase 4 — User 360° (2-3 days)
- Create `/admin/kullanicilar/[id]/page.tsx`
- Build UserHeader (identity, status, metadata, actions)
- Build UserOverview (account info, status, platform summary)
- Build supported tabs (Jobs, Offers, Reviews, Certificates, Disputes)
- Wire cross-entity navigation to Company and Job 360
- Loading, empty, and error states per tab
- [STOP FOR APPROVAL]

### Phase 5 — Company 360° (2-3 days)
- Create `/admin/firmalar/[id]/page.tsx`
- Build CompanyHeader (identity, status, metadata, actions)
- Build CompanyOverview (info, owner, verification, summary)
- Build supported tabs (Team, Jobs, Reviews, Subscription)
- Wire cross-entity navigation to User and Job 360
- Loading, empty, and error states per tab
- [STOP FOR APPROVAL]

### Phase 6 — Job 360° (2-3 days)
- Create `/admin/isler/[id]/page.tsx`
- Build JobHeader (identity, status, metadata, actions)
- Build JobOverview (info, participants, status, marketplace summary)
- Build supported tabs (Offers, Participants, Timeline, Messages, Reviews+Disputes)
- Wire cross-entity navigation to User and Company 360
- Loading, empty, and error states per tab
- [STOP FOR APPROVAL]

### Phase 7 — Cross-Entity Experience (1-2 days)
- Verify all entity links work in both directions
- URL state for tabs (searchParams-based)
- Browser back/forward stability
- Keyboard navigation
- [STOP FOR APPROVAL]

### Phase 8 — Responsive & Accessibility (1 day)
- Test all Command Center sections at all breakpoints
- Test all 360° tabs at all breakpoints
- Verify heading hierarchy, landmarks, keyboard nav
- Verify color contrast for status badges
- Verify screen reader announcements for loading/error states
- [STOP FOR APPROVAL]

### Phase 9 — Performance & Regression (1 day)
- Review query patterns, reduce N+1
- Verify existing CRUD operations intact
- Verify auth + permissions
- Build test
- Run lint + typecheck
- [STOP FOR APPROVAL]

---

**Phase 1 complete. Awaiting approval to proceed with Phase 2.**
