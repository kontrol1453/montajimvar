"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelSubscriptionProps {
  premiumUntil: string | null;
  autoRenew: boolean;
  canceledAt: string | null;
}

export default function CancelSubscription({ premiumUntil, autoRenew, canceledAt }: CancelSubscriptionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCancel() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/subscriptions/cancel", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setShowConfirm(false);
        router.refresh();
      } else {
        setMessage(data.error || "Bir hata oluştu");
      }
    } catch {
      setMessage("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleReactivate() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/subscriptions/reactivate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        setMessage(data.error || "Bir hata oluştu");
      }
    } catch {
      setMessage("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  if (!autoRenew) {
    return (
      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-yellow-300 font-medium">Abonelik İptal Edildi</p>
            <p className="text-xs text-yellow-400/70 mt-1">
              Premium üyeliğiniz {premiumUntil ? new Date(premiumUntil).toLocaleDateString("tr-TR") : ""} tarihine kadar aktif. Yenilenmeyecek.
            </p>
          </div>
          <button
            onClick={handleReactivate}
            disabled={loading}
            className="shrink-0 px-3 py-1.5 bg-montaj text-white text-xs font-medium rounded-lg hover:bg-montaj-dark transition disabled:opacity-50"
          >
            {loading ? "..." : "Yeniden Aktifleştir"}
          </button>
        </div>
        {message && <p className="text-xs text-red-400 mt-2">{message}</p>}
      </div>
    );
  }

  return (
    <>
      <div className="mt-4">
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 border border-red-500/40 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition"
        >
          Aboneliği İptal Et
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 w-full max-w-md">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">Aboneliği İptal Et</h3>
            <p className="text-sm text-muted-text text-center mb-2">
              Premium üyeliğiniz <strong className="text-white">{premiumUntil ? new Date(premiumUntil).toLocaleDateString("tr-TR") : ""}</strong> tarihine kadar aktif kalacak, bu tarihten sonra yenilenmeyecek.
            </p>
            <p className="text-xs text-yellow-400/80 text-center mb-6">
              İptal ettikten sonra dilediğiniz zaman yeniden aktifleştirebilirsiniz.
            </p>
            {message && <p className="text-xs text-red-400 text-center mb-4">{message}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-dark-border text-muted-text text-sm font-medium rounded-lg hover:text-white transition"
              >
                Vazgeç
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "İşleniyor..." : "İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
