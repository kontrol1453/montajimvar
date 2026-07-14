"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  /** Use client-side callback */
  onPageChange?: (page: number) => void;
  /** Use server-side Link navigation (pass the base path, e.g. "/admin/kullanicilar") */
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  function renderPageBtn(page: number) {
    const isCurrent = page === currentPage;
    const shared = cn(
      "min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center",
      isCurrent
        ? "bg-[var(--admin-primary)] text-white"
        : "text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
    );

    if (basePath && !isCurrent) {
      return (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          aria-label={`Sayfa ${page}`}
          className={shared}
        >
          {page}
        </Link>
      );
    }
    return (
      <button
        key={page}
        type="button"
        onClick={() => onPageChange?.(page)}
        disabled={isCurrent}
        aria-current={isCurrent ? "page" : undefined}
        aria-label={`Sayfa ${page}`}
        className={shared}
      >
        {page}
      </button>
    );
  }

  function renderNavBtn(direction: "prev" | "next") {
    const isPrev = direction === "prev";
    const page = isPrev ? currentPage - 1 : currentPage + 1;
    const disabled = isPrev ? currentPage <= 1 : currentPage >= totalPages;
    const label = isPrev ? "Önceki sayfa" : "Sonraki sayfa";
    const Icon = isPrev ? ChevronLeft : ChevronRight;

    if (basePath && !disabled) {
      return (
        <Link
          href={`${basePath}?page=${page}`}
          aria-label={label}
          className="p-2 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] transition-colors inline-flex items-center"
        >
          <Icon size={16} aria-hidden />
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => onPageChange?.(page)}
        disabled={disabled}
        aria-label={label}
        className="p-2 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Icon size={16} aria-hidden />
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
      <p className="text-xs text-[var(--admin-text-muted)]">
        {startItem}-{endItem} / {totalItems} kayıt
      </p>
      <nav aria-label="Sayfalama" className="flex items-center gap-1">
        {renderNavBtn("prev")}
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-xs text-[var(--admin-text-muted)]">
              ...
            </span>
          ) : (
            renderPageBtn(page)
          )
        )}
        {renderNavBtn("next")}
      </nav>
    </div>
  );
}
