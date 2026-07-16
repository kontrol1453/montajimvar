import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface JobDetailHeaderProps {
  job: {
    id: number;
    title: string;
    description: string;
    status: string;
    city: string;
    location: string | null;
    budgetMin: number | null;
    budgetMax: number | null;
    createdAt: Date;
    customer: { id: number; name: string; email: string; phone: string | null };
    categories: { category: { id: number; name: string } }[];
    payment: { id: number; amount: number; commission: number; status: string; createdAt: Date } | null;
    _count: { messages: number; offers: number };
  };
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

const STATUS_COLORS: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
  pending: "warning",
  offers_received: "info",
  assigned: "success",
  en_route: "neutral",
  in_progress: "info",
  completed: "success",
  review_pending: "warning",
  cancelled: "danger",
};

export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const j = job;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-[var(--admin-text-primary)]">{j.title}</h1>
              <Badge variant={STATUS_COLORS[j.status] || "neutral"}>
                {STATUS_LABELS[j.status] || j.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {j.categories.map((cat) => (
                <Badge key={cat.category.id} variant="info">{cat.category.name}</Badge>
              ))}
            </div>
          </div>
          <Link
            href="/admin/isler"
            className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
          >
            ← İş Listesi
          </Link>
        </div>

        <p className="text-sm text-[var(--admin-text-secondary)] whitespace-pre-wrap line-clamp-4 mb-4">{j.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Müşteri</p>
            <Link href={`/admin/kullanicilar/${j.customer.id}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
              {j.customer.name}
            </Link>
          </div>
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Şehir</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{j.city}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Bütçe</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">
              {j.budgetMin ? `₺${j.budgetMin}${j.budgetMax ? ` - ₺${j.budgetMax}` : "+"}` : "Belirtilmemiş"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
            <p className="text-xs text-[var(--admin-text-muted)]">Oluşturma</p>
            <p className="text-sm font-medium text-[var(--admin-text-primary)]">{new Date(j.createdAt).toLocaleDateString("tr-TR")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {j.location && (
            <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
              <p className="text-xs text-[var(--admin-text-muted)]">Konum</p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)]">{j.location}</p>
            </div>
          )}
          {j.payment && (
            <div className="p-3 rounded-lg bg-[var(--admin-surface-muted)]">
              <p className="text-xs text-[var(--admin-text-muted)]">Ödeme</p>
              <p className="text-sm font-medium text-[var(--admin-text-primary)]">
                ₺{j.payment.amount} · {j.payment.status === "completed" ? "Tamamlandı" : j.payment.status === "escrow" ? "Blokede" : j.payment.status}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-primary)]">{j._count.offers}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Teklif</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-[var(--admin-border)]">
            <p className="text-2xl font-bold text-[var(--admin-info)]">{j._count.messages}</p>
            <p className="text-xs text-[var(--admin-text-muted)]">Mesaj</p>
          </div>
        </div>
      </div>
    </div>
  );
}
