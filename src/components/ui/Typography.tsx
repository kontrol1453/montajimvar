import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  /** Description rendered below the title */
  description?: ReactNode;
  /** Action area on the right (button group / toolbar) */
  actions?: ReactNode;
}

export function PageTitle({
  children,
  description,
  actions,
  className,
  ...rest
}: PageTitleProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1
          className={cn(
            "text-2xl font-semibold tracking-tight text-[var(--admin-text-primary)]",
            className
          )}
          {...rest}
        >
          {children}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--admin-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function SectionTitle({
  children,
  description,
  actions,
  className,
  ...rest
}: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h2
          className={cn(
            "text-lg font-semibold text-[var(--admin-text-primary)]",
            className
          )}
          {...rest}
        >
          {children}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--admin-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

export function PageContainer({
  children,
  className,
  size = "lg",
  ...rest
}: HTMLAttributes<HTMLDivElement> & { size?: "md" | "lg" | "full" }) {
  const widths = {
    md: "max-w-5xl",
    lg: "max-w-7xl",
    full: "max-w-none",
  } as const;
  return (
    <div
      className={cn(
        "mx-auto w-full admin-content",
        "py-6 sm:py-8",
        widths[size],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Stack({
  children,
  size = "md",
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }) {
  const gap = size === "sm" ? "gap-3" : size === "lg" ? "gap-8" : "gap-6";
  return (
    <div className={cn("flex flex-col", gap, className)} {...rest}>
      {children}
    </div>
  );
}
