import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id: idStr } = await params;
  const id = Number(idStr);
  const skill = await prisma.artisanSkill.findUnique({ where: { id } });
  if (!skill) {
    return NextResponse.json({ error: "Uzmanlık bulunamadı." }, { status: 404 });
  }

  const updated = await prisma.artisanSkill.update({
    where: { id },
    data: { verified: !skill.verified },
  });

  return NextResponse.json(updated);
}
