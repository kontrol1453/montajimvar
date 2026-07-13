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
        body: JSON.stringify({ id: profileId, isFeatured: !isFeatured }),
      });
      if (res.ok) router.refresh();
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  return (
    <button onClick={handleToggle} disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-md transition font-medium ${
        isFeatured
          ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/20"
          : "bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] border border-[var(--admin-border)]"
      } disabled:opacity-50`}>
      {loading ? "..." : isFeatured ? "Vitrinde" : "Vitrine Ekle"}
    </button>
  );
}
