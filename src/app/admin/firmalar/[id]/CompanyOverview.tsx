import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function CompanyOverview({ profile, summary }: any) {
  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Firma Bilgileri</h3>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
            {[
              ["Firma Adı", profile.companyName],
              ["Açıklama", profile.description || "—"],
              ["Ana Kategori", profile.category?.name || "—"],
              ["Tüm Kategoriler", profile.categoryNames?.join(", ") || (profile.category?.name || "—")],
              ["Şehir", profile.city],
              ...(profile.address ? [["Adres", profile.address]] : []),
              ...(profile.phone ? [["Telefon", profile.phone]] : []),
              ...(profile.website ? [["Web Sitesi", profile.website]] : []),
              ...(profile.whatsapp ? [["WhatsApp", profile.whatsapp]] : []),
              ["Hizmet Alanı", profile.serviceArea ? `${profile.serviceArea} km` : "—"],
              ["Sigorta", profile.hasInsurance ? "Var" : "Yok"],
              ["Garanti", profile.hasGuarantee ? "Var" : "Yok"],
              ["Görüntülenme", String(profile.viewCount || 0)],
              ["Kayıt", formatDate(new Date(profile.createdAt))],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-[var(--admin-text-secondary)]">{label}</span>
                <span className="text-sm text-[var(--admin-text-primary)] max-w-[50%] truncate text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Firma Sahibi</h3>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] flex items-center justify-center text-sm font-bold shrink-0">
              {profile.user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <Link href={`/admin/kullanicilar/${profile.user.id}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
                {profile.user.name}
              </Link>
              <p className="text-xs text-[var(--admin-text-muted)]">{profile.user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Doğrulama & Vitrin</h3>
          <div className="space-y-2">
            <div className={`flex items-center justify-between p-3 rounded-lg border ${profile.isVerified ? "border-[var(--admin-success)]/20 bg-[var(--admin-success-soft)]" : "border-[var(--admin-border)] bg-[var(--admin-surface)]"}`}>
              <span className="text-sm">Doğrulama</span>
              <span className={`text-xs font-medium ${profile.isVerified ? "text-[var(--admin-success)]" : "text-[var(--admin-warning)]"}`}>
                {profile.isVerified ? "Onaylı" : "Onay Bekliyor"}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${profile.isFeatured ? "border-[var(--admin-premium)]/20 bg-[var(--admin-premium-soft)]" : "border-[var(--admin-border)] bg-[var(--admin-surface)]"}`}>
              <span className="text-sm">Vitrin</span>
              <span className={`text-xs font-medium ${profile.isFeatured ? "text-[var(--admin-premium)]" : "text-[var(--admin-text-secondary)]"}`}>
                {profile.isFeatured ? "Vitrinde" : "—"}
              </span>
            </div>
          </div>
        </div>

        {profile.subscription && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Abonelik</h3>
            <div className="p-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
              <p className="text-sm font-medium">{profile.subscription.name}</p>
              <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5">
                {profile.subscription.price > 0 ? `${profile.subscription.price / 100} TL / ${profile.subscription.durationDays} gün` : "Ücretsiz"}
              </p>
              {profile.premiumUntil && new Date(profile.premiumUntil) > new Date() && (
                <p className="text-xs text-[var(--admin-premium)] mt-1">
                  Premium — Bitiş: {formatDate(new Date(profile.premiumUntil))}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">İş Özeti</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Toplam İş", summary.totalJobs],
              ["Devam Eden", summary.activeJobs],
              ["Bekleyen", summary.pendingJobs],
              ["Tamamlanan", summary.completedJobs],
              ["İptal", summary.cancelledJobs],
            ].map(([label, count]) => (
              <div key={label} className="p-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
                <p className="text-lg font-bold text-[var(--admin-text-primary)]">{count}</p>
                <p className="text-[11px] text-[var(--admin-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}