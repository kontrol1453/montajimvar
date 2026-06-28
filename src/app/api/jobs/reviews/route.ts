import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await prisma.jobReview.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          customer: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json(reviews);
}
