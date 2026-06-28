"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FirmReview {
  id: number;
  type: "firma";
  rating: number;
  comment: string | null;
  createdAt: string;
  profile: { id: number; companyName: string };
  user: { id: number; name: string };
}

interface JobReview {
  id: number;
  type: "is";
  rating: number;
  comment: string | null;
  createdAt: string;
  job: { id: number; title: string; customer: { name: string } };
}

type Review = FirmReview | JobReview;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const [firmRes, jobRes] = await Promise.all([
        fetch("/api/reviews?admin=true"),
        fetch("/api/jobs/reviews"),
      ]);
      const firmData: FirmReview[] = firmRes.ok ? await firmRes.json() : [];
      const jobData: JobReview[] = jobRes.ok ? await jobRes.json() : [];

      const all = [
        ...firmData.map(r => ({ ...r, type: "firma" as const })),
        ...jobData.map(r => ({ ...r, type: "is" as const })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setReviews(all);
    } catch {
      toast.error("Yorumlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(review: Review) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    try {
      const endpoint = review.type === "firma"
        ? `/api/reviews?id=${review.id}`
        : `/api/jobs/${(review as JobReview).job.id}/review`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        toast.success("Yorum silindi.");
        loadReviews();
      } else toast.error("Silinemedi.");
    } catch { toast.error("Bir hata oluştu."); }
  }

  const filtered = reviews.filter(r => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-sub-text">Yükleniyor...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Yorum Yönetimi</h1>
        <span className="text-sm text-sub-text">Toplam: {reviews.length} yorum</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white">
          <option value="all">Tüm Türler</option>
          <option value="firma">Firma Yorumları</option>
          <option value="is">İş Yorumları</option>
        </select>
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}
          className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white">
          <option value="all">Tüm Puanlar</option>
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{n} Yıldız</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sub-text text-center py-8">Yorum bulunamadı.</p>
        ) : filtered.map((review, idx) => (
          <div key={`${review.type}-${review.id}-${idx}`} className="bg-dark-card rounded-xl border border-dark-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 text-sm">{'⭐'.repeat(review.rating)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${review.type === 'firma' ? 'bg-blue-900/40 text-blue-400' : 'bg-purple-900/40 text-purple-400'}`}>
                    {review.type === 'firma' ? 'Firma' : 'İş'}
                  </span>
                </div>
                <p className="text-xs text-sub-text mb-1">
                  {review.type === 'firma' ? (
                    <>Firma: <span className="text-white">{(review as FirmReview).profile.companyName}</span> · Yazan: {(review as FirmReview).user.name}</>
                  ) : (
                    <>İş: <span className="text-white">{(review as JobReview).job.title}</span></>
                  )}
                  <span> · {new Date(review.createdAt).toLocaleDateString("tr-TR")}</span>
                </p>
                {review.comment && <p className="text-sm text-gray-300">{review.comment}</p>}
              </div>
              <button onClick={() => deleteReview(review)} className="text-xs text-red-400 hover:underline shrink-0">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
