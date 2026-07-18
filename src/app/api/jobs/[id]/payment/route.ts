import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/jobs/[id]/payment – create payment for a completed job (customer initiates)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = Number((session.user as any).id);
  const { id } = await params;
  const jobId = Number(id);

  // Fetch job with accepted offer
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      offers: { where: { status: "accepted" } },
    },
  });
  if (!job) {
    return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
  }
  if (job.customerId !== userId) {
    return NextResponse.json({ error: "Bu iş için ödeme oluşturma yetkiniz yok." }, { status: 403 });
  }

  const acceptedOffer = job.offers[0];
  if (!acceptedOffer) {
    return NextResponse.json({ error: "Kabul edilmiş bir teklif bulunamadı." }, { status: 400 });
  }

  // Prevent duplicate payments
  const existingPayment = await prisma.payment.findUnique({ where: { jobId } });
  if (existingPayment) {
    return NextResponse.json({ error: "Ödeme zaten oluşturulmuş." }, { status: 400 });
  }

  // Create escrow payment record
  const payment = await prisma.payment.create({
    data: {
      jobId,
      customerId: job.customerId,
      artisanId: acceptedOffer.artisanId,
      amount: acceptedOffer.amount,
      commission: 0,
      status: "escrow",
    },
  });

  // Update job status to payment_pending and add timeline entry
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "payment_pending",
      timeline: {
        create: {
          status: "payment_pending",
          note: "Ödeme oluşturuldu (escrow)",
        },
      },
    },
  });

  return NextResponse.json({ payment, message: "Ödeme escrow olarak oluşturuldu." }, { status: 201 });
}
