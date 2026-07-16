import Badge from "@/components/ui/Badge";

interface JobOffersSectionProps {
  offers: {
    id: number;
    amount: number;
    status: string;
    duration: string | null;
    artisan: { id: number; name: string; email: string };
  }[];
}

export default function JobOffersSection({ offers }: JobOffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--admin-border)]">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          Teklifler ({offers.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--admin-surface-muted)] border-b border-[var(--admin-border)]">
              <th className="text-left px-6 py-3 text-xs text-[var(--admin-text-secondary)] font-medium">Usta</th>
              <th className="text-right px-6 py-3 text-xs text-[var(--admin-text-secondary)] font-medium">Tutar</th>
              <th className="text-right px-6 py-3 text-xs text-[var(--admin-text-secondary)] font-medium">Süre</th>
              <th className="text-center px-6 py-3 text-xs text-[var(--admin-text-secondary)] font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-[var(--admin-surface-muted)]">
                <td className="px-6 py-3">
                  <span className="font-medium text-[var(--admin-text-primary)]">{offer.artisan.name}</span>
                  <br />
                  <span className="text-xs text-[var(--admin-text-muted)]">{offer.artisan.email}</span>
                </td>
                <td className="px-6 py-3 text-right font-medium text-[var(--admin-text-primary)]">
                  ₺{offer.amount}
                </td>
                <td className="px-6 py-3 text-right text-[var(--admin-text-secondary)]">
                  {offer.duration || "—"}
                </td>
                <td className="px-6 py-3 text-center">
                  <Badge variant={
                    offer.status === "accepted" ? "success" :
                    offer.status === "rejected" ? "danger" : "warning"
                  }>
                    {offer.status === "accepted" ? "Kabul" : offer.status === "rejected" ? "Red" : "Bekliyor"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
