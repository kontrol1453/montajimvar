"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { TURKISH_CITIES } from "@/lib/utils";
import CategoryFilter from "./CategoryFilter";
import { Search, X, ChevronDown } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
}

interface SearchFormProps {
  categories: Category[];
  initialSehir: string;
  initialQ: string;
  initialMinPuan: string;
  initialSiralama: string;
  initialSelectedSlugs: string[];
}

const RATING_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "4", label: "4+" },
  { value: "3", label: "3+" },
  { value: "2", label: "2+" },
];

export default function SearchForm({
  categories,
  initialSehir,
  initialQ,
  initialMinPuan,
  initialSiralama,
  initialSelectedSlugs,
}: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState(initialQ);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce text input for URL update
  useEffect(() => {
    if (searchText === initialQ) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchText) params.set("q", searchText);
      else params.delete("q");
      params.delete("sayfa");
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, initialQ]);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (searchText.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/categories/search?q=${encodeURIComponent(searchText)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateURL(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("sayfa");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleCategoryToggle(slug: string) {
    const current = initialSelectedSlugs;
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    updateURL({ kategoriler: updated.length > 0 ? updated.join(",") : undefined });
    setShowSuggestions(false);
  }

  function handleSuggestionClick(cat: Category) {
    const current = initialSelectedSlugs;
    const updated = current.includes(cat.slug)
      ? current.filter((s) => s !== cat.slug)
      : [...current, cat.slug];
    updateURL({ kategoriler: updated.join(",") });
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.blur();
  }

  // Active filter tags
  const activeTags = useMemo(() => {
    const tags: { key: string; label: string }[] = [];
    if (initialQ) tags.push({ key: "q", label: `"${initialQ}"` });
    if (initialSehir) tags.push({ key: "sehir", label: initialSehir });
    if (initialMinPuan) tags.push({ key: "minPuan", label: `${initialMinPuan}+ Puan` });
    for (const slug of initialSelectedSlugs) {
      const cat = categories.find((c) => c.slug === slug);
      if (cat) tags.push({ key: `cat-${slug}`, label: cat.name });
    }
    return tags;
  }, [initialQ, initialSehir, initialMinPuan, initialSelectedSlugs, categories]);

  function removeTag(key: string) {
    if (key.startsWith("cat-")) {
      const slug = key.slice(4);
      const updated = initialSelectedSlugs.filter((s) => s !== slug);
      updateURL({ kategoriler: updated.length > 0 ? updated.join(",") : undefined });
    } else {
      updateURL({ [key]: undefined });
    }
  }

  return (
    <div className="space-y-4" ref={inputRef}>
      {/* Desktop: Search with autocomplete + selects */}
      <div className="hidden md:flex flex-row gap-3 items-start">
        <div className="flex-1 relative">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]"
              size={16}
            />
            <input
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => searchText.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Hangi hizmeti arıyorsunuz?"
              className="w-full pl-10 pr-10 py-3 border border-[var(--color-border-default)] rounded-xl text-base bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
            {isLoadingSuggestions && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-[var(--color-border-light)] rounded-xl shadow-elevated overflow-hidden animate-fade-in">
              {suggestions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSuggestionClick(cat)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  <span className="text-lg">{cat.icon || "🔧"}</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{cat.name}</span>
                  <span className="ml-auto text-xs text-[var(--color-text-tertiary)]">Kategori</span>
                </button>
              ))}
              <div className="border-t border-[var(--color-border-light)] px-4 py-2 text-center text-xs text-[var(--color-text-tertiary)]">
                Enter ile arama yapın
              </div>
            </div>
          )}
        </div>

        <select
          value={initialSehir}
          onChange={(e) => updateURL({ sehir: e.target.value || undefined })}
          className="px-4 py-3 border border-[var(--color-border-default)] rounded-xl text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
        >
          <option value="">Tüm Şehirler</option>
          {TURKISH_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={initialMinPuan}
          onChange={(e) => updateURL({ minPuan: e.target.value || undefined })}
          className="px-4 py-3 border border-[var(--color-border-default)] rounded-xl text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={initialSiralama}
          onChange={(e) => updateURL({ siralama: e.target.value || undefined })}
          className="px-4 py-3 border border-[var(--color-border-default)] rounded-xl text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
        >
          <option value="en_yeni">En Yeni</option>
          <option value="en_eski">En Eski</option>
          <option value="puana_gore">Puana Göre</option>
        </select>
      </div>

      {/* Mobile: search input + filter toggle */}
      <div className="flex md:hidden flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]"
              size={16}
            />
            <input
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => searchText.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Hangi hizmeti arıyorsunuz?"
              className="w-full pl-10 pr-10 py-3 border border-[var(--color-border-default)] rounded-xl text-base bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
            {isLoadingSuggestions && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-[var(--color-border-light)] rounded-xl shadow-elevated overflow-hidden animate-fade-in">
                {suggestions.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSuggestionClick(cat)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-secondary)] transition-colors"
                  >
                    <span className="text-lg">{cat.icon || "🔧"}</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{cat.name}</span>
                    <span className="ml-auto text-xs text-[var(--color-text-tertiary)]">Kategori</span>
                  </button>
                ))}
                <div className="border-t border-[var(--color-border-light)] px-4 py-2 text-center text-xs text-[var(--color-text-tertiary)]">
                  Enter ile arama yapın
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`px-4 py-3 border rounded-xl text-sm transition flex items-center gap-2 ${
              mobileOpen
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border-default)]"
            }`}
          >
            <ChevronDown size={16} />
            Filtreler
          </button>
        </div>
        {mobileOpen && (
          <div className="flex flex-col gap-3 p-4 bg-white border border-[var(--color-border-light)] rounded-xl shadow-card">
            <select
              value={initialSehir}
              onChange={(e) => updateURL({ sehir: e.target.value || undefined })}
              className="px-4 py-3 border border-[var(--color-border-default)] rounded-xl text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
            >
              <option value="">Tüm Şehirler</option>
              {TURKISH_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={initialMinPuan}
              onChange={(e) => updateURL({ minPuan: e.target.value || undefined })}
              className="px-4 py-3 border border-[var(--color-border-default)] rounded-xl text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={initialSiralama}
              onChange={(e) => updateURL({ siralama: e.target.value || undefined })}
              className="px-4 py-3 border border-[var(--color-border-default)] rounded-xl text-sm bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] appearance-none"
            >
              <option value="en_yeni">En Yeni</option>
              <option value="en_eski">En Eski</option>
              <option value="puana_gore">Puana Göre</option>
            </select>
          </div>
        )}
      </div>

      {/* Active filter tags */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded-full text-sm text-[var(--color-primary)]"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => removeTag(tag.key)}
                className="hover:text-[var(--color-primary)] transition p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <Link
            href="/ara"
            className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition ml-1"
          >
            Temizle
          </Link>
        </div>
      )}

      {/* Categories */}
      <div>
        <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
          Kategoriler
        </p>
        <CategoryFilter
          categories={categories}
          selectedSlugs={initialSelectedSlugs}
          onToggle={handleCategoryToggle}
        />
      </div>
    </div>
  );
}