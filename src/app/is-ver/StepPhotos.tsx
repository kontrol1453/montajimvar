"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";

interface Props {
  data: { photos: string[] };
  updateData: (partial: { photos: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPhotos({ data, updateData, onNext, onBack }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 5 - data.photos.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of toUpload) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("profileId", "0");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const result = await res.json();
          uploadedUrls.push(result.url || result.path || "");
        } else {
          uploadedUrls.push(URL.createObjectURL(file));
        }
      } catch {
        uploadedUrls.push(URL.createObjectURL(file));
      }
    }

    updateData({ photos: [...data.photos, ...uploadedUrls] });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    updateData({ photos: data.photos.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Fotoğraf Ekle</h2>
        <p className="text-sub-text text-sm">
          İşin fotoğraflarını ekleyin (en fazla 5). Daha hızlı teklif almanızı sağlar.
        </p>
      </div>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          data.photos.length >= 5
            ? "border-green-500/30 bg-green-500/5"
            : "border-white/[0.08] hover:border-montaj/30 bg-dark-card"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={data.photos.length >= 5 || uploading}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin w-8 h-8 border-2 border-montaj border-t-transparent rounded-full" />
            <p className="text-muted-text text-sm">Yükleniyor...</p>
          </div>
        ) : data.photos.length >= 5 ? (
          <p className="text-green-400 font-medium">Maksimum fotoğraf sayısına ulaştınız ✓</p>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-montaj/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-muted-text text-sm">Fotoğraf eklemek için tıklayın</p>
            <p className="text-sub-text text-xs mt-1">{data.photos.length}/5 fotoğraf yüklendi</p>
          </>
        )}
      </div>

      {data.photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {data.photos.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-dark-section">
              <img src={url} alt={`Fotoğraf ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Geri</Button>
        <Button variant="primary" size="lg" onClick={onNext}>Devam</Button>
      </div>
    </div>
  );
}
