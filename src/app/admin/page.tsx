import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [userCount, profileCount, messageCount, unverifiedCount, reviewCount, permCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.message.count(),
      prisma.profile.count({ where: { isVerified: false } }),
      prisma.review.count(),
      prisma.rolePermission.count(),
    ]);

  const stats = [
    {
      label: "Toplam Kullanıcı",
      value: userCount,
      icon: "👥",
      href: "/admin/kullanicilar",
      color: "bg-blue-900/30",
    },
    {
      label: "Firma Profili",
      value: profileCount,
      icon: "🏢",
      href: "/admin/firmalar",
      color: "bg-montaj/20",
    },
    {
      label: "Onay Bekleyen",
      value: unverifiedCount,
      icon: "⏳",
      href: "/admin/firmalar",
      color: "bg-yellow-900/30",
    },
    {
      label: "Toplam Mesaj",
      value: messageCount,
      icon: "💬",
      href: "/admin/firmalar",
      color: "bg-green-900/30",
    },
    {
      label: "Yorumlar",
      value: reviewCount,
      icon: "⭐",
      href: "/admin/firmalar",
      color: "bg-purple-900/30",
    },
    {
      label: "Rol İzinleri",
      value: permCount,
      icon: "🔐",
      href: "/admin/izinler",
      color: "bg-pink-900/30",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Paneli</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card>
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-xl`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-sub-text">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/kullanicilar"
          className="bg-dark-card rounded-xl border border-dark-border p-5 hover:border-montaj/50 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-medium text-white">Kullanıcıları Yönet</p>
              <p className="text-sm text-sub-text">Tüm kullanıcıları görüntüle ve yönet</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/firmalar"
          className="bg-dark-card rounded-xl border border-dark-border p-5 hover:border-montaj/50 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-white">Firmaları Onayla</p>
              <p className="text-sm text-sub-text">
                {unverifiedCount > 0
                  ? `${unverifiedCount} firma onay bekliyor`
                  : "Tüm firmalar onaylanmış"}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/kategoriler"
          className="bg-dark-card rounded-xl border border-dark-border p-5 hover:border-montaj/50 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📂</span>
            <div>
              <p className="font-medium text-white">Kategorileri Yönet</p>
              <p className="text-sm text-sub-text">Kategori ekle, düzenle, sil</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/izinler"
          className="bg-dark-card rounded-xl border border-dark-border p-5 hover:border-montaj/50 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <p className="font-medium text-white">Rol İzinleri</p>
              <p className="text-sm text-sub-text">
                Rollerin görebileceği özellikleri belirleyin
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
