import { prisma } from "@/lib/prisma";

interface CompanyActivitySectionProps {
  profileId: number;
}

export default async function CompanyActivitySection({ profileId }: CompanyActivitySectionProps) {
  const logs = await prisma.adminAuditLog.findMany({
    where: { entity: "profile", entityId: profileId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      action: true,
      details: true,
      createdAt: true,
      adminId: true,
    },
  });

  if (logs.length === 0) return null;

  const adminIds = [...new Set(logs.map((l) => l.adminId))];
  const admins = adminIds.length
    ? await prisma.user.findMany({
        where: { id: { in: adminIds } },
        select: { id: true, name: true },
      })
    : [];
  const adminMap = new Map(admins.map((a) => [a.id, a.name]));

  const actionColor: Record<string, string> = {
    approve: "text-[var(--admin-success)]",
    unverify: "text-[var(--admin-danger)]",
    feature: "text-[var(--admin-warning)]",
    unfeature: "text-[var(--admin-text-muted)]",
    update: "text-[var(--admin-info)]",
    delete: "text-[var(--admin-danger)]",
    create: "text-[var(--admin-success)]",
  };

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          Yönetim Geçmişi ({logs.length})
        </h2>
      </div>
      <div className="divide-y divide-[var(--admin-border)]">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-3 flex items-center gap-4">
            <span className={`text-xs font-medium capitalize w-20 ${actionColor[log.action] || "text-[var(--admin-text-secondary)]"}`}>
              {log.action}
            </span>
            <div className="flex-1 min-w-0">
              {log.details && (
                <p className="text-xs text-[var(--admin-text-muted)] truncate">{log.details}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-[var(--admin-text-secondary)]">{adminMap.get(log.adminId) ?? `Admin #${log.adminId}`}</p>
              <p className="text-[10px] text-[var(--admin-text-muted)]">{new Date(log.createdAt).toLocaleString("tr-TR")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
