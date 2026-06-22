"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  profileId: number;
  selectedCategoryIds: number[];
}

export default function CategoryEditor({ profileId, selectedCategoryIds }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number[]>(selectedCategoryIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/categories")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setCategories(data))
      .catch(() => {});
  }, [open]);

  function toggle(catId: number) {
    setSelected((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  }

  async function handleSave() {
    if (selected.length === 0) {
      setError("En az bir kategori seçilmelidir.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, categoryIds: selected }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Güncelleme başarısız.");
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setSelected(selectedCategoryIds);
          setOpen(true);
        }}
        className="text-xs px-3 py-1.5 rounded-lg transition font-medium bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
      >
        Kategoriler
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Kategoriler</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-sub-text hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-sm text-sub-text text-center py-4">Yükleniyor...</p>
              ) : (
                categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-dark-border hover:border-montaj/50 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(cat.id)}
                      onChange={() => toggle(cat.id)}
                      className="w-4 h-4 rounded border-dark-border text-montaj focus:ring-montaj bg-dark-bg"
                    />
                    <span className="text-sm text-white">{cat.name}</span>
                  </label>
                ))
              )}
            </div>

            {error && (
              <p className="text-sm text-red-400 mt-3">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-sub-text hover:text-white transition"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
