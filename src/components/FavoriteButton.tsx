"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ profileId }: { profileId: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/favorites?profileId=${profileId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setFavorited(data.favorited);
      })
      .catch(() => {});
  }, [profileId, session]);

  async function handleToggle() {
    if (!session?.user) {
      router.push("/auth/giris");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  if (!session?.user) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
        favorited
          ? "bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30"
          : "bg-dark-card border-dark-border text-sub-text hover:border-montaj/50 hover:text-montaj"
      }`}
      title={favorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    >
      <span className={favorited ? "text-red-400" : ""}>
        {favorited ? "❤️" : "🤍"}
      </span>
      <span>{favorited ? "Favorilerde" : "Favorilere Ekle"}</span>
    </button>
  );
}
