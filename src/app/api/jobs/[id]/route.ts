import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/jobs/[id] — job details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
      include: {
        customer: {
          select: { id: true, name: true, avatar: true, phone: true },
        },
        categories: {
          include: { category: { select: { id: true, name: true, slug: true, icon: true } } },
        },
        offers: {
          orderBy: { amount: "asc" },
          include: {
            artisan: {
              select: {
                id: true,
                name: true,
                avatar: true,
                profile: { select: { companyName: true, ratingAvg: true, reviewCount: true } },
              },
            },
          },
        },
        timeline: { orderBy: { createdAt: "asc" } },
        review: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("İş detay hatası:", error);
    return NextResponse.json(
      { error: "İş detayı yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] — update job status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = Number((session.user as any).id);

  try {
    const { id } = await params;
    const body = await request.json();
    const { status: newStatus, note } = body;

    const validTransitions: Record<string, string[]> = {
      pending: ["offers_received", "cancelled"],
      offers_received: ["assigned", "cancelled"],
      assigned: ["en_route", "cancelled"],
      en_route: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
      completed: ["review_pending"],
      review_pending: [],
      cancelled: [],
    };

    const job = await prisma.job.findUnique({ where: { id: Number(id) } });

    if (!job) {
      return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
    }

    // Only customer can update
    if (job.customerId !== userId) {
      return NextResponse.json(
        { error: "Bu işi güncelleme yetkiniz yok." },
        { status: 403 }
      );
    }

    if (!newStatus) {
      return NextResponse.json(
        { error: "Yeni durum belirtilmelidir." },
        { status: 400 }
      );
    }

    const allowedNext = validTransitions[job.status] || [];
    if (!allowedNext.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `"${job.status}" durumundan "${newStatus}" durumuna geçilemez.`,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.job.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        timeline: {
          create: {
            status: newStatus,
            note: note || `Durum güncellendi: ${newStatus}`,
          },
        },
      },
      include: {
        categories: {
          include: { category: { select: { id: true, name: true } } },
        },
        offers: {
          include: {
            artisan: { select: { id: true, name: true } },
          },
        },
        timeline: { orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json({ job: updated, message: "İş durumu güncellendi." });
  } catch (error) {
    console.error("İş güncelleme hatası:", error);
    return NextResponse.json(
      { error: "İş güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
