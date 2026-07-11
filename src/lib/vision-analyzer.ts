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
    const imageParts = await Promise.all(
      photoUrls.slice(0, 3).map(async (url) => {
        const resp = await fetch(url);
        const buffer = await resp.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = resp.headers.get("content-type") || "image/jpeg";
        return { inlineData: { data: base64, mimeType } };
      })
    );

    const payload = {
      contents: [{
        parts: [
          { text: `Bu montaj işi fotoğraflarını analiz et. Yanıtı TAM TÜRKÇE ve aşağıdaki JSON formatında ver:

{
  "products": [{"name": "ürün adı", "count": adet}],
  "difficulty": "easy|medium|hard",
  "estimatedHours": saat_sayisi,
  "estimatedWorkers": kisi_sayisi,
  "specialTools": ["gerekli aletler"],
  "notes": ["notlar"]
}

Sadece JSON döndür, başka metin yazma.` },
          ...imageParts,
        ],
      }],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Gemini hatası: ${res.status}` };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "AI yanıtı ayrıştırılamadı." };
    }

    const result: VisionAnalysisResult = JSON.parse(jsonMatch[0]);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Görsel analiz başarısız." };
  }
}
