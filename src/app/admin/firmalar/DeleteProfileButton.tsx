"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  profileId: number;
  companyName: string;
}

export default function DeleteProfileButton({ profileId, companyName }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/profiles?id=${profileId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Silme hatası");
        setLoading(false);
        return;
      }
      router.refresh();
      setOpen(false);
    } catch { alert("Silme sırasında hata oluştu."); setLoading(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-xs font-medium text-[var(--admin-danger)] hover:text-white hover:bg-[var(--admin-danger)] rounded-md transition">
        Sil
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[var(--admin-text-primary)] mb-2">Firmayı Sil</h3>
            <p className="text-sm text-[var(--admin-text-secondary)] mb-1">
              <strong className="text-[var(--admin-text-primary)]">{companyName}</strong> firmasını silmek üzeresiniz.
            </p>
            <p className="text-sm text-[var(--admin-danger)] mb-5">
              Bu işlem geri alınamaz. Firmanın tüm yorumları, fotoğrafları ve mesajları silinecek.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setOpen(false)} disabled={loading}
                className="px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] transition">
                İptal
              </button>
              <button onClick={handleDelete} disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--admin-danger)] rounded-md hover:bg-[var(--admin-danger)]/90 transition disabled:opacity-50">
                {loading ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
