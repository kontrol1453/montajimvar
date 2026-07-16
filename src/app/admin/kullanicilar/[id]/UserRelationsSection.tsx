import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface UserRelationsSectionProps {
  userId: number;
}

export default async function UserRelationsSection({ userId }: UserRelationsSectionProps) {
  const profiles = await prisma.profile.findMany({
    where: { userId },
    select: {
      id: true,
      companyName: true,
      city: true,
      isVerified: true,
      isFeatured: true,
      category: { select: { name: true } },
    },
  });

  const offers = await prisma.offer.findMany({
    where: { artisanId: userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      amount: true,
      status: true,
      job: { select: { id: true, title: true } },
      createdAt: true,
    },
  });

  const disputes = await prisma.dispute.findMany({
    where: { openedBy: { id: userId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      reason: true,
      status: true,
      job: { select: { id: true, title: true } },
      createdAt: true,
    },
  });

  const hasAny = profiles.length > 0 || offers.length > 0 || disputes.length > 0;
  if (!hasAny) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {profiles.length > 0 && (
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--admin-border)]">
            <h3 className="text-sm font-semibold text-[var(--admin-text-primary)]">Firma Profilleri</h3>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {profiles.map((p) => (
              <Link key={p.id} href={`/admin/firmalar/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)]">{p.companyName}</p>
                  <p className="text-xs text-[var(--admin-text-muted)]">{p.category?.name ?? ""}{p.city ? ` · ${p.city}` : ""}</p>
                </div>
                {p.isVerified ? <Badge variant="success">Onaylı</Badge> : <Badge variant="neutral">Bekliyor</Badge>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {offers.length > 0 && (
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--admin-border)]">
            <h3 className="text-sm font-semibold text-[var(--admin-text-primary)]">Son Teklifler</h3>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {offers.map((o) => (
              <Link key={o.id} href={`/admin/isler/${o.job.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)]">{o.job.title}</p>
                  <p className="text-xs text-[var(--admin-text-muted)]">₺{o.amount}</p>
                </div>
                <Badge variant={o.status === "accepted" ? "success" : o.status === "rejected" ? "danger" : "warning"}>
                  {o.status === "accepted" ? "Kabul" : o.status === "rejected" ? "Red" : "Bekliyor"}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {disputes.length > 0 && (
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--admin-border)]">
            <h3 className="text-sm font-semibold text-[var(--admin-text-primary)]">Anlaşmazlıklar</h3>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {disputes.map((d) => (
              <Link key={d.id} href={`/admin/anlasmazliklar/${d.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-surface-muted)] transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--admin-text-primary)] truncate group-hover:text-[var(--admin-primary)]">{d.job.title}</p>
                  <p className="text-xs text-[var(--admin-text-muted)] truncate">{d.reason}</p>
                </div>
                <Badge variant={d.status === "open" ? "warning" : "success"}>
                  {d.status === "open" ? "Açık" : "Çözüldü"}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
