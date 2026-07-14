"use client";

import { formatDate } from "@/lib/utils";
import { DollarSign, User, FileText, Clock } from "lucide-react";

interface PaymentData {
  id: number;
  amount: number;
  commission: number;
  status: string;
  method: string | null;
  paidAt: string | null;
  releasedAt: string | null;
  createdAt: string;
  customer: { id: number; name: string };
  artisan: { id: number; name: string };
  invoices: { id: number; invoiceNo: string; amount: number; status: string }[];
}

interface JobPaymentProps {
  jobId: number;
  data: PaymentData | null;
}

const STATUS_LABELS: Record<string, string> = {
  escrow: "Blokede",
  released: "Serbest Bırakıldı",
  refunded: "İade Edildi",
  cancelled: "İptal Edildi",
};

const STATUS_VARIANT: Record<string, string> = {
  escrow: "text-[var(--admin-warning)] bg-[var(--admin-warning-soft)]",
  released: "text-[var(--admin-success)] bg-[var(--admin-success-soft)]",
  refunded: "text-[var(--admin-danger)] bg-[var(--admin-danger-soft)]",
  cancelled: "text-[var(--admin-text-muted)] bg-[var(--admin-surface-muted)]",
};

export default function JobPayment({ jobId, data }: JobPaymentProps) {
  if (!data) {
    return (
      <div className="mt-4 p-8 text-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]" role="status">
        <DollarSign size={32} className="mx-auto text-[var(--admin-text-muted)] mb-2" aria-hidden />
        <p className="text-sm text-[var(--admin-text-muted)]">Bu iş için henüz bir ödeme kaydı bulunmuyor.</p>
      </div>
    );
  }

  const tlAmount = (data.amount / 100).toLocaleString("tr-TR");
  const tlCommission = (data.commission / 100).toLocaleString("tr-TR");
  const tlNet = ((data.amount - data.commission) / 100).toLocaleString("tr-TR");

  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-secondary)]">Toplam Tutar</p>
          <p className="text-xl font-bold text-[var(--admin-text-primary)]">{tlAmount} TL</p>
        </div>
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-secondary)]">Komisyon</p>
          <p className="text-xl font-bold text-[var(--admin-text-secondary)]">{tlCommission} TL</p>
        </div>
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-secondary)]">Ustaya Ödenecek</p>
          <p className="text-xl font-bold text-[var(--admin-success)]">{tlNet} TL</p>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-[var(--admin-text-secondary)]">Durum</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_VARIANT[data.status] || "text-[var(--admin-text-secondary)] bg-[var(--admin-surface-muted)]"}`}>
            {STATUS_LABELS[data.status] || data.status}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-[var(--admin-text-secondary)]">Ödeme Yöntemi</span>
          <span className="text-sm text-[var(--admin-text-primary)]">{data.method || "—"}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-[var(--admin-text-secondary)]">Müşteri</span>
          <span className="text-sm text-[var(--admin-text-primary)]">{data.customer.name}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-[var(--admin-text-secondary)]">Usta</span>
          <span className="text-sm text-[var(--admin-text-primary)]">{data.artisan.name}</span>
        </div>
        {data.paidAt && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-[var(--admin-text-secondary)]">Ödeme Tarihi</span>
            <span className="text-sm text-[var(--admin-text-primary)]">{formatDate(new Date(data.paidAt))}</span>
          </div>
        )}
        {data.releasedAt && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-[var(--admin-text-secondary)]">Serbest Bırakılma</span>
            <span className="text-sm text-[var(--admin-text-primary)]">{formatDate(new Date(data.releasedAt))}</span>
          </div>
        )}
      </div>

      {data.invoices.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Faturalar</h3>
          <div className="rounded-lg border border-[var(--admin-border)] divide-y divide-[var(--admin-border)]">
            {data.invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-4 py-3 bg-[var(--admin-surface)]">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-[var(--admin-text-muted)]" aria-hidden />
                  <span className="text-sm text-[var(--admin-text-primary)]">{inv.invoiceNo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--admin-text-secondary)]">{(inv.amount / 100).toLocaleString("tr-TR")} TL</span>
                  <span className="text-xs text-[var(--admin-text-muted)]">{inv.status === "paid" ? "Ödendi" : inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
