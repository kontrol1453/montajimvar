import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PremiumBadge from "@/components/PremiumBadge";
import SubscribeButton from "./SubscribeButton";
import EmailVerifyBadge from "./EmailVerifyBadge";
import CancelSubscription from "./CancelSubscription";
import PaymentHistory from "./PaymentHistory";
import PremiumAnalytics from "./PremiumAnalytics";

export default async function UyelikPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;

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

  // Premium analitik verileri (sadece profil sahipleri için)
  const premiumAnalytics = profile ? {
    viewCount: profile.viewCount,
    ratingAvg: profile.ratingAvg,
    reviewCount: profile.reviewCount,
    favoriteCount: await prisma.favorite.count({ where: { profileId: profile.id } }),
    sentMessages: await prisma.message.count({ where: { senderId: userId } }),
  } : null;

  const isPremium = profile?.premiumUntil != null && new Date(profile.premiumUntil) > new Date();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner (sadece premium olmayanlar) */}
      {!isPremium && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-montaj/20 via-dark-card to-purple-900/20 border border-montaj/10 p-8 mb-8">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Üyelik & Abonelik</h1>
            <p className="text-muted-text">
              Premium üyeliğe geçerek firmanızı öne çıkarın, daha fazla müşteriye ulaşın.
            </p>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-montaj/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* E-posta doğrulama durumu (sadece doğrulanmamış e-postalar) */}
      {user && !user.emailVerified && (
        <div className="mb-6">
          <EmailVerifyBadge
            emailVerified={false}
            email={user.email}
          />
        </div>
      )}

      {/* Premium Analitik (sadece premium üyeler) */}
      {premiumAnalytics && isPremium && (
        <div className="mb-6">
          <PremiumAnalytics {...premiumAnalytics} />
        </div>
      )}

      {/* Current subscription */}
      {(profile?.subscription || profile?.premiumUntil) ? (
        <div className="bg-dark-card rounded-xl border border-montaj/20 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Mevcut Üyeliğiniz</h2>
              <div className="flex items-center gap-2">
                <PremiumBadge
                  label={profile.subscription?.badgeLabel || "Premium"}
                  color={profile.subscription?.badgeColor || "amber"}
                />
                {profile?.premiumUntil && new Date(profile.premiumUntil) > new Date() ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Süresi Doldu
                  </span>
                )}
              </div>
            </div>
            {profile?.subscription && (
              <span className="text-2xl font-bold text-montaj">
                {profile.subscription.name}
              </span>
            )}
          </div>
          {profile?.premiumUntil && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-sub-text">Kalan Süre</span>
                  <span className="text-white font-medium">
                    {(() => {
                      const now = new Date();
                      const end = new Date(profile.premiumUntil!);
                      const remainingMs = end.getTime() - now.getTime();
                      const days = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
                      return <>{days} gün</>;
                    })()}
                  </span>
                </div>
                {(() => {
                  const now = new Date();
                  const end = new Date(profile.premiumUntil!);
                  const totalMs = end.getTime() - new Date(profile.createdAt || now).getTime();
                  const remainingMs = end.getTime() - now.getTime();
                  const pct = totalMs > 0 ? Math.max(0, Math.round((remainingMs / totalMs) * 100)) : 0;
                  return (
                    <div className="w-full h-2 bg-dark-section rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-montaj to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  );
                })()}
              </div>
            </>
          )}
          {/* İptal/Yeniden Aktifleştir butonu */}
          {profile?.subscription && (
            <CancelSubscription
              premiumUntil={profile.premiumUntil?.toISOString() ?? null}
              autoRenew={profile.autoRenew ?? true}
              canceledAt={profile.canceledAt?.toISOString() ?? null}
            />
          )}
        </div>
      ) : (
        <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-montaj/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Henüz Üyeliğiniz Yok</h2>
              <p className="text-sm text-sub-text mt-1">
                Premium üyeliğe geçerek firmanızı öne çıkarın, daha fazla müşteriye ulaşın.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans (sadece premium olmayanlar) */}
      {!isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const features: string[] = JSON.parse(plan.features || "[]");
            const isCurrentPlan = profile?.subscriptionId === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-montaj/5 ${
                  plan.price > 0
                    ? "bg-dark-card border-dark-border hover:border-montaj/40"
                    : "bg-dark-card border-dark-border"
                } ${isCurrentPlan ? "ring-2 ring-montaj border-montaj/50" : ""}`}
              >
                {/* "En Popüler" rozeti */}
                {plan.price > 0 && plan.price === Math.max(...plans.filter(p => p.price > 0).map(p => p.price)) && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-montaj to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                      En Popüler
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  {plan.badgeLabel && (
                    <PremiumBadge label={plan.badgeLabel} color={plan.badgeColor || "amber"} className="mb-2" />
                  )}
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-muted-text mt-1">{plan.description}</p>
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price > 0 ? `${(plan.price / 100).toFixed(0)} TL` : "Ücretsiz"}
                  </span>
                  <span className="text-sub-text text-sm"> / {plan.durationDays} gün</span>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-text">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <SubscribeButton
                    planId={plan.id}
                    price={plan.price}
                    isCurrentPlan={isCurrentPlan}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ödeme Geçmişi */}
      <div className="mt-8">
        <PaymentHistory />
      </div>
    </div>
  );
}
