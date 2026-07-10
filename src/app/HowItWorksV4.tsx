"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "./homepage.constants";
import { Briefcase, Users, CheckCircle, Shield, ArrowRight } from "lucide-react";

export default function HowItWorksV4() {
  const [activeStep, setActiveStep] = useState(0);

  const stepMockups = useMemo(() => [
    <div key="step0" className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[var(--color-border-light)] bg-[var(--color-surface-secondary)]">
        <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Yeni İş Oluştur</p>
      </div>
      <div className="p-4 space-y-4">
        {[
          { label: "İş Türü", value: "Mobilya Montajı" },
          { label: "Konum", value: "İstanbul, Kadıköy" },
          { label: "Bütçe Aralığı", value: "₺1.000 - ₺2.000" },
        ].map((row) => (
          <div key={row.label}>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-1">{row.label}</p>
            <div className="h-9 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-light)] flex items-center px-3 text-sm text-[var(--color-dark)]">{row.value}</div>
          </div>
        ))}
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg">
            <Briefcase size={14} /> İşi Oluştur
          </div>
        </div>
      </div>
    </div>,
    <div key="step1" className="space-y-3">
      {[
        { name: "Usta Takımı", price: "₺1.500", rating: "4.9", days: "2-3", selected: false },
        { name: "Pro Montaj", price: "₺1.800", rating: "4.8", days: "1-2", selected: true },
        { name: "Hızlı Servis", price: "₺1.200", rating: "4.6", days: "3-4", selected: false },
      ].map((offer) => (
        <div key={offer.name} className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-all ${offer.selected ? "border-[#00C853] ring-1 ring-[#00C853]/20" : "border-[var(--color-border-light)]"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center"><Users size={16} className="text-[var(--color-primary)]" /></div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-dark)]">{offer.name}{offer.selected && <span className="ml-2 text-[10px] text-[#00C853] font-medium">Seçildi</span>}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">⭐ {offer.rating} · {offer.days} gün</p>
            </div>
          </div>
          <p className="text-lg font-bold text-[var(--color-dark)]">{offer.price}</p>
        </div>
      ))}
    </div>,
    <div key="step2" className="bg-[#0a1628] rounded-xl overflow-hidden border border-white/[0.08]">
      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" /><span className="text-xs text-white/60">Canlı Takip</span></div>
        <span className="text-xs text-white/40">%75 tamamlandı</span>
      </div>
      <div className="p-4">
        <div className="aspect-[4/3] rounded-lg bg-white/[0.03] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#0B5FFF] shadow-[0_0_12px_rgba(11,95,255,0.6)]" />
          <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#00C853] shadow-[0_0_12px_rgba(0,200,83,0.6)]" />
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
          <div className="absolute bottom-3 left-3 right-3 bg-white/[0.06] rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-white text-xs font-medium">Ahmet Montaj Ekibi</p><p className="text-white/50 text-[10px]">Mobilya Montajı · Kadıköy</p></div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C853]/20 text-[#00C853]">Yolda</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    <div key="step3" className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[var(--color-border-light)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#00C853]/10 flex items-center justify-center"><Shield size={20} className="text-[#00C853]" /></div>
        <div><p className="text-sm font-semibold text-[var(--color-dark)]">Güvenli Ödeme</p><p className="text-xs text-[var(--color-text-tertiary)]">Emanet sisteminde</p></div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-border-light)]"><span className="text-[var(--color-text-tertiary)]">Toplam Tutar</span><span className="font-bold text-[var(--color-dark)]">₺1.500</span></div>
        <div className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-border-light)]"><span className="text-[var(--color-text-tertiary)]">Durum</span><span className="flex items-center gap-1.5 text-[#00C853] font-medium"><CheckCircle size={14} /> Emanette</span></div>
        <div className="flex items-center justify-between text-sm py-2"><span className="text-[var(--color-text-tertiary)]">İş Tamamlandı</span><span className="text-[var(--color-text-tertiary)]">—</span></div>
        <button className="w-full py-3 rounded-xl bg-[var(--color-surface-secondary)] text-sm font-semibold text-[var(--color-text-tertiary)] border border-[var(--color-border-light)] cursor-not-allowed mt-2">İşi Onayla (İş tamamlanınca)</button>
      </div>
    </div>,
  ], []);

  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]" id="nasil-calisir">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Süreç
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Dört basit adımda ihtiyacınız olan montaj uzmanını bulun ve işinizi halledin.
          </p>
        </div>

        <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24 space-y-4 mb-10 lg:mb-0">
            {HOW_IT_WORKS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-white border-[var(--color-primary)]/20 shadow-md"
                      : "bg-white/50 border-transparent hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? "text-white"
                          : "bg-[var(--color-surface-tertiary)] text-[var(--color-text-tertiary)]"
                      }`}
                      style={{
                        background: isActive ? step.color : undefined,
                      }}
                    >
                      <step.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-bold"
                          style={{ color: isActive ? step.color : "var(--color-text-tertiary)" }}
                        >
                          Adım {step.number}
                        </span>
                      </div>
                      <h3
                        className={`text-base font-bold transition-colors ${
                          isActive ? "text-[var(--color-dark)]" : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-[var(--color-text-tertiary)] mt-1.5 leading-relaxed"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className={`shrink-0 mt-2 transition-all ${
                        isActive
                          ? "text-[var(--color-primary)] opacity-100"
                          : "text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-3xl blur-2xl" />
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {stepMockups[activeStep]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
