import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/offers — list offers
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = Number((session.user as any).id);

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const artisanId = searchParams.get("artisanId");

    const where: Record<string, unknown> = {};

    if (jobId) where.jobId = Number(jobId);
    if (artisanId) where.artisanId = Number(artisanId);

    // If no specific filter, show offers based on user role
    if (!jobId && !artisanId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { roles: true },
      });

      if (user?.roles.includes("ARTISAN")) {
        where.artisanId = userId;
      } else {
        // Customer — find jobs they own and get offers for those
        const userJobs = await prisma.job.findMany({
          where: { customerId: userId },
          select: { id: true },
        });
        where.jobId = { in: userJobs.map((j) => j.id) };
      }
    }

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            city: true,
            budgetMin: true,
            budgetMax: true,
          },
        },
        artisan: {
          select: {
            id: true,
            name: true,
            avatar: true,
            profile: { select: { companyName: true, ratingAvg: true } },
          },
        },
      },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Teklif listeleme hatası:", error);
    return NextResponse.json(
      { error: "Teklifler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

// POST /api/offers — create offer (artisan bids)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = Number((session.user as any).id);
  const userRoles = (session.user as any).roles || [];

  // Must be an artisan
  if (!userRoles.includes("ARTISAN")) {
    return NextResponse.json(
      { error: "Sadece ustalar teklif gönderebilir." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { jobId, amount, description, duration } = body;

    if (!jobId || !amount) {
      return NextResponse.json(
        { error: "İş ID ve teklif tutarı zorunludur." },
        { status: 400 }
      );
    }

    // Check job exists and is pending
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
      select: { status: true, customerId: true },
    });

    if (!job) {
      return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
    }

    if (job.status !== "pending" && job.status !== "offers_received") {
      return NextResponse.json(
        { error: "Bu iş için artık teklif alınmıyor." },
        { status: 400 }
      );
    }

    // Can't bid on your own job
    if (job.customerId === userId) {
      return NextResponse.json(
        { error: "Kendi işinize teklif gönderemezsiniz." },
        { status: 400 }
      );
    }

    // Check duplicate offer
    const existing = await prisma.offer.findFirst({
      where: { jobId: Number(jobId), artisanId: userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu iş için zaten teklif gönderdiniz." },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.create({
      data: {
        jobId: Number(jobId),
        artisanId: userId,
        amount: Number(amount),
        description: description || null,
        duration: duration || null,
        status: "pending",
      },
      include: {
        job: { select: { id: true, title: true } },
        artisan: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update job status if still pending
    if (job.status === "pending") {
      await prisma.job.update({
        where: { id: Number(jobId) },
        data: {
          status: "offers_received",
          timeline: {
            create: {
              status: "offers_received",
              note: "Teklif alındı",
            },
          },
        },
      });
    }

    return NextResponse.json({ offer, message: "Teklifiniz gönderildi." }, { status: 201 });
  } catch (error) {
    console.error("Teklif oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Teklif gönderilirken hata oluştu." },
      { status: 500 }
    );
  }
}
