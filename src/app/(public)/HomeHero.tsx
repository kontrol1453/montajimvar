"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  User,
  Building2,
  HardHat,
  Shield,
  CheckCircle,
} from "lucide-react";
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] },
  },
};

export default function HomeHero() {
  return (
    <section className="hero-section relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#060e1a] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
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
            {/* Left */}
            <div>
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs text-white mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.5)]" />
                  Profesyonel Montaj Platformu
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white mb-6"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                Montaj İşlerinizi{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5FFF] via-[#3d7fff] to-[#00C853]">
                  Tek Platformdan
                </span>
                <br />
                Yönetin
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-white/85 max-w-lg leading-relaxed mb-10"
              >
                İhtiyacınızı oluşturun, doğrulanmış montaj ekiplerinden teklif
                alın, süreci takip edin ve işi güvenle tamamlayın.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/is-ver"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00C853] hover:bg-[#00a844] text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-[#00C853]/25 hover:shadow-[#00C853]/40 hover:-translate-y-0.5"
                >
                  <Briefcase size={20} />
                  İş Oluştur
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="/ara"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl transition-all border border-white/20 hover:border-white/30"
                >
                  Montajcı Bul
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <Link
                  href="/is-ver"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0B5FFF]/20 flex items-center justify-center">
                    <User size={18} className="text-[#0B5FFF]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Bireysel</p>
                    <p className="text-white/70 text-xs">
                      Montaj ihtiyacını oluştur
                    </p>
                  </div>
                </Link>
                <Link
                  href="/kurumsal"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00C853]/20 flex items-center justify-center">
                    <Building2 size={18} className="text-[#00C853]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Kurumsal
                    </p>
                    <p className="text-white/70 text-xs">
                      Operasyonlarını yönet
                    </p>
                  </div>
                </Link>
                <Link
                  href="/auth/kayit"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                    <HardHat size={18} className="text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Montaj Ekibi
                    </p>
                    <p className="text-white/70 text-xs">
                      İş fırsatlarına ulaş
                    </p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/65 text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <Shield size={12} />
                  Doğrulanmış ekipler
                </span>
                <span className="flex items-center gap-1.5">
                  <ArrowRight size={12} />
                  Şeffaf teklif süreci
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={12} />
                  Güvenli ödeme
                </span>
              </motion.div>
            </div>

            {/* Right: Dashboard Mockup */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="relative">
                <div className="bg-[#0d1e33] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-[#0B5FFF]/10">
                  <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-white/30 text-xs ml-2 font-mono">
                      panel.montajimvar.com
                    </span>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Visual stat indicators — placeholder UI */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Aktif İşler", color: "#0B5FFF" },
                        { label: "Montaj Ekibi", color: "#00C853" },
                        { label: "Tamamlanma", color: "#F59E0B" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]"
                        >
                          <p className="text-white/65 text-xs mb-2">
                            {stat.label}
                          </p>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${stat.color}60, ${stat.color}20)`,
                              width: `${60 + Math.random() * 30}%`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                      <p className="text-white/65 text-xs mb-3 font-medium uppercase tracking-wider">
                        Son İşler
                      </p>
                      <div className="space-y-3">
                        {[
                          {
                            job: "AVM Montajı — İstanbul",
                            status: "Devam Ediyor",
                            color: "#0B5FFF",
                          },
                          {
                            job: "Mobilya Kurulumu — Ankara",
                            status: "Tamamlandı",
                            color: "#00C853",
                          },
                          {
                            job: "Fuar Standı — İzmir",
                            status: "Onay Bekliyor",
                            color: "#F59E0B",
                          },
                        ].map((item) => (
                          <div
                            key={item.job}
                            className="flex items-center justify-between"
                          >
                            <p className="text-white text-sm">{item.job}</p>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: `${item.color}20`,
                                color: item.color,
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#00C853]/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#00C853]" />
                        </div>
                        <p className="text-white text-sm">Canlı Ekip Takibi</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
                        <span className="text-white/40 text-xs">Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-[#0B5FFF]/10 to-[#00C853]/10 rounded-3xl blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-surface-secondary)] to-transparent" />
      </motion.div>
    </section>
  );
}
