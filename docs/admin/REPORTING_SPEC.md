# Reporting Center Specification

## Overview
A new `/admin/reports` page providing visual analytics, exportable reports, and data-driven insights.

## Page Structure

### 1. Report Navigation
```
Reports
├── Dashboard Overview
├── User Analytics
│   ├── User Growth (daily/weekly/monthly)
│   ├── Role Distribution
│   ├── Geographic Distribution
│   └── Retention / Churn
├── Marketplace Analytics
│   ├── Job Volume & Trends
│   ├── Offer Conversion Funnel
│   ├── Category Performance
│   └── Completion Rates by City
├── Financial Reports
│   ├── Revenue Summary
│   ├── Commission Analysis
│   ├── Subscription Metrics
│   └── Payment Method Breakdown
├── Operational Reports
│   ├── Dispute Resolution Time
│   ├── Verification Pipeline
│   ├── Certificate Approval Rate
│   └── Admin Workload Analysis
└── Custom Reports (future)
    ├── Saved Reports
    └── Report Builder
```

### 2. Dashboard Overview
- **KPIs row**: MRR, ARPU, New Users (7d), Active Jobs, Conversion Rate
- **Sparkline trend**: Each KPI with 30-day mini trend
- **Date range picker**: 7d / 30d / 90d / 1y / Custom
- **Export button**: CSV, PDF (future)

### 3. User Analytics
- **Growth chart**: Line chart with new users per period
- **Role pie**: Donut chart showing CUSTOMER vs ASSEMBLER vs MANUFACTURER
- **Geo map**: Heat map of users by city (or table if map not feasible)
- **City table**: City → user count → profile count → job count

### 4. Marketplace Analytics
- **Job volume bar chart**: Jobs created per month (last 12)
- **Status funnel**: Pending → Offers → Assigned → In Progress → Completed
- **Category leaderboard**: Top categories by job count, with average budget
- **City table**: City → job count → avg offers → completion rate

### 5. Financial Reports
- **Revenue area chart**: Monthly revenue with commission overlay
- **Subscription growth**: Cumulative subscription revenue, active subscribers
- **Top customers**: By total spend (job payments)
- **Escrow snapshot**: Current escrow amounts, aging analysis

### 6. Operational Reports
- **Dispute stats**: Avg resolution time (hours), resolution method breakdown
- **Certificates**: Pending vs approved, approval rate trend
- **Admin audit trail**: Actions per admin (pie), most common action types
- **Verification pipeline**: Queue size, avg wait time, SLAs

## Data API

### New API endpoint
```
GET /api/admin/reports
  ?type=users|jobs|financial|operations
  &period=7d|30d|90d|1y|custom
  &from=ISO_DATE
  &to=ISO_DATE
  &groupBy=day|week|month
```

Response shape:
```json
{
  "meta": { "period": "30d", "generatedAt": "..." },
  "data": { ... type-specific payload },
  "charts": { ... pre-computed chart series }
}
```

## Technical Notes

### When to aggregate server-side vs client-side
- Server-side: Large datasets (all users, all jobs), pre-computed chart series
- Client-side: Small datasets (< 1000 rows), real-time calculations

### Charting library
- Use `recharts` (already available in Next.js ecosystem)
- Components: AreaChart, BarChart, PieChart, LineChart
- Responsive containers with aspect ratio

### Performance considerations
- Cache report results server-side (30s-5min TTL depending on report)
- Lazy-load charts below the fold
- Paginate large tables (city breakdowns, user lists)
