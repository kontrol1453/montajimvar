"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";

interface DisputeItem {
  id: number;
  reason: string;
  status: string;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
  job: { id: number; title: string } | null;
}

interface CompanyDisputesProps {
  profileId: number;
  data: DisputeItem[];
}

const RES_LABELS: Record<string, string> = {
  refund_customer: "Müşteriye İade",
  release_artisan: "Ustaya Ödeme",
  split_50: "%50-%50",
};

export default function CompanyDisputes({ profileId, data }: CompanyDisputesProps) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-4 p-8 text-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <p className="text-sm text-[var(--admin-text-muted)]">Bu firmaya ait anlaşmazlık kaydı bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {data.map((d) => (
        <div key={d.id} className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              <EntityStatus
                variant={d.status === "open" ? "danger" : "success"}
                label={d.status === "open" ? "Açık" : "Çözüldü"}
                dot
              />
              {d.job && (
                <Link
                  href={`/admin/isler/${d.job.id}`}
                  className="block text-sm font-medium text-[var(--admin-primary)] hover:underline"
                >
                  {d.job.title}
                </Link>
              )}
            </div>
            <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(d.createdAt))}</span>
          </div>
          <p className="text-sm text-[var(--admin-text-primary)]">{d.reason}</p>
          {d.resolution && (
            <p className="text-xs text-[var(--admin-text-secondary)] mt-1">
              Çözüm: {RES_LABELS[d.resolution] || d.resolution}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
