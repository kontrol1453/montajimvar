# Marketplace Architecture

## Overview

Montajım Var is a two-sided marketplace connecting **Customers** (job posters) with **Artisans** (assemblers, manufacturers, and other service providers). The platform mediates job discovery, offer submission, acceptance, execution, payment, and review — all within a single system.

## Domain Model (Core Entities)

| Entity | Role | Key Relationships |
|---|---|---|
| **User** | Platform identity; has roles (CUSTOMER, ASSEMBLER, MANUFACTURER, ADMIN) | owns Profile, sends/receives Messages, creates Jobs, submits Offers |
| **Profile** | Artisan business card (company name, city, categories, rating) | belongs to User, has many Categories via ProfileCategory, receives Reviews |
| **Job** | Work request posted by Customer | belongs to Customer, has many Offers, has JobTimeline, JobMessages, JobReview |
| **Offer** | Artisan's bid on a Job | belongs to Artisan, references Job, has amount + duration |
| **Payment** | Escrow-like payment per Job | references Customer + Artisan + Job; status: escrow → released |
| **Review** | Firm-level review (not per-job) | belongs to Profile, created by User; upserted (one per user per profile) |
| **JobReview** | Per-job review after completion | belongs to Job |
| **Message** | Direct user-to-user messaging | belongs to sender + receiver |
| **JobMessage** | Job-scoped thread messages | belongs to Job + sender |
| **Dispute** | Job dispute (admin-resolved) | references Job, openedBy User, may reference Payment |
| **Subscription** | Premium plan for artisans | linked to Profile via subscriptionId + premiumUntil |

## API Layer Architecture

All routes follow Next.js App Router conventions with `route.ts` files.

```
/api/
├── auth/          # kayit (register), email-verify, refresh, sifre-sifirla, mobile-login
├── jobs/          # CRUD + status transitions + reviews
├── offers/        # CRUD + accept/reject/withdraw
├── profiles/      # artisan profile CRUD + search
├── payments/      # escrow release (PATCH /payments/[id])
├── reviews/       # firm-level review CRUD
├── messages/      # direct user messaging
├── job-messages/  # job-scoped threaded messaging
├── subscriptions/ # plan signup, cancel, reactivate, payment history
├── favorites/     # toggle + list favorite profiles
├── categories/    # category listing + search
├── analyze/       # AI price estimation + photo analysis
├── admin/         # summary, users, profiles, disputes, categories, skills, blog, export
├── upload/        # file upload + malware review
└── user/          # profile update, avatar, portfolio
```

## Data Flow: Job Lifecycle

```
CUSTOMER creates Job (POST /api/jobs)
    │
    ▼
Job status = "pending"
    │
    ▼
Artisans browse/search → submit Offers (POST /api/offers)
    │
    ▼
Customer reviews offers → accepts one (PATCH /offers/[id] { action: "accept" })
    │
    ▼
Job status = "assigned" (the accepted Offer)
Customer can now release Payment → creates Payment record
    │
    ▼
Artisan arrives → Customer confirms start (PATCH /jobs/[id] → "in_progress")
    │
    ▼
Job completed → Customer marks complete (PATCH /jobs/[id] → "completed")
    │
    ▼
Artisan releases escrow payment (PATCH /payments/[id])
    │
    ▼
Job status = "paid"
    │
    ▼
Reviews completed (POST /api/jobs/[id]/review)
```

## Payment Model

The `Payment` model acts as a simple escrow system:
- **Created** when a job is accepted (along with status change to "assigned")
- **Status flow**: `escrow` → `released`
- **Release**: Only the assigned artisan or an admin can release payment
- **Commission**: Platform commission is stored on the Payment record
- **Important limitation**: No `POST /api/payments` route exists — payment creation happens implicitly during job status transitions, which means there's no actual payment gateway integration yet

## State Machine: Job Status

```
pending ──► offers_received ──► assigned ──► in_progress ──► completed ──► paid
  │                                │              │               │
  └──► cancelled              ┌────┘              └──► cancelled  │
                              │                                    │
                              └──► cancelled                        └──► cancelled
```

Valid transitions (from `jobs/[id]/route.ts`):
- `pending` → `offers_received` | `cancelled`
- `offers_received` → `assigned` | `cancelled`
- `assigned` → `in_progress` | `cancelled`
- `in_progress` → `completed` | `cancelled`
- `completed` → `paid` | `cancelled`
- `paid` → (terminal state; no further transitions allowed)

## Authorization Model

Roles are stored as `String[]` on User (default `["CUSTOMER"]`):
- **CUSTOMER**: Can create jobs, review offers, message artisans, leave reviews
- **ASSEMBLER**: Can create profile, submit offers, accept jobs, receive payment
- **MANUFACTURER**: Same as ASSEMBLER (functionally identical in current code)
- **ADMIN**: Full access to admin panel

Permission checks are done via:
1. `(session.user as any).roles?.includes("ADMIN")` — admin gate
2. `hasPermission(userRole, permissionName)` — permission-based checks (used in reviews, favorites)
3. Direct ownership checks (`job.customerId === userId`, `offer.artisanId === userId`)

## Known Gaps

1. **No real payment gateway** — `MockPayment` provider, no Stripe/Iyzico integration
2. **No middleware.ts** — No centralized auth/redirect middleware
3. **Dispute API is admin-only** — No user-facing dispute creation endpoint
4. **No notification system** — `notifyAdmin` exists but no user notification API route
5. **Upload/review route exists but no virus/malware scanning** — `upload/review/route.ts` exists as a stub
6. **No WebSocket/polling** — Messages rely on page refresh; no real-time updates
7. **Admin audit-log route exists** but no audit events are emitted from user-facing routes
