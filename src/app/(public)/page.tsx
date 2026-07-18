import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import HeroV5 from "./v5/HeroV5";
import TrustBar from "./v5/TrustBar";
import AudienceGateway from "./v5/AudienceGateway";
import ServiceDiscovery from "./v5/ServiceDiscovery";
import ProductWorkflow from "./v5/ProductWorkflow";
import PlatformCapabilities from "./v5/PlatformCapabilities";
import CorporateOperations from "./v5/CorporateOperations";
import VerifiedMetrics from "./v5/VerifiedMetrics";
import AITeaser from "./v5/AITeaser";
import WhyMontajimVar from "./v5/WhyMontajimVar";
import FAQv5 from "./v5/FAQv5";
import FinalConversionCTA from "./v5/FinalConversionCTA";
import BlogSection from "./BlogSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Montajım Var - Profesyonel Montaj Platformu",
  description:
    "Türkiye'nin profesyonel montaj platformu. Mobilya, klima, tabela, AVM, fuar standı, elektrik ve endüstriyel montaj hizmetleri için doğrulanmış ekiplerden anında teklif alın.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Montajım Var - Profesyonel Montaj Platformu",
    description:
      "Mobilya, klima, tabela, AVM, fuar standı ve elektrik montaj hizmetleri için doğrulanmış ekiplerden anında teklif alın.",
  },
  twitter: {
    card: "summary_large_image",
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
  const [data, settings] = await Promise.all([
    getHomeData(),
    getSiteSettings(),
  ]);

  return (
    <div className="overflow-hidden">
      {/* ─── HERO (v5) ─── */}
      <HeroV5 settings={settings} />

      {/* ─── TRUST BAR (v5) ─── */}
      <TrustBar />

      {/* ─── HEDEF KİTLE (v5) ─── */}
      <AudienceGateway />

      {/* ─── HİZMET KEŞFİ (v5) ─── */}
      <ServiceDiscovery categories={data.parentCategories} />

      {/* ─── NASIL ÇALIŞIR (v5) ─── */}
      <ProductWorkflow />

      {/* ─── PLATFORM ÖZELLİKLERİ (v5) ─── */}
      <PlatformCapabilities />

      {/* ─── KURUMSAL (v5) ─── */}
      <CorporateOperations />

      {/* ─── İSTATİSTİKLER (v5) ─── */}
      <VerifiedMetrics
        profileCount={data.profileCount}
        cityCount={data.cityCount}
        avgRating={data.avgRating}
        categoryCount={data.categoryCount}
      />

      {/* ─── AI TEASER (v5) ─── */}
      <AITeaser />

      {/* ─── NEDEN BİZ (v5) ─── */}
      <WhyMontajimVar />

      {/* ─── BLOG ─── */}
      <BlogSection />

      {/* ─── SSS (v5) ─── */}
      <FAQv5 />

      {/* ─── FİNAL CTA (v5) ─── */}
      <FinalConversionCTA settings={settings} />
    </div>
  );
}





