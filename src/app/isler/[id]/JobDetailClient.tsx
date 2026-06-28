"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import JobMessagesPanel from "@/components/JobMessagesPanel";

interface ArtisanInfo {
  id: number;
  name: string;
  avatar: string | null;
  profile: { companyName: string | null; ratingAvg: number; reviewCount: number } | null;
}

interface Offer {
  id: number;
  jobId: number;
  artisanId: number;
  amount: number;
  description: string | null;
  duration: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  artisan: ArtisanInfo;
}

interface TimelineEntry {
  id: number;
  jobId: number;
  status: string;
  note: string | null;
  createdAt: string;
}

interface CategoryInfo {
  id: number;
  category: { id: number; name: string; slug: string; icon: string | null };
}

interface JobDetail {
  id: number;
  customerId: number;
  title: string;
  description: string;
  photos: string[];
  location: string | null;
  lat: number | null;
  lng: number | null;
  city: string;
  district: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  status: string;
  urgency: string | null;
  accessInfo: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { id: number; name: string; avatar: string | null; phone: string | null };
  categories: CategoryInfo[];
  offers: Offer[];
  timeline: TimelineEntry[];
}

interface Props {
  job: JobDetail;
  userId: number;
  isOwner: boolean;
  isArtisan: boolean;
  existingOffer: Offer | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Teklif Bekliyor",
  offers_received: "Teklifler Geldi",
  assigned: "Usta Atandı",
  en_route: "Usta Yolda",
  in_progress: "Montaj Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "Değerlendiriliyor",
  cancelled: "İptal Edildi",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  offers_received: "bg-blue-500/20 text-blue-400",
  assigned: "bg-purple-500/20 text-purple-400",
  en_route: "bg-cyan-500/20 text-cyan-400",
  in_progress: "bg-montaj/20 text-montaj",
  completed: "bg-green-500/20 text-green-400",
  review_pending: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function JobDetailClient({ job, userId, isOwner, isArtisan, existingOffer }: Props) {
  const router = useRouter();
  const [offerAmount, setOfferAmount] = useState("");
  const [offerDesc, setOfferDesc] = useState("");
  const [offerDuration, setOfferDuration] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidDone, setBidDone] = useState(false);

  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [actionError, setActionError] = useState("");

  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [existingReview, setExistingReview] = useState(false);
  const [review, setReview] = useState<{ rating: number; comment: string | null } | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${job.id}/review`)
      .then((r) => r.json())
      .then((data) => {
        if (data.review) {
          setExistingReview(true);
          setReview(data.review);
        }
      })
      .catch(() => {});
  }, [job.id]);

  const handleStatusAdvance = async (newStatus: string, note: string) => {
    setStatusLoading(true);
    setStatusError("");

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusError(data.error || "Durum güncellenemedi.");
        return;
      }

      router.refresh();
    } catch {
      setStatusError("Bağlantı hatası.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (reviewRating === 0) {
      setReviewError("Lütfen bir puan seçin.");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await fetch(`/api/jobs/${job.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReviewError(data.error || "Değerlendirme kaydedilemedi.");
        return;
      }

