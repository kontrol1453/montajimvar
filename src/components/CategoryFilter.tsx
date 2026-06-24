"use client";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedSlugs: string[];
  onToggle?: (slug: string) => void;
}

export default function CategoryFilter({ categories, selectedSlugs, onToggle }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
      {categories.map((cat) => {
        const checked = selectedSlugs.includes(cat.slug);
        return (
          <label
            key={cat.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition ${
              checked
                ? "bg-accent/20 border-accent text-white"
                : "border-dark-border bg-dark-bg text-gray-300 hover:border-accent/50"
            }`}
          >
            <input
              type="checkbox"
              name="kategoriler"
              value={cat.slug}
              checked={checked}
              onChange={() => onToggle?.(cat.slug)}
              className="sr-only"
            />
            <span>{cat.name}</span>
          </label>
        );
      })}
    </div>
  );
}
