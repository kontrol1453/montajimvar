import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  /** Number of skeleton rows/lines */
  count?: number;
  /** Optional variant */
  variant?: "text" | "card" | "table-row" | "page";
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--admin-surface-muted)]", className)}
      aria-hidden
    />
  );
}

export default function LoadingSkeleton({
  className,
  count = 1,
  variant = "text",
}: LoadingSkeletonProps) {
  if (variant === "page") {
    return (
      <div className={cn("space-y-6 p-6", className)} aria-label="Yükleniyor..." role="status">
        <div className="space-y-2">
          <SkeletonLine className="h-7 w-48" />
          <SkeletonLine className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-[var(--admin-border)] p-4 space-y-3">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[var(--admin-border)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--admin-border)] last:border-b-0">
              <SkeletonLine className="h-4 w-8" />
              <SkeletonLine className="h-4 flex-1" />
              <SkeletonLine className="h-4 w-20" />
              <SkeletonLine className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)} aria-label="Yükleniyor..." role="status">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--admin-border)] p-4 space-y-3"
          >
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="h-6 w-1/4" />
            <SkeletonLine className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={cn("", className)} aria-label="Yükleniyor..." role="status">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--admin-border)]"
          >
            <SkeletonLine className="h-4 w-8 shrink-0" />
            <SkeletonLine className="h-4 flex-1" />
            <SkeletonLine className="h-4 w-24 shrink-0 hidden sm:block" />
            <SkeletonLine className="h-4 w-16 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} aria-label="Yükleniyor..." role="status">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
