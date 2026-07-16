import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface UserActivitySectionProps {
  userId: number;
}

const ACTION_LABELS: Record<string, string> = {
  create: "Oluşturma",
  update: "Güncelleme",
  delete: "Silme",
  approve: "Onay",
  reject: "Red",
  suspend: "Askıya Al",
  role_change: "Rol Değişikliği",
  premium_change: "Premium Değişikliği",
  verify: "Doğrula",
};

const ENTITY_LINKS: Record<string, (id: number) => string> = {
  user: (id) => `/admin/kullanicilar/${id}`,
  profile: (id) => `/admin/firmalar/${id}`,
  job: (id) => `/admin/isler/${id}`,
};

export default async function UserActivitySection({ userId }: UserActivitySectionProps) {
  const logs = await prisma.adminAuditLog.findMany({
    where: {
      OR: [
        { entity: "user", entityId: userId },
        { entity: "profile", entityId: userId },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      action: true,
      entity: true,
      entityId: true,
      details: true,
      createdAt: true,
      adminId: true,
    },
  });

  const adminIds = [...new Set(logs.map((l) => l.adminId))];
  const admins = adminIds.length
    ? await prisma.user.findMany({
        where: { id: { in: adminIds } },
        select: { id: true, name: true },
      })
    : [];
  const adminMap = new Map(admins.map((a) => [a.id, a.name]));

  if (logs.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          Aktivite Geçmişi ({logs.length})
        </h2>
      </div>
      <div className="divide-y divide-[var(--admin-border)]">
        {logs.map((log) => {
          const entityLink = ENTITY_LINKS[log.entity];
          return (
            <div key={log.id} className="px-6 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--admin-text-primary)]">
                  <span className="font-medium">{ACTION_LABELS[log.action] || log.action}</span>
                  {" — "}
                  {entityLink ? (
                    <Link href={entityLink(log.entityId)} className="text-[var(--admin-primary)] hover:underline">
                      {log.entity} #{log.entityId}
                    </Link>
                  ) : (
                    <span className="text-[var(--admin-text-secondary)]">{log.entity} #{log.entityId}</span>
                  )}
                </p>
                {log.details && (
                  <p className="text-xs text-[var(--admin-text-muted)] mt-0.5 truncate max-w-lg">{log.details}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[var(--admin-text-secondary)]">{adminMap.get(log.adminId) ?? `Admin #${log.adminId}`}</p>
                <p className="text-[10px] text-[var(--admin-text-muted)]">{new Date(log.createdAt).toLocaleString("tr-TR")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
