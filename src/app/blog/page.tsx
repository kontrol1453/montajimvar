import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blog - Montajım Var",
  description: "Montaj, mobilya kurulumu ve ev dekorasyonu hakkında ipuçları, rehberler ve sektör haberleri.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Montajım Var Blog</h1>
      <p className="text-sub-text mb-8">Montaj, mobilya kurulumu ve dekorasyon hakkında ipuçları</p>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sub-text">Henüz blog yazısı bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-dark-card rounded-xl border border-dark-border p-6 hover:border-montaj/50 transition group"
            >
              <div className="flex items-start gap-4">
                {post.coverImage && (
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden hidden sm:block">
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-sub-text mb-1">
                    {post.category && <span>{post.category.name}</span>}
                    {post.publishedAt && (
                      <>
                        <span>·</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-montaj transition">{post.title}</h2>
                  {post.excerpt && <p className="text-muted-text text-sm mt-1 line-clamp-2">{post.excerpt}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
