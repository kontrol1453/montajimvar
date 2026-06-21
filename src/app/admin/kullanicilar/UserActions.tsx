"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserActions({
  userId,
  userName,
}: {
  userId: number;
  userName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

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
        router.refresh();
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

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
    >
      {deleting ? "Siliniyor..." : "Sil"}
    </button>
  );
}
