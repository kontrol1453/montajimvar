"use client";

import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertTriangle, Briefcase, MessageCircle } from "lucide-react";

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  pending: Clock,
  offers_received: MessageCircle,
  assigned: CheckCircle,
  en_route: Briefcase,
  in_progress: Briefcase,
  completed: CheckCircle,
  review_pending: AlertTriangle,
  cancelled: XCircle,
};

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-[var(--admin-warning-soft)]", text: "text-[var(--admin-warning)]", icon: "text-[var(--admin-warning)]" },
  offers_received: { bg: "bg-[var(--admin-info-soft)]", text: "text-[var(--admin-info)]", icon: "text-[var(--admin-info)]" },
  assigned: { bg: "bg-[var(--admin-success-soft)]", text: "text-[var(--admin-success)]", icon: "text-[var(--admin-success)]" },
  en_route: { bg: "bg-[var(--admin-neutral-soft)]", text: "text-[var(--admin-text-secondary)]", icon: "text-[var(--admin-text-secondary)]" },
  in_progress: { bg: "bg-[var(--admin-info-soft)]", text: "text-[var(--admin-info)]", icon: "text-[var(--admin-info)]" },
  completed: { bg: "bg-[var(--admin-success-soft)]", text: "text-[var(--admin-success)]", icon: "text-[var(--admin-success)]" },
  review_pending: { bg: "bg-[var(--admin-warning-soft)]", text: "text-[var(--admin-warning)]", icon: "text-[var(--admin-warning)]" },
  cancelled: { bg: "bg-[var(--admin-danger-soft)]", text: "text-[var(--admin-danger)]", icon: "text-[var(--admin-danger)]" },
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Oluşturuldu",
  offers_received: "Teklif Alındı",
  assigned: "Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor",
  cancelled: "İptal Edildi",
};

interface TimelineRow {
  id: number;
  status: string;
  note: string | null;
  createdAt: Date | string;
}

interface JobTimelineProps {
  jobId: number;
  data?: TimelineRow[];
}

export default function JobTimeline({ jobId, data }: JobTimelineProps) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-4 py-8 text-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <Clock size={24} className="mx-auto text-[var(--admin-text-muted)] mb-2" />
        <p className="text-sm text-[var(--admin-text-muted)]">Henüz zaman çizgisi kaydı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="relative pl-8 border-l-2 border-[var(--admin-border)] ml-2 space-y-0">
        {data.map((event, i) => {
          const Icon = STATUS_ICONS[event.status] || Clock;
          const colors = STATUS_COLORS[event.status] || STATUS_COLORS.pending;
          const isLast = i === data.length - 1;

          return (
            <div key={event.id} className={`relative pb-6 ${isLast ? "pb-0" : ""}`}>
              <div className={`absolute -left-[calc(2rem+9px)] mt-0.5 w-5 h-5 rounded-full border-2 border-[var(--admin-border)] ${colors.bg} flex items-center justify-center`}>
                <Icon size={10} className={colors.icon} />
              </div>
              <div className={`p-3 rounded-lg border ${colors.bg} border-[var(--admin-border)]`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-medium ${colors.text}`}>
                    {STATUS_LABELS[event.status] || event.status}
                  </span>
                  <span className="text-[10px] text-[var(--admin-text-muted)]">
                    {formatDate(new Date(event.createdAt))}
                  </span>
                </div>
                {event.note && (
                  <p className="text-xs text-[var(--admin-text-secondary)]">{event.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}