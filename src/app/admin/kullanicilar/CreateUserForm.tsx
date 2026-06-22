"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const ALL_ROLES = [
  { value: "CUSTOMER", label: "Müşteri" },
  { value: "ASSEMBLER", label: "Montajcı" },
  { value: "MANUFACTURER", label: "Üretici" },
  { value: "ADMIN", label: "Admin" },
];

export default function CreateUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["CUSTOMER"]);

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedRoles.length === 0) {
      setError("En az bir rol seçilmelidir.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, roles: selectedRoles }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Oluşturma başarısız.");
      }

      setOpen(false);
      setForm({ name: "", email: "", password: "" });
      setSelectedRoles(["CUSTOMER"]);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
      >
        + Kullanıcı Oluştur
      </button>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Yeni Kullanıcı Oluştur</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-sub-text hover:text-white transition text-xl leading-none"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ad Soyad</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white focus:outline-none focus:ring-2 focus:ring-montaj"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">E-posta</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white focus:outline-none focus:ring-2 focus:ring-montaj"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Şifre</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white focus:outline-none focus:ring-2 focus:ring-montaj"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Roller</label>
            <div className="space-y-2">
              {ALL_ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex items-center gap-3 p-2 rounded-lg border border-dark-border hover:border-montaj/50 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="w-4 h-4 rounded border-dark-border text-montaj focus:ring-montaj bg-dark-bg"
                  />
                  <span className="text-sm text-white">{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg">{error}</div>
        )}

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>
            Oluştur
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-sub-text hover:text-white transition"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
