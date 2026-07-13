import { Clock, CheckCircle, XCircle, TrendingUp, DollarSign, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceHealthProps {
  data: {
    marketplace: {
      activeJobs: number;
      pendingJobs: number;
      offersReceivedJobs: number;
      jobsWithOffers: number;
      jobsWithoutOffers: number;
      jobsEligibleForOffers: number;
      averageOffersPerJob: number;
      acceptedOffers: number;
      offerAcceptanceRate: number;
      completedJobs: number;
      completionRate: number;
    };
  };
}

interface MetricDef {
  label: string;
  value: string | number;
  icon: typeof Clock;
  description: string;
  variant: "warning" | "success" | "danger" | "info" | "neutral";
}

const variantMap: Record<string, string> = {
  warning: "border-l-[var(--admin-warning)] bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
  success: "border-l-[var(--admin-success)] bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
  danger: "border-l-[var(--admin-danger)] bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
  info: "border-l-[var(--admin-info)] bg-[var(--admin-info-soft)] text-[var(--admin-info)]",
  neutral: "border-l-[var(--admin-text-muted)] bg-[var(--admin-neutral-soft)] text-[var(--admin-text-secondary)]",
};

export default function MarketplaceHealth({ data }: MarketplaceHealthProps) {
  const { marketplace: m } = data;

  const metrics: MetricDef[] = [
    {
      label: "Aktif İşler",
      value: m.activeJobs,
      icon: Clock,
      description: "Şu anda devam eden işler",
      variant: "info",
    },
    {
      label: "Bekleyen İşler",
      value: m.pendingJobs,
      icon: AlertTriangle,
      description: "Henüz teklif almamış işler",
      variant: "warning",
    },
    {
      label: "Tamamlanan",
      value: m.completedJobs,
      icon: CheckCircle,
      description: `Tamamlanma oranı: %${m.completionRate}`,
      variant: "success",
    },
    {
      label: "Teklif Alan",
      value: m.jobsWithOffers,
      icon: TrendingUp,
      description: "En az bir teklif almış işler",
      variant: "info",
    },
    {
      label: "Teklif Almayan",
      value: m.jobsWithoutOffers,
      icon: XCircle,
      description: "Hiç teklif almamış işler",
      variant: m.jobsWithoutOffers > 0 ? "warning" : "success",
    },
    {
      label: "Ort. Teklif",
      value: m.averageOffersPerJob,
      icon: Users,
      description: "Teklif alan iş başına düşen ortalama",
      variant: "neutral",
    },
    {
      label: "Kabul Edilen",
      value: m.acceptedOffers,
      icon: DollarSign,
      description: `Kabul oranı: %${m.offerAcceptanceRate}`,
      variant: "success",
    },
  ];

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Pazar Yeri Sağlığı
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="flex items-start gap-3 p-4 rounded-lg border border-l-4 border-[var(--admin-border)] bg-[var(--admin-surface)]"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", variantMap[m.variant])}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--admin-text-secondary)]">{m.label}</p>
                <p className="text-lg font-bold text-[var(--admin-text-primary)]">{m.value}</p>
                <p className="text-[10px] text-[var(--admin-text-muted)] leading-tight">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}