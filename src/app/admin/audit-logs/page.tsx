"use client";

import { useEffect, useState } from "react";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import Badge from "@/components/ui/Badge";
import { Search, Filter } from "lucide-react";
import Link from "next/link";

interface AuditLog {
  id: number;
  adminId: number;
  action: string;
  entity: string;
  entityId: number;
  details: string | null;
  ip: string | null;
  createdAt: string;
  admin: { name: string };
}

const ACTION_LABELS: Record<string, string> = {
  create: "Oluşturma",
  update: "Güncelleme",
  delete: "Silme",
  approve: "Onay",
  reject: "Red",
  suspend: "Askıya Al",
  role_change: "Rol Değişikliği",
  premium_change: "Premium Değişikliği",
  verify: "Doğrula",
  unverify: "Doğrulama Kaldır",
  resolve: "Çöz",
  cancel: "İptal",
  feature: "Öne Ekle",
  unfeature: "Önünden Kaldır",
};

const ENTITY_LABELS: Record<string, string> = {
  user: "Kullanıcı",
  profile: "Firma",
  job: "İş",
  offer: "Teklif",
  payment: "Ödeme",
  dispute: "Anlaşmazlık",
  certificate: "Sertifika",
  subscription_plan: "Abonelik Planı",
  role_permission: "Yetki",
  notification: "Bildirim",
  blog_category: "Blog Kategorisi",
  category: "Kategori",
  city_page: "Şehir Sayfası",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
          search,
          action: actionFilter,
          entity: entityFilter,
        });
        const res = await fetch(`/api/admin/audit-logs?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setLogs(data.logs);
            setTotal(data.total);
            setTotalPages(data.totalPages);
          }
        }
      } catch {
        // error
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, search, actionFilter, entityFilter]);

  const columns: TableColumn<AuditLog>[] = [
    { header: "ID", accessor: (r) => r.id, className: "text-right" },
    { header: "Yapılan İşlem", accessor: (r) => <Badge variant="info">{ACTION_LABELS[r.action] || r.action}</Badge> },
    { header: "Varlık", accessor: (r) => ENTITY_LABELS[r.entity] || r.entity },
    { header: "Varlık ID", accessor: (r) => `#${r.entityId}` },
    { header: "Yapılan", accessor: (r) => r.admin.name },
    { header: "IP", accessor: (r) => <span className="font-mono text-xs text-[var(--admin-text-muted)]">{r.ip || "—"}</span> },
    { header: "Detay", accessor: (r) => <span className="text-xs max-w-[200px] block truncate">{r.details || "—"}</span> },
    { header: "Tarih", accessor: (r) => new Date(r.createdAt).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href="/admin" className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)]">
            ← Admin Paneli
          </Link>
          <PageTitle>Denetim Kayıtları</PageTitle>
        </div>
        <span className="text-sm text-[var(--admin-text-secondary)]">Toplam: {total} kayıt</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2">
          <Search size={16} className="text-[var(--admin-text-muted)]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ara..."
            className="bg-transparent text-sm text-[var(--admin-text-primary)] focus:outline-none flex-1 placeholder:text-[var(--admin-text-muted)]"
          />
        </div>
        <div className="flex items-center gap-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2">
          <Filter size={16} className="text-[var(--admin-text-muted)]" />
          <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-[var(--admin-text-primary)] focus:outline-none">
            <option value="all">Tüm İşlemler</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-2">
          <Filter size={16} className="text-[var(--admin-text-muted)]" />
          <select value={entityFilter} onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-[var(--admin-text-primary)] focus:outline-none">
            <option value="all">Tüm Varlıklar</option>
            {Object.entries(ENTITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <AdminTable<AuditLog>
        rows={logs}
        columns={columns}
        keyField={(r) => r.id}
        loading={loading}
        columnVisibility={false}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-xs rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Önceki
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const start = Math.max(1, page - 2);
            const n = start + i;
            if (n > totalPages) return null;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-xs rounded-md border transition-colors ${
                  page === n
                    ? "bg-[var(--admin-primary)] text-white border-[var(--admin-primary)]"
                    : "border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-xs rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki
          </button>
        </div>
      )}
    </PageContainer>
  );
}