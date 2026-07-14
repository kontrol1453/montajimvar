"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* fallback */ }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 text-xs transition-colors ${copied ? "text-[var(--admin-success)]" : "text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)]"} ${className}`}
      title={label ? `${label}: ${text}` : `Kopyala: ${text}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Kopyalandı" : label || text}
    </button>
  );
}
