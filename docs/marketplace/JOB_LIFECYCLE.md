# Job Lifecycle

## State Diagram

```
                      ┌─────────────────────────────────────────────┐
                      │                  JOB                        │
                      │  id, title, description, city, address,     │
                      │  budgetMin, budgetMax, urgency, scheduledDate│
                      │  status, customerId, timeline[], offers[]   │
                      └─────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────────┐
         ▼                          ▼                              ▼
   ┌──────────┐             ┌──────────────┐              ┌──────────────┐
   │ pending  │────────────►│offers_received│◄─────────────│  cancelled   │
   └──────────┘             └──────────────┘              └──────────────┘
         │                          │
         │                          ▼
         │                   ┌────────────┐
         └──────────────────►│  assigned  │
                              └────────────┘
                                    │
                                    ▼
                              ┌──────────┐
                              │en_route  │
                              └──────────┘
                                    │
                                    ▼
                              ┌─────────────┐
                              │ in_progress │
                              └─────────────┘
                                    │
                                    ▼
                              ┌─────────────┐
                              │  completed  │
                              └─────────────┘
                                    │
                                    ▼
                              ┌───────────────┐
                              │review_pending │
                              └───────────────┘
                                    │
                                    ▼
                              ┌─────────────────┐
                              │payment_pending  │
                              └─────────────────┘
                                    │
                                    ▼
                              ┌────────┐
                              │  paid  │
                              └────────┘
```

## State-by-State Details

### 1. `pending`
- **Entry**: Customer submits job via `POST /api/jobs`
- **Data**: title, description, categoryIds (via JobCategory join), city, budget range, urgency, scheduled date, photos (via upload)
- **Timeline entry**: `"İş oluşturuldu"` + `"İş onaylandı"` (two entries)
- **Visibility**: Listed in search results, visible to all artisans
- **Actions**: Artisans can submit offers; Customer can cancel

### 2. `offers_received`
- **Entry**: First artisan submits an offer (auto-transition from pending)
- **Data**: All offers visible to customer
- **Visibility**: Same as pending (listed in search)
- **Actions**: Customer can accept an offer or cancel
- **Notes**: Not set manually — the offers_received transition is triggered by `POST /api/offers` when the job is still `pending`

### 3. `assigned`
- **Entry**: Customer accepts an offer via `PATCH /api/offers/[id]`
- **Data**: Accepted offer stored; all other offers rejected; Payment record created (status: escrow)
- **Timeline entry**: `"Teklif kabul edildi"`
- **Visibility**: Job still listed in search but artisans can no longer submit offers
- **Actions**: Start work (→ en_route); Cancel (by either party or admin)

### 4. `en_route`
- **Entry**: Artisan transitions via `PATCH /api/jobs/[id]` (artisan is on the way)
- **Data**: No additional required
- **Visibility**: Listed in active search
- **Actions**: Start work (→ in_progress); Cancel

### 5. `in_progress`
- **Entry**: Customer or artisan transitions via `PATCH /api/jobs/[id]`
- **Data**: No additional required data
- **Visibility**: Reduced visibility in search
- **Actions**: Complete work; Cancel

### 6. `completed`
- **Entry**: Customer transitions via `PATCH /api/jobs/[id]`
- **Data**: No additional required data
- **Visibility**: Not listed in active search
- **Actions**: Review (→ review_pending); Cancel
- **Note**: JobReview can be created at this stage

### 7. `review_pending`
- **Entry**: Customer completes review via `PATCH /api/jobs/[id]`
- **Data**: Review rating and comment
- **Visibility**: Not listed in active search
- **Actions**: Proceed to payment (→ payment_pending)

### 8. `payment_pending`
- **Entry**: Job transitions from review_pending
- **Data**: No additional
- **Visibility**: Not listed in active search
- **Actions**: Release payment (artisan → paid)

### 9. `paid`
- **Entry**: Artisan (or admin) releases payment via `PATCH /api/payments/[id]`
- **Data**: Payment status updated to `released`, `releasedAt` set
- **Timeline entry**: `"Ödeme serbest bırakıldı"`
- **Visibility**: Not listed in active search
- **Actions**: Terminal state — no further transitions allowed

### 7. `cancelled`
- **Entry**: Any status via `PATCH /api/jobs/[id]` with `status: "cancelled"`
- **Timeline entry**: `"İş iptal edildi"`
- **Visibility**: Not listed in active search
- **Actions**: None (terminal state)

## Timeline Model

Each status change creates a `JobTimeline` entry:
```prisma
model JobTimeline {
  id        Int      @id @default(autoincrement())
  jobId     Int
  status    String
  note      String?
  createdAt DateTime @default(now())
  job       Job      @relation(fields: [jobId], references: [id])
}
```

## Payment Lifecycle (alongside job)

```
Job assigned ──► Payment created (status: "escrow")
                      │
                      │ (job completes)
                      ▼
Payment released (status: "released", releasedAt set)
```

- Payment is always created when job transitions to `assigned` (in the offer-accept handler)
- Amount is set from the accepted offer's amount
- Commission is stored as a separate field on Payment
- Only the assigned artisan or admin can release payment
- No refund/cancel payment logic exists

## Data Integrity Issues

1. **No caller-role validation on status transitions** — `PATCH /jobs/[id]` only checks if the transition is valid, not who initiates it
2. **Payment creation is implicit** — Happens inside the offer-accept handler; if it fails, the job status is already updated but payment may be missing
3. **No deadline enforcement** — No timeout for pending offers, no auto-cancel for stalled jobs
4. **No concurrent-offer race condition handling** — If two artisans submit offers at the exact same time, both could trigger `offers_received` redundantly
