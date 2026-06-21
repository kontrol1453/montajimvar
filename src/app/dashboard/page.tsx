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
  const role = (session.user as any).role;

  const [messageCount, unreadCount, profile] = await Promise.all([
    prisma.message.count({ where: { receiverId: userId } }),
    prisma.message.count({ where: { receiverId: userId, isRead: false } }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

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
                {role === "CUSTOMER" ? "Müşteri" : role === "ASSEMBLER" ? "Montajcı" : "Üretici"}
              </p>
            </div>
          </div>
        </Card>
      </div>

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

            {(role === "ASSEMBLER" || role === "MANUFACTURER") && (
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
            {role === "CUSTOMER" ? "Firma Ara" : "Gelen Mesajlar"}
          </h2>
          {role === "CUSTOMER" ? (
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
