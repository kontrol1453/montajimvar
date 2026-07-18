import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  const user = session?.user as { roles?: string[] } | undefined;
  if (!user || !user.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const action = searchParams.get("action") || "all";
  const entity = searchParams.get("entity") || "all";

  const where: Prisma.AdminAuditLogWhereInput = {};
  if (action !== "all") where.action = action;
  if (entity !== "all") where.entity = entity;
  if (search) {
    where.OR = [
      { details: { contains: search, mode: "insensitive" } },
      { ip: { contains: search, mode: "insensitive" } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.adminAuditLog.count({ where }),
  ]);

  const adminIds = Array.from(new Set(logs.map((l) => l.adminId)));
  const admins = adminIds.length
    ? await prisma.user.findMany({
        where: { id: { in: adminIds } },
        select: { id: true, name: true },
      })
    : [];
  const adminNameById = new Map(admins.map((a) => [a.id, a.name]));

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      adminId: l.adminId,
      action: l.action,
      entity: l.entity,
      entityId: l.entityId,
      details: l.details,
      ip: l.ip,
      createdAt: l.createdAt.toISOString(),
      admin: { name: adminNameById.get(l.adminId) ?? `Admin #${l.adminId}` },
    })),
    total,
    totalPages: Math.ceil(total / limit),
  });
}