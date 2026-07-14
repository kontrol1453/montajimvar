import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id } = await params;
  const profileId = Number(id);
  const url = new URL(_request.url);
  const tab = url.searchParams.get("tab") || "jobs";

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });
    if (!profile) return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });

    switch (tab) {
      case "jobs": {
        const jobs = await prisma.job.findMany({
          where: { customerId: profile.userId },
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true, title: true, status: true, city: true,
            createdAt: true,
            _count: { select: { offers: true } },
          },
        });
        return NextResponse.json(jobs);
      }

      case "reviews": {
        const reviews = await prisma.review.findMany({
          where: { profileId },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            user: { select: { id: true, name: true } },
          },
        });
        return NextResponse.json(reviews);
      }

      case "subscription": {
        const payments = await prisma.subscriptionPayment.findMany({
          where: { profileId },
          orderBy: { createdAt: "desc" },
          take: 25,
          include: {
            plan: { select: { name: true } },
          },
        });
        return NextResponse.json(payments);
      }

      case "disputes": {
        const disputes = await prisma.dispute.findMany({
          where: { openedById: profile.userId },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            job: { select: { id: true, title: true } },
          },
        });
        return NextResponse.json(disputes);
      }

      case "jobs_stats": {
        const jobCounts = await prisma.job.groupBy({
          by: ["status"],
          where: { customerId: profile.userId },
          _count: true,
        });
        return NextResponse.json(jobCounts);
      }

      default:
        return NextResponse.json({ error: "Geçersiz sekme." }, { status: 400 });
    }
  } catch (error) {
    console.error(`Profile detail tab "${tab}" error:`, error);
    return NextResponse.json({ error: "Veri yüklenirken hata oluştu." }, { status: 500 });
  }
}