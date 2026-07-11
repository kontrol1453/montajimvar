"use client";

import { motion } from "framer-motion";
import { ClipboardList, Users2, ClipboardCheck, Star } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "İhtiyaçlarınızı Belirleyin",
    desc: "Proje detaylarını, lokasyonları ve zaman çizelgesini platforma girin.",
    color: "#0B5FFF",
  },
  {
    icon: Users2,
    title: "Ekibi Eşleştirin",
    desc: "Türkiye genelindeki doğrulanmış montaj ekipleri arasından en uygununu seçin.",
    color: "#00C853",
  },
  {
    icon: ClipboardCheck,
    title: "Operasyonu Yönetin",
    desc: "Gerçek zamanlı takip, SLA izleme ve anlık bildirimlerle süreci kontrol edin.",
    color: "#F59E0B",
  },
  {
    icon: Star,
    title: "Değerlendirin & Raporlayın",
    desc: "Tamamlanan işleri değerlendirin, performans raporlarını görüntüleyin.",
    color: "#8B5CF6",
  },
];

export default function CorporateProcess() {
  return (
    <section className="py-24 section-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0B5FFF]/5 rounded-full blur-[150px]" />
      </div>
      <div className="container-app relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Nasıl Çalışır?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Dört adımda kurumsal montaj operasyonunuzu başlatın.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
                style={{ background: `${step.color}20` }}
              >
                <step.icon size={24} style={{ color: step.color }} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: step.color }}>
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
