import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/crm-activity";

export const dynamic = "force-dynamic";

// PATCH /api/payments/[id] – release escrow payment (artisan confirms receipt)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = Number((session.user as any).id);
  const { id } = await params;
  const paymentId = Number(id);

  // Load payment with related job & artisan
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { job: true, artisan: true },
  });
  if (!payment) {
    return NextResponse.json({ error: "Ödeme bulunamadı." }, { status: 404 });
  }

  // Only the assigned artisan or an admin can release
  const isAdmin = (session.user as any).roles?.includes("ADMIN");
  if (payment.artisanId !== userId && !isAdmin) {
    return NextResponse.json({ error: "Bu ödeme serbest bırakma yetkiniz yok." }, { status: 403 });
  }

  if (payment.status !== "escrow") {
    return NextResponse.json({ error: `Ödeme zaten ${payment.status} durumunda.` }, { status: 400 });
  }

  // Update payment to released
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "released",
      releasedAt: new Date(),
    },
  });

  // Update job status to paid and add timeline entry
  await prisma.job.update({
    where: { id: payment.jobId },
    data: {
      status: "paid",
      timeline: {
        create: {
          status: "paid",
          note: "Ödeme serbest bırakıldı",
        },
      },
    },
  });

  logActivity({
    type: "payment",
    subject: "Ödeme serbest bırakıldı",
    description: `${Number(payment.amount).toLocaleString("tr-TR")}₺ — İş #${payment.jobId}`,
    entityType: "job",
    entityId: payment.jobId,
    ownerId: payment.artisanId,
  }).catch(() => {});

  return NextResponse.json({ message: "Ödeme serbest bırakıldı." }, { status: 200 });
}
