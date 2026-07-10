import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artisanId = searchParams.get("artisanId");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  const where: Record<string, unknown> = {};
  if (artisanId) {
    where.job = {
      offers: {
        some: { artisanId: Number(artisanId), status: "accepted" },
      },
    };
  }

  const [reviews, total] = await Promise.all([
    prisma.jobReview.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            customer: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    }),
    prisma.jobReview.count({ where }),
  ]);

  return NextResponse.json({ reviews, total, page, limit });
}
