import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroV5 from "./v5/HeroV5";
import TrustBar from "./v5/TrustBar";
import HomeBrands from "./HomeBrands";
import HomeServices from "./HomeServices";
import HomeStats from "./HomeStats";
import AudienceSection from "./AudienceSection";
import PlatformFeatures from "./PlatformFeatures";
import CorporateSection from "./CorporateSection";
import WhySection from "./WhySection";
import FinalCta from "./FinalCta";
import ProductShowcase from "./ProductShowcase";
import HowItWorksV4 from "./HowItWorksV4";
import AiSection from "./AiSection";
import BlogSection from "./BlogSection";
import FaqSection from "./FaqSection";
import TrustBand from "./TrustBand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Montajım Var - Profesyonel Montaj Platformu",
  description:
    "Türkiye'nin profesyonel montaj platformu. Mobilya, klima, tabela, AVM, fuar standı, elektrik ve endüstriyel montaj hizmetleri için doğrulanmış ekiplerden anında teklif alın.",
  openGraph: {
    title: "Montajım Var - Profesyonel Montaj Platformu",
    description:
      "Mobilya, klima, tabela, AVM, fuar standı ve elektrik montaj hizmetleri için doğrulanmış ekiplerden anında teklif alın.",
  },
};

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
        take: 8,
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            take: 4,
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

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="overflow-hidden">
      {/* ─── HERO (v5) ─── */}
      <HeroV5 />

      {/* ─── TRUST BAR (v5) ─── */}
      <TrustBar />

      {/* ─── SEKTÖRLER (legacy — FAZ 4'te ServiceDiscovery ile değişecek) ─── */}
      <HomeBrands />

      {/* ─── HEDEF KİTLE ─── */}
      <AudienceSection />

      {/* ─── HİZMET KATEGORİLERİ ─── */}
      <HomeServices categories={data.parentCategories} />

      {/* ─── NASIL ÇALIŞIR ─── */}
      <HowItWorksV4 />

      {/* ─── ÜRÜN TANITIMI ─── */}
      <ProductShowcase />

      {/* ─── PLATFORM ÖZELLİKLERİ ─── */}
      <PlatformFeatures />

      {/* ─── KURUMSAL ─── */}
      <CorporateSection />

      {/* ─── İSTATİSTİKLER ─── */}
      <HomeStats
        profileCount={data.profileCount}
        cityCount={data.cityCount}
        avgRating={data.avgRating}
        categoryCount={data.categoryCount}
      />

      {/* ─── AI TEKLİF ─── */}
      <AiSection />

      {/* ─── NEDEN BİZ ─── */}
      <WhySection />

      {/* ─── BLOG ─── */}
      <BlogSection />

      {/* ─── GÜVEN UNSURLARI + REFERANS ─── */}
      <TrustBand />

      {/* ─── SSS ─── */}
      <FaqSection />

      {/* ─── FİNAL CTA ─── */}
      <FinalCta />
    </div>
  );
}





