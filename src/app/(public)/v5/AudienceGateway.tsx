import Link from "next/link";
import { ArrowRight, Briefcase, Hammer, Factory, Home } from "lucide-react";
import { AUDIENCE_ITEMS } from "./_lib/v5.constants";

const ACCENT_CLASS: Record<string, string> = {
  primary:
    "border-primary/15 bg-primary/[0.03] hover:border-primary/40 hover:bg-primary/5",
  accent:
    "border-accent/15 bg-accent/[0.03] hover:border-accent/40 hover:bg-accent/5",
  amber:
    "border-amber-500/15 bg-amber-500/[0.03] hover:border-amber-500/40 hover:bg-amber-500/5",
  violet:
    "border-violet-500/15 bg-violet-500/[0.03] hover:border-violet-500/40 hover:bg-violet-500/5",
};

const ACCENT_ICON: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  amber: "bg-amber-500/10 text-amber-600",
  violet: "bg-violet-500/10 text-violet-600",
};

export default function AudienceGateway() {
  return (
    <section
      aria-labelledby="audience-headline"
      id="audience"
      className="relative bg-app/40"
    >
      <div className="container-app py-16 md:py-22">
        <div className="max-w-2xl">
          <span className="section-label">
            <Briefcase className="h-3.5 w-3.5" /> Kimler İçin
          </span>
          <h2 id="audience-headline" className="heading-lg mt-3">
            Platform, dört ayrı kullanıcı için tasarlandı.
          </h2>
          <p className="mt-3 text-text-secondary">
            Bireyselden kurumsala, montaj ekibinden üreticiye kadar her role
            özel bir başlangıç noktası. Doğru yoldan ilerleyin.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE_ITEMS.map((a) => (
            <Link
              key={a.id}
              href={a.ctaHref}
              aria-label={`${a.title} için ${a.ctaLabel}`}
              className={`group flex h-full flex-col rounded-card border p-5 shadow-card transition-all duration-200 ${ACCENT_CLASS[a.accent]}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${ACCENT_ICON[a.accent]}`}
                >
                  <a.Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  {a.subtitle}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-text-primary">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {a.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                {a.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-text-tertiary md:grid-cols-4">
          <Tag Icon={Home} text="Bireysel müşteriler" />
          <Tag Icon={Hammer} text="Montaj ekipleri" />
          <Tag Icon={Briefcase} text="Kurumsal müşteriler" />
          <Tag Icon={Factory} text="Üretici markalar" />
        </div>
      </div>
    </section>
  );
}

function Tag({ Icon, text }: { Icon: typeof Home; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {text}
    </span>
  );
}
