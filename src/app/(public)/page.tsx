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

  const vis = settings.visibility;
  const d = settings.design;

  return (
    <div
      className="overflow-hidden"
      style={{
        fontFamily: d?.fontFamily || "Inter, system-ui, sans-serif",
        fontSize: d?.baseFontSize || "16px",
        color: d?.textColor || "#18181b",
        backgroundColor: d?.backgroundColor || "#ffffff",
        ["--site-heading-font" as string]: d?.headingFont || "Inter, system-ui, sans-serif",
        ["--site-heading-color" as string]: d?.headingColor || "#09090b",
        ["--site-radius" as string]: d?.borderRadius || "12px",
        ["--site-section-gap" as string]: d?.sectionGap || "4rem",
        ["--site-primary" as string]: d?.primaryColor || "#0B5FFF",
        ["--site-section-bg" as string]: d?.sectionBgColor || "#fafafa",
        ["--site-card-bg" as string]: d?.cardBgColor || "#ffffff",
        ["--site-accent" as string]: d?.accentColor || "#f59e0b",
        ["--site-cta-bg" as string]: d?.ctaBgColor || "#0B5FFF",
        ["--site-cta-text" as string]: d?.ctaTextColor || "#ffffff",
      }}
    >
      {vis?.hero !== false && <HeroV5 settings={settings} />}
      {vis?.trustBar !== false && <TrustBar />}
      {vis?.audience !== false && <AudienceGateway />}
      {vis?.services !== false && <ServiceDiscovery categories={data.parentCategories} />}
      {vis?.workflow !== false && <ProductWorkflow />}
      {vis?.capabilities !== false && <PlatformCapabilities />}
      {vis?.corporate !== false && <CorporateOperations />}
      {vis?.metrics !== false && (
        <VerifiedMetrics
          profileCount={data.profileCount}
          cityCount={data.cityCount}
          avgRating={data.avgRating}
          categoryCount={data.categoryCount}
        />
      )}
      {vis?.aiTeaser !== false && <AITeaser />}
      {vis?.whyUs !== false && <WhyMontajimVar />}
      {vis?.blog !== false && <BlogSection />}
      {vis?.faq !== false && <FAQv5 />}
      {vis?.finalCta !== false && <FinalConversionCTA settings={settings} />}
    </div>
  );
}





