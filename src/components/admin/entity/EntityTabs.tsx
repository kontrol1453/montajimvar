"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TabDef {
  id: string;
  label: string;
  count?: number;
}

interface EntityTabsProps {
  tabs: TabDef[];
  defaultTab?: string;
  paramName?: string;
  className?: string;
}

export default function EntityTabs({
  tabs,
  defaultTab,
  paramName = "tab",
  className,
}: EntityTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get(paramName) || defaultTab || tabs[0]?.id;

  const setTab = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, tabId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, paramName]
  );

  return (
    <div
      className={cn(
        "flex overflow-x-auto gap-0.5 border-b border-[var(--admin-border)] -mx-1 px-1",
        "scrollbar-none",
        className
      )}
      role="tablist"
      aria-label="Sayfa sekmeleri"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setTab(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--admin-primary)]",
              isActive
                ? "text-[var(--admin-primary)]"
                : "text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)] rounded-t-md"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "text-[11px] px-1.5 py-0.5 rounded-full font-medium",
                  isActive
                    ? "bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]"
                    : "bg-[var(--admin-surface-muted)] text-[var(--admin-text-muted)]"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--admin-primary)] rounded-full"
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
