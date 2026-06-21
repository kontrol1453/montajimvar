import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    // Don't allow deleting self
    if (id === (session.user as any).id) {
      return NextResponse.json(
        { error: "Kendinizi silemezsiniz." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
