import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: boolean | "sm" | "md" | "lg";
  flush?: boolean;
  variant?: "default" | "elevated" | "flat" | "dark";
}

const cardVariants = {
  default: "card",
  elevated: "card-elevated",
  flat: "card-flat",
  dark: "card-dark",
};

const paddingMap = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
} as const;

export default function Card({
  children,
  className,
  padding = true,
  flush = false,
  variant = "default",
  ...rest
}: CardProps) {
  const paddingClass =
    padding === true
      ? "p-6"
      : padding === false
        ? ""
        : paddingMap[padding];
  return (
    <div
      className={cn(
        cardVariants[variant],
        flush ? "" : "",
        paddingClass,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
