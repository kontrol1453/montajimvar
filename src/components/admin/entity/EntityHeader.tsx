import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EntityHeaderMeta {
  label: string;
  value: string | ReactNode;
}

interface EntityHeaderProps {
  /** Primary entity identifier — name, title, company name */
  title: string;
  /** Secondary identifier — email, ID, description */
  subtitle?: string;
  /** Avatar / logo / icon element */
  avatar?: ReactNode;
  /** Status badges or tags to display next to the title */
  badges?: ReactNode;
  /** Metadata lines shown below the title */
  meta?: EntityHeaderMeta[];
  /** Action buttons (edit, delete, approve, etc.) */
  actions?: ReactNode;
  /** Extra content rendered in the right column on desktop */
  extra?: ReactNode;
  className?: string;
}

export default function EntityHeader({
  title,
  subtitle,
  avatar,
  badges,
  meta,
  actions,
  extra,
  className,
}: EntityHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6",
        className
      )}
    >
      {avatar && (
        <div className="shrink-0 self-start">{avatar}</div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--admin-text-primary)] truncate">
            {title}
          </h1>
          {badges && (
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {badges}
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-sm text-[var(--admin-text-secondary)] mt-0.5 truncate">
            {subtitle}
          </p>
        )}

        {meta && meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[var(--admin-text-muted)]">
            {meta.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1">
                <span className="font-medium">{item.label}:</span>
                <span>{item.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:items-end gap-2 shrink-0">
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
        {extra && <div className="hidden sm:block">{extra}</div>}
      </div>
    </div>
  );
}
