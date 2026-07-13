import Link from "next/link";
import { AlertTriangle, Award, Building2, Scale, ChevronRight } from "lucide-react";

interface AttentionCenterProps {
  data: {
    operations: {
      unverifiedProfiles: number;
      openDisputes: number;
      totalDisputes: number;
      pendingCertificates: number;
    };
    platform: {
      totalUsers: number;
    };
  };
}

interface AttentionItem {
  type: string;
  severity: "critical" | "high" | "medium" | "info";
  label: string;
  count: number;
  href: string;
  icon: typeof AlertTriangle;
  explanation: string;
}

export default function AttentionCenter({ data }: AttentionCenterProps) {
  const { operations } = data;

  const items: AttentionItem[] = [];

  if (operations.unverifiedProfiles > 0) {
    items.push({
      type: "unverified_profile",
      severity: operations.unverifiedProfiles > 10 ? "high" : "medium",
      label: "Onay Bekleyen Firma",
      count: operations.unverifiedProfiles,
      href: "/admin/firmalar",
      icon: Building2,
      explanation: "Onay bekleyen firma profilleri mevcut.",
    });
  }

  if (operations.openDisputes > 0) {
    items.push({
      type: "open_dispute",
      severity: "critical",
      label: "Açık Anlaşmazlık",
      count: operations.openDisputes,
      href: "/admin/anlasmazliklar",
      icon: Scale,
      explanation: "Çözülmeyi bekleyen anlaşmazlık bulunuyor.",
    });
  }

  if (operations.pendingCertificates > 0) {
    items.push({
      type: "pending_certificate",
      severity: "medium",
      label: "Onay Bekleyen Sertifika",
      count: operations.pendingCertificates,
      href: "/admin/sertifikalar",
      icon: Award,
      explanation: "Onay bekleyen usta sertifikaları var.",
    });
  }

  if (items.length === 0) {
    return null;
  }

  const severityOrder = { critical: 0, high: 1, medium: 2, info: 3 };
  items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-[var(--admin-warning)]" aria-hidden />
        Dikkat Gerektirenler
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const severityColor =
            item.severity === "critical"
              ? "border-l-[var(--admin-danger)] bg-[var(--admin-danger-soft)]"
              : item.severity === "high"
                ? "border-l-[var(--admin-warning)] bg-[var(--admin-warning-soft)]"
                : "border-l-[var(--admin-info)] bg-[var(--admin-info-soft)]";
          const severityDot =
            item.severity === "critical"
              ? "bg-[var(--admin-danger)]"
              : item.severity === "high"
                ? "bg-[var(--admin-warning)]"
                : "bg-[var(--admin-info)]";
          const severityLabel =
            item.severity === "critical"
              ? "Kritik"
              : item.severity === "high"
                ? "Yüksek"
                : "Orta";

          return (
            <Link
              key={item.type}
              href={item.href}
              className={`flex items-start gap-3 p-4 rounded-lg border border-l-4 border-[var(--admin-border)] ${severityColor} hover:shadow-sm transition-shadow group`}
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--admin-surface)] flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-[var(--admin-text-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[var(--admin-text-primary)]">{item.count}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${severityDot}`} aria-hidden />
                  <span className="text-[10px] uppercase tracking-wider font-medium text-[var(--admin-text-muted)]">
                    {severityLabel}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--admin-text-primary)] mt-0.5">{item.label}</p>
                <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5">{item.explanation}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors shrink-0 self-center" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}