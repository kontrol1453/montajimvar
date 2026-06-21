"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyButton({
  profileId,
  isVerified,
}: {
  profileId: number;
  isVerified: boolean;
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
          isVerified: !isVerified,
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
        isVerified
          ? "bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30"
          : "bg-green-900/20 text-green-400 hover:bg-green-900/30"
      } disabled:opacity-50`}
    >
      {loading ? "..." : isVerified ? "Onayı Kaldır" : "Onayla"}
    </button>
  );
}
