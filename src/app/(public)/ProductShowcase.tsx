"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  FileText,
  Map,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const TABS = [
  { id: "jobs", label: "İş Yönetimi", icon: Briefcase },
  { id: "offers", label: "Teklifler", icon: FileText },
  { id: "tracking", label: "Ekip Takibi", icon: Map },
  { id: "reports", label: "Raporlama", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_CONTENT: Record<
  TabId,
  {
    title: string;
    desc: string;
    features: string[];
    mockup: (key: string) => React.ReactNode;
  }
> = {
  jobs: {
    title: "İşleri Tek Merkezden Yönetin",
    desc: "Tüm montaj işlerinizi oluşturun, atayın ve takip edin. İş durumunu anlık görün, ekibinizle iletişimde kalın.",
    features: [
      "Detaylı iş tanımı ve fotoğraf ekleme",
      "Otomatik ekip eşleştirme",
      "İş durumu takibi (Bekliyor / Devam Ediyor / Tamamlandı)",
      "Ekip içi mesajlaşma",
    ],
    mockup: () => (
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0B5FFF]" />
            <span className="text-xs font-semibold text-[var(--color-dark)]">
              AVM Montajı — İstanbul
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#0B5FFF]/10 text-[#0B5FFF] font-medium">
            Devam Ediyor
          </span>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: "Ekip", value: "Ahmet Montaj Ekibi", color: "#0B5FFF" },
            { label: "Tarih", value: "15 Temmuz 2026", color: "#00C853" },
            { label: "Bütçe", value: "₺4.500", color: "#8B5CF6" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[var(--color-text-tertiary)]">
                {row.label}
              </span>
              <span className="font-medium text-[var(--color-dark)]">
                {row.value}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-[var(--color-border-light)]">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
              <div className="flex -space-x-1">
                {["#0B5FFF", "#00C853", "#F59E0B"].map((c, i) => (
                  <div
                    key={c}
                    className="w-5 h-5 rounded-full border-2 border-white"
                    style={{ background: `${c}30` }}
                  />
                ))}
              </div>
              <span>3 ekip üyesi çalışıyor</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  offers: {
    title: "Teklifleri Karşılaştır, En İyisini Seç",
    desc: "Doğrulanmış montaj ekiplerinden gelen teklifleri fiyat, puan ve süreye göre karşılaştırın. Size en uygun olanı tek tıkla seçin.",
    features: [
      "Anlık teklif bildirimleri",
      "Fiyat-puan-süre karşılaştırma",
      "Ekip profili ve geçmiş işler",
      "Tek tıkla teklif onaylama",
    ],
    mockup: () => (
      <div className="space-y-3">
        {[
          {
            name: "Usta Montaj Ekibi",
            price: "₺3.200",
            rating: "4.8",
            time: "3 gün",
            color: "#0B5FFF",
          },
          {
            name: "Pro Montaj Grubu",
            price: "₺3.800",
            rating: "4.9",
            time: "2 gün",
            color: "#00C853",
            selected: true,
          },
          {
            name: "Hızlı Montaj",
            price: "₺2.900",
            rating: "4.5",
            time: "5 gün",
            color: "#F59E0B",
          },
        ].map((offer) => (
          <div
            key={offer.name}
            className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-all ${
              offer.selected
                ? "border-[#00C853] ring-1 ring-[#00C853]/20"
                : "border-[var(--color-border-light)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: offer.color }}
              >
                {offer.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-dark)]">
                  {offer.name}
                  {offer.selected && (
                    <span className="ml-2 text-[10px] text-[#00C853] font-medium">
                      Seçildi
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  ⭐ {offer.rating} · {offer.time}
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-[var(--color-dark)]">
              {offer.price}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  tracking: {
    title: "Ekibini Canlı Takip Et",
    desc: "Montaj ekibinin konumunu harita üzerinde canlı görün, işin her aşamasında durum güncellemelerini anında alın.",
    features: [
      "Canlı harita konum takibi",
      "Anlık durum güncellemeleri",
      "Tahmini varış süresi",
      "İş fotoğrafı ve not paylaşımı",
    ],
    mockup: () => (
      <div className="bg-[#0a1628] rounded-xl overflow-hidden border border-white/[0.08]">
        <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
          <span className="text-xs text-white/60">Canlı Takip</span>
        </div>
        <div className="p-4">
          <div className="aspect-[4/3] rounded-lg bg-white/[0.03] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-[#0B5FFF] shadow-[0_0_12px_rgba(11,95,255,0.6)]" />
            <div className="absolute top-1/3 left-1/2 w-3 h-3 rounded-full bg-[#00C853] shadow-[0_0_12px_rgba(0,200,83,0.6)]" />
            <div className="absolute bottom-1/4 left-2/3 w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/[0.06] rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-medium">
                    Ahmet Montaj Ekibi
                  </p>
                  <p className="text-white/50 text-[10px]">
                    Tamamlanma: %75
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C853]/20 text-[#00C853]">
                  Yolda
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  reports: {
    title: "Veriye Dayalı Kararlar Alın",
    desc: "İş tamamlama süreleri, ekip performansı, maliyet analizleri ve daha fazlası. Tüm veriler tek panelde, her an erişilebilir.",
    features: [
      "Ekip bazında performans raporları",
      "Aylık iş ve maliyet analizi",
      "Tamamlanma süresi istatistikleri",
      "PDF/Excel rapor dışa aktarma",
    ],
    mockup: () => (
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--color-border-light)]">
          <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
            Aylık Rapor — Haziran 2026
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Tamamlanan", value: "18", color: "#00C853" },
              { label: "Devam Eden", value: "6", color: "#0B5FFF" },
              { label: "Toplam", value: "₺48.200", color: "#8B5CF6" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-lg font-bold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { label: "Ahmet Montaj Ekibi", pct: 92, color: "#0B5FFF" },
              { label: "Pro Montaj Grubu", pct: 88, color: "#00C853" },
              { label: "Hızlı Montaj", pct: 75, color: "#F59E0B" },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-dark)] font-medium">
                    {bar.label}
                  </span>
                  <span className="text-[var(--color-text-tertiary)]">
                    %{bar.pct}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-surface-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${bar.pct}%`,
                      background: bar.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
};

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabId>("jobs");

  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Platform
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Montaj Sürecinin Her Aşaması Tek Panelde
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            İş yönetiminden raporlamaya, ihtiyacın olan tüm araçlar bir arada.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-xl p-1.5 border border-[var(--color-border-light)] shadow-sm gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)]"
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-2 gap-10 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-xs font-semibold rounded-full mb-4">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-4 leading-tight tracking-tight">
                  {TAB_CONTENT[activeTab].title}
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {TAB_CONTENT[activeTab].desc}
                </p>
                <ul className="space-y-3">
                  {TAB_CONTENT[activeTab].features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]"
                    >
                      <CheckCircle
                        size={16}
                        className="text-[var(--color-accent)] shrink-0 mt-0.5"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-3xl blur-2xl" />
                <div className="relative">
                  {TAB_CONTENT[activeTab].mockup(activeTab)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
