import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction, extractAdminId } from "@/lib/admin-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const pages = await prisma.cityServicePage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { city, service, title, content, metaTitle, metaDesc } = await request.json();
    if (!city || !service || !title || !content) {
      return NextResponse.json({ error: "Şehir, hizmet, başlık ve içerik zorunludur." }, { status: 400 });
    }

    const slug = `${city.toLowerCase().replace(/[^a-z0-9çğıöşü]/g, "-")}/${service.toLowerCase().replace(/[^a-z0-9çğıöşü-]/g, "-")}`;

    const existing = await prisma.cityServicePage.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu şehir+hizmet kombinasyonu zaten mevcut." }, { status: 409 });
    }

    const page = await prisma.cityServicePage.create({
      data: { city, service, title, content, metaTitle: metaTitle || null, metaDesc: metaDesc || null, slug },
    });

    await logAdminAction({
      adminId: extractAdminId(session),
      action: "create",
      entity: "city_page",
      entityId: page.id,
      details: { city, service, title },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("City page create error:", error);
    return NextResponse.json({ error: "Sayfa oluşturulamadı." }, { status: 500 });
  }
}
