import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export default async function YeniTasarimPage() {
  const stats = await getStats();

  const premiumFeatures = [
    {
      title: "Vitrin Desteği",
      desc: "Firmanız öne çıkan firmalar bölümünde listelenir, daha fazla görüntülenme alır.",
    },
    {
      title: "Arama'da Üst Sıra",
      desc: "Premium firmalar arama sonuçlarında her zaman üst sıralarda gösterilir.",
    },
    {
      title: "Premium Rozeti",
      desc: "Profilinizde premium rozeti görünür, müşteriler nezdinde güven oluşturur.",
    },
    {
      title: "Detaylı Analiz",
      desc: "Profil görüntülenme, mesaj ve yorum istatistiklerinizi görüntüleyin.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-[#081020] via-[#0f1a30] to-[#060d1a] text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
          {/* Orbs */}
          <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-montaj/20 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/4 -right-24 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[160px]" />
          {/* Corporate accent lines */}
          <svg className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02]" viewBox="0 0 600 900" fill="none">
            <line x1="200" y1="0" x2="400" y2="900" stroke="white" strokeWidth="0.5" />
            <line x1="400" y1="0" x2="600" y2="900" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="600" x2="600" y2="600" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-full text-sm text-white/60 mb-10">
              <span className="w-2 h-2 bg-montaj rounded-full shadow-[0_0_8px_rgba(255,122,0,0.5)]" />
              Türkiye&apos;nin Montaj Platformu
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight">
              Montajcınızı{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-montaj via-[#ffa64d] to-[#ff8c1a]">
                Bulun
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white/50 font-normal">
                İşinizi Büyütün
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg sm:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light">
              Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmalarını,
              üreticiler ve müşterileri bir araya getiren platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ara"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-xl shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5 text-base"
              >
                Firmaları Keşfet
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/auth/kayit"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all hover:-translate-y-0.5 text-base"
              >
                Hemen Katıl
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-16 pt-10 border-t border-white/[0.06]">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                <TrustBlock value={`${stats.profileCount}+`} label="Kayıtlı Firma" />
                <TrustBlock value={String(stats.cityCount)} label="Şehir" />
                {stats.avgRating > 0 && <TrustBlock value={stats.avgRating.toFixed(1)} label="Ortalama Puan" star />}
                <TrustBlock value={String(stats.categoryCount)} label="Kategori" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent" />
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 md:py-28 relative">
        {/* Background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-montaj/[0.02] rounded-full blur-[100px]" />
        </div>

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
              value={stats.profileCount}
              label="Firma"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              }
            />
            <StatCard
              value={stats.cityCount}
              label="Şehir"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              }
            />
            <StatCard
              value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
              label="Ortalama Puan"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
            />
            <StatCard
              value={stats.categoryCount}
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

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className="py-20 md:py-28 bg-dark-section relative overflow-hidden">
        {/* Background */}
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
              Üç basit adımda ihtiyacınız olan montaj firmasını bulun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
            <StepCard
              number="01"
              title="Ara ve Bul"
              desc="Şehrinize ve ihtiyacınıza uygun montaj firmalarını gelişmiş filtrelerle kolayca bulun."
            />
            <StepCard
              number="02"
              title="İncele ve Karşılaştır"
              desc="Firma profillerini inceleyin, puanlarını görün ve size en uygun olanı seçin."
            />
            <StepCard
              number="03"
              title="İletişime Geçin"
              desc="WhatsApp üzerinden direkt mesaj gönderin, teklif alın ve anlaşmaya varın."
            />
          </div>
        </div>
      </section>

      {/* ===== PREMIUM ===== */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-montaj/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-blue-600/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
                Premium
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Firmanızı Öne Çıkarın
              </h2>
              <p className="mt-2 text-muted-text max-w-lg mx-auto">
                Premium üyeliğe geçerek firmanızı binlerce müşterinin önüne çıkarın.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-5 p-6 rounded-xl border border-white/[0.04] bg-dark-card hover:border-montaj/20 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-montaj/10 flex items-center justify-center shrink-0 group-hover:bg-montaj/20 transition-colors">
                    <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-text text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/dashboard/uyelik"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-montaj to-montaj-dark text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5 text-base"
              >
                Premium&apos;a Geç
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28 bg-dark-section relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-montaj/[0.04] rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-montaj bg-montaj/10 rounded-full mb-4 tracking-wider uppercase">
              Başlayın
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Sen de Firmanı Ekle
            </h2>
            <p className="text-muted-text text-lg max-w-xl mx-auto mb-10">
              Ücretsiz kayıt olun, firmanızı ekleyin ve binlerce müşteriyle
              buluşun. Türkiye&apos;nin montaj platformuna katılın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/kayit"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all shadow-xl shadow-montaj/25 hover:shadow-montaj/40 hover:-translate-y-0.5 text-base"
              >
                Hemen Başla
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

function TrustBlock({ value, label, star }: { value: string; label: string; star?: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-montaj font-bold text-2xl tracking-tight">
        {star && (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        {value}
      </div>
      <div className="text-white/40 text-sm mt-0.5">{label}</div>
    </div>
  );
}

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div className="relative group">
      {/* Hover glow */}
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

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="group relative text-center p-8 rounded-xl bg-dark-card border border-white/[0.04] hover:border-montaj/20 transition-all hover:-translate-y-1">
      {/* Step number */}
      <div className="relative mx-auto mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-montaj/10 flex items-center justify-center group-hover:bg-montaj/20 transition-colors">
          <span className="text-2xl font-bold text-montaj">{number}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>

      {/* Description */}
      <p className="text-muted-text text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  );
}
