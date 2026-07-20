export interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    themeColor: string;
    favicon: string;
    logoText: string;
    logoAccentText: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineHighlight: string;
    description: string;
    searchPlaceholder: string;
    searchButtonLabel: string;
    popularLabel: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  trustBar: {
    items: { id: string; label: string }[];
  };
  audience: {
    sectionBadge: string;
    sectionTitle: string;
    sectionDescription: string;
  };
  services: {
    sectionTitle: string;
    sectionDescription: string;
    viewAllLabel: string;
  };
  workflow: {
    sectionTitle: string;
    sectionDescription: string;
    speedTestLabel: string;
    speedTestValue: string;
    steps: {
      step: string;
      title: string;
      description: string;
      bullets: string[];
    }[];
  };
  capabilities: {
    sectionTitle: string;
    sectionDescription: string;
  };
  whyUs: {
    sectionTitle: string;
    sectionDescription: string;
  };
  faq: {
    sectionTitle: string;
    sectionDescription: string;
  };
  finalCta: {
    title: string;
    description: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    trustSignals: string[];
  };
  footer: {
    description: string;
    copyright: string;
  };
  corporate: {
    sectionTitle: string;
    sectionDescription: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    siteName: "Montajım Var",
    siteDescription:
      "Türkiye'nin profesyonel montaj platformu. Mobilya, klima, tabela, AVM, fuar standı, elektrik ve endüstriyel montaj hizmetleri için doğrulanmış ekiplerden anında teklif alın.",
    siteUrl: "https://montajimvar.xyz",
    themeColor: "#0B5FFF",
    favicon: "/favicon.ico",
    logoText: "Montajım",
    logoAccentText: "Var",
  },
  hero: {
    badge: "Profesyonel Montaj Platformu",
    headline: "Türkiye'nin profesyonel montaj platformu",
    headlineHighlight: "montaj platformu",
    description:
      "Bireysel ya da kurumsal fark etmez: işinizi 3 dakikada tanımlayın, doğrulanmış ekiplerden teklifleri tek tabloda karşılaştırın, ödemeyi emanette tutarak güvenle tamamlayın.",
    searchPlaceholder:
      "Hangi montaj hizmetini arıyorsunuz? Örn: IKEA, Klima...",
    searchButtonLabel: "Ara",
    popularLabel: "Popüler:",
    primaryCta: { label: "Ücretsiz İş Oluştur", href: "/is-ver" },
    secondaryCta: { label: "Usta Olarak Katıl", href: "/auth/kayit" },
  },
  trustBar: {
    items: [
      { id: "escrow", label: "Emanet ödeme" },
      { id: "verified", label: "Doğrulanmış ekipler" },
      { id: "coverage", label: "81 il · hızlı eşleşme" },
    ],
  },
  audience: {
    sectionBadge: "Kimler İçin",
    sectionTitle: "Platform, dört ayrı kullanıcı için tasarlandı.",
    sectionDescription:
      "Bireyselden kurumsala, montaj ekibinden üreticiye kadar her role özel bir başlangıç noktası. Doğru yoldan ilerleyin.",
  },
  services: {
    sectionTitle: "Tek bir yerden, 8 ana hizmet kategorisi.",
    sectionDescription:
      "Evden kurumsala, beyaz eşyadan akıllı ev kurulumuna kadar ihtiyacınızı tanımlayın — geri kalanını platform halletsin.",
    viewAllLabel: "Tümünü Gör",
  },
  workflow: {
    sectionTitle: "Tanımla · karşılaştır · güvenle tamamla.",
    sectionDescription:
      "Dört adımda sahadan teslimata kadar tüm süreç. İşinizi 3 dakikada açın, gerisini platform yönetsin.",
    speedTestLabel: "Hız testi:",
    speedTestValue: "2 dk 48 sn",
    steps: [
      {
        step: "01",
        title: "İşinizi Tanımlayın",
        description:
          "Konum, tarih ve hizmet detaylarını girip birkaç dakikada iş ilanınızı oluşturun.",
        bullets: ["Konum & şehir otomatik önerisi", "Zamandan tasarruf: ~3 dk"],
      },
      {
        step: "02",
        title: "Teklifleri Karşılaştırın",
        description:
          "Doğrulanmış ekiplerden gelen teklifleri yan yana görün: fiyat, puan, portföy.",
        bullets: ["Şeffaf fiyat & puan", "Gerçek müşteri yorumları"],
      },
      {
        step: "03",
        title: "Güvenli Şekilde Ödeyin",
        description:
          "Ödeme, iş teslim edene kadar emanet hesapta bekler. Hiçbir risk yok.",
        bullets: ["Emanet ödeme koruması", "İade & itiraz süreçleri"],
      },
      {
        step: "04",
        title: "Süreci Takip Edin",
        description:
          "Ekip sahadayken adım adım güncelleme alın. Tamamlanınca puanlayın.",
        bullets: ["Anlık durum bildirimi", "Yorumlarla kalite kontrolü"],
      },
    ],
  },
  capabilities: {
    sectionTitle: "Tek platform; pazar, operasyon, güven.",
    sectionDescription: "",
  },
  whyUs: {
    sectionTitle: "Neden Montajım Var?",
    sectionDescription: "",
  },
  faq: {
    sectionTitle: "Sıkça Sorulan Sorular",
    sectionDescription: "",
  },
  finalCta: {
    title: "Montaj İşinizi Başlatmaya Hazır mısınız?",
    description:
      "3 dakikada iş ilanı oluştur, doğrulanmış ekiplerden teklif al, güvenle tamamla.",
    primary: { label: "Ücretsiz İş Oluştur", href: "/is-ver" },
    secondary: { label: "Platformu Keşfet", href: "#platform" },
    trustSignals: [
      "Emanet ödeme",
      "Doğrulanmış ekipler",
      "81 il · ücretsiz iş ilanı",
    ],
  },
  footer: {
    description:
      "Kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturan profesyonel platform.",
    copyright: "Montajım Var. Tüm hakları saklıdır.",
  },
  corporate: {
    sectionTitle: "Mağaza zincirlerinden üreticilere; sahadaki tek panonuz.",
    sectionDescription: "",
  },
};

