import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  /** Optional hidden breakpoint class (e.g. "hidden md:table-cell") */
  hidden?: "sm" | "md" | "lg" | "xl";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Optional sticky classes */
  className?: string;
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
  className?: string;
}

const hiddenMap = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

export default function AdminTable<T extends Record<string, any>>({
  rows,
  columns,
  keyField,
  emptyState,
  bordered = true,
  actions,
  onRowClick,
  className,
}: AdminTableProps<T>) {
  const hasActions = !!actions;

  return (
    <div
      className={cn(
        bordered &&
          "bg-[var(--admin-surface)] rounded-lg border border-[var(--admin-border)] overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
              {columns.map((col, i) => (
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
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="p-8 text-center text-[var(--admin-text-muted)]"
                >
                  {emptyState ?? "Henüz veri yok."}
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
                  {columns.map((col, i) => (
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