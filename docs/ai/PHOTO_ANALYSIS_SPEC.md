# Photo Analysis Specification

## Current Implementation

Existing `vision-analyzer.ts` sends images to Gemini 1.5 Flash with a hardcoded prompt and parses JSON from the response.

### Problems
1. Synchronous — blocks HTTP response (Vercel 10s timeout risk)
2. No prompt management — prompt is a template literal in code
3. No caching — identical photos re-analyzed each time
4. No auth — `/api/analyze` has no authentication
5. API key in URL — security anti-pattern
6. No rate limiting — cost exposure
7. Max 3 images — hardcoded slice
8. No retry logic — single attempt fails entirely

## Architecture (P0/P1)

```
┌──────────┐    ┌─────────────────┐    ┌──────────────┐
│  Client  │───►│  /api/ai/photo  │───►│  Async Queue │
└──────────┘    └─────────────────┘    └──────┬───────┘
                                              │
         ┌────────────────────────────────────┤
         ▼                                    ▼
  ┌──────────────┐                   ┌──────────────┐
  │  Cache Hit   │                   │  AI Provider  │
  │  (return     │                   │  (process)    │
  │   cached)    │                   └──────┬───────┘
  └──────────────┘                          ▼
                                    ┌──────────────┐
                                    │  Store +      │
                                    │  Notify       │
                                    └──────────────┘
```

## Endpoints

### `POST /api/ai/photo` — Analyze photos (async by default)

```json
// Request
{
  "photoUrls": ["https://...", "https://..."],
  "jobId": 123,
  "categoryIds": [1, 2],
  "description": "IKEA wardrobe assembly"
}

// Response (202 Accepted — if async)
{
  "jobId": "ai-job-uuid",
  "status": "pending",
  "pollUrl": "/api/ai/jobs/ai-job-uuid"
}

// Response (200 OK — if sync, for small payloads)
{
  "success": true,
  "data": {
    "products": [{ "name": "Gardırop", "count": 1, "confidence": 0.95 }],
    "difficulty": "medium",
    "difficultyConfidence": 0.8,
    "estimatedHours": 3,
    "estimatedWorkers": 2,
    "specialTools": ["Tornavida seti", "Akülü matkap"],
    "risks": ["Ağır parçalar", "Yüksek montaj"],
    "missingInfo": ["Duvar tipi", "Oda ölçüleri"],
    "suggestedQuestions": ["Duvar beton mu alçı mı?", "Kaç kişi taşıma yardımı yapabilir?"]
  },
  "confidence": 0.85,
  "promptVersion": "photo-analysis-v1"
}
```

### `GET /api/ai/jobs/[id]` — Poll async job result

```json
{
  "status": "completed",
  "result": { ... },
  "promptVersion": "photo-analysis-v1",
  "completedAt": "2025-01-15T10:00:00Z"
}
```

## Caching Strategy

Cache key: `photo:${hash(photoUrls.sort().join(","))}:${categoryIds.sort().join(",")}`
- TTL: 24 hours for identical photo sets
- Cache invalidation: Manual re-analysis button in admin
- Storage: Redis or PostgreSQL JSON column

## Provider Selection

| Image Count | Recommended Provider | Mode |
|---|---|---|
| 1-3 | Gemini 1.5 Flash | Sync (fast) |
| 4-10 | Gemini 1.5 Pro | Async (better accuracy) |
| 10+ | Batch + Gemini Pro | Async |

## Image Preprocessing

Before sending to AI:
1. Validate format (JPEG, PNG, WebP)
2. Validate max resolution (2048×2048)
3. Strip EXIF metadata (privacy)
4. Compress to max 1MB per image
5. Limit to 10 images per request (hard limit)

## Error Handling

| Error | Response | Action |
|---|---|---|
| No API key configured | 501 Not Implemented | Return clear error |
| Invalid image format | 400 Bad Request | List supported formats |
| Image too large | 400 Bad Request | Suggest limit |
| AI timeout | 408 / 202 (async) | Retry with backoff |
| AI parse error | 500 | Log + return fallback |
| Rate limit exceeded | 429 | Return retry-after header |
