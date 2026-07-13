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

export default async function TasarimFPage() {
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
      {/* ===== HERO — LÜKS & SADE ===== */}
      <section className="relative min-h-screen flex items-center bg-[#050508] text-white">
        {/* Massive atmospheric glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Central warm radiance */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-montaj/[0.08] via-montaj/[0.02] to-transparent rounded-full blur-[200px]" />
          {/* Secondary cool tone */}
          <div className="absolute top-1/4 right-0 w-[400px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[150px]" />
          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-montaj/[0.02] rounded-full blur-[120px]" />
          {/* Subtle grain */}
          <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Minimal badge */}
            <div className="mb-10">
              <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">
                Montajım Var
              </span>
            </div>

            {/* Main heading — light weight, generous tracking */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light leading-[1.05] tracking-tight">
              Montajcını
              <br />
              <span className="text-6xl sm:text-7xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-montaj to-[#ffb366]">
                Bul
              </span>
            </h1>

            {/* Divider */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-white/10" />
              <span className="text-white/30 text-sm font-light tracking-widest">Platform</span>
              <span className="w-12 h-px bg-white/10" />
            </div>

            {/* Description */}
            <p className="mt-8 text-white/30 text-lg max-w-lg mx-auto leading-relaxed font-light">
              Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmalarını keşfedin.
            </p>

            {/* Single elegant CTA */}
            <div className="mt-10">
              <Link
                href="/ara"
                className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] text-white font-light tracking-wide rounded-full hover:bg-white/[0.08] transition-all hover:-translate-y-0.5"
              >
                Firmaları Keşfet
                <span className="w-6 h-6 rounded-full bg-montaj flex items-center justify-center group-hover:bg-montaj-dark transition-colors">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Secondary link */}
            <div className="mt-6">
              <Link
                href="/auth/kayit"
                className="text-white/20 text-sm hover:text-white/50 transition-colors"
              >
                Firmanı ekle —
                <span className="text-montaj/60 hover:text-montaj"> ücretsiz kayıt</span>
              </Link>
            </div>
          </div>

          {/* Bottom stat line */}
          <div className="mt-24 flex justify-center">
            <div className="inline-flex items-center gap-10 px-8 py-4 bg-white/[0.02] backdrop-blur-xl rounded-full border border-white/[0.04]">
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{stats.profileCount}+</div>
                <div className="text-white/20 text-xs tracking-wider uppercase">Firma</div>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{stats.cityCount}</div>
                <div className="text-white/20 text-xs tracking-wider uppercase">Şehir</div>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{stats.avgRating > 0 ? stats.avgRating : "—"}</div>
                <div className="text-white/20 text-xs tracking-wider uppercase">Puan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS — glass chips ===== */}
      <section className="py-20 md:py-28 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <GlassMetric value={stats.profileCount} label="Kayıtlı Firma" suffix="+" />
            <GlassMetric value={stats.cityCount} label="Şehir" />
            <GlassMetric value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"} label="Ortalama Puan" star />
            <GlassMetric value={stats.categoryCount} label="Kategori" />
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR — roman numerals ===== */}
      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">Süreç</span>
            <h2 className="text-3xl md:text-5xl font-light text-white mt-4 tracking-tight">
              Nasıl Çalışır
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { n: "I", t: "Ara", d: "Şehir ve kategori filtreleriyle ihtiyacına uygun firmaları bul." },
              { n: "II", t: "İncele", d: "Profil sayfalarında firma bilgilerini, puanları ve referansları gör." },
              { n: "III", t: "İletişime Geç", d: "WhatsApp ile direkt iletişim kur, teklif al ve anlaş." },
            ].map((step) => (
              <div key={step.n} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/[0.03] border border-white/[0.04] flex items-center justify-center group-hover:border-montaj/30 transition-all">
                  <span className="text-montaj text-lg font-light tracking-wider">{step.n}</span>
                </div>
                <h3 className="text-xl font-light text-white mb-3 tracking-wide">{step.t}</h3>
                <p className="text-white/30 text-sm leading-relaxed max-w-xs mx-auto font-light">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KATEGORİLER — elegant chips ===== */}
      {categories.length > 0 && (
        <section className="py-28 md:py-36 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">Kategoriler</span>
              <h2 className="text-3xl md:text-5xl font-light text-white mt-4 tracking-tight">
                Kategoriler
              </h2>
            </div>

            <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="px-5 py-2.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.04] rounded-full text-sm text-white/50 hover:text-white hover:border-montaj/30 hover:bg-white/[0.04] transition-all font-light"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PREMIUM ===== */}
      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered minimal premium card */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#08080c] to-[#0a0a10] rounded-3xl border border-white/[0.04] p-10 md:p-16 text-center overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-montaj/[0.04] rounded-full blur-[120px]" />

              <div className="relative">
                <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">Premium</span>
                <h2 className="text-3xl md:text-5xl font-light text-white mt-4 tracking-tight">
                  Firmanı Öne Çıkar
                </h2>
                <p className="mt-4 text-white/30 max-w-md mx-auto font-light">
                  Premium üyeliğe geçerek firmanı binlerce müşterinin önüne çıkar.
                </p>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {premiumFeatures.map((f) => (
                    <div key={f.title} className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-5 border border-white/[0.04] hover:border-montaj/20 transition-all">
                      <div className="w-9 h-9 bg-montaj/10 rounded-lg flex items-center justify-center mb-3">
                        <FeatureIcon icon={f.icon} />
                      </div>
                      <h3 className="text-white text-sm font-medium mb-1">{f.title}</h3>
                      <p className="text-white/30 text-xs font-light leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Link
                    href="/dashboard/uyelik"
                    className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] text-white font-light tracking-wide rounded-full hover:bg-white/[0.08] transition-all"
                  >
                    Premium'a Geç
                    <span className="w-6 h-6 rounded-full bg-montaj flex items-center justify-center group-hover:bg-montaj-dark transition-colors">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÖNE ÇIKAN FİRMALAR ===== */}
      {featuredProfiles.length > 0 && (
        <section className="py-28 md:py-36 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">Öne Çıkanlar</span>
              <h2 className="text-3xl md:text-5xl font-light text-white mt-4 tracking-tight">
                Öne Çıkan Firmalar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/ara"
                className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors font-light text-sm"
              >
                Tüm Firmaları Gör
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SON EKLENEN FİRMALAR ===== */}
      {latestProfiles.length > 0 && (
        <section className="py-28 md:py-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">Yeni</span>
              <h2 className="text-3xl md:text-5xl font-light text-white mt-4 tracking-tight">
                Son Eklenen Firmalar
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
      <section className="py-28 md:py-36 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs text-white/20 tracking-[0.3em] uppercase font-light">Kayıt</span>
            <h2 className="text-3xl md:text-5xl font-light text-white mt-4 tracking-tight">
              Sen de Firmanı Ekle
            </h2>
            <p className="mt-4 text-white/30 font-light">
              Ücretsiz kayıt ol, firmanı ekle ve binlerce müşteriyle buluş.
            </p>
            <div className="mt-10">
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] text-white font-light tracking-wide rounded-full hover:bg-white/[0.08] transition-all hover:-translate-y-0.5"
              >
                Hemen Başla
                <span className="w-6 h-6 rounded-full bg-montaj flex items-center justify-center group-hover:bg-montaj-dark transition-colors">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== SUB-COMPONENTS ===== */

function GlassMetric({ value, label, suffix, star }: { value: string | number; label: string; suffix?: string; star?: boolean }) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6 md:p-8 text-center hover:border-white/[0.08] transition-all">
      <div className="flex items-center justify-center gap-1 text-4xl md:text-5xl font-light text-white">
        {star && <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
        {value}{suffix || ""}
      </div>
      <div className="text-white/30 text-sm mt-2 font-light tracking-wide">{label}</div>
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
