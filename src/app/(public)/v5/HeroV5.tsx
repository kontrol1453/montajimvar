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
              <Sparkles className="h-3.5 w-3.5" /> Montajım Var · v5
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
              <div className="rounded-card border border-border bg-surface shadow-elevated aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-text-secondary text-sm">
                    Ürün ekran görüntüsü<br />buraya eklenecek
                  </p>
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
