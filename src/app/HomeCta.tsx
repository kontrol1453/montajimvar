"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeCta() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#060e1a] relative overflow-hidden">
      {/* Background effects */}
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
          Hemen Başlayın
        </div>

        <h2
          className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif", letterSpacing: "-0.02em" }}
        >
          Profesyonel Montajcı mısın?
        </h2>
        <p className="text-lg text-white max-w-xl mx-auto mb-10 leading-relaxed">
          Binlerce müşteriye ulaş, işini büyüt. Ücretsiz kayıt ol, hemen teklif almaya başla.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/kayit"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#00C853] hover:bg-[#00a844] text-white font-bold text-base rounded-2xl transition-all shadow-xl shadow-[#00C853]/25 hover:shadow-[#00C853]/40 hover:-translate-y-0.5"
          >
            Ücretsiz Kaydol
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/ara"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/[0.06] border border-white/[0.1] text-white font-semibold text-base rounded-2xl hover:bg-white/[0.1] transition-all hover:-translate-y-0.5"
          >
            Firmaları Keşfet
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
