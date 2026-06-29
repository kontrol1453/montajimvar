"use client";

import { useState, useEffect } from "react";

interface JobReviewData {
  id: number;
  rating: number;
  comment: string | null;
  photos: string | null;
  createdAt: string;
  job: {
    id: number;
    title: string;
    customer: { id: number; name: string; avatar: string | null };
  };
}

export default function JobReviewsSection({ artisanId }: { artisanId: number }) {
  const [reviews, setReviews] = useState<JobReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs?artisanId=${artisanId}&status=completed`)
      .then((r) => r.json())
      .then((data) => {
        if (data.jobs) {
          setReviews(data.jobs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [artisanId]);

  if (loading) return null;

  if (reviews.length === 0) return null;

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        İş Değerlendirmeleri
      </h2>

      <div className="space-y-4 divide-y divide-dark-border">
        {reviews.map((r) => (
          <div key={r.id} className="pt-4 first:pt-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-montaj/20 flex items-center justify-center text-montaj text-xs font-bold">
                  {r.job.customer.name?.[0] || "?"}
                </div>
                <span className="text-sm font-medium text-white">{r.job.customer.name}</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= r.rating ? "text-montaj" : "text-dark-border"}>★</span>
                ))}
              </div>
            </div>
            <p className="text-muted-text text-sm mt-1">{r.comment || "Yorum yapılmadı."}</p>
            <p className="text-sub-text text-xs mt-1">
              {r.job.title} · {
                new Date(r.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric", month: "long", year: "numeric"
                })
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
