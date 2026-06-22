"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import PremiumBadge from "@/components/PremiumBadge";
import SearchMap from "@/components/SearchMap";
import { buildQueryParams } from "@/lib/search";

interface ProfileData {
  id: number;
  companyName: string;
  description: string;
  city: string;
  category: { name: string; slug: string };
  categories?: { category: { name: string; slug: string } }[];
  user: { id: number; name: string; email: string; phone: string | null };
  isVerified: boolean;
  isFeatured: boolean;
  ratingAvg: number;
  reviewCount: number;
  whatsapp?: string | null;
  premiumUntil?: string | null;
  subscription?: { badgeLabel?: string | null; badgeColor?: string | null } | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface SearchViewToggleProps {
  profiles: ProfileData[];
  totalCount: number;
  sehir: string;
  q: string;
  siralama: string;
  sayfa: number;
  totalPages: number;
  sp: Record<string, string | string[] | undefined>;
}

export default function SearchViewToggle({
  profiles,
  totalCount,
  sehir,
  q,
  siralama,
  sayfa,
  totalPages,
  sp,
}: SearchViewToggleProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const mapProfiles = profiles
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      id: p.id,
      companyName: p.companyName,
      city: p.city,
      latitude: p.latitude!,
      longitude: p.longitude!,
      categoryName: p.category.name,
      ratingAvg: p.ratingAvg,
    }));

  return (
    <>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-text text-sm">{totalCount} firma bulundu{sehir && ` - ${sehir}`}</p>
        <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md text-sm transition ${
              viewMode === "list" ? "bg-montaj text-white" : "text-sub-text hover:text-white"
            }`}
          >
            ☰ Liste
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1.5 rounded-md text-sm transition ${
              viewMode === "map" ? "bg-montaj text-white" : "text-sub-text hover:text-white"
            }`}
          >
            🗺️ Harita
          </button>
        </div>
      </div>

      {viewMode === "map" ? (
        mapProfiles.length > 0 ? (
          <SearchMap profiles={mapProfiles} />
        ) : (
          <div className="w-full h-96 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-sub-text text-sm">
            Harita görünümü için firmaların konum bilgisi bulunamadı.
          </div>
        )
      ) : (
        <>
          {profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Link key={profile.id} href={`/firma/${profile.id}`}
                  className="block bg-dark-card rounded-xl border border-dark-border hover:border-montaj/50 transition p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-montaj/20 rounded-lg flex items-center justify-center text-xl font-bold text-montaj">
                      {profile.companyName[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {profile.premiumUntil && new Date(profile.premiumUntil) > new Date() && (
                        <PremiumBadge label={profile.subscription?.badgeLabel || "Premium"} color={profile.subscription?.badgeColor || "amber"} />
                      )}
                      {profile.isFeatured && <Badge variant="warning">Vitrin</Badge>}
                      {profile.isVerified && <Badge variant="success">Onaylı</Badge>}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{profile.companyName}</h3>
                  <div className="flex items-center gap-2 text-sm text-sub-text mb-2">
                    <span>{profile.city}</span>
                    <span>·</span>
                    <Badge variant="default">{profile.category.name}</Badge>
                    {profile.categories
                      ?.filter((pc) => pc.category.name !== profile.category.name)
                      .slice(0, 2)
                      .map((pc) => (
                        <Badge key={pc.category.name} variant="default">{pc.category.name}</Badge>
                      ))}
                    {(profile.categories?.length ?? 0) > 3 && (
                      <span className="text-xs text-sub-text">+{((profile.categories?.length ?? 0) - 1)}</span>
                    )}
                  </div>
                  {profile.ratingAvg > 0 && (
                    <div className="flex items-center gap-1 text-sm text-montaj mb-2">
                      <span>★</span>
                      <span className="font-medium">{profile.ratingAvg.toFixed(1)}</span>
                      <span className="text-sub-text">({profile.reviewCount})</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-text line-clamp-2">{profile.description || "Henüz açıklama eklenmemiş."}</p>
                  {profile.whatsapp && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-green-400">
                      <span>💬</span>
                      <span>WhatsApp ile iletişim</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Sonuç bulunamadı</h3>
              <p className="text-muted-text">Filtreleri değiştirip tekrar deneyin.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {sayfa > 1 && (
                <Link href={buildQueryParams(sp, { sayfa: String(sayfa - 1) })}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white hover:border-montaj/50 transition"
                >← Önceki</Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p: number;
                if (totalPages <= 7) p = i + 1;
                else if (sayfa <= 4) p = i + 1;
                else if (sayfa >= totalPages - 3) p = totalPages - 6 + i;
                else p = sayfa - 3 + i;
                return (
                  <Link key={p} href={buildQueryParams(sp, { sayfa: String(p) })}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition ${
                      p === sayfa ? "bg-montaj text-white" : "bg-dark-card border border-dark-border text-sub-text hover:border-montaj/50"
                    }`}
                  >{p}</Link>
                );
              })}
              {sayfa < totalPages && (
                <Link href={buildQueryParams(sp, { sayfa: String(sayfa + 1) })}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white hover:border-montaj/50 transition"
                >Sonraki →</Link>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
