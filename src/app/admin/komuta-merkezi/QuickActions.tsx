import Link from "next/link";
import {
  Users,
  Building2,
  AlertTriangle,
  ShieldAlert,
  Star,
  Bell,
  CreditCard,
  Award,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  data: {
    operations: {
      unverifiedProfiles: number;
      openDisputes: number;
      pendingCertificates: number;
    };
    platform: {
      totalUsers: number;
    };
  };
}

export default function QuickActions({ data }: QuickActionsProps) {
  const { operations: o } = data;

  const actions = [
    {
      href: "/admin/kullanicilar",
      label: "Kullanıcıları Yönet",
      desc: `${data.platform.totalUsers.toLocaleString("tr-TR")} kullanıcı`,
      icon: Users,
      variant: "info",
    },
    {
      href: "/admin/firmalar",
      label: o.unverifiedProfiles > 0 ? "Onayları İncele" : "Firmaları Gör",
      desc: o.unverifiedProfiles > 0 ? `${o.unverifiedProfiles} firma onay bekliyor` : "Tüm firmalar",
      icon: Building2,
      variant: o.unverifiedProfiles > 0 ? "warning" : "neutral",
    },
    {
      href: "/admin/isler",
      label: "İşleri Yönet",
      desc: "İşleri görüntüle ve durum değiştir",
      icon: Briefcase,
      variant: "info",
    },
    {
      href: "/admin/sertifikalar",
      label: o.pendingCertificates > 0 ? "Sertifikaları Onayla" : "Sertifikaları Gör",
      desc: o.pendingCertificates > 0 ? `${o.pendingCertificates} sertifika bekliyor` : "Sertifika yönetimi",
      icon: Award,
      variant: o.pendingCertificates > 0 ? "warning" : "neutral",
    },
    {
      href: "/admin/anlasmazliklar",
      label: o.openDisputes > 0 ? "Anlaşmazlıkları Çöz" : "Anlaşmazlıkları Gör",
      desc: o.openDisputes > 0 ? `${o.openDisputes} açık anlaşmazlık` : "Anlaşmazlık yönetimi",
      icon: AlertTriangle,
      variant: o.openDisputes > 0 ? "danger" : "neutral",
    },
    {
      href: "/admin/yorumlar",
      label: "Yorumları Yönet",
      desc: "Firma ve iş yorumları",
      icon: Star,
      variant: "neutral",
    },
    {
      href: "/admin/bildirim",
      label: "Bildirim Gönder",
      desc: "Push notification yönetimi",
      icon: Bell,
      variant: "neutral",
    },
    {
      href: "/admin/abonelik-plani",
      label: "Abonelik Planları",
      desc: "Premium üyelik yönetimi",
      icon: CreditCard,
      variant: "neutral",
    },
    {
      href: "/admin/izinler",
      label: "İzinleri Yönet",
      desc: "Rol bazlı yetkilendirme",
      icon: ShieldAlert,
      variant: "neutral",
    },
  ];

  const variantColor: Record<string, { border: string; bg: string; icon: string }> = {
    danger: {
      border: "border-[var(--admin-danger)]/30",
      bg: "bg-[var(--admin-danger-soft)]",
      icon: "text-[var(--admin-danger)]",
    },
    warning: {
      border: "border-[var(--admin-warning)]/30",
      bg: "bg-[var(--admin-warning-soft)]",
      icon: "text-[var(--admin-warning)]",
    },
    info: {
      border: "border-[var(--admin-border)]",
      bg: "bg-[var(--admin-info-soft)]",
      icon: "text-[var(--admin-info)]",
    },
    neutral: {
      border: "border-[var(--admin-border)]",
      bg: "bg-[var(--admin-surface-muted)]",
      icon: "text-[var(--admin-text-secondary)]",
    },
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Hızlı İşlemler
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