import { ShieldCheck } from "lucide-react";
import { WHY_ITEMS } from "./_lib/v5.constants";

export default function WhyMontajimVar() {
  return (
    <section
      aria-labelledby="why-headline"
      className="bg-app/40"
    >
      <div className="container-app py-16 md:py-22">
        <div className="max-w-2xl">
          <span className="section-label">
            <ShieldCheck className="h-3.5 w-3.5" /> Neden
          </span>
          <h2 id="why-headline" className="heading-lg mt-3">
            Montajım Var; önce{" "}
            <span className="gradient-text">size çalışan</span>{" "}
            bir platform.
          </h2>
          <p className="mt-3 text-text-secondary">
            Aşağıdaki prensipler olmazsa işinize yaramazdık. Bunlar
            henüz açıklamadığımız farklılıklar — şimdi görünür
            olsunlar.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex h-full flex-col rounded-card border border-border bg-surface p-5 shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-card border border-border bg-app/40 p-5">
          <p className="text-xs text-text-tertiary">
            <strong className="font-semibold text-text-primary">SLA referansı:</strong>{" "}
            İtiraz yanıt süresi &lt; 8 saat, çözüm &lt; 72 saat. Emanet
            ödemelerde çözülemeyen ihtilaf oranı &lt; %3.
          </p>
        </div>
      </div>
    </section>
  );
}