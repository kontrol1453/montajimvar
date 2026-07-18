# Customer Management Specification

## Current State

Customers are represented by the `User` model with:
- Basic fields: name, email, phone, city, avatar
- Role: CUSTOMER (default)
- Related data: Jobs (as customerId), Messages (sent/received), Reviews, Favorites
- Premium: premiumUntil (subscription-based)

## Enhancement Plan

### Phase A (P0) — Unified Customer View

Create a customer detail page aggregating all existing data without new models:

```
Customer Detail:
├── Profile (User fields)
│   ├── name, email, phone, city, avatar
│   ├── created at, last active
│   ├── role(s), premium status
│   └── verification status (email, phone, identity)
├── Job History
│   ├── Active Jobs (assigned, in_progress)
│   ├── Completed Jobs
│   ├── Cancelled Jobs
│   └── Total Spend (sum of completed job budgets)
├── Offer History
│   ├── Offers Received (per job)
│   └── Acceptance Rate
├── Messages
│   ├── Recent conversations
│   └── Unread count
├── Reviews
│   ├── Reviews given (to artisans)
│   └── Reviews received (if also an artisan)
├── Favorites
│   └── Favorite artisans
├── Activity Timeline
│   ├── Job created
│   ├── Offer accepted
│   ├── Job completed
│   ├── Review left
│   └── Message sent
├── Payment History
│   ├── Payments made
│   └── Total spent
└── Notes (CRM staff only)
    └── Internal notes about this customer
```

**Implementation**: `GET /api/crm/customers/[id]` — aggregates from User, Job, Offer, Message, Review, Favorite, Payment, JobTimeline.

### Phase B (P1) — Customer Segments

| Segment | Criteria | CRM Actions |
|---|---|---|
| New | < 30 days since registration | Welcome sequence, first job discount |
| Active | Job posted in last 90 days | Cross-sell, feedback request |
| Repeat | 3+ completed jobs | Loyalty program, referral bonus |
| Dormant | No activity in 90 days | Reactivation campaign |
| High Value | Total spend > 10,000 TL | VIP treatment, priority support |
| At Risk | Open dispute or negative review | Intervention workflow |

### Phase C (P2) — Enhanced Profile

Add optional fields to User (via Profile model extension or new CustomerProfile model):
- `companyName` (for B2B customers)
- `taxId` / `taxOffice`
- `billingAddress`
- `industry`
- `referralSource`
- `notes` (internal CRM)
- `tags` (JSON array for segmentation)

## Customer API

### `GET /api/crm/customers` — List customers
```
?search=name|email|phone&city=istanbul&segment=active&page=1&limit=20&sort=createdAt|totalSpend|lastActive
→ { customers, pagination, aggregations }
```

### `GET /api/crm/customers/[id]` — Customer detail
```
→ Full customer profile with aggregated job, offer, payment, activity data
```

### `PATCH /api/crm/customers/[id]` — Update customer (admin)
```json
{ "notes": "VIP customer - priority response", "tags": ["vip", "istanbul"] }
```

### `GET /api/crm/customers/[id]/timeline` — Customer activity timeline
```
?type=job|offer|payment|message|review&page=1&limit=50
→ Aggregated timeline from all related entities
```

## Customer Detail Page Components

1. **Summary Header**: Name, email, phone, city, avatar, premium badge, segment badge
2. **Stats Row**: Total jobs, total spend, active jobs, reviews given, favorites
3. **Tabbed Detail**:
   - **Jobs Tab**: Table of all jobs with status, date, amount
   - **Payments Tab**: Payment history with amounts, dates, status
   - **Messages Tab**: Recent conversations
   - **Timeline Tab**: Unified activity feed
   - **Notes Tab**: Internal CRM notes (admin only)
4. **Quick Actions**: Send message, create task, create deal, view as artisan

## Data Aggregation Logic

```typescript
// Customer summary stats
async function getCustomerSummary(userId: number) {
  const [
    totalJobs,
    completedJobs,
    totalSpend,
    activeJobs,
    reviewCount,
    favoriteCount,
    lastActive,
  ] = await Promise.all([
    prisma.job.count({ where: { customerId: userId } }),
    prisma.job.count({ where: { customerId: userId, status: "completed" } }),
    prisma.job.aggregate({
      where: { customerId: userId, status: "completed" },
      _sum: { budgetMax: true },
    }),
    prisma.job.count({
      where: { customerId: userId, status: { in: ["assigned", "in_progress"] } },
    }),
    prisma.review.count({ where: { userId } }),
    prisma.favorite.count({ where: { userId } }),
    prisma.message.findFirst({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);
  return { totalJobs, completedJobs, totalSpend, activeJobs, reviewCount, favoriteCount, lastActive };
}
```
