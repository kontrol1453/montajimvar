"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ImageGallery from "@/components/ImageGallery";
import { TURKISH_CITIES } from "@/lib/utils";

interface Props {
  profile: {
    id: number;
    companyName: string;
    description: string;
    categoryId: number;
    city: string;
    address: string | null;
    phone: string | null;
    website: string | null;
    whatsapp?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  categoryIds: number[];
  categories: { id: number; name: string; slug: string; icon: string | null }[];
}

export default function FirmaForm({ profile, categoryIds: initialCategoryIds, categories }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });
  const [form, setForm] = useState({
    companyName: profile?.companyName || "",
    description: profile?.description || "",
    categoryId: profile?.categoryId || (categories[0]?.id || 0),
    city: profile?.city || "",
    address: profile?.address || "",
    phone: profile?.phone || "",
    website: profile?.website || "",
    whatsapp: (profile as any)?.whatsapp || "",
    latitude: (profile as any)?.latitude ?? "",
    longitude: (profile as any)?.longitude ?? "",
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialCategoryIds.length > 0
      ? initialCategoryIds
      : profile?.categoryId
        ? [profile.categoryId]
        : []
  );

  function toggleCategory(catId: number) {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "success", text: "" });

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          whatsapp: form.whatsapp || undefined,
          latitude: form.latitude || undefined,
          longitude: form.longitude || undefined,
          categoryIds: selectedCategories,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kayıt başarısız.");
      }

      setMessage({
        type: "success",
        text: profile ? "Firma profili güncellendi." : "Firma profili oluşturuldu.",
      });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Firma Adı"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          required
        />

        {/* Multi Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kategoriler <span className="text-sub-text">(birden fazla seçebilirsiniz)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition ${
                    selected
                      ? "bg-montaj/20 border-montaj text-montaj"
                      : "bg-dark-bg border-dark-border text-gray-300 hover:border-montaj/50"
                  }`}
                >
                  {cat.icon && <span className="text-lg">{cat.icon}</span>}
                  <span>{cat.name}</span>
                  {selected && (
                    <svg className="w-3.5 h-3.5 text-montaj ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {selectedCategories.length === 0 && (
            <p className="text-xs text-red-400 mt-1">En az bir kategori seçmelisiniz.</p>
          )}
        </div>

        {/* Primary Category (for legacy compatibility) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Ana Kategori
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-card text-white"
            required
          >
            <option value="">Ana kategori seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon && <span className="text-lg">{cat.icon}</span>} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Şehir
          </label>
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-card text-white"
            required
          >
            <option value="">Şehir seçin</option>
            {TURKISH_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Açıklama
          </label>
          <textarea
            rows={4}
            placeholder="Firmanız hakkında detaylı bilgi verin..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-card text-white placeholder-gray-500"
          />
        </div>

        <Input
          label="Adres"
          placeholder="Firma adresi"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Telefon"
            type="tel"
            placeholder="05XX XXX XX XX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="WhatsApp"
            type="tel"
            placeholder="05XX XXX XX XX"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Web Sitesi"
            type="url"
            placeholder="https://..."
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Enlem (Latitude)"
            type="number"
            step="any"
            placeholder="41.0082"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : "" })}
          />
          <Input
            label="Boylam (Longitude)"
            type="number"
            step="any"
            placeholder="28.9784"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : "" })}
          />
        </div>
        <p className="text-xs text-sub-text -mt-2">
          Koordinatları bilmiyorsanız boş bırakın. Adresinizi Google Maps&apos;te açıp URL&apos;den koordinatları kopyalayabilirsiniz.
        </p>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button type="submit" loading={loading} disabled={selectedCategories.length === 0}>
          {profile ? "Güncelle" : "Oluştur"}
        </Button>
      </form>

      {profile && (
        <div className="mt-8 pt-8 border-t border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-4">Fotoğraflar</h3>
          <ImageGallery profileId={profile.id} editable />
        </div>
      )}
    </Card>
  );
}
