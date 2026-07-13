"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "ghost";
  disabled?: boolean;
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: DialogAction[];
  size?: "sm" | "md" | "lg";
}

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  size = "md",
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: "var(--admin-z-overlay)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="fixed inset-0 bg-black/60"
        style={{ zIndex: "var(--admin-z-overlay)" }}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-xl",
          sizeClass
        )}
        style={{ zIndex: "var(--admin-z-modal)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--admin-text-primary)] truncate">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-[var(--admin-text-secondary)] mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-1 rounded-md text-[var(--admin-text-muted)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)] transition-colors ml-3 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {children && <div className="px-5 py-4">{children}</div>}

        {actions && actions.length > 0 && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--admin-border)] bg-[var(--admin-surface-muted)] rounded-b-lg">
            {actions.map((action, i) => (
              <button
                key={`${action.label}-${i}`}
                type="button"
                disabled={action.disabled}
                onClick={action.onClick}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-surface)] disabled:opacity-50",
                  action.variant === "danger" &&
                    "bg-[var(--admin-danger)] text-white hover:bg-red-600",
                  action.variant === "ghost" &&
                    "text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)]",
                  (!action.variant || action.variant === "primary") &&
                    "bg-[var(--admin-primary)] text-white hover:bg-[var(--admin-primary-hover)]"
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
