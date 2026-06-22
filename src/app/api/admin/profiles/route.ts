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
    const { id, isVerified, isFeatured } = body;

    const data: Record<string, unknown> = {};
    if (isVerified !== undefined) data.isVerified = isVerified;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    await prisma.profile.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Profil güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

