import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/portfolio?type=videos&userId=123 - List portfolio videos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const userId = Number(searchParams.get("userId"));

  if (type === "videos" && userId) {
    const videos = await prisma.artisanVideo.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(videos);
  }

  // Default: return current user's portfolio data
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  const currentUserId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { coverPhoto: true, bio: true },
  });
  return NextResponse.json(user);
}

// PUT /api/user/portfolio - Update coverPhoto, bio
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { coverPhoto, bio } = await request.json();

    const data: Record<string, string> = {};
    if (coverPhoto !== undefined) data.coverPhoto = coverPhoto;
    if (bio !== undefined) data.bio = bio;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan bulunamadı." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, coverPhoto: true, bio: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

// POST /api/user/portfolio - Add a portfolio video
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { title, url, description, thumbnail } = await request.json();

    if (!title || !url) {
      return NextResponse.json({ error: "Başlık ve video URL'si zorunludur." }, { status: 400 });
    }

    // YouTube URL'lerini embed formatına dönüştür
    let embedUrl = url;
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (youtubeMatch) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const video = await prisma.artisanVideo.create({
      data: {
        userId,
        title,
        url: embedUrl,
        description: description || null,
        thumbnail: thumbnail || null,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

// DELETE /api/user/portfolio?id=123 - Delete a video
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  }

  const video = await prisma.artisanVideo.findUnique({ where: { id } });
  if (!video || video.userId !== userId) {
    return NextResponse.json({ error: "Video bulunamadı." }, { status: 404 });
  }

  await prisma.artisanVideo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
