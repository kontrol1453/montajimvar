import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

// Mark message as read
export async function PATCH(_request: Request, { params }: Props) {
  const session = await getServerSession(authOptions);
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
