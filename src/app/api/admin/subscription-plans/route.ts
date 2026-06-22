import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price || 0,
        durationDays: data.durationDays || 30,
        features: data.features || "[]",
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder || 0,
        badgeLabel: data.badgeLabel || null,
        badgeColor: data.badgeColor || "amber",
      },
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: "Plan oluşturulamadı" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name: rest.name,
        slug: rest.slug,
        description: rest.description || null,
        price: rest.price || 0,
        durationDays: rest.durationDays || 30,
        features: rest.features || "[]",
        isActive: rest.isActive ?? true,
        sortOrder: rest.sortOrder || 0,
        badgeLabel: rest.badgeLabel || null,
        badgeColor: rest.badgeColor || "amber",
      },
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: "Plan güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

  try {
    await prisma.subscriptionPlan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Plan silinemedi" }, { status: 500 });
  }
}

