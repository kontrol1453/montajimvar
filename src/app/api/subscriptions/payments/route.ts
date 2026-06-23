import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    return NextResponse.json({ error: "Firma profili bulunamadı" }, { status: 400 });
  }

  const payments = await prisma.subscriptionPayment.findMany({
    where: { profileId: profile.id },
    include: { plan: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ payments });
}
