"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeaturedButton({
  profileId,
  isFeatured,
}: {
  profileId: number;
  isFeatured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profileId,
          isFeatured: !isFeatured,
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
        isFeatured
          ? "bg-montaj/20 text-montaj hover:bg-montaj/30"
          : "bg-dark-bg text-sub-text hover:text-white hover:bg-dark-section border border-dark-border"
      } disabled:opacity-50`}
    >
      {loading ? "..." : isFeatured ? "Vitrinde" : "Vitrine Ekle"}
    </button>
  );
}
