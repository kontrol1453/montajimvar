"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    categoryId: "",
    author: "",
    tags: "[]",
    metaTitle: "",
    metaDesc: "",
    isPublished: false,
    city: "",
    serviceSlug: "",
  });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch("/api/blog?all=true"),
        fetch("/api/blog/categories"),
      ]);
      if (postsRes.ok) setPosts(await postsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
    } catch {
      toast.error("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      categoryId: "",
      author: "",
      tags: "[]",
      metaTitle: "",
      metaDesc: "",
      isPublished: false,
      city: "",
      serviceSlug: "",
    });
    setEditingId(null);
    setShowForm(false);
    setPreview(false);
  }

  function editPost(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      content: "",
      excerpt: post.excerpt || "",
      coverImage: post.coverImage || "",
      categoryId: post.category?.id ? String(post.category.id) : "",
      author: post.author || "",
      tags: "[]",
      metaTitle: "",
      metaDesc: "",
      isPublished: post.isPublished,
      city: "",
      serviceSlug: "",
    });
    setEditingId(post.id);
    setShowForm(true);
    setPreview(false);
    // Fetch full post content
    fetch(`/api/blog?all=true`).then(r => r.json()).then(all => {
      const full = all.find((p: BlogPost) => p.id === post.id);
      if (full) {
        setForm(prev => ({ ...prev, content: (full as any).content || "" }));
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      toast.error("Başlık, slug ve içerik zorunludur.");
      return;
    }

    try {
      const url = editingId ? `/api/blog/${editingId}` : "/api/blog";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Bir hata oluştu.");
        return;
      }

      toast.success(editingId ? "Yazı güncellendi." : "Yazı oluşturuldu.");
      resetForm();
      loadData();
    } catch {
      toast.error("Bir hata oluştu.");
    }
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch(`/api/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    if (res.ok) {
      toast.success(post.isPublished ? "Yayından kaldırıldı." : "Yayınlandı.");
      loadData();
    } else {
      toast.error("Güncellenemedi.");
    }
  }

  async function deletePost(id: number) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Yazı silindi.");
      loadData();
    } else {
      toast.error("Silinemedi.");
    }
  }

  if (loading) return <div className="p-6 text-sub-text">Yükleniyor...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Blog Yönetimi</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-montaj text-dark-bg px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
          + Yeni Yazı
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-4 sm:pt-10 overflow-y-auto">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-3xl m-4 relative">
            <button onClick={resetForm} className="absolute top-4 right-4 text-sub-text hover:text-white text-xl">&times;</button>
            <h2 className="text-lg font-semibold text-white mb-4">{editingId ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-sub-text mb-1">Başlık *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-sub-text mb-1">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-sub-text mb-1">İçerik (HTML) *</label>
                <div className="flex gap-2 mb-1">
                  <button type="button" onClick={() => setPreview(false)} className={`text-xs px-2 py-1 rounded ${!preview ? 'bg-montaj text-dark-bg' : 'bg-dark-bg text-sub-text'}`}>Düzenle</button>
                  <button type="button" onClick={() => setPreview(true)} className={`text-xs px-2 py-1 rounded ${preview ? 'bg-montaj text-dark-bg' : 'bg-dark-bg text-sub-text'}`}>Önizle</button>
                </div>
                {preview ? (
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
                ) : (
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white font-mono text-sm" rows={16} required />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-sub-text mb-1">Özet</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" rows={3} />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-sub-text mb-1">Kapak Görseli URL</label>
                    <input value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-sub-text mb-1">Kategori</label>
                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white">
                      <option value="">Kategori seç</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-sub-text mb-1">Yazar</label>
                    <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white" />
                  </div>
                </div>
              </div>

              <details className="bg-dark-bg rounded-lg p-3">
                <summary className="text-sm text-sub-text cursor-pointer">SEO Ayarları</summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm text-sub-text mb-1">Meta Başlık</label>
                    <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-sub-text mb-1">Meta Açıklama</label>
                    <textarea value={form.metaDesc} onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-sub-text mb-1">Şehir (opsiyonel)</label>
                      <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white" placeholder="İstanbul" />
                    </div>
                    <div>
                      <label className="block text-sm text-sub-text mb-1">Hizmet Slug (opsiyonel)</label>
                      <input value={form.serviceSlug} onChange={e => setForm(f => ({ ...f, serviceSlug: e.target.value }))} className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white" placeholder="mobilya-montaji" />
                    </div>
                  </div>
                </div>
              </details>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-sub-text">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="accent-montaj" />
                  Hemen yayınla
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-sub-text hover:text-white">İptal</button>
                <button type="submit" className="bg-montaj text-dark-bg px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                  {editingId ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-section text-sub-text text-left">
              <tr>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3 hidden sm:table-cell">Kategori</th>
                <th className="px-4 py-3 hidden md:table-cell">Durum</th>
                <th className="px-4 py-3 hidden lg:table-cell">Tarih</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {posts.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sub-text">Henüz blog yazısı yok.</td></tr>
              ) : posts.map(post => (
                <tr key={post.id} className="hover:bg-dark-section/50">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium truncate max-w-[250px] lg:max-w-[400px]">{post.title}</p>
                    <p className="text-xs text-sub-text truncate max-w-[250px]">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-sub-text">{post.category?.name || "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.isPublished ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                      {post.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sub-text">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => editPost(post)} className="text-xs text-montaj hover:underline">Düzenle</button>
                      <button onClick={() => togglePublish(post)} className="text-xs text-amber-400 hover:underline">
                        {post.isPublished ? "Yayından Kaldır" : "Yayınla"}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="text-xs text-red-400 hover:underline">Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
