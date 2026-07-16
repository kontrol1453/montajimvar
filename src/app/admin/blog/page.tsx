"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import Badge from "@/components/ui/Badge";
import RowActionsDropdown from "@/components/admin/DataTable/RowActionsDropdown";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { sanitizeHTML } from "@/lib/sanitize";
import Dialog from "@/components/admin/Dialog";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  category: BlogCategory | null;
  author: string | null;
}

const emptyForm = {
  title: "", slug: "", content: "", excerpt: "", coverImage: "",
  categoryId: "", author: "", tags: "[]", metaTitle: "", metaDesc: "",
  isPublished: false, city: "", serviceSlug: "",
};

const inputClass = "w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2 text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)] focus:outline-none";

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(false);
  const [showCatManager, setShowCatManager] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const [catEditing, setCatEditing] = useState<number | null>(null);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch("/api/blog?all=true"),
        fetch("/api/blog/categories"),
      ]);
      if (postsRes.ok) setPosts(await postsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
    } catch { toast.error("Veriler yüklenemedi."); }
    finally { setLoading(false); }
  }

  function resetForm() { setForm(emptyForm); setEditingId(null); setShowForm(false); setPreview(false); }

  function editPost(post: BlogPost) {
    setForm({
      title: post.title, slug: post.slug, content: "", excerpt: post.excerpt || "",
      coverImage: post.coverImage || "", categoryId: post.category?.id ? String(post.category.id) : "",
      author: post.author || "", tags: "[]", metaTitle: "", metaDesc: "",
      isPublished: post.isPublished, city: "", serviceSlug: "",
    });
    setEditingId(post.id);
    setShowForm(true);
    setPreview(false);
    fetch("/api/blog?all=true").then(r => r.json()).then(all => {
      const full = all.find((p: BlogPost) => p.id === post.id);
      if (full) setForm(prev => ({ ...prev, content: (full as any).content || "" }));
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) { toast.error("Başlık, slug ve içerik zorunludur."); return; }
    try {
      const url = editingId ? `/api/blog/${editingId}` : "/api/blog";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const err = await res.json(); toast.error(err.error || "Bir hata oluştu."); return; }
      toast.success(editingId ? "Yazı güncellendi." : "Yazı oluşturuldu.");
      resetForm(); loadData();
    } catch { toast.error("Bir hata oluştu."); }
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch(`/api/blog/${post.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    if (res.ok) { toast.success(post.isPublished ? "Yayından kaldırıldı." : "Yayınlandı."); loadData(); }
    else toast.error("Güncellenemedi.");
  }

  async function confirmDeletePost() {
    if (!deletePostId) return;
    const res = await fetch(`/api/blog/${deletePostId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Yazı silindi."); loadData(); }
    else toast.error("Silinemedi.");
    setDeletePostId(null);
  }

  async function saveCategory() {
    if (!catForm.name || !catForm.slug) return;
    const method = catEditing ? "PUT" : "POST";
    const body = catEditing ? { ...catForm, id: catEditing } : catForm;
    const res = await fetch("/api/admin/blog-categories", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      toast.success(catEditing ? "Kategori güncellendi." : "Kategori oluşturuldu.");
      setCatForm({ name: "", slug: "" }); setCatEditing(null); loadData();
    } else { const err = await res.json(); toast.error(err.error || "Hata."); }
  }

  async function confirmDeleteCategory() {
    if (!deleteCatId) return;
    const res = await fetch(`/api/admin/blog-categories?id=${deleteCatId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Kategori silindi."); loadData(); }
    else { const err = await res.json(); toast.error(err.error || "Hata."); }
    setDeleteCatId(null);
  }

  const columns: TableColumn<BlogPost>[] = [
    {
      header: "Başlık",
      accessor: (r) => (
        <div>
          <p className="font-medium truncate max-w-[250px] lg:max-w-[400px]">{r.title}</p>
          <p className="text-xs text-[var(--admin-text-muted)] truncate">/{r.slug}</p>
        </div>
      ),
    },
    {
      header: "Kategori",
      hidden: "sm",
      accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{r.category?.name || "—"}</span>,
    },
    {
      header: "Durum",
      hidden: "md",
      accessor: (r) => r.isPublished ? <Badge variant="success">Yayında</Badge> : <Badge variant="warning">Taslak</Badge>,
    },
    {
      header: "Tarih",
      hidden: "lg",
      accessor: (r) => (
        <span className="text-[var(--admin-text-secondary)]">
          {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("tr-TR") : new Date(r.createdAt).toLocaleDateString("tr-TR")}
        </span>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton variant="page" />;

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <PageTitle>Blog Yönetimi</PageTitle>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?type=blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium"
            aria-label="Blog yazılarını CSV olarak dışa aktar"
          >
            ⬇ CSV Export
          </a>
          <button onClick={() => { setShowCatManager(!showCatManager); }}
            className="border border-[var(--admin-border)] text-[var(--admin-text-secondary)] px-4 py-2 rounded-md text-sm font-medium hover:text-[var(--admin-text-primary)] transition">
            Kategoriler
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-[var(--admin-primary)] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--admin-primary-strong)] transition">
            + Yeni Yazı
          </button>
        </div>
      </div>

      {/* Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-4 sm:pt-10 overflow-y-auto">
          <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg p-6 w-full max-w-3xl m-4 relative">
            <button onClick={resetForm} className="absolute top-4 right-4 text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] text-xl">&times;</button>
            <h2 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-4">{editingId ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Başlık *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">İçerik (HTML) *</label>
                <div className="flex gap-2 mb-1">
                  <button type="button" onClick={() => setPreview(false)}
                    className={`text-xs px-2 py-1 rounded ${!preview ? 'bg-[var(--admin-primary)] text-white' : 'bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]'}`}>Düzenle</button>
                  <button type="button" onClick={() => setPreview(true)}
                    className={`text-xs px-2 py-1 rounded ${preview ? 'bg-[var(--admin-primary)] text-white' : 'bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]'}`}>Önizle</button>
                </div>
                {preview ? (
                  <div className="bg-[var(--admin-surface-muted)] border border-[var(--admin-border)] rounded-md p-4 text-[var(--admin-text-primary)] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHTML(form.content) }} />
                ) : (
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    className={`${inputClass} font-mono text-sm`} rows={16} required />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Özet</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    className={inputClass} rows={3} />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Kapak Görseli URL</label>
                    <input value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Kategori</label>
                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className={inputClass}>
                      <option value="">Kategori seç</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Yazar</label>
                    <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className={inputClass} />
                  </div>
                </div>
              </div>

              <details className="bg-[var(--admin-surface-muted)] rounded-md p-3">
                <summary className="text-sm text-[var(--admin-text-secondary)] cursor-pointer">SEO Ayarları</summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Meta Başlık</label>
                    <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Meta Açıklama</label>
                    <textarea value={form.metaDesc} onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))} className={inputClass} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Şehir (opsiyonel)</label>
                      <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputClass} placeholder="İstanbul" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--admin-text-secondary)] mb-1">Hizmet Slug (opsiyonel)</label>
                      <input value={form.serviceSlug} onChange={e => setForm(f => ({ ...f, serviceSlug: e.target.value }))} className={inputClass} placeholder="mobilya-montaji" />
                    </div>
                  </div>
                </div>
              </details>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-[var(--admin-text-secondary)]">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                    className="text-[var(--admin-primary)] rounded" />
                  Hemen yayınla
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={resetForm}
                  className="px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]">İptal</button>
                <button type="submit"
                  className="bg-[var(--admin-primary)] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[var(--admin-primary-strong)] transition">
                  {editingId ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager */}
      {showCatManager && (
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-[var(--admin-text-primary)] mb-3">Kategoriler</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-1 bg-[var(--admin-surface-muted)] rounded-md px-2 py-1 text-xs text-[var(--admin-text-secondary)]">
                <span>{c.name}</span>
                <button onClick={() => { setCatForm({ name: c.name, slug: c.slug }); setCatEditing(c.id); }}
                  className="text-[var(--admin-primary)] hover:underline ml-1">✎</button>
                <button onClick={() => setDeleteCatId(c.id)} className="text-[var(--admin-danger)] hover:underline">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-xs text-[var(--admin-text-secondary)] mb-1">Ad</label>
              <input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded px-2 py-1 text-[var(--admin-text-primary)] text-sm w-32" />
            </div>
            <div>
              <label className="block text-xs text-[var(--admin-text-secondary)] mb-1">Slug</label>
              <input value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))}
                className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded px-2 py-1 text-[var(--admin-text-primary)] text-sm w-32" />
            </div>
            <button onClick={saveCategory}
              className="bg-[var(--admin-primary)] text-white px-3 py-1.5 rounded text-sm font-medium">
              {catEditing ? "Güncelle" : "Ekle"}
            </button>
            {catEditing && <button onClick={() => { setCatForm({ name: "", slug: "" }); setCatEditing(null); }}
              className="text-xs text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]">İptal</button>}
          </div>
        </div>
      )}

      {/* Posts Table */}
      <Dialog
        open={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        title="Yazıyı Sil"
        description="Bu yazıyı silmek istediğinize emin misiniz?"
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setDeletePostId(null), variant: "ghost" },
          { label: "Sil", onClick: confirmDeletePost, variant: "danger" },
        ]}
      />
      <Dialog
        open={!!deleteCatId}
        onClose={() => setDeleteCatId(null)}
        title="Kategoriyi Sil"
        description="Kategoriyi silmek istediğinize emin misiniz?"
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setDeleteCatId(null), variant: "ghost" },
          { label: "Sil", onClick: confirmDeleteCategory, variant: "danger" },
        ]}
      />
      <AdminTable<BlogPost>
        rows={posts}
        columns={columns}
        keyField={(r) => r.id}
        onRowClick={(r) => window.location.href = `/admin/blog/${r.id}/edit`}
        emptyState={<span>Henüz blog yazısı yok.</span>}
        actions={(r) => (
          <RowActionsDropdown
            items={[
              { label: "Düzenle", onClick: () => editPost(r), icon: Edit },
              { label: r.isPublished ? "Yayından Kaldır" : "Yayınla", onClick: () => togglePublish(r), icon: r.isPublished ? EyeOff : Eye },
              { label: "Sil", onClick: () => setDeletePostId(r.id), variant: "danger", icon: Trash2 },
            ]}
          />
        )}
      />
    </PageContainer>
  );
}
