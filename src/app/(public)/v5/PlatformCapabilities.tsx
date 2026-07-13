import { Grid3x3, ArrowUpRight } from "lucide-react";
import { CAPABILITIES, type CapabilityItem } from "./_lib/v5.constants";

const STATUS_BADGE: Record<CapabilityItem["status"], { label: string; class: string }> = {
  available: {
    label: "Mevcut",
    class: "bg-accent/10 text-accent border-accent/30",
  },
  beta: {
    label: "Beta",
    class: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  soon: {
    label: "Yakında",
    class: "bg-surface text-text-tertiary border-border",
  },
};

export default function PlatformCapabilities() {
  return (
    <section
      aria-labelledby="platform-headline"
      id="platform"
      className="bg-app/40"
    >
      <div className="container-app py-16 md:py-22">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="section-label">
              <Grid3x3 className="h-3.5 w-3.5" /> Platform · Özellikler
            </span>
            <h2 id="platform-headline" className="heading-lg mt-3">
              Tek platform;
              <span className="gradient-text"> pazar, operasyon, güven</span>.
            </h2>
            <p className="mt-3 text-text-secondary">
              Aşağıdaki özellikler Montajım Var platformunun bugün çalışan
              yetenekleridir. Henüz aktif olmayanlar{" "}
              <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-xs">
                Yakında
              </span>{" "}
              rozetiyle ayrılır.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => {
            const badge = STATUS_BADGE[c.status];
            const clickable = c.status !== "soon";
            return (
              <article
                key={c.id}
                className={`group relative flex h-full flex-col rounded-card border border-border bg-surface p-5 shadow-card transition-all duration-200 ${
                  clickable
                    ? "hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/30"
                    : "opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <c.Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.class}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-text-primary">
                  {c.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {c.description}
                </p>

                {clickable && (
                  <ArrowUpRight className="absolute right-4 top-4 hidden h-4 w-4 text-primary/30 transition-opacity duration-200 group-hover:block group-hover:text-primary" />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
