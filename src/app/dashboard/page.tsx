import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Card from "@/components/ui/Card";
import PremiumBadge from "@/components/PremiumBadge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;
  const roles: string[] = (session.user as any).roles || [];

  const [messageCount, unreadCount, profile, userRecord] = await Promise.all([
    prisma.message.count({ where: { receiverId: userId } }),
    prisma.message.count({ where: { receiverId: userId, isRead: false } }),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { premiumUntil: true },
    }),
  ]);

  const premiumUntil = profile?.premiumUntil || userRecord?.premiumUntil || null;
  const isPremium = premiumUntil != null && new Date(premiumUntil) > new Date();
  const canHaveProfile = roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER");

  // Analytics for ASSEMBLER/MANUFACTURER
  let analytics = null;
  if (profile && (roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER"))) {
    const [sentMessages, reviewCount, favoriteCount] = await Promise.all([
      prisma.message.count({ where: { senderId: userId } }),
      prisma.review.count({ where: { profileId: profile.id } }),
      prisma.favorite.count({ where: { profileId: profile.id } }),
    ]);
    analytics = {
      viewCount: profile.viewCount,
      ratingAvg: profile.ratingAvg,
      sentMessages,
      reviewCount,
      favoriteCount,
    };
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Panelim</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-montaj/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div>
              <p className="text-sm text-sub-text">Gelen Mesajlar</p>
              <p className="text-2xl font-bold text-white">{messageCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div>
              <p className="text-sm text-sub-text">Okunmamış Mesaj</p>
              <p className="text-2xl font-bold text-white">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPremium ? "bg-amber-900/30" : "bg-green-900/30"}`}>
              {isPremium ? (
                <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 7l8 5 8-5-8-5zM2 12l8 5 8-5-8-5-8 5z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              )}
            </div>
            <div>
              <p className="text-sm text-sub-text">{isPremium ? "Üyelik" : "Profilim"}</p>
              {isPremium ? (
                <PremiumBadge label="Premium" color="amber" />
              ) : (
                <p className="text-sm font-medium text-white">
                  {roles.includes("CUSTOMER") ? "Müşteri" : roles.includes("ASSEMBLER") ? "Montajcı" : roles.includes("MANUFACTURER") ? "Üretici" : "-"}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Firma Analitikleri */}
      {analytics && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Firma Analitikleri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-montaj">{analytics.viewCount}</p>
                <p className="text-xs text-sub-text mt-1">Profil Görüntülenme</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {analytics.ratingAvg > 0 ? analytics.ratingAvg.toFixed(1) : "—"}
                </p>
                <p className="text-xs text-sub-text mt-1">Ortalama Puan</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{analytics.reviewCount}</p>
                <p className="text-xs text-sub-text mt-1">Yorum</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{analytics.sentMessages}</p>
                <p className="text-xs text-sub-text mt-1">Gönderilen Mesaj</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-400">{analytics.favoriteCount}</p>
                <p className="text-xs text-sub-text mt-1">Favoriye Eklenme</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Firma profili önerisi (premium aktif ama profil yok) */}
      {isPremium && !profile && canHaveProfile && (
        <div className="bg-gradient-to-r from-montaj/20 via-dark-card to-amber-900/20 border border-montaj/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-montaj/20 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Premium Üyeliğiniz Aktif!</h3>
              <p className="text-sm text-muted-text mb-4">
                Premium üyeliğiniz aktif durumda ancak henüz bir firma profiliniz bulunmuyor.
                Premium avantajlarından (aramada üst sıra, premium rozeti, vitrin desteği) yararlanmak için
                firma profili oluşturun.
              </p>
              <Link
                href="/dashboard/firma"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Firma Profili Oluştur
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/mesajlar"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-section transition"
            >
              <svg className="w-6 h-6 text-montaj flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <div>
                <p className="font-medium text-white">Mesajlarım</p>
                <p className="text-sm text-sub-text">Gelen kutusu ve gönderilenler</p>
              </div>
            </Link>

            <Link
              href="/dashboard/profil"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-section transition"
            >
              <svg className="w-6 h-6 text-montaj flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <div>
                <p className="font-medium text-white">Profil Bilgilerim</p>
                <p className="text-sm text-sub-text">Kişisel bilgilerimi düzenle</p>
              </div>
            </Link>

            {(roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER")) && (
              <Link
                href="/dashboard/firma"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-section transition"
              >
                <svg className="w-6 h-6 text-montaj flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <div>
                  <p className="font-medium text-white">
                    {profile ? "Firma Profilim" : "Firma Profili Oluştur"}
                  </p>
                  <p className="text-sm text-sub-text">
                    {profile ? "Firma bilgilerini düzenle" : "Henüz firma profiliniz yok"}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">
            {roles.includes("CUSTOMER") ? "Firma Ara" : "Gelen Mesajlar"}
          </h2>
          {roles.includes("CUSTOMER") ? (
            <div>
              <p className="text-sm text-muted-text mb-4">
                İhtiyacınıza uygun montaj firmalarını bulmak için arama yapın.
              </p>
              <Link
                href="/ara"
                className="inline-flex items-center px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
              >
                Firmaları Keşfet
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-text mb-4">
                {unreadCount > 0
                  ? `${unreadCount} okunmamış mesajınız var.`
                  : "Tüm mesajlar okundu."}
              </p>
              <Link
                href="/dashboard/mesajlar"
                className="inline-flex items-center px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
              >
                Mesajlara Git
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
