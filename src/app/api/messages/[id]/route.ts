import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

// Mark message as read
export async function PATCH(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const message = await prisma.message.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Mesaj güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  try {
    const msg = await prisma.message.findUnique({ where: { id: Number(id) } });
    if (!msg) {
      return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
    }
    if (msg.senderId !== userId) {
      return NextResponse.json({ error: "Bu mesajı silme yetkiniz yok." }, { status: 403 });
    }

    await prisma.message.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mesaj silme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
