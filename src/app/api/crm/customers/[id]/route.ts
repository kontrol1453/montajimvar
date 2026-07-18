import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getSegment(user: { createdAt: Date }, stats: { totalJobs: number; completedJobs: number; totalSpend: number; hasDispute: boolean }): string {
  const daysSinceJoin = Math.floor((Date.now() - user.createdAt.getTime()) / 86400000);
  if (stats.completedJobs >= 3) return "repeat";
  if (stats.totalJobs === 0 && daysSinceJoin <= 30) return "new";
  if (stats.totalJobs === 0 && daysSinceJoin > 30) return "dormant";
  if (stats.totalSpend > 10000) return "high_value";
  if (stats.hasDispute) return "at_risk";
  return "active";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        avatar: true,
        roles: true,
        premiumUntil: true,
        emailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const [
      totalJobs,
      completedJobs,
      activeJobs,
      cancelledJobs,
      totalSpend,
      monthlySpend,
      offerCount,
      messageCount,
      reviewCount,
      favoriteCount,
      disputeCount,
      lastMessage,
    ] = await Promise.all([
      prisma.job.count({ where: { customerId: userId } }),
      prisma.job.count({ where: { customerId: userId, status: "completed" } }),
      prisma.job.count({
        where: { customerId: userId, status: { in: ["assigned", "en_route", "in_progress"] } },
      }),
      prisma.job.count({ where: { customerId: userId, status: "cancelled" } }),
      prisma.job.aggregate({
        where: { customerId: userId, status: "completed" },
        _sum: { budgetMax: true },
      }),
      prisma.job.aggregate({
        where: {
          customerId: userId,
          status: "completed",
          updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
        _sum: { budgetMax: true },
      }),
      prisma.offer.count({ where: { job: { customerId: userId } } }),
      prisma.message.count({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      }),
      prisma.review.count({ where: { userId } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.dispute.count({ where: { openedById: userId } }),
      prisma.message.findFirst({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    const recentJobs = await prisma.job.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        city: true,
        budgetMin: true,
        budgetMax: true,
        createdAt: true,
        _count: { select: { offers: true } },
      },
    });

    const recentMessages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        createdAt: true,
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    const stats = {
      totalJobs,
      completedJobs,
      activeJobs,
      cancelledJobs,
      totalSpend: Number(totalSpend._sum.budgetMax || 0),
      monthlySpend: Number(monthlySpend._sum.budgetMax || 0),
      totalOffers: offerCount,
      totalMessages: messageCount,
      reviewsGiven: reviewCount,
      favoriteArtisans: favoriteCount,
      openDisputes: disputeCount,
      lastActive: lastMessage?.createdAt.toISOString() || user.createdAt.toISOString(),
    };

    return NextResponse.json({
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        avatar: user.avatar,
        roles: user.roles,
        isPremium: user.premiumUntil ? new Date(user.premiumUntil) > new Date() : false,
        emailVerified: user.emailVerified,
        isPhoneVerified: user.isPhoneVerified,
        memberSince: user.createdAt.toISOString(),
        segment: getSegment(user, { totalJobs, completedJobs, totalSpend: stats.totalSpend, hasDispute: disputeCount > 0 }),
      },
      stats,
      recentJobs: recentJobs.map((j) => ({
        id: j.id,
        title: j.title,
        status: j.status,
        city: j.city,
        budgetMin: Number(j.budgetMin || 0),
        budgetMax: Number(j.budgetMax || 0),
        offerCount: j._count.offers,
        createdAt: j.createdAt.toISOString(),
      })),
      recentMessages: recentMessages.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        receiverId: m.receiverId,
        sender: m.sender,
        receiver: m.receiver,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("CRM customer detail error:", error);
    return NextResponse.json(
      { error: "Müşteri detayı yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
