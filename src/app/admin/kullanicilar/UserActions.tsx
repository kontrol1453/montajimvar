"use client";

import { useState } from "react";

const ALL_ROLES = [
  { value: "CUSTOMER", label: "Müşteri" },
  { value: "ASSEMBLER", label: "Montajcı" },
  { value: "MANUFACTURER", label: "Üretici" },
  { value: "ADMIN", label: "Admin" },
];

export default function UserActions({
  userId,
  userName,
  userRoles,
  premiumUntil,
}: {
  userId: number;
  userName: string;
  userRoles: string[];
  premiumUntil: string | null;
}) {
  const [deleting, setDeleting] = useState(false);
  const [roleEditorOpen, setRoleEditorOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles);
  const [saving, setSaving] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumDays, setPremiumDays] = useState(30);
  const [premiumSaving, setPremiumSaving] = useState(false);

  const isPremium = premiumUntil ? new Date(premiumUntil) > new Date() : false;
  const premiumEndDate = premiumUntil ? new Date(premiumUntil).toLocaleDateString("tr-TR") : null;

  async function handlePremium() {
    setPremiumSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: premiumDays }),
      });

      if (res.ok) {
        setPremiumOpen(false);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Premium güncellenemedi.");
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setPremiumSaving(false);
    }
  }

  async function handleRevokePremium() {
    if (!confirm(`"${userName}" kullanıcısının premium üyeliğini iptal etmek istediğinize emin misiniz?`)) {
      return;
    }

    setPremiumSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 0 }),
      });

      if (res.ok) {
        setPremiumOpen(false);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Premium iptal edilemedi.");
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setPremiumSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`"${userName}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız.");
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setDeleting(false);
    }
  }

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleSaveRoles() {
    if (selectedRoles.length === 0) {
      alert("En az bir rol seçilmelidir.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: selectedRoles }),
      });

      if (res.ok) {
        setRoleEditorOpen(false);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Roller güncellenemedi.");
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => {
          setSelectedRoles(userRoles);
          setRoleEditorOpen(true);
        }}
        className="text-xs text-montaj hover:text-montaj-dark transition"
      >
        Roller
      </button>
      <button
        onClick={() => {
          setPremiumDays(30);
          setPremiumOpen(true);
        }}
        className={`text-xs transition ${
          isPremium
            ? "text-amber-400 hover:text-amber-300"
            : "text-sub-text hover:text-white"
        }`}
      >
        {isPremium ? "Premium" : "Premium Ver"}
      </button>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
      >
        {deleting ? "Siliniyor..." : "Sil"}
      </button>

      {/* Premium Modal */}
      {premiumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Premium Üyelik: {userName}
              </h3>
              <button
                onClick={() => setPremiumOpen(false)}
                className="text-sub-text hover:text-white transition text-xl leading-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {isPremium && (
                <div className="p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-300">
                    <span className="font-medium">Aktif Premium</span>
                    <br />
                    Bitiş: {premiumEndDate}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Premium Süresi (gün)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 15, 30, 60, 90, 365].map((d) => (
                    <button
                      key={d}
                      onClick={() => setPremiumDays(d)}
                      className={`px-3 py-2 rounded-lg text-sm border transition ${
                        premiumDays === d
                          ? "bg-montaj text-white border-montaj"
                          : "bg-dark-bg text-sub-text border-dark-border hover:border-montaj/50"
                      }`}
                    >
                      {d} gün
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePremium}
                  disabled={premiumSaving}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium disabled:opacity-50"
                >
                  {premiumSaving ? "Kaydediliyor..." : isPremium ? "Süre Uzat" : "Premium Ver"}
                </button>
                {isPremium && (
                  <button
                    onClick={handleRevokePremium}
                    disabled={premiumSaving}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition text-sm font-medium disabled:opacity-50"
                  >
                    İptal Et
                  </button>
                )}
                <button
                  onClick={() => setPremiumOpen(false)}
                  className="px-4 py-2 text-sm text-sub-text hover:text-white transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Editor Modal */}
      {roleEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Roller: {userName}
              </h3>
              <button
                onClick={() => setRoleEditorOpen(false)}
                className="text-sub-text hover:text-white transition text-xl leading-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {ALL_ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex items-center gap-3 p-3 rounded-lg border border-dark-border hover:border-montaj/50 transition cursor-pointer"
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
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveRoles}
                disabled={saving}
                className="px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                onClick={() => setRoleEditorOpen(false)}
                className="px-4 py-2 text-sm text-sub-text hover:text-white transition"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
