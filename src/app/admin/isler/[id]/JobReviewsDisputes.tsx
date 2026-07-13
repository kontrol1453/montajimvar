"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import { Star, AlertTriangle, Shield } from "lucide-react";

interface JobReviewsDisputesProps {
  jobId: number;
  data?: {
    review: { id: number; rating: number; comment: string | null; createdAt: string | Date } | null;
    dispute: { id: number; reason: string; status: string; resolution: string | null; createdAt: string | Date; resolvedAt: string | Date | null; openedBy: { id: number; name: string }; payment: { amount: number } | null } | null;
  };
}

const RES_LABELS: Record<string, string> = {
  refund_customer: "Müşteriye İade",
  release_artisan: "Ustaya Ödeme",
  split_50: "%50-%50",
};

export default function JobReviewsDisputes({ jobId, data }: JobReviewsDisputesProps) {
  if (!data) return null;

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3 flex items-center gap-2">
          <Star size={14} className="text-amber-500" /> İş Yorumu
        </h3>
        {data.review ? (
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <div className="text-amber-500 text-lg mb-1">
              {"★".repeat(data.review.rating)}{"☆".repeat(5 - data.review.rating)}
            </div>
            {data.review.comment && (
              <p className="text-sm text-[var(--admin-text-primary)] mt-1">{data.review.comment}</p>
            )}
            <p className="text-xs text-[var(--admin-text-muted)] mt-2">{formatDate(new Date(data.review.createdAt))}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 text-center">
            <p className="text-sm text-[var(--admin-text-muted)]">Henüz yorum yapılmamış.</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3 flex items-center gap-2">
          <Shield size={14} className="text-[var(--admin-warning)]" /> Anlaşmazlık
        </h3>
        {data.dispute ? (
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <EntityStatus
                  variant={data.dispute.status === "open" ? "danger" : "success"}
                  label={data.dispute.status === "open" ? "Açık" : "Çözüldü"}
                  dot
                />
              </div>
              <div>
                <span className="text-xs text-[var(--admin-text-secondary)]">Sebep:</span>
                <p className="text-sm text-[var(--admin-text-primary)]">{data.dispute.reason}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--admin-text-secondary)]">Açan:</span>
                <Link href={`/admin/kullanicilar/${data.dispute.openedBy.id}`} className="text-sm text-[var(--admin-primary)] hover:underline ml-1">
                  {data.dispute.openedBy.name}
                </Link>
              </div>
              {data.dispute.resolution && (
                <div>
                  <span className="text-xs text-[var(--admin-text-secondary)]">Çözüm:</span>
                  <span className="text-sm text-[var(--admin-text-primary)] ml-1">{RES_LABELS[data.dispute.resolution] || data.dispute.resolution}</span>
                </div>
              )}
              {data.dispute.payment && (
                <div>
                  <span className="text-xs text-[var(--admin-text-secondary)]">Ödeme Tutarı:</span>
                  <span className="text-sm font-mono text-[var(--admin-text-primary)] ml-1">{data.dispute.payment.amount.toLocaleString("tr-TR")} TL</span>
                </div>
              )}
            </div>
            <div className="px-4 py-3 text-xs text-[var(--admin-text-muted)]">
              <div>Açıldı: {formatDate(new Date(data.dispute.createdAt))}</div>
              {data.dispute.resolvedAt && <div>Çözüldü: {formatDate(new Date(data.dispute.resolvedAt))}</div>}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 text-center">
            <AlertTriangle size={20} className="mx-auto text-[var(--admin-text-muted)] mb-1" />
            <p className="text-sm text-[var(--admin-text-muted)]">Anlaşmazlık kaydı yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}