import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/jobs/[id]/review — create review for completed job
export async function POST(
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
    const { rating, comment, photos } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Puan 1-5 arasında olmalıdır." },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
      select: { id: true, customerId: true, status: true },
    });

    if (!job) {
      return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
    }

    if (job.customerId !== userId) {
      return NextResponse.json(
        { error: "Bu işi değerlendirme yetkiniz yok." },
        { status: 403 }
      );
    }

    if (job.status !== "completed") {
      return NextResponse.json(
        { error: "Sadece tamamlanmış işler değerlendirilebilir." },
        { status: 400 }
      );
    }

    // Check if already reviewed
    const existing = await prisma.jobReview.findUnique({
      where: { jobId: Number(id) },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu iş zaten değerlendirilmiş." },
        { status: 400 }
      );
    }

    const review = await prisma.$transaction(async (tx) => {
      // Create the review
      const r = await tx.jobReview.create({
        data: {
          jobId: Number(id),
          rating,
          comment: comment || null,
          photos: photos ? JSON.stringify(photos) : null,
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              customerId: true,
              offers: {
                where: { status: "accepted" },
                select: { artisanId: true },
              },
            },
          },
        },
      });

      // Update job status to review_pending
      await tx.job.update({
        where: { id: Number(id) },
        data: {
          status: "review_pending",
          timeline: {
            create: {
              status: "review_pending",
              note: "Değerlendirme yapıldı",
            },
          },
        },
      });

      // Update the artisan's profile rating
      const acceptedOffer = await tx.offer.findFirst({
        where: { jobId: Number(id), status: "accepted" },
        select: { artisanId: true },
      });

      if (acceptedOffer) {
        const profile = await tx.profile.findUnique({
          where: { userId: acceptedOffer.artisanId },
        });

        if (profile) {
          const totalReviews = await tx.jobReview.count({
            where: {
              job: {
                offers: {
                  some: {
                    artisanId: acceptedOffer.artisanId,
                    status: "accepted",
                  },
                },
              },
            },
          });

          const avg = await tx.jobReview.aggregate({
            _avg: { rating: true },
            where: {
              job: {
                offers: {
                  some: {
                    artisanId: acceptedOffer.artisanId,
                    status: "accepted",
                  },
                },
              },
            },
          });

          await tx.profile.update({
            where: { userId: acceptedOffer.artisanId },
            data: {
              ratingAvg: avg._avg.rating || profile.ratingAvg,
              reviewCount: totalReviews,
            },
          });
        }
      }

      return r;
    });

    return NextResponse.json(
      { review, message: "Değerlendirmeniz kaydedildi." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Değerlendirme hatası:", error);
    return NextResponse.json(
      { error: "Değerlendirme kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

// GET /api/jobs/[id]/review — get review for a job
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const review = await prisma.jobReview.findUnique({
      where: { jobId: Number(id) },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            customer: { select: { id: true, name: true, avatar: true } },
            offers: {
              where: { status: "accepted" },
              select: {
                artisan: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    profile: { select: { companyName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ review: null });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Değerlendirme getirme hatası:", error);
    return NextResponse.json(
      { error: "Değerlendirme yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.jobReview.delete({ where: { jobId: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
