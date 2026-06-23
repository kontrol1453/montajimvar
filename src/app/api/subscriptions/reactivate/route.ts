import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    return NextResponse.json({ error: "Firma profili bulunamadı" }, { status: 400 });
  }

  if (!profile.subscriptionId || !profile.premiumUntil) {
    return NextResponse.json({ error: "Aktif üyeliğiniz bulunmuyor" }, { status: 400 });
  }

  if (profile.autoRenew) {
    return NextResponse.json({ error: "Aboneliğiniz zaten aktif" }, { status: 400 });
  }

  await prisma.profile.update({
    where: { userId },
    data: {
      autoRenew: true,
      canceledAt: null,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Aboneliğiniz yeniden aktifleştirildi. Bitiş tarihinde otomatik yenilenecek.",
  });
}
