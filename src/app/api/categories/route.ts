import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Kategori hatası:", error);
    return NextResponse.json(
      { error: "Kategoriler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
