import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { notifyAdmin } from "@/lib/notifications";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      companyName,
      description,
      phone,
      email,
      website,
      categoryId,
      city,
      address,
      whatsapp,
      logo,
    } = body;

    // Validate required fields
    if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
      return NextResponse.json({ error: "Firma adı gerekli." }, { status: 400 });
    }
    if (!categoryId || typeof categoryId !== "number") {
      return NextResponse.json({ error: "Kategori seçimi gerekli." }, { status: 400 });
    }
    if (!city || typeof city !== "string" || city.trim().length === 0) {
      return NextResponse.json({ error: "Şehir gerekli." }, { status: 400 });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "Geçersiz kategori." }, { status: 400 });
    }

    // Check duplicate by companyName + city
    const duplicateByName = await prisma.profile.findFirst({
      where: { companyName: { equals: companyName.trim(), mode: "insensitive" }, city: city.trim() },
      select: { id: true, companyName: true },
    });
    if (duplicateByName) {
      return NextResponse.json(
        { error: `Bu şehirde "${companyName.trim()}" adıyla kayıtlı firma zaten var.` },
        { status: 409 }
      );
    }

    // Check if website already has a profile (avoid duplicates)
    if (website && typeof website === "string" && website.trim().length > 0) {
      let normalizedUrl = website.trim();
      if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
        normalizedUrl = "https://" + normalizedUrl;
      }
      const existing = await prisma.profile.findFirst({
        where: { website: normalizedUrl },
        select: { id: true, companyName: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Bu website ile kayıtlı firma zaten var: ${existing.companyName}` },
          { status: 409 }
        );
      }
    }

    // Resolve email: use provided one, or generate placeholder
    let userEmail = email?.trim();
    if (!userEmail || userEmail.length === 0) {
      const randomSlug = crypto.randomBytes(4).toString("hex");
      userEmail = `firma${randomSlug}@montajimvar.app`;
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (existingUser) {
      // Append random suffix to make unique
      const randomSlug = crypto.randomBytes(3).toString("hex");
      userEmail = `firma${randomSlug}@montajimvar.app`;
    }

    // Generate random password (company owner will need to reset if they claim)
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    // Create user + profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: companyName.trim(),
          email: userEmail,
          password: hashedPassword,
          phone: phone?.trim() || null,
          emailVerified: false,
          roles: ["CUSTOMER"],
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          companyName: companyName.trim(),
          description: description?.trim() || "",
          categoryId,
          city: city.trim(),
          address: address?.trim() || null,
          phone: phone?.trim() || null,
          website: website?.trim() || null,
          whatsapp: whatsapp?.trim() || null,
          logo: logo?.trim() || null,
          isVerified: false,
          isFeatured: false,
        },
      });

      return { userId: user.id, profileId: profile.id };
    });

    // Create notification for admin
    await notifyAdmin({
      type: "new_profile",
      title: "Google'dan Firma Eklendi",
      message: `${companyName} isimli firma Google araması üzerinden eklendi ve onay bekliyor.`,
      link: "/admin/firmalar",
    });

    return NextResponse.json({
      success: true,
      profileId: result.profileId,
      userId: result.userId,
      email: userEmail,
      message: `${companyName} başarıyla eklendi. Onay bekliyor.`,
    });
  } catch (error) {
    console.error("Firma kaydetme hatası:", error);
    return NextResponse.json(
      { error: "Firma kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}
