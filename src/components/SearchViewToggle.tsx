"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import PremiumBadge from "@/components/PremiumBadge";
import { buildQueryParams } from "@/lib/search";

const SearchMap = dynamic(() => import("@/components/SearchMap"), { ssr: false });

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

  function highlightText(text: string) {
    if (!q || !text) return text;
    const words = q.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return text;
    const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    const testRe = new RegExp(`^(${escaped})$`, "i");
    return parts.map((part, i) =>
      testRe.test(part)
        ? <mark key={i} className="bg-accent/30 text-white rounded px-0.5">{part}</mark>
        : part,
    );
  }

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
              className={`px-3 py-1.5 rounded-md text-sm transition flex items-center gap-1 ${
                viewMode === "list" ? "bg-accent text-[#1a1d27]" : "text-sub-text hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              Liste
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-md text-sm transition flex items-center gap-1 ${
                viewMode === "map" ? "bg-accent text-[#1a1d27]" : "text-sub-text hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              Harita
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
                  className="block bg-dark-card rounded-xl border border-dark-border hover:border-accent/50 transition p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-xl font-bold text-accent">
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
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{highlightText(profile.companyName)}</h3>
                  <div className="flex items-center gap-2 text-sm text-sub-text mb-2">
                    <span>{highlightText(profile.city)}</span>
                    <span>·</span>
                    <Badge variant="default">{highlightText(profile.category.name)}</Badge>
                    {profile.categories
                      ?.filter((pc) => pc.category.name !== profile.category.name)
                      .slice(0, 2)
                      .map((pc) => (
                        <Badge key={pc.category.name} variant="default">{highlightText(pc.category.name)}</Badge>
                      ))}
                    {(profile.categories?.length ?? 0) > 3 && (
                      <span className="text-xs text-sub-text">+{((profile.categories?.length ?? 0) - 1)}</span>
                    )}
                  </div>
                  {profile.ratingAvg > 0 && (
                    <div className="flex items-center gap-1 text-sm text-accent mb-2">
                      <span>★</span>
                      <span className="font-medium">{profile.ratingAvg.toFixed(1)}</span>
                      <span className="text-sub-text">({profile.reviewCount})</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-text line-clamp-2">{profile.description ? highlightText(profile.description) : "Henüz açıklama eklenmemiş."}</p>
                    {profile.whatsapp && (
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-green-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21.75 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 2.25 14.205 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                      <span>WhatsApp ile iletişim</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
              <div className="text-center py-16">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Sonuç bulunamadı</h3>
              <p className="text-muted-text">Filtreleri değiştirip tekrar deneyin.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {sayfa > 1 && (
                <Link href={buildQueryParams(sp, { sayfa: String(sayfa - 1) })}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white hover:border-accent/50 transition"
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
                      p === sayfa ? "bg-accent text-[#1a1d27]" : "bg-dark-card border border-dark-border text-sub-text hover:border-accent/50"
                    }`}
                  >{p}</Link>
                );
              })}
              {sayfa < totalPages && (
                <Link href={buildQueryParams(sp, { sayfa: String(sayfa + 1) })}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white hover:border-accent/50 transition"
                >Sonraki →</Link>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
