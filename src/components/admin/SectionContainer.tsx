"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";

/* ─── Error Boundary ─── */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SectionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[SectionErrorBoundary] ${this.props.section ?? "unknown"}:`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <SectionError
          message={this.props.section ? `${this.props.section} yüklenirken hata oluştu.` : "Bir hata oluştu."}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}

/* ─── Section Error ─── */

interface SectionErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function SectionError({ message, onRetry, className }: SectionErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)]",
        className
      )}
      role="alert"
    >
      <AlertCircle size={24} className="text-[var(--admin-danger)] mb-2" aria-hidden />
      <p className="text-sm font-medium text-[var(--admin-danger)] mb-3">
        {message ?? "Bir hata oluştu."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--admin-danger)] text-white hover:bg-red-600 transition-colors"
        >
          <RefreshCw size={12} aria-hidden />
          Tekrar Dene
        </button>
      )}
    </div>
  );
}

/* ─── Section Loading ─── */

interface SectionSkeletonProps {
  className?: string;
  variant?: "card" | "list" | "metric";
  count?: number;
}

function SectionSkeleton({ className, variant = "card", count = 3 }: SectionSkeletonProps) {
  const items = Array.from({ length: count });
  return (
    <div className={cn("space-y-3", className)} aria-label="Yükleniyor..." role="status">
      {variant === "metric" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-[var(--admin-border)] p-4">
              <div className="h-3 w-16 bg-[var(--admin-surface-muted)] rounded mb-2" />
              <div className="h-6 w-12 bg-[var(--admin-surface-muted)] rounded" />
            </div>
          ))}
        </div>
      ) : variant === "list" ? (
        <div className="rounded-lg border border-[var(--admin-border)] divide-y divide-[var(--admin-border)]">
          {items.map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-4">
              <div className="h-8 w-8 rounded-full bg-[var(--admin-surface-muted)]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-[var(--admin-surface-muted)] rounded" />
                <div className="h-2 w-1/2 bg-[var(--admin-surface-muted)] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-[var(--admin-border)] p-4">
              <div className="h-4 w-20 bg-[var(--admin-surface-muted)] rounded mb-2" />
              <div className="h-6 w-32 bg-[var(--admin-surface-muted)] rounded mb-2" />
              <div className="h-3 w-24 bg-[var(--admin-surface-muted)] rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Section Empty ─── */

interface SectionEmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

function SectionEmpty({ title, description, className }: SectionEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]",
        className
      )}
    >
      <p className="text-sm font-medium text-[var(--admin-text-secondary)]">
        {title ?? "Henüz veri yok."}
      </p>
      {description && (
        <p className="text-xs text-[var(--admin-text-muted)] mt-1">{description}</p>
      )}
    </div>
  );
}

/* ─── Section Container ─── */

interface SectionContainerProps {
  children: ReactNode;
  title?: string;
  className?: string;
  error?: string | null;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
}

export default function SectionContainer({
  children,
  title,
  className,
  error,
  loading,
  empty,
  emptyTitle,
  emptyDescription,
  onRetry,
}: SectionContainerProps) {
  if (error) {
    return <SectionError message={error} onRetry={onRetry} className={className} />;
  }

  if (loading) {
    return <SectionSkeleton className={className} />;
  }

  if (empty) {
    return <SectionEmpty title={emptyTitle} description={emptyDescription} className={className} />;
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)] mb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export { SectionErrorBoundary, SectionError, SectionSkeleton, SectionEmpty };
