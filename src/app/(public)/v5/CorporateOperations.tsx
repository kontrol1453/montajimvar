import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { CORPORATE_PILLARS } from "./_lib/v5.constants";

const HIGHLIGHTS = [
  "Toplu iş açma & şube ataması",
  "Özel fiyatlandırma & ödeme vadesi",
  "Şube bazlı KPI panelleri",
  "Onaylı tedarikçi havuzu",
];

export default function CorporateOperations() {
  return (
    <section
      aria-labelledby="corporate-headline"
      id="kurumsal"
      className="section-dark"
    >
      <div className="container-app py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="section-label text-white/70">
              <Building2 className="h-3.5 w-3.5" /> Kurumsal Operasyon
            </span>
            <h2
              id="corporate-headline"
              className="heading-lg mt-3 text-white"
            >
              Mağaza zincirlerinden üreticilere;
              <span className="gradient-text"> sahadaki tek panonuz</span>.
            </h2>
            <p className="mt-4 text-white/70">
              Şubeleriniz için açtığınız montaj işlerini tek ekrandan yönetin.
              SLA&apos;li sözleşmeler, onaylı tedarikçi havuzu ve KPI raporları
              ile operasyonel yükü azaltın; kaliteyi ölçün.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-sm text-white/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/kurumsal" className="btn-primary">
                Kurumsal Çözümler <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/kurumsal#teklif"
                className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Teklif Al
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CORPORATE_PILLARS.map((p) => (
              <div
                key={p.id}
                className="rounded-card border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <p.Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
