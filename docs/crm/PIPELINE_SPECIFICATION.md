# Pipeline Specification

## Overview

The CRM pipeline transforms how Montajım Var tracks customer relationships from "interested visitor" to "repeat customer." It runs parallel to the existing marketplace job lifecycle — a Deal may or may not result in a Job.

## Pipeline Stages

### Default Pipeline

| # | Stage | Slug | Color | Probability | Type |
|---|---|---|---|---|---|
| 1 | Yeni Talep | new_lead | `#0B5FFF` | 10% | Active |
| 2 | Kalifiye | qualified | `#8B5CF6` | 25% | Active |
| 3 | Teklif Hazırlığı | proposal | `#F59E0B` | 40% | Active |
| 4 | Görüşme | negotiation | `#EC4899` | 60% | Active |
| 5 | Kazanıldı | won | `#00C853` | 100% | Terminal (Won) |
| 6 | Kaybedildi | lost | `#EF4444` | 0% | Terminal (Lost) |
| 7 | Arşiv | archived | `#6B7280` | 0% | Terminal (Archived) |

### Stage Transitions

```
new_lead ──► qualified ──► proposal ──► negotiation ──► won
   │            │             │              │
   ├──► lost    ├──► lost     ├──► lost      ├──► lost
   └──► archived └──► archived └──► archived  └──► archived
```

### Stage Details

**1. Yeni Talep (New Lead)**
- Entry: Lead created (from favorite, website form, manual entry, import)
- Required: name, source, contact info
- Owner: auto-assigned or unassigned
- Next action: Contact lead within 24h

**2. Kalifiye (Qualified)**
- Entry: Lead confirmed as genuine opportunity
- Required: budget range, city, service category
- Probability increased: 25%
- Next action: Prepare proposal/service quote

**3. Teklif Hazırlığı (Proposal)**
- Entry: Detailed proposal/quote prepared
- Required: proposal document or quote items
- Owner must set: expected value, expected close date
- Next action: Send proposal, schedule follow-up

**4. Görüşme (Negotiation)**
- Entry: Proposal sent, active discussion
- Can be linked to a marketplace Job (if customer posts job)
- Owner must set: next action, next action date
- Probability increased: 60%

**5. Kazanıldı (Won)**
- Entry: Deal accepted
- Linked Job moves to "assigned" or "completed"
- Lead optionally converted to User (if from anonymous source)
- Terminal state

**6. Kaybedildi (Lost)**
- Entry: Deal rejected or lost to competitor
- Required: lost reason (price, quality, timing, competitor, no response)
- Terminal state — can be re-opened

**7. Arşiv (Archived)**
- Entry: Deal inactive for >6 months or explicitly archived
- Terminal — can be re-opened

## Deal Fields

| Field | Type | Required | Source |
|---|---|---|---|
| title | String | Yes | Manual / Job.title |
| description | Text | No | Manual / Job.description |
| value | Decimal | Yes | Manual / Offer.amount / Budget range |
| probability | Int (0-100) | Yes | Stage default + manual override |
| stageId | Int | Yes | Selected stage |
| customerId | Int? | No | Linked User (if registered) |
| profileId | Int? | No | Linked Profile (if B2B) |
| ownerId | Int? | No | Assigned admin/sales person |
| jobId | Int? | No | Linked marketplace Job |
| expectedCloseAt | DateTime? | No | Manual |
| closedAt | DateTime? | Auto | Set when won/lost |
| lostReason | String? | Required on lost | Manual |
| nextAction | String? | No | Manual |
| nextActionDate | DateTime? | No | Manual |

## Integration with Marketplace

### Deal → Job Conversion

When a Deal in "negotiation" stage results in a marketplace Job:

```
Deal (negotiation) ──► Customer posts Job ──► Deal.jobId = Job.id
                                               Deal.stage = won (if job accepted)
                                               Job.customerId ──► Deal.customerId
```

### Job → Deal Creation

When a marketplace Job is created by a new customer without an existing Deal:

```
Job (pending) ──► Auto-create Deal (new_lead)
                   Deal.title = Job.title
                   Deal.value = Job.budgetMax
                   Deal.customerId = Job.customerId
                   Deal.jobId = Job.id
```

## Pipeline API

### `GET /api/crm/pipeline` — Pipeline overview
```
?stage=all&owner=1&dateFrom=2024-01-01&dateTo=2024-12-31
→ { stages: [{ stage, deals: [], totalValue, count }], totals }
```

### `GET /api/crm/deals` — List deals
```
?stageId=1&ownerId=1&customerId=1&page=1&limit=20
→ { deals: [], pagination }
```

### `POST /api/crm/deals` — Create deal
```json
{ "title": "...", "value": 5000, "stageId": 1, "customerId": 1 }
```

### `PATCH /api/crm/deals/[id]` — Update deal (stage transition, etc.)
```json
{ "stageId": 2, "probability": 50, "nextAction": "Send proposal" }
```

### `DELETE /api/crm/deals/[id]` — Soft-delete/archive

## Pipeline Dashboard Widgets

1. **Pipeline Funnel**: Deals by stage, showing count + total value
2. **Win Rate**: Won vs Lost ratio over selected period
3. **Average Deal Value**: By stage, by owner, by category
4. **Expected Revenue**: Sum of deal.probability × deal.value per stage
5. **Stale Deals**: Deals above stage with no activity in >7 days
6. **Owner Performance**: Deals won per owner per month
