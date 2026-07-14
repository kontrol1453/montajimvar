"use client";

import { useState, useEffect } from "react";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import Badge from "@/components/ui/Badge";
import { Filter } from "lucide-react";

interface Skill {
  id: number;
  title: string | null;
  category: { name: string };
  certificate: string | null;
  verified: boolean;
  user: { name: string; email: string };
}

export default function AdminCertificatesPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unverified">("all");

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then(setSkills)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function toggleVerify(id: number) {
    const res = await fetch(`/api/admin/skills/${id}/verify`, { method: "PATCH" });
    if (res.ok) {
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, verified: !s.verified } : s))
      );
    }
  }

  const filtered = filter === "unverified" ? skills.filter((s) => !s.verified) : skills;

  const columns: TableColumn<Skill>[] = [
    {
      header: "Uzmanlık",
      accessor: (r) => (
        <span className="font-medium">
          {r.category.name}{r.title ? ` - ${r.title}` : ""}
        </span>
      ),
    },
    {
      header: "Kullanıcı",
      hidden: "md",
      accessor: (r) => (
        <div>
          <span className="text-[var(--admin-text-primary)]">{r.user.name}</span>
          <br />
          <span className="text-xs text-[var(--admin-text-muted)]">{r.user.email}</span>
        </div>
      ),
    },
    {
      header: "Sertifika",
      hidden: "lg",
      accessor: (r) =>
        r.certificate ? (
          <a
            href={r.certificate}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--admin-primary)] hover:underline"
          >
            Sertifika ↗
          </a>
        ) : (
          <span className="text-[var(--admin-text-muted)]">—</span>
        ),
    },
    {
      header: "Durum",
      accessor: (r) =>
        r.verified ? (
          <Badge variant="success">Onaylı</Badge>
        ) : (
          <Badge variant="warning">Beklemede</Badge>
        ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <PageTitle>Sertifikalar</PageTitle>
        <a
          href="/api/admin/export?type=certificates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium"
          aria-label="Sertifikaları CSV olarak dışa aktar"
        >
          ⬇ CSV Export
        </a>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--admin-text-muted)]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-3 py-1.5 text-sm text-[var(--admin-text-primary)] focus:outline-none"
          >
            <option value="all">Tümü</option>
            <option value="unverified">Onay bekleyen</option>
          </select>
        </div>
      </div>

      <AdminTable<Skill>
        rows={filtered}
        columns={columns}
        keyField={(r) => r.id}
        actions={(r) => (
          <button
            onClick={() => toggleVerify(r.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              r.verified
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {r.verified ? "Onayı Kaldır" : "Onayla"}
          </button>
        )}
      />
    </PageContainer>
  );
}
