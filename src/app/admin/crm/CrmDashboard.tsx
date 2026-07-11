"use client";

import { useState } from "react";
import { Phone, TrendingUp, Users, ClipboardList, CheckCircle, Clock } from "lucide-react";

interface CrmData {
  totalJobs: number;
  pendingJobs: number;
  totalOffers: number;
  acceptedOffers: number;
  completedJobs: number;
  conversionRate: number;
  users: number;
  recentJobs: {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    customer: { name: string; email: string; phone: string | null };
    categories: { category: { name: string }; id: number; categoryId: number; jobId: number }[];
    _count: { offers: number };
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  offers_received: "Teklifler Geldi",
  assigned: "Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "İnceleniyor",
  cancelled: "İptal",
};

export default function CrmDashboard({ data }: { data: CrmData }) {
  const [callReminder, setCallReminder] = useState<{ jobId: number; note: string } | null>(null);
  const [reminderSending, setReminderSending] = useState(false);
  const [reminderDone, setReminderDone] = useState(false);

  const cards = [
    { label: "Toplam İş", value: data.totalJobs, icon: ClipboardList, color: "#0B5FFF" },
    { label: "Bekleyen İş", value: data.pendingJobs, icon: Clock, color: "#F59E0B" },
    { label: "Toplam Teklif", value: data.totalOffers, icon: TrendingUp, color: "#00C853" },
    { label: "Onaylanan Teklif", value: data.acceptedOffers, icon: CheckCircle, color: "#8B5CF6" },
    { label: "Tamamlanan", value: data.completedJobs, icon: CheckCircle, color: "#00C853" },
    { label: "Dönüşüm Oranı", value: `%${data.conversionRate}`, icon: TrendingUp, color: "#0B5FFF" },
    { label: "Toplam Kullanıcı", value: data.users, icon: Users, color: "#EF4444" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">CRM Paneli</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon size={16} style={{ color: c.color }} />
              <span className="text-xs text-sub-text">{c.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Son İşler</h2>
      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-section">
              <th className="text-left p-3 text-sub-text font-medium">İş</th>
              <th className="text-left p-3 text-sub-text font-medium hidden md:table-cell">Müşteri</th>
              <th className="text-left p-3 text-sub-text font-medium">Durum</th>
              <th className="text-left p-3 text-sub-text font-medium hidden lg:table-cell">Teklif</th>
              <th className="text-right p-3 text-sub-text font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {data.recentJobs.map((job) => (
              <tr key={job.id} className="hover:bg-dark-section/50">
                <td className="p-3">
                  <p className="text-white text-xs font-medium">{job.title}</p>
                  <p className="text-sub-text text-xs mt-0.5">
                    {job.categories.map((c: any) => c.category.name).join(", ")}
                  </p>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <p className="text-white text-xs">{job.customer.name}</p>
                  <p className="text-sub-text text-xs">{job.customer.email}</p>
                  {job.customer.phone && (
                    <p className="text-sub-text text-xs">{job.customer.phone}</p>
                  )}
                </td>
                <td className="p-3">
                  <span className="text-xs text-montaj">{STATUS_LABELS[job.status] || job.status}</span>
                </td>
                <td className="p-3 hidden lg:table-cell text-xs text-sub-text">{job._count.offers} teklif</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setCallReminder({ jobId: job.id, note: "" })}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-dark-section rounded text-xs text-sub-text hover:text-white transition-colors"
                  >
                    <Phone size={12} />
                    Ara
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {callReminder && !reminderDone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 max-w-sm w-full border border-dark-border">
            <h3 className="text-lg font-semibold text-white mb-3">Arama Hatırlatıcı</h3>
            <p className="text-sm text-sub-text mb-4">
              Müşteriye e-posta gönderilecek ve hatırlatıcı oluşturulacak.
            </p>
            <textarea
              placeholder="Not (opsiyonel)"
              value={callReminder.note}
              onChange={(e) => setCallReminder({ ...callReminder, note: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-sub-text mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setCallReminder(null)} className="px-4 py-2 rounded-lg text-sm text-sub-text hover:text-white transition-colors">İptal</button>
              <button
                onClick={async () => {
                  setReminderSending(true);
                  try {
                    await fetch("/api/crm/reminder", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ jobId: callReminder!.jobId, note: callReminder!.note }),
                    });
                    setReminderDone(true);
                  } catch {} finally {
                    setReminderSending(false);
                  }
                }}
                disabled={reminderSending}
                className="px-4 py-2 bg-montaj text-white rounded-lg text-sm font-medium hover:bg-montaj-dark transition-colors disabled:opacity-40"
              >
                {reminderSending ? "Gönderiliyor..." : "Hatırlatıcı Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {reminderDone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl p-6 max-w-sm w-full border border-dark-border text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Hatırlatıcı Oluşturuldu</h3>
            <p className="text-sm text-sub-text mb-4">Müşteriye e-posta gönderildi.</p>
            <button onClick={() => { setCallReminder(null); setReminderDone(false); }} className="px-4 py-2 bg-montaj text-white rounded-lg text-sm font-medium">Tamam</button>
          </div>
        </div>
      )}
    </div>
  );
}
