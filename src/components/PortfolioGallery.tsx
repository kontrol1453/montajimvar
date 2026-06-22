"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  url: string;
  alt: string | null;
  description: string | null;
  category: string | null;
  tags: string;
  isLogo: boolean;
  isFeatured: boolean;
  companyName?: string;
}

interface PortfolioGalleryProps {
  images: GalleryImage[];
  companyName?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  before_after: "Önce/Sonra",
  project: "Proje",
  team: "Ekip",
  equipment: "Ekipman",
  other: "Diğer",
};

export default function PortfolioGallery({ images, companyName }: PortfolioGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center">
        <p className="text-muted-text">Henüz portföy fotoğrafı eklenmemiş.</p>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const uniqueCategories = Array.from(
    new Set(images.map((img) => img.category).filter((c): c is string => Boolean(c)))
  );
  const categories = ["all", ...uniqueCategories];

  const filteredImages = activeCategory === "all"
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="relative group cursor-pointer rounded-xl overflow-hidden bg-dark-card border border-dark-border hover:border-montaj/50 transition"
          >
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.alt || image.companyName || "Portföy görseli"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
                  {image.isFeatured && (
                    <span className="absolute top-2 left-2 bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded">
                      Öne Çıkan
                    </span>
                  )}
              {image.category && (
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                  {CATEGORY_LABELS[image.category] || image.category}
                </span>
              )}
            </div>
            {(image.description || image.tags) && (
              <div className="p-3">
                {image.description && (
                  <p className="text-sm text-white line-clamp-2">{image.description}</p>
                )}
                {image.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {JSON.parse(image.tags || "[]").slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs bg-montaj/20 text-montaj px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl w-full mx-4">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || ""}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 p-4 bg-dark-card rounded-xl border border-dark-border">
              <h3 className="text-xl font-bold text-white mb-2">{selectedImage.alt || "Portföy Görseli"}</h3>
              {selectedImage.description && (
                <p className="text-muted-text mb-3">{selectedImage.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {selectedImage.category && (
                  <span className="px-3 py-1 bg-montaj/20 text-montaj rounded-full text-sm">
                    {CATEGORY_LABELS[selectedImage.category] || selectedImage.category}
                  </span>
                )}
                {JSON.parse(selectedImage.tags || "[]").map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-dark-bg border border-dark-border rounded-full text-sm text-sub-text">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}