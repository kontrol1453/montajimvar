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
            <ProductPreviewMockup />
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

function ProductPreviewMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-card border border-border bg-surface shadow-elevated">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="ml-auto text-xs text-text-tertiary">
            montajimvar.xyz · canlı
          </span>
        </div>
        <div className="p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Aktif İşlerim
          </div>
          <div className="mt-1 text-2xl font-bold text-text-primary">
            3 iş yürüyor
          </div>

          <div className="mt-4 space-y-2.5">
            <Row label="Mobilya Montajı · Kadıköy" status="İşlemde" tone="primary" />
            <Row label="Klima Kurulumu · Beşiktaş" status="Planlama" tone="muted" />
            <Row label="TV Ünitesi · Üsküdar" status="Ekip atandı" tone="accent" />
          </div>

          <div className="mt-5 rounded-lg border border-border bg-app/60 p-3">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span>Emanet hesap</span>
              <span className="font-medium text-accent">Koruma aktif</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-text-primary">
              Ödeme teslimat onayına kadar tutulur
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -bottom-4 hidden md:block">
        <div className="rounded-card border border-border bg-surface px-3 py-2 shadow-elevated">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-medium text-text-primary">Yeni teklif</span>
            <span className="text-text-tertiary">+1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  status,
  tone,
}: {
  label: string;
  status: string;
  tone: "primary" | "accent" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "accent"
      ? "bg-accent/10 text-accent"
      : "bg-surface border border-border text-text-tertiary";
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-app/40 px-3 py-2">
      <span className="truncate text-xs font-medium text-text-primary">
        {label}
      </span>
      <span
        className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${toneClass}`}
      >
        {status}
      </span>
    </div>
  );
}
