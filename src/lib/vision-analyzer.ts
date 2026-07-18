import { getAIProvider } from "@/lib/ai/provider";
import { sanitizeAIInput, detectPII } from "@/lib/ai/security/sanitize";
import { logAIAudit } from "@/lib/ai/audit";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const VISION_ENABLED = GEMINI_API_KEY.length > 0;

interface VisionAnalysisResult {
  products: { name: string; count: number }[];
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
  estimatedWorkers: number;
  specialTools: string[];
  notes: string[];
}

export async function analyzePhotos(photoUrls: string[]): Promise<{
  success: boolean;
  data?: VisionAnalysisResult;
  error?: string;
}> {
  if (!VISION_ENABLED) {
    return { success: false, error: "AI görsel analizi için API anahtarı ayarlanmamış." };
  }

  if (photoUrls.length === 0) {
    return { success: false, error: "Analiz için fotoğraf gerekli." };
  }

  try {
    const provider = getAIProvider();
    if (provider.name !== "gemini") {
      return { success: false, error: "Görsel analiz için Gemini yapılandırılmamış." };
    }

    const sanitizedDescription = sanitizeAIInput(photoUrls.join(","));

    const res = await provider.chat([
      {
        role: "system",
        content: `Bu montaj işi fotoğraflarını analiz et. Yanıtı TAM TÜRKÇE ve aşağıdaki JSON formatında ver:
{
  "products": [{"name": "ürün adı", "count": adet}],
  "difficulty": "easy|medium|hard",
  "estimatedHours": saat_sayisi,
  "estimatedWorkers": kisi_sayisi,
  "specialTools": ["gerekli aletler"],
  "notes": ["notlar"]
}
Sadece JSON döndür, başka metin yazma.`,
      },
      { role: "user", content: `Fotoğraflar: ${sanitizedDescription}` },
    ], { temperature: 0.2, maxTokens: 1024 });

    const text = res.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "AI yanıtı ayrıştırılamadı." };
    }

    const result: VisionAnalysisResult = JSON.parse(jsonMatch[0]);

    logAIAudit({
      promptId: "photo-analysis-legacy",
      promptVersion: "legacy",
      provider: provider.name,
      model: res.model,
      inputLength: sanitizedDescription.length,
      inputTokens: res.usage.promptTokens,
      outputTokens: res.usage.completionTokens,
      totalTokens: res.usage.totalTokens,
      latency: res.latency,
      success: true,
    }).catch(() => {});

    return { success: true, data: result };
  } catch (err: any) {
    logAIAudit({
      promptId: "photo-analysis-legacy",
      promptVersion: "legacy",
      provider: "gemini",
      model: "gemini-1.5-flash",
      inputLength: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      latency: 0,
      success: false,
      error: err.message,
    }).catch(() => {});
    return { success: false, error: err.message || "Görsel analiz başarısız." };
  }
}
