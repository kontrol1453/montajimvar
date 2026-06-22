"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
  planId: number;
  price: number;
  isCurrentPlan: boolean;
  disabled?: boolean;
}

export default function SubscribeButton({ planId, price, isCurrentPlan, disabled }: SubscribeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Bir hata oluştu");
      }
    } catch {
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={disabled || loading || isCurrentPlan}
      className={`w-full py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
        price > 0
          ? "bg-montaj text-white hover:bg-montaj-dark"
          : "bg-dark-section text-muted-text hover:text-white border border-dark-border"
      }`}
    >
      {loading
        ? "İşleniyor..."
        : isCurrentPlan
          ? "Mevcut Plan"
          : price > 0
            ? "Üye Ol"
            : "Başla"}
    </button>
  );
}
