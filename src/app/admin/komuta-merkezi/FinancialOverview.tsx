import { DollarSign, CreditCard, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialOverviewProps {
  data: {
    financial: {
      totalRevenue: number;
      totalCommission: number;
      totalPayments: number;
      latestPayment: string | null;
      subscriptionRevenue: number;
      subscriptionCount: number;
      escrowAmount: number;
      escrowCount: number;
    };
    marketplace: {
      jobsEligibleForOffers: number;
    };
    monthlyBreakdown?: { month: string; volume: number; commission: number; count: number }[];
  };
}

function formatTRY(kurus: number): string {
  const tl = kurus / 100;
  if (tl === 0) return "—";
  return `${tl.toLocaleString("tr-TR")} TL`;
}

export default function FinancialOverview({ data }: FinancialOverviewProps) {
  const { financial: f } = data;

  const cards = [
    {
      label: "Toplam İşlem Hacmi",
      value: formatTRY(f.totalRevenue),
      icon: DollarSign,
      color: "border-l-[var(--admin-success)]",
      bg: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
      desc: `${f.totalPayments.toLocaleString("tr-TR")} ödeme`,
    },
    {
      label: "Platform Komisyonu",
      value: formatTRY(f.totalCommission),
      icon: CreditCard,
      color: "border-l-[var(--admin-info)]",
      bg: "bg-[var(--admin-info-soft)] text-[var(--admin-info)]",
      desc: f.totalCommission > 0
        ? `Oran: %${Math.round((f.totalCommission / f.totalRevenue) * 100)}`
        : "Komisyon verisi yok",
    },
    {
      label: "Abonelik Geliri",
      value: formatTRY(f.subscriptionRevenue),
      icon: Clock,
      color: "border-l-[var(--admin-warning)]",
      bg: "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
      desc: `${f.subscriptionCount.toLocaleString("tr-TR")} ödeme`,
    },
    {
      label: "Blokede Tutar",
      value: formatTRY(f.escrowAmount),
      icon: Lock,
      color: "border-l-[var(--admin-danger)]",
      bg: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
      desc: `${f.escrowCount.toLocaleString("tr-TR")} blokede ödeme`,
    },
  ];

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Finansal Görünüm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`flex items-start gap-3 p-4 rounded-lg border border-l-4 border-[var(--admin-border)] ${card.color} bg-[var(--admin-surface)]`}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", card.bg)}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--admin-text-secondary)]">{card.label}</p>
                <p className="text-lg font-bold text-[var(--admin-text-primary)]">{card.value}</p>
                <p className="text-[10px] text-[var(--admin-text-muted)] leading-tight">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {data.monthlyBreakdown && data.monthlyBreakdown.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Aylık Kırılım (Son 12 Ay)</h3>
          <div className="overflow-x-auto rounded-lg border border-[var(--admin-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--admin-surface-muted)] border-b border-[var(--admin-border)]">
                  <th className="text-left px-4 py-2 text-xs text-[var(--admin-text-secondary)] font-medium">Ay</th>
                  <th className="text-right px-4 py-2 text-xs text-[var(--admin-text-secondary)] font-medium">Hacim</th>
                  <th className="text-right px-4 py-2 text-xs text-[var(--admin-text-secondary)] font-medium">Komisyon</th>
                  <th className="text-right px-4 py-2 text-xs text-[var(--admin-text-secondary)] font-medium">Adet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {data.monthlyBreakdown.map((row) => (
                  <tr key={row.month} className="hover:bg-[var(--admin-surface-muted)]">
                    <td className="px-4 py-2 text-[var(--admin-text-primary)]">{row.month}</td>
                    <td className="px-4 py-2 text-right text-[var(--admin-text-primary)]">{formatTRY(row.volume)}</td>
                    <td className="px-4 py-2 text-right text-[var(--admin-text-secondary)]">{formatTRY(row.commission)}</td>
                    <td className="px-4 py-2 text-right text-[var(--admin-text-muted)]">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}