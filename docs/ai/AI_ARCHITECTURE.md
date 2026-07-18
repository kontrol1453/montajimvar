# AI Architecture

## Design Principles

1. **Provider abstraction** — All AI providers behind a common interface; swap providers without changing business logic
2. **No hardcoded prompts** — Every prompt is a named, versioned template stored in a registry
3. **Confidence-first** — Every AI output includes a confidence score; never present AI output as certain
4. **Human-in-the-loop** — Critical decisions (pricing, installer assignment) require human review
5. **Observability** — Every AI call is logged with prompt version, latency, tokens, errors
6. **Async by default** — Heavy AI tasks (vision, document analysis) run asynchronously
7. **Security-first** — Input sanitization, prompt injection guards, PII detection

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AI System Boundary                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Sync APIs  │  │  Async Jobs │  │  Webhooks   │    │
│  │ (analyze,   │  │ (vision,    │  │ (provider   │    │
│  │  estimate)  │  │  doc_check) │  │  callbacks) │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │           │
│         ▼                ▼                ▼           │
│  ┌──────────────────────────────────────────────────┐ │
│  │              AI Orchestrator                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │
│  │  │ Prompt   │ │ Provider │ │ Audit & Metrics  │ │ │
│  │  │ Registry │ │ Router   │ │ Logger           │ │ │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │ │
│  └──────────────────────────────────────────────────┘ │
│         │                │                            │
│         ▼                ▼                            │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │ Gemini   │    │ OpenAI   │    │  Local   │         │
│  │ Adapter  │    │ Adapter  │    │  Rules   │         │
│  └──────────┘    └──────────┘    │  Engine  │         │
│                                  └──────────┘         │
│  ┌──────────────────────────────────────────────────┐ │
│  │              AI Services Layer                    │ │
│  │  PhotoAnalysis │ JobAnalysis │ PriceEstimation   │ │
│  │  Recommendation│ RiskAnalysis│ QuoteDraft        │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Provider Abstraction Interface

```typescript
// lib/ai/provider.ts — Core abstraction

interface AIProvider {
  name: string;
  chat(messages: Message[], options?: ChatOptions): Promise<AIResponse>;
  analyze(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  promptVersion?: string;
}

interface AIResponse {
  content: string;
  model: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  latency: number;
  confidence: number;
}
```

## Prompt Registry Architecture

```typescript
// lib/ai/prompts.ts — Centralized prompt management

interface PromptTemplate {
  id: string;
  version: string;
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  responseFormat: "json" | "text" | "markdown";
  fallbackBehavior: "return_null" | "use_rules" | "error";
  maxTokens: number;
  temperature: number;
  model?: string;
  locale: "tr" | "en";
}

const PROMPTS: Record<string, PromptTemplate> = {
  "photo-analysis-v1": {
    id: "photo-analysis",
    version: "1.0.0",
    name: "Photo Analysis",
    description: "Analyze installation photos for product detection, difficulty, tools needed",
    systemPrompt: "Sen bir montaj ve kurulum uzmanısın...",
    userPromptTemplate: "Bu montaj işi fotoğraflarını analiz et: {{photoCount}} fotoğraf",
    responseFormat: "json",
    fallbackBehavior: "return_null",
    maxTokens: 1024,
    temperature: 0.2,
    locale: "tr",
  },
};
```

## Async Processing Architecture

```typescript
// lib/ai/queue.ts — Async job dispatch

interface AIJob {
  id: string;
  type: "photo_analysis" | "job_analysis" | "document_analysis";
  status: "pending" | "processing" | "completed" | "failed";
  input: unknown;
  output?: unknown;
  error?: string;
  promptVersion?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}
```

## Security Layer

```typescript
// lib/ai/security.ts — Before calling any AI provider

function sanitizeInput(input: string): string {
  // Strip prompt injection patterns
  // Remove sensitive data patterns (email, phone, TCKN)
  // Limit input length
}

function detectPII(text: string): { hasPII: boolean; types: string[] } {
  // Regex patterns for Turkish identity number, email, phone, etc.
}
```

## Audit Logging

Every AI call produces:
```typescript
interface AIAuditLog {
  id: string;
  userId?: number;
  promptId: string;
  promptVersion: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latency: number;
  confidence: number;
  success: boolean;
  error?: string;
  cached: boolean;
  createdAt: Date;
}
```
