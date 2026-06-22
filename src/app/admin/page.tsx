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

  function StatIcon({ icon, label }: { icon: string; label: string }) {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {icon === "users" && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        )}
        {icon === "company" && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        )}
        {icon === "pending" && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
        {icon === "message" && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        )}
        {icon === "star" && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        )}
        {icon === "lock" && (
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        )}
      </svg>
    );
  }

  const stats = [
    {
      label: "Toplam Kullanıcı",
      value: userCount,
      icon: "users",
      href: "/admin/kullanicilar",
      color: "bg-blue-900/30",
    },
    {
      label: "Firma Profili",
      value: profileCount,
      icon: "company",
      href: "/admin/firmalar",
      color: "bg-montaj/20",
    },
    {
      label: "Onay Bekleyen",
      value: unverifiedCount,
      icon: "pending",
      href: "/admin/firmalar",
      color: "bg-yellow-900/30",
    },
    {
      label: "Toplam Mesaj",
      value: messageCount,
      icon: "message",
      href: "/admin/firmalar",
      color: "bg-green-900/30",
    },
    {
      label: "Yorumlar",
      value: reviewCount,
      icon: "star",
      href: "/admin/firmalar",
      color: "bg-purple-900/30",
    },
    {
      label: "Rol İzinleri",
      value: permCount,
      icon: "lock",
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
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}
                  >
                    <StatIcon icon={stat.icon} label={stat.label} />
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
            <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
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
            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
            <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
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
            <div className="w-10 h-10 bg-pink-900/30 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-white">Rol İzinleri</p>
              <p className="text-sm text-sub-text">
                Rollerin görebileceği özellikleri belirleyin
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/abonelik-plani"
          className="bg-dark-card rounded-xl border border-dark-border p-5 hover:border-montaj/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-900/30 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-white">Abonelik Planları</p>
              <p className="text-sm text-sub-text">Premium planları yönetin</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
