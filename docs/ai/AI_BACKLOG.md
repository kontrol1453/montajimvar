# AI Backlog

## P0 — AI Infrastructure (Critical)

| # | Item | Description | Effort |
|---|---|---|---|
| 1 | **Provider abstraction layer** | Create `lib/ai/provider.ts` with provider-agnostic interface | 2h |
| 2 | **Prompt registry** | Create `lib/ai/prompts/` with centralized prompt templates, versioning, locale | 2h |
| 3 | **AI audit logging** | Log every AI call with prompt version, latency, tokens, errors | 1h |
| 4 | **Input sanitization** | PII detection, prompt injection guards, length limits | 1h |
| 5 | **API key security** | Move key from URL to header, add key validation | 0.5h |
| 6 | **Auth on analyze endpoint** | Require auth on `/api/ai/*` routes | 0.5h |
| 7 | **Rate limiting** | Per-user daily/hourly limits for AI calls | 1h |

## P1 — Core AI Services

| # | Item | Description | Effort |
|---|---|---|---|
| 8 | **Photo analysis service** | Refactor `vision-analyzer.ts` to use provider abstraction + prompt registry | 2h |
| 9 | **Job analysis service** | Create job analysis using AI + rules hybrid | 3h |
| 10 | **Installer recommendation engine** | Build scoring algorithm, create API endpoint | 3h |
| 11 | **Auto job analysis on creation** | Fire-and-forget job analysis when job is created | 1h |
| 12 | **AI-powered search sorting** | Replace `createdAt desc` with relevance/score sorting | 2h |

## P2 — Enhanced Estimation

| # | Item | Description | Effort |
|---|---|---|---|
| 13 | **Enhanced price estimation** | Add AI enhancement layer to existing rule engine | 3h |
| 14 | **Risk analysis service** | Identify project risks with severity classification | 3h |
| 15 | **Quote drafting service** | Generate quote drafts from job + recommendation data | 3h |
| 16 | **Historical price data** | Use completed job data to refine estimates | 2h |

## P3 — Advanced Features

| # | Item | Description | Effort |
|---|---|---|---|
| 17 | **Quality inspection** | Before/after photo comparison | 4h |
| 18 | **Knowledge assistant** | Installation procedures, regulations Q&A | 4h |
| 19 | **Document analysis** | PDF/Word/Excel parsing + entity extraction | 4h |
| 20 | **Route optimization** | Multi-job sequencing for artisans | 3h |
| 21 | **Mobile-ready AI** | Lightweight endpoints, offline cache | 2h |
| 22 | **A/B testing framework** | Compare prompt versions on real traffic | 2h |

## Not Building (Out of Scope)

- Custom ML model training (no data science team)
- Real-time video analysis
- Voice/audio processing
- AI-powered chatbot for customer support
- Generated 3D models or AR previews
