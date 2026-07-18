import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const segment = searchParams.get("segment") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const skip = (page - 1) * limit;
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const sortMap: Record<string, string> = {
    createdAt: "createdAt",
    name: "name",
    email: "email",
  };
  const orderBy = { [sortMap[sort] || "createdAt"]: order === "asc" ? "asc" : "desc" };

  const where: Record<string, unknown> = {};
  where.roles = { has: "CUSTOMER" };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }
  if (city) where.city = city;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          avatar: true,
          roles: true,
          premiumUntil: true,
          createdAt: true,
          _count: {
            select: {
              jobs: true,
              sentMessages: true,
              reviews: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      customers: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        city: u.city,
        avatar: u.avatar,
        roles: u.roles,
        isPremium: u.premiumUntil ? new Date(u.premiumUntil) > new Date() : false,
        createdAt: u.createdAt.toISOString(),
        stats: {
          totalJobs: u._count.jobs,
          totalMessages: u._count.sentMessages,
          totalReviews: u._count.reviews,
          totalFavorites: u._count.favorites,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("CRM customer list error:", error);
    return NextResponse.json(
      { error: "Müşteriler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
