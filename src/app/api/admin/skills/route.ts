import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const skills = await prisma.artisanSkill.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(skills);
}
