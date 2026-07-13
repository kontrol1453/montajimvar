import Link from "next/link";
import { Briefcase, AlertTriangle, CheckCircle, Clock, ChevronRight, XCircle } from "lucide-react";

interface OperationsCenterProps {
  data: {
    marketplace: {
      activeJobs: number;
      pendingJobs: number;
      cancelledJobs: number;
      completedJobs: number;
      offersReceivedJobs: number;
    };
    operations: {
      openDisputes: number;
      unverifiedProfiles: number;
      pendingCertificates: number;
    };
  };
}

interface OpItem {
  label: string;
  value: number;
  href: string;
  icon: typeof Briefcase;
  color: string;
  bg: string;
  alert?: boolean;
}

export default function OperationsCenter({ data }: OperationsCenterProps) {
  const { marketplace: m, operations: o } = data;

  const items: OpItem[] = [
    {
      label: "Devam Eden İşler",
      value: m.activeJobs,
      href: "/admin/isler",
      icon: Briefcase,
      color: "text-[var(--admin-info)]",
      bg: "bg-[var(--admin-info-soft)]",
    },
    {
      label: "Teklif Bekleyen",
      value: m.pendingJobs,
      href: "/admin/isler",
      icon: Clock,
      color: "text-[var(--admin-warning)]",
      bg: "bg-[var(--admin-warning-soft)]",
      alert: m.pendingJobs > 0,
    },
    {
      label: "İptal Edilen",
      value: m.cancelledJobs,
      href: "/admin/isler",
      icon: XCircle,
      color: "text-[var(--admin-danger)]",
      bg: "bg-[var(--admin-danger-soft)]",
    },
    {
      label: "Tamamlanan",
      value: m.completedJobs,
      href: "/admin/isler",
      icon: CheckCircle,
      color: "text-[var(--admin-success)]",
      bg: "bg-[var(--admin-success-soft)]",
    },
    {
      label: "Açık Anlaşmazlık",
      value: o.openDisputes,
      href: "/admin/anlasmazliklar",
      icon: AlertTriangle,
      color: "text-[var(--admin-danger)]",
      bg: "bg-[var(--admin-danger-soft)]",
      alert: o.openDisputes > 0,
    },
    {
      label: "Onay Bekleyen Firma",
      value: o.unverifiedProfiles,
      href: "/admin/firmalar",
      icon: CheckCircle,
      color: "text-[var(--admin-warning)]",
      bg: "bg-[var(--admin-warning-soft)]",
      alert: o.unverifiedProfiles > 0,
    },
  ];

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Operasyonel Görünüm
      </h2>
      <div className="rounded-lg border border-[var(--admin-border)] divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                <Icon size={16} className={item.color} />
              </div>
              <span className="flex-1 text-sm text-[var(--admin-text-primary)] min-w-0">{item.label}</span>
              <span className={`text-sm font-semibold ${item.alert ? "text-[var(--admin-warning)]" : "text-[var(--admin-text-secondary)]"}`}>
                {item.value.toLocaleString("tr-TR")}
              </span>
              <ChevronRight size={14} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors shrink-0" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}