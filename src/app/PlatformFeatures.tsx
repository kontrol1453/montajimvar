"use client";

import { FEATURES_GRID } from "./homepage.constants";
import { motion } from "framer-motion";

export default function PlatformFeatures() {
  return (
    <section className="py-24 bg-white" id="ozellikler">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Platform Özellikleri
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            İhtiyacın Olan Her Şey Tek Platformda
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Montaj sürecinin her aşaması için özel olarak tasarlanmış araçlar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {FEATURES_GRID.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="card p-6 group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ backgroundColor: `${f.color}12` }}
              >
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-dark)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
