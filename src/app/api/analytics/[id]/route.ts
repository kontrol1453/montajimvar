import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const profileId = Number(id);
  const userId = (session.user as any).id;

  // Verify ownership
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { userId: true },
  });
  if (!profile || profile.userId !== userId) {
    return NextResponse.json({ error: "Geçersiz profil." }, { status: 403 });
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [daily, weekly, monthly, total] = await Promise.all([
    prisma.profileViewLog.count({
      where: { profileId, createdAt: { gte: startOfDay } },
    }),
    prisma.profileViewLog.count({
      where: { profileId, createdAt: { gte: startOfWeek } },
    }),
    prisma.profileViewLog.count({
      where: { profileId, createdAt: { gte: startOfMonth } },
    }),
    prisma.profileViewLog.count({
      where: { profileId },
    }),
  ]);

  return NextResponse.json({ daily, weekly, monthly, total });
}