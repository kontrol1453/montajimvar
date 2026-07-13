"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/admin/Dialog";
import Button from "@/components/ui/Button";

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
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-[var(--admin-danger)] hover:text-white hover:bg-[var(--admin-danger)]">
        Sil
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Firmayı Sil"
        description={
          <>
            <strong className="text-[var(--admin-text-primary)]">{companyName}</strong> firmasını silmek üzeresiniz.
          </>
        }
        size="sm"
        actions={[
          { label: "İptal", onClick: () => setOpen(false), variant: "ghost", disabled: loading },
          { label: loading ? "Siliniyor..." : "Evet, Sil", onClick: handleDelete, variant: "danger", disabled: loading },
        ]}
      >
        <p className="text-sm text-[var(--admin-danger)]">
          Bu işlem geri alınamaz. Firmanın tüm yorumları, fotoğrafları ve mesajları silinecek.
        </p>
      </Dialog>
    </>
  );
}
