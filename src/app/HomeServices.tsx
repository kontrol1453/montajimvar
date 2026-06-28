import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  children: { name: string; slug: string }[];
};

export default function HomeServices({ categories }: { categories: Category[] }) {
  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]" id="hizmetler">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Hizmetler
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Profesyonel Montaj Hizmetleri
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            İhtiyacınıza uygun hizmeti seçin, size en yakın uzmanlarla bağlantı kurun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/ara?kategoriler=${cat.slug}`}>
              <div
                className="card p-6 group h-full"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                  {cat.icon ? (
                    <span className="text-xl" dangerouslySetInnerHTML={{ __html: cat.icon }} />
                  ) : (
                    <Wrench size={22} className="text-[var(--color-primary)]" />
                  )}
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors"
                  style={{ color: "var(--color-dark)", fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {cat.name}
                </h3>

                {/* Sub-categories */}
                {cat.children.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {cat.children.slice(0, 4).map((child) => (
                      <span
                        key={child.slug}
                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)]"
                      >
                        {child.name}
                      </span>
                    ))}
                    {cat.children.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded-full text-[var(--color-primary)] font-medium">
                        +{cat.children.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors">
                  İncele
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="text-center mt-10">
            <Link href="/ara" className="btn-secondary">
              Tüm Hizmetleri Gör
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
