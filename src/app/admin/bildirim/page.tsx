"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";

interface AdminNotification {
  id: number;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  new_user: "Yeni Kullanıcı",
  new_profile: "Yeni Firma",
  new_review: "Yeni Yorum",
  new_message: "Yeni Mesaj",
  new_payment: "Yeni Ödeme",
};

const TYPE_BADGE: Record<string, "info" | "success" | "warning" | "danger" | "neutral"> = {
  new_user: "info",
  new_profile: "success",
  new_review: "warning",
  new_message: "neutral",
  new_payment: "danger",
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [pushForm, setPushForm] = useState({ title: "", message: "", target: "all" });
  const [sending, setSending] = useState(false);

  useEffect(() => { loadNotifications(); }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/admin/notifications?limit=50");
      if (res.ok) { const data = await res.json(); setNotifications(data.notifications || []); }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function markRead(id: number) {
    await fetch(`/api/admin/notifications/${id}/read`, { method: "POST" });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  async function handleSendPush(e: React.FormEvent) {
    e.preventDefault();
    if (!pushForm.title || !pushForm.message) { toast.error("Başlık ve mesaj zorunludur."); return; }
    setSending(true);
    try {
      const res = await fetch("/api/admin/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pushForm),
      });
      if (res.ok) {
        toast.success("Bildirim gönderildi!");
        setPushForm({ title: "", message: "", target: "all" });
        setShowSendForm(false);
        loadNotifications();
      } else { const err = await res.json(); toast.error(err.error || "Gönderilemedi."); }
    } catch { toast.error("Bir hata oluştu."); }
    finally { setSending(false); }
  }

  if (loading) return <div className="p-6 text-[var(--admin-text-muted)]">Yükleniyor...</div>;

  const inputClass = "w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2 text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)] focus:outline-none";

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <PageTitle>Bildirim Merkezi</PageTitle>
          <p className="text-sm text-[var(--admin-text-secondary)] mt-1">Admin bildirimleri ve push notification gönderimi</p>
        </div>
        <button onClick={() => setShowSendForm(!showSendForm)}
          className="bg-[var(--admin-primary)] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--admin-primary-strong)] transition">
          + Bildirim Gönder
        </button>
      </div>

      {showSendForm && (
        <div className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-5 mb-6">
          <h2 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-4">Push Notification Gönder</h2>
          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Hedef Kitle</label>
              <select value={pushForm.target} onChange={e => setPushForm(f => ({ ...f, target: e.target.value }))}
                className={inputClass}>
                <option value="all">Tüm Kullanıcılar</option>
                <option value="artisans">Sadece Ustalar/Firmalar</option>
                <option value="customers">Sadece Müşteriler</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Başlık *</label>
              <input value={pushForm.title} onChange={e => setPushForm(f => ({ ...f, title: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Mesaj *</label>
              <textarea value={pushForm.message} onChange={e => setPushForm(f => ({ ...f, message: e.target.value }))}
                className={inputClass} rows={3} required />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowSendForm(false)}
                className="px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]">İptal</button>
              <button type="submit" disabled={sending}
                className="bg-[var(--admin-primary)] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[var(--admin-primary-strong)] disabled:opacity-50">
                {sending ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-[var(--admin-text-muted)] text-center py-8">Henüz bildirim yok.</p>
        ) : notifications.map(n => (
          <div key={n.id}
            className={`bg-[var(--admin-surface)] rounded-lg border p-4 transition cursor-pointer hover:border-[var(--admin-primary)]/50 ${n.isRead ? 'border-[var(--admin-border)]' : 'border-[var(--admin-primary)]/30'}`}
            onClick={() => !n.isRead && markRead(n.id)}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-[var(--admin-primary)]'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={TYPE_BADGE[n.type] || "neutral"}>{TYPE_LABELS[n.type] || n.type}</Badge>
                  <span className="text-xs text-[var(--admin-text-muted)]">{new Date(n.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <p className="text-sm font-medium text-[var(--admin-text-primary)]">{n.title}</p>
                {n.message && <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5">{n.message}</p>}
                {n.link && <a href={n.link} className="text-xs text-[var(--admin-primary)] hover:underline mt-1 inline-block">→ İncele</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
