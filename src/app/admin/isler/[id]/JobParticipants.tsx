"use client";

import Link from "next/link";
import { Users, Building2, Wrench } from "lucide-react";
import EntityLink from "@/components/admin/entity/EntityLink";

interface JobParticipantsProps {
  jobId: number;
  data?: {
    customer: { id: number; name: string; email: string; profile?: { id: number; companyName: string } };
    offers: { id: number; artisan: { id: number; name: string; email: string; profile?: { id: number; companyName: string } } }[];
  };
}

export default function JobParticipants({ jobId, data }: JobParticipantsProps) {
  if (!data) return null;

  const { customer, offers } = data;

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-sm font-semibold text-[var(--admin-text-primary)]">İş Sahibi</h3>
      <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] flex items-center justify-center text-sm font-bold shrink-0">
          {customer.name?.[0]?.toUpperCase() || "M"}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/admin/kullanicilar/${customer.id}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
            {customer.name}
          </Link>
          <p className="text-xs text-[var(--admin-text-muted)]">{customer.email}</p>
        </div>
        {customer.profile && (
          <Link
            href={`/admin/firmalar/${customer.profile.id}`}
            className="text-xs text-[var(--admin-primary)] hover:underline flex items-center gap-1 shrink-0"
          >
            <Building2 size={12} /> {customer.profile.companyName}
          </Link>
        )}
      </div>

      {offers.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)]">Teklif Veren Ustalar</h3>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
            {offers.map((offer) => (
              <div key={offer.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-[var(--admin-success-soft)] text-[var(--admin-success)] flex items-center justify-center text-sm font-bold shrink-0">
                  {offer.artisan.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/kullanicilar/${offer.artisan.id}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
                    {offer.artisan.name}
                  </Link>
                  <p className="text-xs text-[var(--admin-text-muted)]">{offer.artisan.email}</p>
                </div>
                {offer.artisan.profile && (
                  <Link
                    href={`/admin/firmalar/${offer.artisan.profile.id}`}
                    className="text-xs text-[var(--admin-primary)] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <Building2 size={12} /> {offer.artisan.profile.companyName}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}