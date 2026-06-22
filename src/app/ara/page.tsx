import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TURKISH_CITIES } from "@/lib/utils";
import type { Metadata } from "next";
import SearchViewToggle from "@/components/SearchViewToggle";

const PAGE_SIZE = 12;

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const RATING_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "4", label: "4+" },
  { value: "3", label: "3+" },
  { value: "2", label: "2+" },
] as const;

export async function generateMetadata({ searchParams }: SearchParams): Promise<Metadata> {
  try {
    const sp = await searchParams;
    const kategoriler = sp.kategoriler;
    const slug = typeof kategoriler === "string" ? kategoriler : Array.isArray(kategoriler) ? kategoriler[0] : undefined;
    const sehir = typeof sp.sehir === "string" ? sp.sehir : "";
    const label = slug?.split(",")[0]?.replace(/-/g, " ");
    const title = label
      ? `${label} - Firma Ara | Montajım Var`
      : sehir
        ? `${sehir} - Firma Ara | Montajım Var`
        : "Firma Ara | Montajım Var";
    return {
      title,
      description: `Türkiye genelinde montaj firmaları bulun.${sehir ? ` ${sehir}` : ""}${label ? ` ${label}` : ""} hizmeti veren güvenilir firmalar.`,
    };
  } catch {
    return { title: "Firma Ara | Montajım Var" };
  }
}

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await props.searchParams;
  const sehir = typeof sp.sehir === "string" ? sp.sehir : "";
  const q = typeof sp.q === "string" ? sp.q : "";
  const siralama = typeof sp.siralama === "string" ? sp.siralama : "en_yeni";
  const sayfa = Math.max(1, Number(sp.sayfa) || 1);
  const minPuan = typeof sp.minPuan === "string" ? sp.minPuan : "";

  const kategoriRaw = sp.kategoriler;
  const selectedSlugs = typeof kategoriRaw === "string" ? kategoriRaw.split(",") : Array.isArray(kategoriRaw) ? kategoriRaw : [];

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const where: Record<string, unknown> = {};
  if (sehir) where.city = sehir;
  if (q) {
    where.OR = [
      { companyName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (selectedSlugs.length > 0) {
    where.categories = {
      some: { category: { slug: { in: selectedSlugs } } },
    };
  }
  if (minPuan) {
    where.ratingAvg = { gte: Number(minPuan) };
  }

  const orderBy: Record<string, string> = { isFeatured: "desc" };
  let secondary: Record<string, string>;
  if (siralama === "en_eski") secondary = { createdAt: "asc" };
  else if (siralama === "puana_gore") secondary = { ratingAvg: "desc" };
  else secondary = { createdAt: "desc" };

  const [profiles, totalCount] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy: [{ premiumUntil: { sort: "desc", nulls: "last" } }, orderBy, secondary],
      skip: (sayfa - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        categories: { include: { category: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
        subscription: { select: { badgeLabel: true, badgeColor: true } },
      },
    }),
    prisma.profile.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const serialized = profiles.map((p) => ({
    id: p.id,
    companyName: p.companyName,
    description: p.description,
    city: p.city,
    category: { name: p.category.name, slug: p.category.slug },
    categories: p.categories.map((pc) => ({ category: { name: pc.category.name, slug: pc.category.slug } })),
    user: { id: p.user.id, name: p.user.name, email: p.user.email, phone: p.user.phone },
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
    ratingAvg: p.ratingAvg,
    reviewCount: p.reviewCount,
    whatsapp: p.whatsapp,
    premiumUntil: p.premiumUntil?.toISOString() ?? null,
    subscription: p.subscription ? { badgeLabel: p.subscription.badgeLabel, badgeColor: p.subscription.badgeColor } : null,
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Tüm Firmalar</h1>

      <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-8">
        <form className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="q" defaultValue={q} placeholder="Firma adı veya açıklama ile ara..."
              className="flex-1 px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-gray-500"
            />
            <select name="sehir" defaultValue={sehir}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
            >
              <option value="">Tüm Şehirler</option>
              {TURKISH_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select name="minPuan" defaultValue={minPuan}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select name="siralama" defaultValue={siralama}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
            >
              <option value="en_yeni">En Yeni</option>
              <option value="en_eski">En Eski</option>
              <option value="puana_gore">Puana Göre</option>
            </select>
            <button type="submit" className="px-6 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium">
              Filtrele
            </button>
          </div>

          <div>
            <p className="text-xs text-sub-text mb-2">Kategoriler</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const checked = selectedSlugs.includes(cat.slug);
                return (
                  <label key={cat.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition ${
                      checked
                        ? "bg-montaj/20 border-montaj text-white"
                        : "border-dark-border bg-dark-bg text-gray-300 hover:border-montaj/50"
                    }`}
                  >
                    <input type="checkbox" name="kategoriler" value={cat.slug} defaultChecked={checked} className="sr-only" />
                    {cat.icon && <span>{cat.icon}</span>}
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className="px-4 py-1.5 bg-montaj text-white rounded-lg text-sm hover:bg-montaj-dark transition">
              Filtrele
            </button>
            <Link href="/ara" className="px-4 py-1.5 border border-dark-border rounded-lg text-sm text-sub-text hover:text-white transition">
              Filtreleri Temizle
            </Link>
          </div>
        </form>
      </div>

      <SearchViewToggle
        profiles={serialized}
        totalCount={totalCount}
        sehir={sehir}
        q={q}
        siralama={siralama}
        sayfa={sayfa}
        totalPages={totalPages}
        sp={sp}
      />
    </div>
  );
}
