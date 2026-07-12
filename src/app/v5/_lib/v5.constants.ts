import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Home,
  Factory,
  Hammer,
  Wrench,
  PaintBucket,
  Sofa,
  Boxes,
  Truck,
  Briefcase,
  Calendar,
  ShieldCheck,
  CreditCard,
  Users,
  LineChart,
  Bell,
  Smartphone,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Clock4,
  Wallet,
  Award,
  ClipboardList,
  MapPin,
} from "lucide-react";

export type Audience = "customer" | "installer" | "corporate" | "manufacturer";

export interface AudienceItem {
  id: Audience;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  Icon: LucideIcon;
  accent: "primary" | "accent" | "amber" | "violet";
}

export interface CategoryChip {
  id: string;
  name: string;
  slug: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
  tags: string[];
}

export interface TrustMetric {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
}

export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  status: "available" | "soon" | "beta";
  category: "marketplace" | "operations" | "trust" | "mobile";
}

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CorporatePillar {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const AUDIENCE_ITEMS: AudienceItem[] = [
  {
    id: "customer",
    title: "Bireysel Müşteriler",
    subtitle: "Ev / Ofis için",
    description:
      "Mobilya montajından TV askısına, ev tadilatından özel projelere kadar tüm bireysel ihtiyaçlarınız için doğrulanmış ekipleri karşılaştırın.",
    ctaLabel: "Hizmet Ara",
    ctaHref: "/ara",
    Icon: Home,
    accent: "primary",
  },
  {
    id: "installer",
    title: "Montaj Ekipleri",
    subtitle: "Profesyoneller için",
    description:
      "Kendi şehrinizdeki iş ilanlarını görün, portföy oluşturun, ödemelerinizi güvence altına alın. Yeni müşterilere hızlı ulaşın.",
    ctaLabel: "Ekip Olarak Katıl",
    ctaHref: "/auth/kayit",
    Icon: Hammer,
    accent: "accent",
  },
  {
    id: "corporate",
    title: "Kurumsal / Bayi",
    subtitle: "Mağaza zincirleri, e-ticaret",
    description:
      "Şubeleriniz için toplu montaj talepleri açın, özel fiyatlandırmadan yararlanın, KPI panelleriyle operasyonlarınızı izleyin.",
    ctaLabel: "Kurumsal Çözümler",
    ctaHref: "/kurumsal",
    Icon: Briefcase,
    accent: "amber",
  },
  {
    id: "manufacturer",
    title: "Üreticiler",
    subtitle: "Markalar için",
    description:
      "Yetkili bayi ve montaj ağınızı yönetin, ürün montaj standartlarınızı koruyun, sahada sesiniz olun.",
    ctaLabel: "Marka Portalı",
    ctaHref: "/kurumsal",
    Icon: Factory,
    accent: "violet",
  },
];

export const TRUST_METRICS: TrustMetric[] = [
  { id: "verified", label: "Doğrulanmış Profil", Icon: ShieldCheck },
  { id: "escrow", label: "Emanet Ödeme", Icon: Wallet },
  { id: "support", label: "7/24 Destek", Icon: Bell },
  { id: "rating", label: "Şeffaf Puanlama", Icon: Award },
];

export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "mobilya",
    title: "Mobilya Montajı",
    description: "Çekyat, gardrop, masa, kitaplık ve daha fazlası.",
    Icon: Sofa,
    href: "/ara?kategori=mobilya",
    tags: ["Ev", "Ofis", "Mağaza"],
  },
  {
    id: "tadilat",
    title: "Tadilat & Dekorasyon",
    description: "Boya, alçı, fayans, duvar kağıdı işleri.",
    Icon: PaintBucket,
    href: "/ara?kategori=tadilat",
    tags: ["Ev", "İç Mekan"],
  },
  {
    id: "elektrik",
    title: "Elektrik & Aydınlatma",
    description: "Avize, priz, kablo, akıllı ev kurulumları.",
    Icon: Wrench,
    href: "/ara?kategori=elektrik",
    tags: ["Ev", "Ofis"],
  },
  {
    id: "beyaz-esya",
    title: "Beyaz Eşya Kurulumu",
    description: "Klima, kombi, bulaşık makinesi montajı.",
    Icon: Boxes,
    href: "/ara?kategori=beyaz-esya",
    tags: ["Kurulum", "Servis"],
  },
  {
    id: "tasinma",
    title: "Taşınma & Nakliye",
    description: "Şehir içi, şehirler arası taşınma ve paketleme.",
    Icon: Truck,
    href: "/ara?kategori=tasinma",
    tags: ["Yerel", "Şehirler Arası"],
  },
  {
    id: "kurumsal",
    title: "Kurumsal Montaj",
    description: "AVM, mağaza, zincir operasyonları için toplu işler.",
    Icon: Building2,
    href: "/kurumsal",
    tags: ["B2B", "Toplu"],
  },
  {
    id: "ozel-uretim",
    title: "Özel Üretim & Marangoz",
    description: "Özel ölçü, marangoz ve ahşap işleri.",
    Icon: Hammer,
    href: "/ara?kategori=marangoz",
    tags: ["Özel", "Atölye"],
  },
  {
    id: "akill-ev",
    title: "Akıllı Ev & IT",
    description: "Kamera, network, akıllı kilit, alarm sistemleri.",
    Icon: Smartphone,
    href: "/ara?kategori=teknoloji",
    tags: ["Akıllı Ev", "IT"],
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "create",
    step: "01",
    title: "İşinizi Tanımlayın",
    description:
      "Konum, tarih ve hizmet detaylarını girip birkaç dakikada iş ilanınızı oluşturun.",
    bullets: ["Konum & şehir otomatik önerisi", "Zamandan tasarruf: ~3 dk"],
    Icon: ClipboardList,
  },
  {
    id: "compare",
    step: "02",
    title: "Teklifleri Karşılaştırın",
    description:
      "Doğrulanmış ekiplerden gelen teklifleri yan yana görün: fiyat, puan, portföy.",
    bullets: ["Şeffaf fiyat & puan", "Gerçek müşteri yorumları"],
    Icon: LineChart,
  },
  {
    id: "secure",
    step: "03",
    title: "Güvenli Şekilde Ödeyin",
    description:
      "Ödeme, iş teslim edene kadar emanet hesapta bekler. Hiçbir risk yok.",
    bullets: ["Emanet ödeme koruması", "İade & itiraz süreçleri"],
    Icon: ShieldCheck,
  },
  {
    id: "track",
    step: "04",
    title: "Süreci Takip Edin",
    description:
      "Ekip sahadayken adım adım güncelleme alın. Tamamlanınca puanlayın.",
    bullets: ["Anlık durum bildirimi", "Yorumlarla kalite kontrolü"],
    Icon: CheckCircle2,
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: "job-create",
    title: "Hızlı İş Oluşturma",
    description: "Şehir ve kategori otomatik tamamlama ile 60 saniyede iş ilanı.",
    Icon: ClipboardList,
    status: "available",
    category: "marketplace",
  },
  {
    id: "offer-compare",
    title: "Akıllı Teklif Karşılaştırma",
    description: "Fiyat, mesafe, puan ve portföyü tek tabloda karşılaştırın.",
    Icon: LineChart,
    status: "available",
    category: "marketplace",
  },
  {
    id: "escrow",
    title: "Emanet Ödeme Sistemi",
    description: "Ödeme teslimat onayına kadar platformda tutulur.",
    Icon: Wallet,
    status: "available",
    category: "trust",
  },
  {
    id: "verified-pros",
    title: "Doğrulanmış Profiller",
    description: "Kimlik, vergi levhası, referans kontrolleri.",
    Icon: ShieldCheck,
    status: "available",
    category: "trust",
  },
  {
    id: "real-time-tracking",
    title: "Canlı İş Takibi",
    description: "Ekip sahadayken adım adım durum güncellemeleri.",
    Icon: MapPin,
    status: "available",
    category: "operations",
  },
  {
    id: "team-scheduling",
    title: "Ekip & Saha Planlama",
    description: "Birden çok ekibi tek takvimden yönetin.",
    Icon: Calendar,
    status: "soon",
    category: "operations",
  },
  {
    id: "corporate-kpi",
    title: "Kurumsal KPI Paneli",
    description: "Şube bazlı maliyet, süre ve kalite raporları.",
    Icon: LineChart,
    status: "beta",
    category: "operations",
  },
  {
    id: "mobile",
    title: "Mobil + WebView Uygulama",
    description: "iOS / Android için PWA + Expo WebView uygulaması.",
    Icon: Smartphone,
    status: "available",
    category: "mobile",
  },
  {
    id: "messaging",
    title: "Mesajlaşma & Bildirimler",
    description: "Push + e-posta + in-app mesajlaşma tek kanalda.",
    Icon: MessageCircle,
    status: "available",
    category: "mobile",
  },
  {
    id: "ai-pricing",
    title: "AI Fiyat Tahmini",
    description: "Fotoğraf + açıklamadan tahmini fiyat ve süre önerisi.",
    Icon: Sparkles,
    status: "soon",
    category: "marketplace",
  },
];

