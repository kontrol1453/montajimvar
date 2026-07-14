import Link from "next/link";
import { AlertTriangle, Award, Bell, Scale, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  data: {
    operations: {
      unverifiedProfiles: number;
      openDisputes: number;
      pendingCertificates: number;
    };
    marketplace: {
      jobsWithoutOffers: number;
    };
  };
}

export default function QuickActions({ data }: QuickActionsProps) {
  const { operations: o, marketplace: m } = data;

  const actions = [
    ...(o.unverifiedProfiles > 0
      ? [{
          href: "/admin/firmalar",
          label: "Firmaları Onayla",
          desc: `${o.unverifiedProfiles} firma onay bekliyor`,
          icon: Building2,
          variant: "warning" as const,
        }]
      : []),
    ...(o.pendingCertificates > 0
      ? [{
          href: "/admin/sertifikalar",
          label: "Sertifikaları Onayla",
          desc: `${o.pendingCertificates} sertifika bekliyor`,
          icon: Award,
          variant: "warning" as const,
        }]
      : []),
    ...(o.openDisputes > 0
      ? [{
          href: "/admin/anlasmazliklar",
          label: "Anlaşmazlıkları Çöz",
          desc: `${o.openDisputes} açık anlaşmazlık`,
          icon: Scale,
          variant: "danger" as const,
        }]
      : []),
    ...(m.jobsWithoutOffers > 0
      ? [{
          href: "/admin/isler",
          label: "Teklifsiz İşler",
          desc: `${m.jobsWithoutOffers} iş henüz teklif almadı`,
          icon: AlertTriangle,
          variant: "warning" as const,
        }]
      : []),
    {
      href: "/admin/bildirim",
      label: "Bildirim Gönder",
      desc: "Push notification yönetimi",
      icon: Bell,
      variant: "neutral" as const,
    },
  ];

  if (actions.length === 0) return null;

  const variantColor: Record<string, { border: string; bg: string; icon: string }> = {
    danger: { border: "border-[var(--admin-danger)]/30", bg: "bg-[var(--admin-danger-soft)]", icon: "text-[var(--admin-danger)]" },
    warning: { border: "border-[var(--admin-warning)]/30", bg: "bg-[var(--admin-warning-soft)]", icon: "text-[var(--admin-warning)]" },
    neutral: { border: "border-[var(--admin-border)]", bg: "bg-[var(--admin-surface-muted)]", icon: "text-[var(--admin-text-secondary)]" },
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Operasyonel Kısayollar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const color = variantColor[action.variant];
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-[var(--admin-surface)] hover:shadow-sm transition-shadow group",
                color.border
              )}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", color.bg)}>
                <Icon size={16} className={color.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--admin-text-primary)] group-hover:text-[var(--admin-primary)] transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-[var(--admin-text-secondary)]">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
