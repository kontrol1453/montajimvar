import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import PremiumBadge from "@/components/PremiumBadge";
import SubscribeButton from "./SubscribeButton";
import EmailVerifyBadge from "./EmailVerifyBadge";

export default async function UyelikPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;
  const roles: string[] = (session.user as any).roles || [];

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { subscription: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  });

  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Üyelik & Abonelik</h1>

      {/* E-posta doğrulama durumu */}
      {user && (
        <div className="mb-6">
          <EmailVerifyBadge
            emailVerified={user.emailVerified ?? false}
            email={user.email}
          />
        </div>
      )}

      {/* Current subscription */}
      {profile?.subscription || profile?.premiumUntil ? (
        <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Mevcut Üyeliğiniz</h2>
          <div className="flex items-center gap-3 mb-2">
            <PremiumBadge
              label={profile.subscription?.badgeLabel || "Premium"}
              color={profile.subscription?.badgeColor || "amber"}
            />
            {profile?.premiumUntil && new Date(profile.premiumUntil) > new Date() ? (
              <span className="text-sm text-green-400">Aktif</span>
            ) : (
              <span className="text-sm text-red-400">Süresi Doldu</span>
            )}
          </div>
          {profile?.premiumUntil && (
            <p className="text-sm text-sub-text">
              Bitiş: {formatDate(profile.premiumUntil)}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">Henüz Üyeliğiniz Yok</h2>
          <p className="text-sm text-sub-text mb-4">
            Premium üyeliğe geçerek firmanızı öne çıkarın, daha fazla müşteriye ulaşın.
          </p>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features: string[] = JSON.parse(plan.features || "[]");
          const isCurrentPlan = profile?.subscriptionId === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.price > 0
                  ? "bg-dark-card border-montaj/30"
                  : "bg-dark-card border-dark-border"
              } ${isCurrentPlan ? "ring-2 ring-montaj" : ""}`}
            >
              <div className="mb-4">
                {plan.badgeLabel && (
                  <PremiumBadge label={plan.badgeLabel} color={plan.badgeColor || "amber"} className="mb-2" />
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-muted-text mt-1">{plan.description}</p>
                )}
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-white">
                  {plan.price > 0 ? `${(plan.price / 100).toFixed(0)} TL` : "Ücretsiz"}
                </span>
                <span className="text-sub-text text-sm"> / {plan.durationDays} gün</span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-text">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <SubscribeButton
                planId={plan.id}
                price={plan.price}
                isCurrentPlan={isCurrentPlan}
                disabled={!roles.some((r) => ["ASSEMBLER", "MANUFACTURER"].includes(r))}
              />
            </div>
          );
        })}
      </div>

      {!roles.some((r) => ["ASSEMBLER", "MANUFACTURER"].includes(r)) && (
        <p className="text-sm text-sub-text mt-4 text-center">
          Premium üyelik sadece firma sahipleri içindir. Önce firma profili oluşturun.
        </p>
      )}
    </div>
  );
}
