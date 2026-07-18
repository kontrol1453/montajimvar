# AI Readiness Report

## Existing AI Features

| Feature | File | Type | Status |
|---|---|---|---|
| Price Estimation | `lib/price-analyzer.ts` | Rule-based (hardcoded multipliers) | Live |
| Photo Vision Analysis | `lib/vision-analyzer.ts` | Gemini 1.5 Flash API | Live (if GEMINI_API_KEY set) |
| Analyze API | `api/analyze/route.ts` | Combined endpoint | Live |

## Architecture Audit

### Price Analyzer (`lib/price-analyzer.ts`)
- **Type**: Deterministic rule engine, not ML/AI
- **Base prices**: 14 categories hardcoded with min/max/hours/workers
- **Multipliers**: City (10 cities), Urgency (3 levels), Complexity (keyword-based)
- **Confidence**: Heuristic (`high` if photos, `medium` if no photos, `low` if no city)
- **Output**: minPrice, maxPrice, suggestedPrice, duration, explanation
- **Issues**: No historical data, no seasonality, no material costs, no dynamic learning

### Vision Analyzer (`lib/vision-analyzer.ts`)
- **Provider**: Google Gemini 1.5 Flash (hardcoded model)
- **Prompt**: Hardcoded string inside function — no prompt management
- **Language**: Turkish (hardcoded in prompt)
- **Max images**: 3 (hardcoded slice)
- **Response parsing**: Regex extraction of JSON from text response
- **Error handling**: Basic try/catch, returns `{success: false, error}`
- **Security**: API key passed as URL query parameter (anti-pattern)
- **Issues**: No rate limiting, no retries, no caching, no prompt versioning, no audit log

### Analyze API (`api/analyze/route.ts`)
- **Auth**: None — unauthenticated users can call (cost exposure)
- **Logging**: None
- **Validation**: Minimal (only `categoryIds?.length` and `city`)
- **Error handling**: None for AI failures — propagates raw errors
- **Caching**: None
- **Async**: Synchronous — blocks HTTP response on AI completion

## Infrastructure Gaps

| Capability | Current State | Required for P0 |
|---|---|---|
| Prompt Management | Hardcoded in source | Centralized prompts with versioning |
| AI Provider Abstraction | Direct Google Gemini call | Provider-agnostic interface |
| Async Processing | None | Queue for heavy AI tasks |
| AI Audit Log | None | Every AI call logged |
| Rate Limiting | None | Per-user/per-IP limits |
| Cost Tracking | None | Token usage per call |
| Security | API key in URL | Key in header, injection guards |
| Caching | None | Response caching |
| Error Handling | Basic try/catch | Structured errors with fallbacks |
| Human-in-the-Loop | None | Review workflow for AI outputs |
| Confidence Scoring | Heuristic | Statistical confidence |
| Retry Logic | None | Exponential backoff |

## Current Prompt Architecture

All prompts are:
- Hardcoded as template literals inside functions
- Not versioned
- Not localized beyond Turkish
- Not auditable
- Not A/B testable
- Not separated from business logic

## Queue & Background Job Readiness

- **No queue system**: No BullMQ, RabbitMQ, or similar
- **No background jobs**: All processing is synchronous
- **Next.js API routes**: Serverless — long-running AI tasks will timeout on Vercel (10s limit)

## Recommendations Summary

### P0 — Must fix immediately
1. Create AI provider abstraction layer
2. Centralize prompt management
3. Add AI audit logging
4. Fix security (API key in URL → header)
5. Add rate limiting to analyze endpoint
6. Add authentication to analyze endpoint

### P1 — Critical for decision engine
7. Move vision analysis to async processing
8. Build recommendation engine logic
9. Enhance job analysis pipeline
10. Add response caching layer

### P2 — Enhances accuracy
11. Historical price data integration
12. Confidence scoring with statistical models
13. Risk analysis framework

### P3 — Advanced features
14. Knowledge assistant
15. Document analysis
16. Quality inspection
