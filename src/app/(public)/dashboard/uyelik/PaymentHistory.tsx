"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  description: string | null;
  createdAt: string;
  plan: { name: string };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor",
  completed: "Tamamlandı",
  failed: "Başarısız",
  refunded: "İade Edildi",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  completed: "text-green-400 bg-green-500/10 border-green-500/20",
  failed: "text-red-400 bg-red-500/10 border-red-500/20",
  refunded: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions/payments")
      .then((res) => res.json())
      .then((data) => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (payments.length === 0) return null;

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">Ödeme Geçmişi</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left p-3 text-sub-text font-medium">Tarih</th>
              <th className="text-left p-3 text-sub-text font-medium">Plan</th>
              <th className="text-right p-3 text-sub-text font-medium">Tutar</th>
              <th className="text-right p-3 text-sub-text font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-dark-section transition">
                <td className="p-3 text-white">
                  {new Date(payment.createdAt).toLocaleDateString("tr-TR")}
                </td>
                <td className="p-3 text-sub-text">{payment.plan.name}</td>
                <td className="p-3 text-white text-right font-medium">
                  {payment.amount > 0
                    ? `${(payment.amount / 100).toFixed(2)} ${payment.currency}`
                    : "Ücretsiz"}
                </td>
                <td className="p-3 text-right">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${STATUS_COLORS[payment.status] || "text-sub-text"}`}>
                    {STATUS_LABELS[payment.status] || payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
