"use client";

import Link from "next/link";
import { useState } from "react";
import { UserPlus, Building2, Briefcase, Shield, FileEdit, ChevronRight } from "lucide-react";

interface RecentActivityProps {
  data: {
    recentUsers?: {
      id: number;
      name: string;
      email: string;
      createdAt: Date | string;
    }[];
    recentProfiles?: {
      id: number;
      companyName: string;
      city: string | null;
      createdAt: Date | string;
      user: { name: string };
    }[];
    recentJobs?: {
      id: number;
      title: string;
      status: string;
      city: string;
      createdAt: Date | string;
      customer: { name: string };
    }[];
    recentDisputes?: {
      id: number;
      reason: string;
      status: string;
      createdAt: Date | string;
      openedBy: { name: string };
    }[];
    recentAuditLogs?: {
      id: number;
      action: string;
      entity: string;
      entityId: number;
      details: any;
      createdAt: Date | string;
    }[];
  };
}

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  offers_received: "Teklif Aldı",
  assigned: "Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor",
  cancelled: "İptal",
};

const AUDIT_ACTION_LABELS: Record<string, string> = {
  role_change: "rol değişikliği",
  premium_change: "premium değişikliği",
  delete: "silme",
  approve: "onaylama",
  unverify: "doğrulama kaldırma",
  feature: "vitrin ekleme",
  unfeature: "vitrin kaldırma",
  resolve: "çözümleme",
  update: "güncelleme",
  create: "oluşturma",
};

const FILTERS = [
  { type: "all", label: "Tümü" },
  { type: "user", label: "Kullanıcı" },
  { type: "profile", label: "Firma" },
  { type: "job", label: "İş" },
  { type: "dispute", label: "Anlaşmazlık" },
  { type: "audit", label: "Denetim" },
];

export default function RecentActivity({ data }: RecentActivityProps) {
  const [filter, setFilter] = useState("all");
  const { recentUsers = [], recentProfiles = [], recentJobs = [], recentDisputes = [], recentAuditLogs = [] } = data;

  const items: { type: string; item: any; href: string; label: string; subtitle: string; icon: any }[] = [];

  recentUsers.forEach((u) => {
    items.push({
      type: "user",
      item: u,
      href: `/admin/kullanicilar/${u.id}`,
      label: `${u.name} katıldı`,
      subtitle: u.email,
      icon: UserPlus,
    });
  });

  recentProfiles.forEach((p) => {
    items.push({
      type: "profile",
      item: p,
      href: `/admin/firmalar/${p.id}`,
      label: `${p.companyName} kuruldu`,
      subtitle: `${p.city ?? ""} · ${p.user.name}`,
      icon: Building2,
    });
  });

  recentJobs.forEach((j) => {
    items.push({
      type: "job",
      item: j,
      href: `/admin/isler/${j.id}`,
      label: `${j.title}`,
      subtitle: `${j.customer.name} · ${j.city} · ${STATUS_LABELS[j.status] || j.status}`,
      icon: Briefcase,
    });
  });

  recentDisputes.forEach((d) => {
    items.push({
      type: "dispute",
      item: d,
      href: `/admin/isler?dispute=${d.id}`,
      label: `Anlaşmazlık: ${d.reason.slice(0, 60)}${d.reason.length > 60 ? "..." : ""}`,
      subtitle: `${d.openedBy.name} · ${d.status === "open" ? "Açık" : "Çözüldü"}`,
      icon: Shield,
    });
  });

  recentAuditLogs.forEach((l) => {
    const entityUrl =
      l.entity === "user"
        ? `/admin/kullanicilar/${l.entityId}`
        : l.entity === "profile"
          ? `/admin/firmalar/${l.entityId}`
          : `/admin/isler/${l.entityId}`;
    items.push({
      type: "audit",
      item: l,
      href: entityUrl,
      label: `${AUDIT_ACTION_LABELS[l.action] || l.action}`,
      subtitle: `#${l.entityId} (${l.entity})`,
      icon: FileEdit,
    });
  });

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  filtered.sort((a, b) => {
    const aDate = new Date(a.item.createdAt).getTime();
    const bDate = new Date(b.item.createdAt).getTime();
    return bDate - aDate;
  });

  const top = filtered.slice(0, 20);

  if (top.length === 0) {
    return (
      <div>
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">Son Aktiviteler</h2>
        <div className="rounded-lg border border-[var(--admin-border)] p-8 text-center bg-[var(--admin-surface)]">
          <p className="text-sm text-[var(--admin-text-muted)]">Henüz aktivite kaydı bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
        Son Aktiviteler
      </h2>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.type}
            onClick={() => setFilter(f.type)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              filter === f.type
                ? "bg-[var(--admin-primary)] text-white border-[var(--admin-primary)]"
                : "bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] border-[var(--admin-border)] hover:bg-[var(--admin-surface-muted)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--admin-border)] divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
        {top.map((entry) => {
          const Icon = entry.icon;

          return (
            <Link
              key={`${entry.type}-${entry.item.id}`}
              href={entry.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--admin-surface-muted)] flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[var(--admin-text-secondary)] group-hover:text-[var(--admin-primary)] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--admin-text-primary)] truncate">{entry.label}</p>
                <p className="text-xs text-[var(--admin-text-muted)] truncate">{entry.subtitle}</p>
              </div>
              <span className="text-[10px] text-[var(--admin-text-muted)] shrink-0">{timeAgo(entry.item.createdAt)}</span>
              <ChevronRight size={14} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors shrink-0" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}