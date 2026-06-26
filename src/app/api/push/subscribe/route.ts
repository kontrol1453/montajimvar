import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { endpoint, keys, userAgent } = await request.json();

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Geçersiz subscription bilgisi." },
        { status: 400 }
      );
    }

    // Upsert: aynı endpoint varsa güncelle, yoksa oluştur
    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
        userId,
      },
      create: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ success: true, id: subscription.id });
  } catch (error) {
    console.error("Push subscribe hatası:", error);
    return NextResponse.json(
      { error: "Abonelik kaydedilemedi." },
      { status: 500 }
    );
  }
}
