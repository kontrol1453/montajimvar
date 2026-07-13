import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { WORKFLOW_STEPS } from "./_lib/v5.constants";

export default function ProductWorkflow() {
  return (
    <section
      aria-labelledby="workflow-headline"
      id="workflow"
      className="relative bg-gradient-to-b from-surface to-app/40"
    >
      <div className="container-app py-16 md:py-22">
        <div className="max-w-2xl">
          <span className="section-label">
            <Layers className="h-3.5 w-3.5" /> Nasıl Çalışır
          </span>
          <h2 id="workflow-headline" className="heading-lg mt-3">
            Tanımla · karşılaştır · güvenle tamamla.
          </h2>
          <p className="mt-3 text-text-secondary">
            Dört adımda sahadan teslimata kadar tüm süreç. İşinizi{" "}
            <strong className="font-semibold text-text-primary">3 dakikada</strong>{" "}
            açın, gerisini platform yönetsin.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {WORKFLOW_STEPS.map((s) => (
            <li
              key={s.id}
              className="relative flex h-full flex-col rounded-card border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-mono text-text-tertiary">
                  {s.step}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-text-primary">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {s.description}
              </p>

              <ul className="mt-4 space-y-1.5">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-xs text-text-tertiary"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-card border border-border bg-app/40 px-5 py-4">
          <p className="text-sm text-text-secondary">
            <strong className="font-semibold text-text-primary">
              Hız testi:
            </strong>{" "}
            Yeni bir iş ilanının yayına alınması ortalama{" "}
            <strong className="font-semibold text-primary">2 dk 48 sn</strong>{" "}
            sürer.
          </p>
          <Link href="/is-ver" className="btn-primary">
            Ücretsiz İş Oluştur <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
