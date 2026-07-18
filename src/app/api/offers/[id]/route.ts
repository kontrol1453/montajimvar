import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/crm-activity";

export const dynamic = "force-dynamic";

// PATCH /api/offers/[id] — accept or reject offer
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
    const { action } = body; // "accepted" | "rejected" | "withdrawn"

    if (!action || !["accepted", "rejected", "withdrawn"].includes(action)) {
      return NextResponse.json(
        { error: "Geçersiz işlem. 'accepted', 'rejected' veya 'withdrawn' olmalıdır." },
        { status: 400 }
      );
    }

    const offer = await prisma.offer.findUnique({
      where: { id: Number(id) },
      include: { job: { select: { id: true, customerId: true, status: true } } },
    });

    if (!offer) {
      return NextResponse.json({ error: "Teklif bulunamadı." }, { status: 404 });
    }

    if (offer.status !== "pending") {
      return NextResponse.json(
        { error: `Bu teklif zaten "${offer.status}" durumunda.` },
        { status: 400 }
      );
    }

    // Withdraw: artisan can withdraw own offer
    if (action === "withdrawn") {
      if (offer.artisanId !== userId) {
        return NextResponse.json(
          { error: "Bu teklifi geri çekme yetkiniz yok." },
          { status: 403 }
        );
      }

      await prisma.offer.update({
        where: { id: Number(id) },
        data: { status: "withdrawn" },
      });

      return NextResponse.json({ message: "Teklifiniz geri çekildi." });
    }

    // Only job owner can accept/reject
    if (offer.job.customerId !== userId) {
      return NextResponse.json(
        { error: "Bu teklifi yanıtlama yetkiniz yok." },
        { status: 403 }
      );
    }

    if (action === "accepted") {
      // Accept this offer, update job status, reject all other pending offers, create payment
      await prisma.$transaction([
        prisma.offer.update({
          where: { id: Number(id) },
          data: { status: "accepted" },
        }),
        prisma.offer.updateMany({
          where: { jobId: offer.jobId, id: { not: Number(id) }, status: "pending" },
          data: { status: "rejected" },
        }),
        prisma.job.update({
          where: { id: offer.jobId },
          data: {
            status: "assigned",
            timeline: {
              create: {
                status: "assigned",
                note: "Teklif kabul edildi, usta atandı",
              },
            },
          },
        }),
        prisma.payment.create({
          data: {
            jobId: offer.jobId,
            customerId: offer.job.customerId,
            artisanId: offer.artisanId,
            amount: offer.amount,
            status: "escrow",
          },
        }),
      ]);

      logActivity({
        type: "status_change",
        subject: "Teklif kabul edildi",
        description: `Teklif #${offer.id}, İş #${offer.jobId} için kabul edildi`,
        entityType: "job",
        entityId: offer.jobId,
        ownerId: offer.job.customerId,
      }).catch(() => {});

      return NextResponse.json({ message: "Teklif kabul edildi. Usta işe atandı." });
    } else {
      // Reject
      await prisma.offer.update({
        where: { id: Number(id) },
        data: { status: "rejected" },
      });

      logActivity({
        type: "status_change",
        subject: "Teklif reddedildi",
        description: `Teklif #${offer.id}, İş #${offer.jobId} için reddedildi`,
        entityType: "job",
        entityId: offer.jobId,
        ownerId: offer.job.customerId,
      }).catch(() => {});

      return NextResponse.json({ message: "Teklif reddedildi." });
    }
  } catch (error) {
    console.error("Teklif güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Teklif güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