export interface SettingGroupConfig {
  key: string;
  label: string;
  fields: SettingFieldConfig[];
}

export interface SettingFieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "color" | "image" | "json" | "link";
  description?: string;
  placeholder?: string;
}

export const SETTING_GROUPS: SettingGroupConfig[] = [
  {
    key: "general",
    label: "Genel Ayarlar",
    fields: [
      { key: "siteName", label: "Site Adı", type: "text" },
      { key: "siteDescription", label: "Site Açıklaması (SEO)", type: "textarea" },
      { key: "themeColor", label: "Tema Rengi", type: "color" },
      { key: "logoText", label: "Logo Metni", type: "text" },
      { key: "logoAccentText", label: "Logo Vurgu Metni", type: "text" },
    ],
  },
  {
    key: "hero",
    label: "Hero Bölümü",
    fields: [
      { key: "badge", label: "Rozet Yazısı", type: "text" },
      { key: "headline", label: "Ana Başlık", type: "textarea" },
      { key: "headlineHighlight", label: "Vurgulu Kelime", type: "text", description: "Ana başlıkta gradient gösterilecek kelime" },
      { key: "description", label: "Açıklama Metni", type: "textarea" },
      { key: "searchPlaceholder", label: "Arama Kutusu Placeholder", type: "text" },
      { key: "searchButtonLabel", label: "Arama Butonu Yazısı", type: "text" },
      { key: "popularLabel", label: "Popüler Etiketi", type: "text" },
      {
        key: "primaryCta", label: "Ana CTA Butonu", type: "link",
        description: '{"label":"Buton Yazısı","href":"Link"}',
      },
      {
        key: "secondaryCta", label: "İkincil CTA Butonu", type: "link",
        description: '{"label":"Buton Yazısı","href":"Link"}',
      },
    ],
  },
  {
    key: "audience",
    label: "Hedef Kitle Bölümü",
    fields: [
      { key: "sectionBadge", label: "Bölüm Rozeti", type: "text" },
      { key: "sectionTitle", label: "Bölüm Başlığı", type: "textarea" },
      { key: "sectionDescription", label: "Bölüm Açıklaması", type: "textarea" },
    ],
  },
  {
    key: "services",
    label: "Hizmetler Bölümü",
    fields: [
      { key: "sectionTitle", label: "Bölüm Başlığı", type: "textarea" },
      { key: "sectionDescription", label: "Bölüm Açıklaması", type: "textarea" },
      { key: "viewAllLabel", label: "Tümünü Gör Butonu", type: "text" },
    ],
  },
  {
    key: "workflow",
    label: "Nasıl Çalışır Bölümü",
    fields: [
      { key: "sectionTitle", label: "Bölüm Başlığı", type: "textarea" },
      { key: "sectionDescription", label: "Bölüm Açıklaması", type: "textarea" },
      { key: "speedTestLabel", label: "Hız Testi Etiketi", type: "text" },
      { key: "speedTestValue", label: "Hız Testi Değeri", type: "text", description: "Örn: 2 dk 48 sn" },
    ],
  },
  {
    key: "finalCta",
    label: "Final CTA Bölümü",
    fields: [
      { key: "title", label: "Başlık", type: "textarea" },
      { key: "description", label: "Açıklama", type: "textarea" },
      { key: "primary", label: "Ana Buton", type: "link", description: '{"label":"Buton Yazısı","href":"Link"}' },
      { key: "secondary", label: "İkincil Buton", type: "link", description: '{"label":"Buton Yazısı","href":"Link"}' },
    ],
  },
  {
    key: "footer",
    label: "Footer (Altbilgi)",
    fields: [
      { key: "description", label: "Açıklama Metni", type: "textarea" },
      { key: "copyright", label: "Telif Hakkı Metni", type: "text" },
    ],
  },
];
