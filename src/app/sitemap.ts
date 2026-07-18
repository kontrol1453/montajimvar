import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

let cache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 3600_000; // 1 hour

export default async function sitemap() {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://montajimvar.xyz";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/ara`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/yardim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/gizlilik`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/kullanim-kosullari`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/auth/giris`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/auth/kayit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const [categories, profiles, blogPosts, cityPages] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.profile.findMany({ select: { id: true, updatedAt: true }, orderBy: { updatedAt: "desc" } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.cityServicePage.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/ara?kategoriler=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const profileRoutes = profiles.map((profile) => ({
    url: `${baseUrl}/firma/${profile.id}`,
    lastModified: profile.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const cityRoutes = cityPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const data = [...staticRoutes, ...categoryRoutes, ...profileRoutes, ...blogRoutes, ...cityRoutes];
  cache = { data, timestamp: now };
  return data;
}
