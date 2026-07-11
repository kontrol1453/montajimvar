import { NextResponse } from "next/server";
import { estimatePrice } from "@/lib/price-analyzer";

export async function POST(request: Request) {
  const body = await request.json();
  const { categoryIds, categoryNames, city, urgency, description, photoCount } = body;

  if (!categoryIds?.length || !city) {
    return NextResponse.json({ error: "Kategori ve şehir gerekli." }, { status: 400 });
  }

  const result = estimatePrice({
    categoryIds,
    categoryNames: categoryNames || [],
    city,
    urgency: urgency || "normal",
    description: description || "",
    photoCount: photoCount || 0,
  });

  return NextResponse.json(result);
}
