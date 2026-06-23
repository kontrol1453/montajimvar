"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: number; name: string };
}

interface Props {
  profileId: number;
  isOwner: boolean;
  canLeaveReview: boolean;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-2xl transition ${
            star <= value ? "text-montaj" : "text-gray-600"
          } ${readonly ? "cursor-default" : "hover:scale-110 cursor-pointer"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ profileId, isOwner, canLeaveReview }: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?profileId=${profileId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setReviews(data);
        const userId = (session?.user as any)?.id;
        if (userId) {
          const mine = data.find((r: Review) => r.user.id === userId);
          if (mine) {
            setExistingReview(mine);
            setUserRating(mine.rating);
            setUserComment(mine.comment || "");
          }
        }
      })
      .catch(() => {});
  }, [profileId, session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (userRating === 0) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          rating: userRating,
          comment: userComment || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Hata oluştu.");
      }

      setMessage("Değerlendirmeniz kaydedildi.");
      // Refresh reviews
      const refreshed = await fetch(`/api/reviews?profileId=${profileId}`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setReviews(data);
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Değerlendirmeler</h2>
        {avgRating && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-montaj text-lg">★ {avgRating}</span>
            <span className="text-sub-text">({reviews.length} yorum)</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {session?.user && !isOwner && canLeaveReview && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-dark-section rounded-lg border border-dark-border">
          <h3 className="text-sm font-medium text-white mb-3">
            {existingReview ? "Değerlendirmeni Güncelle" : "Firmayı Değerlendir"}
          </h3>
          <div className="mb-3">
            <StarRating value={userRating} onChange={setUserRating} />
          </div>
          <textarea
            placeholder="Yorumunuz (isteğe bağlı)..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white placeholder-gray-500 mb-3"
          />
          {message && (
            <p className={`text-sm mb-3 ${message.includes("kaydedildi") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
          <Button type="submit" loading={loading} disabled={userRating === 0}>
            {existingReview ? "Güncelle" : "Gönder"}
          </Button>
        </form>
      )}

      {!session?.user && (
        <p className="text-sm text-sub-text mb-4">
          Yorum yapmak için giriş yapmalısınız.
        </p>
      )}

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 divide-y divide-dark-border">
          {reviews.map((review) => (
            <div key={review.id} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{review.user.name}</span>
                <StarRating value={review.rating} readonly />
              </div>
              {review.comment && (
                <p className="text-sm text-muted-text mt-1">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-sub-text text-center py-6">
          Henüz değerlendirme yapılmamış. İlk yorumu sen yap!
        </p>
      )}
    </div>
  );
}
