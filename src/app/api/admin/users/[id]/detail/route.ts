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
  const userId = Number(id);
  const url = new URL(_request.url);
  const tab = url.searchParams.get("tab") || "jobs";

  try {
    switch (tab) {
      case "jobs": {
        const jobs = await prisma.job.findMany({
          where: { customerId: userId },
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true, title: true, status: true, city: true,
            createdAt: true,
            _count: { select: { offers: true } },
          },
        });

        const assignedJobs = await prisma.job.findMany({
          where: {
            offers: { some: { artisanId: userId, status: "accepted" } },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true, title: true, status: true, city: true,
            createdAt: true,
            customer: { select: { id: true, name: true } },
          },
        });

        return NextResponse.json({ created: jobs, assigned: assignedJobs });
      }

      case "offers": {
        const offers = await prisma.offer.findMany({
          where: { artisanId: userId },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            job: { select: { id: true, title: true, status: true } },
          },
        });
        return NextResponse.json(offers);
      }

      case "reviews": {
        const [written, received] = await Promise.all([
          prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 25,
            include: {
              profile: { select: { id: true, companyName: true } },
            },
          }),
          prisma.review.findMany({
            where: {
              profile: { userId },
            },
            orderBy: { createdAt: "desc" },
            take: 25,
            include: {
              user: { select: { id: true, name: true } },
            },
          }),
        ]);
        return NextResponse.json({ written, received });
      }

      case "certificates": {
        const skills = await prisma.artisanSkill.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: {
            category: { select: { name: true } },
          },
        });
        return NextResponse.json(skills);
      }

      case "disputes": {
        const disputes = await prisma.dispute.findMany({
          where: { openedById: userId },
          orderBy: { createdAt: "desc" },
          include: {
            job: { select: { id: true, title: true } },
          },
        });
        return NextResponse.json(disputes);
      }

      case "financial": {
        const [paymentsMade, paymentsReceived] = await Promise.all([
          prisma.payment.findMany({
            where: { customerId: userId },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
              job: { select: { id: true, title: true } },
              artisan: { select: { id: true, name: true } },
            },
          }),
          prisma.payment.findMany({
            where: { artisanId: userId },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
              job: { select: { id: true, title: true } },
              customer: { select: { id: true, name: true } },
            },
          }),
        ]);
        return NextResponse.json({ paymentsMade, paymentsReceived });
      }

      default:
        return NextResponse.json({ error: "Geçersiz sekme." }, { status: 400 });
    }
  } catch (error) {
    console.error(`User detail tab "${tab}" error:`, error);
    return NextResponse.json(
      { error: "Veri yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}