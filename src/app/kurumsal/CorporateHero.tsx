"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Shield, TrendingUp, Clock, Users, MapPin, Headphones } from "lucide-react";

const stats = [
  { value: "81", label: "İl", suffix: "" },
  { value: "500+", label: "Usta", suffix: "" },
  { value: "2.500+", label: "Tamamlanan Proje", suffix: "" },
  { value: "4.8", label: "Ortalama Puan", suffix: "" },
];

export default function CorporateHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center section-dark overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#0B5FFF]/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00C853]/10 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
      </div>

      <div className="container-app relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs text-white font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
              Kurumsal Çözümler
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Montaj Operasyonlarınızı{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5FFF] to-[#00C853]">
              Profesyonelce Yönetin
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
          >
            Zincir mağaza, AVM, fuar ve endüstriyel projeleriniz için Türkiye geneli
            doğrulanmış montaj ekibi. Tek noktadan yönetim, SLA garantili hizmet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/is-ver"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-sm font-semibold text-[var(--color-dark)] hover:bg-white/90 transition-all hover:-translate-y-0.5"
            >
              Hemen İş Ver
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/ara"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.15] text-sm font-semibold text-white hover:bg-white/5 transition-all"
            >
              Usta Bul
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-white/60 mt-1">
                  {s.label}{s.suffix}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
