import Link from "next/link";
import { cn } from "@/lib/utils";
import { Users, Building2, Briefcase, AlertTriangle, FileText, type LucideIcon } from "lucide-react";

type EntityType = "user" | "company" | "job" | "dispute" | "review";

interface EntityLinkProps {
  type: EntityType;
  id: number;
  label: string;
  secondaryLabel?: string;
  className?: string;
}

const ICON_MAP: Record<EntityType, LucideIcon> = {
  user: Users,
  company: Building2,
  job: Briefcase,
  dispute: AlertTriangle,
  review: FileText,
};

const HREF_MAP: Record<EntityType, (_id: number) => string> = {
  user: (id) => `/admin/kullanicilar/${id}`,
  company: (id) => `/admin/firmalar/${id}`,
  job: (id) => `/admin/isler/${id}`,
  dispute: (_id) => `/admin/anlasmazliklar`,
  review: (_id) => `/admin/yorumlar`,
};

const LABEL_MAP: Record<EntityType, string> = {
  user: "Kullanıcı",
  company: "Firma",
  job: "İş",
  dispute: "Anlaşmazlık",
  review: "Yorum",
};

export default function EntityLink({
  type,
  id,
  label,
  secondaryLabel,
  className,
}: EntityLinkProps) {
  const Icon = ICON_MAP[type];
  const href = HREF_MAP[type](id);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-primary)] hover:bg-[var(--admin-primary-soft)] transition-colors group min-w-0",
        className
      )}
    >
      <Icon
        size={14}
        className="shrink-0 text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)]"
        aria-hidden
      />
      <span className="min-w-0">
        <span className="text-sm font-medium text-[var(--admin-text-primary)] group-hover:text-[var(--admin-primary)] truncate block">
          {label}
        </span>
        {secondaryLabel && (
          <span className="text-[10px] text-[var(--admin-text-muted)] truncate block leading-tight">
            {secondaryLabel}
          </span>
        )}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] shrink-0">
        {LABEL_MAP[type]}
      </span>
    </Link>
  );
}
