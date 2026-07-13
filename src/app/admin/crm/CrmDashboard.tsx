"use client";

import { useState } from "react";
import { Phone, TrendingUp, Users, ClipboardList, CheckCircle, Clock } from "lucide-react";
import { SectionTitle } from "@/components/ui/Typography";
import Dialog from "@/components/admin/Dialog";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

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
    { label: "Toplam İş", value: data.totalJobs, icon: ClipboardList, variant: "blue" as const },
    { label: "Bekleyen İş", value: data.pendingJobs, icon: Clock, variant: "amber" as const },
    { label: "Toplam Teklif", value: data.totalOffers, icon: TrendingUp, variant: "emerald" as const },
    { label: "Onaylanan Teklif", value: data.acceptedOffers, icon: CheckCircle, variant: "purple" as const },
    { label: "Tamamlanan", value: data.completedJobs, icon: CheckCircle, variant: "emerald" as const },
    { label: "Dönüşüm Oranı", value: `%${data.conversionRate}`, icon: TrendingUp, variant: "blue" as const },
    { label: "Toplam Kullanıcı", value: data.users, icon: Users, variant: "pink" as const },
  ];

  const colorMap: Record<string, string> = {
    blue: "var(--admin-primary)", amber: "var(--admin-warning)",
    emerald: "var(--admin-success)", purple: "#8B5CF6", pink: "var(--admin-danger)",
  };

  const columns: TableColumn<CrmData["recentJobs"][number]>[] = [
    {
      header: "İş",
      accessor: (r) => (
        <div>
          <p className="font-medium text-sm">{r.title}</p>
          <p className="text-xs text-[var(--admin-text-muted)]">
            {r.categories.map((c) => c.category.name).join(", ")}
          </p>
        </div>
      ),
    },
    {
      header: "Müşteri",
      hidden: "md",
      accessor: (r) => (
        <div className="text-xs">
          <p className="text-[var(--admin-text-primary)]">{r.customer.name}</p>
          <p className="text-[var(--admin-text-muted)]">{r.customer.email}</p>
          {r.customer.phone && <p className="text-[var(--admin-text-muted)]">{r.customer.phone}</p>}
        </div>
      ),
    },
    {
      header: "Durum",
      accessor: (r) => <span className="text-[var(--admin-primary)] text-xs">{STATUS_LABELS[r.status] || r.status}</span>,
    },
    {
      header: "Teklif",
      hidden: "lg",
      accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{r._count.offers} teklif</span>,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon size={16} style={{ color: colorMap[c.variant] }} />
              <span className="text-xs text-[var(--admin-text-secondary)]">{c.label}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--admin-text-primary)]">{c.value}</p>
          </div>
        ))}
      </div>

      <SectionTitle className="mb-4">Son İşler</SectionTitle>

      <AdminTable<CrmData["recentJobs"][number]>
        rows={data.recentJobs}
        columns={columns}
        keyField={(r) => r.id}
        actions={(r) => (
          <button
            onClick={() => setCallReminder({ jobId: r.id, note: "" })}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--admin-surface-muted)] rounded text-xs text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] transition-colors"
          >
            <Phone size={12} />
            Ara
          </button>
        )}
      />

      <Dialog
        open={!!callReminder && !reminderDone}
        onClose={() => { setCallReminder(null); setReminderDone(false); }}
        title="Arama Hatırlatıcı"
        description="Müşteriye e-posta gönderilecek ve hatırlatıcı oluşturulacak."
        size="sm"
        actions={[
          { label: "İptal", onClick: () => { setCallReminder(null); setReminderDone(false); }, variant: "ghost" },
          { label: reminderSending ? "Gönderiliyor..." : "Hatırlatıcı Oluştur", onClick: async () => {
            if (!callReminder) return;
            setReminderSending(true);
            try {
              await fetch("/api/crm/reminder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: callReminder.jobId, note: callReminder.note }),
              });
              setReminderDone(true);
            } catch {} finally { setReminderSending(false); }
          }, disabled: reminderSending },
        ]}
      >
        <textarea
          placeholder="Not (opsiyonel)"
          value={callReminder?.note || ""}
          onChange={(e) => setCallReminder((prev) => prev ? { ...prev, note: e.target.value } : null)}
          className="w-full px-3 py-2 border border-[var(--admin-border)] rounded-md text-sm bg-[var(--admin-surface)] text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)]"
          rows={3}
        />
      </Dialog>

      <Dialog
        open={reminderDone}
        onClose={() => { setCallReminder(null); setReminderDone(false); }}
        title=""
        size="sm"
        actions={[
          { label: "Tamam", onClick: () => { setCallReminder(null); setReminderDone(false); } },
        ]}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-1">Hatırlatıcı Oluşturuldu</h3>
          <p className="text-sm text-[var(--admin-text-secondary)]">Müşteriye e-posta gönderildi.</p>
        </div>
      </Dialog>
    </>
  );
}