export const WHY_ITEMS: WhyItem[] = [
  {
    id: "escrow-safety",
    title: "Emanet Ödeme Koruması",
    description:
      "Paranız, iş teslim edilene kadar Montajım Var güvencesinde kalır. Memnun kalmazsanız iade süreci başlatılır.",
    Icon: Wallet,
  },
  {
    id: "verified",
    title: "Her Ekibi Tek Tek Doğruluyoruz",
    description:
      "Kimlik, vergi levhası ve referans kontrolleri tamamlanan ekipler ilanlarınızda görünür. Gösteriş değil, gerçek doğrulama.",
    Icon: ShieldCheck,
  },
  {
    id: "transparent-pricing",
    title: "Şeffaf Fiyat, Karşılaştırmalı Teklif",
    description:
      "Saniyeler içinde birden fazla teklifi yan yana görürsünüz. Pazarlık değil, gerçek piyasa fiyatları.",
    Icon: CreditCard,
  },
  {
    id: "sla",
    title: "Net SLA & Çözüm Süreleri",
    description:
      "İtirazlarınız ve sorularınız için belirlenmiş yanıt süreleri. İşinizi takip eden gerçek bir destek ekibi.",
    Icon: Clock4,
  },
  {
    id: "scale",
    title: "Bireyselden Kurumsala, Tek Platform",
    description:
      "Ev için tek bir dolap montajı mı, 50 şubeli bir zincirin saha operasyonu mu? Aynı altyapı, farklı paketler.",
    Icon: Users,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "fee",
    question: "Platform hizmet ücreti alıyor mu?",
    answer:
      "İş ortağınızla (montaj ekibi) doğrudan çalışırsınız. Platform, güvenli ödeme sürecini sağladığı için yalnızca ödeme anında küçük bir platform hizmet bedeli uygulanır. Detaylar sözleşme sayfasında paylaşılmaktadır.",
  },
  {
    id: "escrow",
    question: "Emanet ödeme nasıl çalışıyor?",
    answer:
      "Ödeme, iş tamamlanana kadar platform emanet hesabında tutulur. Montajı onaylamanızla birlikte ödeme ekibe aktarılır. Herhangi bir sorun olursa 7 gün içinde itiraz açabilirsiniz; uzlaşma süreci destek ekibimiz tarafından yürütülür.",
  },
  {
    id: "guarantee",
    question: "Memnun kalmazsam ne oluyor?",
    answer:
      "İş tesliminden sonra 7 gün içinde itiraz açabilirsiniz. Destek ekibimiz tarafınız ve ekiple iletişime geçer; uygun çözüm bulunamazsa paranız iade edilir.",
  },
  {
    id: "corporate",
    question: "Kurumsal müşteriler için özel çözüm var mı?",
    answer:
      "Evet. Kurumsal hesaplar için toplu iş açma, özel fiyatlandırma, ödeme vadesi ve KPI panelleri sunuyoruz. Kurumsal sayfamızdan detayları inceleyebilir, teklif talep edebilirsiniz.",
  },
];

