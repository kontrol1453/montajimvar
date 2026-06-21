import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-dark-card rounded-xl border border-dark-border",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
