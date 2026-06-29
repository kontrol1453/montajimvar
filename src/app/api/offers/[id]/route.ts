import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { action } = body; // "accepted" | "rejected"

    if (!action || !["accepted", "rejected"].includes(action)) {
      return NextResponse.json(
        { error: "Geçersiz işlem. 'accepted' veya 'rejected' olmalıdır." },
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

    // Only job owner can accept/reject
    if (offer.job.customerId !== userId) {
      return NextResponse.json(
        { error: "Bu teklifi yanıtlama yetkiniz yok." },
        { status: 403 }
      );
    }

    if (offer.status !== "pending") {
      return NextResponse.json(
        { error: `Bu teklif zaten "${offer.status}" durumunda.` },
        { status: 400 }
      );
    }

    if (action === "accepted") {
      // Accept this offer, update job status, reject all other pending offers
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
      ]);

      return NextResponse.json({ message: "Teklif kabul edildi. Usta işe atandı." });
    } else {
      // Reject
      await prisma.offer.update({
        where: { id: Number(id) },
        data: { status: "rejected" },
      });

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
