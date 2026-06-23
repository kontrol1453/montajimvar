import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "profileId gerekli." }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { profileId: Number(profileId) },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Yorum listesi hatası:", error);
    return NextResponse.json(
      { error: "Yorumlar yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = ((session.user as any).roles?.[0] as string) || "CUSTOMER";

  if (!(await hasPermission(userRole, "leave_review"))) {
    return NextResponse.json(
      { error: "Yorum bırakma yetkiniz bulunmamaktadır." },
      { status: 403 }
    );
  }

  try {
    const { profileId, rating, comment } = await request.json();

    if (!profileId || !rating) {
      return NextResponse.json(
        { error: "profil ve puan zorunludur." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Puan 1-5 arasında olmalıdır." },
        { status: 400 }
      );
    }

    // Check profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: Number(profileId) },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Firma profili bulunamadı." },
        { status: 404 }
      );
    }

    if (profile.userId === userId) {
      return NextResponse.json(
        { error: "Kendi firmanızı değerlendiremezsiniz." },
        { status: 400 }
      );
    }

    // Upsert review (one per user per profile)
    const review = await prisma.review.upsert({
      where: {
        profileId_userId: { profileId: Number(profileId), userId },
      },
      create: {
        profileId: Number(profileId),
        userId,
        rating: Number(rating),
        comment: comment || null,
      },
      update: {
        rating: Number(rating),
        comment: comment || null,
      },
    });

    // Update profile average rating
    const agg = await prisma.review.aggregate({
      where: { profileId: Number(profileId) },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.profile.update({
      where: { id: Number(profileId) },
      data: {
        ratingAvg: agg._avg.rating || 0,
        reviewCount: agg._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Yorum kayıt hatası:", error);
    return NextResponse.json(
      { error: "Yorum kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

