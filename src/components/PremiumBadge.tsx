import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  label?: string;
  color?: string;
  className?: string;
}

export default function PremiumBadge({ label = "Premium", color, className }: PremiumBadgeProps) {
  const colors: Record<string, string> = {
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const style = color && colors[color] ? colors[color] : "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        style,
        className
      )}
    >
      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {label}
    </span>
  );
}
