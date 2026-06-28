import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/jobs — list available jobs (for artisans)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminAll = searchParams.get("admin") === "all";
    const status = searchParams.get("status") || (adminAll ? undefined : "pending");
    const categoryId = searchParams.get("categoryId");
    const city = searchParams.get("city");
    const q = searchParams.get("q");
    const artisanId = searchParams.get("artisanId");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (city) where.city = city;
    if (artisanId) {
      // Fetch jobs where this artisan has an accepted offer
      where.offers = {
        some: { artisanId: Number(artisanId), status: "accepted" },
      };
    }
    if (categoryId) {
      where.categories = {
        some: { categoryId: Number(categoryId) },
      };
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const includeOpts: Record<string, unknown> = {
      customer: { select: { id: true, name: true, avatar: true } },
      categories: {
        include: { category: { select: { id: true, name: true, slug: true, icon: true } } },
      },
      _count: { select: { offers: true, messages: true } },
    };

    if (adminAll) {
      includeOpts.offers = {
        include: { artisan: { select: { id: true, name: true, email: true } } },
      };
    } else {
      includeOpts.review = true;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: adminAll ? 0 : skip,
        take: adminAll ? undefined : limit,
        include: includeOpts,
      }),
      prisma.job.count({ where }),
    ]);

    if (adminAll) {
      return NextResponse.json(jobs);
    }

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("İş listeleme hatası:", error);
    return NextResponse.json(
      { error: "İşler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

// POST /api/jobs — create a new job
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = Number((session.user as any).id);

  try {
    const body = await request.json();
    const {
      title,
      description,
      photos,
      location,
      lat,
      lng,
      city,
      district,
      budgetMin,
      budgetMax,
      categoryIds,
      urgency,
      accessInfo,
    } = body;

    if (!title || !description || !city || !categoryIds?.length) {
      return NextResponse.json(
        { error: "Başlık, açıklama, şehir ve en az bir kategori zorunludur." },
        { status: 400 }
      );
    }

    if (title.length < 10) {
      return NextResponse.json(
        { error: "Başlık en az 10 karakter olmalıdır." },
        { status: 400 }
      );
    }

    if (description.length < 20) {
      return NextResponse.json(
        { error: "Açıklama en az 20 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        customerId: userId,
        title,
        description,
        photos: photos ? JSON.stringify(photos) : "[]",
        location,
        lat: lat ?? null,
        lng: lng ?? null,
        city,
        district: district ?? null,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        urgency: urgency ?? null,
        accessInfo: accessInfo ?? null,
        status: "pending",
        categories: {
          create: categoryIds.map((id: number) => ({ categoryId: id })),
        },
        timeline: {
          create: {
            status: "pending",
            note: "İş oluşturuldu",
          },
        },
      },
      include: {
        categories: {
          include: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    return NextResponse.json({ job, message: "İş başarıyla oluşturuldu." }, { status: 201 });
  } catch (error) {
    console.error("İş oluşturma hatası:", error);
    return NextResponse.json(
      { error: "İş oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
