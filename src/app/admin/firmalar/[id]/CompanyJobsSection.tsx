import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface CompanyJobsSectionProps {
  profileId: number;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  offers_received: "Teklif Aldı",
  assigned: "Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

export default async function CompanyJobsSection({ profileId }: CompanyJobsSectionProps) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { userId: true },
  });
  if (!profile) return null;

  const jobs = await prisma.job.findMany({
    where: {
      offers: { some: { artisanId: profile.userId } },
    },
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
      customer: { select: { name: true } },
    },
  });

  if (jobs.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          İlgili İşler ({jobs.length})
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
              <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)]">
                {job.title}
              </p>
              <p className="text-xs text-[var(--admin-text-muted)]">
                {job.customer.name}{job.city ? ` · ${job.city}` : ""}
                {job.budgetMin ? ` · ₺${job.budgetMin}${job.budgetMax ? `-${job.budgetMax}` : "+"}` : ""}
              </p>
            </div>
            <Badge variant={
              job.status === "completed" ? "success" :
              job.status === "cancelled" ? "danger" :
              job.status === "in_progress" ? "info" : "neutral"
            }>
              {STATUS_LABELS[job.status] || job.status}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
