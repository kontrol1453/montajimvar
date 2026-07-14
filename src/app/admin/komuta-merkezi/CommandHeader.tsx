"use client";

import { useEffect, useState } from "react";

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  return `${hours} saat önce`;
}

export default function CommandHeader() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--admin-text-primary)] tracking-tight">
          Komuta Merkezi
        </h1>
        <p className="text-sm text-[var(--admin-text-secondary)] mt-1">
          Platform operasyonlarını, bekleyen işlemleri ve kritik durumları tek noktadan yönetin.
        </p>
      </div>
      {mounted && (
        <p className="text-[10px] text-[var(--admin-text-muted)] shrink-0">
          Son güncelleme: {formatRelative(new Date(now))}
        </p>
      )}
    </div>
  );
}
