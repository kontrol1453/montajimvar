# Job Analysis Specification

## Purpose

Analyze every job at creation time to evaluate quality, identify missing information, predict difficulty, and generate structured recommendations for both customers and artisans.

## Trigger

Automatic: When a job is created via `POST /api/jobs`
On-demand: Via `POST /api/ai/analyze/job`

## Analysis Dimensions

### 1. Description Quality
| Grade | Criteria | Score |
|---|---|---|
| High | Title > 30 chars, Description > 200 chars, has photos, has budget, has scheduled date | 3/3 |
| Medium | Has title + description but missing budget or photos | 2/3 |
| Low | Minimal description, no photos, no budget | 1/3 |

### 2. Missing Details Detection
Using AI (or rules as fallback) to detect missing critical information:
- Room/wall type (drywall, concrete, brick)
- Measurements (width, height, depth)
- Number of items
- Floor number (elevator access?)
- Existing disassembly needed
- Special tools required
- Parking/access information

### 3. Required Certifications
Based on category:
- **Electrical**: Elektrikçi yetki belgesi
- **Gas/Plumbing**: Tesisatçı sertifikası
- **Climate**: Klima montaj belgesi (required by Turkish law)
- **Height work**: Yüksekte çalışma belgesi

### 4. Safety Concerns
| Signal | Risk |
|---|---|
| "yüksek" / "high" in description | Working at height |
| "elektrik" in description | Electrical risk |
| "ağır" / "heavy" in description | Manual handling risk |
| "cam" / "glass" in description | Breakage risk |
| No elevator mentioned | Stair carry risk |
| "şantiye" / "construction" | PPE required |

### 5. Difficulty Prediction
| Difficulty | Criteria | Estimated Score |
|---|---|---|
| Easy | Single item, standard assembly, < 2 hours | 0-25 |
| Medium | Multiple items, some complexity, 2-4 hours | 26-50 |
| Hard | Custom installation, special tools, 4-8 hours | 51-75 |
| Expert | Structural work, certifications needed, 8+ hours | 76-100 |

## API

### `POST /api/ai/analyze/job`

```json
// Request
{
  "jobId": 123
}

// Response
{
  "success": true,
  "data": {
    "descriptionQuality": "medium",
    "descriptionScore": 2,
    "missingDetails": [
      "Duvar tipi belirtilmemiş",
      "Oda ölçüleri eksik",
      "Asansör bilgisi yok"
    ],
    "requiredCertifications": [],
    "requiredEquipment": [
      "Tornavida seti",
      "Akülü matkap",
      "Su terazisi"
    ],
    "safetyConcerns": [
      { "issue": "Ağır eşya taşıma", "severity": "medium" },
      { "issue": "Merdiven kullanımı", "severity": "low" }
    ],
    "estimatedDifficulty": "medium",
    "difficultyScore": 45,
    "estimatedDuration": { "min": 2, "max": 4, "unit": "hours" },
    "estimatedWorkforce": { "min": 1, "max": 2 },
    "materialRequirements": [
      "Dübel",
      "Vida",
      "Silikon"
    ],
    "recommendations": [
      "Müşteriden duvar tipini öğrenin",
      "Fotoğraf eklemesini isteyin",
      "Asansör bilgisini teyit edin"
    ]
  },
  "confidence": 0.78,
  "warnings": []
}
```

## Integration with Job Creation

```typescript
// In POST /api/jobs, after job creation:
if (process.env.AI_ENABLED === "true") {
  dispatchJobAnalysis(job.id).catch(console.error); // Fire-and-forget
}
```

Analysis result stored in `JobAnalysis` model or as JSON metadata on the Job.

## Benefits

1. **Customers**: Get suggestions to improve their job posts (higher quality → better offers)
2. **Artisans**: Get pre-analyzed jobs with structured info (faster bidding decisions)
3. **Platform**: Better data for matching, estimation, and reporting
4. **Safety**: Proactive risk identification before work starts
