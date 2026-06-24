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

export default async function TasarimCPage() {
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
      desc: "Firmanız öne çıkan firmalar bölümünde listelenir.",
      icon: "star",
    },
    {
      title: "Arama'da Üst Sıra",
      desc: "Premium firmalar arama sonuçlarında üst sıralarda gösterilir.",
      icon: "trending",
    },
    {
      title: "Premium Rozeti",
      desc: "Profilinizde premium rozeti görünür, güven oluşturur.",
      icon: "badge",
    },
    {
      title: "Detaylı Analiz",
      desc: "Profil istatistiklerinizi görüntüleyin.",
      icon: "chart",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO — C layout + A colors ===== */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#0b1427] via-[#162044] to-[#091120] text-white overflow-hidden">
        {/* Background layers (A style) */}
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
          {/* Diagonal grid lines */}
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
          {/* Horizontal accent line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* ---- Content — spans 7 columns (C layout) ---- */}
            <div className="lg:col-span-7">
              {/* Badge (A style) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm text-white/60 mb-8">
                <span className="w-2 h-2 bg-montaj rounded-full animate-pulse" />
                Türkiye&apos;nin Montaj Platformu
              </div>

              {/* Heading — C's split style with A's gradient accent */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.05] tracking-tight">
                Montajcını
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-montaj to-[#ffb366]">
                  zı
                </span>
                <br />
                <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white/60 font-light">
                  Bulun, işinizi büyütün
                </span>
              </h1>

              {/* Description */}
              <p className="mt-8 text-lg text-white/50 max-w-md leading-relaxed">
                Türkiye&apos;nin dört bir yanındaki güvenilir montaj
                firmalarını keşfedin, karşılaştırın ve iletişime geçin.
              </p>

              {/* CTA + inline stat (A style buttons) */}
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/ara"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-lg shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5"
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
                <span className="text-white/30 text-sm">
                  {stats.profileCount}+ firma · {stats.cityCount} şehir
                  {stats.avgRating > 0 && ` · ⌀ ${stats.avgRating}`}
                </span>
              </div>
            </div>

            {/* ---- Right side — ghost number (C style) ---- */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative flex items-center justify-center">
                {/* Large ghost number */}
                <div className="text-[12rem] xl:text-[16rem] font-black text-white/[0.03] leading-none select-none tracking-tighter">
                  {stats.profileCount}
                </div>

                {/* Floating label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-white/70 text-2xl font-semibold">
                    Firma
                  </div>
                  <div className="text-white/20 text-sm mt-1 tracking-widest uppercase">
                    Platformda
                  </div>
                </div>

                {/* Small accent dots */}
                <div className="absolute bottom-[15%] right-[20%] w-2.5 h-2.5 bg-montaj/50 rounded-full blur-[1px]" />
                <div className="absolute top-[20%] right-[30%] w-1.5 h-1.5 bg-montaj/30 rounded-full" />
                <div className="absolute top-[40%] left-[15%] w-2 h-2 bg-blue-400/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS — A glassmorphism cards in C's compact layout ===== */}
      <section className="relative z-10 -mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <GlassStat value={stats.profileCount} label="Firma" icon="firma" />
            <GlassStat value={stats.cityCount} label="Şehir" icon="sehir" />
            <GlassStat
              value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
              label="Ort. Puan"
              icon="puan"
              star
            />
            <GlassStat
              value={stats.categoryCount}
              label="Kategori"
              icon="kategori"
            />
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR — C's simple steps ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
              SÜREÇ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Üç adımda montajcını bul
            </h2>
            <p className="mt-3 text-muted-text">
              Filtrele, incele, iletişime geç. Hepsi bu kadar basit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SimpleStep number="1" title="Ara ve Bul" desc="Şehir ve kategori filtreleriyle ihtiyacına uygun firmaları bul." />
            <SimpleStep number="2" title="İncele" desc="Profil sayfalarında firma bilgilerini, puanlarını ve referanslarını gör." />
            <SimpleStep number="3" title="İletişime Geç" desc="WhatsApp ile direkt iletişim kur, teklif al ve anlaş." />
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER — C's chip style with A colors ===== */}
      {categories.length > 0 && (
        <section className="py-24 md:py-32 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                KATEGORİLER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                Hizmet kategorileri
              </h2>
              <p className="mt-3 text-muted-text">
                {stats.categoryCount} farklı kategoride hizmet veren firmalar.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/[0.06] bg-dark-card rounded-full text-sm text-white/70 hover:text-white hover:border-montaj/40 hover:bg-dark-card transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM — C's 2-column layout with A styling ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text */}
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                PREMIUM
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                Firmanı öne çıkar
              </h2>
              <p className="mt-4 text-muted-text leading-relaxed">
                Premium üyeliğe geçerek firmanı binlerce müşterinin önüne
                çıkar, rakiplerinden bir adım önde ol.
              </p>

              <div className="mt-8 space-y-4">
                {premiumFeatures.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 text-montaj shrink-0">
                      <FeatureIcon icon={f.icon} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {f.title}
                      </div>
                      <div className="text-muted-text text-sm">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/dashboard/uyelik"
                  className="group inline-flex items-center gap-2 px-6 py-2.5 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-lg shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5 text-sm"
                >
                  Premium&apos;a Geç
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
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

            {/* Right: decorative */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-72 h-72">
                {/* Concentric rings */}
                <div className="absolute inset-0 border border-white/[0.06] rounded-full" />
                <div className="absolute inset-8 border border-white/[0.04] rounded-full" />
                <div className="absolute inset-16 border border-montaj/15 rounded-full" />
                {/* Ambient glow behind PRO */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-montaj/10 rounded-full blur-[50px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-montaj/40">
                      PRO
                    </div>
                    <div className="text-white/20 text-sm mt-1 tracking-[0.2em] uppercase">
                      Premium
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÖNE ÇIKAN FİRMALAR ===== */}
      {featuredProfiles.length > 0 && (
        <section className="py-24 md:py-32 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                  ÖNE ÇIKANLAR
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Öne çıkan firmalar
                </h2>
              </div>
              <Link
                href="/ara"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-montaj hover:text-montaj-light font-medium transition-colors"
              >
                Tümünü Gör
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                className="inline-flex items-center gap-1 text-sm text-montaj hover:text-montaj-light font-medium"
              >
                Tümünü Gör
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SON EKLENEN FİRMALAR ===== */}
      {latestProfiles.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <span className="inline-block px-3 py-1 text-xs font-medium text-montaj bg-montaj/10 rounded-full mb-4">
                SON EKLENENLER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Yeni katılan firmalar
              </h2>
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
      <section className="py-24 md:py-32 bg-dark-section">
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
                Sen de firmanı ekle
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
                Ücretsiz kayıt ol, firmanı ekle ve binlerce müşteriyle buluş.
              </p>
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center gap-2 px-7 py-3 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-lg shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5"
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

function GlassStat({
  value,
  label,
  icon,
  star,
}: {
  value: string | number;
  label: string;
  icon: string;
  star?: boolean;
}) {
  const icons: Record<string, React.ReactNode> = {
    firma: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    sehir: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    puan: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    kategori: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  };

  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-white/[0.06] rounded-xl p-5 md:p-6 text-center hover:border-montaj/20 transition-all hover:-translate-y-0.5">
      <div className="flex justify-center mb-3 text-montaj">{icons[icon]}</div>
      <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold text-white">
        {star && (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        {value}
      </div>
      <div className="text-sm md:text-base text-sub-text mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}

function SimpleStep({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group p-6 -m-6 rounded-2xl hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-montaj/10 flex items-center justify-center text-sm font-semibold text-montaj">
          {number}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="text-muted-text text-sm leading-relaxed pl-14">{desc}</p>
    </div>
  );
}

function FeatureIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "star":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case "trending":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    case "badge":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case "chart":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    default:
      return null;
  }
}
