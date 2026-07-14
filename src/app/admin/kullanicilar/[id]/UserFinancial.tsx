"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface PaymentItem {
  id: number;
  amount: number;
  commission: number;
  status: string;
  method: string | null;
  paidAt: string | null;
  createdAt: string;
  job: { id: number; title: string };
  artisan?: { id: number; name: string };
  customer?: { id: number; name: string };
}

interface UserFinancialProps {
  userId: number;
  data: {
    paymentsMade: PaymentItem[];
    paymentsReceived: PaymentItem[];
  };
}

function formatTRY(kurus: number): string {
  return `${(kurus / 100).toLocaleString("tr-TR")} TL`;
}

function PaymentList({ items, type, userId }: { items: PaymentItem[]; type: "made" | "received"; userId: number }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 text-center">
        <p className="text-sm text-[var(--admin-text-muted)]">
          {type === "made" ? "Henüz ödeme yapılmamış." : "Henüz ödeme alınmamış."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--admin-border)] divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
      {items.map((p) => {
        const net = type === "received" ? p.amount - p.commission : p.amount;
        return (
          <div key={p.id} className="flex items-center justify-between p-3">
            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/isler/${p.job.id}`}
                className="text-sm font-medium text-[var(--admin-primary)] hover:underline truncate block"
              >
                {p.job.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-[var(--admin-text-muted)]">
                <span>
                  {type === "made"
                    ? `Usta: ${(p as any).artisan?.name || "—"}`
                    : `Müşteri: ${(p as any).customer?.name || "—"}`}
                </span>
                <span>·</span>
                <span>{formatDate(new Date(p.createdAt))}</span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className={`text-sm font-semibold ${type === "made" ? "text-[var(--admin-danger)]" : "text-[var(--admin-success)]"}`}>
                {type === "made" ? "-" : "+"}{formatTRY(net)}
              </p>
              {p.commission > 0 && type === "received" && (
                <p className="text-[10px] text-[var(--admin-text-muted)]">Komisyon: {formatTRY(p.commission)}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function UserFinancial({ userId, data }: UserFinancialProps) {
  const madeTotal = data.paymentsMade.reduce((s, p) => s + p.amount, 0);
  const receivedTotal = data.paymentsReceived.reduce((s, p) => s + p.amount, 0);
  const receivedCommission = data.paymentsReceived.reduce((s, p) => s + p.commission, 0);

  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-secondary)]">Toplam Ödenen</p>
          <p className="text-xl font-bold text-[var(--admin-danger)]">{formatTRY(madeTotal)}</p>
          <p className="text-[10px] text-[var(--admin-text-muted)]">{data.paymentsMade.length} işlem</p>
        </div>
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-secondary)]">Toplam Kazanılan</p>
          <p className="text-xl font-bold text-[var(--admin-success)]">{formatTRY(receivedTotal)}</p>
          <p className="text-[10px] text-[var(--admin-text-muted)]">{data.paymentsReceived.length} işlem</p>
        </div>
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <p className="text-xs text-[var(--admin-text-secondary)]">Net (Kazanç - Komisyon)</p>
          <p className="text-xl font-bold text-[var(--admin-text-primary)]">{formatTRY(receivedTotal - receivedCommission)}</p>
          <p className="text-[10px] text-[var(--admin-text-muted)]">Komisyon: {formatTRY(receivedCommission)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3 flex items-center gap-2">
          <ArrowUpRight size={14} className="text-[var(--admin-danger)]" /> Ödenen Ödemeler
        </h3>
        <PaymentList items={data.paymentsMade} type="made" userId={userId} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3 flex items-center gap-2">
          <ArrowDownLeft size={14} className="text-[var(--admin-success)]" /> Alınan Ödemeler
        </h3>
        <PaymentList items={data.paymentsReceived} type="received" userId={userId} />
      </div>
    </div>
  );
}
