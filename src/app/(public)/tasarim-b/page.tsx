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

export default async function TasarimBPage() {
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
      {/* ===== HERO — KOYU PREMIUM ===== */}
      <section className="relative min-h-screen flex items-center bg-[#07070a] text-white">
        {/* Massive ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Central warm glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-montaj/20 via-montaj/[0.05] to-transparent rounded-full blur-[150px]" />

          {/* Secondary cool glow */}
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-montaj/[0.03] rounded-full blur-[140px]" />

          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Diagonal accent line */}
          <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-montaj/10 to-transparent" />
          <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-sm text-white/50 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-montaj rounded-full shadow-[0_0_6px_rgba(255,122,0,0.6)]" />
              Premium Platform
            </div>

            {/* Main heading — dramatic large */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Montajcınızı{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-montaj via-[#ff9433] to-montaj-light">
                Bulun
              </span>
            </h1>
            <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white/80">
              İşinizi Büyütün
            </h2>

            {/* Description */}
            <p className="mt-6 text-lg sm:text-xl text-white/40 max-w-xl mx-auto leading-relaxed">
              Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmaları,
              üreticiler ve müşterileri bir araya getiren platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ara"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-montaj to-montaj-dark text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-xl shadow-montaj/20 hover:shadow-montaj/35 hover:-translate-y-0.5"
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
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/[0.06] transition-all backdrop-blur-sm"
              >
                Hemen Katıl
              </Link>
            </div>

            {/* Key metrics row */}
            <div className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-4">
              <MetricBlock value={`${stats.profileCount}+`} label="Firma" />
              <MetricBlock value={String(stats.cityCount)} label="Şehir" />
              {stats.avgRating > 0 && (
                <MetricBlock
                  value={stats.avgRating.toFixed(1)}
                  label="Ort. Puan"
                  star
                />
              )}
              <MetricBlock
                value={String(stats.categoryCount)}
                label="Kategori"
              />
            </div>
          </div>

          {/* ---- Glass mockup card below hero ---- */}
          <div className="relative mt-20 max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-montaj/10 via-montaj/5 to-transparent rounded-2xl blur-[40px]" />
            <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-6 md:p-8">
              {/* Mockup header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 max-w-md mx-auto">
                  <div className="bg-white/[0.04] rounded-lg px-4 py-2 text-sm text-white/30 text-center">
                    www.montajimvar.com — 250+ firma keşfedildi
                  </div>
                </div>
              </div>

              {/* Mockup grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MockupTile
                  icon={
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  }
                  title="Konum Bazlı Arama"
                  desc="Şehrine göre filtrele"
                />
                <MockupTile
                  icon={
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  }
                  title="Kategori Filtresi"
                  desc="Hizmet türüne göre keşfet"
                />
                <MockupTile
                  icon={
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  }
                  title="Puan & Yorumlar"
                  desc="Gerçek kullanıcı deneyimleri"
                />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-white/20">
            <span className="text-xs tracking-widest uppercase">Keşfet</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== STATS — premium dark cards ===== */}
      <section className="py-16 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard value={stats.profileCount} label="Firma" icon="firma" />
            <StatCard value={stats.cityCount} label="Şehir" icon="sehir" />
            <StatCard
              value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
              label="Ort. Puan"
              icon="puan"
            />
            <StatCard
              value={stats.categoryCount}
              label="Kategori"
              icon="kategori"
            />
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR — timeline style ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
              <span className="w-1 h-1 bg-montaj rounded-full" />
              SÜREÇ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nasıl Çalışır?
            </h2>
            <p className="mt-3 text-muted-text max-w-lg mx-auto">
              Üç adımda ihtiyacın olan montaj firmasını bul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <StepCard
              number="01"
              title="Ara ve Bul"
              desc="Şehrine ve ihtiyacına uygun montaj firmalarını filtrelerle kolayca bul."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <StepCard
              number="02"
              title="İncele ve Karşılaştır"
              desc="Firma profillerini incele, deneyimlerini gör ve en uygununu seç."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />
            <StepCard
              number="03"
              title="İletişime Geç"
              desc="Platform üzerinden mesaj gönder, teklif al ve anlaşmaya var."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER ===== */}
      {categories.length > 0 && (
        <section className="py-20 md:py-28 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                <span className="w-1 h-1 bg-montaj rounded-full" />
                KATEGORİLER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Tüm Hizmet Kategorileri
              </h2>
              <p className="mt-3 text-muted-text max-w-lg mx-auto">
                {stats.categoryCount} farklı kategoride hizmet veren firmalar.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="group relative overflow-hidden bg-dark-card/60 border border-white/[0.04] rounded-xl p-4 hover:border-montaj/30 transition-all hover:-translate-y-0.5"
                >
                  {/* Hover glow */}
                  <div className="absolute -inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-montaj/10 rounded-full blur-[40px]" />
                  </div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-9 h-9 bg-montaj/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                      </svg>
                    </div>
                    <span className="font-medium text-white/80 group-hover:text-white transition-colors text-sm">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM TANITIM ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f0f14] via-[#14141c] to-[#0a0a0f] border border-montaj/10 p-8 md:p-12">
            {/* Premium ambient glow */}
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-montaj/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-montaj/[0.04] rounded-full blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                  <span className="w-1 h-1 bg-montaj rounded-full" />
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
                    className="relative bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 hover:border-montaj/25 transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-montaj/[0.03] rounded-full blur-[30px] group-hover:bg-montaj/[0.06] transition-all" />
                    <div className="relative">
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
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/dashboard/uyelik"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-montaj to-montaj-dark text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-xl shadow-montaj/20 hover:shadow-montaj/35 hover:-translate-y-0.5"
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
        <section className="py-20 md:py-28 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                  <span className="w-1 h-1 bg-montaj rounded-full" />
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
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                <span className="w-1 h-1 bg-montaj rounded-full" />
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
      <section className="py-20 md:py-28 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#07070a] border border-white/[0.04] p-10 md:p-16 text-center">
            {/* Ambient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-montaj/10 rounded-full blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Sen de Firmanı Ekle
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto mb-8">
                Ücretsiz kayıt ol, firmanı ekle, müşterilerle buluş. Binlerce
                kullanıcı seni bekliyor.
              </p>
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-montaj to-montaj-dark text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-xl shadow-montaj/20 hover:shadow-montaj/35 hover:-translate-y-0.5"
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

function MetricBlock({
  value,
  label,
  star,
}: {
  value: string;
  label: string;
  star?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-montaj font-bold text-2xl tracking-tight">
        {star && (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        {value}
      </div>
      <div className="text-white/30 text-sm mt-0.5">{label}</div>
    </div>
  );
}

function MockupTile({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.04] hover:border-montaj/20 transition-all group">
      <div className="text-montaj/60 group-hover:text-montaj transition-colors mb-3">
        {icon}
      </div>
      <h4 className="text-white text-sm font-medium mb-1">{title}</h4>
      <p className="text-white/30 text-xs">{desc}</p>
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
  icon: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    firma: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    sehir: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    puan: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    kategori: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 md:p-6 text-center hover:border-montaj/20 transition-all hover:-translate-y-0.5">
      <div className="flex justify-center mb-3 text-montaj/60">{icons[icon]}</div>
      <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
      <div className="text-sm md:text-base text-white/30 mt-1 font-medium">
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
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative text-center group">
      {/* Number + icon */}
      <div className="relative mx-auto mb-6">
        <div className="w-20 h-20 mx-auto rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center group-hover:border-montaj/30 transition-colors">
          <div className="text-montaj/60 group-hover:text-montaj transition-colors">
            {icon}
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-montaj to-montaj-dark text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-montaj/30">
          {number}
        </div>
      </div>

      {/* Connecting line */}
      {number < "03" && (
        <div className="hidden md:block absolute top-10 left-[60%] w-[calc(100%+1rem)] h-px bg-gradient-to-r from-white/[0.06] to-transparent">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-montaj/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
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
