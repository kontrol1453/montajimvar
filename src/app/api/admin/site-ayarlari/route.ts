import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[site-ayarlari] GET error:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const adminId = (session.user as any).id as number | undefined;
    const settings = await updateSiteSettings(body, adminId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[site-ayarlari] PUT error:", error);
    return NextResponse.json(
      { error: "Ayarlar kaydedilirken hata oluştu" },
      { status: 500 }
    );
  }
}