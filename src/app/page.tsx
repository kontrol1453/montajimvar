import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CompanyCard from "@/components/CompanyCard";

export const dynamic = "force-dynamic";

async function getFeaturedProfiles() {
  const profiles = await prisma.profile.findMany({
    take: 6,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
  return profiles;
}

async function getLatestProfiles() {
  const profiles = await prisma.profile.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
  return profiles;
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

async function getStats() {
  const [profileCount, cities, ratingAgg, categoryCount] = await Promise.all([
    prisma.profile.count(),
    prisma.profile.findMany({
      select: { city: true },
      distinct: ["city"],
      where: { city: { not: "" } },
    }),
    prisma.profile.aggregate({
      _avg: { ratingAvg: true },
    }),
    prisma.category.count(),
  ]);
  return {
    profileCount,
    cityCount: cities.length,
    avgRating: ratingAgg._avg.ratingAvg
      ? Number(ratingAgg._avg.ratingAvg.toFixed(1))
      : 0,
    categoryCount,
  };
}

export default async function HomePage() {
  const [featuredProfiles, latestProfiles, categories, stats] =
    await Promise.all([
      getFeaturedProfiles(),
      getLatestProfiles(),
      getCategories(),
      getStats(),
    ]);

  const premiumFeatures = [
    {
      title: "Vitrin Desteği",
      desc: "Firmanız öne çıkan firmalar bölümünde listelenir, daha fazla görüntülenme alır.",
      icon: "star",
    },
    {
      title: "Arama'da Üst Sıra",
      desc: "Premium firmalar arama sonuçlarında her zaman üst sıralarda gösterilir.",
      icon: "trending",
    },
    {
      title: "Premium Rozeti",
      desc: "Profilinizde premium rozeti görünür, müşteriler nezdinde güven oluşturur.",
      icon: "badge",
    },
    {
      title: "Detaylı Analiz",
      desc: "Profil görüntülenme, mesaj ve yorum istatistiklerinizi görüntüleyin.",
      icon: "chart",
    },
  ];

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-montaj via-montaj-dark to-[#cc5500] text-white">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Montajcınızı Bulun, İşinizi Büyütün
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80">
              Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmaları,
              üreticiler ve müşterileri bir araya getiren platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/ara"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-montaj-dark font-semibold rounded-lg hover:bg-gray-100 transition text-center"
              >
                Firmaları Keşfet
              </Link>
              <Link
                href="/auth/kayit"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition text-center"
              >
                Hemen Katıl
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="bg-black/40 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard
              value={stats.profileCount}
              label="Firma"
              icon={
                <svg className="w-8 h-8 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              }
            />
            <StatCard
              value={stats.cityCount}
              label="Şehir"
              icon={
                <svg className="w-8 h-8 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              }
            />
            <StatCard
              value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
              label="Ort. Puan"
              icon={
                <svg className="w-8 h-8 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
            />
            <StatCard
              value={stats.categoryCount}
              label="Kategori"
              icon={
                <svg className="w-8 h-8 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="py-16 md:py-20 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Nasıl Çalışır?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-montaj/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ara ve Bul</h3>
              <p className="text-muted-text">
                Şehrine ve ihtiyacına uygun montaj firmalarını filtrelerle kolayca bul.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-montaj/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">İncele ve Karşılaştır</h3>
              <p className="text-muted-text">
                Firma profillerini incele, deneyimlerini gör ve en uygununu seç.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-montaj/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">İletişime Geç</h3>
              <p className="text-muted-text">
                Platform üzerinden mesaj gönder, teklif al ve anlaşmaya var.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER ===== */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Kategoriler
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="flex items-center gap-3 p-4 border border-dark-border rounded-xl hover:border-montaj hover:bg-dark-card transition"
                >
                  <span className="font-medium text-white">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM TANITIM ===== */}
      <section className="py-16 md:py-20 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-montaj/20 via-dark-card to-purple-900/20 border border-montaj/10 p-8 md:p-12">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-montaj/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Firmanızı Öne Çıkarın
                </h2>
                <p className="text-muted-text max-w-2xl mx-auto">
                  Premium üyeliğe geçerek firmanızı binlerce müşterinin önüne
                  çıkarın, rakiplerinizin bir adım önüne geçin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {premiumFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-black/30 rounded-xl p-5 border border-white/5 hover:border-montaj/30 transition"
                  >
                    <div className="w-10 h-10 bg-montaj/20 rounded-lg flex items-center justify-center mb-3">
                      <FeatureIcon icon={feature.icon} />
                    </div>
                    <h3 className="font-semibold text-white mb-1.5 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-text leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/dashboard/uyelik"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-montaj to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Premium&apos;a Geç
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÖNE ÇIKAN FİRMALAR ===== */}
      {featuredProfiles.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Öne Çıkan Firmalar</h2>
              <Link
                href="/ara"
                className="text-montaj hover:text-montaj-light font-medium hidden sm:inline"
              >
                Tümünü Gör →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/ara"
                className="inline-block text-montaj hover:text-montaj-light font-medium"
              >
                Tümünü Gör →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SON EKLENEN FİRMALAR ===== */}
      {latestProfiles.length > 0 && (
        <section className="py-16 md:py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Son Eklenen Firmalar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FİRMA SAHİBİ CTA ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-montaj to-montaj-dark p-8 md:p-12 text-center">
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                Sen de Firmanı Ekle
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-6">
                Ücretsiz kayıt ol, firmanı ekle, müşterilerle buluş. Binlerce
                kullanıcı seni bekliyor.
              </p>
              <Link
                href="/auth/kayit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-montaj-dark font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Hemen Başla
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-4xl md:text-5xl font-bold text-white">{value}</div>
      <div className="text-base md:text-lg text-sub-text mt-1.5 font-medium">{label}</div>
    </div>
  );
}

function FeatureIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "star":
      return (
        <svg className="w-5 h-5 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case "trending":
      return (
        <svg className="w-5 h-5 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    case "badge":
      return (
        <svg className="w-5 h-5 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case "chart":
      return (
        <svg className="w-5 h-5 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    default:
      return null;
  }
}
