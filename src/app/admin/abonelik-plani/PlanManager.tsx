"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function PlanManager({ plans }: PlanManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>(emptyPlan);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm(emptyPlan);
    setEditingId(null);
  }

  function startEdit(plan: Plan) {
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      price: plan.price,
      durationDays: plan.durationDays,
      features: plan.features,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
      badgeLabel: plan.badgeLabel || "",
      badgeColor: plan.badgeColor || "amber",
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
      if (res.ok) {
        resetForm();
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu planı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/subscription-plans?id=${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch {
      // silently fail
    }
  }

  function parseFeatures(features: string): string[] {
    try {
      return JSON.parse(features || "[]");
    } catch {
      return [];
    }
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
      {/* List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Planlar</h2>
          <button onClick={resetForm} className="text-xs text-montaj hover:underline">
            + Yeni
          </button>
        </div>
        {plans.length === 0 && (
          <p className="text-sub-text text-sm">Henüz plan eklenmemiş.</p>
        )}
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-4 rounded-lg border cursor-pointer transition ${
              editingId === plan.id
                ? "border-montaj bg-montaj/10"
                : "border-dark-border bg-dark-card hover:border-montaj/50"
            }`}
            onClick={() => startEdit(plan)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{plan.name}</span>
              <div className="flex items-center gap-2">
                {!plan.isActive && (
                  <span className="text-xs text-red-400">Pasif</span>
                )}
                <span className="text-xs text-sub-text">{plan._count?.profiles || 0} üye</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-sub-text">
              <span>{plan.price > 0 ? `${(plan.price / 100).toFixed(2)} TL` : "Ücretsiz"}</span>
              <span>{plan.durationDays} gün</span>
              {plan.badgeLabel && <span className="text-amber-400">{plan.badgeLabel}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-dark-card rounded-xl border border-dark-border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {editingId ? "Planı Düzenle" : "Yeni Plan"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-sub-text mb-1">Plan Adı</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-sub-text mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-sub-text mb-1">Açıklama</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-sub-text mb-1">Fiyat (kuruş)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
              min={0}
            />
            <p className="text-xs text-sub-text mt-0.5">Örn: 29900 = 299,00 TL</p>
          </div>
          <div>
            <label className="block text-xs text-sub-text mb-1">Süre (gün)</label>
            <input
              type="number"
              value={form.durationDays}
              onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-sub-text mb-1">Rozet Etiketi</label>
            <input
              value={form.badgeLabel}
              onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
              placeholder="Premium"
            />
          </div>
          <div>
            <label className="block text-xs text-sub-text mb-1">Rozet Rengi</label>
            <select
              value={form.badgeColor}
              onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
            >
              <option value="amber">Altın</option>
              <option value="purple">Mor</option>
              <option value="blue">Mavi</option>
              <option value="green">Yeşil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-sub-text mb-1">Sıralama</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className="w-24 px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-sub-text">Özellikler</label>
            <button type="button" onClick={addFeature} className="text-xs text-montaj hover:underline">
              + Ekle
            </button>
          </div>
          <div className="space-y-2">
            {parseFeatures(form.features).map((feat: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={feat}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
                  placeholder="Örn: Ön sıralama"
                />
                <button type="button" onClick={() => removeFeature(i)} className="text-red-400 text-xs hover:underline">
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-dark-border"
          />
          <span className="text-sm text-muted-text">Aktif</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-montaj text-white rounded-lg text-sm hover:bg-montaj-dark transition disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Oluştur"}
          </button>
          {editingId && (
            <>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-dark-border rounded-lg text-sm text-sub-text hover:text-white transition"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(editingId)}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition ml-auto"
              >
                Sil
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
