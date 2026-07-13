import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminToolbarProps {
  children?: ReactNode;
  className?: string;
}

export default function AdminToolbar({
  children,
  className,
}: AdminToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Ara...",
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2 flex-1 sm:flex-[1_1_240px] sm:max-w-[320px]">
      <svg
        className="w-4 h-4 text-[var(--admin-text-muted)] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6"
        />
        <circle cx="11" cy="11" r="8" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="bg-transparent text-sm text-[var(--admin-text-primary)] focus:outline-none flex-1 placeholder:text-[var(--admin-text-muted)]"
      />
    </div>
  );
}