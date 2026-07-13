"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { motion } from "framer-motion";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  children: { name: string; slug: string }[];
};

export default function HomeServices({ categories }: { categories: Category[] }) {
  const visible = categories.slice(0, 8);

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
          {visible.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/ara?kategoriler=${cat.slug}`}>
                <div className="card p-6 group h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/10 transition-all">
                    {cat.icon ? (
                      <span className="text-xl" dangerouslySetInnerHTML={{ __html: cat.icon }} />
                    ) : (
                      <Wrench size={22} className="text-[var(--color-primary)]" />
                    )}
                  </div>

                  <h3
                    className="font-bold text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: "var(--color-dark)", fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    {cat.name}
                  </h3>

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

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors">
                    İncele
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {categories.length > 0 && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/ara"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border-default)] text-sm font-semibold text-[var(--color-dark)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all bg-white hover:shadow-sm hover:-translate-y-0.5"
            >
              Tüm Hizmetleri Gör
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
