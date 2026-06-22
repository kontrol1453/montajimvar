"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface ProfileImage {
  id: number;
  url: string;
  alt: string | null;
  caption: string | null;
  tags: string | null;
  category: string | null;
  isLogo: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  before_after: "Önce/Sonra",
  project: "Proje",
  team: "Ekip",
  equipment: "Ekipman",
  other: "Diğer",
};

export default function CompanyGallery({ profileId }: { profileId: number }) {
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetch(`/api/profile-images?profileId=${profileId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setImages(data))
      .catch(() => {});
  }, [profileId]);

  const uniqueCategories = Array.from(
    new Set(images.map((img) => img.category).filter((c): c is string => Boolean(c)))
  );
  const categories = ["all", ...uniqueCategories];

  const filteredImages = activeCategory === "all"
    ? images
    : images.filter((img) => img.category === activeCategory);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      }
    },
    [selectedIndex, filteredImages.length]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, handleKeyDown]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Fotoğraflar</h2>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeCategory === cat
                    ? "bg-montaj text-white"
                    : "bg-dark-card border border-dark-border text-sub-text hover:border-montaj/50"
                }`}
              >
                {cat === "all" ? "Tümü" : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                const originalIndex = images.findIndex(img => img.id === image.id);
                setSelectedIndex(originalIndex);
              }}
              className="rounded-lg overflow-hidden border border-dark-border cursor-pointer hover:opacity-90 transition group relative"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.alt || "Firma fotoğrafı"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {image.isFeatured && (
                  <span className="absolute top-1 left-1 bg-amber-500/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                    ⭐ Öne Çıkan
                  </span>
                )}
                {image.category && (
                  <span className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {CATEGORY_LABELS[image.category] || image.category}
                  </span>
                )}
              </div>
              {(image.caption || image.tags) && (
                <div className="p-2">
                  {image.caption && (
                    <p className="text-xs text-white line-clamp-1">{image.caption}</p>
                  )}
                  {image.tags && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {JSON.parse(image.tags || "[]").slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-montaj/20 text-montaj px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            ✕
          </button>

          {/* Category badge */}
          {filteredImages[selectedIndex]?.category && (
            <span className="absolute top-4 left-4 bg-montaj/20 text-montaj text-xs px-3 py-1 rounded-full">
              {CATEGORY_LABELS[filteredImages[selectedIndex].category!] || filteredImages[selectedIndex].category}
            </span>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/50 px-3 py-1.5 rounded-full">
            {selectedIndex + 1} / {filteredImages.length}
          </div>

          {/* Previous */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
              aria-label="Önceki"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div className="max-w-4xl w-full mx-4">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={filteredImages[selectedIndex].url}
                alt={filteredImages[selectedIndex].alt || ""}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 p-4 bg-dark-card rounded-xl border border-dark-border">
              <h3 className="text-xl font-bold text-white mb-2">{filteredImages[selectedIndex].alt || "Portföy Görseli"}</h3>
              {filteredImages[selectedIndex].caption && (
                <p className="text-muted-text mb-3">{filteredImages[selectedIndex].caption}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {filteredImages[selectedIndex].category && (
                  <span className="px-3 py-1 bg-montaj/20 text-montaj rounded-full text-sm">
                    {CATEGORY_LABELS[filteredImages[selectedIndex].category!] || filteredImages[selectedIndex].category}
                  </span>
                )}
                {JSON.parse(filteredImages[selectedIndex].tags || "[]").map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-dark-bg border border-dark-border rounded-full text-sm text-sub-text">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev !== null ? (prev + 1) % filteredImages.length : null
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
              aria-label="Sonraki"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
