import { Building2 } from "lucide-react";

const sectors = [
  { name: "AVM & Alışveriş Merkezi", icon: Building2 },
  { name: "Perakende & Mağaza", icon: Building2 },
  { name: "Reklam & Tabela", icon: Building2 },
  { name: "Fuarcılık & Etkinlik", icon: Building2 },
  { name: "Mobilya & Dekorasyon", icon: Building2 },
  { name: "Elektrik & Altyapı", icon: Building2 },
];

export default function HomeBrands() {
  return (
    <section className="py-16 bg-white">
      <div className="container-app">
        <p className="text-center text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-8">
          Hizmet Verdiğimiz Sektörler
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="flex items-center gap-2 text-[var(--color-text-tertiary)] grayscale hover:grayscale-0 hover:text-[var(--color-text-tertiary)] transition-all duration-300"
            >
              <sector.icon size={24} />
              <span className="text-lg font-bold tracking-tight">{sector.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
