"use client";

import { useState, useEffect } from "react";

interface ImageItem {
  id: number;
  url: string;
  alt: string | null;
  isLogo: boolean;
  sortOrder: number;
}

interface Props {
  profileId: number;
  editable?: boolean;
  onLogoChange?: (url: string | null) => void;
}

export default function ImageGallery({ profileId, editable = false, onLogoChange }: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchImages();
  }, [profileId]);

  async function fetchImages() {
    try {
      const res = await fetch(`/api/profile-images?profileId=${profileId}`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch {
      // silently fail
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("profileId", String(profileId));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Yükleme başarısız.");
      }

      await fetchImages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }

    // Reset input
    e.target.value = "";
  }

  async function handleDelete(imageId: number) {
    if (!confirm("Bu resmi silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch("/api/profile-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: imageId }),
      });

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch {
      setError("Silinirken hata oluştu.");
    }
  }

  async function handleSetLogo(imageUrl: string) {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: (() => {
          // Create minimal request to trigger logo update  
          // Since we can't re-upload, we'll just update the profile logo directly
          return new Blob([]);
        })(),
      });
    } catch {
      // ignore
    }

    // Update profile logo via profiles API
    try {
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: imageUrl }),
      });
      onLogoChange?.(imageUrl);
      setImages((prev) =>
        prev.map((img) => ({ ...img, isLogo: img.url === imageUrl }))
      );
    } catch {
      setError("Logo güncellenirken hata oluştu.");
    }
  }

  return (
    <div>
      {editable && (
        <div className="mb-4">
          <label className="block mb-2">
            <div className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-dark-border rounded-xl hover:border-montaj/50 cursor-pointer transition bg-dark-card">
              {uploading ? (
                <span className="text-sub-text">Yükleniyor...</span>
              ) : (
                <>
                  <svg className="w-6 h-6 text-montaj" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sub-text">Fotoğraf eklemek için tıklayın</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {error && (
            <p className="text-sm text-red-400 mt-1">{error}</p>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border border-dark-border bg-dark-card"
            >
              <img
                src={image.url}
                alt={image.alt || "Profil resmi"}
                className="w-full h-32 md:h-40 object-cover"
              />
              {image.isLogo && (
                <span className="absolute top-2 left-2 bg-montaj text-white text-xs px-2 py-0.5 rounded-full">
                  Logo
                </span>
              )}
              {editable && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  {!image.isLogo && (
                    <button
                      onClick={() => handleSetLogo(image.url)}
                      className="text-xs bg-montaj text-white px-3 py-1.5 rounded-lg hover:bg-montaj-dark transition"
                      title="Logo yap"
                    >
                      Logo Yap
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
                    title="Sil"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
