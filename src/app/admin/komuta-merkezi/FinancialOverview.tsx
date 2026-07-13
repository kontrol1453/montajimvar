import { DollarSign, CreditCard, Clock } from "lucide-react";
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
    };
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
  ];

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Finansal Görünüm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    </div>
  );
}