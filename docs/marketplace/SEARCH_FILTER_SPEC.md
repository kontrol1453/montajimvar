# Search & Filter Specification

## Current Search Implementation

### Job Search — `GET /api/jobs`

**Parameters**:
| Param | Type | Behavior |
|---|---|---|
| `q` | string | `WHERE title ILIKE '%q%' OR description ILIKE '%q%'` |
| `categoryId` | int | Filters jobs with matching JobCategory |
| `city` | string | Exact match on job.city |
| `status` | string | Filters by job status (default: shows all except paid/cancelled) |
| `urgency` | string | Exact match |
| `minBudget` / `maxBudget` | int | Budget range filter ($amount × 100) |
| `sort` | string | `newest` (default), `oldest`, `budget_high`, `budget_low` |
| `page` / `limit` | int | Pagination (default: page=1, limit=20) |

**Implementation**: Single Prisma query with dynamic `where` clause and `orderBy` mapping.

**Results projected**: id, title, description, slug, city, district, status, budgetMin, budgetMax, urgency, scheduledDate, createdAt, customer info (name, avatar, ratingAvg), categories, _count: offers.

### Profile (Artisan) Search — `GET /api/profiles`

**Parameters**:
| Param | Type | Behavior |
|---|---|---|
| `categoryId` | int | `WHERE categories.some.categoryId = categoryId` |
| `city` | string | Exact match on profile.city |
| `q` | string | `WHERE companyName ILIKE '%q%' OR description ILIKE '%q%'` |

**Implementation**: Simple Prisma query with dynamic `where`. No pagination, no sorting options, no premium boost.

## Feature Gaps

### Missing Search Features

| Feature | Current State | Priority |
|---|---|---|
| Full-text search (PostgreSQL tsvector) | ILIKE only, no ranking | P1 |
| Geospatial / radius search | Coordinates stored but not queried | P1 |
| Profile search pagination | No pagination on /api/profiles | P1 |
| Premium-boosted ranking | Described in UI, not implemented | P1 |
| Multi-city search | No search across workingCities | P1 |
| Faceted filters (multiple categories, urgency levels) | Single-value filters only | P2 |
| Saved searches / alerts | Not implemented | P2 |
| Sort by rating / completion rate | CreatedAt desc only | P2 |
| Search within photo-analyzed jobs | No photo content metadata | P3 |

### Search Performance Concerns

1. No pagination on profile search — could return thousands of rows
2. `LIKE '%term%'` cannot use B-tree indexes
3. No PostgreSQL full-text search index (tsvector)
4. City/profiles: no index on `profile.city` or `profile.createdAt`

## Recommended Schema Changes

```prisma
// Add full-text search index (via migration)
model Job {
  // ... existing fields
  searchVector Unsupported("tsvector")? @map("search_vector")
  @@index([searchVector], type: Gin)
}

// Normalize workingCities
model ProfileWorkingCity {
  profileId Int
  city      String
  profile   Profile @relation(fields: [profileId], references: [id])
  @@id([profileId, city])
}
```

## Recommended API Changes

### Enhanced `GET /api/jobs` (P1)
```typescript
// Add: sorting options
sort: "relevance" | "newest" | "oldest" | "budget_high" | "budget_low" | "offers_count"
// Add: premium boost
premiumFirst: boolean // (default: true)
// Add: multi-category filter
categoryIds: number[] // comma-separated
// Add: budget range with OR logic
budgetMode: "any" | "min" | "max" | "range"
```

### Enhanced `GET /api/profiles` (P1)
```typescript
// Add: pagination
page: number, limit: number
// Add: sorting
sort: "rating" | "jobs_completed" | "newest" | "relevance"
// Add: premium boost
premiumFirst: boolean
// Add: working cities filter
workingCity: string
// Add: insurance/guarantee filter
hasInsurance: boolean
hasGuarantee: boolean
```
