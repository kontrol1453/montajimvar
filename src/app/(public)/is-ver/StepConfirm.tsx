"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface FormData {
  categoryIds: number[];
  photos: string[];
  city: string;
  district: string;
  location: string;
  accessInfo: string;
  title: string;
  description: string;
  urgency: string;
  budgetMin: string;
  budgetMax: string;
}

interface Props {
  data: FormData;
  onBack: () => void;
  onReset: () => void;
}

export default function StepConfirm({ data, onBack, onReset }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const budgetMin = data.budgetMin ? parseInt(data.budgetMin) : undefined;
    const budgetMax = data.budgetMax ? parseInt(data.budgetMax) : undefined;

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          photos: data.photos,
          city: data.city,
          district: data.district || undefined,
          location: data.location || undefined,
          accessInfo: data.accessInfo || undefined,
          urgency: data.urgency !== "normal" ? data.urgency : undefined,
          budgetMin: budgetMin && !isNaN(budgetMin) ? budgetMin : undefined,
          budgetMax: budgetMax && !isNaN(budgetMax) ? budgetMax : undefined,
          categoryIds: data.categoryIds,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Bir hata oluştu.");
        setSubmitting(false);
        return;
      }

      setCreatedJobId(result.job?.id || null);
      setDone(true);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">İşiniz Oluşturuldu!</h2>
          <p className="text-muted-text">
            Teklifler gelmeye başladığında size bildirim göndereceğiz.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(createdJobId ? `/isler/${createdJobId}` : "/islerim")}
          >
            İşi Görüntüle
          </Button>
          <Button variant="secondary" size="lg" onClick={onReset}>
            Yeni İş Ver
          </Button>
          <Button variant="ghost" size="lg" onClick={() => router.push("/")}>
            Ana Sayfa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">İşi Onayla</h2>
        <p className="text-sub-text text-sm">Bilgileri kontrol edin ve teklif almaya başlayın</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-dark-section border border-white/[0.06]">
          <p className="text-xs text-sub-text uppercase tracking-wide mb-1">Başlık</p>
          <p className="text-white font-medium">{data.title}</p>
        </div>

        <div className="p-4 rounded-lg bg-dark-section border border-white/[0.06]">
          <p className="text-xs text-sub-text uppercase tracking-wide mb-1">Açıklama</p>
          <p className="text-muted-text text-sm whitespace-pre-wrap">{data.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-dark-section border border-white/[0.06]">
            <p className="text-xs text-sub-text uppercase tracking-wide mb-1">Konum</p>
            <p className="text-white">{data.city}{data.district ? ` / ${data.district}` : ""}</p>
            {data.location && <p className="text-sub-text text-xs mt-1">{data.location}</p>}
          </div>

          <div className="p-4 rounded-lg bg-dark-section border border-white/[0.06]">
            <p className="text-xs text-sub-text uppercase tracking-wide mb-1">Bütçe</p>
            <p className="text-white">
              {data.budgetMin || data.budgetMax
                ? `${data.budgetMin ? `${parseInt(data.budgetMin).toLocaleString("tr-TR")} ₺` : "?"} - ${data.budgetMax ? `${parseInt(data.budgetMax).toLocaleString("tr-TR")} ₺` : "?"}`
                : "Belirtilmedi"}
            </p>
          </div>
        </div>

        {data.photos.length > 0 && (
          <div className="p-4 rounded-lg bg-dark-section border border-white/[0.06]">
            <p className="text-xs text-sub-text uppercase tracking-wide mb-2">
              Fotoğraflar ({data.photos.length})
            </p>
            <div className="flex gap-2">
              {data.photos.slice(0, 5).map((url, i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-dark-card">
                  <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {data.categoryIds.length > 0 && (
          <div className="p-4 rounded-lg bg-dark-section border border-white/[0.06]">
            <p className="text-xs text-sub-text uppercase tracking-wide mb-2">Kategoriler</p>
            <div className="flex flex-wrap gap-2">
              {data.categoryIds.map((id) => (
                <span key={id} className="px-3 py-1 bg-montaj/10 text-montaj rounded-full text-sm">
                  Kategori #{id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>
          Geri
        </Button>
        <Button variant="primary" size="lg" loading={submitting} onClick={handleSubmit}>
          Teklif Al
        </Button>
      </div>
    </div>
  );
}
