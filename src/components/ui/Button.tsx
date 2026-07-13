import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "premium";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Render as inline-flex link button if href/anchor is needed — wrap child component instead */
  /** Optional icon node on the leading side */
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--admin-primary)] text-white hover:bg-[var(--admin-primary-strong)] focus-visible:ring-[var(--admin-primary)]",
  secondary:
    "bg-white text-[var(--admin-text-primary)] border border-[var(--admin-border)] hover:bg-[var(--admin-surface-muted)] focus-visible:ring-[var(--admin-primary)]",
  outline:
    "bg-transparent text-[var(--admin-primary)] border border-[var(--admin-primary)] hover:bg-[var(--admin-primary-soft)] focus-visible:ring-[var(--admin-primary)]",
  ghost:
    "bg-transparent text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-text-primary)] focus-visible:ring-[var(--admin-primary)]",
  danger:
    "bg-[var(--admin-danger)] text-white hover:opacity-90 focus-visible:ring-[var(--admin-danger)]",
  premium:
    "bg-[var(--admin-premium-soft)] text-[var(--admin-premium)] border border-[var(--admin-premium)]/20 hover:bg-[var(--admin-premium-soft)]/80 focus-visible:ring-[var(--admin-premium)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-base gap-2",
  icon: "h-9 w-9 p-0",
};

const base =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading,
    className,
    disabled,
    leadingIcon,
    trailingIcon,
    type,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={4}
            className="opacity-25"
          />
          <path
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            fill="currentColor"
            className="opacity-75"
          />
        </svg>
      ) : (
        leadingIcon
      )}
      {size !== "icon" && children}
      {trailingIcon && !loading && size !== "icon" && (
        <span className="shrink-0" aria-hidden>
          {trailingIcon}
        </span>
      )}
    </button>
  );
});

export default Button;
