import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  /** Label shown above the value */
  label: string;
  /** Primary numeric value */
  value: string | number;
  /** Optional icon node (SVG or lucide icon) */
  icon?: ReactNode;
  /** Optional trend indicator (e.g., "+12%") */
  trend?: ReactNode;
  /** Optional description text below value */
  description?: string;
  /** Optional href to make the card clickable */
  href?: string;
  /** Color variant for icon background */
  variant?: "blue" | "amber" | "cyan" | "yellow" | "purple" | "pink" | "emerald" | "orange";
  /** Optional className for the card wrapper */
  className?: string;
}

const variantMap: Record<NonNullable<StatCardProps["variant"]>, { bg: string; text: string }> = {
  blue: { bg: "bg-[var(--admin-primary-soft)]", text: "text-[var(--admin-primary)]" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  description,
  href,
  variant = "blue",
  className,
}: StatCardProps) {
  const { bg, text } = variantMap[variant];

  const card = (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-primary)] transition-colors",
        className
      )}
    >
      {icon && (
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", bg, text)}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[var(--admin-text-secondary)] truncate">{label}</p>
        <p className="text-2xl font-bold text-[var(--admin-text-primary)] mt-0.5">{value}</p>
        {description && (
          <p className="text-xs text-[var(--admin-text-muted)] mt-1">{description}</p>
        )}
      </div>
      {trend && (
        <div className="shrink-0">
          <div className="text-xs text-[var(--admin-text-secondary)]">{trend}</div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block"
      >
        {card}
      </a>
    );
  }

  return card;
}