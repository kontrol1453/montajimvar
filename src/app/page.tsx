import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomeSearchBox from "./HomeSearchBox";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [profileCount, cities, ratingAgg, categoryCount, parentCategories] =
    await Promise.all([
      prisma.profile.count(),
      prisma.profile.findMany({
        select: { city: true },
        distinct: ["city"],
        where: { city: { not: "" } },
      }),
      prisma.profile.aggregate({ _avg: { ratingAvg: true } }),
      prisma.category.count(),
      prisma.category.findMany({
        where: { parentId: null, isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      }),
    ]);
  return {
    profileCount,
    cityCount: cities.length,
    avgRating: ratingAgg._avg.ratingAvg
      ? Number(ratingAgg._avg.ratingAvg.toFixed(1))
      : 0,
    categoryCount,
    parentCategories,
  };
}

const popularSearches = [
  "Mobilya",
  "Klima",
  "Reklam Tabelası",
  "Stand Kurulumu",
  "AVM Montajı",
  "Mekanik",
  "Elektrik",
  "Cephe",
];

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[95vh] flex items-center bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#040a14]">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Large gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-montaj/15 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/4 -right-32 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[180px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-montaj/[0.03] rounded-full blur-[150px]" />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-sm text-white/50 mb-8">
              <span className="w-1.5 h-1.5 bg-montaj rounded-full shadow-[0_0_8px_rgba(255,122,0,0.6)]" />
              Türkiye&apos;nin Profesyonel Montaj Platformu
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-white">
              Türkiye&apos;nin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-montaj via-[#ffa64d] to-[#ff8c1a]">
                Profesyonel
              </span>{" "}
              <br className="hidden sm:block" />
              Montaj Platformu
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
              Mobilya, Reklam, Stand, AVM, İnşaat, Elektrik, Mekanik ve
              Endüstriyel Montaj Hizmetleri.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/is-ver"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-lg"
              >
                <span className="text-2xl">🟢</span>
                İş Ver
              </Link>
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-lg"
              >
                <span className="text-2xl">🔵</span>
                Usta Ol
              </Link>
            </div>

            {/* Search Box */}
            <div className="mt-12 max-w-2xl mx-auto">
              <HomeSearchBox />
              {/* Popular searches */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-xs text-white/30 mt-0.5">Popüler:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/ara?q=${encodeURIComponent(term)}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Bar */}
            <div className="mt-16 pt-10 border-t border-white/[0.06]">
              <div className="flex flex-wrap justify-center gap-x-14 gap-y-5">
                <TrustBlock value={`${data.profileCount}+`} label="Kayıtlı Firma" />
                <TrustBlock value={String(data.cityCount)} label="Şehir" />
                {data.avgRating > 0 && (
                  <TrustBlock
                    value={data.avgRating.toFixed(1)}
                    label="Ortalama Puan"
                    star
                  />
                )}
                <TrustBlock value={String(data.categoryCount)} label="Hizmet Kategorisi" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--clr-bg)] to-transparent" />
      </section>

      {/* ===== KATEGORİLER ===== */}
      <section className="py-20 md:py-28 relative" id="kategoriler">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-montaj/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
              Hizmet Kategorileri
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Profesyonel Montaj Hizmetleri
            </h2>
            <p className="mt-2 text-muted-text max-w-2xl mx-auto">
              İhtiyacınıza uygun montaj hizmetini seçin, size en yakın uzmanlarla bağlantı kurun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.parentCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                icon={cat.icon}
                children={cat.children.map((c) => ({
                  name: c.name,
                  slug: c.slug,
                }))}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="py-20 md:py-28 bg-dark-section relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
              Süreç
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nasıl Çalışır?
            </h2>
            <p className="mt-2 text-muted-text max-w-lg mx-auto">
              Dört basit adımda ihtiyacınız olan montaj uzmanını bulun ve işinizi halledin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StepCard
              number="1"
              title="İşini Ver"
              desc="Fotoğraf ekle, konum seç ve işini açıkla. Bütçeni belirt, teklif almaya başla."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              }
            />
            <StepCard
              number="2"
              title="Teklif Al"
              desc="Ustalardan teklifler gelir. Puanları, yorumları ve fiyatları karşılaştır."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              }
            />
            <StepCard
              number="3"
              title="İşi Takip Et"
              desc="Ustanın profiline bak, konumunu takip et, iş ilerledikçe durumu gör."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              }
            />
            <StepCard
              number="4"
              title="Güvenle Öde"
              desc="İş tamamlanana kadar ödemen emanette. Memnun kalınca ustanın hesabına aktarılır."
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ===== İSTATİSTİKLER ===== */}
      <section className="py-20 md:py-28 relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
              Platform Verileri
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Büyüyen Topluluk
            </h2>
            <p className="mt-2 text-muted-text max-w-lg mx-auto">
              Her geçen gün büyüyen montaj ekosistemimizin güncel istatistikleri.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard
              value={data.profileCount}
              label="Firma"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              }
            />
            <StatCard
              value={data.cityCount}
              label="Şehir"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              }
            />
            <StatCard
              value={data.avgRating > 0 ? data.avgRating.toFixed(1) : "—"}
              label="Ortalama Puan"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
            />
            <StatCard
              value={data.categoryCount}
              label="Kategori"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ===== GÜVEN UNSURLARI ===== */}
      <section className="py-20 md:py-28 bg-dark-section relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-montaj/[0.03] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
              Neden Montajım Var?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Güvenli ve Profesyonel
            </h2>
            <p className="mt-2 text-muted-text max-w-lg mx-auto">
              Platformumuzu farklı kılan özellikler.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <TrustFeatureCard
              title="Kimlik Doğrulaması"
              desc="Tüm ustalar kimlik doğrulamasından geçer, güvenilir hizmet garantisi."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
            />
            <TrustFeatureCard
              title="Güvenli Ödeme"
              desc="Ödemeniz iş tamamlanana kadar emanette tutulur, mağduriyet yaşamazsınız."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              }
            />
            <TrustFeatureCard
              title="Müşteri Yorumları"
              desc="Her iş sonrası puanlama ve yorum sistemi ile kaliteli hizmet garanti."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-montaj/[0.04] rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
              Başlayın
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Profesyonel Montajcı mısın?
            </h2>
            <p className="text-muted-text text-lg max-w-xl mx-auto mb-10">
              Binlerce müşteriye ulaş, işini büyüt. Ücretsiz kayıt ol, hemen teklif almaya başla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-xl shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5 text-base"
              >
                Hemen Katıl
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
                href="/ara"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all hover:-translate-y-0.5 text-base"
              >
                Firmaları Keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== SUB-COMPONENTS ===== */

