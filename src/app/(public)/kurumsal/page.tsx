import type { Metadata } from "next";
import CorporateHero from "./CorporateHero";
import CorporateServices from "./CorporateServices";
import CorporateProcess from "./CorporateProcess";
import CorporateCta from "./CorporateCta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kurumsal Montaj Çözümleri | Montajım Var",
  description:
    "Zincir mağaza, AVM, fuarcılık ve endüstriyel projeleriniz için Türkiye geneli profesyonel montaj ekibi. Tek noktadan yönetim, SLA garantili hizmet.",
  alternates: {
    canonical: "/kurumsal",
  },
  openGraph: {
    title: "Kurumsal Montaj Çözümleri | Montajım Var",
    description:
      "Türkiye geneli profesyonel montaj ekibi. Tek noktadan yönetim, SLA garantili hizmet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurumsal Montaj Çözümleri | Montajım Var",
    description:
      "Türkiye geneli profesyonel montaj ekibi. Tek noktadan yönetim, SLA garantili hizmet.",
  },
};

export default function KurumsalPage() {
  return (
    <div className="overflow-hidden">
      <CorporateHero />
      <CorporateServices />
      <CorporateProcess />
      <CorporateCta />
    </div>
  );
}
