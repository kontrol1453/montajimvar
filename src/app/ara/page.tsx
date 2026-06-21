import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TURKISH_CITIES } from "@/lib/utils";
import type { Metadata } from "next";
import Badge from "@/components/ui/Badge";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchParams): Promise<Metadata> {
  const params = await searchParams;
  const kategoriSlug = params.kategori;
  const sehir = params.sehir;
  const title = kategoriSlug
    ? `${kategoriSlug.replace(/-/g, " ")} - Firma Ara | Montajım Var`
    : sehir
      ? `${sehir} - Firma Ara | Montajım Var`
      : "Firma Ara | Montajım Var";
  return {
    title,
    description: `Türkiye genelinde montaj firmaları bulun. ${sehir ? `${sehir} ` : ""}${kategoriSlug ? `${kategoriSlug.replace(/-/g, " ")} ` : ""}hizmeti veren güvenilir firmalar.`,
  };
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const kategoriSlug = params.kategori;
  const sehir = params.sehir;
  const q = params.q;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Record<string, unknown> = {};

  if (kategoriSlug) {
    const cat = categories.find((c) => c.slug === kategoriSlug);
    if (cat) {
      where.categories = {
        some: { categoryId: cat.id },
      };
    }
  }

  if (sehir) {
    where.city = sehir;
  }

  if (q) {
    where.OR = [
      { companyName: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const profiles = await prisma.profile.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  const selectedCategory = categories.find((c) => c.slug === kategoriSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {selectedCategory ? selectedCategory.name : "Tüm Firmalar"}
        </h1>
        <p className="text-muted-text mt-1">
          {profiles.length} firma bulundu
          {sehir && ` - ${sehir}`}
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-8">
        <form className="flex flex-col sm:flex-row gap-3">
          {/* Arama */}
          <div className="flex-1">
            <input
              name="q"
              defaultValue={q}
              placeholder="Firma adı veya açıklama ile ara..."
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white placeholder-gray-500"
            />
          </div>

          {/* Kategori */}
          <select
            name="kategori"
            defaultValue={kategoriSlug || ""}
            className="px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Şehir */}
          <select
            name="sehir"
            defaultValue={sehir || ""}
            className="px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white"
          >
            <option value="">Tüm Şehirler</option>
            {TURKISH_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
          >
            Filtrele
          </button>
        </form>

        {/* Active filters */}
        {(kategoriSlug || sehir || q) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {kategoriSlug && (
              <Link
                href={{ pathname: "/ara", query: { sehir, q } }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {selectedCategory?.name || kategoriSlug} ×
              </Link>
            )}
            {sehir && (
              <Link
                href={{ pathname: "/ara", query: { kategori: kategoriSlug, q } }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-montaj/20 text-montaj rounded-full text-xs"
              >
                {sehir} ×
              </Link>
            )}
            <Link
              href="/ara"
              className="text-xs text-sub-text hover:text-muted-text underline"
            >
              Tüm filtreleri temizle
            </Link>
          </div>
        )}
      </div>

      {/* Sonuçlar */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/firma/${profile.id}`}
              className="block bg-dark-card rounded-xl border border-dark-border hover:border-montaj/50 transition p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-montaj/20 rounded-lg flex items-center justify-center text-xl font-bold text-montaj">
                  {profile.companyName[0]?.toUpperCase() || "?"}
                </div>
                {profile.isVerified && (
                  <Badge variant="success">Onaylı</Badge>
                )}
              </div>

              <h3 className="font-semibold text-white mb-1 line-clamp-1">
                {profile.companyName}
              </h3>

              <div className="flex items-center gap-2 text-sm text-sub-text mb-2">
                <span>{profile.city}</span>
                <span>·</span>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="default">{profile.category.name}</Badge>
                  {(profile as any).categories
                    ?.filter((pc: any) => pc.category.name !== profile.category.name)
                    .slice(0, 2)
                    .map((pc: any) => (
                      <Badge key={pc.category.name} variant="default">{pc.category.name}</Badge>
                    ))}
                  {((profile as any).categories?.length ?? 0) > 3 && (
                    <span className="text-xs text-sub-text self-center">
                      +{((profile as any).categories?.length - 1)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-text line-clamp-2">
                {profile.description || "Henüz açıklama eklenmemiş."}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Sonuç bulunamadı
          </h3>
          <p className="text-muted-text">
            Filtreleri değiştirip tekrar deneyin veya{" "}
            <Link href="/ara" className="text-montaj hover:underline">
              tüm firmaları görüntüleyin
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
