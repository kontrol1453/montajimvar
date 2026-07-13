import { cn } from "@/lib/utils";

type EntityType = "user" | "profile" | "job" | "offer" | "payment" | "dispute" | "certificate";

type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "premium";

const VARIANT_CLASS: Record<StatusVariant, string> = {
  success: "bg-[var(--admin-success-soft)] text-[var(--admin-success)] border-[var(--admin-success)]/20",
  warning: "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)] border-[var(--admin-warning)]/20",
  danger: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] border-[var(--admin-danger)]/20",
  info: "bg-[var(--admin-info-soft)] text-[var(--admin-info)] border-[var(--admin-info)]/20",
  neutral: "bg-[var(--admin-neutral-soft)] text-[var(--admin-text-secondary)] border-[var(--admin-border)]",
  premium: "bg-[var(--admin-premium-soft)] text-[var(--admin-premium)] border-[var(--admin-premium)]/20",
};

const DOT_CLASS: Record<StatusVariant, string> = {
  success: "bg-[var(--admin-success)]",
  warning: "bg-[var(--admin-warning)]",
  danger: "bg-[var(--admin-danger)]",
  info: "bg-[var(--admin-info)]",
  neutral: "bg-[var(--admin-text-muted)]",
  premium: "bg-[var(--admin-premium)]",
};

interface EntityStatusProps {
  variant: StatusVariant;
  label: string;
  dot?: boolean;
  className?: string;
}

export default function EntityStatus({
  variant,
  label,
  dot = true,
  className,
}: EntityStatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        VARIANT_CLASS[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", DOT_CLASS[variant])}
          aria-hidden
        />
      )}
      {label}
    </span>
  );
}

const USER_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  premium: { variant: "premium", label: "Premium" },
  verified: { variant: "success", label: "Doğrulanmış" },
  unverified: { variant: "warning", label: "Doğrulanmamış" },
  suspended: { variant: "danger", label: "Askıda" },
  admin: { variant: "info", label: "Admin" },
};

const PROFILE_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  verified: { variant: "success", label: "Onaylı" },
  unverified: { variant: "warning", label: "Onay Bekliyor" },
  featured: { variant: "premium", label: "Vitrin" },
};

const JOB_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  pending: { variant: "warning", label: "Bekliyor" },
  offers_received: { variant: "info", label: "Teklif Alındı" },
  assigned: { variant: "success", label: "Atandı" },
  en_route: { variant: "neutral", label: "Yolda" },
  in_progress: { variant: "info", label: "Devam Ediyor" },
  completed: { variant: "success", label: "Tamamlandı" },
  review_pending: { variant: "warning", label: "Yorum Bekliyor" },
  cancelled: { variant: "danger", label: "İptal Edildi" },
};

const OFFER_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  pending: { variant: "warning", label: "Bekliyor" },
  accepted: { variant: "success", label: "Kabul Edildi" },
  rejected: { variant: "danger", label: "Reddedildi" },
  withdrawn: { variant: "neutral", label: "Geri Çekildi" },
};

const PAYMENT_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  escrow: { variant: "warning", label: "Blokede" },
  released: { variant: "success", label: "Serbest Bırakıldı" },
  refunded: { variant: "danger", label: "İade Edildi" },
  cancelled: { variant: "neutral", label: "İptal Edildi" },
};

const DISPUTE_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  open: { variant: "danger", label: "Açık" },
  resolved: { variant: "success", label: "Çözüldü" },
};

const CERTIFICATE_STATUS: Record<string, { variant: StatusVariant; label: string }> = {
  verified: { variant: "success", label: "Onaylı" },
  unverified: { variant: "warning", label: "Beklemede" },
};

export const STATUS_MAP = {
  user: USER_STATUS,
  profile: PROFILE_STATUS,
  job: JOB_STATUS,
  offer: OFFER_STATUS,
  payment: PAYMENT_STATUS,
  dispute: DISPUTE_STATUS,
  certificate: CERTIFICATE_STATUS,
} as const;

export function getStatusConfig(
  entityType: EntityType,
  statusKey: string
): { variant: StatusVariant; label: string } {
  const map = STATUS_MAP[entityType] as Record<string, { variant: StatusVariant; label: string }> | undefined;
  return map?.[statusKey] ?? { variant: "neutral", label: statusKey };
}
