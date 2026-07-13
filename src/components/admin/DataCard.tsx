import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DataCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  href?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  onClick?: () => void;
}

const ACCENT_MAP: Record<string, string> = {
  default: "border-[var(--admin-border)]",
  success: "border-l-[var(--admin-success)]",
  warning: "border-l-[var(--admin-warning)]",
  danger: "border-l-[var(--admin-danger)]",
  info: "border-l-[var(--admin-info)]",
};

const ICON_BG: Record<string, string> = {
  default: "bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]",
  success: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
  warning: "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
  danger: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
  info: "bg-[var(--admin-info-soft)] text-[var(--admin-info)]",
};

function DataCardInner({
  label,
  value,
  icon,
  description,
  variant = "default",
  className,
}: DataCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border border-l-4 bg-[var(--admin-surface)] hover:shadow-sm transition-shadow",
        ACCENT_MAP[variant],
        className
      )}
    >
      {icon && (
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", ICON_BG[variant])}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--admin-text-secondary)] truncate">{label}</p>
        <p className="text-xl font-bold text-[var(--admin-text-primary)] mt-0.5">{value}</p>
        {description && (
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function DataCard(props: DataCardProps) {
  if (props.href) {
    return (
      <Link href={props.href} className="block">
        <DataCardInner {...props} />
      </Link>
    );
  }

  if (props.onClick) {
    return (
      <button type="button" onClick={props.onClick} className="block w-full text-left">
        <DataCardInner {...props} />
      </button>
    );
  }

  return <DataCardInner {...props} />;
}
