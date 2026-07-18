import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "premium"
  /** @deprecated use "neutral" */
  | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "badge-neutral",
  default: "badge-neutral",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  premium: "badge-premium",
};

const sizes = {
  sm: "badge-sm",
  md: "badge-md",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn("badge", variants[variant], sizes[size], className)}
    >
      {children}
    </span>
  );
}
