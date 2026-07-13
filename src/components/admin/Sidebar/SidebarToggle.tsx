"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseProps {
  className?: string;
}

export function MobileMenuTrigger({ className }: BaseProps) {
  return (
    <button
      type="button"
      data-admin-mobile-toggle
      aria-label="Menüyü aç"
      className={cn(
        "p-2 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        className
      )}
    >
      <Menu size={20} aria-hidden />
    </button>
  );
}

interface CollapseToggleProps extends BaseProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CollapseToggle({ collapsed, onToggle, className }: CollapseToggleProps) {
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const label = collapsed ? "Kenar çubuğunu genişlet" : "Kenar çubuğunu daralt";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={!collapsed}
      className={cn(
        "p-2 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        className
      )}
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}
