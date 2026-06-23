import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const userId = Number(id);
    const { days } = await request.json();

    if (typeof days !== "number" || days < 0) {
      return NextResponse.json(
        { error: "Geçerli bir gün sayısı belirtin." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, premiumUntil: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // days = 0 means revoke premium
    const premiumUntil = days > 0
      ? new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      : null;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { premiumUntil },
      select: { id: true, name: true, email: true, premiumUntil: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Premium güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Premium üyelik güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
