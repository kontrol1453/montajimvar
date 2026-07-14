import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction, extractAdminId } from "@/lib/admin-audit";

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

  const dispute = await (prisma as any).dispute?.findUnique({ where: { id } });
  if (!dispute) {
    return NextResponse.json({ error: "Anlaşmazlık bulunamadı." }, { status: 404 });
  }

  const updated = await (prisma as any).dispute?.update({
    where: { id },
    data: { resolution, status: "resolved", resolvedAt: new Date() },
  });

  if (dispute.paymentId) {
    const paymentAction = resolution === "release_artisan"
      ? { status: "released", releasedAt: new Date() }
      : { status: "refunded" };
    await (prisma as any).payment?.update({
      where: { id: dispute.paymentId },
      data: paymentAction,
    });
  }

  await logAdminAction({
    adminId: extractAdminId(session),
    action: "resolve",
    entity: "dispute",
    entityId: id,
    details: { resolution, jobId: dispute.jobId, paymentId: dispute.paymentId },
  });

  return NextResponse.json(updated);
}
