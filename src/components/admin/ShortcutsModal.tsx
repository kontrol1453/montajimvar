"use client";

import { useEffect } from "react";
import { X, Command, ChevronRight, Search, HelpCircle, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Copy, AlertTriangle } from "lucide-react";

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { category: "Genel", items: [
    { keys: ["⌘", "K"], desc: "Global arama aç/kapat" },
    { keys: ["⇧", "?"], desc: "Klavye kısayolları yardımı" },
    { keys: ["Esc"], desc: "Açık modal/panel kapat" },
  ]},
  { category: "Navigasyon", items: [
    { keys: ["Tab"], desc: "Sonraki odağa geç" },
    { keys: ["⇧", "Tab"], desc: "Önceki odağa geç" },
    { keys: ["↑", "↓"], desc: "Arama/listede gezin" },
    { keys: ["Enter"], desc: "Seçimi onayla / detaya git" },
  ]},
  { category: "Arama Modalı", items: [
    { keys: ["↑", "↓"], desc: "Sonuçlar arasında gezin" },
    { keys: ["Enter"], desc: "Seçili sonuca git" },
    { keys: ["Esc"], desc: "Arama kapat" },
  ]},
  { category: "Kopyalama", items: [
    { keys: ["Tıkla"], desc: "ID/Email/Telefon butonuna tıkla → panoya kopyalar" },
  ]},
];

export default function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Klavye kısayolları">
      <div className="bg-[var(--admin-surface)] rounded-xl border border-[var(--admin-border)] shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
          <h2 className="text-base font-semibold text-[var(--admin-text-primary)] flex items-center gap-2">
            <HelpCircle size={16} className="text-[var(--admin-primary)]" />
            Klavye Kısayolları
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)] transition-colors" aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6">
          {SHORTCUTS.map((cat, ci) => (
            <div key={ci} className="space-y-3">
              <h3 className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">{cat.category}</h3>
              <div className="space-y-2">
                {cat.items.map((item, ii) => (
                  <div key={ii} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--admin-text-secondary)]">{item.desc}</span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-4">
                      {item.keys.map((k, ki) => (
                        <kbd key={ki} className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-mono text-[var(--admin-text-primary)] bg-[var(--admin-surface-muted)] border border-[var(--admin-border)] rounded min-w-[24px]">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[var(--admin-border)] bg-[var(--admin-surface-muted)] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-[var(--admin-primary)] rounded-lg hover:opacity-90 transition-opacity">
            Anlaşıldı
          </button>
        </div>
      </div>
    </div>
  );
}