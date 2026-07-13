import Link from "next/link";
import { UserPlus, Building2, Briefcase, ChevronRight } from "lucide-react";

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

export default function RecentActivity({ data }: RecentActivityProps) {
  const { recentUsers = [], recentProfiles = [], recentJobs = [] } = data;

  const items: { type: "user" | "profile" | "job"; item: any; href: string; label: string; icon: typeof UserPlus }[] = [];

  recentUsers.forEach((u) => {
    items.push({
      type: "user",
      item: u,
      href: `/admin/kullanicilar/${u.id}`,
      label: `${u.name} katıldı`,
      icon: UserPlus,
    });
  });

  recentProfiles.forEach((p) => {
    items.push({
      type: "profile",
      item: p,
      href: `/admin/firmalar/${p.id}`,
      label: `${p.companyName} kuruldu`,
      icon: Building2,
    });
  });

  recentJobs.forEach((j) => {
    items.push({
      type: "job",
      item: j,
      href: `/admin/isler/${j.id}`,
      label: `${j.title}`,
      icon: Briefcase,
    });
  });

  items.sort((a, b) => {
    const aDate = new Date(a.item.createdAt).getTime();
    const bDate = new Date(b.item.createdAt).getTime();
    return bDate - aDate;
  });

  const top = items.slice(0, 10);

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
      <div className="rounded-lg border border-[var(--admin-border)] divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
        {top.map((entry) => {
          const Icon = entry.icon;
          const item = entry.item;
          const subtitle =
            entry.type === "user"
              ? item.email
              : entry.type === "profile"
                ? `${item.city ?? ""} · ${item.user.name}`
                : `${item.customer.name} · ${item.city} · ${STATUS_LABELS[item.status] || item.status}`;

          return (
            <Link
              key={`${entry.type}-${item.id}`}
              href={entry.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--admin-surface-muted)] flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[var(--admin-text-secondary)] group-hover:text-[var(--admin-primary)] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--admin-text-primary)] truncate">{entry.label}</p>
                <p className="text-xs text-[var(--admin-text-muted)] truncate">{subtitle}</p>
              </div>
              <span className="text-[10px] text-[var(--admin-text-muted)] shrink-0">{timeAgo(item.createdAt)}</span>
              <ChevronRight size={14} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors shrink-0" aria-hidden />
            </Link>
          );
        })}
      </div>
    </div>
  );
}