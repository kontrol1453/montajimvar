import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { profiles: true } },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { name, slug, icon } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "İsim ve slug zorunludur." },
        { status: 400 }
      );
    }

    // Check uniqueness
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu isim veya slug ile bir kategori zaten mevcut." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug, icon: icon || null },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Kategori ekleme hatası:", error);
    return NextResponse.json(
      { error: "Kategori eklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id, name, slug, icon } = await request.json();

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
        NOT: { id: Number(id) },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu isim veya slug başka bir kategori tarafından kullanılıyor." },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, slug, icon: icon || null },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kategori güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    // Check if category has profiles
    const count = await prisma.profile.count({ where: { categoryId: Number(id) } });
    if (count > 0) {
      return NextResponse.json(
        { error: `Bu kategoride ${count} firma bulunuyor. Önce firmaları taşıyın.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    return NextResponse.json(
      { error: "Kategori silinirken hata oluştu." },
      { status: 500 }
    );
  }
}

