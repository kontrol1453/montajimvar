# Prompt Library Specification

## Architecture

All prompts are defined once in a central registry, versioned, and referenced by ID from business logic.

```
lib/ai/prompts/
├── index.ts          # Registry export
├── photo-analysis.ts # Photo analysis prompts
├── job-analysis.ts   # Job analysis prompts
├── estimation.ts     # Price estimation prompts
├── recommendation.ts # Installer recommendation prompts
├── risk-analysis.ts  # Risk assessment prompts
├── quote-draft.ts    # Quote drafting prompts
└── knowledge.ts      # Knowledge assistant prompts
```

## Prompt Registry

```typescript
// lib/ai/prompts/index.ts

interface PromptDefinition {
  id: string;
  version: string;
  name: string;
  locale: string;
  systemPrompt: string;
  userTemplate: string;
  outputFormat: "json" | "text" | "markdown";
  temperature: number;
  maxTokens: number;
  model?: string;
  fallbackStrategy: "rules" | "cache" | "error";
}

const PROMPT_REGISTRY: Record<string, PromptDefinition> = {
  // All prompt definitions here — never in controllers
};

export function getPrompt(id: string, locale?: string): PromptDefinition {
  const prompt = PROMPT_REGISTRY[id];
  if (!prompt) throw new Error(`Prompt not found: ${id}`);
  return prompt;
}

export function renderPrompt(id: string, vars: Record<string, string>, locale?: string): string {
  const prompt = getPrompt(id, locale);
  let rendered = prompt.userTemplate;
  for (const [key, val] of Object.entries(vars)) {
    rendered = rendered.replace(`{{${key}}}`, val);
  }
  return rendered;
}
```

## Prompt Definitions

### `photo-analysis-v1` — Photo Analysis

```typescript
{
  id: "photo-analysis-v1",
  version: "1.0.0",
  locale: "tr",
  systemPrompt: `Sen bir montaj ve kurulum uzmanısın. 
Gönderilen fotoğrafları analiz ederek:
1. Ürünleri ve adetlerini tespit et
2. Montaj zorluğunu değerlendir (kolay/orta/zor)
3. Gerekli aletleri belirle
4. İşçilik süresini ve kişi sayısını tahmin et
5. Olası riskleri belirle
6. Eksik bilgileri tespit et

Sadece JSON formatında yanıt ver.`,
  userTemplate: `Fotoğraf sayısı: {{photoCount}}
Kategori: {{category}}
Açıklama: {{description}}

JSON çıktısı:
{
  "products": [{"name": "string", "count": number, "confidence": 0-1}],
  "difficulty": "easy|medium|hard",
  "difficultyConfidence": 0-1,
  "estimatedHours": number,
  "estimatedWorkers": number,
  "specialTools": ["string"],
  "risks": ["string"],
  "missingInfo": ["string"],
  "suggestedQuestions": ["string"]
}`,
  outputFormat: "json",
  temperature: 0.2,
  maxTokens: 1024,
  fallbackStrategy: "error",
}
```

### `job-analysis-v1` — Job Analysis

```typescript
{
  id: "job-analysis-v1",
  version: "1.0.0",
  locale: "tr",
  systemPrompt: `Sen bir montaj işi analiz uzmanısın.
İş ilanını analiz ederek:
1. Açıklama kalitesini değerlendir
2. Eksik detayları belirle
3. Gerekli sertifikaları tespit et
4. Gerekli ekipmanları belirle
5. Güvenlik endişelerini tespit et
6. Zorluk seviyesini tahmin et
7. Süre ve işgücü tahmini yap

Sadece JSON formatında yanıt ver.`,
  userTemplate: `Başlık: {{title}}
Açıklama: {{description}}
Kategori: {{category}}
Şehir: {{city}}
Acil Durum: {{urgency}}
Fotoğraf Sayısı: {{photoCount}}

JSON çıktısı:
{
  "descriptionQuality": "low|medium|high",
  "missingDetails": ["string"],
  "requiredCertifications": ["string"],
  "requiredEquipment": ["string"],
  "safetyConcerns": ["string"],
  "estimatedDifficulty": "easy|medium|hard|expert",
  "estimatedDuration": {"min": number, "max": number, "unit": "hours|days"},
  "estimatedWorkforce": {"min": number, "max": number},
  "recommendations": ["string"]
}`,
  outputFormat: "json",
  temperature: 0.3,
  maxTokens: 1024,
  fallbackStrategy: "rules",
}
```

### `installer-recommendation-v1` — Installer Recommendation

```typescript
{
  id: "installer-recommendation-v1",
  version: "1.0.0",
  locale: "tr",
  systemPrompt: `Sen bir usta eşleştirme uzmanısın.
İş detaylarına ve usta profillerine göre en uygun ustaları öner.
Sadece JSON formatında yanıt ver.`,
  userTemplate: `İş Bilgileri:
- Başlık: {{title}}
- Kategori: {{category}}
- Şehir: {{city}}
- Aciliyet: {{urgency}}

Usta Adayları:
{{candidates}}

Her usta için 0-100 arası puan ver ve puanlama gerekçesini açıkla.

JSON çıktısı:
{
  "recommendations": [
    {
      "userId": number,
      "score": 0-100,
      "scoreBreakdown": {
        "categoryMatch": 0-100,
        "cityMatch": 0-100,
        "rating": 0-100,
        "experience": 0-100,
        "responseTime": 0-100
      },
      "strengths": ["string"],
      "concerns": ["string"]
    }
  ]
}`,
  outputFormat: "json",
  temperature: 0.3,
  maxTokens: 2048,
  fallbackStrategy: "rules",
}
```

## Prompt Versioning Strategy

- **Major version**: Breaking change to output schema (e.g., `v1` → `v2`)
- **Minor version**: Non-breaking addition (e.g., `v1.1` → `v1.2`)
- **Patch version**: Bug fix, wording change (e.g., `v1.0.1`)
- Old versions are retired but NEVER deleted (audit trail)

## Prompt Testing

Each prompt should have:
1. Unit test for template rendering with edge cases
2. Integration test with AI provider (using mocked responses)
3. Output schema validation test

## Fallback Strategy

| Strategy | Behavior | When |
|---|---|---|
| `error` | Return error to caller | No alternative available |
| `rules` | Use rule-based estimation (existing price-analyzer.ts) | AI unavailable or degraded |
| `cache` | Return last successful result if available | Transient failures |
| `degraded` | Return partial result with reduced confidence | Partial response |
