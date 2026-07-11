"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface Dispute {
  id: number;
  job: { id: number; title: string };
  openedBy: { id: number; name: string };
  reason: string;
  resolution: string | null;
  status: string;
  payment: { amount: number; status: string } | null;
  createdAt: string;
  resolvedAt: string | null;
}

const RESOLUTIONS = [
  { value: "refund_customer", label: "Müşteriye İade" },
  { value: "release_artisan", label: "Ustaya Ödeme" },
  { value: "split_50", label: "%50-%50 Bölüşüm" },
];

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/disputes")
      .then((r) => r.json())
      .then(setDisputes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function resolve(id: number, resolution: string) {
    const res = await fetch(`/api/admin/disputes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution }),
    });
    if (res.ok) {
      setDisputes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "resolved", resolution, resolvedAt: new Date().toISOString() } : d))
      );
    }
  }

  if (loading) return <div className="p-8 text-sub-text">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Anlaşmazlıklar</h1>

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-section">
              <th className="text-left p-4 text-sub-text font-medium">İş</th>
              <th className="text-left p-4 text-sub-text font-medium hidden sm:table-cell">Açan</th>
              <th className="text-left p-4 text-sub-text font-medium">Sebep</th>
              <th className="text-left p-4 text-sub-text font-medium hidden md:table-cell">Ödeme</th>
              <th className="text-left p-4 text-sub-text font-medium">Durum</th>
              <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Tarih</th>
              <th className="text-right p-4 text-sub-text font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {disputes.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-sub-text">Anlaşmazlık bulunmuyor.</td></tr>
            ) : disputes.map((d) => (
              <tr key={d.id} className="hover:bg-dark-section/50">
                <td className="p-4 text-montaj text-xs">{d.job.title}</td>
                <td className="p-4 text-sub-text hidden sm:table-cell">{d.openedBy.name}</td>
                <td className="p-4 text-white text-xs max-w-[200px] truncate">{d.reason}</td>
                <td className="p-4 text-sub-text hidden md:table-cell">{d.payment ? `${d.payment.amount} TL` : "—"}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${d.status === "open" ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                    {d.status === "open" ? "Açık" : "Çözüldü"}
                  </span>
                </td>
                <td className="p-4 text-sub-text text-xs hidden lg:table-cell">{formatDate(new Date(d.createdAt))}</td>
                <td className="p-4 text-right">
                  {d.status === "open" ? (
                    <select
                      onChange={(e) => { if (e.target.value) resolve(d.id, e.target.value); }}
                      defaultValue=""
                      className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="">Çözüm Seç</option>
                      {RESOLUTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  ) : (
                    <span className="text-xs text-sub-text">{RESOLUTIONS.find((r) => r.value === d.resolution)?.label || d.resolution}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
