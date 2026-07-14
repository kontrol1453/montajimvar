"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import Badge from "@/components/ui/Badge";
import RowActionsDropdown from "@/components/admin/DataTable/RowActionsDropdown";
import Dialog from "@/components/admin/Dialog";
import { Trash2 } from "lucide-react";

interface FirmReview {
  id: number;
  type: "firma";
  rating: number;
  comment: string | null;
  createdAt: string;
  profile: { id: number; companyName: string };
  user: { id: number; name: string };
}

interface JobReview {
  id: number;
  type: "is";
  rating: number;
  comment: string | null;
  createdAt: string;
  job: { id: number; title: string; customer: { name: string } };
}

type Review = FirmReview | JobReview;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const [firmRes, jobRes] = await Promise.all([
        fetch("/api/reviews?admin=true"),
        fetch("/api/jobs/reviews"),
      ]);
      const firmData: FirmReview[] = firmRes.ok ? await firmRes.json() : [];
      const jobData: JobReview[] = jobRes.ok ? await jobRes.json() : [];

      const all = [
        ...firmData.map(r => ({ ...r, type: "firma" as const })),
        ...jobData.map(r => ({ ...r, type: "is" as const })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setReviews(all);
    } catch {
      toast.error("Yorumlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const endpoint = deleteTarget.type === "firma"
        ? `/api/reviews?id=${deleteTarget.id}`
        : `/api/jobs/${(deleteTarget as JobReview).job.id}/review`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) { toast.success("Yorum silindi."); loadReviews(); }
      else toast.error("Silinemedi.");
    } catch { toast.error("Bir hata oluştu."); }
    finally { setDeleteTarget(null); }
  }

  const filtered = reviews.filter(r => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false;
    return true;
  });

  const columns: TableColumn<Review>[] = [
    {
      header: "Yorum",
      accessor: (r) => (
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-amber-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          {r.comment && <p className="text-xs text-[var(--admin-text-secondary)] line-clamp-2">{r.comment}</p>}
        </div>
      ),
    },
    {
      header: "Kaynak",
      accessor: (r) =>
        r.type === "firma" ? (
          <span className="text-[var(--admin-primary)] text-xs font-medium">
            {(r as FirmReview).profile.companyName}
          </span>
        ) : (
          <span className="text-xs text-[var(--admin-text-secondary)]">
            {(r as JobReview).job.title}
          </span>
        ),
    },
    {
      header: "Tür",
      accessor: (r) =>
        r.type === "firma" ? (
          <Badge variant="info">Firma</Badge>
        ) : (
          <Badge variant="neutral">İş</Badge>
        ),
    },
    {
      header: "Yazan",
      hidden: "md",
      accessor: (r) => (
        <span className="text-[var(--admin-text-secondary)] text-xs">
          {r.type === "firma" ? (r as FirmReview).user.name : (r as JobReview).job.customer.name}
        </span>
      ),
    },
    {
      header: "Tarih",
      hidden: "lg",
      accessor: (r) => (
        <span className="text-[var(--admin-text-muted)] text-xs">
          {new Date(r.createdAt).toLocaleDateString("tr-TR")}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <PageTitle>Yorum Yönetimi</PageTitle>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?type=reviews"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium"
            aria-label="Yorumları CSV olarak dışa aktar"
          >
            ⬇ CSV Export
          </a>
          <span className="text-sm text-[var(--admin-text-secondary)]">Toplam: {reviews.length} yorum</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-1.5 text-sm text-[var(--admin-text-primary)] focus:outline-none"
        >
          <option value="all">Tüm Türler</option>
          <option value="firma">Firma Yorumları</option>
          <option value="is">İş Yorumları</option>
        </select>
        <select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
          className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-1.5 text-sm text-[var(--admin-text-primary)] focus:outline-none"
        >
          <option value="all">Tüm Puanlar</option>
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{n} Yıldız</option>
          ))}
        </select>
      </div>

      <AdminTable<Review>
        rows={filtered}
        columns={columns}
        keyField={(r) => `${r.type}-${r.id}`}
        onRowClick={(r) => r.type === "is" ? window.location.href = `/admin/isler/${r.job?.id}` : window.location.href = `/admin/firmalar/${r.profile?.id}`}
        actions={(r) => (
          <RowActionsDropdown
            items={[
              { label: "Yorumu Sil", onClick: () => setDeleteTarget(r), variant: "danger", icon: Trash2 },
            ]}
          />
        )}
      />
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Yorumu Sil"
        description="Bu yorumu silmek istediğinize emin misiniz?"
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setDeleteTarget(null), variant: "ghost" },
          { label: "Sil", onClick: confirmDelete, variant: "danger" },
        ]}
      />
    </PageContainer>
  );
}
