import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Profil ID gereklidir." },
        { status: 400 }
      );
    }

    // Check profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) },
      select: { id: true, companyName: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil bulunamadı." },
        { status: 404 }
      );
    }

    // Cascade delete: profile_images, reviews, favorites, profile_categories,
    // subscription_payments, and the profile itself
    await prisma.profile.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profil silme hatası:", error);
    return NextResponse.json(
      { error: "Profil silinirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, isVerified, isFeatured, categoryIds } = body;

    const data: Record<string, unknown> = {};
    if (isVerified !== undefined) data.isVerified = isVerified;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    if (categoryIds !== undefined) {
      const ids = categoryIds as number[];
      if (ids.length === 0) {
        return NextResponse.json(
          { error: "En az bir kategori seçilmelidir." },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.profileCategory.deleteMany({ where: { profileId: Number(id) } }),
        prisma.profileCategory.createMany({
          data: ids.map((categoryId) => ({
            profileId: Number(id),
            categoryId,
          })),
        }),
        prisma.profile.update({
          where: { id: Number(id) },
          data: { categoryId: ids[0] },
        }),
      ]);
    } else {
      await prisma.profile.update({
        where: { id: Number(id) },
        data,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Profil güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

