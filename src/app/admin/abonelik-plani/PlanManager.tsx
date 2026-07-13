"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Dialog from "@/components/admin/Dialog";

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  durationDays: number;
  features: string;
  isActive: boolean;
  sortOrder: number;
  badgeLabel: string | null;
  badgeColor: string | null;
  _count?: { profiles: number };
}

interface PlanManagerProps {
  plans: Plan[];
}

const emptyPlan = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  durationDays: 30,
  features: "[]",
  isActive: true,
  sortOrder: 0,
  badgeLabel: "",
  badgeColor: "amber",
};

const inputClass = "w-full px-3 py-2 border border-[var(--admin-border)] rounded-md text-sm bg-[var(--admin-surface)] text-[var(--admin-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/50";
const labelClass = "block text-xs text-[var(--admin-text-secondary)] mb-1";

export default function PlanManager({ plans }: PlanManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>(emptyPlan);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  function resetForm() { setForm(emptyPlan); setEditingId(null); }

  function startEdit(plan: Plan) {
    setForm({
      name: plan.name, slug: plan.slug, description: plan.description || "",
      price: plan.price, durationDays: plan.durationDays, features: plan.features,
      isActive: plan.isActive, sortOrder: plan.sortOrder,
      badgeLabel: plan.badgeLabel || "", badgeColor: plan.badgeColor || "amber",
    });
    setEditingId(plan.id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/subscription-plans", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      if (res.ok) { resetForm(); router.refresh(); }
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/subscription-plans?id=${deleteTarget}`, { method: "DELETE" });
      if (res.ok) { toast.success("Plan silindi."); resetForm(); router.refresh(); }
    } catch { toast.error("Silme başarısız."); }
    finally { setDeleteTarget(null); }
  }

  function parseFeatures(features: string): string[] {
    try { return JSON.parse(features || "[]"); } catch { return []; }
  }

  function addFeature() {
    const current = parseFeatures(form.features);
    current.push("");
    setForm({ ...form, features: JSON.stringify(current) });
  }

  function updateFeature(index: number, value: string) {
    const current = parseFeatures(form.features);
    current[index] = value;
    setForm({ ...form, features: JSON.stringify(current) });
  }

  function removeFeature(index: number) {
    const current = parseFeatures(form.features);
    current.splice(index, 1);
    setForm({ ...form, features: JSON.stringify(current) });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">Planlar</h2>
          <button onClick={resetForm} className="text-xs text-[var(--admin-primary)] hover:underline">+ Yeni</button>
        </div>
        {plans.length === 0 && <p className="text-[var(--admin-text-muted)] text-sm">Henüz plan eklenmemiş.</p>}
        {plans.map((plan) => (
          <div key={plan.id}
            className={`p-4 rounded-lg border cursor-pointer transition ${
              editingId === plan.id
                ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/5"
                : "border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-primary)]/50"
            }`}
            onClick={() => startEdit(plan)}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-[var(--admin-text-primary)]">{plan.name}</span>
              <div className="flex items-center gap-2">
                {!plan.isActive && <span className="text-xs text-[var(--admin-danger)]">Pasif</span>}
                <span className="text-xs text-[var(--admin-text-muted)]">{plan._count?.profiles || 0} üye</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--admin-text-secondary)]">
              <span>{plan.price > 0 ? `${(plan.price / 100).toFixed(2)} TL` : "Ücretsiz"}</span>
              <span>{plan.durationDays} gün</span>
              {plan.badgeLabel && <span className="text-amber-500">{plan.badgeLabel}</span>}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--admin-text-primary)]">
          {editingId ? "Planı Düzenle" : "Yeni Plan"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Plan Adı</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Açıklama</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fiyat (kuruş)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} min={0} />
            <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">Örn: 29900 = 299,00 TL</p>
          </div>
          <div>
            <label className={labelClass}>Süre (gün)</label>
            <input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })} className={inputClass} min={1} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rozet Etiketi</label>
            <input value={form.badgeLabel} onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })} className={inputClass} placeholder="Premium" />
          </div>
          <div>
            <label className={labelClass}>Rozet Rengi</label>
            <select value={form.badgeColor} onChange={(e) => setForm({ ...form, badgeColor: e.target.value })} className={inputClass}>
              <option value="amber">Altın</option>
              <option value="purple">Mor</option>
              <option value="blue">Mavi</option>
              <option value="green">Yeşil</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Sıralama</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-24 px-3 py-2 border border-[var(--admin-border)] rounded-md text-sm bg-[var(--admin-surface)] text-[var(--admin-text-primary)]" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Özellikler</label>
            <button type="button" onClick={addFeature} className="text-xs text-[var(--admin-primary)] hover:underline">+ Ekle</button>
          </div>
          <div className="space-y-2">
            {parseFeatures(form.features).map((feat: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input value={feat} onChange={(e) => updateFeature(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--admin-border)] rounded-md text-sm bg-[var(--admin-surface)] text-[var(--admin-text-primary)]"
                  placeholder="Örn: Ön sıralama" />
                <button type="button" onClick={() => removeFeature(i)} className="text-xs text-[var(--admin-danger)] hover:underline">Sil</button>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-[var(--admin-border)] text-[var(--admin-primary)]" />
          <span className="text-sm text-[var(--admin-text-secondary)]">Aktif</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md text-sm hover:bg-[var(--admin-primary-strong)] transition disabled:opacity-50">
            {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Oluştur"}
          </button>
          {editingId && (
            <>
              <button type="button" onClick={resetForm}
                className="px-4 py-2 border border-[var(--admin-border)] rounded-md text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] transition">
                İptal
              </button>
              <button type="button" onClick={() => setDeleteTarget(editingId)}
                className="px-4 py-2 bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] rounded-md text-sm hover:bg-[var(--admin-danger-soft)]/80 transition ml-auto">
                Sil
              </button>
            </>
          )}
        </div>
      </form>
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Planı Sil"
        description="Bu planı silmek istediğinize emin misiniz?"
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setDeleteTarget(null), variant: "ghost" },
          { label: "Sil", onClick: confirmDelete, variant: "danger" },
        ]}
      />
    </div>
  );
}
