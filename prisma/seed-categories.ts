// 100+ Kategori Seed Script
// Çalıştırma: npx tsx prisma/seed-categories.ts
// Bu script mevcut kategorileri silmez, sadece ekleme yapar.
// Aynı slug'a sahip kategori varsa onu atlar (upsert mantığı).

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CategorySeed {
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  metaTitle?: string;
  metaDesc?: string;
  sortOrder: number;
  children?: CategorySeed[];
}

const categories: CategorySeed[] = [
  {
    name: "Mobilya Montajı",
    slug: "mobilya-montaji",
    icon: "🪑",
    metaTitle: "Mobilya Montajı - Profesyonel Mobilya Kurulum Hizmeti",
    metaDesc: "IKEA, Koçtaş, Vivense, Bellona, İstikbal ve tüm markalar için profesyonel mobilya montaj hizmeti.",
    sortOrder: 1,
    children: [
      { name: "IKEA Mobilya Montajı", slug: "ikea-mobilya-montaji", sortOrder: 1, metaTitle: "IKEA Mobilya Montajı - Profesyonel IKEA Kurulum", metaDesc: "IKEA mobilyalarınızın profesyonel montajı. Dolap, yatak, masa, raf sistemi kurulumu." },
      { name: "Koçtaş Mobilya Montajı", slug: "koctas-mobilya-montaji", sortOrder: 2, metaTitle: "Koçtaş Mobilya Montajı - Koçtaş Ürün Kurulumu", metaDesc: "Koçtaş'tan aldığınız mobilyaların profesyonel montaj hizmeti." },
      { name: "Vivense Mobilya Montajı", slug: "vivense-mobilya-montaji", sortOrder: 3 },
      { name: "Bellona Mobilya Montajı", slug: "bellona-mobilya-montaji", sortOrder: 4 },
      { name: "İstikbal Mobilya Montajı", slug: "istikbal-mobilya-montaji", sortOrder: 5 },
      { name: "Özel Yapım Mobilya", slug: "ozel-yapim-mobilya", sortOrder: 6 },
      { name: "TV Ünitesi Montajı", slug: "tv-unitesi-montaji", sortOrder: 7 },
      { name: "Mutfak Dolabı Montajı", slug: "mutfak-dolabi-montaji", sortOrder: 8 },
      { name: "Gardırop Montajı", slug: "gardrop-montaji", sortOrder: 9 },
      { name: "Vestiyer & Ayakkabılık", slug: "vestiyer-ayakkabilik-montaji", sortOrder: 10 },
      { name: "Çalışma Masası Montajı", slug: "calisma-masasi-montaji", sortOrder: 11 },
      { name: "Bebek Odası Mobilya", slug: "bebek-odasi-mobilya-montaji", sortOrder: 12 },
      { name: "Ofis Mobilya Montajı", slug: "ofis-mobilya-montaji", sortOrder: 13 },
    ],
  },
  {
    name: "Klima Montajı",
    slug: "klima-montaji",
    icon: "❄️",
    metaTitle: "Klima Montajı - Profesyonel Klima Kurulum Hizmeti",
    metaDesc: "Split, multi split ve VRF klima montajı. Tüm markalar için profesyonel kurulum ve bakım.",
    sortOrder: 2,
    children: [
      { name: "Split Klima Montajı", slug: "split-klima-montaji", sortOrder: 1 },
      { name: "Multi Split Klima", slug: "multi-split-klima-montaji", sortOrder: 2 },
      { name: "VRF/VRV Klima", slug: "vrf-vrv-klima-montaji", sortOrder: 3 },
      { name: "Klima Bakımı", slug: "klima-bakimi", sortOrder: 4 },
      { name: "Klima Tamiri", slug: "klima-tamiri", sortOrder: 5 },
      { name: "Merkezi Klima", slug: "merkezi-klima-montaji", sortOrder: 6 },
    ],
  },
  {
    name: "Reklam & Tabela",
    slug: "reklam-tabela",
    icon: "📋",
    metaTitle: "Reklam Tabelası Montajı - Profesyonel Tabela Kurulumu",
    metaDesc: "LED tabela, ışıklı harf, totem, cam folyo ve tüm reklam tabela montaj hizmetleri.",
    sortOrder: 3,
    children: [
      { name: "LED Tabela Montajı", slug: "led-tabela-montaji", sortOrder: 1 },
      { name: "LED Ekran Montajı", slug: "led-ekran-montaji", sortOrder: 2 },
      { name: "Işıklı Harf Montajı", slug: "isikli-harf-montaji", sortOrder: 3 },
      { name: "Totem Tabela", slug: "totem-tabela-montaji", sortOrder: 4 },
      { name: "Cam Folyo Uygulama", slug: "cam-folyo-uygulama", sortOrder: 5 },
      { name: "Vinil Kaplama", slug: "vinil-kaplama", sortOrder: 6 },
      { name: "Mekan İçi Tabela", slug: "mekan-ici-tabela", sortOrder: 7 },
      { name: "Döviz & Poster", slug: "doviz-poster-montaji", sortOrder: 8 },
    ],
  },
  {
    name: "Stand Kurulumu",
    slug: "stand-kurulumu",
    icon: "🏪",
    metaTitle: "Stand Kurulumu - Fuar ve Mağaza Stand Montajı",
    metaDesc: "Fuar standı, AVM standı, mağaza içi stand kurulum ve söküm hizmetleri.",
    sortOrder: 4,
    children: [
      { name: "Fuar Standı Kurulumu", slug: "fuar-standi-kurulumu", sortOrder: 1 },
      { name: "AVM Standı Kurulumu", slug: "avm-standi-kurulumu", sortOrder: 2 },
      { name: "Mağaza Standı", slug: "magaza-standi-kurulumu", sortOrder: 3 },
      { name: "Podyum & Sahne", slug: "podyum-sahne-kurulumu", sortOrder: 4 },
      { name: "Promosyon Standı", slug: "promosyon-standi", sortOrder: 5 },
      { name: "Stand Söküm", slug: "stand-sokum", sortOrder: 6 },
    ],
  },
  {
    name: "AVM Montaj",
    slug: "avm-montaj",
    icon: "🏬",
    metaTitle: "AVM Montaj Hizmeti - Alışveriş Merkezi Kurulum",
    metaDesc: "AVM'lerde mağaza açılış, gece montaj, raf sistemleri ve dekorasyon montaj hizmetleri.",
    sortOrder: 5,
    children: [
      { name: "Gece Montaj", slug: "avm-gece-montaj", sortOrder: 1 },
      { name: "Mağaza Açılış Kurulumu", slug: "avm-magaza-acilis", sortOrder: 2 },
      { name: "AVM Raf Sistemi", slug: "avm-raf-sistemi", sortOrder: 3 },
      { name: "AVM Dekorasyon", slug: "avm-dekorasyon-montaji", sortOrder: 4 },
    ],
  },
  {
    name: "Elektrik Tesisatı",
    slug: "elektrik-tesisati",
    icon: "⚡",
    metaTitle: "Elektrik Tesisatı - Profesyonel Elektrik Montaj Hizmeti",
    metaDesc: "Anahtar/priz montajı, sigorta panosu, aydınlatma, akıllı ev ve şantiye elektrik işleri.",
    sortOrder: 6,
    children: [
      { name: "Anahtar & Priz Montajı", slug: "anahtar-priz-montaji", sortOrder: 1 },
      { name: "Sigorta & Pano", slug: "sigorta-pano-montaji", sortOrder: 2 },
      { name: "Aydınlatma Montajı", slug: "aydinlatma-montaji", sortOrder: 3 },
      { name: "Akıllı Ev Sistemi", slug: "akilli-ev-sistemi", sortOrder: 4 },
      { name: "Şantiye Elektrik", slug: "santiye-elektrik", sortOrder: 5 },
      { name: "Topraklama & Paratoner", slug: "topraklama-paratoner", sortOrder: 6 },
      { name: "Jeneratör Montajı", slug: "jenarator-montaji", sortOrder: 7 },
      { name: "Kombi Termostat", slug: "kombi-termostat-montaji", sortOrder: 8 },
    ],
  },
  {
    name: "Mekanik Tesisat",
    slug: "mekanik-tesisat",
    icon: "🔧",
    metaTitle: "Mekanik Tesisat - Profesyonel Mekanik Montaj",
    metaDesc: "Doğalgaz, sıhhi tesisat, kalorifer, havalandırma ve endüstriyel mekanik montaj.",
    sortOrder: 7,
    children: [
      { name: "Doğalgaz Montajı", slug: "dogalgaz-montaji", sortOrder: 1 },
      { name: "Sıhhi Tesisat", slug: "sihhi-tesisat", sortOrder: 2 },
      { name: "Kalorifer Tesisi", slug: "kalorifer-tesisi", sortOrder: 3 },
      { name: "Havalandırma Montajı", slug: "havalandirma-montaji", sortOrder: 4 },
      { name: "Isıtma Soğutma", slug: "isitma-sogutma", sortOrder: 5 },
      { name: "Endüstriyel Mekanik", slug: "endustriyel-mekanik", sortOrder: 6 },
    ],
  },
  {
    name: "İnşaat & Yapı",
    slug: "insaat-yapi",
    icon: "🏗️",
    metaTitle: "İnşaat Montaj Hizmetleri - Profesyonel Yapı Montaj",
    metaDesc: "Alçıpan, seramik, cephe kaplama, çelik konstrüksiyon, cam balkon ve inşaat montaj işleri.",
    sortOrder: 8,
    children: [
      { name: "Alçıpan Montajı", slug: "alcipan-montaji", sortOrder: 1 },
      { name: "Seramik & Fayans", slug: "seramik-fayans", sortOrder: 2 },
      { name: "Cephe Kaplama", slug: "cephe-kaplama", sortOrder: 3 },
      { name: "Çelik Konstrüksiyon", slug: "celik-konstruksiyon", sortOrder: 4 },
      { name: "Cam Balkon", slug: "cam-balkon-montaji", sortOrder: 5 },
      { name: "PVC Pencere & Kapı", slug: "pvc-pencere-kapi-montaji", sortOrder: 6 },
      { name: "Çatı & Kiremit", slug: "cati-kiremit", sortOrder: 7 },
      { name: "Isı Yalıtımı", slug: "isi-yalitimi", sortOrder: 8 },
      { name: "Beton & Demir", slug: "beton-demir", sortOrder: 9 },
      { name: "İskele Kurulumu", slug: "iskele-kurulumu", sortOrder: 10 },
    ],
  },
  {
    name: "Kaynak İşleri",
    slug: "kaynak-isleri",
    icon: "🔥",
    metaTitle: "Kaynak İşleri - Profesyonel Kaynak Montaj Hizmeti",
    metaDesc: "Demir, alüminyum, paslanmaz çelik kaynak ve imalat işleri.",
    sortOrder: 9,
    children: [
      { name: "Demir Kaynak", slug: "demir-kaynak", sortOrder: 1 },
      { name: "Alüminyum Kaynak", slug: "aluminyum-kaynak", sortOrder: 2 },
      { name: "Paslanmaz Kaynak", slug: "paslanmaz-kaynak", sortOrder: 3 },
      { name: "Korkuluk & Küpeşte", slug: "korkuluk-kupeste", sortOrder: 4 },
    ],
  },
  {
    name: "Güvenlik Sistemleri",
    slug: "guvenlik-sistemleri",
    icon: "📹",
    metaTitle: "Güvenlik Sistemi Montajı - Kamera ve Alarm Kurulumu",
    metaDesc: "Güvenlik kamerası, alarm sistemi, geçiş kontrolü ve akıllı güvenlik çözümleri montajı.",
    sortOrder: 10,
    children: [
      { name: "Güvenlik Kamerası", slug: "guvenlik-kamerasi-montaji", sortOrder: 1 },
      { name: "Alarm Sistemi", slug: "alarm-sistemi-montaji", sortOrder: 2 },
      { name: "Geçiş Kontrolü", slug: "grcis-kontrol-sistemi", sortOrder: 3 },
      { name: "Yangın Alarm", slug: "yangin-alarm-montaji", sortOrder: 4 },
      { name: "Kamera Bakımı", slug: "kamera-bakimi", sortOrder: 5 },
    ],
  },
  {
    name: "Network & Altyapı",
    slug: "network-altyapi",
    icon: "🌐",
    metaTitle: "Network Altyapı Montajı - Fiber ve Veri Kablolama",
    metaDesc: "Fiber optik, network kablolama, sunucu kurulumu ve IT altyapı montaj hizmetleri.",
    sortOrder: 11,
    children: [
      { name: "Fiber Optik Montaj", slug: "fiber-optik-montaj", sortOrder: 1 },
      { name: "Network Kablolama", slug: "network-kablolama", sortOrder: 2 },
      { name: "Sunucu Kurulum", slug: "sunucu-kurulum", sortOrder: 3 },
      { name: "WiFi Altyapı", slug: "wifi-altyapi", sortOrder: 4 },
      { name: "Santral Montajı", slug: "santral-montaji", sortOrder: 5 },
      { name: "Acil Durum Sistemi", slug: "acil-durum-sistemi", sortOrder: 6 },
    ],
  },
  {
    name: "Güneş Enerjisi",
    slug: "gunes-enerjisi",
    icon: "☀️",
    metaTitle: "Güneş Enerjisi Montajı - Solar Panel Kurulumu",
    metaDesc: "Solar panel, güneş enerji sistemi kurulumu ve bakım hizmetleri.",
    sortOrder: 12,
    children: [
      { name: "Solar Panel Montajı", slug: "solar-panel-montaji", sortOrder: 1 },
      { name: "İnverter Montajı", slug: "inverter-montaji", sortOrder: 2 },
      { name: "Sıcak Su Sistemi", slug: "solar-sicak-su-sistemi", sortOrder: 3 },
      { name: "Solar Bakım", slug: "solar-bakim", sortOrder: 4 },
    ],
  },
  {
    name: "Dekorasyon & İç Mimari",
    slug: "dekorasyon-ic-mimari",
    icon: "🎨",
    metaTitle: "Dekorasyon Montajı - İç Mimari Kurulum Hizmetleri",
    metaDesc: "Duvar kağıdı, perde, ayna, raf ve dekoratif ürün montajı.",
    sortOrder: 13,
    children: [
      { name: "Duvar Kağıdı Uygulama", slug: "duvar-kagidi-uygulama", sortOrder: 1 },
      { name: "Perde & Stor Montajı", slug: "perde-stor-montaji", sortOrder: 2 },
      { name: "Duvar Rafı", slug: "duvar-rafi-montaji", sortOrder: 3 },
      { name: "Ayna & Tablo", slug: "ayna-tablo-montaji", sortOrder: 4 },
      { name: "3D Panel Montajı", slug: "3d-panel-montaji", sortOrder: 5 },
      { name: "Süpürgelik", slug: "supurgelik-montaji", sortOrder: 6 },
    ],
  },
  {
    name: "Pergola & Gölgelendirme",
    slug: "pergola-golgelendirme",
    icon: "🌿",
    metaTitle: "Pergola Montajı - Gölgelendirme Sistemleri Kurulumu",
    metaDesc: "Pergola, tente, güneş kırıcı ve dış mekan gölgelendirme sistemleri montajı.",
    sortOrder: 14,
    children: [
      { name: "Pergola Montajı", slug: "pergola-montaji", sortOrder: 1 },
      { name: "Tente Montajı", slug: "tente-montaji", sortOrder: 2 },
      { name: "Güneş Kırıcı", slug: "gunes-kirici-montaji", sortOrder: 3 },
      { name: "Çardak Kurulumu", slug: "cardak-kurulumu", sortOrder: 4 },
    ],
  },
  {
    name: "Endüstriyel Montaj",
    slug: "endustriyel-montaj",
    icon: "🏭",
    metaTitle: "Endüstriyel Montaj - Makine ve Ekipman Kurulumu",
    metaDesc: "Endüstriyel makine, üretim hattı, konveyör bant ve fabrika ekipman montajı.",
    sortOrder: 15,
    children: [
      { name: "Makine Montajı", slug: "makine-montaji", sortOrder: 1 },
      { name: "Konveyör Bant", slug: "konveyor-bant-montaji", sortOrder: 2 },
      { name: "Üretim Hattı", slug: "uretim-hatti-kurulumu", sortOrder: 3 },
      { name: "Hidrolik Sistem", slug: "hidrolik-sistem-montaji", sortOrder: 4 },
      { name: "Pnömatik Sistem", slug: "pnomotik-sistem-montaji", sortOrder: 5 },
      { name: "Endüstriyel Bakım", slug: "endustriyel-bakim", sortOrder: 6 },
    ],
  },
  {
    name: "Spor & Oyun Alanı",
    slug: "spor-oyun-alani",
    icon: "⚽",
    metaTitle: "Spor ve Oyun Alanı Montajı",
    metaDesc: "Spor aleti, oyun parkı, fitness ekipmanı ve halı saha montaj hizmetleri.",
    sortOrder: 16,
    children: [
      { name: "Fitness Ekipman Montajı", slug: "fitness-ekipman-montaji", sortOrder: 1 },
      { name: "Oyun Parkı Kurulumu", slug: "oyun-parki-kurulumu", sortOrder: 2 },
      { name: "Halı Saha Montajı", slug: "hali-saha-montaji", sortOrder: 3 },
      { name: "Spor Aleti Montajı", slug: "spor-aleti-montaji", sortOrder: 4 },
    ],
  },
  {
    name: "Elektronik & Beyaz Eşya",
    slug: "elektronik-beyaz-esya",
    icon: "📺",
    metaTitle: "Elektronik ve Beyaz Eşya Montajı",
    metaDesc: "Televizyon, beyaz eşya, ev aletleri kurulum ve montaj hizmetleri.",
    sortOrder: 17,
    children: [
      { name: "TV Duvar Montajı", slug: "tv-duvar-montaji", sortOrder: 1 },
      { name: "Beyaz Eşya Montajı", slug: "beyaz-esya-montaji", sortOrder: 2 },
      { name: "Projeksiyon Kurulumu", slug: "projeksiyon-kurulumu", sortOrder: 3 },
      { name: "Ses Sistemi Montajı", slug: "ses-sistemi-montaji", sortOrder: 4 },
      { name: "Akıllı Cihaz Kurulum", slug: "akilli-cihaz-kurulum", sortOrder: 5 },
    ],
  },
  {
    name: "Nakliye & Taşıma",
    slug: "nakliye-tasima",
    icon: "🚚",
    metaTitle: "Nakliye ve Taşıma Hizmetleri",
    metaDesc: "Mobilya nakliyesi, parça taşıma ve montajlı nakliye hizmetleri.",
    sortOrder: 18,
    children: [
      { name: "Mobilya Nakliyesi", slug: "mobilya-nakliyesi", sortOrder: 1 },
      { name: "Parça Taşıma", slug: "parca-tasima", sortOrder: 2 },
      { name: "Montajlı Nakliye", slug: "montajli-nakliye", sortOrder: 3 },
      { name: "Atık Toplama", slug: "atik-toplama", sortOrder: 4 },
    ],
  },
  {
    name: "Peyzaj & Dış Mekan",
    slug: "peyzaj-dis-mekan",
    icon: "🌳",
    metaTitle: "Peyzaj ve Dış Mekan Montaj Hizmetleri",
    metaDesc: "Bahçe düzenleme, ahşap deck, çit ve dış mekan yapı montajı.",
    sortOrder: 19,
    children: [
      { name: "Ahşap Deck Montajı", slug: "ahsap-deck-montaji", sortOrder: 1 },
      { name: "Çit & Panel", slug: "cit-panel-montaji", sortOrder: 2 },
      { name: "Bahçe Mobilyası", slug: "bahce-mobilyasi-montaji", sortOrder: 3 },
      { name: "Seracılık Montajı", slug: "seracilik-panel-montaji", sortOrder: 4 },
    ],
  },
  {
    name: "Diğer Montaj Hizmetleri",
    slug: "diger-montaj-hizmetleri",
    icon: "🔩",
    metaTitle: "Diğer Montaj Hizmetleri",
    metaDesc: "Beyaz eşyadan endüstriyel makinelere tüm montaj hizmetleri.",
    sortOrder: 99,
    children: [
      { name: "Genel Montaj", slug: "genel-montaj", sortOrder: 1 },
      { name: "Teknik Servis", slug: "teknik-servis", sortOrder: 2 },
      { name: "Demonte & Söküm", slug: "demonte-sokum", sortOrder: 3 },
    ],
  },
];

