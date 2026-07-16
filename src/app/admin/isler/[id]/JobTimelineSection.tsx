import { prisma } from "@/lib/prisma";

interface JobTimelineSectionProps {
  jobId: number;
}

export default async function JobTimelineSection({ jobId }: JobTimelineSectionProps) {
  const logs = await prisma.adminAuditLog.findMany({
    where: { entity: "job", entityId: jobId },
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

  const hasAny = logs.length > 0;
  if (!hasAny) return null;

  const adminIds = [...new Set(logs.map((l) => l.adminId))];
  const admins = adminIds.length
    ? await prisma.user.findMany({
        where: { id: { in: adminIds } },
        select: { id: true, name: true },
      })
    : [];
  const adminMap = new Map(admins.map((a) => [a.id, a.name]));

  const actionLabel: Record<string, string> = {
    create: "Oluşturuldu",
    update: "Güncellendi",
    delete: "Silindi",
    cancel: "İptal Edildi",
    approve: "Onaylandı",
    reject: "Reddedildi",
  };

  const actionColor: Record<string, string> = {
    create: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
    update: "bg-[var(--admin-info-soft)] text-[var(--admin-info)]",
    delete: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
    cancel: "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
    approve: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
  };

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          İş Zaman Çizelgesi
        </h2>
      </div>
      <div className="p-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--admin-border)]" aria-hidden />
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-10">
                <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-[var(--admin-surface)] ${actionColor[log.action] || "bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]"}`} aria-hidden />
                <div>
                  <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                    {actionLabel[log.action] || log.action}
                  </p>
                  {log.details && (
                    <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">{log.details}</p>
                  )}
                  <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5">
                    {adminMap.get(log.adminId) ?? `Admin #${log.adminId}`}
                    {" · "}
                    {new Date(log.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
