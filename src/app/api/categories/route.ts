import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
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
