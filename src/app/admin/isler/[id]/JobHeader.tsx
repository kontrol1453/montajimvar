import Link from "next/link";
import { MapPin, Hash } from "lucide-react";
import EntityHeader from "@/components/admin/entity/EntityHeader";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor", offers_received: "Teklif Alındı", assigned: "Atandı",
  en_route: "Yolda", in_progress: "Devam Ediyor", completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor", cancelled: "İptal Edildi",
};
const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  pending: "warning", offers_received: "info", assigned: "success",
  en_route: "neutral", in_progress: "info", completed: "success",
  review_pending: "warning", cancelled: "danger",
};

export default function JobHeader({ job }: any) {
  const customerProfile = job.customer?.profile;
  const categories = job.categories?.map((c: any) => c.category.name).join(", ") || "";

  return (
    <EntityHeader
      title={job.title}
      subtitle={`#${job.id}`}
      badges={
        <>
          <EntityStatus
            variant={STATUS_VARIANT[job.status] || "neutral"}
            label={STATUS_LABELS[job.status] || job.status}
            dot={false}
          />
          {categories && <EntityStatus variant="info" label={categories} dot={false} />}
        </>
      }
      meta={[
        { label: "Şehir", value: `${job.city}${job.district ? `, ${job.district}` : ""}` },
        ...(job.budgetMin ? [{ label: "Bütçe", value: `₺${job.budgetMin}${job.budgetMax ? ` - ₺${job.budgetMax}` : "+"}` }] : []),
        { label: "Oluşturuldu", value: formatDate(new Date(job.createdAt)) },
        ...(job.urgency ? [{ label: "Acil", value: job.urgency === "acil" ? "Acil" : job.urgency === "cok_acil" ? "Çok Acil" : "Normal" }] : []),
      ]}
      extra={
        <Link
          href={`/admin/kullanicilar/${job.customer.id}`}
          className="text-xs text-[var(--admin-primary)] hover:underline inline-flex items-center gap-1"
        >
          {job.customer.name} →
        </Link>
      }
    />
  );
}