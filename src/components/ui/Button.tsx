import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "premium";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
  premium: "btn-premium",
};

const sizes: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
  icon: "h-9 w-9 p-0",
};

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
      className={cn("btn", variants[variant], sizes[size], className)}
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
