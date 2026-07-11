import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id: idStr } = await params;
  const id = Number(idStr);
  const { resolution } = await request.json();

  if (!resolution) {
    return NextResponse.json({ error: "Çözüm tipi gerekli." }, { status: 400 });
  }

  const dispute = await prisma.dispute.findUnique({ where: { id } });
  if (!dispute) {
    return NextResponse.json({ error: "Anlaşmazlık bulunamadı." }, { status: 404 });
  }

  const updated = await prisma.dispute.update({
    where: { id },
    data: { resolution, status: "resolved", resolvedAt: new Date() },
  });

  if (dispute.paymentId) {
    const paymentAction = resolution === "release_artisan"
      ? { status: "released", releasedAt: new Date() }
      : { status: "refunded" };
    await prisma.payment.update({
      where: { id: dispute.paymentId },
      data: paymentAction,
    });
  }

  return NextResponse.json(updated);
}
