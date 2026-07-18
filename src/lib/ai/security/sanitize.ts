const SENSITIVE_PATTERNS = [
  { regex: /\b\d{11}\b/, type: "TCKN" },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, type: "EMAIL" },
  { regex: /(?:0|\+90)\s*[5-7]\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/, type: "PHONE" },
  { regex: /(?:TCKK|TCKN|T\.C\.|TC)\s*[:\-]?\s*\d{11}/i, type: "TCKN_REF" },
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|below)\s+(instructions|prompts?|commands?)/i,
  /forget\s+(all\s+)?(previous|above|below)\s+(instructions|prompts?)/i,
  /you\s+(are\s+)?(now|not\s+bound\s+by)/i,
  /override\s+(instructions|prompts?|rules|constraints)/i,
  /system\s+(prompt|instruction|message)\s*[:]/i,
  /new\s+(instruction|task|role)\s*[:]/i,
  /act\s+as\s+(?!\w+[’']s\s+(assistant|expert|specialist|technician|installer))/i,
];

export function sanitizeAIInput(input: string): string {
  let sanitized = input;

  if (sanitized.length > 4000) {
    sanitized = sanitized.slice(0, 4000);
  }

  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern.regex, `[${pattern.type}_REDACTED]`);
  }

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[FILTERED]");
  }

  return sanitized;
}

export function detectPII(text: string): { hasPII: boolean; types: string[] } {
  const detected: string[] = [];
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.regex.test(text)) {
      detected.push(pattern.type);
    }
  }
  return { hasPII: detected.length > 0, types: [...new Set(detected)] };
}

export function detectInjectionAttempt(text: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((p) => p.test(text));
}
