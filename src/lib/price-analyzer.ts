interface AnalysisInput {
  categoryIds: number[];
  categoryNames: string[];
  city: string;
  urgency: string;
  description: string;
  photoCount: number;
}

interface AnalysisResult {
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  duration: string;
  durationHours: number;
  workerCount: number;
  explanation: string[];
  confidence: "low" | "medium" | "high";
}

const CITY_MULTIPLIERS: Record<string, number> = {
  istanbul: 1.3, ankara: 1.15, izmir: 1.1,
  bursa: 1.05, antalya: 1.05, kocaeli: 1.05,
  adana: 1.0, konya: 0.95, gaziantep: 0.95,
};

const URGENCY_MULTIPLIERS: Record<string, number> = {
  normal: 1.0,
  acil: 1.15,
  cok_acil: 1.3,
};

const CATEGORY_BASE_PRICES: Record<string, { min: number; max: number; hours: number; workers: number }> = {
  mobilya: { min: 1500, max: 5000, hours: 3, workers: 2 },
  mutfak: { min: 2500, max: 8000, hours: 5, workers: 2 },
  banyo: { min: 2000, max: 6000, hours: 4, workers: 2 },
  perde: { min: 800, max: 2500, hours: 2, workers: 1 },
  aydinlatma: { min: 500, max: 2000, hours: 1.5, workers: 1 },
  klima: { min: 2000, max: 6000, hours: 3, workers: 2 },
  beyaz_esya: { min: 600, max: 1500, hours: 1, workers: 1 },
  elektrik: { min: 500, max: 3000, hours: 2, workers: 1 },
  tesisat: { min: 800, max: 4000, hours: 2.5, workers: 1 },
  duvar: { min: 1000, max: 4000, hours: 3, workers: 1 },
  boya: { min: 2000, max: 8000, hours: 6, workers: 2 },
  parke: { min: 3000, max: 10000, hours: 6, workers: 2 },
  cam: { min: 500, max: 2000, hours: 2, workers: 1 },
  diger: { min: 500, max: 3000, hours: 2, workers: 1 },
};

function matchCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("mobilya") || n.includes("montaj")) return "mobilya";
  if (n.includes("mutfak")) return "mutfak";
  if (n.includes("banyo")) return "banyo";
  if (n.includes("perde") || n.includes("stor")) return "perde";
  if (n.includes("aydınlatma") || n.includes("lamba") || n.includes("avize")) return "aydinlatma";
  if (n.includes("klima")) return "klima";
  if (n.includes("beyaz") || n.includes("eşya") || n.includes("buzdolabı") || n.includes("çamaşır") || n.includes("bulaşık")) return "beyaz_esya";
  if (n.includes("elektrik")) return "elektrik";
  if (n.includes("tesisat") || n.includes("su") || n.includes("musluk")) return "tesisat";
  if (n.includes("duvar") || n.includes("raflı") || n.includes("askı")) return "duvar";
  if (n.includes("boya") || n.includes("badana")) return "boya";
  if (n.includes("parke") || n.includes("laminant") || n.includes("zemin")) return "parke";
  if (n.includes("cam") || n.includes("vitrin")) return "cam";
  return "diger";
}

function estimateComplexity(description: string, photoCount: number): number {
  let complexity = 1.0;
  const desc = description.toLowerCase();

  if (photoCount >= 3) complexity += 0.15;
  if (photoCount >= 5) complexity += 0.1;

  const complexityKeywords = ["büyük", "çok", "ağır", "zor", "karmaşık", "geniş", "yüksek", "50+", "100+", "büyük"];
  for (const kw of complexityKeywords) {
    if (desc.includes(kw)) { complexity += 0.1; break; }
  }

  const quantityMatch = desc.match(/(\d+)\s*(?:adet|tane|parça|metre|m2)/);
  if (quantityMatch) {
    const qty = parseInt(quantityMatch[1]);
    if (qty > 10) complexity += 0.2;
    else if (qty > 5) complexity += 0.1;
  }

  if (desc.includes("asansör") || desc.includes("site") || desc.includes("rezidans")) complexity *= 0.95;
  if (desc.includes("üst kat") || desc.includes("merdiven") || desc.includes("çıkış")) complexity *= 1.1;

  return Math.min(complexity, 2.0);
}

export function estimatePrice(input: AnalysisInput): AnalysisResult {
  const cityKey = input.city.toLowerCase().split(/[\s,]+/)[0];
  const cityMultiplier = CITY_MULTIPLIERS[cityKey] || 1.0;
  const urgencyMultiplier = URGENCY_MULTIPLIERS[input.urgency] || 1.0;

  const matchedCategories = input.categoryNames.map(matchCategory);
  const uniqueCats = [...new Set(matchedCategories)];
  const catPrices = uniqueCats.map((c) => CATEGORY_BASE_PRICES[c] || CATEGORY_BASE_PRICES.diger);

  const baseMin = catPrices.reduce((s, p) => s + p.min, 0);
  const baseMax = catPrices.reduce((s, p) => s + p.max, 0);

  const complexity = estimateComplexity(input.description, input.photoCount);
  const totalMin = Math.round(baseMin * cityMultiplier * urgencyMultiplier * complexity);
  const totalMax = Math.round(baseMax * cityMultiplier * urgencyMultiplier * complexity);

  const maxHours = Math.max(...catPrices.map((p) => p.hours));
  const maxWorkers = Math.max(...catPrices.map((p) => p.workers));
  const durationHours = Math.round(maxHours * complexity * (uniqueCats.length > 1 ? 1.3 : 1));

  const explanation: string[] = [];
  const parts: string[] = [];
  for (const cn of input.categoryNames) {
    const matched = matchCategory(cn);
    const p = CATEGORY_BASE_PRICES[matched];
    if (p) parts.push(`${cn} (${p.min}₺-${p.max}₺)`);
  }
  if (parts.length > 0) explanation.push(`Kategori baz fiyatları: ${parts.join(", ")}`);

  if (cityMultiplier !== 1.0) explanation.push(`Şehir faktörü (${cityKey}): %${Math.round((cityMultiplier - 1) * 100)}`);
  if (urgencyMultiplier !== 1.0) explanation.push(`Acil durum faktörü: %${Math.round((urgencyMultiplier - 1) * 100)}`);
  if (complexity > 1.1) explanation.push(`İş karmaşıklığı: %${Math.round((complexity - 1) * 100)} fazla`);
  if (input.photoCount >= 3) explanation.push(`${input.photoCount} fotoğraf ile iş analizi yapıldı`);

  const suggestions = [];
  suggestions.push(`Tahmini süre: ${durationHours >= 2 ? `${Math.floor(durationHours)} saat` : "1 saat"}${maxWorkers > 1 ? `, ${maxWorkers} kişi` : ""}`);
  suggestions.push(`Tavsiye edilen bütçe: ${totalMin.toLocaleString("tr-TR")}₺ - ${totalMax.toLocaleString("tr-TR")}₺`);

  const hasEnoughData = input.categoryIds.length > 0 && input.city.length > 0;
  const confidence: "low" | "medium" | "high" = hasEnoughData ? (input.photoCount > 0 ? "high" : "medium") : "low";

  return {
    minPrice: totalMin,
    maxPrice: totalMax,
    suggestedPrice: Math.round((totalMin + totalMax) / 2),
    duration: `${durationHours >= 2 ? `${Math.floor(durationHours)} saat` : "1 saat"}${maxWorkers > 1 ? `, ${maxWorkers} kişi` : ""}`,
    durationHours,
    workerCount: maxWorkers,
    explanation,
    confidence,
  };
}
