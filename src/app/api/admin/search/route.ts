import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ users: [], profiles: [], jobs: [] });
  }

  try {
    const [users, profiles, jobs] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true, email: true, roles: true },
      }),
      prisma.profile.findMany({
        where: {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, companyName: true, city: true, user: { select: { name: true } } },
      }),
      prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, title: true, status: true, city: true, customer: { select: { name: true } } },
      }),
    ]);

    return NextResponse.json({ users, profiles, jobs, query: q });
  } catch (error) {
    console.error("Arama hatası:", error);
    return NextResponse.json({ error: "Arama yapılırken hata oluştu." }, { status: 500 });
  }
}
