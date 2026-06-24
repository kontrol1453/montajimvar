"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ profileId, canAddFavorite = true }: { profileId: number; canAddFavorite?: boolean }) {
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

  if (!session?.user || !canAddFavorite) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
        favorited
          ? "bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/30"
          : "bg-dark-card border-dark-border text-sub-text hover:border-accent/50 hover:text-accent"
      }`}
      title={favorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    >
      <svg className={`w-5 h-5 ${favorited ? "text-red-400 fill-red-400" : "text-sub-text fill-none"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={favorited ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <span>{favorited ? "Favorilerde" : "Favorilere Ekle"}</span>
    </button>
  );
}
