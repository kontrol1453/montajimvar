"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CTA_DATA } from "./homepage.constants";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="py-24 section-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0B5FFF]/5 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
      <motion.div
        className="relative container-app text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-sm text-white mb-8">
          <Sparkles size={14} className="text-[#00C853]" />
          {CTA_DATA.badge}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
          {CTA_DATA.title}
        </h2>
        <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
          {CTA_DATA.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {CTA_DATA.actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={
                action.primary
                  ? "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-sm font-semibold text-[var(--color-dark)] hover:bg-white/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-white/10"
                  : "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-sm font-semibold text-white hover:bg-white/[0.06] transition-all hover:-translate-y-0.5"
              }
            >
              {action.label}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
