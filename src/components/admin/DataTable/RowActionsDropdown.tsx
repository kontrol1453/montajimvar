"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionDef {
  label: string;
  onClick: () => void;
  /**
   * - "default" = neutral
   * - "danger"  = red text (e.g. delete)
   * - "premium" = amber
   */
  variant?: "default" | "danger" | "premium";
  icon?: typeof Edit;
}

interface RowActionsDropdownProps {
  items: ActionDef[];
  /** Label for the trigger button (sr) */
  label?: string;
  className?: string;
}

export default function RowActionsDropdown({
  items,
  label = "İşlemler",
  className,
}: RowActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className={cn("relative inline-block", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="p-1.5 rounded-md text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
      >
        <MoreHorizontal size={18} aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-48 bg-[var(--admin-surface)] rounded-md shadow-lg border border-[var(--admin-border)] py-1 z-50"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            const color =
              item.variant === "danger"
                ? "text-[var(--admin-danger)]"
                : item.variant === "premium"
                  ? "text-[var(--admin-premium)]"
                  : "text-[var(--admin-text-secondary)]";

            const hoverBg =
              item.variant === "danger"
                ? "hover:bg-[var(--admin-danger-soft)]"
                : "hover:bg-[var(--admin-surface-muted)]";

            return (
              <button
                key={`${item.label}-${i}`}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors",
                  color,
                  hoverBg
                )}
              >
                {Icon && <Icon size={16} aria-hidden />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}