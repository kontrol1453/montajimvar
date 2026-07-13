"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/admin/Dialog";
import Button from "@/components/ui/Button";

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
    setSelected((prev) => prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]);
  }

  async function handleSave() {
    if (selected.length === 0) { setError("En az bir kategori seçilmelidir."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, categoryIds: selected }),
      });
      if (res.ok) { setOpen(false); router.refresh(); }
      else { const data = await res.json(); setError(data.error || "Güncelleme başarısız."); }
    } catch { setError("Bir hata oluştu."); }
    finally { setSaving(false); }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => { setSelected(selectedCategoryIds); setOpen(true); }}>
        Kategoriler
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Kategoriler"
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setOpen(false), variant: "ghost" },
          { label: saving ? "Kaydediliyor..." : "Kaydet", onClick: handleSave, disabled: saving },
        ]}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.length === 0 ? (
            <p className="text-sm text-[var(--admin-text-muted)] text-center py-4">Yükleniyor...</p>
          ) : (
            categories.map((cat) => (
              <label key={cat.id}
                className="flex items-center gap-3 p-3 rounded-md border border-[var(--admin-border)] hover:border-[var(--admin-primary)]/50 transition cursor-pointer">
                <input type="checkbox" checked={selected.includes(cat.id)} onChange={() => toggle(cat.id)}
                  className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)] bg-[var(--admin-surface)]" />
                <span className="text-sm text-[var(--admin-text-primary)]">{cat.name}</span>
              </label>
            ))
          )}
        </div>
        {error && <p className="text-sm text-[var(--admin-danger)] mt-3">{error}</p>}
      </Dialog>
    </>
  );
}
