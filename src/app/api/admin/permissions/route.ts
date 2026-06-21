import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const permissions = await prisma.rolePermission.findMany({
    orderBy: [{ role: "asc" }, { feature: "asc" }],
  });

  return NextResponse.json(permissions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { role, feature, enabled } = await request.json();

    const perm = await prisma.rolePermission.upsert({
      where: { role_feature: { role, feature } },
      update: { enabled },
      create: { role, feature, enabled },
    });

    return NextResponse.json(perm);
  } catch (error) {
    console.error("İzin güncelleme hatası:", error);
    return NextResponse.json(
      { error: "İzin güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
