import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clearPermissionCache } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const permissions = await prisma.rolePermission.findMany({
    orderBy: [{ role: "asc" }, { feature: "asc" }],
  });

  return NextResponse.json(permissions);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { role, feature, enabled } = await request.json();

    const perm = await prisma.rolePermission.upsert({
      where: { role_feature: { role, feature } },
      update: { enabled },
      create: { role, feature, enabled },
    });

    // Cache'i temizle, aksi halde eski değer dönmeye devam eder
    clearPermissionCache();

    return NextResponse.json(perm);
  } catch (error) {
    console.error("İzin güncelleme hatası:", error);
    return NextResponse.json(
      { error: "İzin güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

