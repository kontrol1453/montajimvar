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

export default async function TasarimDPage() {
  const [featuredProfiles, latestProfiles, categories, stats] =
    await Promise.all([
      getFeaturedProfiles(),
      getLatestProfiles(),
      getCategories(),
      getStats(),
    ]);

  const premiumFeatures = [
    { title: "Vitrin Desteği", desc: "Firmanız öne çıkan firmalar bölümünde listelenir.", icon: "star" },
    { title: "Arama'da Üst Sıra", desc: "Premium firmalar arama sonuçlarında üst sıralarda gösterilir.", icon: "trending" },
    { title: "Premium Rozeti", desc: "Profilinizde premium rozeti görünür, güven oluşturur.", icon: "badge" },
    { title: "Detaylı Analiz", desc: "Profil istatistiklerinizi görüntüleyin.", icon: "chart" },
  ];

  return (
    <div>
      {/* ===== HERO — KEŞİF PORTALI ===== */}
      <section className="relative bg-gradient-to-b from-[#0d1117] to-[#0a0a0a] text-white">
        {/* Subtle top pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-montaj/20 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          {/* Heading */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-montaj/10 rounded-full text-xs text-montaj font-medium mb-5">
              {stats.profileCount}+ firma kayıtlı
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Montajcını <span className="text-montaj">Bul</span>
            </h1>
            <p className="mt-3 text-white/50 text-lg max-w-lg mx-auto">
              Türkiye'nin dört bir yanındaki montaj firmalarını keşfet, karşılaştır ve iletişime geç.
            </p>
          </div>

          {/* Search bar mockup */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-dark-card border border-white/[0.06] rounded-xl px-5 py-3.5 focus-within:border-montaj/30 transition-colors">
              <svg className="w-5 h-5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Firma adı, şehir veya kategori ile ara..."
                className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-sm"
                readOnly
              />
              <kbd className="hidden sm:inline-flex text-xs text-white/20 border border-white/[0.06] rounded px-1.5 py-0.5">⌘K</kbd>
            </div>
          </div>

          {/* Quick category pills */}
          {categories.length > 0 && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/ara?kategori=${cat.slug}`}
                    className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.04] rounded-full text-xs text-white/50 hover:text-white hover:border-montaj/30 hover:bg-montaj/10 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
                {categories.length > 8 && (
                  <span className="px-3 py-1.5 text-xs text-white/30">+{categories.length - 8}</span>
                )}
              </div>
            </div>
          )}

          {/* Stats inline */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <span className="text-white/40">
              <strong className="text-white">{stats.profileCount}+</strong> firma
            </span>
            <span className="text-white/20">·</span>
            <span className="text-white/40">
              <strong className="text-white">{stats.cityCount}</strong> şehir
            </span>
            <span className="text-white/20">·</span>
            {stats.avgRating > 0 && (
              <>
                <span className="text-white/40">
                  <strong className="text-white">⭐ {stats.avgRating}</strong> ort. puan
                </span>
                <span className="text-white/20">·</span>
              </>
            )}
            <span className="text-white/40">
              <strong className="text-white">{stats.categoryCount}</strong> kategori
            </span>
          </div>
        </div>
      </section>

      {/* ===== ÖNE ÇIKAN FİRMALAR (immediately) ===== */}
      {featuredProfiles.length > 0 && (
        <section className="py-16 md:py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Öne Çıkan Firmalar
                </h2>
                <p className="text-muted-text text-sm mt-1">
                  En çok tercih edilen montaj firmaları
                </p>
              </div>
              <Link
                href="/ara"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-montaj hover:text-montaj-light font-medium"
              >
                Tümünü Gör →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link href="/ara" className="text-sm text-montaj hover:text-montaj-light font-medium">
                Tümünü Gör →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <span className="text-xs text-montaj/60 tracking-widest uppercase font-medium">Süreç</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
              Nasıl Çalışır?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Ara", d: "Şehir ve kategorilere göre filtrele, ihtiyacına en uygun firmayı bul." },
              { n: "02", t: "İncele", d: "Profil sayfasında firma bilgilerini, puanları ve referansları gör." },
              { n: "03", t: "İletişime Geç", d: "WhatsApp ile direkt mesaj gönder, teklif al ve anlaşmaya var." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 p-5 rounded-xl bg-dark-card border border-white/[0.04]">
                <div className="w-10 h-10 rounded-lg bg-montaj/10 flex items-center justify-center text-montaj font-bold text-sm shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{step.t}</h3>
                  <p className="text-muted-text text-xs mt-1 leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER ===== */}
      {categories.length > 0 && (
        <section className="py-16 md:py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mb-12">
              <span className="text-xs text-montaj/60 tracking-widest uppercase font-medium">Kategoriler</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Tüm Kategoriler
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-dark-card border border-white/[0.04] hover:border-montaj/30 hover:bg-dark-card transition-all"
                >
                  <div className="w-8 h-8 rounded-md bg-montaj/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white/80">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM ===== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="flex-1 max-w-lg">
              <span className="text-xs text-montaj/60 tracking-widest uppercase font-medium">Premium</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Firmanı Öne Çıkar
              </h2>
              <p className="mt-3 text-muted-text text-sm leading-relaxed">
                Premium üyeliğe geçerek firmanı binlerce müşterinin önüne çıkar. Vitrin desteği, aramada üst sıra ve premium rozeti ile rakiplerinden ayrış.
              </p>
              <div className="mt-6 space-y-3">
                {premiumFeatures.map((f) => (
                  <div key={f.title} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-montaj/10 flex items-center justify-center shrink-0">
                      <FeatureIcon icon={f.icon} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{f.title}</div>
                      <div className="text-muted-text text-xs">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/uyelik"
                className="group mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-montaj text-white font-medium rounded-lg hover:bg-montaj-dark transition-all text-sm"
              >
                Premium'a Geç
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Right: mini feature grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-dark-card rounded-xl border border-white/[0.04] text-center">
                  <div className="text-2xl font-bold text-montaj">+{stats.profileCount * 3}</div>
                  <div className="text-muted-text text-xs mt-1">Aylık Görüntülenme</div>
                </div>
                <div className="p-4 bg-dark-card rounded-xl border border-white/[0.04] text-center">
                  <div className="text-2xl font-bold text-montaj">%40</div>
                  <div className="text-muted-text text-xs mt-1">Daha Fazla Tıklanma</div>
                </div>
                <div className="p-4 bg-dark-card rounded-xl border border-white/[0.04] text-center">
                  <div className="text-2xl font-bold text-montaj">{stats.cityCount}</div>
                  <div className="text-muted-text text-xs mt-1">Şehirde Hizmet</div>
                </div>
                <div className="p-4 bg-dark-card rounded-xl border border-white/[0.04] text-center">
                  <div className="text-2xl font-bold text-montaj">7/24</div>
                  <div className="text-muted-text text-xs mt-1">Kesintisiz Erişim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SON EKLENEN FİRMALAR ===== */}
      {latestProfiles.length > 0 && (
        <section className="py-16 md:py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Son Eklenen Firmalar</h2>
                <p className="text-muted-text text-sm mt-1">Platforma yeni katılan firmalar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Sen de Firmanı Ekle</h2>
            <p className="mt-2 text-muted-text text-sm">Ücretsiz kayıt ol, firmanı ekle, müşterilerle buluş.</p>
            <Link
              href="/auth/kayit"
              className="group mt-6 inline-flex items-center gap-2 px-6 py-3 bg-montaj text-white font-medium rounded-lg hover:bg-montaj-dark transition-all"
            >
              Hemen Başla
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureIcon({ icon }: { icon: string }) {
  const cls = "w-4 h-4 text-montaj";
  switch (icon) {
    case "star": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
    case "trending": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
    case "badge": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>;
    case "chart": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
    default: return null;
  }
}
