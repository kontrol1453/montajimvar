import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Mobilya Montajı", slug: "mobilya-montaji", icon: "🪑" },
    }),
    prisma.category.create({
      data: { name: "Beyaz Eşya Montajı", slug: "beyaz-esya-montaji", icon: "🧊" },
    }),
    prisma.category.create({
      data: { name: "Klima Montajı", slug: "klima-montaji", icon: "❄️" },
    }),
    prisma.category.create({
      data: { name: "Elektrik Montajı", slug: "elektrik-montaji", icon: "⚡" },
    }),
    prisma.category.create({
      data: { name: "Sıhhi Tesisat", slug: "sihhi-tesisat", icon: "🔧" },
    }),
    prisma.category.create({
      data: { name: "Kapı & Pencere Montajı", slug: "kapi-pencere-montaji", icon: "🚪" },
    }),
    prisma.category.create({
      data: { name: "Mutfak & Banyo Montajı", slug: "mutfak-banyo-montaji", icon: "🍳" },
    }),
    prisma.category.create({
      data: { name: "Diğer", slug: "diger", icon: "📦" },
    }),
  ]);

  console.log(`✓ ${categories.length} kategori oluşturuldu`);

  // Create test users
  const password = await bcrypt.hash("123456", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@montajimvar.com",
      password,
      phone: "0532 000 00 00",
      roles: ["ADMIN"],
      city: "İstanbul",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Ahmet Müşteri",
      email: "musteri@test.com",
      password,
      phone: "0532 111 22 33",
      roles: ["CUSTOMER"],
      city: "İstanbul",
    },
  });

  const assembler1 = await prisma.user.create({
    data: {
      name: "Mehmet Usta",
      email: "montajci@test.com",
      password,
      phone: "0532 222 33 44",
      roles: ["ASSEMBLER"],
      city: "İstanbul",
    },
  });

  const assembler2 = await prisma.user.create({
    data: {
      name: "Ali Montaj",
      email: "ali@test.com",
      password,
      phone: "0532 333 44 55",
      roles: ["ASSEMBLER"],
      city: "Ankara",
    },
  });

  const manufacturer = await prisma.user.create({
    data: {
      name: "Veli Üretici",
      email: "uretici@test.com",
      password,
      phone: "0532 444 55 66",
      roles: ["MANUFACTURER"],
      city: "Bursa",
    },
  });

  console.log("✓ 5 kullanıcı oluşturuldu (1 admin + 4 test)");

  // Create profiles for assemblers and manufacturers
  await prisma.profile.create({
    data: {
      userId: assembler1.id,
      companyName: "İstanbul Usta Montaj",
      description:
        "10 yıllık deneyimimizle İstanbul'un her semtinde mobilya, mutfak ve beyaz eşya montajı hizmeti veriyoruz. Profesyonel ekibimizle hızlı ve güvenilir montaj garantisi.",
      categoryId: categories[0].id,
      city: "İstanbul",
      address: "Kadıköy, İstanbul",
      phone: "0532 222 33 44",
      website: "istanbulusta.com",
      whatsapp: "0532 222 33 44",
      isVerified: true,
      ratingAvg: 4.5,
      reviewCount: 2,
    },
  });

  await prisma.profile.create({
    data: {
      userId: assembler2.id,
      companyName: "Ankara Montaj Servisi",
      description:
        "Ankara ve çevresinde klima, beyaz eşya ve mobilya montajı yapıyoruz. 7/24 hizmet, uygun fiyat garantisi.",
      categoryId: categories[2].id,
      city: "Ankara",
      address: "Çankaya, Ankara",
      phone: "0532 333 44 55",
      website: "ankaramontaj.com",
      isVerified: true,
      ratingAvg: 4.0,
      reviewCount: 1,
    },
  });

  await prisma.profile.create({
    data: {
      userId: manufacturer.id,
      companyName: "Bursa Mobilya Üretim",
      description:
        "Modern tasarım mobilyalar üretiyoruz. Ürünlerimiz için Türkiye genelinde montajcı arıyoruz. Bayi ve montajcı başvurularına açığız.",
      categoryId: categories[6].id,
      city: "Bursa",
      address: "Osmangazi, Bursa",
      phone: "0532 444 55 66",
      website: "bursamobilya.com.tr",
      isVerified: false,
    },
  });

  console.log("✓ 3 firma profili oluşturuldu");

  // Get profiles by userId for reviews and categories
  const profile1 = await prisma.profile.findUniqueOrThrow({ where: { userId: assembler1.id } });
  const profile2 = await prisma.profile.findUniqueOrThrow({ where: { userId: assembler2.id } });
  const profile3 = await prisma.profile.findUniqueOrThrow({ where: { userId: manufacturer.id } });

  // Seed ProfileCategory join table
  await prisma.profileCategory.upsert({
    where: { profileId_categoryId: { profileId: profile1.id, categoryId: categories[0].id } },
    update: {},
    create: { profileId: profile1.id, categoryId: categories[0].id },
  });
  await prisma.profileCategory.upsert({
    where: { profileId_categoryId: { profileId: profile1.id, categoryId: categories[1].id } },
    update: {},
    create: { profileId: profile1.id, categoryId: categories[1].id },
  });
  await prisma.profileCategory.upsert({
    where: { profileId_categoryId: { profileId: profile2.id, categoryId: categories[2].id } },
    update: {},
    create: { profileId: profile2.id, categoryId: categories[2].id },
  });
  await prisma.profileCategory.upsert({
    where: { profileId_categoryId: { profileId: profile2.id, categoryId: categories[0].id } },
    update: {},
    create: { profileId: profile2.id, categoryId: categories[0].id },
  });
  await prisma.profileCategory.upsert({
    where: { profileId_categoryId: { profileId: profile3.id, categoryId: categories[6].id } },
    update: {},
    create: { profileId: profile3.id, categoryId: categories[6].id },
  });

  console.log("✓ Profil-kategori ilişkileri oluşturuldu");

  // Create sample reviews
  await prisma.review.create({
    data: {
      profileId: profile1.id,
      userId: customer.id,
      rating: 5,
      comment: "Harika hizmet! Mobilyalarımı çok kısa sürede ve özenle monte ettiler. Kesinlikle tavsiye ederim.",
    },
  });

  await prisma.review.create({
    data: {
      profileId: profile1.id,
      userId: manufacturer.id,
      rating: 4,
      comment: "Profesyonel ekip, işlerini iyi yapıyorlar. Ürünlerimizin montajında güvenle çalışıyoruz.",
    },
  });

  await prisma.review.create({
    data: {
      profileId: profile2.id,
      userId: customer.id,
      rating: 4,
      comment: "Klima montajı için anlaştık, gayet memnun kaldık. Fiyat da uygundu.",
    },
  });

  console.log("✓ 3 örnek yorum oluşturuldu");

  // Create sample messages
  await prisma.message.create({
    data: {
      senderId: customer.id,
      receiverId: assembler1.id,
      subject: "Mobilya Montajı İçin Fiyat Teklifi",
      content:
        "Merhaba, yeni aldığım 4 parça mobilyanın montajı için fiyat teklifi almak istiyorum. Ürünler Kadıköy'de bulunuyor. En kısa sürede dönüş yaparsanız sevinirim.",
      isRead: false,
    },
  });

  await prisma.message.create({
    data: {
      senderId: customer.id,
      receiverId: assembler2.id,
      subject: "Klima Montajı",
      content:
        "12.000 BTU klima montajı yaptırmak istiyorum. Çankaya'da oturuyorum. Fiyat ve uygun zaman bilgisi alabilir miyim?",
      isRead: true,
    },
  });

  console.log("✓ 2 örnek mesaj oluşturuldu");

  // Create sample favorite
  await prisma.favorite.create({
    data: {
      userId: customer.id,
      profileId: profile1.id,
    },
  });

  console.log("✓ 1 örnek favori oluşturuldu");

  // Seed default role permissions
  const features = [
    { feature: "view_profiles", label: "Firma Profillerini Görme" },
    { feature: "send_message", label: "Mesaj Gönderme" },
    { feature: "receive_message", label: "Mesaj Alma" },
    { feature: "create_company_profile", label: "Firma Profili Oluşturma" },
    { feature: "leave_review", label: "Yorum Bırakma" },
    { feature: "add_favorite", label: "Favorilere Ekleme" },
    { feature: "upload_photos", label: "Fotoğraf Yükleme" },
    { feature: "view_contact_info", label: "İletişim Bilgilerini Görme" },
    { feature: "view_dashboard", label: "Paneli Görüntüleme" },
  ];

  // CUSTOMER permissions
  for (const f of features) {
    await prisma.rolePermission.upsert({
      where: { role_feature: { role: "CUSTOMER", feature: f.feature } },
      update: { enabled: !["create_company_profile", "receive_message"].includes(f.feature) },
      create: {
        role: "CUSTOMER",
        feature: f.feature,
        enabled: !["create_company_profile", "receive_message"].includes(f.feature),
      },
    });
  }

  // ASSEMBLER permissions
  for (const f of features) {
    await prisma.rolePermission.upsert({
      where: { role_feature: { role: "ASSEMBLER", feature: f.feature } },
      update: { enabled: true },
      create: { role: "ASSEMBLER", feature: f.feature, enabled: true },
    });
  }

  // MANUFACTURER permissions
  for (const f of features) {
    await prisma.rolePermission.upsert({
      where: { role_feature: { role: "MANUFACTURER", feature: f.feature } },
      update: { enabled: true },
      create: { role: "MANUFACTURER", feature: f.feature, enabled: true },
    });
  }

  console.log("✓ Varsayılan rol izinleri oluşturuldu");

  console.log("\n✅ Seed işlemi tamamlandı!");
  console.log("\n📧 Test hesapları:");
  console.log("   Admin:      admin@montajimvar.com / 123456");
  console.log("   Müşteri:    musteri@test.com / 123456");
  console.log("   Montajcı:   montajci@test.com / 123456");
  console.log("   Montajcı:   ali@test.com / 123456");
  console.log("   Üretici:    uretici@test.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
