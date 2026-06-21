import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Card from "@/components/ui/Card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;
  const roles: string[] = (session.user as any).roles || [];

  const [messageCount, unreadCount, profile] = await Promise.all([
    prisma.message.count({ where: { receiverId: userId } }),
    prisma.message.count({ where: { receiverId: userId, isRead: false } }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

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
            <div className="w-12 h-12 bg-montaj/20 rounded-lg flex items-center justify-center text-xl">
              💬
            </div>
            <div>
              <p className="text-sm text-sub-text">Gelen Mesajlar</p>
              <p className="text-2xl font-bold text-white">{messageCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center text-xl">
              🔔
            </div>
            <div>
              <p className="text-sm text-sub-text">Okunmamış Mesaj</p>
              <p className="text-2xl font-bold text-white">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center text-xl">
              📋
            </div>
            <div>
              <p className="text-sm text-sub-text">Profilim</p>
              <p className="text-sm font-medium text-white">
                {roles.includes("CUSTOMER") ? "Müşteri" : roles.includes("ASSEMBLER") ? "Montajcı" : roles.includes("MANUFACTURER") ? "Üretici" : "-"}
              </p>
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

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/mesajlar"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-section transition"
            >
              <span className="text-xl">💬</span>
              <div>
                <p className="font-medium text-white">Mesajlarım</p>
                <p className="text-sm text-sub-text">Gelen kutusu ve gönderilenler</p>
              </div>
            </Link>

            <Link
              href="/dashboard/profil"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-section transition"
            >
              <span className="text-xl">👤</span>
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
                <span className="text-xl">🏢</span>
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
