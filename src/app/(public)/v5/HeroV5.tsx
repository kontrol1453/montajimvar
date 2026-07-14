import Link from "next/link";
import { ArrowRight, ShieldCheck, Star, Sparkles, MapPin } from "lucide-react";
import {
  HERO_PRIMARY_CTA,
  HERO_SECONDARY_CTA,
  TRUST_METRICS,
} from "./_lib/v5.constants";

export default function HeroV5() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#f6f9ff] via-white to-white dark:from-[#0a0f1f] dark:via-[#0b1322] dark:to-[#0b1322]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 left-[-10%] h-[26rem] w-[26rem] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container-app pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="section-label animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" /> Profesyonel Montaj Platformu
            </span>

            <h1
              id="hero-headline"
              className="heading-xl mt-5 text-balance animate-fade-in-up"
            >
              Türkiye&apos;nin profesyonel{" "}
              <span className="gradient-text">montaj platformu</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg animate-fade-in-up">
              Bireysel ya da kurumsal fark etmez: işinizi{" "}
              <strong className="font-semibold text-text-primary">3 dakikada</strong>{" "}
              tanımlayın, doğrulanmış ekiplerden teklifleri{" "}
              <strong className="font-semibold text-text-primary">tek tabloda</strong>{" "}
              karşılaştırın, ödemeyi{" "}
              <strong className="font-semibold text-text-primary">emanette</strong>{" "}
              tutarak güvenle tamamlayın.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 animate-fade-in-up">
              <Link
                href={HERO_PRIMARY_CTA.href}
                className="btn-primary"
                aria-label="Ücretsiz iş oluşturma sayfasını aç"
              >
                {HERO_PRIMARY_CTA.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={HERO_SECONDARY_CTA.href}
                className="btn-secondary"
              >
                {HERO_SECONDARY_CTA.label}
              </Link>
            </div>

            <ul
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-tertiary animate-fade-in-up"
              aria-label="Hızlı güven sinyalleri"
            >
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" /> Emanet ödeme
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500" /> Doğrulanmış ekipler
              </li>
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> 81 il · hızlı eşleşme
              </li>
            </ul>
          </div>

          <div className="md:col-span-5" aria-hidden="true">
            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-card border border-border bg-surface shadow-elevated overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-xs text-text-tertiary ml-2 font-mono">panel.montajimvar.com</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Aktif İşler", color: "bg-primary/20" },
                      { label: "Montaj Ekibi", color: "bg-accent/20" },
                      { label: "Tamamlanma", color: "bg-amber-500/20" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-muted/50 rounded-lg p-3 border border-border">
                        <div className="text-xs text-text-tertiary mb-1.5">{stat.label}</div>
                        <div className={`h-1.5 rounded-full ${stat.color}`} style={{ width: `${55 + Math.random() * 35}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border">
                    <div className="text-xs text-text-tertiary mb-2 font-medium uppercase tracking-wider">Son İşler</div>
                    <div className="space-y-2">
                      {[
                        { job: "AVM Montajı — İstanbul", status: "Devam Ediyor", color: "text-primary" },
                        { job: "Mobilya Kurulumu — Ankara", status: "Tamamlandı", color: "text-accent" },
                      ].map((item) => (
                        <div key={item.job} className="flex items-center justify-between">
                          <span className="text-xs text-text-primary">{item.job}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-medium ${item.color}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs text-text-primary">Canlı Ekip Takibi</span>
                    </div>
                    <span className="text-[10px] text-text-tertiary">Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 md:mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          aria-label="Güven rozetleri"
        >
          {TRUST_METRICS.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-card"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-medium text-text-primary">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
