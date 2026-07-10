import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Camera } from "lucide-react";
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

/* ================================================================
   BLOG
   ================================================================ */
async function BlogSection() {
  let posts: { title: string; slug: string; excerpt: string | null; coverImage: string | null }[] = [];

  try {
    const result = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true, slug: true, excerpt: true, coverImage: true },
    });
    posts = result;
  } catch {
    // Blog table may not exist yet
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Blog
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Montaj Sektöründen Haberler
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Profesyonel montaj ipuçları, sektör haberleri ve rehberler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card overflow-hidden group">
                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <Camera size={32} className="text-[var(--color-text-tertiary)]" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[var(--color-dark)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length >= 3 && (
          <div className="text-center mt-10">
            <Link href="/blog" className="btn-secondary">
              Tüm Yazılar
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}