      setReviewSuccess("Değerlendirmeniz kaydedildi! Teşekkür ederiz.");
      setExistingReview(true);
      setReview({ rating: reviewRating, comment: reviewComment });
      router.refresh();
    } catch {
      setReviewError("Bağlantı hatası.");
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCur = (amount: number) =>
    (amount / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

  const handleBid = async () => {
    if (!offerAmount || isNaN(Number(offerAmount)) || Number(offerAmount) <= 0) {
      setBidError("Geçerli bir teklif tutarı girin.");
      return;
    }
    setBidLoading(true);
    setBidError("");

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          amount: Math.round(Number(offerAmount) * 100),
          description: offerDesc || undefined,
          duration: offerDuration || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBidError(data.error || "Bir hata oluştu.");
        return;
      }

      setBidDone(true);
    } catch {
      setBidError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setBidLoading(false);
    }
  };

  const handleOfferAction = async (offerId: number, action: "accepted" | "rejected") => {
    setActionLoading((prev) => ({ ...prev, [offerId]: true }));
    setActionError("");

    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Bir hata oluştu.");
        return;
      }

      router.refresh();
    } catch {
      setActionError("Bağlantı hatası.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  const offerAccepted = job.offers.find((o) => o.status === "accepted");

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-sub-text hover:text-white transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <p className="text-sub-text text-sm">
              {job.city}{job.district ? ` / ${job.district}` : ""} · {formatDate(job.createdAt)}
            </p>
          </div>
        </div>

        {/* Main info card */}
        <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6 space-y-5">
          {/* Status + Urgency */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[job.status] || ""}`}>
              {STATUS_LABELS[job.status] || job.status}
            </span>
            {job.urgency && job.urgency !== "normal" && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.urgency === "acil" ? "bg-orange-500/20 text-orange-400" : "bg-red-500/20 text-red-400"
              }`}>
                {job.urgency === "acil" ? "⚡ Acil" : "🔥 Çok Acil"}
              </span>
            )}
          </div>

          {/* Categories */}
          {job.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.categories.map((jc) => (
                <span key={jc.id} className="px-3 py-1 bg-dark-section text-muted-text rounded-full text-sm">
                  {jc.category.icon && <span className="mr-1">{jc.category.icon}</span>}
                  {jc.category.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm text-sub-text uppercase tracking-wide mb-2">Açıklama</h3>
            <p className="text-muted-text whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          {/* Budget */}
          {(job.budgetMin || job.budgetMax) && (
            <div>
              <h3 className="text-sm text-sub-text uppercase tracking-wide mb-1">Bütçe</h3>
              <p className="text-white text-lg font-semibold">
                {job.budgetMin ? formatCur(job.budgetMin) : "?"}
                {" - "}
                {job.budgetMax ? formatCur(job.budgetMax) : "?"}
              </p>
            </div>
          )}

          {/* Customer info (for artisans) */}
          {!isOwner && (
            <div className="p-3 rounded-lg bg-dark-section border border-white/[0.06] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-montaj/20 flex items-center justify-center text-montaj font-bold text-sm">
                {job.customer.name?.[0] || "?"}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{job.customer.name}</p>
                <p className="text-sub-text text-xs">İş Sahibi</p>
              </div>
            </div>
          )}

          {/* Access info */}
          {job.accessInfo && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 uppercase tracking-wide mb-1">Giriş Bilgisi</p>
              <p className="text-amber-300 text-sm">{job.accessInfo}</p>
            </div>
          )}
        </div>

        {/* Photos */}
        {job.photos.length > 0 && (
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-sm text-sub-text uppercase tracking-wide mb-3">Fotoğraflar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {job.photos.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                   className="aspect-square rounded-lg overflow-hidden bg-dark-section group">
                  <img src={url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {job.timeline.length > 0 && (
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-sm text-sub-text uppercase tracking-wide mb-4">İş Akışı</h3>
            <div className="space-y-3">
              {job.timeline.map((t, i) => (
                <div key={t.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === job.timeline.length - 1 ? "bg-montaj" : "bg-dark-border"}`} />
                    {i < job.timeline.length - 1 && <div className="w-0.5 flex-1 bg-dark-border mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-white text-sm font-medium">{STATUS_LABELS[t.status] || t.status}</p>
                    {t.note && <p className="text-sub-text text-xs mt-0.5">{t.note}</p>}
                    <p className="text-sub-text text-xs mt-0.5">{formatDate(t.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer: Offers section */}
        {isOwner && (
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Gelen Teklifler</h3>
            <p className="text-sub-text text-sm mb-4">
              {job.offers.length === 0
                ? "Henüz teklif gelmedi."
                : `${job.offers.length} teklif alındı`}
            </p>

            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{actionError}</p>
              </div>
            )}

            {job.offers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sub-text">Teklifler geldiğinde burada göreceksiniz.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {job.offers.map((offer) => {
                  const isAccepted = offer.status === "accepted";
                  const isRejected = offer.status === "rejected";
                  const isPending = offer.status === "pending";

                  return (
                    <div
                      key={offer.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isAccepted
                          ? "bg-green-500/10 border-green-500/30"
                          : isRejected
                            ? "bg-red-500/5 border-red-500/20 opacity-60"
                            : "bg-dark-section border-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-montaj/20 flex items-center justify-center text-montaj font-bold shrink-0">
                            {offer.artisan.avatar ? (
                              <img src={offer.artisan.avatar} alt="" loading="lazy" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              offer.artisan.name?.[0] || "?"
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{offer.artisan.name}</p>
                            {offer.artisan.profile?.companyName && (
                              <p className="text-sub-text text-sm">{offer.artisan.profile.companyName}</p>
                            )}
                            {offer.artisan.profile && (
                              <p className="text-xs text-montaj mt-0.5">
                                ⭐ {offer.artisan.profile.ratingAvg.toFixed(1)} ({offer.artisan.profile.reviewCount} yorum)
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{formatCur(offer.amount)}</p>
                          {offer.duration && (
                            <p className="text-sub-text text-xs">{offer.duration}</p>
                          )}
                        </div>
                      </div>

                      {offer.description && (
                        <p className="text-muted-text text-sm mt-3">{offer.description}</p>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isAccepted ? "bg-green-500/20 text-green-400" :
                          isRejected ? "bg-red-500/20 text-red-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {isAccepted ? "✓ Kabul Edildi" : isRejected ? "× Reddedildi" : "Bekliyor"}
                        </span>
                      </div>

                      {isPending && !offerAccepted && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="primary"
                            size="sm"
                            loading={actionLoading[offer.id]}
                            onClick={() => handleOfferAction(offer.id, "accepted")}
                          >
                            Kabul Et
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            loading={actionLoading[offer.id]}
                            onClick={() => handleOfferAction(offer.id, "rejected")}
                          >
                            Reddet
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Customer: Status controls */}
        {isOwner && (job.status === "assigned" || job.status === "en_route" || job.status === "in_progress") && (
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">İş Takibi</h3>
            <p className="text-sub-text text-sm mb-4">İşin durumunu güncelleyin</p>

            {statusError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{statusError}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {job.status === "assigned" && (
                <Button
                  variant="primary"
                  size="lg"
                  loading={statusLoading}
                  onClick={() => handleStatusAdvance("en_route", "Usta yola çıktı")}
                >
                  🚶 Usta Yolda
                </Button>
              )}
              {job.status === "en_route" && (
                <Button
                  variant="primary"
                  size="lg"
                  loading={statusLoading}
                  onClick={() => handleStatusAdvance("in_progress", "Montaj başladı")}
                >
                  🛠 Montaj Başladı
                </Button>
              )}
              {job.status === "in_progress" && (
                <Button
                  variant="primary"
                  size="lg"
                  loading={statusLoading}
                  onClick={() => handleStatusAdvance("completed", "İş tamamlandı")}
                >
                  ✅ İş Tamamlandı
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                loading={statusLoading}
                onClick={() => handleStatusAdvance("cancelled", "İptal edildi")}
              >
                İptal Et
              </Button>
            </div>
          </div>
        )}

        {/* Customer: Review form */}
        {isOwner && job.status === "completed" && !existingReview && (
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">İşi Değerlendir</h3>
            <p className="text-sub-text text-sm mb-4">Ustayı puanlayın ve yorum bırakın</p>

            {reviewError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{reviewError}</p>
              </div>
            )}
            {reviewSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400">{reviewSuccess}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-text mb-2">Puanınız</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition ${
                        star <= reviewRating ? "text-montaj" : "text-dark-border"
                      } hover:scale-110`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-text mb-1.5">
                  Yorumunuz (isteğe bağlı)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="İş nasıl geçti? Usta hakkında düşünceleriniz..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-section text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj resize-none"
                />
              </div>
              <Button
                variant="primary"
                loading={reviewLoading}
                disabled={reviewRating === 0}
                onClick={handleReviewSubmit}
              >
                Gönder
              </Button>
            </div>
          </div>
        )}

        {/* Job Messages (when assigned) */}
        {offerAccepted && (
          <JobMessagesPanel
            jobId={job.id}
            customerId={job.customerId}
            artisanId={offerAccepted.artisanId}
          />
        )}

        {/* Artisan: Offer form */}
        {isArtisan && !isOwner && (
          <div className="bg-dark-card border border-white/[0.06] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Teklif Ver</h3>
            {existingOffer || bidDone ? (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-green-400 font-medium">
                  {bidDone ? "✓ Teklifiniz gönderildi!" : "✓ Teklifiniz gönderilmiş"}
                </p>
                {existingOffer && (
                  <p className="text-green-300 text-sm mt-1">
                    Tutar: {formatCur(existingOffer.amount)}
                    {existingOffer.duration && ` · Süre: ${existingOffer.duration}`}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {bidError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">{bidError}</p>
                  </div>
                )}

                {job.status === "pending" || job.status === "offers_received" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-muted-text mb-1.5">
                        Teklif Tutarı (₺) *
                      </label>
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="Örn: 2500"
                        min={0}
                        className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-section text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-text mb-1.5">
                        Açıklama (opsiyonel)
                      </label>
                      <textarea
                        value={offerDesc}
                        onChange={(e) => setOfferDesc(e.target.value)}
                        placeholder="Teklifiniz hakkında kısa bir not..."
                        rows={3}
                        className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-section text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-text mb-1.5">
                        Tahmini Süre (opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={offerDuration}
                        onChange={(e) => setOfferDuration(e.target.value)}
                        placeholder="Örn: 3 saat, 1 gün"
                        className="w-full px-3 py-2.5 border border-dark-border rounded-lg text-sm bg-dark-section text-white placeholder-sub-text focus:outline-none focus:ring-2 focus:ring-montaj"
                      />
                    </div>
                    <Button variant="primary" size="lg" loading={bidLoading} onClick={handleBid}>
                      Teklif Gönder
                    </Button>
                  </>
                ) : (
                  <p className="text-sub-text text-sm">Bu iş için artık teklif alınmıyor.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
