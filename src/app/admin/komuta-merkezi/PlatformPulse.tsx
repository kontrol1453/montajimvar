import Link from "next/link";
import { Users, Building2, Briefcase, TrendingUp } from "lucide-react";

interface PlatformPulseProps {
  data: {
    platform: {
      totalUsers: number;
      totalProfiles: number;
      totalJobs: number;
      totalOffers: number;
    };
    marketplace: {
      activeJobs: number;
      jobsEligibleForOffers: number;
    };
  };
}

const metrics = [
  {
    key: "totalUsers",
    label: "Kullanıcılar",
    href: "/admin/kullanicilar",
    icon: Users,
    color: "border-l-[var(--admin-primary)]",
    bg: "bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]",
  },
  {
    key: "totalProfiles",
    label: "Firmalar",
    href: "/admin/firmalar",
    icon: Building2,
    color: "border-l-[var(--admin-warning)]",
    bg: "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
  },
  {
    key: "totalJobs",
    label: "İşler",
    href: "/admin/isler",
    icon: Briefcase,
    color: "border-l-[var(--admin-info)]",
    bg: "bg-[var(--admin-info-soft)] text-[var(--admin-info)]",
  },
  {
    key: "totalOffers",
    label: "Teklifler",
    href: "/admin/isler",
    icon: TrendingUp,
    color: "border-l-[var(--admin-success)]",
    bg: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
  },
] as const;

export default function PlatformPulse({ data }: PlatformPulseProps) {
  const stats = metrics.map((m) => ({
    ...m,
    value: data.platform[m.key],
  }));

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Platform Durumu
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.key}
              href={stat.href}
              className={`group flex flex-col p-4 rounded-lg border border-l-4 border-[var(--admin-border)] ${stat.color} bg-[var(--admin-surface)] hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[var(--admin-text-secondary)]">{stat.label}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon size={14} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--admin-text-primary)]">{stat.value.toLocaleString("tr-TR")}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}