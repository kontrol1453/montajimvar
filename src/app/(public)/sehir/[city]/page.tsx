import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { sanitizeHTML } from "@/lib/sanitize";

export async function generateMetadata({ params }: { params: { city: string } }) {
  const cityName = decodeURIComponent(params.city);
  const page = await prisma.cityServicePage.findFirst({
    where: { city: cityName },
    select: { metaTitle: true, metaDesc: true },
    orderBy: { createdAt: "desc" },
  });
  const title = page?.metaTitle ?? `${cityName} Montaj Hizmetleri - Montajım Var`;
  const description = page?.metaDesc ?? `${cityName} bölgesinde uzman montaj ustaları ve hizmetleri. Mobilya, klima, tabela, AVM, fuar standı ve elektrik montajı için güvenli ve hızlı çözümler.`;
  return { title, description, openGraph: { title, description } } as Metadata;
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityName = decodeURIComponent(params.city);
  const pages = await prisma.cityServicePage.findMany({
    where: { city: cityName },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-app py-12">
      <h1 className="heading-xl text-center mb-8">{cityName} Montaj Hizmetleri</h1>
      {pages.map((p) => (
        <section key={p.id} className="mb-12">
          <h2 className="heading-lg mb-3">{p.title}</h2>
          {p.content && (
            <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHTML(p.content) }} />
          )}
        </section>
      ))}
    </div>
  );
}
