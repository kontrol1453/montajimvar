import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://montajimvar.com";

  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/ara`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/yardim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/auth/giris`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/auth/kayit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  // Category pages
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/ara?kategoriler=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Company profile routes
  const profiles = await prisma.profile.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const profileRoutes = profiles.map((profile) => ({
    url: `${baseUrl}/firma/${profile.id}`,
    lastModified: profile.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...profileRoutes];
}
