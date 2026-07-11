"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface Props {
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
  workerCount: number;
  explanation: string[];
  confidence: "low" | "medium" | "high";
}

const CONFIDENCE_LABELS = { low: "Düşük", medium: "Orta", high: "Yüksek" };
const CONFIDENCE_COLORS = { low: "text-yellow-400", medium: "text-blue-400", high: "text-green-400" };

export default function PriceAnalyzer({ categoryIds, categoryNames, city, urgency, description, photoCount }: Props) {
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
        body: JSON.stringify({ categoryIds, categoryNames, city, urgency, description, photoCount }),
      });
      if (!res.ok) throw new Error("Analiz başarısız");
      setResult(await res.json());
    } catch {
      setError("Analiz yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

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
          {result.explanation.length > 0 && (
            <div className="text-xs text-sub-text space-y-0.5 pt-1 border-t border-white/[0.06]">
              {result.explanation.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
