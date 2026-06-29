"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  parentId: number | null;
  isActive: boolean;
  children?: Category[];
}

interface Props {
  data: { categoryIds: number[] };
  updateData: (partial: { categoryIds: number[] }) => void;
  onNext: () => void;
}

export default function StepCategory({ data, updateData, onNext }: Props) {
  const [parents, setParents] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed");
        const cats = await res.json();
        if (Array.isArray(cats)) {
          setParents(
            cats.filter(
              (c: Category) => c.parentId === null && c.isActive !== false
            )
          );
        }
      } catch {
        // Try search endpoint as fallback
        try {
          const res = await fetch("/api/categories/search?q=a");
          const cats = await res.json();
          if (Array.isArray(cats)) setParents(cats);
        } catch {
          // silent
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleCategory = (id: number) => {
    updateData({
      categoryIds: data.categoryIds.includes(id)
        ? data.categoryIds.filter((c) => c !== id)
        : [...data.categoryIds, id],
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-montaj border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sub-text">Kategoriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">
          Kategori Seçin
        </h2>
        <p className="text-sub-text text-sm">
          İşinize en uygun kategorileri seçin
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {parents.map((parent) => {
          const hasSelectedChild = parent.children?.some((c) =>
            data.categoryIds.includes(c.id)
          );
          return (
            <button
              key={parent.id}
              onClick={() =>
                setSelectedParent(
                  selectedParent === parent.id ? null : parent.id
                )
              }
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedParent === parent.id
                  ? "bg-montaj/20 border-montaj/30 text-montaj"
                  : hasSelectedChild
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-dark-card border-white/[0.06] text-muted-text hover:border-montaj/20 hover:bg-dark-section"
              }`}
            >
              <div className="text-2xl mb-1">{parent.icon || "🔧"}</div>
              <div className="text-sm font-medium leading-tight">
                {parent.name}
              </div>
            </button>
          );
        })}
      </div>

      {selectedParent && (
        <div className="mt-4 p-4 rounded-xl bg-dark-section border border-white/[0.06]">
          <h3 className="text-sm font-medium text-muted-text mb-3">
            {parents.find((p) => p.id === selectedParent)?.name} — Alt
            Kategoriler
          </h3>
          <div className="flex flex-wrap gap-2">
            {(
              parents.find((p) => p.id === selectedParent)?.children || []
            ).map((child) => {
              const isSelected = data.categoryIds.includes(child.id);
              return (
                <button
                  key={child.id}
                  onClick={() => toggleCategory(child.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    isSelected
                      ? "bg-montaj text-white border-montaj"
                      : "bg-dark-card text-muted-text border-white/[0.06] hover:border-montaj/30 hover:text-white"
                  }`}
                >
                  {child.icon && (
                    <span className="mr-1.5">{child.icon}</span>
                  )}
                  {child.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {data.categoryIds.length > 0 && (
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
          <p className="text-sm text-green-400 mb-2">
            Seçilen kategoriler ({data.categoryIds.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {data.categoryIds.map((id) => {
              const cat = parents
                .flatMap((p) => [p, ...(p.children || [])])
                .find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm"
                >
                  {cat?.icon && <span>{cat.icon}</span>}
                  {cat?.name || id}
                  <button
                    onClick={() => toggleCategory(id)}
                    className="ml-1 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          size="lg"
          disabled={data.categoryIds.length === 0}
          onClick={onNext}
        >
          Devam
        </Button>
      </div>
    </div>
  );
}
