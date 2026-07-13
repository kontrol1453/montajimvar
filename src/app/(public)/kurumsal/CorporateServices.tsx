"use client";

import { motion } from "framer-motion";
import {
  Globe, Building2, FileText, BarChart3,
  Clock, Moon, Store, HardHat
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Türkiye Geneli Ekip",
    desc: "81 ilde doğrulanmış montaj ekibi. Tek bir platform üzerinden tüm şehirlerde hizmet.",
  },
  {
    icon: Building2,
    title: "Tek Noktadan Yönetim",
    desc: "Tüm montaj operasyonlarınızı tek bir dashboard üzerinden planlayın, takip edin ve raporlayın.",
  },
  {
    icon: FileText,
    title: "Faturalandırma",
    desc: "Otomatik fatura oluşturma, e-fatura desteği ve düzenli muhasebe kayıtları.",
  },
  {
    icon: BarChart3,
    title: "Raporlama",
    desc: "Gerçek zamanlı operasyon raporları, ekip performans analizi ve maliyet takibi.",
  },
  {
    icon: Clock,
    title: "SLA Garantisi",
    desc: "Belirlenen sürede montaj tamamlama garantisi. Gecikme durumunda tazminat.",
  },
  {
    icon: Moon,
    title: "Gece Çalışması",
    desc: "AVM ve mağazalarınız için mesai sonrası montaj, gece bakım ve yenileme hizmetleri.",
  },
  {
    icon: Store,
    title: "AVM Uyumlu",
    desc: "AVM yönetim kurallarına tam uyumlu çalışma. Giriş belgeleri, sigorta ve izin süreçleri.",
  },
  {
    icon: HardHat,
    title: "Şantiye Deneyimi",
    desc: "İnşaat, tadilat ve şantiye sahalarında deneyimli ekipler. İş güvenliği belgeli personel.",
  },
];

export default function CorporateServices() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-dark)] leading-tight tracking-tight">
            Kurumsal İhtiyaçlarınıza
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5FFF] to-[#00C853]">
              Özel Çözümler
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-tertiary)]">
            Her ölçekteki işletme için esnek ve güvenilir montaj altyapısı.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-[#0B5FFF]/20 hover:shadow-lg hover:shadow-[#0B5FFF]/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0B5FFF]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <s.icon size={20} className="text-[#0B5FFF]" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-dark)] mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
