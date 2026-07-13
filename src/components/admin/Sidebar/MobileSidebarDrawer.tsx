"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebarDrawer({ open, onClose }: MobileSidebarDrawerProps) {
  // ESC to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Admin menüsü"
    >
      <button
        type="button"
        aria-label="Menüyü kapat"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 shadow-2xl">
        <div className="relative h-full">
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="absolute top-3 right-3 z-10 p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
          <AdminSidebar variant="drawer" onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