export const CORPORATE_PILLARS: CorporatePillar[] = [
  {
    id: "central-control",
    title: "Tek Panelden Tüm Şubeler",
    description:
      "Şehir şehir montaj talepleri, ekip atamaları ve ödemeler tek yönetim panelinden takip edilir.",
    Icon: Briefcase,
  },
  {
    id: "sla",
    title: "SLA'lı Saha Yönetimi",
    description:
      "Sözleşmeli yanıt süreleri, kalite kontrolleri ve performans raporları standart paketin parçası.",
    Icon: Clock4,
  },
  {
    id: "reporting",
    title: "Şube Bazlı KPI Raporları",
    description:
      "Maliyet, süre, müşteri puanı şube bazında raporlanır. PDF / Excel ihracı dahildir.",
    Icon: LineChart,
  },
  {
    id: "vendor-pool",
    title: "Onaylı Tedarikçi Havuzu",
    description:
      "Kurumsal müşteriyle çalışan ekipler, kalite kriterlerinize göre tek başvuruyla havuza alınır.",
    Icon: Users,
  },
];

export interface NavLink {
  label: string;
  href: string;
}

export const V5_NAV_LINKS: NavLink[] = [
  { label: "İş Oluştur", href: "/is-ver" },
  { label: "Hizmetler", href: "/ara" },
  { label: "Kurumsal", href: "/kurumsal" },
  { label: "Blog", href: "/blog" },
];

export const HERO_PRIMARY_CTA = {
  label: "Ücretsiz İş Oluştur",
  href: "/is-ver",
};

export const HERO_SECONDARY_CTA = {
  label: "Platformu Keşfet",
  href: "#platform",
};

export const FINAL_CTA = {
  title: "Montaj İşinizi Başlatmaya Hazır mısınız?",
  description:
    "3 dakikada iş ilanı oluştur, doğrulanmış ekiplerden teklif al, güvenle tamamla.",
  primary: { label: "Ücretsiz İş Oluştur", href: "/is-ver" },
  secondary: { label: "Platformu Keşfet", href: "#platform" },
};
