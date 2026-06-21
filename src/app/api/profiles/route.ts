import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const city = searchParams.get("city");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categories = {
        some: { categoryId: Number(categoryId) },
      };
    }
    if (city) where.city = city;
    if (q) {
      where.OR = [
        { companyName: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const profiles = await prisma.profile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        categories: {
          include: { category: true },
        },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Profil hatası:", error);
    return NextResponse.json(
      { error: "Profiller yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

// Create/Update profile
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { companyName, description, categoryId, categoryIds, city, address, phone, website, whatsapp, latitude, longitude } = body;

    if (!companyName || !categoryId || !city) {
      return NextResponse.json(
        { error: "Firma adı, kategori ve şehir zorunludur." },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        companyName,
        description: description || "",
        categoryId: Number(categoryId),
        city,
        address: address || null,
        phone: phone || null,
        website: website || null,
        whatsapp: whatsapp || null,
        latitude: latitude || null,
        longitude: longitude || null,
      },
      update: {
        companyName,
        description: description || "",
        categoryId: Number(categoryId),
        city,
        address: address || null,
        phone: phone || null,
        website: website || null,
        whatsapp: whatsapp || null,
        latitude: latitude || null,
        longitude: longitude || null,
      },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Sync ProfileCategory join table
    const catsToAdd = (categoryIds as number[])?.filter(Boolean) || [];
    if (catsToAdd.length > 0) {
      // Remove existing profile categories then add new ones
      await prisma.profileCategory.deleteMany({ where: { profileId: profile.id } });
      await prisma.profileCategory.createMany({
        data: catsToAdd.map((catId: number) => ({
          profileId: profile.id,
          categoryId: catId,
        })),
      });
    }

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Profil kayıt hatası:", error);
    return NextResponse.json(
      { error: "Profil kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}
