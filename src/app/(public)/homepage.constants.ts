import {
  Building2,
  Briefcase,
  Users,
  Shield,
  CheckCircle,
  Search,
  Map,
  LayoutDashboard,
  HardHat,
  User,
  Sparkles,
  Clock,
  BarChart3,
  Smartphone,
  Globe,
  Wallet,
  Target,
  TrendingUp,
} from "lucide-react";

/* ─── SEKTÖRLER ─── */
export const SECTORS = [
  { name: "AVM & Alışveriş Merkezi", icon: Building2 },
  { name: "Perakende & Mağaza", icon: Building2 },
  { name: "Reklam & Tabela", icon: Building2 },
  { name: "Fuarcılık & Etkinlik", icon: Building2 },
  { name: "Mobilya & Dekorasyon", icon: Building2 },
  { name: "Elektrik & Altyapı", icon: Building2 },
];

/* ─── NASIL ÇALIŞIR — 4 ADIM ─── */
export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "İşini Ver",
    desc: "Fotoğraf ekle, konum seç ve işini açıkla. Bütçeni belirt, teklif almaya başla.",
    icon: Briefcase,
    color: "#0B5FFF",
  },
  {
    number: "02",
    title: "Teklif Al",
    desc: "Doğrulanmış montaj ekiplerinden teklifler gelir. Puanları ve fiyatları karşılaştır.",
    icon: Users,
    color: "#00C853",
  },
  {
    number: "03",
    title: "İşi Takip Et",
    desc: "Canlı haritada ekibini takip et, iş ilerledikçe durum güncellemelerini gör.",
    icon: CheckCircle,
    color: "#0B5FFF",
  },
  {
    number: "04",
    title: "Güvenle Öde",
    desc: "İş tamamlanana kadar ödemen emanette. Onay verince ustanın hesabına aktarılır.",
    icon: Shield,
    color: "#00C853",
  },
];

/* ─── GÜVEN KARTLARI ─── */
export const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Doğrulanmış Ekipler",
    desc: "Kimlik, şirket ve uzmanlık bilgileri kontrol edilen montaj ekipleriyle çalışın.",
    color: "#0B5FFF",
  },
  {
    icon: Search,
    title: "Şeffaf Teklif Sistemi",
    desc: "Gelen teklifleri fiyat, puan ve deneyime göre karşılaştırın, size en uygun olanı seçin.",
    color: "#00C853",
  },
  {
    icon: Map,
    title: "Uçtan Uca İş Takibi",
    desc: "İşin her aşamasını platform üzerinden takip edin, durum güncellemelerini anlık görün.",
    color: "#F59E0B",
  },
  {
    icon: LayoutDashboard,
    title: "Kurumsal Operasyon Yönetimi",
    desc: "Çok lokasyonlu montaj projelerini tek panelden yönetin, ekipleri koordine edin.",
    color: "#8B5CF6",
  },
];

/* ─── AI ÖZELLİKLERİ ─── */
export const AI_FEATURES = [
  "Fotoğraftan otomatik iş analizi",
  "Yapay zeka ile tahmini fiyatlandırma",
  "İşine en uygun montaj ekibi eşleştirmesi",
  "Anlık teklif karşılaştırma",
];

/* ─── SSS ─── */
export const FAQS = [
  {
    q: "Nasıl montaj ekibi bulabilirim?",
    a: "İş Ver sayfasından işinizi tanımlayın, fotoğraflarınızı ekleyin ve bütçenizi belirtin. Sistemimiz size uygun doğrulanmış montaj ekiplerinden teklifleri anında iletir.",
  },
  {
    q: "Montaj ekibi nasıl kayıt olabilir?",
    a: "Kaydol sayfasından ücretsiz hesap oluşturun, firma bilgilerinizi ekleyin ve doğrulama sürecini tamamlayın. Onaylanan ekipler hemen teklif almaya başlayabilir.",
  },
  {
    q: "Ödeme nasıl korunuyor?",
    a: "Ödeme işleminiz, iş tamamlanana kadar güvence altında tutulur. İşi onayladığınızda ödeme montaj ekibine aktarılır.",
  },
  {
    q: "Hangi şehirlerde hizmet veriyorsunuz?",
    a: "Türkiye genelinde hizmet ağımız bulunuyor. Uygun ekiplerin olduğu bölgelerde talepler kısa sürede eşleştirilir.",
  },
  {
    q: "Kurumsal çözümler sunuyor musunuz?",
    a: "Evet, zincir mağaza kurulumları, AVM montajları ve fuar standı projeleri için kurumsal çözümler sunuyoruz. Toplu işlerde özel fiyatlandırma ve öncelikli destek sağlıyoruz.",
  },
];

