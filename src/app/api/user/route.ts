import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { name, phone, city, avatar } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        phone: phone || null,
        city: city || null,
        avatar: avatar !== undefined ? (avatar || null) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        role: true,
        avatar: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Profil güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
