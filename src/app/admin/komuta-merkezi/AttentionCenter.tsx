import Link from "next/link";
import {
  AlertTriangle, Award, Building2, Scale, ChevronRight, Clock, Briefcase,
} from "lucide-react";

/*
 * ATTENTION PRIORITY ENGINE
 *
 * Deterministic rules — no AI, no opaque scores.
 *
 * CRITICAL (requires immediate admin action):
 *   - Open dispute (financial risk, customer/esnaf dissatisfaction)
 *
 * HIGH (requires timely action):
 *   - >10 pending company approvals (approval bottleneck)
 *   - Job without offers for 7+ days (marketplace failure) — requires Job.dueDate
 *
 * MEDIUM (requires action):
 *   - 1-10 pending company approvals
 *   - Pending certificate verification
 *   - Job without offers (general)
 *
 * INFO (awareness):
 *   - General operational information
 *
 * Waiting time is shown when the data source supports querying the oldest item.
 * Currently: oldest item query not implemented — shown as "Bekliyor" without duration.
 */

interface AttentionData {
  operations: {
    unverifiedProfiles: number;
    openDisputes: number;
    totalDisputes: number;
    pendingCertificates: number;
  };
  marketplace: {
    jobsWithoutOffers: number;
  };
}

interface AttentionCenterProps {
  data: AttentionData;
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

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, info: 3 };

const SEVERITY_CONFIG = {
  critical: {
    border: "border-l-[var(--admin-danger)] bg-[var(--admin-danger-soft)]",
    dot: "bg-[var(--admin-danger)]",
    label: "Kritik",
  },
  high: {
    border: "border-l-[var(--admin-warning)] bg-[var(--admin-warning-soft)]",
    dot: "bg-[var(--admin-warning)]",
    label: "Yüksek",
  },
  medium: {
    border: "border-l-[var(--admin-info)] bg-[var(--admin-info-soft)]",
    dot: "bg-[var(--admin-info)]",
    label: "Orta",
  },
  info: {
    border: "border-l-[var(--admin-text-muted)/30] bg-[var(--admin-surface-muted)]",
    dot: "bg-[var(--admin-text-muted)]",
    label: "Bilgi",
  },
};

export default function AttentionCenter({ data }: AttentionCenterProps) {
  const { operations: o, marketplace: m } = data;

  const items: AttentionItem[] = [];

  // CRITICAL: Open disputes
  if (o.openDisputes > 0) {
    items.push({
      type: "open_dispute",
      severity: "critical",
      label: "Açık Anlaşmazlık",
      count: o.openDisputes,
      href: "/admin/anlasmazliklar",
      icon: Scale,
      explanation: "Çözülmeyi bekleyen anlaşmazlık bulunuyor. Taraflar arasında gecikmeye yol açabilir.",
    });
  }

  // HIGH/MEDIUM: Pending company approvals
  if (o.unverifiedProfiles > 0) {
    items.push({
      type: "unverified_profile",
      severity: o.unverifiedProfiles > 10 ? "high" : "medium",
      label: "Onay Bekleyen Firma",
      count: o.unverifiedProfiles,
      href: "/admin/firmalar",
      icon: Building2,
      explanation: o.unverifiedProfiles > 10
        ? "Birikmiş firma onayları var. Gecikme müşteri deneyimini etkileyebilir."
        : "Onay bekleyen firma profilleri mevcut.",
    });
  }

  // MEDIUM: Pending certificates
  if (o.pendingCertificates > 0) {
    items.push({
      type: "pending_certificate",
      severity: "medium",
      label: "Onay Bekleyen Sertifika",
      count: o.pendingCertificates,
      href: "/admin/sertifikalar",
      icon: Award,
      explanation: "Onay bekleyen usta sertifikaları var.",
    });
  }

  // MEDIUM: Jobs without offers
  if (m.jobsWithoutOffers > 0) {
    items.push({
      type: "jobs_without_offers",
      severity: m.jobsWithoutOffers > 20 ? "high" : "medium",
      label: "Teklif Almayan İş",
      count: m.jobsWithoutOffers,
      href: "/admin/isler",
      icon: Briefcase,
      explanation: "Bu işler hiç teklif almadı. Talep eşleştirme sorunu olabilir.",
    });
  }

  if (items.length === 0) return null;

  items.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-[var(--admin-warning)]" aria-hidden />
        Dikkat Gerektirenler
        <span className="text-xs font-normal text-[var(--admin-text-muted)]">
          ({items.length} kalem)
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const style = SEVERITY_CONFIG[item.severity];

          return (
            <Link
              key={item.type}
              href={item.href}
              className={`flex items-start gap-3 p-4 rounded-lg border border-l-4 border-[var(--admin-border)] ${style.border} hover:shadow-sm transition-shadow group`}
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--admin-surface)] flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-[var(--admin-text-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[var(--admin-text-primary)]">
                    {item.count.toLocaleString("tr-TR")}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden />
                  <span className="text-[10px] uppercase tracking-wider font-medium text-[var(--admin-text-muted)]">
                    {style.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--admin-text-primary)] mt-0.5">{item.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={10} className="text-[var(--admin-text-muted)] shrink-0" aria-hidden />
                  <p className="text-xs text-[var(--admin-text-secondary)]">{item.explanation}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors shrink-0 self-center" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
