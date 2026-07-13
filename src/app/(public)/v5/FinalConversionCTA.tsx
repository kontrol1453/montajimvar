import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FINAL_CTA } from "./_lib/v5.constants";

export default function FinalConversionCTA() {
  return (
    <section
      aria-labelledby="final-headline"
      className="relative bg-gradient-to-b from-surface to-app/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-20 right-[-10%] h-[24rem] w-[24rem] rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="container-app py-16 md:py-24">
        <div className="rounded-card border border-border bg-surface p-8 text-center shadow-elevated md:p-12">
          <h2 id="final-headline" className="heading-xl text-balance">
            {FINAL_CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            {FINAL_CTA.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={FINAL_CTA.primary.href}
              className="btn-primary"
              aria-label="Ücretsiz iş açma sayfasını tıkla"
            >
              {FINAL_CTA.primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={FINAL_CTA.secondary.href}
              className="btn-secondary"
            >
              {FINAL_CTA.secondary.label}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Emanet ödeme
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Doğrulanmış ekipler
            </span>
            <span>· 81 il · ücretsiz iş ilanı</span>
          </div>
        </div>
      </div>
    </section>
  );
}