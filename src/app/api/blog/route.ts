import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/blog - List published posts (public)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "true";

  if (includeAll) {
    const session = await auth();
    if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }
  }

  const posts = await prisma.blogPost.findMany({
    where: includeAll ? {} : { isPublished: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: includeAll ? { createdAt: "desc" } : { publishedAt: "desc" },
  });

  return NextResponse.json(posts);
}

// POST /api/blog - Create a blog post (admin only)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { title, slug, content, excerpt, coverImage, categoryId, author, tags, metaTitle, metaDesc, city, serviceSlug, isPublished } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Başlık, slug ve içerik zorunludur." }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        categoryId: categoryId ? Number(categoryId) : null,
        author: author || null,
        tags: tags || "[]",
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        city: city || null,
        serviceSlug: serviceSlug || null,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Bu slug ile bir yazı zaten mevcut." }, { status: 409 });
    }
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
