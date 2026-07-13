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
      categories: { include: { category: true } },
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
      categories: { include: { category: true } },
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
    prisma.profile.aggregate({ _avg: { ratingAvg: true } }),
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

export default async function TasarimAPage() {
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
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0b1427] via-[#162044] to-[#091120] text-white">
        {/* Background layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Ambient glows */}
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-montaj/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          {/* Subtle grid lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02]"
            viewBox="0 0 1200 800"
            fill="none"
          >
            <line x1="0" y1="200" x2="1200" y2="200" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="400" x2="1200" y2="400" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="600" x2="1200" y2="600" stroke="white" strokeWidth="0.5" />
            <line x1="300" y1="0" x2="300" y2="800" stroke="white" strokeWidth="0.5" />
            <line x1="600" y1="0" x2="600" y2="800" stroke="white" strokeWidth="0.5" />
            <line x1="900" y1="0" x2="900" y2="800" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* ---- Left Column ---- */}
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm text-white/60 mb-8">
                <span className="w-2 h-2 bg-montaj rounded-full animate-pulse" />
                Türkiye&apos;nin Montaj Platformu
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
                Montajcınızı{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-montaj to-[#ffb366]">
                  Bulun
                </span>
                ,<br />
                İşinizi Büyütün
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg sm:text-xl text-white/50 leading-relaxed max-w-lg">
                Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmaları,
                üreticiler ve müşterileri bir araya getiren platform.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/ara"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-lg shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5"
                >
                  Firmaları Keşfet
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/auth/kayit"
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all hover:-translate-y-0.5"
                >
                  Hemen Katıl
                </Link>
              </div>

              {/* Trust bar */}
              <div className="mt-10 pt-8 border-t border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                  <div>
                    <div className="text-montaj font-bold text-2xl tracking-tight">
                      {stats.profileCount}+
                    </div>
                    <div className="text-white/40 text-sm mt-0.5">Firma</div>
                  </div>
                  <div>
                    <div className="text-montaj font-bold text-2xl tracking-tight">
                      {stats.cityCount}
                    </div>
                    <div className="text-white/40 text-sm mt-0.5">Şehir</div>
                  </div>
                  {stats.avgRating > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-montaj font-bold text-2xl tracking-tight">
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {stats.avgRating}
                      </div>
                      <div className="text-white/40 text-sm mt-0.5">
                        Ort. Puan
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-montaj font-bold text-2xl tracking-tight">
                      {stats.categoryCount}
                    </div>
                    <div className="text-white/40 text-sm mt-0.5">Kategori</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Right Column (decorative) ---- */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-[460px] h-[460px]">
                {/* Main glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-montaj/20 via-montaj/[0.05] to-transparent rounded-full blur-[80px]" />

                {/* Outer ring */}
                <div className="absolute inset-4 border border-white/[0.06] rounded-full" />
                <div className="absolute inset-16 border border-white/[0.03] rounded-full" />

                {/* Floating icon — top */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.08] flex items-center justify-center rotate-12">
                  <svg
                    className="w-11 h-11 text-montaj"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                </div>

                {/* Floating icon — bottom-right */}
                <div className="absolute bottom-14 right-4 w-20 h-20 bg-white/[0.04] backdrop-blur-2xl rounded-full border border-white/[0.08] flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-montaj"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>

                {/* Floating icon — bottom-left */}
                <div className="absolute bottom-36 left-4 w-16 h-16 bg-white/[0.04] backdrop-blur-2xl rounded-xl border border-white/[0.08] flex items-center justify-center -rotate-6">
                  <svg
                    className="w-7 h-7 text-montaj"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>

                {/* Small particles */}
                <div className="absolute top-1/3 right-10 w-2.5 h-2.5 bg-montaj/30 rounded-full blur-[2px]" />
                <div className="absolute top-2/3 left-14 w-2 h-2 bg-montaj/20 rounded-full" />
                <div className="absolute top-[15%] left-20 w-3 h-3 bg-montaj/15 rounded-full blur-[3px]" />
                <div className="absolute bottom-1/3 right-20 w-1.5 h-1.5 bg-white/20 rounded-full" />

                {/* Center element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 bg-montaj/10 rounded-full blur-[40px]" />
                  <div className="absolute w-20 h-20 bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.08] flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-montaj"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating card — bottom corner */}
              <div className="absolute -bottom-3 -left-8 w-44 bg-white/[0.04] backdrop-blur-2xl rounded-xl border border-white/[0.08] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-montaj/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-montaj"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Güvenilir</p>
                    <p className="text-white/40 text-xs">Montaj Firması</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="relative z-10 -mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard value={stats.profileCount} label="Firma" statKey="firma" />
            <StatCard value={stats.cityCount} label="Şehir" statKey="sehir" />
            <StatCard
              value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
              label="Ort. Puan"
              statKey="puan"
            />
            <StatCard
              value={stats.categoryCount}
              label="Kategori"
              statKey="kategori"
            />
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="py-20 md:py-28 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
              SÜREÇ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nasıl Çalışır?
            </h2>
            <p className="mt-3 text-muted-text max-w-lg mx-auto">
              Üç adımda ihtiyacın olan montaj firmasını bul, karşılaştır ve iletişime geç.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <StepCard
              number={1}
              title="Ara ve Bul"
              desc="Şehrine ve ihtiyacına uygun montaj firmalarını filtrelerle kolayca bul."
              icon={
                <svg className="w-7 h-7 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <StepCard
              number={2}
              title="İncele ve Karşılaştır"
              desc="Firma profillerini incele, deneyimlerini gör ve en uygununu seç."
              icon={
                <svg className="w-7 h-7 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />
            <StepCard
              number={3}
              title="İletişime Geç"
              desc="Platform üzerinden mesaj gönder, teklif al ve anlaşmaya var."
              icon={
                <svg className="w-7 h-7 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER ===== */}
      {categories.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                KATEGORİLER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Hizmet Kategorileri
              </h2>
              <p className="mt-3 text-muted-text max-w-lg mx-auto">
                İhtiyacın olan montaj hizmetini kategorilere göre keşfet.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="group flex items-center gap-3 p-4 border border-dark-border rounded-xl hover:border-montaj/40 hover:bg-dark-card transition-all"
                >
                  <div className="w-10 h-10 bg-montaj/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-montaj/20 transition-colors">
                    <svg className="w-5 h-5 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <span className="font-medium text-white group-hover:text-montaj transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM ===== */}
      <section className="py-20 md:py-28 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f35] via-dark-card to-[#111827] border border-montaj/10 p-8 md:p-12">
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-56 h-56 bg-montaj/15 rounded-full blur-[80px]" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-montaj/[0.06] rounded-full blur-[100px]" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                  PREMIUM
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Firmanızı Öne Çıkarın
                </h2>
                <p className="text-muted-text max-w-2xl mx-auto">
                  Premium üyeliğe geçerek firmanızı binlerce müşterinin önüne
                  çıkarın, rakiplerinizin bir adım önüne geçin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {premiumFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-black/30 rounded-xl p-5 border border-white/[0.06] hover:border-montaj/30 transition-all hover:-translate-y-0.5"
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
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-montaj to-montaj-dark text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5"
                >
                  Premium&apos;a Geç
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
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
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                  ÖNE ÇIKANLAR
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Öne Çıkan Firmalar
                </h2>
              </div>
              <Link
                href="/ara"
                className="hidden sm:inline-flex items-center gap-1 text-montaj hover:text-montaj-light font-medium transition-colors"
              >
                Tümünü Gör
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/ara"
                className="inline-flex items-center gap-1 text-montaj hover:text-montaj-light font-medium"
              >
                Tümünü Gör
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SON EKLENEN FİRMALAR ===== */}
      {latestProfiles.length > 0 && (
        <section className="py-20 md:py-28 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                SON EKLENENLER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Son Eklenen Firmalar
              </h2>
              <p className="mt-3 text-muted-text max-w-lg mx-auto">
                Platformumuza yeni katılan firmaları keşfet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1427] to-[#162044] p-10 md:p-16 text-center">
            {/* Decorative */}
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-montaj/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-montaj/[0.05] rounded-full blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Sen de Firmanı Ekle
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
                Ücretsiz kayıt ol, firmanı ekle, müşterilerle buluş. Binlerce
                kullanıcı seni bekliyor.
              </p>
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-lg shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5"
              >
                Hemen Başla
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
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

/* ===== SUB-COMPONENTS ===== */

function StatCard({
  value,
  label,
  statKey,
}: {
  value: string | number;
  label: string;
  statKey: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    firma: (
      <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    sehir: (
      <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    puan: (
      <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    kategori: (
      <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  };

  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-white/[0.06] rounded-xl p-5 md:p-6 text-center hover:border-montaj/20 transition-all hover:-translate-y-0.5">
      <div className="flex justify-center mb-3">{icons[statKey]}</div>
      <div className="text-3xl md:text-4xl font-bold text-white">
        {value}
      </div>
      <div className="text-sm md:text-base text-sub-text mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  desc,
  icon,
}: {
  number: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative text-center group">
      {/* Number badge */}
      <div className="relative mx-auto mb-6">
        <div className="w-16 h-16 bg-montaj/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-montaj/20 transition-colors">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-montaj text-white text-xs font-bold rounded-full flex items-center justify-center">
          {number}
        </div>
      </div>

      {/* Connecting line (desktop) */}
      {number < 3 && (
        <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%+1.5rem)] h-px bg-white/[0.06]">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-white/20 rotate-45" />
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-muted-text leading-relaxed">{desc}</p>
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
