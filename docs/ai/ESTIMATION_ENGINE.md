# Estimation Engine Specification

## Current State (price-analyzer.ts)

Rule-based engine with:
- 14 category base prices (hardcoded)
- 10 city multipliers
- 3 urgency multipliers
- Keyword-based complexity scoring

## Enhanced Architecture

The estimation engine combines rule-based logic (fast, predictable) with AI enhancement (accurate, adaptive).

```
┌─────────────────┐     ┌──────────────────────┐
│  Input: Job     │────►│  Rule Engine (always) │
│  Details        │     │  - Category base      │
└─────────────────┘     │  - City multiplier    │
                         │  - Urgency multiplier  │
                         │  - Complexity score    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  AI Enhancement       │
                         │  (if enabled)         │
                         │  - Historical prices  │
                         │  - Seasonality        │
                         │  - Material costs     │
                         │  - Similar jobs       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Human Review         │
                         │  (for high-value)     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Output: Price Range  │
                         │  + Confidence Score   │
                         └──────────────────────┘
```

## Price Components

### 1. Labor Cost
- Base hourly rate per category (from price-analyzer.ts)
- Adjusted by city (Istanbul +30%, Ankara +15%, etc.)
- Adjusted by urgency (normal ×1.0, urgent ×1.15, very urgent ×1.3)
- Multiplied by estimated hours × workers

### 2. Travel Cost
- `baseRate × distance` if coordinates available
- If no coordinates: flat rate based on city size (büyükşehir: 200₺, diğer: 100₺)
- Future: Google Maps Distance Matrix API integration

### 3. Material Cost
- AI-estimated based on detected products and installation type
- Rule-based fallback using category defaults (e.g., mobilya: 200₺, klima: 500₺)

### 4. Platform Fee
- Commission percentage (configurable, currently 10-15%)
- Displayed separately from artisan earnings

## Confidence Scoring

| Factor | Weight | Source |
|---|---|---|
| Data completeness | 30% | How many fields filled |
| Category match | 20% | Known category → price mapping |
| Photo availability | 15% | Photos available = higher confidence |
| Historical match | 20% | Similar completed jobs in DB |
| AI consistency | 15% | AI vs rule engine agreement |

### Confidence Tiers
- **High** (≥80): All major fields filled + photos + historical match
- **Medium** (50-79): Basic info present, some uncertainty
- **Low** (<50): Sparse data, first-time category, no historical reference

## API

### `POST /api/ai/estimate`

```json
// Request
{
  "jobId": 123,
  "categoryIds": [1, 2],
  "categoryNames": ["Mobilya Montajı", "Aydınlatma"],
  "city": "İstanbul",
  "urgency": "acil",
  "description": "IKEA gardırop + avize montajı",
  "photoCount": 3,
  "useAI": true
}

// Response
{
  "success": true,
  "estimatedRange": {
    "min": 3500,
    "max": 6500,
    "suggested": 5000
  },
  "confidence": 0.82,
  "breakdown": {
    "labor": { "min": 2000, "max": 4000 },
    "materials": { "min": 300, "max": 600 },
    "travel": 350,
    "platformFee": 500
  },
  "factors": [
    { "name": "İstanbul fiyat faktörü", "impact": 1.3, "description": "İstanbul'da işçilik maliyeti %30 yüksek" },
    { "name": "Acil durum", "impact": 1.15, "description": "Acil işlerde %15 fiyat artışı" },
    { "name": "Karmaşıklık", "impact": 1.2, "description": "Birden fazla kategori ve özel alet gerekiyor" }
  ],
  "similarJobs": [
    { "title": "Gardırop Montajı", "amount": 2500, "city": "İstanbul" },
    { "title": "Avize Montajı + Mobilya", "amount": 4000, "city": "Ankara" }
  ],
  "engine": "hybrid", // "rules" | "ai" | "hybrid"
  "promptVersion": "estimation-v1"
}
```

## Historical Data Integration

```sql
-- Query to find similar completed jobs for price reference
SELECT 
  AVG(o.amount) as avg_price,
  COUNT(*) as sample_size,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY o.amount) as p25,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY o.amount) as p75
FROM offers o
JOIN jobs j ON j.id = o.job_id
JOIN job_categories jc ON jc.job_id = j.id
WHERE jc.category_id IN ($1) -- Same categories
  AND j.city = $2 -- Same city
  AND o.status = 'accepted' -- Only accepted offers (market rate)
  AND j.created_at > NOW() - INTERVAL '6 months' -- Recent 6 months
```

## Estimation Accuracy Metrics

| Metric | Current (Rules) | Target (AI-Enhanced) |
|---|---|---|
| Mean Absolute Error | Unknown (no tracking) | < 20% deviation |
| Within 25% of actual | Unknown | > 70% of estimates |
| Confidence calibration | None | Confidence ~ actual accuracy |
| Coverage | 14 categories | All categories |
