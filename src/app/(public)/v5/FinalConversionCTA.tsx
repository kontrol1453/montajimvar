import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

export default function FinalConversionCTA({ settings }: { settings: SiteSettings }) {
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
            {settings.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            {settings.finalCta.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={settings.finalCta.primary.href}
              className="btn-primary"
              aria-label={settings.finalCta.primary.label + " sayfasını tıkla"}
            >
              {settings.finalCta.primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={settings.finalCta.secondary.href}
              className="btn-secondary"
            >
              {settings.finalCta.secondary.label}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-tertiary">
            {settings.finalCta.trustSignals.map((signal, i) => (
              i === 0 ? (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {signal}
                </span>
              ) : (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {signal}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}