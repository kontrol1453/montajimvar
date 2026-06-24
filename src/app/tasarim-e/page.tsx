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

export default async function TasarimEPage() {
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
    <div className="overflow-hidden">
      {/* ===== HERO — MODERN DİAGONAL ===== */}
      <section className="relative min-h-screen flex items-center text-white">
        {/* Diagonal split background */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div
          className="absolute inset-0 origin-bottom-left"
          style={{
            background: "linear-gradient(135deg, #0b1427 0%, #162044 50%, #ff7a00 100%)",
            clipPath: "polygon(55% 0, 100% 0, 100% 100%, 35% 100%)",
          }}
        />

        {/* Orange diagonal accent stripe */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, transparent 48%, rgba(255,122,0,0.15) 48%, rgba(255,122,0,0.08) 52%, transparent 52%)",
          }}
        />

        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-montaj" />
                <span className="text-sm text-white/50 tracking-widest uppercase">Platform</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight">
                Montajcını
                <br />
                <span className="text-montaj">Bul</span>
              </h1>
              <p className="text-lg sm:text-xl font-light mt-2 text-white/60">
                İşini Büyüt
              </p>

              <p className="mt-6 text-white/40 max-w-md leading-relaxed">
                Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmalarını keşfedin, karşılaştırın ve iletişime geçin.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/ara"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-montaj text-white font-bold rounded-sm hover:bg-montaj-dark transition-all tracking-wide uppercase text-sm"
                >
                  Keşfet
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/auth/kayit"
                  className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/20 text-white font-bold rounded-sm hover:bg-white/10 transition-all tracking-wide uppercase text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>

              {/* Angular stats */}
              <div className="mt-12 flex gap-8">
                <div>
                  <div className="text-3xl font-black text-montaj">{stats.profileCount}+</div>
                  <div className="text-white/30 text-xs tracking-widest uppercase mt-1">Firma</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <div className="text-3xl font-black text-montaj">{stats.cityCount}</div>
                  <div className="text-white/30 text-xs tracking-widest uppercase mt-1">Şehir</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <div className="text-3xl font-black text-montaj">{stats.avgRating > 0 ? stats.avgRating : "—"}</div>
                  <div className="text-white/30 text-xs tracking-widest uppercase mt-1">Puan</div>
                </div>
              </div>
            </div>

            {/* Right — bold geometric shapes */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-80 h-80">
                {/* Large rotated square */}
                <div className="absolute inset-0 border-2 border-montaj/30 rotate-45 rounded-sm" />
                {/* Inner square */}
                <div className="absolute inset-12 border border-white/10 rotate-12 rounded-sm" />
                {/* Center highlight */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl font-black text-montaj/20">M</div>
                  </div>
                </div>
                {/* Small accent diamond */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-montaj rotate-45 rounded-sm" />
                <div className="absolute bottom-8 left-8 w-4 h-4 bg-white/20 rotate-45 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom angle divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-dark-section" style={{ clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)" }} />
      </section>

      {/* ===== STATS — bold angled cards ===== */}
      <section className="bg-dark-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AngleStat value={stats.profileCount} label="Firma Kayıtlı" accent />
            <AngleStat value={stats.cityCount} label="Şehir" />
            <AngleStat value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"} label="Ortalama Puan" accent />
            <AngleStat value={stats.categoryCount} label="Kategori" />
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs text-montaj tracking-widest uppercase font-bold">Süreç</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">
              NASIL ÇALIŞIR?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6">
            {[
              { n: "01", t: "ARA", d: "Şehir ve kategori filtreleriyle ihtiyacına uygun firmaları bul." },
              { n: "02", t: "İNCELE", d: "Profil sayfalarında firma bilgilerini, puanları ve referansları gör." },
              { n: "03", t: "İLETİŞİME GEÇ", d: "WhatsApp ile direkt iletişim kur, teklif al ve anlaş." },
            ].map((step, i) => (
              <div key={step.n} className="relative p-8 border-l-2 md:border-l-0 md:border-t-2 border-montaj/20">
                <div className="absolute -top-3 -left-3 md:-top-4 md:left-4 w-7 h-7 bg-montaj flex items-center justify-center text-xs font-black text-white rounded-sm">
                  {step.n}
                </div>
                <div className="mt-4 md:mt-2">
                  <h3 className="text-lg font-black text-white tracking-wider mb-2">{step.t}</h3>
                  <p className="text-muted-text text-sm leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER ===== */}
      {categories.length > 0 && (
        <section className="py-20 md:py-28 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14">
              <span className="text-xs text-montaj tracking-widest uppercase font-bold">Kategoriler</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">KATEGORİLER</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="group relative bg-dark-card border border-white/[0.04] p-4 hover:border-montaj/40 transition-all overflow-hidden"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-montaj/20 group-hover:border-r-montaj/60 transition-colors" />
                  <div className="relative flex items-center gap-3">
                    <span className="font-bold text-white/80 text-sm tracking-wide group-hover:text-montaj transition-colors">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#0a0a0a] border border-white/[0.04] p-8 md:p-12">
            {/* Diagonal accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-montaj to-transparent" />

            <div className="relative">
              <div className="text-center mb-12">
                <span className="text-xs text-montaj tracking-widest uppercase font-bold">Premium</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">FİRMANI ÖNE ÇIKAR</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {premiumFeatures.map((f) => (
                  <div key={f.title} className="border border-white/[0.04] p-5 hover:border-montaj/30 transition-all">
                    <div className="w-9 h-9 bg-montaj/20 flex items-center justify-center mb-3 rounded-sm">
                      <FeatureIcon icon={f.icon} />
                    </div>
                    <h3 className="font-bold text-white text-sm tracking-wide">{f.title}</h3>
                    <p className="text-muted-text text-xs mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/dashboard/uyelik"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-montaj text-white font-bold tracking-wide uppercase text-sm rounded-sm hover:bg-montaj-dark transition-all"
                >
                  Premium'a Geç
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <span className="text-xs text-montaj tracking-widest uppercase font-bold">Öne Çıkanlar</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">ÖNE ÇIKAN FİRMALAR</h2>
              </div>
              <Link href="/ara" className="hidden sm:inline-flex items-center gap-1 text-sm text-montaj font-bold tracking-wide uppercase hover:text-montaj-light transition-colors">
                Tümü →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/ara" className="text-sm text-montaj font-bold tracking-wide uppercase">
                Tümünü Gör →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SON EKLENEN FİRMALAR ===== */}
      {latestProfiles.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs text-montaj tracking-widest uppercase font-bold">Son Eklenenler</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">YENİ FİRMALAR</h2>
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
          <div className="relative bg-gradient-to-r from-[#0b1427] to-[#162044] p-10 md:p-16 text-center">
            {/* Angle overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(45deg, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">SEN DE FİRMANI EKLE</h2>
              <p className="text-white/50 mt-3 max-w-lg mx-auto text-sm">Ücretsiz kayıt ol, firmanı ekle ve binlerce müşteriyle buluş.</p>
              <Link
                href="/auth/kayit"
                className="group mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-montaj text-white font-bold tracking-wide uppercase text-sm rounded-sm hover:bg-montaj-dark transition-all"
              >
                Hemen Başla
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

function AngleStat({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className={`p-5 ${accent ? "bg-montaj/10 border border-montaj/20" : "bg-dark-card border border-white/[0.04]"} text-center`}>
      <div className={`text-3xl md:text-4xl font-black ${accent ? "text-montaj" : "text-white"}`}>{value}</div>
      <div className="text-xs text-white/40 mt-1 tracking-wide uppercase font-medium">{label}</div>
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
