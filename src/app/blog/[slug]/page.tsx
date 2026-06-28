import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, metaTitle: true, metaDesc: true, excerpt: true, coverImage: true },
  });
  if (!post) return { title: "Yazı Bulunamadı - Montajım Var" };

  return {
    title: post.metaTitle || `${post.title} - Montajım Var Blog`,
    description: post.metaDesc || post.excerpt || undefined,
    openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!post || !post.isPublished) notFound();

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blog" className="text-sm text-montaj hover:underline mb-4 inline-block">
        ← Blog'a Dön
      </Link>

      {post.coverImage && (
        <div className="rounded-xl overflow-hidden mb-6 aspect-video">
          <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-sub-text mb-2">
        {post.category && <span>{post.category.name}</span>}
        {post.publishedAt && (
          <>
            <span>·</span>
            <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
          </>
        )}
        <span>·</span>
        <span>{post.viewCount} görüntülenme</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

      {post.author && <p className="text-sm text-sub-text mb-6">Yazar: {post.author}</p>}

      <div
        className="prose prose-invert max-w-none [&_h2]:text-white [&_h3]:text-white [&_p]:text-gray-200 [&_li]:text-gray-200 [&_a]:text-montaj [&_img]:rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
