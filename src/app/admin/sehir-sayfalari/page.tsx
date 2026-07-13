"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TURKISH_CITIES } from "@/lib/utils";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import Badge from "@/components/ui/Badge";

interface CityPage {
  id: number;
  city: string;
  service: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const inputClass = "w-full px-3 py-2 border border-[var(--admin-border)] rounded-md text-sm bg-[var(--admin-surface)] text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)] focus:outline-none";

export default function AdminCityPagesPage() {
  const [pages, setPages] = useState<CityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ city: "", service: "", title: "", content: "", metaTitle: "", metaDesc: "" });

  useEffect(() => { loadPages(); }, []);

  async function loadPages() {
    try {
      const res = await fetch("/api/admin/city-pages");
      if (res.ok) setPages(await res.json());
    } catch { toast.error("Yüklenemedi"); }
    finally { setLoading(false); }
  }

  function resetForm() { setForm({ city: "", service: "", title: "", content: "", metaTitle: "", metaDesc: "" }); setEditingId(null); setShowForm(false); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city || !form.service || !form.title || !form.content) { toast.error("Şehir, hizmet, başlık ve içerik zorunludur."); return; }
    try {
      const url = editingId ? `/api/admin/city-pages/${editingId}` : "/api/admin/city-pages";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Hata"); }
      toast.success(editingId ? "Güncellendi" : "Oluşturuldu");
      resetForm();
      loadPages();
    } catch (err: any) { toast.error(err.message); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/city-pages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      toast.success("Silindi");
      loadPages();
    } catch { toast.error("Silinemedi"); }
  }

  function startEdit(page: CityPage) {
    setForm({ city: page.city, service: page.service, title: page.title, content: page.content, metaTitle: page.metaTitle || "", metaDesc: page.metaDesc || "" });
    setEditingId(page.id);
    setShowForm(true);
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <PageTitle>Şehir Sayfaları</PageTitle>
          <p className="text-sm text-[var(--admin-text-secondary)] mt-1">{pages.length} sayfa</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md text-sm font-semibold hover:bg-[var(--admin-primary-strong)] transition">
          + Yeni Sayfa
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Şehir</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} required>
                <option value="">Seçin</option>
                {TURKISH_CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Hizmet (slug)</label>
              <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                placeholder="ornek: klima-montaji" className={inputClass} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Başlık</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="İstanbul Klima Montajı" className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">İçerik (HTML)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8} placeholder="<h2>İstanbul Klima Montaj Hizmeti</h2><p>...</p>" className={`${inputClass} font-mono`} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Meta Başlık</label>
              <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Meta Açıklama</label>
              <textarea value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })} rows={2} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 bg-[var(--admin-primary)] text-white rounded-md text-sm font-semibold hover:bg-[var(--admin-primary-strong)] transition">
              {editingId ? "Güncelle" : "Oluştur"}
            </button>
            <button type="button" onClick={resetForm}
              className="px-5 py-2 bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)] rounded-md text-sm hover:text-[var(--admin-text-primary)] transition">
              İptal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-[var(--admin-text-muted)]">Yükleniyor...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20"><p className="text-[var(--admin-text-muted)]">Henüz şehir sayfası oluşturulmamış.</p></div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info">{page.city}</Badge>
                    <Badge variant="neutral">{page.service}</Badge>
                  </div>
                  <h3 className="text-[var(--admin-text-primary)] font-semibold">{page.title}</h3>
                  <p className="text-[var(--admin-text-muted)] text-xs mt-1">/{page.slug}</p>
                  {page.metaTitle && <p className="text-[var(--admin-text-muted)] text-xs mt-1">SEO: {page.metaTitle}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(page)}
                    className="px-3 py-1.5 bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)] rounded-md text-xs hover:text-[var(--admin-text-primary)] transition">Düzenle</button>
                  <button onClick={() => handleDelete(page.id)}
                    className="px-3 py-1.5 bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] rounded-md text-xs hover:bg-[var(--admin-danger-soft)]/80 transition">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
