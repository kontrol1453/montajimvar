"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { TURKISH_CITIES } from "@/lib/utils";
import CategoryFilter from "./CategoryFilter";

interface Category {
  id: number;
  name: string;
  slug: string;
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

  // Debounce text input — 300ms after user stops typing
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

  function updateURL(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("sayfa");
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleCategoryToggle = useCallback(
    (slug: string) => {
      const current = initialSelectedSlugs;
      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      updateURL({ kategoriler: updated.length > 0 ? updated.join(",") : undefined });
    },
    [initialSelectedSlugs]
  );

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
    <div className="space-y-4">
      {/* Desktop: inline input + selects */}
      <div className="hidden md:flex flex-row gap-3">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Firma adı, açıklama veya kategori ile ara..."
          className="flex-1 px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-gray-500"
        />
        <select
          value={initialSehir}
          onChange={(e) => updateURL({ sehir: e.target.value || undefined })}
          className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
        >
          <option value="">Tüm Şehirler</option>
          {TURKISH_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={initialMinPuan}
          onChange={(e) => updateURL({ minPuan: e.target.value || undefined })}
          className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={initialSiralama}
          onChange={(e) => updateURL({ siralama: e.target.value || undefined })}
          className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
        >
          <option value="en_yeni">En Yeni</option>
          <option value="en_eski">En Eski</option>
          <option value="puana_gore">Puana Göre</option>
        </select>
      </div>

      {/* Mobile: search input + filter toggle */}
      <div className="flex md:hidden flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Firma adı, açıklama veya kategori ile ara..."
            className="flex-1 px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white placeholder-gray-500"
          />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`px-3 py-2 border rounded-lg text-sm transition flex items-center gap-1 ${
              mobileOpen
                ? "bg-accent text-[#1a1d27] border-accent"
                : "bg-dark-bg text-gray-300 border-dark-border"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filtreler
          </button>
        </div>
        {mobileOpen && (
          <div className="flex flex-col gap-2 p-3 bg-dark-card border border-dark-border rounded-lg">
            <select
              value={initialSehir}
              onChange={(e) => updateURL({ sehir: e.target.value || undefined })}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
            >
              <option value="">Tüm Şehirler</option>
              {TURKISH_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={initialMinPuan}
              onChange={(e) => updateURL({ minPuan: e.target.value || undefined })}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={initialSiralama}
              onChange={(e) => updateURL({ siralama: e.target.value || undefined })}
              className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-bg text-white"
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
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => removeTag(tag.key)}
                className="hover:text-white transition ml-0.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <Link
            href="/ara"
            className="text-xs text-sub-text hover:text-white transition ml-1"
          >
            Temizle
          </Link>
        </div>
      )}

      {/* Categories */}
      <div>
        <p className="text-xs text-sub-text mb-2">Kategoriler</p>
        <CategoryFilter
          categories={categories}
          selectedSlugs={initialSelectedSlugs}
          onToggle={handleCategoryToggle}
        />
      </div>
    </div>
  );
}