function TrustBlock({
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
      <div className="text-white/40 text-sm mt-0.5">{label}</div>
    </div>
  );
}

function CategoryCard({
  name,
  slug,
  icon,
  children,
}: {
  name: string;
  slug: string;
  icon: string | null;
  children: { name: string; slug: string }[];
}) {
  return (
    <Link href={`/ara?kategoriler=${slug}`}>
      <div className="group p-5 rounded-xl bg-dark-card border border-white/[0.04] hover:border-montaj/20 hover:-translate-y-0.5 transition-all h-full">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <span className="text-xl" dangerouslySetInnerHTML={{ __html: icon }} />
          )}
          <h3 className="font-semibold text-white group-hover:text-montaj transition-colors">
            {name}
          </h3>
        </div>
        {children.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {children.slice(0, 6).map((child) => (
              <span
                key={child.slug}
                className="text-xs px-2 py-0.5 rounded bg-white/[0.04] text-muted-text"
              >
                {child.name}
              </span>
            ))}
            {children.length > 6 && (
              <span className="text-xs px-2 py-0.5 rounded text-montaj">
                +{children.length - 6}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
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
    <div className="relative group">
      <div className="absolute -inset-1 bg-montaj/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-dark-card border border-white/[0.04] rounded-xl p-6 md:p-8 text-center hover:border-montaj/20 transition-all">
        <div className="flex justify-center mb-4 text-montaj/60 group-hover:text-montaj transition-colors">
          {icon}
        </div>
        <div className="text-4xl md:text-5xl font-bold text-white mb-1">
          {value}
        </div>
        <div className="text-sub-text text-sm font-medium">{label}</div>
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
    <div className="group relative text-center p-8 rounded-xl bg-dark-card border border-white/[0.04] hover:border-montaj/20 transition-all hover:-translate-y-1">
      <div className="relative mx-auto mb-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-montaj/10 flex items-center justify-center group-hover:bg-montaj/20 transition-colors text-montaj">
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-montaj text-white text-xs font-bold flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-muted-text text-sm leading-relaxed max-w-xs mx-auto">
        {desc}
      </p>
    </div>
  );
}

function TrustFeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group flex items-start gap-5 p-6 rounded-xl border border-white/[0.04] bg-dark-card hover:border-montaj/20 hover:-translate-y-0.5 transition-all">
      <div className="w-12 h-12 rounded-xl bg-montaj/10 flex items-center justify-center shrink-0 group-hover:bg-montaj/20 transition-colors text-montaj">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white text-base mb-1">
          {title}
        </h3>
        <p className="text-muted-text text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
