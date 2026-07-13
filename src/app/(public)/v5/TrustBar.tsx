import { ShieldCheck, Wallet, Clock4, FileCheck2 } from "lucide-react";

const ITEMS = [
  {
    id: "escrow",
    title: "Emanet Ödeme",
    description: "Ödeme; işin teslimine kadar platform emanetinde.",
    Icon: Wallet,
  },
  {
    id: "verified",
    title: "Doğrulanmış Ekipler",
    description: "Kimlik · vergi · referans kontrolleri.",
    Icon: ShieldCheck,
  },
  {
    id: "sla",
    title: "Net SLA",
    description: "Belirlenmiş yanıt & tamamlama süreleri.",
    Icon: Clock4,
  },
  {
    id: "contract",
    title: "Şeffaf Anlaşma",
    description: "Her iş için yazılı teklif & sözleşme.",
    Icon: FileCheck2,
  },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Güven sinyalleri"
      className="border-y border-border bg-surface/60"
    >
      <div className="container-app py-6 md:py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {ITEMS.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {item.title}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-text-tertiary">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
