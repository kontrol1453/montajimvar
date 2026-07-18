# Marketplace Backlog

Priority: P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

---

## P0 — Critical Bugs & Security

| # | Title | Area | Description |
|---|---|---|---|
| 1 | **No caller validation on job status transitions** | jobs/[id] | `PATCH /jobs/[id]` doesn't verify the caller is the job's customer. Any authenticated user can transition any job's status. |
| 2 | **Payment creation is implicit with no rollback** | offers/[id] | If payment creation fails after offer is accepted, job shows "assigned" but no payment record exists. Wrap in transaction. |
| 3 | **Profile search has no pagination** | profiles | `GET /api/profiles` returns all matching profiles without pagination — will break with scale. |
| 4 | **No input validation library** | all | No Zod / yup / joi anywhere. All validation is manual and inconsistent. |
| 5 | **Dispute system is admin-only read** | disputes | No user-facing dispute creation. No dispute resolution actions. |

---

## P1 — High Value Features

| # | Title | Area | Description |
|---|---|---|---|
| 6 | **Premium search ranking** | search | UI promises premium artisans get higher ranking, but orderBy is always `createdAt desc`. Implement scoring: premium > rating > completedCount > createdAt. |
| 7 | **Geolocation matching** | search | Lat/lng stored on profiles and jobs but never used. Add radius-based matching. |
| 8 | **Full-text search** | search | Replace ILIKE with PostgreSQL tsvector for ranking and performance. |
| 9 | **Multi-category filtering** | search | Allow filtering by multiple categories (not just one). |
| 10 | **WorkingCities as Many-to-Many** | profiles | Currently stored as JSON string. Convert to ProfileWorkingCity join table for queryable matching. |
| 11 | **User-facing dispute creation** | disputes | Allow customers/artisans to open disputes. Admin can resolve. |
| 12 | **Paid subscription plans** | subscriptions | Payment gateway integration to unlock paid plan purchases. |
| 13 | **Job status transition timeout** | jobs | Auto-cancel jobs stuck in "pending" for >7 days or "in_progress" for >30 days. |
| 14 | **Middleware for auth/redirect** | app | Add middleware.ts to handle auth gating, role-based redirects, and session refresh. |
| 15 | **Real-time messaging** | messages | Add WebSocket or polling for message notifications. |

---

## P2 — Medium Value

| # | Title | Area | Description |
|---|---|---|---|
| 16 | **Email/push notifications for new jobs** | notifications | Alert artisans when matching jobs are posted (by category + city). |
| 17 | **Search relevance scoring** | search | Weight title > description > category in search results. |
| 18 | **Profile completion score** | profiles | Show % complete, encourage filling missing fields. |
| 19 | **Saved searches / job alerts** | search | Allow artisans to save search criteria and get notified. |
| 20 | **Revenue over time reporting** | admin/admin | Time-series charts for revenue, jobs, users. |
| 21 | **Conversion funnel analytics** | admin | Track job → offer → accept → complete → review → pay conversion. |
| 22 | **Job offer auto-withdraw** | offers | Allow artisans to set expiry on offers. |
| 23 | **Offer counter/negotiation** | offers | Let customers counter an offer instead of just accept/reject. |
| 24 | **Bulk job operations (admin)** | admin | Batch cancel, reassign, or export jobs. |
| 25 | **City landing pages SEO** | public | Dynamic SEO pages per city × category (route exists but content may be thin). |

---

## P3 — Low Value / Nice to Have

| # | Title | Area | Description |
|---|---|---|---|
| 26 | **AI auto-reply for common questions** | messages | Simple FAQ bot for common customer queries. |
| 27 | **Portfolio showcase** | profiles | Let artisans create project portfolios with before/after photos. |
| 28 | **Admin activity log** | admin | Instrument key user actions into the audit log table. |
| 29 | **Customer loyalty program** | users | Discounts or badges for repeat customers. |
| 30 | **Mobile push notifications** | notifications | Via Firebase or similar (send-push route exists). |
| 31 | **Multi-language support** | i18n | English + Arabic + Russian for expat community. |
| 32 | **Marketplace API for third parties** | api | Public REST API for enterprise customers. |
| 33 | **Schedule optimization** | jobs | Suggest optimal appointment times based on artisan calendar. |
| 34 | **Weather-aware scheduling** | jobs | Outdoor job scheduling with weather API integration. |
| 35 | **Gamification** | platform | Artisan levels, badges, achievements. |

---

## Phase Priority Summary

### Phase A — Security & Integrity (P0)
Implement immediately: items 1-5

### Phase B — Core Matching & Search (P1)
Next sprint: items 6-10

### Phase C — Monetization & Disputes (P1)
Parallel with Phase B: items 11-12

### Phase D — Reliability (P1)
Items 13-15

### Phase E — Growth & Analytics (P2)
Items 16-25

### Phase F — Polish (P3)
Items 26-35
