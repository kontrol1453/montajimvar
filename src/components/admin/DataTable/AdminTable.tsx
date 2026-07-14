"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";

export interface TableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  /** Optional hidden breakpoint class (e.g. "hidden md:table-cell") */
  hidden?: "sm" | "md" | "lg" | "xl";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Optional sticky classes */
  className?: string;
  /** Optional unique key for column visibility toggle (defaults to header) */
  key?: string;
}

interface AdminTableProps<T> {
  rows: T[];
  columns: TableColumn<T>[];
  keyField: (row: T) => string | number;
  /** Empty state shown when rows.length === 0 */
  emptyState?: ReactNode;
  /** Optional loading skeleton — renders over the table area */
  loading?: boolean;
  /** Card-like wrapper styling; default true */
  bordered?: boolean;
  /** Action column on right side (renders as last column, sticky optional) */
  actions?: (row: T) => ReactNode;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Enable column visibility toggle; default true */
  columnVisibility?: boolean;
  className?: string;
}

const hiddenMap = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

function ColumnVisibilityDropdown<T extends Record<string, any>>({
  columns,
  visibleColumns,
  onToggle,
}: {
  columns: TableColumn<T>[];
  visibleColumns: Set<string>;
  onToggle: (key: string) => void;
}) {
  const toggleable = columns.filter((c) => c.key || c.header);
  if (toggleable.length <= 1) return null;

  return (
    <div className="relative inline-block">
      <button
        className="px-3 py-1.5 text-xs text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] flex items-center gap-1.5 border border-[var(--admin-border)] rounded-lg hover:bg-[var(--admin-surface-muted)] transition-colors"
        aria-label="Sütun görünürlüğü"
      >
        <Eye size={14} />
        <span>Sütunlar</span>
        <ChevronDown size={12} />
      </button>
      <div className="absolute right-0 top-full mt-1 z-10 min-w-[180px] bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-lg shadow-lg overflow-hidden">
        {toggleable.map((col) => {
          const k = col.key || col.header;
          const isVisible = visibleColumns.has(k);
          return (
            <label
              key={k}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--admin-surface-muted)] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => onToggle(k)}
                className="rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
              />
              <span className="text-sm text-[var(--admin-text-primary)]">{col.header}</span>
              {isVisible && <Eye size={12} className="text-[var(--admin-success)] ml-auto" />}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminTable<T extends Record<string, any>>({
  rows,
  columns,
  keyField,
  emptyState,
  bordered = true,
  actions,
  onRowClick,
  columnVisibility = true,
  className,
}: AdminTableProps<T>) {
  const hasActions = !!actions;

  const getColKey = (col: TableColumn<T>) => col.key || col.header;
  const defaultVisible = new Set(columns.map(getColKey));
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(defaultVisible);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const visibleCols = columns.filter((c) => visibleColumns.has(getColKey(c)));

  return (
    <div
      className={cn(
        bordered &&
          "bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] overflow-hidden",
        className
      )}
    >
      {columnVisibility && visibleCols.length > 1 && (
        <div className="p-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
          <ColumnVisibilityDropdown columns={columns} visibleColumns={visibleColumns} onToggle={toggleColumn} />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
              {visibleCols.map((col, i) => (
                <th
                  key={`col-${i}`}
                  scope="col"
                  className={cn(
                    "p-3 sm:p-4 text-[var(--admin-text-secondary)] font-medium",
                    col.hidden && hiddenMap[col.hidden],
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.align === undefined && col.align !== "left" && "text-left",
                    col.align === undefined && !col.align && "text-left",
                    !col.align ? "text-left" : undefined,
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th
                  scope="col"
                  className="p-3 sm:p-4 text-right text-[var(--admin-text-secondary)] font-medium"
                >
                  İşlem
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleCols.length + (hasActions ? 1 : 0)}
                  className="p-8"
                >
                  <EmptyState
                    title="Veri bulunamadı"
                    description={typeof emptyState === "string" ? emptyState : "Listelenecek hiçbir kayıt yok."}
                  />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={keyField(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "hover:bg-[var(--admin-surface-muted)] transition",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {visibleCols.map((col, i) => (
                    <td
                      key={`cell-${i}`}
                      className={cn(
                        "p-3 sm:p-4 text-[var(--admin-text-primary)]",
                        col.hidden && hiddenMap[col.hidden],
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        !col.align ? "text-left" : undefined,
                        col.className
                      )}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-3 sm:p-4 text-right">
                      {actions!(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}