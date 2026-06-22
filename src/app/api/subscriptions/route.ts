import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { planId } = await req.json();

  if (!planId) {
    return NextResponse.json({ error: "Plan ID gerekli" }, { status: 400 });
  }

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    return NextResponse.json({ error: "Önce firma profili oluşturmalısınız" }, { status: 400 });
  }

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) {
    return NextResponse.json({ error: "Plan bulunamadı" }, { status: 404 });
  }

  // For paid plans, this is where payment integration would happen.
  // For now, free plans are activated immediately.
  if (plan.price > 0) {
    return NextResponse.json({ error: "Ödeme entegrasyonu yakında aktif olacak" }, { status: 400 });
  }

  // Calculate premiumUntil
  const premiumUntil = new Date();
  premiumUntil.setDate(premiumUntil.getDate() + plan.durationDays);

  await prisma.profile.update({
    where: { userId },
    data: {
      subscriptionId: plan.id,
      premiumUntil,
    },
  });

  return NextResponse.json({ success: true });
}

