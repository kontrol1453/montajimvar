"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";

interface FavoriteItem {
  id: number;
  profile: {
    id: number;
    companyName: string;
    description: string;
    city: string;
    isVerified: boolean;
    category: { name: string; slug: string };
    user: { id: number; name: string };
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/giris");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : []))
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-sub-text">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Favorilerim</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => (
            <Link
              key={fav.id}
              href={`/firma/${fav.profile.id}`}
              className="block bg-dark-card rounded-xl border border-dark-border hover:border-montaj/50 transition p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">
                  {fav.profile.companyName}
                </h3>
                {fav.profile.isVerified && (
                  <Badge variant="success">Onaylı</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-sub-text mb-2">
                <span>{fav.profile.city}</span>
                <span>·</span>
                <Badge variant="default">{fav.profile.category.name}</Badge>
              </div>
              <p className="text-sm text-muted-text line-clamp-2">
                {fav.profile.description || "Açıklama yok"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center">
          <svg className="w-10 h-10 text-pink-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          <p className="text-sub-text mb-4">Henüz favori firmanız yok.</p>
          <Link
            href="/ara"
            className="inline-block px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
          >
            Firma Ara
          </Link>
        </div>
      )}
    </div>
  );
}
