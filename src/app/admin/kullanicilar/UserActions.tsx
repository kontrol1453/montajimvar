"use client";

import { useState } from "react";
import { Shield, Crown, Trash2 } from "lucide-react";
import RowActionsDropdown from "@/components/admin/DataTable/RowActionsDropdown";

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
    { label: isPremium ? "Premium Yönet" : "Premium Ver", onClick: () => { setPremiumDays(30); setPremiumDays(30); setPremiumOpen(true); }, variant: "premium" as const, icon: Crown },
    { label: deleting ? "Siliniyor..." : "Kullanıcıyı Sil", onClick: handleDelete, variant: "danger" as const, icon: Trash2 },
  ];

  return (
    <>
      <RowActionsDropdown items={actions} label={`${userName} işlemleri`} />
      {roleEditorOpen && (
        <RoleEditorModal userName={userName} roles={ALL_ROLES} selected={selectedRoles} onToggle={toggleRole} saving={saving} onSave={handleSaveRoles} onClose={() => setRoleEditorOpen(false)} />
      )}
      {premiumOpen && (
        <PremiumModal userName={userName} isPremium={isPremium} premiumUntil={premiumUntil} premiumDays={premiumDays} onDays={setPremiumDays} onSave={handlePremium} onCancel={handleRevokePremium} saving={premiumSaving} onClose={() => setPremiumOpen(false)} />
      )}
    </>
  );
}

/* ── Reusable sub-components ──────────────── */
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-[var(--admin-surface)] rounded-lg shadow-xl border border-[var(--admin-border)] p-6 w-full max-w-md mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute top-4 right-4 text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] text-xl leading-none">&times;</button>
        {children}
      </div>
    </div>
  );
}

function RoleEditorModal({
  userName, roles, selected, onToggle, saving, onSave, onClose,
}: {
  userName: string; roles: typeof ALL_ROLES; selected: string[]; onToggle: (r: string) => void; saving: boolean; onSave: () => void; onClose: () => void;
}) {
  return (
    <ModalBackdrop onClose={onClose}>
      <h3 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-4">Roller: {userName}</h3>
      <div className="space-y-2 mb-4">
        {roles.map((r) => (
          <label key={r.value} className="flex items-center gap-3 p-3 rounded-md border border-[var(--admin-border)] hover:border-[var(--admin-primary)] transition-colors cursor-pointer">
            <input type="checkbox" checked={selected.includes(r.value)} onChange={() => onToggle(r.value)} className="w-4 h-4 rounded text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]" />
            <span className="text-sm text-[var(--admin-text-primary)]">{r.label}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium disabled:opacity-50">{saving ? "Kaydediliyor..." : "Kaydet"}</button>
        <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]">İptal</button>
      </div>
    </ModalBackdrop>
  );
}

function PremiumModal({
  userName, isPremium, premiumUntil, premiumDays, onDays, onSave, onCancel, saving, onClose,
}: {
  userName: string; isPremium: boolean; premiumUntil: string | null; premiumDays: number; onDays: (d: number) => void; onSave: () => void; onCancel: () => void; saving: boolean; onClose: () => void;
}) {
  return (
    <ModalBackdrop onClose={onClose}>
      <h3 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-4">Premium Üyelik: {userName}</h3>
      {isPremium && (
        <div className="p-3 bg-[var(--admin-premium-soft)] border border-amber-300 rounded-md mb-4">
          <p className="text-sm text-[var(--admin-premium)]"><span className="font-medium">Aktif Premium</span><br/>Bitiş: {premiumUntil ? new Date(premiumUntil).toLocaleDateString("tr-TR") : "—"}</p>
        </div>
      )}
      <label className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2">Premium Süresi (gün)</label>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[7, 15, 30, 60, 90, 365].map((d) => (
          <button key={d} onClick={() => onDays(d)} className={`px-3 py-2 rounded-md text-sm border transition ${premiumDays === d ? "bg-[var(--admin-primary)] text-white border-[var(--admin-primary)]" : "bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] border-[var(--admin-border)] hover:border-[var(--admin-primary)]"}`}>{d} gün</button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-[var(--admin-premium-soft)] text-[var(--admin-premium)] border border-amber-300 rounded-md hover:bg-amber-50 transition text-sm font-medium disabled:opacity-50">{saving ? "Kaydediliyor..." : isPremium ? "Süre Uzat" : "Premium Ver"}</button>
        {isPremium && <button onClick={onCancel} disabled={saving} className="px-4 py-2 bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] border border-red-300 rounded-md hover:bg-red-50 transition text-sm font-medium disabled:opacity-50">İptal Et</button>}
        <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]">Kapat</button>
      </div>
    </ModalBackdrop>
  );
}