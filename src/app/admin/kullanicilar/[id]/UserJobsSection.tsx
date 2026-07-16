import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";

interface UserJobsSectionProps {
  userId: number;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  offers_received: "Teklif Aldı",
  assigned: "Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor",
  cancelled: "İptal",
};

const STATUS_BADGE: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
  pending: "warning",
  offers_received: "info",
  assigned: "success",
  en_route: "neutral",
  in_progress: "info",
  completed: "success",
  review_pending: "warning",
  cancelled: "danger",
};

export default async function UserJobsSection({ userId }: UserJobsSectionProps) {
  const jobs = await prisma.job.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      status: true,
      city: true,
      budgetMin: true,
      budgetMax: true,
      createdAt: true,
      _count: { select: { offers: true } },
    },
  });

  if (jobs.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          Son İşler ({jobs.length})
        </h2>
      </div>
      <div className="divide-y divide-[var(--admin-border)]">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/admin/isler/${job.id}`}
            className="flex items-center gap-4 px-6 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)] transition-colors">
                {job.title}
              </p>
              <p className="text-xs text-[var(--admin-text-muted)]">
                {job.city}{job.budgetMin ? ` · ₺${job.budgetMin}${job.budgetMax ? `-${job.budgetMax}` : "+"}` : ""}
                <span className="ml-2">{new Date(job.createdAt).toLocaleDateString("tr-TR")}</span>
              </p>
            </div>
            <span className="text-xs text-[var(--admin-text-muted)]">{job._count.offers} teklif</span>
            <Badge variant={STATUS_BADGE[job.status] || "neutral"}>
              {STATUS_LABELS[job.status] || job.status}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
