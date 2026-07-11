import { NextResponse } from "next/server";
import { estimatePrice } from "@/lib/price-analyzer";
import { analyzePhotos } from "@/lib/vision-analyzer";

export async function POST(request: Request) {
  const body = await request.json();
  const { categoryIds, categoryNames, city, urgency, description, photoCount, photoUrls } = body;

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

  let visionAnalysis = null;
  if (photoUrls?.length > 0) {
    visionAnalysis = await analyzePhotos(photoUrls);
  }

  return NextResponse.json({ ...result, visionAnalysis });
}
