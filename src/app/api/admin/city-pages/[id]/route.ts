import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { city, service, title, content, metaTitle, metaDesc } = body;

    const data: Record<string, unknown> = {};
    if (city !== undefined) data.city = city;
    if (service !== undefined) data.service = service;
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (metaTitle !== undefined) data.metaTitle = metaTitle || null;
    if (metaDesc !== undefined) data.metaDesc = metaDesc || null;
    if (city !== undefined && service !== undefined) {
      data.slug = `${city.toLowerCase().replace(/[^a-z0-9çğıöşü]/g, "-")}/${service.toLowerCase().replace(/[^a-z0-9çğıöşü-]/g, "-")}`;
    }

    const page = await prisma.cityServicePage.update({ where: { id: Number(id) }, data });
    return NextResponse.json(page);
  } catch (error) {
    console.error("City page update error:", error);
    return NextResponse.json({ error: "Sayfa güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.cityServicePage.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Sayfa silindi." });
  } catch (error) {
    console.error("City page delete error:", error);
    return NextResponse.json({ error: "Sayfa silinemedi." }, { status: 500 });
  }
}
