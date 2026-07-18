import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { estimatePrice } from "@/lib/price-analyzer";
import { analyzePhotos } from "@/lib/vision-analyzer";
import { logAIAudit } from "@/lib/ai/audit";
import { sanitizeAIInput, detectInjectionAttempt } from "@/lib/ai/security/sanitize";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const body = await request.json();
  const { categoryIds, categoryNames, city, urgency, description, photoCount, photoUrls } = body;

  if (!categoryIds?.length || !city) {
    return NextResponse.json({ error: "Kategori ve şehir gerekli." }, { status: 400 });
  }

  const sanitizedDescription = sanitizeAIInput(description || "");
  if (detectInjectionAttempt(sanitizedDescription)) {
    logAIAudit({
      userId: Number((session.user as any).id),
      promptId: "estimate-price",
      promptVersion: "legacy",
      provider: "rules",
      model: "n/a",
      inputLength: sanitizedDescription.length,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      latency: 0,
      success: false,
      error: "Prompt injection detected",
      injectionAttempt: true,
    }).catch(() => {});
    return NextResponse.json({ error: "Geçersiz giriş." }, { status: 400 });
  }

  const result = estimatePrice({
    categoryIds,
    categoryNames: categoryNames || [],
    city,
    urgency: urgency || "normal",
    description: sanitizedDescription,
    photoCount: photoCount || 0,
  });

  let visionAnalysis = null;
  if (photoUrls?.length > 0) {
    visionAnalysis = await analyzePhotos(photoUrls);
  }

  return NextResponse.json({ ...result, visionAnalysis });
}