/* ─── KULLANICI YOLLARI ─── */
export const AUDIENCE_CARDS = [
  {
    icon: User,
    title: "Bireysel",
    desc: "Montaj ihtiyacını oluştur",
    href: "/is-ver",
    color: "#0B5FFF",
  },
  {
    icon: Building2,
    title: "Kurumsal",
    desc: "Operasyonlarını yönet",
    href: "/kurumsal",
    color: "#00C853",
  },
  {
    icon: HardHat,
    title: "Montaj Ekibi",
    desc: "İş fırsatlarına ulaş",
    href: "/auth/kayit",
    color: "#F59E0B",
  },
];

/* ─── PLATFORM ÖZELLİKLERİ ─── */
export const FEATURES_GRID = [
  {
    icon: Map,
    title: "Canlı Ekip Takibi",
    desc: "Montaj ekibinin konumunu ve iş durumunu anlık olarak harita üzerinden takip edin.",
    color: "#0B5FFF",
  },
  {
    icon: BarChart3,
    title: "Teklif Yönetimi",
    desc: "Gelen tüm teklifleri karşılaştırmalı görün, en uygun fiyat ve puana göre seçim yapın.",
    color: "#00C853",
  },
  {
    icon: Shield,
    title: "Emanet Ödeme Sistemi",
    desc: "Ödemeniz iş tamamlanana kadar güvende. Onay sizde, ödeme montajcıya otomatik aktarılır.",
    color: "#8B5CF6",
  },
  {
    icon: Clock,
    title: "Zaman Çizelgesi",
    desc: "İşin her aşaması kayıt altında. Geçmiş işlerinize dilediğiniz zaman ulaşın.",
    color: "#F59E0B",
  },
  {
    icon: Smartphone,
    title: "Mobil Uygulama",
    desc: "Saha ekipleriniz mobil uygulama ile iş bildirimlerini anında alsın, durum güncellesin.",
    color: "#EC4899",
  },
  {
    icon: Globe,
    title: "Çoklu Lokasyon",
    desc: "Türkiye genelinde tüm lokasyonlarınızı tek panelden yönetin, ekipleri koordine edin.",
    color: "#0B5FFF",
  },
];

/* ─── KURUMSAL ÇÖZÜMLER ─── */
export const CORPORATE_BENEFITS = [
  {
    icon: LayoutDashboard,
    title: "Merkezi Yönetim Paneli",
    desc: "Tüm montaj projelerinizi tek bir panelden görüntüleyin, ekipleri atayın ve süreci yönetin.",
  },
  {
    icon: BarChart3,
    title: "Performans Raporları",
    desc: "Ekip performansı, iş tamamlama süreleri ve maliyet analizleri ile veriye dayalı kararlar alın.",
  },
  {
    icon: Wallet,
    title: "Toplu İş Fiyatlandırması",
    desc: "Zincir mağaza kurulumları ve AVM projeleri için özel fiyatlandırma ve öncelikli destek.",
  },
];

/* ─── NEDEN BİZ ─── */
export const WHY_ITEMS = [
  {
    icon: Clock,
    title: "Zamandan Tasarruf",
    desc: "Tek tek firma aramak yerine işinizi oluşturun, size uygun ekipler teklif versin. Saatler süren araştırma sürecini dakikalara indirin.",
    color: "#0B5FFF",
  },
  {
    icon: Target,
    title: "Maliyet Şeffaflığı",
    desc: "Tüm teklifler önceden bellidir. Gizli ücret veya sürpriz maliyet yoktur. Bütçenize en uygun teklifi seçersiniz.",
    color: "#00C853",
  },
  {
    icon: TrendingUp,
    title: "Kalite Güvencesi",
    desc: "Doğrulanmış ekipler, gerçek kullanıcı puanları ve tamamlanan iş geçmişi. Her adımda kalite kontrol sağlanır.",
    color: "#8B5CF6",
  },
];

/* ─── CTA — 3 KİTLE ─── */
export const CTA_DATA = {
  badge: "Hemen Başlayın",
  title: "Montaj İşlerinizi Profesyonellere Emanet Edin",
  subtitle: "İster bireysel ister kurumsal olun, montaj ihtiyaçlarınız için doğru ekipler burada.",
  actions: [
    {
      label: "İş Oluştur",
      href: "/is-ver",
      description: "Bireysel kullanıcılar",
      primary: true,
    },
    {
      label: "Demo Talep Et",
      href: "/kurumsal",
      description: "Kurumsal çözümler",
      primary: false,
    },
    {
      label: "Montajcı Kaydı",
      href: "/auth/kayit",
      description: "Ekibini büyüt",
      primary: false,
    },
  ],
};
