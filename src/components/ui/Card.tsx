import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** If false, removes default p-6 padding */
  padding?: boolean | "sm" | "md" | "lg";
  /** When true, removes top/bottom border-radius for full-width sections */
  flush?: boolean;
}

const paddingMap = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
} as const;

export default function Card({
  children,
  className,
  padding = true,
  flush = false,
  ...rest
}: CardProps) {
  const paddingClass =
    padding === true
      ? "p-6"
      : padding === false
        ? ""
        : paddingMap[padding];
  return (
    <div
      className={cn(
        "bg-[var(--admin-surface)] border border-[var(--admin-border)] shadow-sm",
        flush ? "" : "rounded-lg",
        paddingClass,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