async function main() {
  console.log("🌱 Kategori seed başlıyor...\n");

  let createdCount = 0;
  let skippedCount = 0;

  for (const parent of categories) {
    // Ana kategori
    const existingParent = await prisma.category.findUnique({
      where: { slug: parent.slug },
    });

    let parentId: number;

    if (existingParent) {
      parentId = existingParent.id;
      skippedCount++;
      console.log(`⏭️  Ana kategori mevcut: ${parent.name}`);
      // Yine de mevcut kategoriyi güncelle (yeni alanlar için)
      await prisma.category.update({
        where: { id: parentId },
        data: {
          icon: parent.icon,
          image: parent.image,
          metaTitle: parent.metaTitle,
          metaDesc: parent.metaDesc,
          sortOrder: parent.sortOrder,
          isActive: true,
        },
      });
    } else {
      const created = await prisma.category.create({
        data: {
          name: parent.name,
          slug: parent.slug,
          icon: parent.icon,
          image: parent.image,
          metaTitle: parent.metaTitle,
          metaDesc: parent.metaDesc,
          sortOrder: parent.sortOrder,
          isActive: true,
        },
      });
      parentId = created.id;
      createdCount++;
      console.log(`✅  Ana kategori eklendi: ${parent.name}`);
    }

    // Alt kategoriler
    if (parent.children) {
      for (const child of parent.children) {
        const existingChild = await prisma.category.findUnique({
          where: { slug: child.slug },
        });

        if (existingChild) {
          skippedCount++;
          // Alt kategoriyse parentID'yi güncelle
          if (existingChild.parentId !== parentId) {
            await prisma.category.update({
              where: { id: existingChild.id },
              data: {
                parentId,
                metaTitle: child.metaTitle,
                metaDesc: child.metaDesc,
                sortOrder: child.sortOrder,
                isActive: true,
              },
            });
          }
        } else {
          await prisma.category.create({
            data: {
              name: child.name,
              slug: child.slug,
              parentId,
              metaTitle: child.metaTitle,
              metaDesc: child.metaDesc,
              sortOrder: child.sortOrder,
              isActive: true,
            },
          });
          createdCount++;
          console.log(`  ├─ ✅ Alt kategori: ${child.name}`);
        }
      }
    }
  }

  console.log(`\n📊 Özet: ${createdCount} yeni eklendi, ${skippedCount} mevcut/atlandı`);
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
