import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TURKISH_CITIES } from "@/lib/utils";
import type { Metadata } from "next";
import Badge from "@/components/ui/Badge";

const PAGE_SIZE = 12;

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchParams): Promise<Metadata> {
  const raw = await searchParams;
  const params = raw as Record<string, string | string[] | undefined>;
  const slugRaw = params.kategoriler;
  const slug = Array.isArray(slugRaw) ? slugRaw[0] : slugRaw;
  const sehir = typeof params.sehir === "string" ? params.sehir : "";
  const label = slug?.split(",")[0]?.replace(/-/g, " ");
  const title = label
    ? `${label} - Firma Ara | Montajım Var`
    : sehir
      ? `${sehir} - Firma Ara | Montajım Var`
      : "Firma Ara | Montajım Var";
  return {
    title,
    description: `Türkiye genelinde montaj firmaları bulun. ${sehir ? `${sehir} ` : ""}${label ? `${label} ` : ""}hizmeti veren güvenilir firmalar.`,
  };
}

function buildQuery(params: Record<string, string | string[] | undefined>, changes: Record<string, string | undefined>): string {
  const merged = { ...params, ...changes };
  const entries: [string, string][] = [];
  for (const [key, val] of Object.entries(merged)) {
    if (val === undefined || val === "") continue;
    if (Array.isArray(val)) {
      val.forEach((v) => entries.push([key, v]));
    } else {
      entries.push([key, val]);
    }
  }
  const qs = new URLSearchParams(entries).toString();
  return qs ? `/ara?${qs}` : "/ara";
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const raw = await searchParams;
  const params = raw as Record<string, string | string[] | undefined>;
  const kategoriRaw = params.kategoriler;
  const kategoriSlugs = Array.isArray(kategoriRaw) ? kategoriRaw : (kategoriRaw ? kategoriRaw.split(",").filter(Boolean) : []);
  const sehir = typeof params.sehir === "string" ? params.sehir : "";
  const q = typeof params.q === "string" ? params.q : "";
  const siralama = typeof params.siralama === "string" ? params.siralama : "en_yeni";
  const sayfa = Math.max(1, Number(typeof params.sayfa === "string" ? params.sayfa : "") || 1);
  const minPuanRaw = typeof params.minPuan === "string" ? params.minPuan : "";
  const minPuan = minPuanRaw ? Number(minPuanRaw) : 0;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Record<string, unknown> = {};

  if (kategoriSlugs.length > 0) {
    const catIds = categories
      .filter((c) => kategoriSlugs.includes(c.slug))
      .map((c) => c.id);
    if (catIds.length > 0) {
      where.categories = {
        some: { categoryId: { in: catIds } },
      };
    }
  }

  if (sehir) {
    where.city = sehir;
  }

  if (q) {
    where.OR = [
      { companyName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (minPuan > 0) {
    where.ratingAvg = { gte: minPuan };
  }

  // Sorting
  let orderBy: Record<string, string>[] = [{ isFeatured: "desc" }, { createdAt: "desc" }];
  if (siralama === "en_eski") orderBy = [{ isFeatured: "desc" }, { createdAt: "asc" }];
  else if (siralama === "puana_gore") orderBy = [{ isFeatured: "desc" }, { ratingAvg: "desc" }, { createdAt: "desc" }];

  const [profiles, totalCount] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy,
      skip: (sayfa - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        categories: {
          include: { category: true },
        },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    }),
    prisma.profile.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const selectedCategoryNames = kategoriSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => c!.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {selectedCategoryNames.length === 1
            ? selectedCategoryNames[0]
            : "Tüm Firmalar"}
        </h1>
        <p className="text-muted-text mt-1">
          {totalCount} firma bulundu
          {sehir && ` - ${sehir}`}
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-8">
        <form className="space-y-4">
          {/* Üst satır: arama, sıralama, şehir */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                name="q"
                defaultValue={q}
                placeholder="Firma adı veya açıklama ile ara..."
                className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white placeholder-gray-500"
              />
            </div>

            <select
              name="sehir"
              defaultValue={sehir}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white"
            >
              <option value="">Tüm Şehirler</option>
              {TURKISH_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              name="minPuan"
              defaultValue={minPuanRaw}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white"
            >
              <option value="">Tüm Puanlar</option>
              <option value="4">★ 4+</option>
              <option value="3">★ 3+</option>
              <option value="2">★ 2+</option>
            </select>

            <select
              name="siralama"
              defaultValue={siralama}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white"
            >
              <option value="en_yeni">En Yeni</option>
              <option value="en_eski">En Eski</option>
              <option value="puana_gore">Puana Göre</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
            >
              Filtrele
            </button>
          </div>

          {/* Kategori filtreleri (checkbox) */}
          <div>
            <p className="text-xs text-sub-text mb-2">
              Kategoriler <span className="text-gray-600">(birden fazla seçebilirsiniz)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = kategoriSlugs.includes(cat.slug);
                return (
                  <label
                    key={cat.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition ${
                      selected
                        ? "bg-montaj/20 border-montaj text-montaj"
                        : "bg-dark-bg border-dark-border text-gray-300 hover:border-montaj/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="kategoriler"
                      value={cat.slug}
                      defaultChecked={selected}
                      className="sr-only"
                      onChange={() => {}} // form submits via button
                    />
                    {cat.icon && <span>{cat.icon}</span>}
                    <span>{cat.name}</span>
                    {selected && <span className="text-montaj text-xs">✓</span>}
                  </label>
                );
              })}
            </div>
          </div>
        </form>

        {/* Active filters */}
        {(kategoriSlugs.length > 0 || sehir || q || minPuan > 0) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-dark-border">
            <span className="text-xs text-sub-text">Aktif filtreler:</span>
            {kategoriSlugs.map((slug) => {
              const cat = categories.find((c) => c.slug === slug);
              return (
                <Link
                  key={slug}
                  href={buildQuery(
                    { kategoriler: kategoriSlugs.filter((s) => s !== slug).join(",") || undefined, sehir, q, minPuan: minPuanRaw || undefined, siralama, sayfa: undefined },
                    {}
                  )}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-montaj/20 text-montaj rounded-full text-xs hover:bg-montaj/30 transition"
                >
                  {cat?.name || slug} ×
                </Link>
              );
            })}
            {sehir && (
              <Link
                href={buildQuery({ kategoriler: kategoriSlugs.join(",") || undefined, q, minPuan: minPuanRaw || undefined, siralama, sayfa: undefined }, { sehir: undefined })}
                className="inline-flex items-center gap-1 px-2 py-1 bg-montaj/20 text-montaj rounded-full text-xs hover:bg-montaj/30 transition"
              >
                {sehir} ×
              </Link>
            )}
            {minPuan > 0 && (
              <Link
                href={buildQuery({ kategoriler: kategoriSlugs.join(",") || undefined, sehir, q, siralama, sayfa: undefined }, { minPuan: undefined })}
                className="inline-flex items-center gap-1 px-2 py-1 bg-montaj/20 text-montaj rounded-full text-xs hover:bg-montaj/30 transition"
              >
                ★ {minPuan}+ ×
              </Link>
            )}
            <Link
              href="/ara"
              className="text-xs text-sub-text hover:text-white underline ml-1"
            >
              Tümünü Temizle
            </Link>
          </div>
        )}
      </div>

      {/* Sonuçlar */}
      {profiles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => {
              const pcats = (profile as any).categories || [];
              return (
                <Link
                  key={profile.id}
                  href={`/firma/${profile.id}`}
                  className="block bg-dark-card rounded-xl border border-dark-border hover:border-montaj/50 transition p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-montaj/20 rounded-lg flex items-center justify-center text-xl font-bold text-montaj">
                      {profile.companyName[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex items-center gap-2">
                      {profile.isVerified && (
                        <Badge variant="success">Onaylı</Badge>
                      )}
                      {profile.ratingAvg > 0 && (
                        <span className="text-xs text-yellow-400">
                          ★ {profile.ratingAvg.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-1 line-clamp-1">
                    {profile.companyName}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-sub-text mb-2">
                    <span>{profile.city}</span>
                    <span>·</span>
                    <div className="flex flex-wrap gap-1">
                      {pcats.slice(0, 3).map((pc: any) => (
                        <Badge key={pc.categoryId} variant="default">{pc.category.name}</Badge>
                      ))}
                      {pcats.length > 3 && (
                        <span className="text-xs text-sub-text self-center">+{pcats.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-text line-clamp-2">
                    {profile.description || "Henüz açıklama eklenmemiş."}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {sayfa > 1 && (
                <Link
                  href={buildQuery(
                    { kategoriler: kategoriSlugs.join(",") || undefined, sehir, q, minPuan: minPuanRaw || undefined, siralama, sayfa: String(sayfa - 1) },
                    {}
                  )}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white hover:border-montaj/50 transition"
                >
                  ← Önceki
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (sayfa <= 4) {
                  pageNum = i + 1;
                } else if (sayfa >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = sayfa - 3 + i;
                }
                return (
                  <Link
                    key={pageNum}
                    href={buildQuery(
                      { kategoriler: kategoriSlugs.join(",") || undefined, sehir, q, minPuan: minPuanRaw || undefined, siralama, sayfa: String(pageNum) },
                      {}
                    )}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition ${
                      pageNum === sayfa
                        ? "bg-montaj text-white"
                        : "bg-dark-card border border-dark-border text-sub-text hover:border-montaj/50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              {sayfa < totalPages && (
                <Link
                  href={buildQuery(
                    { kategoriler: kategoriSlugs.join(",") || undefined, sehir, q, minPuan: minPuanRaw || undefined, siralama, sayfa: String(sayfa + 1) },
                    {}
                  )}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white hover:border-montaj/50 transition"
                >
                  Sonraki →
                </Link>
              )}
            </div>
          )}
        </>
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
