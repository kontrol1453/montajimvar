import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/blog/[id] - Update a blog post (admin only)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data: Record<string, any> = {};

    const fields = ["title", "slug", "content", "excerpt", "coverImage", "categoryId", "author", "tags", "metaTitle", "metaDesc", "city", "serviceSlug", "isPublished"];
    for (const field of fields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    if (body.isPublished === true) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete a blog post (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
