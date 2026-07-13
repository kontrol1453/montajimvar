"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUDIENCE_CARDS } from "./homepage.constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function AudienceSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Kimler İçin
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Herkes İçin Montaj Çözümleri
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            İster evinizdeki mobilya montajı, ister kurumsal projeleriniz olsun.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {AUDIENCE_CARDS.map((card) => (
            <motion.div key={card.title} variants={cardVariants}>
              <Link
                href={card.href}
                className="group block card p-8 h-full"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${card.color}12` }}
                >
                  <card.icon
                    size={28}
                    style={{ color: card.color }}
                  />
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    fontFamily: "'Manrope', system-ui, sans-serif",
                    color: "var(--color-dark)",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-6">
                  {card.desc}
                </p>
                <div
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
                  style={{ color: card.color }}
                >
                  {card.title === "Bireysel" && "İş Oluştur"}
                  {card.title === "Kurumsal" && "Çözümleri İncele"}
                  {card.title === "Montaj Ekibi" && "Hemen Kaydol"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
