import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Camera } from "lucide-react";

function estimateReadTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogSection() {
  let posts: { title: string; slug: string; excerpt: string | null; coverImage: string | null; publishedAt: Date | null }[] = [];

  try {
    const result = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true },
    });
    posts = result;
  } catch {
    // Blog table may not exist yet
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Blog
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Montaj Sektöründen Haberler
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Profesyonel montaj ipuçları, sektör haberleri ve rehberler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card overflow-hidden group">
                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <Camera size={32} className="text-[var(--color-text-tertiary)]" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] mb-2">
                    {post.publishedAt && <span>{formatDate(new Date(post.publishedAt))}</span>}
                    {post.excerpt && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)]" />
                        <span>{estimateReadTime(post.excerpt)} dk okuma</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-bold text-[var(--color-dark)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length >= 3 && (
          <div className="text-center mt-10">
            <Link href="/blog" className="btn-secondary">
              Tüm Yazılar
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
