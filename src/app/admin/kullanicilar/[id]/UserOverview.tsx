import { formatDate } from "@/lib/utils";

import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface UserOverviewProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    bio: string | null;
    roles: string[];
    emailVerified: boolean;
    identityVerified: boolean;
    isPhoneVerified: boolean;
    premiumUntil: Date | string | null;
    createdAt: Date | string;
    profile: {
      id: number;
      companyName: string;
      isVerified: boolean;
      isFeatured: boolean;
      ratingAvg: number;
      reviewCount: number;
    } | null;
  };
  summary: {
    totalJobs: number;
    totalOffers: number;
    completedJobs: number;
    totalReviews: number;
    totalDisputes: number;
    totalCertificates: number;
    paymentsMade: number;
    paymentsReceived: number;
  };
}

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
  ADMIN: "Admin",
};

export default function UserOverview({ user, summary }: UserOverviewProps) {
  const isPremium = user.premiumUntil && new Date(user.premiumUntil) > new Date();

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Hesap Bilgileri</h3>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
            {[
              ["Ad Soyad", user.name],
              ["E-posta", user.email],
              ...(user.phone ? [["Telefon", user.phone]] : []),
              ...(user.city ? [["Şehir", user.city]] : []),
              ["Roller", user.roles.map((r) => ROLE_LABELS[r] || r).join(", ")],
              ["Kayıt Tarihi", formatDate(new Date(user.createdAt))],
              ...(user.bio ? [["Hakkında", user.bio]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-[var(--admin-text-secondary)]">{label}</span>
                <span className="text-sm text-[var(--admin-text-primary)]">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {user.profile && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Bağlı Firma Profili</h3>
            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
              {[
                ["Firma Adı", user.profile.companyName],
                ["Doğrulama", user.profile.isVerified ? "Onaylı" : "Onaysız"],
                ["Vitrin", user.profile.isFeatured ? "Vitrinde" : "—"],
                ["Puan", user.profile.reviewCount > 0 ? `${user.profile.ratingAvg}/5 (${user.profile.reviewCount} yorum)` : "Henüz yorum yok"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-[var(--admin-text-secondary)]">{label}</span>
                  <span className="text-sm text-[var(--admin-text-primary)]">{value}</span>
                </div>
              ))}
            </div>
            <Link
              href={`/admin/firmalar/${user.profile.id}`}
              className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--admin-primary)] hover:underline"
            >
              Firma Profiline Git →
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Doğrulama Durumu</h3>
          <div className="space-y-2">
            {[
              ["E-posta", user.emailVerified],
              ["Kimlik", user.identityVerified],
              ["Telefon", user.isPhoneVerified],
            ].map(([label, verified]) => (
              <div key={String(label)} className={`flex items-center justify-between p-3 rounded-lg border ${verified ? "border-[var(--admin-success)]/20 bg-[var(--admin-success-soft)]" : "border-[var(--admin-border)] bg-[var(--admin-surface)]"}`}>
                <span className="text-sm text-[var(--admin-text-primary)]">{label}</span>
                <span className={`text-xs font-medium ${verified ? "text-[var(--admin-success)]" : "text-[var(--admin-warning)]"}`}>
                  {verified ? "Doğrulandı" : "Doğrulanmadı"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Premium</h3>
          <div className={`p-3 rounded-lg border ${isPremium ? "border-[var(--admin-premium)]/20 bg-[var(--admin-premium-soft)]" : "border-[var(--admin-border)] bg-[var(--admin-surface)]"}`}>
            <p className={`text-sm font-medium ${isPremium ? "text-[var(--admin-premium)]" : "text-[var(--admin-text-secondary)]"}`}>
              {isPremium ? `Aktif — Bitiş: ${formatDate(new Date(user.premiumUntil!))}` : "Premium değil"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Platform Özeti</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["İş Açtı", summary.totalJobs],
              ["Teklif Verdi", summary.totalOffers],
              ["Tamamladı", summary.completedJobs],
              ["Yorum", summary.totalReviews],
              ["Anlaşmazlık", summary.totalDisputes],
              ["Sertifika", summary.totalCertificates],
              ["Ödedi", summary.paymentsMade],
              ["Kazandı", summary.paymentsReceived],
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