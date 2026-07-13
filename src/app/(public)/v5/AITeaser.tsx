import Link from "next/link";
import { Sparkles, ArrowRight, Image as ImageIcon, Clock4, BarChart3 } from "lucide-react";

const HIGHLIGHTS = [
  { Icon: ImageIcon, text: "Fotoğrafını yükle → sistem montaj tipini tanısın." },
  { Icon: Clock4, text: "Tahmini süre ve işçilik aralığı önersin." },
  { Icon: BarChart3, text: "Benzer işlerin geçmiş fiyatlarıyla karşılaştırma." },
];

export default function AITeaser() {
  return (
    <section
      aria-labelledby="ai-headline"
      className="border-y border-border bg-gradient-to-r from-surface/80 via-app/40 to-surface/80"
    >
      <div className="container-app py-16 md:py-22">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="section-label">
              <Sparkles className="h-3.5 w-3.5" /> AI · Yakında
            </span>
            <h2 id="ai-headline" className="heading-lg mt-3">
              Görsel tanıma ile{" "}
              <span className="gradient-text">anında yaklaşık fiyat</span>.
            </h2>
            <p className="mt-3 text-text-secondary">
              Ürünün fotoğrafını yükleyin. Sistem, montaj tipini tanısın,
              geçmiş iş verilerinden yaklaşık fiyat ve süre aralığı önersin.
              Şu anda beta aşamasında; bu bölüm aktif olduğunda duyurulacak.
            </p>

            <ul className="mt-5 space-y-2.5">
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h.text}
                  className="flex items-start gap-3 text-sm text-text-secondary"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <h.Icon className="h-4 w-4" />
                  </span>
                  {h.text}
                </li>
              ))}
            </ul>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/75 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <span className="font-semibold text-text-primary">
                Beta erişimi yakında
              </span>
              <span>&middot;</span>
              <Link
                href="/is-ver"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary"
              >
                İş açarak katıl <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="rounded-card border border-border bg-surface p-6 shadow-elevated"
          >
            <div className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              AI ön izleme (temsili)
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-app/30 px-4 py-5 text-text-tertiary">
              <span aria-hidden="true">
                <ImageIcon className="h-5 w-5" />
              </span>
              <span className="text-xs">Kullanıcı fotoğraf yükler</span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-text-primary">
                Tahmini: €240 - €320 · 4-7 saat
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}