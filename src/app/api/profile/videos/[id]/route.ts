import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const userId = Number((session.user as any).id);
  const { id: idStr } = await params;
  const id = Number(idStr);

  const video = await prisma.artisanVideo.findUnique({ where: { id } });
  if (!video || video.userId !== userId) {
    return NextResponse.json({ error: "Video bulunamadı." }, { status: 404 });
  }

  await prisma.artisanVideo.delete({ where: { id } });
  return NextResponse.json({ message: "Video silindi." });
}
