import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

