import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get user's favorites or check if profile is favorited
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  // Check single profile
  if (profileId) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_profileId: { userId, profileId: Number(profileId) },
      },
    });
    return NextResponse.json({ favorited: !!fav });
  }

  // List all favorites with profile info
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        profile: {
          include: {
            category: true,
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Favori listesi hatası:", error);
    return NextResponse.json(
      { error: "Favoriler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

// Toggle favorite
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { profileId } = await request.json();

    if (!profileId) {
      return NextResponse.json({ error: "profileId gerekli." }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_profileId: { userId, profileId: Number(profileId) },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          profileId: Number(profileId),
        },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("Favori hatası:", error);
    return NextResponse.json(
      { error: "Favori işlemi başarısız." },
      { status: 500 }
    );
  }
}
