"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  _count: { profiles: number };
}

export default function CategoryManager({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function resetForm() {
    setName("");
    setSlug("");
    setIcon("");
    setEditing(null);
    setMessage("");
  }

  function startEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon || "");
    setMessage("");
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9çşğüöı]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing
            ? { id: editing.id, name, slug, icon: icon || null }
            : { name, slug, icon: icon || null }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "İşlem başarısız.");
      }

      setMessage(editing ? "Kategori güncellendi." : "Kategori oluşturuldu.");
      router.refresh();

      // Refresh categories
      const refreshed = await fetch("/api/admin/categories");
      if (refreshed.ok) {
        const cats = await refreshed.json();
        setCategories(cats);
      }

      resetForm();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (cat._count.profiles > 0) {
      alert(`"${cat.name}" kategorisinde ${cat._count.profiles} firma bulunuyor. Önce firmaları taşıyın.`);
      return;
    }

    if (!confirm(`"${cat.name}" kategorisini silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id }),
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız.");
      }
    } catch {
      alert("Bir hata oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">
          {editing ? "Kategori Düzenle" : "Yeni Kategori"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Kategori Adı"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editing) setSlug(generateSlug(e.target.value));
              }}
              placeholder="Örn: Elektrik Montajı"
              required
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="elektrik-montaji"
              required
            />
            <Input
              label="İkon (emoji)"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🔧"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("başarısız") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" loading={loading}>
              {editing ? "Güncelle" : "Oluştur"}
            </Button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm text-sub-text hover:text-white transition"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* List */}
      <div className="bg-dark-card rounded-xl border border-dark-border divide-y divide-dark-border">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 hover:bg-dark-section transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon || "📦"}</span>
              <div>
                <span className="font-medium text-white">{cat.name}</span>
                <span className="text-xs text-sub-text ml-2">/{cat.slug}</span>
              </div>
              <Badge variant="default">{cat._count.profiles} firma</Badge>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(cat)}
                className="text-xs text-montaj hover:underline"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="text-xs text-red-400 hover:underline"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
