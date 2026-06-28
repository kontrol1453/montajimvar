"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-900/40 text-yellow-400",
  offers_received: "bg-blue-900/40 text-blue-400",
  assigned: "bg-green-900/40 text-green-400",
  en_route: "bg-cyan-900/40 text-cyan-400",
  in_progress: "bg-indigo-900/40 text-indigo-400",
  completed: "bg-emerald-900/40 text-emerald-400",
  review_pending: "bg-purple-900/40 text-purple-400",
  cancelled: "bg-red-900/40 text-red-400",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

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
      if (res.ok) {
        toast.success("İş iptal edildi.");
        loadJobs();
      } else {
        const err = await res.json();
        toast.error(err.error || "İptal edilemedi.");
      }
    } catch { toast.error("Bir hata oluştu."); }
  }

  async function deleteJob(jobId: number) {
    if (!confirm("Bu işi KALICI olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("İş silindi.");
        loadJobs();
      } else toast.error("Silinemedi.");
    } catch { toast.error("Bir hata oluştu."); }
  }

  const filtered = jobs.filter(j => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) &&
        !j.customer.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-sub-text">Yükleniyor...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">İş Yönetimi</h1>
        <span className="text-sm text-sub-text">Toplam: {jobs.length} iş</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white">
          <option value="all">Tüm Durumlar</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="İş veya müşteri ara..."
          className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white flex-1 min-w-[200px]" />
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sub-text text-center py-8">İş bulunamadı.</p>
        ) : filtered.map(job => (
          <div key={job.id} className="bg-dark-card rounded-xl border border-dark-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-white truncate">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[job.status] || "bg-gray-900/40 text-gray-400"}`}>
                    {STATUS_LABELS[job.status] || job.status}
                  </span>
                </div>
                <p className="text-xs text-sub-text">
                  <span className="text-montaj">{job.customer.name}</span>
                  {job.city && <span> · {job.city}</span>}
                  {job.budgetMin && <span> · ₺{job.budgetMin}{job.budgetMax ? `-${job.budgetMax}` : "+"}</span>}
                  <span> · {new Date(job.createdAt).toLocaleDateString("tr-TR")}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{job.description}</p>
                {job.offers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.offers.map(offer => (
                      <span key={offer.id} className="text-xs bg-dark-bg px-2 py-1 rounded-full text-sub-text border border-dark-border">
                        {offer.artisan.name}: ₺{offer.amount}
                        {offer.duration && ` (${offer.duration})`}
                        <span className={`ml-1 ${offer.status === "accepted" ? "text-green-400" : offer.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}>
                          · {offer.status === "accepted" ? "Kabul" : offer.status === "rejected" ? "Red" : "Bekliyor"}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  className="text-xs text-montaj hover:underline">
                  {selectedJob?.id === job.id ? "Gizle" : "Detay"}
                </button>
                {job.status !== "cancelled" && (
                  <button onClick={() => cancelJob(job.id)} className="text-xs text-yellow-400 hover:underline">İptal</button>
                )}
                <button onClick={() => deleteJob(job.id)} className="text-xs text-red-400 hover:underline">Sil</button>
              </div>
            </div>

            {/* Expanded details */}
            {selectedJob?.id === job.id && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-sm text-gray-300 mb-2 whitespace-pre-wrap">{job.description}</p>
                {job.offers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-sub-text font-medium mb-2">Teklifler:</p>
                    <table className="w-full text-xs">
                      <thead><tr className="text-sub-text border-b border-dark-border">
                        <th className="text-left py-1">Usta</th>
                        <th className="text-left py-1">Tutar</th>
                        <th className="text-left py-1">Süre</th>
                        <th className="text-left py-1">Durum</th>
                      </tr></thead>
                      <tbody>
                        {job.offers.map(o => (
                          <tr key={o.id} className="border-b border-dark-border/50">
                            <td className="py-1 text-white">{o.artisan.name}</td>
                            <td className="py-1">₺{o.amount}</td>
                            <td className="py-1 text-sub-text">{o.duration || "—"}</td>
                            <td className="py-1">
                              <span className={o.status === "accepted" ? "text-green-400" : o.status === "rejected" ? "text-red-400" : "text-yellow-400"}>
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
    </div>
  );
}
