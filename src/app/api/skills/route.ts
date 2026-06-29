import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/skills?userId=123 - List skills/certificates for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get("userId"));

  if (!userId) {
    return NextResponse.json({ error: "userId gerekli." }, { status: 400 });
  }

  const skills = await prisma.artisanSkill.findMany({
    where: { userId },
    include: { category: { select: { id: true, name: true, icon: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(skills);
}

// POST /api/skills - Create a skill/certificate
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { categoryId, title, yearsExp, certificate } = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: "Kategori zorunludur." }, { status: 400 });
    }

    const skill = await prisma.artisanSkill.create({
      data: {
        userId,
        categoryId: Number(categoryId),
        title: title || null,
        yearsExp: yearsExp ? Number(yearsExp) : null,
        certificate: certificate || null,
      },
      include: { category: { select: { id: true, name: true, icon: true } } },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kategori için zaten bir uzmanlık kaydınız bulunuyor." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

// DELETE /api/skills?id=123 - Delete a skill/certificate
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  }

  const skill = await prisma.artisanSkill.findUnique({ where: { id } });
  if (!skill || skill.userId !== userId) {
    return NextResponse.json({ error: "Uzmanlık bulunamadı." }, { status: 404 });
  }

  await prisma.artisanSkill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
