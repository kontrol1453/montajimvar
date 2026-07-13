"use client";

import { motion } from "framer-motion";
import { WHY_ITEMS } from "./homepage.constants";

export default function WhySection() {
  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]" id="neden-biz">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Neden Biz
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Neden Montajım Var?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Platformumuzu farklı kılan üç temel değer.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {WHY_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="card p-7 text-center group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${item.color}12` }}
              >
                <item.icon size={26} style={{ color: item.color }} />
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-dark)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
