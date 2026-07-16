import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface CompanyReviewsSectionProps {
  profileId: number;
}

export default async function CompanyReviewsSection({ profileId }: CompanyReviewsSectionProps) {
  const reviews = await prisma.review.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, name: true } },
    },
  });

  if (reviews.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          Son Yorumlar ({reviews.length})
        </h2>
      </div>
      <div className="divide-y divide-[var(--admin-border)]">
        {reviews.map((review) => (
          <div key={review.id} className="px-6 py-3">
            <div className="flex items-center justify-between mb-1">
              <Link
                href={`/admin/kullanicilar/${review.user.id}`}
                className="text-sm font-medium text-[var(--admin-primary)] hover:underline"
              >
                {review.user.name}
              </Link>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < review.rating ? "text-amber-500" : "text-[var(--admin-text-muted)]"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-xs text-[var(--admin-text-muted)] ml-2">
                  {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-[var(--admin-text-secondary)]">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
