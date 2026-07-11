import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, title: true } },
      openedBy: { select: { id: true, name: true } },
      payment: { select: { amount: true, status: true } },
    },
  });

  return NextResponse.json(disputes);
}
