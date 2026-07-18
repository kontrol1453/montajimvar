import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
}

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
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && (
            <span className="text-[var(--color-danger)] ml-0.5" aria-hidden>*</span>
          )}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn("form-input", error && "error", className)}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="form-error">{error}</p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="form-help">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

export default FormField;
