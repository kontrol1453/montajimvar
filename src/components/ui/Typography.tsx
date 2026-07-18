import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  description?: ReactNode;
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
          className={cn("h3", className)}
          {...rest}
        >
          {children}
        </h1>
        {description && (
          <p className="body-small mt-1">{description}</p>
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
          className={cn("h4", className)}
          {...rest}
        >
          {children}
        </h2>
        {description && (
          <p className="body-small mt-0.5">{description}</p>
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
