import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const result = await prisma.message.updateMany({
      where: { receiverId: userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error("Toplu okundu hatası:", error);
    return NextResponse.json(
      { error: "Mesajlar güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}