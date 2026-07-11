import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CalendarView from "./CalendarView";

export const dynamic = "force-dynamic";

export default async function TakvimPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = Number((session.user as any).id);

  const jobs = await prisma.job.findMany({
    where: {
      offers: { some: { artisanId: userId, status: "accepted" } },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      status: true,
      city: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const serialized = jobs.map((j) => ({
    ...j,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  }));

  const dateMap = new Map<string, typeof serialized>();
  for (const job of serialized) {
    const d = job.createdAt.slice(0, 10);
    if (!dateMap.has(d)) dateMap.set(d, []);
    dateMap.get(d)!.push(job);
  }

  return <CalendarView dateMap={Object.fromEntries(dateMap)} />;
}
