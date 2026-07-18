# Installer Recommendation Engine

## Purpose

Match customers with the best artisans for their specific job requirements using multiple weighted signals — not random selection or simple date sorting.

## Current State

No recommendation engine exists. Artisans browse jobs manually. Customers browse profiles manually. Sorting is `createdAt desc` only.

## Scoring Algorithm

```
Score = Σ(weight_i × signal_i) for all signals

Each signal normalized to 0-100
Total score: 0-100
```

### Signal Weights

| Signal | Weight | Source | Notes |
|---|---|---|---|
| Category Match | 25% | ProfileCategory ∩ JobCategory | Critical — artisan must cover the job's category |
| City Match | 20% | Profile.city = Job.city | Primary city match (mandatory filter) |
| Working City Match | 5% | JSON workingCities includes job city | Bonus if artisan covers multiple cities |
| Rating Score | 10% | Profile.ratingAvg | Normalized: rating/5 × 100 |
| Completed Jobs | 10% | Number of jobs with accepted offers | Signal of reliability |
| Offer Acceptance Rate | 10% | Accepted / (Accepted + Rejected + Withdrawn) | Higher = selective but confident |
| Response Speed | 5% | Avg time to first offer after job posted | Faster = more attentive |
| Premium Status | 5% | premiumUntil > now | Platform incentive |
| Review Count | 5% | Number of firm reviews | More reviews = more trustworthy |
| Insurance/Guarantee | 5% | hasInsurance, hasGuarantee | Professionalism signal |

### Scoring Implementation

```typescript
// lib/ai/scoring/installer-score.ts
interface InstallerProfile {
  id: number;
  userId: number;
  companyName: string;
  city: string;
  workingCities: string[];
  categoryIds: number[];
  ratingAvg: number;
  reviewCount: number;
  completedJobs: number;
  offerAcceptanceRate: number;
  avgResponseTime: number;
  premiumUntil: Date | null;
  hasInsurance: boolean;
  hasGuarantee: boolean;
}

interface JobRequirements {
  categoryIds: number[];
  city: string;
}

const WEIGHTS = {
  CATEGORY_MATCH: 0.25,
  CITY_MATCH: 0.20,
  WORKING_CITY_MATCH: 0.05,
  RATING: 0.10,
  COMPLETED_JOBS: 0.10,
  ACCEPTANCE_RATE: 0.10,
  RESPONSE_SPEED: 0.05,
  PREMIUM: 0.05,
  REVIEW_COUNT: 0.05,
  INSURANCE_GUARANTEE: 0.05,
};

function calculateScore(installer: InstallerProfile, job: JobRequirements): number {
  let score = 0;

  // Category match (25%)
  const catOverlap = installer.categoryIds.filter(c => job.categoryIds.includes(c)).length;
  const catMatch = job.categoryIds.length > 0 ? catOverlap / job.categoryIds.length : 0;
  score += catMatch * 100 * WEIGHTS.CATEGORY_MATCH;

  // City match (20%) — mandatory, 0 if no match
  const cityMatch = installer.city === job.city ? 1 : 0;
  if (cityMatch === 0) {
    // Check working cities
    const workingCityMatch = installer.workingCities.includes(job.city) ? 0.5 : 0;
    score += workingCityMatch * 100 * WEIGHTS.CITY_MATCH;
  } else {
    score += 100 * WEIGHTS.CITY_MATCH;
  }

  // Rating (10%)
  score += (installer.ratingAvg / 5) * 100 * WEIGHTS.RATING;

  // Completed jobs (10%)
  const jobScore = Math.min(installer.completedJobs / 50, 1) * 100 * WEIGHTS.COMPLETED_JOBS;
  score += jobScore;

  // Acceptance rate (10%)
  score += installer.offerAcceptanceRate * 100 * WEIGHTS.ACCEPTANCE_RATE;

  // Response speed (5%)
  const speedScore = installer.avgResponseTime < 3600 ? 100 : // < 1 hour
    installer.avgResponseTime < 86400 ? 50 : // < 24 hours
    0;
  score += speedScore * WEIGHTS.RESPONSE_SPEED;

  // Premium (5%)
  if (installer.premiumUntil && installer.premiumUntil > new Date()) {
    score += 100 * WEIGHTS.PREMIUM;
  }

  // Review count (5%)
  const reviewScore = Math.min(installer.reviewCount / 20, 1) * 100 * WEIGHTS.REVIEW_COUNT;
  score += reviewScore;

  // Insurance/Guarantee (5%)
  if (installer.hasInsurance) score += 50 * WEIGHTS.INSURANCE_GUARANTEE;
  if (installer.hasGuarantee) score += 50 * WEIGHTS.INSURANCE_GUARANTEE;

  return Math.round(score);
}
```

## API

### `POST /api/ai/recommend/installers`

```json
// Request
{
  "jobId": 123,
  "limit": 10,
  "minScore": 30
}

// Response
{
  "success": true,
  "jobId": 123,
  "recommendations": [
    {
      "profileId": 45,
      "userId": 100,
      "companyName": "Ahmet Usta Montaj",
      "score": 87,
      "breakdown": {
        "categoryMatch": 100,
        "cityMatch": 100,
        "rating": 88,
        "experience": 60,
        "responseTime": 100,
        "premium": 100
      },
      "strengths": ["Premium üye", "Yüksek puanlı", "Hızlı yanıt veriyor"],
      "concerns": [],
      "premium": true
    }
  ],
  "totalCandidates": 15,
  "engine": "hybrid",
  "computedAt": "2025-01-15T10:00:00Z"
}
```

## Caching

- Cache key: `recommend:${jobId}:${categoryIds}:${city}`
- TTL: 5 minutes (scores change as artisans complete jobs)
- Invalidate: When a new offer is submitted for the job

## Exclusion Rules

An installer is excluded from recommendations if:
1. Already submitted an offer for this job
2. Blocked/suspended by admin
3. Has an active dispute on a job with this customer
4. Self-excluded categories (marked as unavailable)

## Display Strategy

```
Recommended Installers (sorted by score):
┌──────────────────────────────────────┐
│ ★ Ahmet Usta Montaj     Score: 87   │
│ Premium • ⭐ 4.8 • 150 iş • 🚗 3km  │
│ Kategoriler: Mobilya, Mutfak        │
│ 💰 2 teklif • ⏱️ < 1 saat           │
├──────────────────────────────────────┤
│ Mehmet Montaj Hizmet    Score: 72   │
│ ⭐ 4.5 • 89 iş • 🚗 8km            │
└──────────────────────────────────────┘
```
