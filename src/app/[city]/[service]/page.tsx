import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ city: string; service: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, service } = await params;
  const page = await prisma.cityServicePage.findUnique({
    where: { slug: `${city}/${service}` },
    select: { metaTitle: true, metaDesc: true, title: true },
  });
  return {
    title: page?.metaTitle || `${page?.title || city} - Montajım Var`,
    description: page?.metaDesc || undefined,
  };
}

export default async function CityServicePage({ params }: Props) {
  const { city, service } = await params;

  const page = await prisma.cityServicePage.findUnique({
    where: { slug: `${city}/${service}` },
  });

  if (!page) notFound();

  // Find matching profiles in this city
  const profiles = await prisma.profile.findMany({
    where: {
      city: { equals: city, mode: "insensitive" },
      categories: {
        some: {
          category: { slug: service },
        },
      },
    },
    include: {
      category: { select: { name: true } },
      categories: { include: { category: { select: { name: true } } } },
    },
    orderBy: [{ isVerified: "desc" }, { ratingAvg: "desc" }],
    take: 20,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-sm text-sub-text mb-4">
        <Link href="/" className="hover:text-montaj">Anasayfa</Link>
        <span className="mx-2">/</span>
        <Link href={`/ara?sehir=${city}`} className="hover:text-montaj">{city}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{page.service}</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">{page.title}</h1>

      <div
        className="prose prose-invert max-w-none mb-8 [&_p]:text-gray-200 [&_h2]:text-white [&_h3]:text-white"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

      {profiles.length > 0 && (
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {city} {page.service} Hizmeti Veren Firmalar
          </h2>
          <div className="space-y-3">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/firma/${profile.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-bg border border-dark-border hover:border-montaj/50 transition"
              >
                <div>
                  <p className="text-white font-medium">{profile.companyName}</p>
                  <p className="text-xs text-sub-text">
                    {profile.category.name}
                    {profile.categories.length > 1 && ` +${profile.categories.length - 1}`}
                  </p>
                </div>
                {profile.ratingAvg > 0 && (
                  <span className="text-amber-400 text-sm">⭐ {profile.ratingAvg.toFixed(1)}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
