import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface CompanyProfileSectionProps {
  profile: {
    id: number;
    companyName: string;
    description: string;
    city: string;
    address: string | null;
    phone: string | null;
    website: string | null;
    isVerified: boolean;
    isFeatured: boolean;
    premiumUntil: Date | null;
    viewCount: number;
    ratingAvg: number;
    reviewCount: number;
    category: { id: number; name: string } | null;
    categories: { category: { id: number; name: string } }[];
    user: { id: number; name: string; email: string; phone: string | null };
    _count: { reviews: number; favorites: number; images: number };
    createdAt: Date;
  };
}

export default function CompanyProfileSection({ profile }: CompanyProfileSectionProps) {
  const p = profile;
  const allCategories = [
    ...(p.category ? [p.category] : []),
    ...p.categories.map((pc) => pc.category).filter((c) => c.id !== p.category?.id),
  ];

  const isPremium = p.premiumUntil && new Date(p.premiumUntil) > new Date();

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-12 rounded-xl bg-[var(--admin-warning-soft)] text-[var(--admin-warning)] flex items-center justify-center text-lg font-bold">
                {p.companyName[0]?.toUpperCase() ?? "?"}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[var(--admin-text-primary)]">{p.companyName}</h1>
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--admin-premium-soft)] text-[var(--admin-premium)] text-xs font-medium rounded-full">
                      Vitrin
                    </span>
                  )}
                  {isPremium && (
                    <Badge variant="warning">Premium</Badge>
                  )}
                </div>
                <p className="text-sm text-[var(--admin-text-secondary)]">Sahip: {p.user.name} ({p.user.email})</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {p.isVerified ? (
                <Badge variant="success">Onaylı</Badge>
              ) : (
                <Badge variant="neutral">Onay Bekliyor</Badge>
              )}
              {allCategories.map((cat) => (
                <Badge key={cat.id} variant="info">{cat.name}</Badge>
              ))}
            </div>
          </div>
          <Link
            href="/admin/firmalar"
            className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
          >
            ← Firma Listesi
          </Link>
        </div>

        {p.description && (
          <p className="text-sm text-[var(--admin-text-secondary)] mt-4 line-clamp-3">{p.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Şehir", value: p.city },
            { label: "Adres", value: p.address },
            { label: "Telefon", value: p.phone || p.user.phone },
            { label: "Website", value: p.website },
            { label: "Görüntülenme", value: String(p.viewCount) },
            { label: "Puan", value: p.ratingAvg > 0 ? `${p.ratingAvg}/5` : "—" },
            { label: "Kayıt Tarihi", value: new Date(p.createdAt).toLocaleDateString("tr-TR") },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
              <p className="text-xs text-[var(--admin-text-muted)]">{label}</p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate">{value || "—"}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-primary)]">{p._count.reviews}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Yorum</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-warning)]">{p._count.favorites}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Favori</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-success)]">{p._count.images}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Fotoğraf</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold">{p.viewCount}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Görüntülenme</p>
          </div>
        </div>
      </div>
    </div>
  );
}
