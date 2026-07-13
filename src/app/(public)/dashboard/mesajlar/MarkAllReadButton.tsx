"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkAllReadButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/messages/read-all", { method: "PATCH" });
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm text-montaj hover:text-montaj-dark transition font-medium disabled:opacity-50"
    >
      {loading ? "İşleniyor..." : "Hepsini Okundu İşaretle"}
    </button>
  );
}