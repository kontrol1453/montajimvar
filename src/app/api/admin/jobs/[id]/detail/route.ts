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
  const jobId = Number(id);
  const url = new URL(_request.url);
  const tab = url.searchParams.get("tab") || "offers";

  try {
    switch (tab) {
      case "offers": {
        const offers = await prisma.offer.findMany({
          where: { jobId },
          orderBy: { createdAt: "desc" },
          include: {
            artisan: {
              select: { id: true, name: true, email: true, profile: { select: { id: true, companyName: true } } },
            },
          },
        });
        return NextResponse.json(offers);
      }

      case "participants": {
        const job = await prisma.job.findUnique({
          where: { id: jobId },
          include: {
            customer: { select: { id: true, name: true, email: true, profile: { select: { id: true, companyName: true } } } },
            offers: {
              include: {
                artisan: { select: { id: true, name: true, email: true, profile: { select: { id: true, companyName: true } } } },
              },
            },
          },
        });
        if (!job) return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
        return NextResponse.json(job);
      }

      case "timeline": {
        const timeline = await prisma.jobTimeline.findMany({
          where: { jobId },
          orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(timeline);
      }

      case "messages": {
        const messages = await prisma.jobMessage.findMany({
          where: { jobId },
          orderBy: { createdAt: "asc" },
          take: 100,
          include: {
            sender: { select: { id: true, name: true } },
          },
        });
        return NextResponse.json(messages);
      }

      case "reviews_disputes": {
        const [review, dispute] = await Promise.all([
          prisma.jobReview.findUnique({ where: { jobId } }),
          prisma.dispute.findUnique({
            where: { jobId },
            include: { openedBy: { select: { id: true, name: true } }, payment: { select: { amount: true } } },
          }),
        ]);
        return NextResponse.json({ review, dispute });
      }

      case "payment": {
        const payment = await prisma.payment.findUnique({
          where: { jobId },
          include: {
            customer: { select: { id: true, name: true } },
            artisan: { select: { id: true, name: true } },
            invoices: true,
          },
        });
        return NextResponse.json(payment);
      }

      default:
        return NextResponse.json({ error: "Geçersiz sekme." }, { status: 400 });
    }
  } catch (error) {
    console.error(`Job detail tab "${tab}" error:`, error);
    return NextResponse.json({ error: "Veri yüklenirken hata oluştu." }, { status: 500 });
  }
}