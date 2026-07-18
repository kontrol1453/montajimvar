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
  fallbackStrategy: "rules" | "cache" | "error";
}

const PROMPT_REGISTRY: Record<string, PromptDefinition> = {
  "photo-analysis-v1": {
    id: "photo-analysis-v1",
    version: "1.0.0",
    name: "Photo Analysis",
    locale: "tr",
    systemPrompt: `Sen bir montaj ve kurulum uzmanısın. Gönderilen fotoğrafları analiz ederek ürünleri, montaj zorluğunu, gerekli aletleri, işçilik süresini ve riskleri belirle. Sadece JSON formatında yanıt ver.`,
    userTemplate: `Fotoğraf sayısı: {{photoCount}}
Kategori: {{category}}
Açıklama: {{description}}

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
  },
  "job-analysis-v1": {
    id: "job-analysis-v1",
    version: "1.0.0",
    name: "Job Analysis",
    locale: "tr",
    systemPrompt: `Sen bir montaj işi analiz uzmanısın. İş ilanını analiz ederek açıklama kalitesini değerlendir, eksik detayları belirle, gerekli sertifika ve ekipmanları tespit et, güvenlik endişelerini ve zorluk seviyesini tahmin et. Sadece JSON formatında yanıt ver.`,
    userTemplate: `Başlık: {{title}}
Açıklama: {{description}}
Kategori: {{category}}
Şehir: {{city}}
Acil Durum: {{urgency}}
Fotoğraf Sayısı: {{photoCount}}

{
  "descriptionQuality": "low|medium|high",
  "missingDetails": ["string"],
  "requiredCertifications": ["string"],
  "requiredEquipment": ["string"],
  "safetyConcerns": [{"issue": "string", "severity": "low|medium|high"}],
  "estimatedDifficulty": "easy|medium|hard|expert",
  "estimatedDuration": {"min": number, "max": number, "unit": "hours|days"},
  "estimatedWorkforce": {"min": number, "max": number},
  "recommendations": ["string"]
}`,
    outputFormat: "json",
    temperature: 0.3,
    maxTokens: 1024,
    fallbackStrategy: "rules",
  },
};

export function getPrompt(id: string, locale?: string): PromptDefinition {
  const prompt = PROMPT_REGISTRY[id];
  if (!prompt) throw new Error(`Prompt bulunamadı: ${id}`);
  return prompt;
}

export function renderPrompt(id: string, vars: Record<string, string>, locale?: string): { systemPrompt: string; userPrompt: string } {
  const prompt = getPrompt(id, locale);
  let userPrompt = prompt.userTemplate;
  for (const [key, val] of Object.entries(vars)) {
    userPrompt = userPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val);
  }
  return { systemPrompt: prompt.systemPrompt, userPrompt };
}

export function listPrompts(): PromptDefinition[] {
  return Object.values(PROMPT_REGISTRY);
}
