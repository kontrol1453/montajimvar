"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, Users, Building2, Briefcase, X, Loader2 } from "lucide-react";

interface SearchResult {
  users: { id: number; name: string; email: string; roles: string[] }[];
  profiles: { id: number; companyName: string; city: string | null; user: { name: string } }[];
  jobs: { id: number; title: string; status: string; city: string; customer: { name: string } }[];
}

interface AdminSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSearchModal({ open, onClose }: AdminSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allLinks: { href: string; label: string; subtitle: string; group: string }[] = [];
  if (results) {
    results.users.forEach((u) => allLinks.push({ href: `/admin/kullanicilar/${u.id}`, label: u.name, subtitle: u.email, group: "Kullanıcılar" }));
    results.profiles.forEach((p) => allLinks.push({ href: `/admin/firmalar/${p.id}`, label: p.companyName, subtitle: `${p.city ?? ""} · ${p.user.name}`, group: "Firmalar" }));
    results.jobs.forEach((j) => allLinks.push({ href: `/admin/isler/${j.id}`, label: j.title, subtitle: `${j.customer.name} · ${j.city} · ${j.status}`, group: "İşler" }));
  }

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults(null);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, allLinks.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && allLinks[selectedIndex]) {
        window.location.href = allLinks[selectedIndex].href;
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, selectedIndex, allLinks, onClose]);

  const doSearch = useCallback((q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    fetch(`/api/admin/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setResults(d); setSelectedIndex(0); })
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, []);

  function onChange(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 250);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Admin arama">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--admin-border)]">
            <Search size={16} className="text-[var(--admin-text-muted)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Kullanıcı, firma veya iş ara..."
              className="flex-1 bg-transparent text-sm text-[var(--admin-text-primary)] placeholder:text-[var(--admin-text-muted)] outline-none"
            />
            {loading && <Loader2 size={14} className="animate-spin text-[var(--admin-text-muted)]" />}
            <button onClick={onClose} className="p-1 rounded-md hover:bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]">
              <X size={14} />
            </button>
          </div>

          {allLinks.length > 0 && (
            <div className="max-h-80 overflow-y-auto py-2">
              {["Kullanıcılar", "Firmalar", "İşler"].map((group) => {
                const items = allLinks.filter((l) => l.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--admin-text-muted)]">{group}</div>
                    {items.map((item, idx) => {
                      const globalIdx = allLinks.indexOf(item);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${globalIdx === selectedIndex ? "bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]" : "text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)]"}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${globalIdx === selectedIndex ? "bg-[var(--admin-primary)] text-white" : "bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)]"}`}>
                            {group === "Kullanıcılar" ? <Users size={12} /> : group === "Firmalar" ? <Building2 size={12} /> : <Briefcase size={12} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{item.label}</p>
                            <p className="text-xs text-[var(--admin-text-muted)] truncate">{item.subtitle}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {query.length >= 2 && !loading && allLinks.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--admin-text-muted)]">
              "{query}" için sonuç bulunamadı.
            </div>
          )}

          <div className="px-4 py-2 border-t border-[var(--admin-border)] text-[10px] text-[var(--admin-text-muted)] flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-[var(--admin-surface-muted)] border border-[var(--admin-border)] text-[10px]">↑↓</kbd> Gezin</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[var(--admin-surface-muted)] border border-[var(--admin-border)] text-[10px]">Enter</kbd> Seç</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[var(--admin-surface-muted)] border border-[var(--admin-border)] text-[10px]">Esc</kbd> Kapat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
