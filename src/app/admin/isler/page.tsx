"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";
import { Search, Filter } from "lucide-react";

interface JobUser {
  id: number;
  name: string;
  email: string;
}

interface Offer {
  id: number;
  amount: number;
  status: string;
  duration: string | null;
  artisan: { id: number; name: string; email: string };
}

interface Job {
  id: number;
  title: string;
  status: string;
  description: string;
  city: string;
  budgetMin: number | null;
  budgetMax: number | null;
  createdAt: string;
  customer: JobUser;
  offers: Offer[];
  _count?: { offers: number; messages: number };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  offers_received: "Teklif Alındı",
  assigned: "Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor",
  cancelled: "İptal Edildi",
};

const STATUS_BADGE: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
  pending: "warning",
  offers_received: "info",
  assigned: "success",
  en_route: "neutral",
  in_progress: "info",
  completed: "success",
  review_pending: "warning",
  cancelled: "danger",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => { loadJobs(); }, []);

  async function loadJobs() {
    try {
      const res = await fetch("/api/jobs?admin=all");
      if (res.ok) setJobs(await res.json());
      else toast.error("İşler yüklenemedi.");
    } catch { toast.error("Bağlantı hatası."); }
    finally { setLoading(false); }
  }

  async function cancelJob(jobId: number) {
    if (!confirm("Bu işi iptal etmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) { toast.success("İş iptal edildi."); loadJobs(); }
      else { const err = await res.json(); toast.error(err.error || "İptal edilemedi."); }
    } catch { toast.error("Bir hata oluştu."); }
  }

  async function deleteJob(jobId: number) {
    if (!confirm("Bu işi KALICI olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) { toast.success("İş silindi."); loadJobs(); }
      else toast.error("Silinemedi.");
    } catch { toast.error("Bir hata oluştu."); }
  }

  const filtered = jobs.filter(j => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) &&
        !j.customer.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-[var(--admin-text-muted)]">Yükleniyor...</div>;

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <PageTitle>İş Yönetimi</PageTitle>
        <span className="text-sm text-[var(--admin-text-secondary)]">Toplam: {jobs.length} iş</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2">
          <Filter size={16} className="text-[var(--admin-text-muted)]" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm text-[var(--admin-text-primary)] focus:outline-none">
            <option value="all">Tüm Durumlar</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-[var(--admin-text-muted)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="İş veya müşteri ara..."
            className="bg-transparent text-sm text-[var(--admin-text-primary)] focus:outline-none flex-1 placeholder:text-[var(--admin-text-muted)]" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-[var(--admin-text-muted)] text-center py-8">İş bulunamadı.</p>
        ) : filtered.map(job => (
          <div key={job.id} className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[var(--admin-text-primary)] truncate">{job.title}</h3>
                  <Badge variant={STATUS_BADGE[job.status] || "neutral"}>
                    {STATUS_LABELS[job.status] || job.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--admin-text-secondary)]">
                  <span className="text-[var(--admin-primary)]">{job.customer.name}</span>
                  {job.city && <span> · {job.city}</span>}
                  {job.budgetMin && <span> · ₺{job.budgetMin}{job.budgetMax ? `-${job.budgetMax}` : "+"}</span>}
                  <span> · {new Date(job.createdAt).toLocaleDateString("tr-TR")}</span>
                </p>
                <p className="text-sm text-[var(--admin-text-muted)] mt-1 line-clamp-2">{job.description}</p>
                {job.offers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.offers.map(offer => (
                      <span key={offer.id} className="text-xs bg-[var(--admin-surface-muted)] px-2 py-1 rounded-full text-[var(--admin-text-secondary)] border border-[var(--admin-border)]">
                        {offer.artisan.name}: ₺{offer.amount}
                        {offer.duration && ` (${offer.duration})`}
                        <span className={`ml-1 ${
                          offer.status === "accepted" ? "text-[var(--admin-success)]" :
                          offer.status === "rejected" ? "text-[var(--admin-danger)]" : "text-[var(--admin-warning)]"
                        }`}>
                          · {offer.status === "accepted" ? "Kabul" : offer.status === "rejected" ? "Red" : "Bekliyor"}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  className="text-xs text-[var(--admin-primary)] hover:underline">
                  {selectedJob?.id === job.id ? "Gizle" : "Detay"}
                </button>
                {job.status !== "cancelled" && (
                  <button onClick={() => cancelJob(job.id)}
                    className="text-xs text-[var(--admin-warning)] hover:underline">İptal</button>
                )}
                <button onClick={() => deleteJob(job.id)}
                  className="text-xs text-[var(--admin-danger)] hover:underline">Sil</button>
              </div>
            </div>

            {selectedJob?.id === job.id && (
              <div className="mt-4 pt-4 border-t border-[var(--admin-border)]">
                <p className="text-sm text-[var(--admin-text-secondary)] mb-2 whitespace-pre-wrap">{job.description}</p>
                {job.offers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-[var(--admin-text-secondary)] font-medium mb-2">Teklifler:</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-[var(--admin-text-muted)] border-b border-[var(--admin-border)]">
                          <th className="text-left py-1">Usta</th>
                          <th className="text-left py-1">Tutar</th>
                          <th className="text-left py-1">Süre</th>
                          <th className="text-left py-1">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.offers.map(o => (
                          <tr key={o.id} className="border-b border-[var(--admin-border)]/50">
                            <td className="py-1 text-[var(--admin-text-primary)]">{o.artisan.name}</td>
                            <td className="py-1">₺{o.amount}</td>
                            <td className="py-1 text-[var(--admin-text-secondary)]">{o.duration || "—"}</td>
                            <td className="py-1">
                              <span className={
                                o.status === "accepted" ? "text-[var(--admin-success)]" :
                                o.status === "rejected" ? "text-[var(--admin-danger)]" : "text-[var(--admin-warning)]"
                              }>
                                {o.status === "accepted" ? "Kabul Edildi" : o.status === "rejected" ? "Reddedildi" : "Bekliyor"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
