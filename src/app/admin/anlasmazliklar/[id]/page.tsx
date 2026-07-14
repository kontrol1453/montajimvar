"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Shield, Briefcase, User, CreditCard, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface DisputeDetail {
  id: number;
  reason: string;
  resolution: string | null;
  status: string;
  note: string | null;
  createdAt: string;
  resolvedAt: string | null;
  job: {
    id: number; title: string; status: string; city: string; amount: number;
    customer: { id: number; name: string; email: string; phone: string };
  };
  payment: { id: number; amount: number; status: string; createdAt: string } | null;
  openedBy: { id: number; name: string; email: string };
}

const STATUS_BADGE: Record<string, { variant: "warning" | "success" | "danger"; label: string }> = {
  open: { variant: "warning", label: "Açık" },
  resolved: { variant: "success", label: "Çözüldü" },
};

const RESOLUTION_LABEL: Record<string, string> = {
  refund_customer: "Müşteriye İade",
  release_artisan: "Ustaya Ödeme",
  split_50: "%50-%50 Bölüşüm",
};

const RESOLUTIONS = [
  { value: "refund_customer", label: "Müşteriye İade" },
  { value: "release_artisan", label: "Ustaya Ödeme" },
  { value: "split_50", label: "%50-%50 Bölüşüm" },
];

function formatTRY(kurus: number): string {
  return `${(kurus / 100).toLocaleString("tr-TR")} TL`;
}

export default function DisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [dispute, setDispute] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/disputes/${id}`)
      .then((r) => r.json())
      .then((d) => { setDispute(d); setLoading(false); })
      .catch(() => { setError("Yüklenemedi"); setLoading(false); });
  }, [id]);

  const handleResolve = async (resolution: string) => {
    setResolving(resolution);
    setError("");
    const res = await fetch(`/api/admin/disputes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Çözümleme başarısız");
      setResolving(null);
      return;
    }
    const updated = await res.json();
    setDispute((prev) => prev ? { ...prev, ...updated } : prev);
    setResolving(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-[var(--admin-text-muted)]">
        Yükleniyor...
      </div>
    );
  }

  if (error && !dispute) {
    return (
      <div className="p-6 text-center text-sm text-[var(--admin-danger)]">
        {error}
      </div>
    );
  }

  if (!dispute) return null;

  const badge = STATUS_BADGE[dispute.status] || { variant: "warning" as const, label: dispute.status };
  const historyData = [
    { action: "Oluşturuldu", detail: dispute.openedBy.name, date: formatDate(new Date(dispute.createdAt)) },
    ...(dispute.resolvedAt
      ? [{ action: "Çözüldü", detail: `${RESOLUTION_LABEL[dispute.resolution ?? ""] || dispute.resolution}`, date: formatDate(new Date(dispute.resolvedAt)) }]
      : []),
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-[var(--admin-text-secondary)] hover:text-[var(--admin-primary)] transition-colors"
      >
        <ArrowLeft size={14} /> Geri
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-[var(--admin-danger)]" />
            <h1 className="text-xl font-bold text-[var(--admin-text-primary)]">
              Anlaşmazlık #{dispute.id}
            </h1>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <h2 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Sebep</h2>
            <p className="text-sm text-[var(--admin-text-primary)] whitespace-pre-wrap">{dispute.reason}</p>
          </div>

          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <h2 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Zaman Çizelgesi</h2>
            {historyData.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--admin-border)] last:border-0">
                <div>
                  <p className="text-sm text-[var(--admin-text-primary)]">{h.action}</p>
                  <p className="text-xs text-[var(--admin-text-secondary)]">{h.detail}</p>
                </div>
                <span className="text-xs text-[var(--admin-text-muted)]">{h.date}</span>
              </div>
            ))}
          </div>

          {dispute.status === "open" && (
            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
              <h2 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Çözümle</h2>
              {error && <p className="text-xs text-[var(--admin-danger)] mb-2">{error}</p>}
              <div className="flex gap-2 flex-wrap">
                {RESOLUTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleResolve(r.value)}
                    disabled={resolving === r.value}
                    className="px-4 py-2 text-xs rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)] transition-colors disabled:opacity-50"
                  >
                    {resolving === r.value ? "İşleniyor..." : r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            href={`/admin/isler/${dispute.job.id}`}
            className="flex items-start gap-3 p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-surface-muted)] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--admin-info-soft)] text-[var(--admin-info)] flex items-center justify-center shrink-0">
              <Briefcase size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wider">İş</p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)] transition-colors">{dispute.job.title}</p>
              <p className="text-[11px] text-[var(--admin-text-secondary)]">{dispute.job.city} · {dispute.job.status}</p>
              {dispute.job.amount > 0 && <p className="text-xs text-[var(--admin-text-muted)]">{formatTRY(dispute.job.amount)}</p>}
            </div>
          </Link>

          <Link
            href={`/admin/kullanicilar/${dispute.openedBy.id}`}
            className="flex items-start gap-3 p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-surface-muted)] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wider">Açan</p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)] transition-colors">{dispute.openedBy.name}</p>
              <p className="text-[11px] text-[var(--admin-text-secondary)] truncate">{dispute.openedBy.email}</p>
            </div>
          </Link>

          <Link
            href={`/admin/kullanicilar/${dispute.job.customer.id}`}
            className="flex items-start gap-3 p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-surface-muted)] transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--admin-warning-soft)] text-[var(--admin-warning)] flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wider">Müşteri</p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)] transition-colors">{dispute.job.customer.name}</p>
              <p className="text-[11px] text-[var(--admin-text-secondary)] truncate">{dispute.job.customer.email}</p>
            </div>
          </Link>

          {dispute.payment && (
            <div className="p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--admin-success-soft)] text-[var(--admin-success)] flex items-center justify-center shrink-0">
                  <CreditCard size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wider">Ödeme</p>
                  <p className="text-sm font-medium text-[var(--admin-text-primary)]">{formatTRY(dispute.payment.amount)}</p>
                  <p className="text-[11px] text-[var(--admin-text-secondary)]">{dispute.payment.status}</p>
                </div>
              </div>
            </div>
          )}

          {dispute.status === "open" && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--admin-warning)]/20 bg-[var(--admin-warning-soft)]">
              <Clock size={14} className="text-[var(--admin-warning)] shrink-0" />
              <p className="text-xs text-[var(--admin-warning)]">
                {Math.floor((Date.now() - new Date(dispute.createdAt).getTime()) / 86400000)} gündür açık
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
