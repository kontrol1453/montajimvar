"use client";

import Link from "next/link";
import { ArrowRight, Play, HardHat, Building2, Monitor, Layout, Zap } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] } },
};

const montageTypes = [
  { label: "AVM Montajı", icon: Building2 },
  { label: "Reklam Tabelası", icon: Monitor },
  { label: "Mobilya Kurulumu", icon: Layout },
  { label: "Fuar Standı", icon: Zap },
  { label: "Elektrik Montajı", icon: Zap },
];

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#060e1a] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#0B5FFF]/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#00C853]/8 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0B5FFF]/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        className="relative w-full container-app py-24 md:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + CTAs */}
            <div>
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs text-white mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.5)]" />
                  Profesyonel Montaj Platformu
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white mb-6"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                Türkiye&apos;nin{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5FFF] via-[#3d7fff] to-[#00C853]">
                  Profesyonel
                </span>
                <br />
                Montaj Platformu
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg text-white max-w-lg leading-relaxed mb-10"
              >
                Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturuyoruz.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/is-ver"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00C853] hover:bg-[#00a844] text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-[#00C853]/25 hover:shadow-[#00C853]/40 hover:-translate-y-0.5"
                >
                  <span className="text-2xl">🟢</span>
                  İş Veriyorum
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/kayit"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0B5FFF] hover:bg-[#0948cc] text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-[#0B5FFF]/25 hover:shadow-[#0B5FFF]/40 hover:-translate-y-0.5"
                >
                  <span className="text-2xl">🔵</span>
                  Montaj Ekibiyim
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust line */}
              <motion.div variants={itemVariants} className="mt-10 flex items-center gap-6 text-white text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-[#0a1628] bg-gradient-to-br from-[#0B5FFF]/30 to-[#00C853]/30"
                      />
                    ))}
                  </div>
                  <span className="text-white">320+ aktif montajcı</span>
                </div>
<span className="w-px h-4 bg-white" />
<span className="text-white">81 şehir</span>
<span className="w-px h-4 bg-white" />
<span className="text-white">%97 memnuniyet</span>
              </motion.div>
            </div>

            {/* Right: Montage Type Grid */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="relative">
                {/* Floating grid of montage types */}
                <div className="grid grid-cols-2 gap-4">
                  {montageTypes.map((type, i) => (
                    <div
                      key={type.label}
                      className="group relative bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all hover:-translate-y-1"
                      style={{
                        animation: `fade-in-up 0.6s ease-out forwards`,
                        animationDelay: `${0.5 + i * 0.1}s`,
                        opacity: 0,
                      }}
                    >
                      <type.icon size={24} className="text-white group-hover:text-[#0B5FFF] transition-colors mb-3" />
                      <p className="text-white text-sm font-medium">{type.label}</p>

                      {/* Hover glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0B5FFF]/0 via-transparent to-[#00C853]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  ))}
                </div>

                {/* Center play badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Play size={24} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-8 rounded-full border border-white/[0.03] -z-10" />
                <div className="absolute -inset-16 rounded-full border border-white/[0.02] -z-10" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-surface-secondary)] to-transparent" />
      </motion.div>
    </section>
  );
}
