import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { TrendingUp, Eye, Clock, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const OFFER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  accepted: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
  withdrawn: "bg-gray-500/10 text-gray-500",
};

const OFFER_STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
  withdrawn: "Geri Çekildi",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return (amount / 100).toLocaleString("tr-TR") + " ₺";
}

export default async function TekliflerPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = Number((session.user as any).id);
  const roles: string[] = (session.user as any).roles || [];
  const isArtisan = roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER") || roles.includes("ARTISAN");

  const offers = await prisma.offer.findMany({
    where: isArtisan ? { artisanId: userId } : { job: { customerId: userId } },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          status: true,
          city: true,
          budgetMin: true,
          budgetMax: true,
        },
      },
      artisan: {
        select: {
          id: true,
          name: true,
          avatar: true,
          profile: { select: { companyName: true, ratingAvg: true } },
        },
      },
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-dark)]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              Tekliflerim
            </h1>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
              {isArtisan ? "Gönderdiğiniz teklifleri görüntüleyin" : "İşlerinize gelen teklifleri görüntüleyin"}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/5 rounded-xl text-sm font-medium text-[var(--color-primary)]">
            <TrendingUp size={18} />
            {offers.length} teklif
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary)]/5 flex items-center justify-center">
              <TrendingUp size={32} className="text-[var(--color-text-tertiary)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-dark)] mb-2">
              Henüz teklifiniz yok
            </h2>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
              {isArtisan
                ? "Uygun işlere teklif göndermek için iş ilanlarını inceleyin"
                : "İş verdiğinizde ustalar teklif göndermeye başlayacak"}
            </p>
            <Link
              href={isArtisan ? "/is-ilanlari" : "/is-ver"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-all"
            >
              {isArtisan ? "İş İlanlarını Gör" : "İş Ver"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {offers.map((offer) => (
              <Link
                key={offer.id}
                href={`/isler/${offer.job.id}`}
                className="card p-5 group hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          OFFER_STATUS_COLORS[offer.status] || "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {OFFER_STATUS_LABELS[offer.status] || offer.status}
                      </span>
                      {isArtisan && (
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          {offer.job.status === "pending" ? "Teklif bekliyor" : offer.job.status === "offers_received" ? "Teklif alınıyor" : ""}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[var(--color-dark)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {offer.job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-[var(--color-text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(offer.createdAt)}
                      </span>
                      {offer.job.city && (
                        <span>{offer.job.city}</span>
                      )}
                      {!isArtisan && offer.artisan?.profile?.companyName && (
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {offer.artisan.profile.companyName}
                        </span>
                      )}
                      {!isArtisan && offer.artisan?.profile?.ratingAvg && offer.artisan.profile.ratingAvg > 0 && (
                        <span className="text-yellow-600">⭐ {offer.artisan.profile.ratingAvg.toFixed(1)}</span>
                      )}
                      {isArtisan && offer.job.budgetMin && (
                        <span>
                          Bütçe: {formatAmount(offer.job.budgetMin)}
                          {offer.job.budgetMax && ` - ${formatAmount(offer.job.budgetMax)}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-extrabold text-[var(--color-dark)]" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                      {formatAmount(offer.amount)}
                    </p>
                    {offer.duration && (
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                        {offer.duration}
                      </p>
                    )}
                  </div>
                </div>
                {offer.description && (
                  <p className="mt-3 text-sm text-[var(--color-text-tertiary)] line-clamp-2 border-t border-[var(--color-border-light)] pt-3">
                    {offer.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
