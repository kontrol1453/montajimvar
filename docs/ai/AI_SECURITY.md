# AI Security Specification

## Threat Model

| Threat | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Prompt Injection | AI outputs attacker-controlled content | High | Input sanitization, role isolation |
| PII Leakage | Customer data exposed via AI | Medium | PII detection, data masking |
| API Key Theft | Unauthorized AI usage, cost | Medium | Key in header, not URL; key rotation |
| Cost Abuse | Excessive API calls | High | Rate limiting, auth, budget alerts |
| Hallucination | False operational recommendations | Medium | Human-in-the-loop, confidence scoring |
| Model Inversion | Sensitive data extracted from model | Low | Input restrictions, prompt boundaries |
| Unauthorized Access | Non-customers use AI features | Medium | Auth on all AI endpoints |

## Input Sanitization

```typescript
// lib/ai/security/sanitize.ts

const SENSITIVE_PATTERNS = [
  /\b\d{11}\b/, // Turkish TC Kimlik No
  /\b\d{10}\b/, // Turkish phone (without prefix)
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
  /0[5-7]\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/, // Turkish phone
  /(?:TCKK|TCKN|T.C.|TC)\s*[:\-]?\s*\d{11}/i, // TCKN with prefix
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|below)\s+(instructions|prompts?|commands?)/i,
  /forget\s+(all\s+)?(previous|above|below)/i,
  /you\s+(are\s+)?(now|not\s+bound)/i,
  /override\s+(instructions|prompts?|rules)/i,
  /system\s+(prompt|instruction|message)/i,
  /new\s+(instruction|task|role)/i,
];

export function sanitizeAIInput(input: string): string {
  let sanitized = input;

  // Limit length
  if (sanitized.length > 4000) {
    sanitized = sanitized.slice(0, 4000);
  }

  // Remove sensitive data
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }

  // Strip prompt injection attempts
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[FILTERED]");
  }

  return sanitized;
}

export function detectPII(text: string): { hasPII: boolean; types: string[] } {
  const detected: string[] = [];
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      if (pattern.source.includes('\\d{11}')) detected.push('TCKN');
      else if (pattern.source.includes('@')) detected.push('EMAIL');
      else if (pattern.source.includes('05')) detected.push('PHONE');
    }
  }
  return { hasPII: detected.length > 0, types: detected };
}
```

## API Security

### 1. Authentication
All AI endpoints require authentication:
```typescript
// All /api/ai/* routes require session
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
}
```

### 2. Rate Limiting
```typescript
// Per-user daily limits
const RATE_LIMITS = {
  "photo_analysis": { daily: 50, hourly: 20, costPerCall: 0.01 },
  "job_analysis": { daily: 100, hourly: 30, costPerCall: 0.005 },
  "estimation": { daily: 200, hourly: 50, costPerCall: 0.002 },
  "recommendation": { daily: 500, hourly: 100, costPerCall: 0.001 },
};
```

### 3. API Key Protection
```typescript
// NEVER pass API key in URL
// GOOD:
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
};

// BAD (current implementation):
const url = `https://generativelanguage.googleapis.com/v1beta/models/...?key=${GEMINI_API_KEY}`;
```

## Output Validation

Every AI response must be validated before returning to user:

```typescript
function validateAIOutput(output: unknown, schema: JSONSchema): ValidationResult {
  // 1. Parse JSON if needed
  // 2. Validate against schema (using Zod or similar)
  // 3. Check for PII in output
  // 4. Check maximum values (no million-TL prices)
  // 5. Check for unsafe recommendations
  // 6. Return result
}
```

### Output Constraints

| Field | Constraint | Reason |
|---|---|---|
| Price min | ≥ 100₺ | Minimum realistic job price |
| Price max | ≤ 500,000₺ | Maximum realistic job price |
| Duration | ≥ 0.5 hours, ≤ 240 hours | 10 day max |
| Workers | ≥ 1, ≤ 10 | Realistic crew size |
| Rating | 1-5 | Scale bound |
| Confidence | 0-1 | Probability bound |

## Audit Logging

All AI interactions are logged:

```typescript
// Stored in AIAuditLog model or as JSON in existing AuditLog
interface AIAuditEntry {
  id: string;
  timestamp: Date;
  userId: number;
  endpoint: string;
  promptId: string;
  promptVersion: string;
  provider: string;
  model: string;
  inputLength: number;
  inputTokens: number;
  outputTokens: number;
  latency: number;
  success: boolean;
  error?: string;
  hasPII: boolean;
  injectionAttempt: boolean;
  cost: number;
}
```

## Security Checklist

- [ ] All AI endpoints require authentication
- [ ] API keys sent via headers, never URLs
- [ ] Input sanitized for PII and injection
- [ ] Rate limiting enforced per user/IP
- [ ] Output validated against schema
- [ ] Maximum price/duration bounds enforced
- [ ] PII detected and redacted in logs
- [ ] Injection attempts logged and flagged
- [ ] Cost tracked per user per day
- [ ] Admin alert on anomaly (sudden cost spike)

## Incident Response

| Scenario | Response |
|---|---|
| Cost spike > 2x normal | Auto-disable AI for that user, notify admin |
| Injection detected | Log, block request, flag user for review |
| PII in output | Log, sanitize response, alert security |
| Model outage | Fallback to rule-based engine, log outage |
| Rate limit breach | Return 429, log attempt |
