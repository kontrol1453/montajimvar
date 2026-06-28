"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const TYPE_COLORS: Record<string, string> = {
  new_user: "bg-blue-900/40 text-blue-400",
  new_profile: "bg-green-900/40 text-green-400",
  new_review: "bg-purple-900/40 text-purple-400",
  new_message: "bg-cyan-900/40 text-cyan-400",
  new_payment: "bg-amber-900/40 text-amber-400",
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [pushForm, setPushForm] = useState({
    title: "",
    message: "",
    target: "all", // all, artisans, customers
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/admin/notifications?limit=50");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function markRead(id: number) {
    await fetch(`/api/admin/notifications/${id}/read`, { method: "POST" });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  async function handleSendPush(e: React.FormEvent) {
    e.preventDefault();
    if (!pushForm.title || !pushForm.message) {
      toast.error("Başlık ve mesaj zorunludur.");
      return;
    }

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
      } else {
        const err = await res.json();
        toast.error(err.error || "Gönderilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="p-6 text-sub-text">Yükleniyor...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bildirim Merkezi</h1>
          <p className="text-sm text-sub-text mt-1">Admin bildirimleri ve push notification gönderimi</p>
        </div>
        <button onClick={() => setShowSendForm(!showSendForm)}
          className="bg-montaj text-dark-bg px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
          + Bildirim Gönder
        </button>
      </div>

      {/* Send Push Form */}
      {showSendForm && (
        <div className="bg-dark-card rounded-xl border border-dark-border p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Push Notification Gönder</h2>
          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="block text-sm text-sub-text mb-1">Hedef Kitle</label>
              <select value={pushForm.target} onChange={e => setPushForm(f => ({ ...f, target: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white">
                <option value="all">Tüm Kullanıcılar</option>
                <option value="artisans">Sadece Ustalar/Firmalar</option>
                <option value="customers">Sadece Müşteriler</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-sub-text mb-1">Başlık *</label>
              <input value={pushForm.title} onChange={e => setPushForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm text-sub-text mb-1">Mesaj *</label>
              <textarea value={pushForm.message} onChange={e => setPushForm(f => ({ ...f, message: e.target.value }))}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" rows={3} required />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowSendForm(false)}
                className="px-4 py-2 text-sm text-sub-text hover:text-white">İptal</button>
              <button type="submit" disabled={sending}
                className="bg-montaj text-dark-bg px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {sending ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sub-text text-center py-8">Henüz bildirim yok.</p>
        ) : notifications.map(n => (
          <div key={n.id}
            className={`bg-dark-card rounded-xl border p-4 transition cursor-pointer hover:border-montaj/50 ${n.isRead ? 'border-dark-border' : 'border-montaj/30'}`}
            onClick={() => !n.isRead && markRead(n.id)}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-montaj'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[n.type] || 'bg-gray-900/40 text-gray-400'}`}>
                    {TYPE_LABELS[n.type] || n.type}
                  </span>
                  <span className="text-xs text-sub-text">{new Date(n.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <p className="text-sm font-medium text-white">{n.title}</p>
                {n.message && <p className="text-xs text-sub-text mt-0.5">{n.message}</p>}
                {n.link && <a href={n.link} className="text-xs text-montaj hover:underline mt-1 inline-block">→ İncele</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
