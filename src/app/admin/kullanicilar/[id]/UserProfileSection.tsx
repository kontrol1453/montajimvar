import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface UserProfileSectionProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    roles: string[];
    emailVerified: boolean;
    premiumUntil: Date | null;
    createdAt: Date;
  };
  stats: {
    jobCount: number;
    profileCount: number;
    offerCount: number;
    reviewCount: number;
    totalSpent: number;
  };
}

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<string, "neutral" | "success" | "warning" | "danger"> = {
  CUSTOMER: "neutral",
  ASSEMBLER: "success",
  MANUFACTURER: "success",
  ADMIN: "warning",
};

function formatTRY(kurus: number): string {
  return `${(kurus / 100).toLocaleString("tr-TR")} TL`;
}

export default function UserProfileSection({ user, stats }: UserProfileSectionProps) {
  const isPremium = user.premiumUntil && new Date(user.premiumUntil) > new Date();

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-12 h-12 rounded-full bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] flex items-center justify-center text-lg font-bold">
                {user.name[0]?.toUpperCase() ?? "?"}
              </span>
              <div>
                <h1 className="text-xl font-bold text-[var(--admin-text-primary)]">{user.name}</h1>
                <p className="text-sm text-[var(--admin-text-secondary)]">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {user.roles.map((role) => (
                <Badge key={role} variant={ROLE_COLORS[role] || "neutral"}>
                  {ROLE_LABELS[role] || role}
                </Badge>
              ))}
              {isPremium && (
                <Badge variant="warning">Premium</Badge>
              )}
              {user.emailVerified ? (
                <Badge variant="success">E-posta Doğrulanmış</Badge>
              ) : (
                <Badge variant="neutral">E-posta Doğrulanmamış</Badge>
              )}
            </div>
          </div>
          <Link
            href="/admin/kullanicilar"
            className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
          >
            ← Kullanıcı Listesi
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Telefon</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{user.phone || "—"}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Şehir</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{user.city || "—"}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Kayıt Tarihi</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Premium Bitiş</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString("tr-TR") : "—"}</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mt-6">
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-primary)]">{stats.jobCount}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">İşler</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-success)]">{stats.profileCount}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Firma</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-info)]">{stats.offerCount}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Teklif</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-warning)]">{stats.reviewCount}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Yorum</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-text-primary)]">{formatTRY(stats.totalSpent)}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Harcama</p>
          </div>
        </div>
      </div>
    </div>
  );
}
