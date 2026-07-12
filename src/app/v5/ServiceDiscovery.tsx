import Link from "next/link";
import {
  Boxes,
  Building2,
  Hammer,
  PaintBucket,
  Sofa,
  Truck,
  Wrench,
  Smartphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SERVICE_CARDS } from "./_lib/v5.constants";

export type ServiceRootCategory = {
  id: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  href: string;
  tags: string[];
  accent: "primary" | "accent" | "amber" | "violet";
};

const DB_ICON_MAP: Record<string, LucideIcon> = {
  mobilya: Sofa,
  tadilat: PaintBucket,
  elektrik: Wrench,
  "beyaz-esya": Boxes,
  beyaz_eşya: Boxes,
  tasinma: Truck,
  tasınma: Truck,
  kurumsal: Building2,
  marangoz: Hammer,
  "akill-ev": Smartphone,
  akıllı_ev: Smartphone,
  teknoloji: Smartphone,
};

const ACCENT_CLASS: Record<ServiceRootCategory["accent"], string> = {
  primary:
    "from-primary/8 to-primary/2 ring-primary/15 hover:ring-primary/40",
  accent:
    "from-accent/8 to-accent/2 ring-accent/15 hover:ring-accent/40",
  amber: "from-amber-500/10 to-amber-500/2 ring-amber-500/20 hover:ring-amber-500/40",
  violet:
    "from-violet-500/8 to-violet-500/2 ring-violet-500/15 hover:ring-violet-500/40",
};

const ACCENTS: ServiceRootCategory["accent"][] = [
  "primary",
  "accent",
  "amber",
  "violet",
  "primary",
  "accent",
  "amber",
  "violet",
];

export type ServiceDiscoveryCategoryLite = {
  id?: string | number | null;
  slug: string;
  title?: string | null;
};

interface ServiceDiscoveryProps {
  categories?: Array<{
    id: number | string;
    name: string;
    slug: string;
    metaDesc?: string | null;
    children?: Array<{ id: number | string; name: string; slug: string }>;
  }>;
}

export default function ServiceDiscovery({
  categories: dbCategories = [],
}: ServiceDiscoveryProps) {
  const merged = mergeWithDb(SERVICE_CARDS, dbCategories);

  return (
    <section
      aria-labelledby="services-headline"
      id="services"
      className="bg-surface"
    >
      <div className="container-app py-16 md:py-22">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="section-label">
              <Sparkles className="h-3.5 w-3.5" /> Hizmetler
            </span>
            <h2 id="services-headline" className="heading-lg mt-3">
              Tek bir yerden, 8 ana hizmet kategorisi.
            </h2>
            <p className="mt-3 text-text-secondary">
              Evden kurumsala, beyaz eşyadan akıllı ev kurulumuna kadar ihtiyacınızı
              tanımlayın — geri kalanını platform halletsin.
            </p>
          </div>
          <Link
            href="/ara"
            className="btn-secondary"
            aria-label="Tüm hizmetleri keşfet"
          >
            Tümünü Gör <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {merged.slice(0, 8).map((item, idx) => {
            const accent = ACCENTS[idx % ACCENTS.length];
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-label={item.title}
                className={`group flex h-full flex-col justify-between rounded-card bg-gradient-to-br ring-1 p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated ${ACCENT_CLASS[accent]}`}
              >
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-surface shadow-card">
                    <item.Icon className="h-5 w-5 text-text-primary" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-surface/80 px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-tertiary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>

        {dbCategories.length > 0 && (
          <div className="mt-10 rounded-card border border-border bg-app/40 p-5 md:p-7">
            <div className="text-sm font-semibold text-text-primary">
              Hizmet kategorileri veritabanından
            </div>
            <p className="mt-1 text-xs text-text-tertiary">
              Site genelinde kullanılan, güncel kategoriler
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {dbCategories.slice(0, 24).map((c) => (
                <Link
                  key={c.id}
                  href={`/ara?kategori=${c.slug}`}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function mergeWithDb(
  base: typeof SERVICE_CARDS,
  dbCategories: NonNullable<ServiceDiscoveryProps["categories"]>
) {
  if (dbCategories.length === 0) return base;

  const extras = dbCategories.map((c) => {
    const slugKey = Object.keys(DB_ICON_MAP).find(
      (k) => c.slug.toLowerCase() === k.toLowerCase()
    );
    return {
      id: String(c.id ?? c.slug),
      title: c.name,
      description:
        c.metaDesc ||
        "Bu kategorideki ekiplerle tanışmak için linke tıklayın.",
      Icon: slugKey ? DB_ICON_MAP[slugKey] : Wrench,
      href: `/ara?kategori=${c.slug}`,
      tags: c.children?.map((ch) => ch.name).slice(0, 3) ?? [],
    };
  });

  const titles = new Set(base.map((b) => b.title.toLowerCase()));
  return [...base, ...extras.filter((e) => !titles.has(e.title.toLowerCase()))];
}
