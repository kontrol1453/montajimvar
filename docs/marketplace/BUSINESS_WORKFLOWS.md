# Business Workflows

## 1. Customer: Post a New Job

**Path**: `/is-ver` → 5-step wizard (`JobCreateClient.tsx`)

| Step | Component | Fields | API Call |
|---|---|---|---|
| 1. Category | `StepCategory.tsx` | Select categories (multi-select) | `GET /api/categories` (preloaded) |
| 2. Photos | `StepPhotos.tsx` | Upload photos (drag-drop or file picker) | `POST /api/upload` |
| 3. Location | `StepLocation.tsx` | City (dropdown), district, address, coordinates | none (client-side) |
| 4. Details | `StepDetails.tsx` | Title, description, urgency, budget range, scheduled date, contact info | `POST /api/analyze` (AI price estimation) |
| 5. Confirm | `StepConfirm.tsx` | Review all data, accept KVKK/privacy, submit | `POST /api/jobs` |

**AI Price Estimation** (`/api/analyze`):
- Uses `price-analyzer.ts` with category-based base prices × city multiplier × urgency multiplier × complexity factor
- Optionally uses Gemini Vision (`vision-analyzer.ts`) to analyze uploaded photos for product count, difficulty, tools needed
- Returns: `{ minPrice, maxPrice, suggestedPrice, duration, confidence }`

**After Submission**:
- Job created with status `"pending"`
- Admin notification sent via `notifyAdmin()`
- Artisans can now discover and bid on the job

---

## 2. Artisan: Submit an Offer

**Trigger**: Artisan browses jobs → clicks "Teklif Ver" on job detail page

**Backend** (`POST /api/offers`):
1. Validates: user is ASSEMBLER or MANUFACTURER
2. Validates: job is in "pending" or "offers_received" status
3. Validates: artisan hasn't already submitted an offer for this job
4. Creates Offer with artisan's ID, amount, duration, description
5. If job status was "pending", updates to "offers_received"
6. Returns offer with job + artisan info

**Artisan's Dashboard View**: `/dashboard/teklifler` lists all offers with status (pending/accepted/rejected/withdrawn)

---

## 3. Customer: Accept an Offer

**Trigger**: Customer reviews offers → clicks "Kabul Et"

**Backend** (`PATCH /api/offers/[id]` with `action: "accept"`):
1. Validates: current user is job customer
2. Validates: offer is still "pending"
3. Updates offer status to "accepted"
4. Updates job status to "assigned"
5. Rejects all other pending offers on this job
6. Creates Payment record (status = "escrow")

**Result**: Job is assigned, payment is created in escrow, other artisans notified (implicitly)

---

## 4. Job Execution Flow

| Step | Actor | Action | API | Job Status |
|---|---|---|---|---|
| Accept offer | Customer | Accepts artisan's offer | `PATCH /offers/[id]` | assigned |
| Start work | Customer/Artisan | Confirms job started | `PATCH /jobs/[id]` {status: "in_progress"} | in_progress |
| Complete work | Customer | Marks job done | `PATCH /jobs/[id]` {status: "completed"} | completed |
| Release payment | Artisan | Confirms payment received | `PATCH /payments/[id]` | paid |
| Leave review | Customer | Rates job experience | `POST /jobs/[id]/review` | stays paid |

**Note**: There is no explicit route for starting work. The `PATCH /jobs/[id]` route accepts any valid status transition regardless of who calls it — it only validates the transition is allowed, NOT the caller's role. This is a bug: anyone could technically transition any job.

---

## 5. Artisan Profile Creation

**Path**: `/dashboard/firma` → `FirmaForm.tsx`

**Flow**:
1. User must have ASSEMBLER or MANUFACTURER role
2. Fill in: company name, categories (multi-select), primary category, city, working cities, description, address, phone, WhatsApp, website, coordinates, insurance/guarantee toggles
3. Submit → `POST /api/profiles` (upsert)
4. If new profile: admin notification sent
5. Photos can be added afterward via `ImageGallery` component

---

## 6. Subscription / Premium

**Path**: `/dashboard/uyelik`

**Flow**:
1. Artisan browses subscription plans → selects one
2. `POST /api/subscriptions` with `planId`
3. If plan is free → activated immediately (profile.premiumUntil set)
4. If plan is paid → returns error: "Ödeme entegrasyonu yakında aktif olacak"
5. Premium benefits: higher search ranking, premium badge, showcase support (from dashboard UI text)

**Current State**: Subscription plans are modeled and admin-manageable, but paid plans cannot actually be purchased.

---

## 7. Messaging

Two messaging systems exist:

### Direct Messages (`/api/messages`)
- User-to-user private messages
- Sender must have permission (`can_send_message`)
- Permission check on profile lookup via sender profile
- Used in `/dashboard/mesajlar`

### Job Messages (`/api/job-messages`)
- Threaded messages scoped to a specific job
- Only customer and assigned artisan can read/write
- Read receipts (auto-mark as read when fetching)
- Supports file attachments

---

## 8. Reviews

Two review models:

### Firm Review (`/api/reviews`)
- Profile-scoped
- Upsert (one review per user per profile)
- Updates profile `ratingAvg` and `reviewCount`
- Permission check required (`leave_review`)

### Job Review (`/api/jobs/[id]/review`)
- Job-scoped, one per job
- Validates job is completed (not paid or in_progress)
- Prevents duplicate reviews
- Recalculates artisan rating after submission

---

## 9. Cancellation Flow

**Trigger**: Any party (or admin) cancels a job

**Backend** (`PATCH /jobs/[id]` with `status: "cancelled"`):
1. Validates the transition is allowed from current status
2. Creates timeline entry with note
3. Sets job status to "cancelled"

**Note**: No constraint on WHO can cancel — the route only checks the transition is valid, not the caller's relationship to the job.

---

## 10. Disputes

**Current State**: Admin-only
- `GET /api/admin/disputes` lists all disputes with job + user + payment info
- No user-facing dispute creation endpoint exists
- No dispute resolution workflow (admin actions on disputes)
