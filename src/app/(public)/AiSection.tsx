import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  { num: "1", title: "Fotoğraf Yükle", desc: "İş yerinin fotoğraflarını çek", color: "var(--color-primary)" },
  { num: "2", title: "AI Analiz", desc: "Yapay zeka işi analiz eder", color: "var(--color-accent)" },
  { num: "3", title: "Tahmini Fiyat & Süre", desc: "AI ile akıllı analiz", color: "var(--color-primary)" },
  { num: "4", title: "Teklifler Hazır", desc: "", color: "var(--color-accent)", badge: "Hazır", highlighted: true },
];

const bullets = [
  "Fotoğraftan otomatik iş analizi",
  "Yapay zeka ile tahmini fiyatlandırma",
  "İşine en uygun montaj ekibi eşleştirmesi",
  "Anlık teklif karşılaştırma",
];

export default function AiSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-3xl blur-2xl" />
              <div className="relative bg-[var(--color-surface-secondary)] rounded-2xl p-8 border border-[var(--color-border-light)]">
                <div className="space-y-5">
                  {steps.map((step, i) => (
                    <div key={step.num}>
                      {i > 0 && (
                        <div className="flex justify-center text-[var(--color-text-tertiary)]">
                          <ArrowRight size={20} />
                        </div>
                      )}
                      <div
                        className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm ${step.highlighted ? "ring-1 ring-[var(--color-primary)]/20" : ""}`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                          style={{
                            backgroundColor: step.highlighted ? step.color : `${step.color}10`,
                            color: step.highlighted ? "white" : step.color,
                          }}
                        >
                          {step.num}
                        </div>
                        <div className="flex items-center gap-2">
                          {step.highlighted && <CheckCircle size={16} className="text-[var(--color-accent)]" />}
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-dark)]">{step.title}</p>
                            {step.desc && <p className="text-xs text-[var(--color-text-tertiary)]">{step.desc}</p>}
                          </div>
                          {step.badge && (
                            <span className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5 rounded-full font-medium">
                              {step.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-600 text-[10px] font-semibold rounded-full border border-amber-500/20">
                    <Sparkles size={10} />
                    Yakında
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="section-label">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                Yapay Zeka Destekli
              </span>
              <h2 className="heading-lg mt-4 mb-3">
                Fotoğrafı Yükle,{" "}
                <span className="text-[var(--color-primary)]">AI Analiz Etsin</span>
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                İş yerinin fotoğraflarını çek, yapay zeka montajı analiz etsin.
                Tahmini süre, bütçe ve uygun ekip önerileri anında karşında.
              </p>
              <ul className="space-y-4 mb-8">
                {bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                    <CheckCircle size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-surface-secondary)] text-[var(--color-text-tertiary)] text-sm font-medium rounded-xl border border-[var(--color-border-light)]">
                  <Sparkles size={14} />
                  Geliştirme aşamasında
                </span>
                <Link href="/is-ver" className="btn-primary">
                  İş Oluştur
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
