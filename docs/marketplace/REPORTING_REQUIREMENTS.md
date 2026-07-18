# Reporting Requirements

## Current Reporting Capabilities

### Admin Summary (`GET /api/admin/summary`)

Returns a comprehensive platform overview with 4 sections:

```json
{
  "platform": {
    "totalUsers", "totalProfiles", "totalJobs",
    "totalOffers", "totalJobReviews", "totalFirmReviews"
  },
  "marketplace": {
    "jobsWithOffers", "jobsWithoutOffers", "jobsEligibleForOffers",
    "averageOffersPerJob", "acceptedOffers", "offerAcceptanceRate",
    "completedJobs", "cancelledJobs", "completionRate",
    "activeJobs", "pendingJobs", "offersReceivedJobs"
  },
  "operations": {
    "unverifiedProfiles", "openDisputes", "totalDisputes",
    "pendingCertificates"
  },
  "financial": {
    "totalRevenue", "totalCommission", "totalPayments",
    "latestPayment", "subscriptionRevenue", "subscriptionCount"
  }
}
```

### Admin Job Detail (`GET /api/admin/jobs/[id]/detail`)

Tabs: offers, participants, timeline, messages, reviews/disputes, payment.

### Admin Audit Logs (`GET /api/admin/audit-logs`)

Route exists but **no audit events are emitted** from user-facing actions.

### Admin Export (`GET /api/admin/export`)

Route exists — purpose/format unknown.

## Missing Reporting Features

### P1 — Critical

| Report | Why | Suggested Implementation |
|---|---|---|
| **Revenue over time** (daily/weekly/monthly) | Track platform growth | Aggregate payments by `releasedAt`, group by date |
| **Job trend analysis** | Understand supply/demand | Count jobs/offers by day, category, city over time |
| **Artisan performance metrics** | Identify top/bottom performers | Offer acceptance rate, completion rate, avg rating per artisan |
| **Customer retention** | Understand repeat usage | Count jobs per customer, time between jobs, churn rate |
| **Category popularity** | Optimize category structure | Job count, offer count, completion rate per category |
| **City-level breakdown** | Geographic expansion decisions | Jobs, artisans, completion rate per city |

### P2 — High Value

| Report | Why | Suggested Implementation |
|---|---|---|
| **Conversion funnel** | Understand where users drop off | View job → submit offer → accept offer → complete → review → pay |
| **Response time metrics** | Marketplace efficiency | Avg time to first offer, avg time to acceptance, avg job duration |
| **Dispute rate** | Quality monitoring | % of jobs resulting in dispute, by category/city/artisan |
| **Premium conversion** | Subscription effectiveness | Free → paid conversion rate, premium retention rate |
| **Seasonal demand patterns** | Capacity planning | Job volume by month, category, region |
| **Top search terms** | SEO + product direction | Aggregate search query analytics |

### P3 — Enhancement

| Report | Why |
|---|---|
| **Artisan earnings distribution** | Fairness monitoring |
| **Customer satisfaction by artisan** | Quality assurance |
| **Photo analysis trends** | What products are most commonly assembled? |
| **Price elasticity by category** | Optimize AI price estimation |
| **NPS / User satisfaction survey** | Product direction |

## Dashboard-Level Reporting

### Current State

- **Admin dashboard**: Only the summary endpoint (aggregate stats)
- **Artisan dashboard**: viewCount, ratingAvg, reviewCount, sentMessages, favoriteCount, jobCount, offerCount
- **Customer dashboard**: totalBudget, monthlySpent
- **No charts, no historical trends, no export**

### Recommended Dashboard Enhancements

1. **Admin Analytics Page**: Time-series charts for jobs, users, revenue
2. **Artisan Earnings Page**: Monthly/quarterly/yearly earnings with breakdowns
3. **Customer Spend Report**: Per-category spend, per-month comparison
4. **Automated Email Reports**: Weekly/monthly summaries for admins

## Audit Trail Requirements

### Current State
- Audit log route exists but never called
- JobTimeline captures job status changes (good)
- No user action logging (login, profile edit, offer submit)

### Recommended
- Instrument key actions: user registration, login, job create, offer submit, offer accept/reject, payment release, profile update, dispute open/resolve
- Store in `AuditLog` table: actor, action, target type, target ID, metadata (JSON), IP, user agent, timestamp
- Expose via admin audit log API
- Support filtering by action type, user, date range
