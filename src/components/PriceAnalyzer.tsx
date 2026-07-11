"use client";

import { useState } from "react";
import { Sparkles, Camera } from "lucide-react";

interface Props {
  categoryIds: number[];
  categoryNames: string[];
  city: string;
  urgency: string;
  description: string;
  photoUrls?: string[];
}

interface VisionAnalysis {
  products: { name: string; count: number }[];
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
  estimatedWorkers: number;
  specialTools: string[];
  notes: string[];
}

interface AnalysisResult {
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  duration: string;
  workerCount: number;
  explanation: string[];
  confidence: "low" | "medium" | "high";
  visionAnalysis?: { success: boolean; data?: VisionAnalysis; error?: string };
}

const CONFIDENCE_LABELS = { low: "Düşük", medium: "Orta", high: "Yüksek" };
const CONFIDENCE_COLORS = { low: "text-yellow-400", medium: "text-blue-400", high: "text-green-400" };

const DIFFICULTY_LABELS = { easy: "Kolay", medium: "Orta", hard: "Zor" };
const DIFFICULTY_COLORS = { easy: "text-green-400", medium: "text-yellow-400", hard: "text-red-400" };

export default function PriceAnalyzer({ categoryIds, categoryNames, city, urgency, description, photoUrls }: Props) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryIds, categoryNames, city, urgency, description,
          photoCount: photoUrls?.length || 0,
          photoUrls: photoUrls?.length ? photoUrls : undefined,
        }),
      });
      if (!res.ok) throw new Error("Analiz başarısız");
      setResult(await res.json());
    } catch {
      setError("Analiz yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const hasVision = result?.visionAnalysis?.success && result.visionAnalysis.data;
  const vision = result?.visionAnalysis?.data;

  return (
    <div className="border border-white/[0.06] rounded-xl p-4 bg-dark-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-montaj" />
          <span className="text-sm font-medium text-white">AI Fiyat Tahmini</span>
        </div>
        <button
          onClick={analyze}
          disabled={loading || !city || categoryIds.length === 0}
          className="px-3 py-1.5 bg-montaj text-white text-xs font-medium rounded-lg hover:bg-montaj-dark transition-all disabled:opacity-40"
        >
          {loading ? "Analiz ediliyor..." : "Tahmin Al"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{result.suggestedPrice.toLocaleString("tr-TR")} ₺</span>
            <span className={`text-xs ${CONFIDENCE_COLORS[result.confidence]} bg-white/5 px-1.5 py-0.5 rounded`}>
              {CONFIDENCE_LABELS[result.confidence]} güven
            </span>
          </div>
          <p className="text-xs text-sub-text">
            Tahmini aralık: {result.minPrice.toLocaleString("tr-TR")}₺ - {result.maxPrice.toLocaleString("tr-TR")}₺
          </p>
          <p className="text-xs text-montaj">{result.duration}</p>

          {hasVision && (
            <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                <Camera size={12} />
                Fotoğraf Analizi
              </div>
              {vision!.products.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {vision!.products.map((p, i) => (
                    <span key={i} className="text-xs bg-white/5 text-sub-text px-1.5 py-0.5 rounded">
                      {p.count}x {p.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 text-xs">
                <span className={`${DIFFICULTY_COLORS[vision!.difficulty]}`}>
                  {DIFFICULTY_LABELS[vision!.difficulty]} iş
                </span>
                <span className="text-sub-text">
                  ~{vision!.estimatedHours} saat, {vision!.estimatedWorkers} kişi
                </span>
              </div>
              {vision!.specialTools.length > 0 && (
                <p className="text-xs text-sub-text">Gerekli ekipman: {vision!.specialTools.join(", ")}</p>
              )}
              {vision!.notes.map((n, i) => (
                <p key={i} className="text-xs text-sub-text">• {n}</p>
              ))}
            </div>
          )}

          {result.explanation.length > 0 && !hasVision && (
            <div className="text-xs text-sub-text space-y-0.5 pt-1 border-t border-white/[0.06]">
              {result.explanation.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
