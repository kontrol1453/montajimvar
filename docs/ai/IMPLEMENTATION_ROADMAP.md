# AI Implementation Roadmap

## Phase A — P0: AI Infrastructure (Day 1-2)

### Day 1: Core Architecture
```bash
# Create AI infrastructure files
mkdir -p src/lib/ai/prompts
mkdir -p src/lib/ai/security
mkdir -p src/app/api/ai
```

**Files to create:**
1. `src/lib/ai/provider.ts` — Provider abstraction (GeminiAdapter + fallback)
2. `src/lib/ai/prompts/index.ts` — Prompt registry + `getPrompt()`/`renderPrompt()`
3. `src/lib/ai/prompts/photo-analysis.ts` — Photo analysis prompt template
4. `src/lib/ai/prompts/job-analysis.ts` — Job analysis prompt template
5. `src/lib/ai/security/sanitize.ts` — Input sanitization, PII detection, injection guards
6. `src/lib/ai/audit.ts` — AI audit logging utility

### Day 2: API Security & Rate Limiting
7. `src/app/api/ai/route.ts` — AI router (auth-gated)
8. Add auth requirement to existing `/api/analyze`
9. Fix Gemini API key from URL → header in `vision-analyzer.ts`
10. Add rate limiting middleware

## Phase B — P1: Core AI Services (Day 3-5)

### Day 3: Photo Analysis Refactor
1. Rewrite `vision-analyzer.ts` to use provider abstraction
2. Move prompt to registry
3. Add response validation
4. Add audit logging to analysis calls

### Day 4: Job Analysis Service
1. Create `src/lib/ai/services/job-analysis.ts`
2. Create `src/app/api/ai/analyze/job/route.ts`
3. Hook into job creation flow (`POST /api/jobs` → fire-and-forget analysis)

### Day 5: Installer Recommendation
1. Create `src/lib/ai/scoring/installer-score.ts`
2. Create `src/app/api/ai/recommend/installers/route.ts`
3. Add caching layer

## Phase C — P2: Enhanced Estimation (Week 2)
Enhanced price estimation, risk analysis, quote drafting

## Phase D — P3: Advanced (Week 3+)
Quality inspection, knowledge assistant, document analysis

## P0 Implementation — Files to Create/Modify

### New Files
```
src/lib/ai/
├── provider.ts        # Provider abstraction (GeminiAdapter)
├── audit.ts           # AI audit logging
├── prompts/
│   ├── index.ts       # Prompt registry
│   ├── photo-analysis.ts
│   └── job-analysis.ts
├── security/
│   └── sanitize.ts    # Input sanitization + PII detection
└── scoring/
    └── installer-score.ts  # Recommendation scoring

src/app/api/ai/
├── route.ts           # AI status/health
├── analyze/
│   └── route.ts       # Refactored analyze endpoint
├── analyze/
│   └── job/route.ts   # Job analysis endpoint
└── recommend/
    └── installers/route.ts  # Installer recommendation
```

### Modified Files
```
src/lib/vision-analyzer.ts   # Use provider abstraction
src/app/api/analyze/route.ts # Add auth + rate limiting
src/app/api/jobs/route.ts    # Add job analysis trigger
```

## Implementation Order (P0)

### Step 1: Provider Abstraction (`provider.ts`)

```typescript
// Core interface
export interface AIProviderConfig {
  provider: "gemini" | "openai" | "rules";
  model?: string;
  apiKey?: string;
}

// Provider router
export function getAIProvider(config?: AIProviderConfig): AIProvider {
  const provider = config?.provider || process.env.AI_PROVIDER || "gemini";
  switch (provider) {
    case "gemini": return new GeminiProvider();
    case "openai": return new OpenAIProvider();
    default: return new RuleBasedProvider(); // Always available fallback
  }
}
```

### Step 2: Prompt Registry (`prompts/index.ts`)
Registry with `getPrompt(id)`, `renderPrompt(id, vars)`, version tracking.

### Step 3: Security (`security/sanitize.ts`)
Input sanitization + PII detection.

### Step 4: Audit (`audit.ts`)
Fire-and-forget audit logging for every AI call.

### Step 5: Fix Vision Analyzer
Replace direct Gemini call with `getAIProvider().chat()`.

### Step 6: Auth on Analyze
Add session check to `/api/analyze`.

## Rollback Plan

Each change is isolated:
- Provider abstraction: Old code still works if import fails
- Prompt registry: Can revert to hardcoded prompts by changing import
- Rate limiting: Disabled by env var `AI_RATE_LIMIT=0`
- Auth on analyze: Can be toggled by removing middleware check
