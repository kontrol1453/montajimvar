"use client";

import { useState, useEffect, useCallback } from "react";

interface ImageItem {
  id: number;
  url: string;
  alt: string | null;
  isLogo: boolean;
}

export default function CompanyGallery({ profileId }: { profileId: number }) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/profile-images?profileId=${profileId}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setImages(data))
      .catch(() => {});
  }, [profileId]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
      }
    },
    [selectedIndex, images.length]
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className="rounded-lg overflow-hidden border border-dark-border cursor-pointer hover:opacity-90 transition group"
            >
              <img
                src={image.url}
                alt={image.alt || "Firma fotoğrafı"}
                className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition duration-300"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
            aria-label="Kapat"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 text-sm bg-black/50 px-3 py-1.5 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev !== null ? (prev - 1 + images.length) % images.length : null
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition"
              aria-label="Önceki"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt || "Firma fotoğrafı"}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev !== null ? (prev + 1) % images.length : null
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
