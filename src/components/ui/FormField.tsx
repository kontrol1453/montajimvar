import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /** Sub-text under the field — usually a description or hint */
  helperText?: string;
  /** When provided, the field is rendered in error state and message is shown */
  error?: string;
  /** Required marker; default true */
  required?: boolean;
  containerClassName?: string;
}

/**
 * Admin-friendly form field with label + helper + error in proper light-theme contrast.
 * Does not replace <Input /> — use this for new admin forms or when migrating.
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    {
      label,
      helperText,
      error,
      required,
      containerClassName,
      className,
      id,
      ...props
    },
    ref
  ) {
    const inputId =
      id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const describedBy = error
      ? `${inputId}-error`
      : helperText
        ? `${inputId}-helper`
        : undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--admin-text-primary)]"
        >
          {label}
          {required && (
            <span className="text-[var(--admin-danger)] ml-0.5" aria-hidden>
              *
            </span>
          )}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "block w-full h-10 px-3 rounded-md text-sm",
            "bg-white text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)]",
            "border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            "transition-colors",
            error
              ? "border-[var(--admin-danger)] focus-visible:ring-[var(--admin-danger)]"
              : "border-[var(--admin-border)] focus:border-[var(--admin-primary)] focus-visible:ring-[var(--admin-primary)]",
            className
          )}
          {...props}
        />
        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[var(--admin-danger)]"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--admin-text-secondary)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

export default FormField;
