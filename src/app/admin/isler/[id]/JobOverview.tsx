import Link from "next/link";
import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor", offers_received: "Teklif Alındı", assigned: "Atandı",
  en_route: "Yolda", in_progress: "Devam Ediyor", completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor", cancelled: "İptal",
};

export default function JobOverview({ job }: any) {
  const customerProfile = job.customer?.profile;

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">İş Bilgileri</h3>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            {[
              ["Başlık", job.title],
              ["Açıklama", job.description],
              ["Şehir", `${job.city}${job.district ? `, ${job.district}` : ""}`],
              ...(job.location ? [["Konum", job.location]] : []),
              ...(job.budgetMin ? [["Bütçe", `₺${job.budgetMin}${job.budgetMax ? ` - ₺${job.budgetMax}` : "+"}`]] : []),
              ["Durum", STATUS_LABELS[job.status] || job.status],
              ["Kategoriler", job.categories?.map((c: any) => c.category.name).join(", ") || "—"],
              ...(job.urgency ? [["Acil", job.urgency === "acil" ? "Acil" : "Çok Acil"]] : []),
              ...(job.accessInfo ? [["Erişim Bilgisi", job.accessInfo]] : []),
              ["Oluşturuldu", formatDate(new Date(job.createdAt))],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-start justify-between px-4 py-3 border-b border-[var(--admin-border)] last:border-b-0">
                <span className="text-xs text-[var(--admin-text-secondary)] shrink-0">{label}</span>
                <span className="text-sm text-[var(--admin-text-primary)] text-right ml-4">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Katılımcılar</h3>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] divide-y divide-[var(--admin-border)]">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] flex items-center justify-center text-sm font-bold">
                  {job.customer.name?.[0]?.toUpperCase() || "M"}
                </div>
                <div>
                  <Link href={`/admin/kullanicilar/${job.customer.id}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
                    {job.customer.name}
                  </Link>
                  <p className="text-xs text-[var(--admin-text-muted)]">{job.customer.email}</p>
                </div>
              </div>
              <span className="text-xs bg-[var(--admin-info-soft)] text-[var(--admin-info)] px-2 py-0.5 rounded-full font-medium">Müşteri</span>
            </div>
            {customerProfile && (
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--admin-warning-soft)] text-[var(--admin-warning)] flex items-center justify-center text-xs font-bold">
                    {customerProfile.companyName?.[0]?.toUpperCase() || "F"}
                  </div>
                  <div>
                    <Link href={`/admin/firmalar/${customerProfile.id}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
                      {customerProfile.companyName}
                    </Link>
                    <p className="text-xs text-[var(--admin-text-muted)]">Firma Profili</p>
                  </div>
                </div>
                <span className="text-xs bg-[var(--admin-warning-soft)] text-[var(--admin-warning)] px-2 py-0.5 rounded-full font-medium">Bağlı Firma</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Pazar Yeri Göstergeleri</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Teklifler", job._count.offers],
              ["Mesajlar", job._count.messages],
            ].map(([label, count]) => (
              <div key={label} className="p-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
                <p className="text-lg font-bold text-[var(--admin-text-primary)]">{count}</p>
                <p className="text-[11px] text-[var(--admin-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Operasyonel Risk</h3>
          <div className="space-y-2">
            {[
              [job._count.offers === 0 && job.status === "pending", "Teklif Yok", "Bu iş henüz teklif almamış"],
              [job.status === "cancelled", "İptal Edilmiş", "İş iptal edildi"],
            ].filter(([cond]) => cond).map(([, label, desc]) => (
              <div key={String(label)} className="p-3 rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)]">
                <p className="text-sm font-medium text-[var(--admin-danger)]">{label}</p>
                <p className="text-xs text-[var(--admin-text-secondary)]">{desc}</p>
              </div>
            ))}
            {!job._count.offers && job.status !== "pending" && job.status !== "cancelled" && (
              <div className="p-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
                <p className="text-xs text-[var(--admin-text-secondary)]">Operasyonel risk tespit edilmedi.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}