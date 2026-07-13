"use client";

import { useState } from "react";
import { Shield, Crown, Trash2 } from "lucide-react";
import RowActionsDropdown from "@/components/admin/DataTable/RowActionsDropdown";
import Dialog from "@/components/admin/Dialog";
import Button from "@/components/ui/Button";

const ALL_ROLES = [
  { value: "CUSTOMER", label: "Müşteri" },
  { value: "ASSEMBLER", label: "Montajcı" },
  { value: "MANUFACTURER", label: "Üretici" },
  { value: "ADMIN", label: "Admin" },
];

interface Props {
  userId: number;
  userName: string;
  userRoles: string[];
  premiumUntil: string | null;
}

export default function UserActions({ userId, userName, userRoles, premiumUntil }: Props) {
  const [roleEditorOpen, setRoleEditorOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles);
  const [saving, setSaving] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumDays, setPremiumDays] = useState(30);
  const [premiumSaving, setPremiumSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isPremium = premiumUntil ? new Date(premiumUntil) > new Date() : false;

  async function handlePremium() {
    setPremiumSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: premiumDays }),
      });
      if (res.ok) { setPremiumOpen(false); window.location.reload(); } else {
        const data = await res.json(); alert(data.error || "Premium güncellenemedi.");
      }
    } catch { alert("Bir hata oluştu."); }
    finally { setPremiumSaving(false); }
  }

  async function handleRevokePremium() {
    if (!confirm(`${userName} kullanıcısının premium üyeliğini iptal etmek istediğinize emin misiniz?`)) return;
    setPremiumSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/premium`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ days: 0 }),
      });
      if (res.ok) { setPremiumOpen(false); window.location.reload(); } else {
        const data = await res.json(); alert(data.error || "Premium iptal edilemedi.");
      }
    } catch { alert("Bir hata oluştu."); }
    finally { setPremiumSaving(false); }
  }

  function toggleRole(role: string) { setSelectedRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]); }
  async function handleSaveRoles() {
    if (selectedRoles.length === 0) { alert("En az bir rol seçilmelidir."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/roles`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roles: selectedRoles }) });
      if (res.ok) { setRoleEditorOpen(false); window.location.reload(); } else { const data = await res.json(); alert(data.error || "Roller güncellenemedi."); }
    } catch { alert("Bir hata oluştu."); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm(`${userName} kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: userId }) });
      if (res.ok) { window.location.reload(); } else { const data = await res.json(); alert(data.error || "Silme başarısız."); }
    } catch { alert("Bir hata oluştu."); }
    finally { setDeleting(false); }
  }

  const actions = [
    { label: "Rolleri Yönet", onClick: () => { setSelectedRoles(userRoles); setRoleEditorOpen(true); }, icon: Shield },
    { label: isPremium ? "Premium Yönet" : "Premium Ver", onClick: () => { setPremiumDays(30); setPremiumOpen(true); }, variant: "premium" as const, icon: Crown },
    { label: deleting ? "Siliniyor..." : "Kullanıcıyı Sil", onClick: handleDelete, variant: "danger" as const, icon: Trash2 },
  ];

  return (
    <>
      <RowActionsDropdown items={actions} label={`${userName} işlemleri`} />

      <Dialog
        open={roleEditorOpen}
        onClose={() => setRoleEditorOpen(false)}
        title={`Roller: ${userName}`}
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setRoleEditorOpen(false), variant: "ghost" },
          { label: saving ? "Kaydediliyor..." : "Kaydet", onClick: handleSaveRoles, disabled: saving },
        ]}
      >
        <div className="space-y-2">
          {ALL_ROLES.map((r) => (
            <label key={r.value} className="flex items-center gap-3 p-3 rounded-md border border-[var(--admin-border)] hover:border-[var(--admin-primary)] transition-colors cursor-pointer">
              <input type="checkbox" checked={selectedRoles.includes(r.value)} onChange={() => toggleRole(r.value)} className="w-4 h-4 rounded text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]" />
              <span className="text-sm text-[var(--admin-text-primary)]">{r.label}</span>
            </label>
          ))}
        </div>
      </Dialog>

      <Dialog
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        title={`Premium Üyelik: ${userName}`}
        size="sm"
        actions={
          isPremium
            ? [
                { label: "Kapat", onClick: () => setPremiumOpen(false), variant: "ghost" },
                { label: "İptal Et", onClick: handleRevokePremium, variant: "danger", disabled: premiumSaving },
                { label: premiumSaving ? "Kaydediliyor..." : "Süre Uzat", onClick: handlePremium, disabled: premiumSaving },
              ]
            : [
                { label: "İptal", onClick: () => setPremiumOpen(false), variant: "ghost" },
                { label: premiumSaving ? "Kaydediliyor..." : "Premium Ver", onClick: handlePremium, disabled: premiumSaving },
              ]
        }
      >
        {isPremium && (
          <div className="p-3 bg-[var(--admin-premium-soft)] border border-amber-300 rounded-md mb-4">
            <p className="text-sm text-[var(--admin-premium)]">
              <span className="font-medium">Aktif Premium</span><br/>
              Bitiş: {premiumUntil ? new Date(premiumUntil).toLocaleDateString("tr-TR") : "—"}
            </p>
          </div>
        )}
        <label className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2">Premium Süresi (gün)</label>
        <div className="grid grid-cols-3 gap-2">
          {[7, 15, 30, 60, 90, 365].map((d) => (
            <button key={d} onClick={() => setPremiumDays(d)} className={`px-3 py-2 rounded-md text-sm border transition ${premiumDays === d ? "bg-[var(--admin-primary)] text-white border-[var(--admin-primary)]" : "bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] border-[var(--admin-border)] hover:border-[var(--admin-primary)]"}`}>{d} gün</button>
          ))}
        </div>
      </Dialog>
    </>
  );
}
