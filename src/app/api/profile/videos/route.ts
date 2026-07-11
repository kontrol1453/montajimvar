import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const userId = Number((session.user as any).id);
  const videos = await prisma.artisanVideo.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const userId = Number((session.user as any).id);
  const { title, url, description } = await request.json();

  if (!title || !url) {
    return NextResponse.json({ error: "Başlık ve URL gerekli." }, { status: 400 });
  }

  const video = await prisma.artisanVideo.create({
    data: { userId, title, url, description },
  });

  return NextResponse.json(video, { status: 201 });
}
