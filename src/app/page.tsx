import { prisma } from "@/lib/prisma";
import HomeHero from "./HomeHero";
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
      {/* ─── HERO ─── */}
      <HomeHero />

      {/* ─── SEKTÖRLER ─── */}
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

      {/* ─── SSS ─── */}
      <FaqSection />

      {/* ─── FİNAL CTA ─── */}
      <FinalCta />
    </div>
  );
}





