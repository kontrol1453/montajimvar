import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { name, slug } = await request.json();
  if (!name || !slug) {
    return NextResponse.json({ error: "Ad ve slug zorunludur." }, { status: 400 });
  }

  try {
    const cat = await prisma.blogCategory.create({ data: { name, slug } });
    return NextResponse.json(cat, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Bu slug zaten var." }, { status: 409 });
    }
    return NextResponse.json({ error: "Hata." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id, name, slug } = await request.json();
  if (!id || !name || !slug) {
    return NextResponse.json({ error: "id, ad ve slug zorunludur." }, { status: 400 });
  }

  try {
    const cat = await prisma.blogCategory.update({
      where: { id: Number(id) },
      data: { name, slug },
    });
    return NextResponse.json(cat);
  } catch {
    return NextResponse.json({ error: "Hata." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  }

  const postCount = await prisma.blogPost.count({ where: { categoryId: id } });
  if (postCount > 0) {
    return NextResponse.json({ error: `${postCount} yazı bu kategoriyi kullanıyor. Önce yazıları güncelleyin.` }, { status: 400 });
  }

  await prisma.blogCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
