"use client";

import { useState, useEffect } from "react";

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

  if (loading) return <div className="p-8 text-sub-text">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Sertifikalar</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white"
        >
          <option value="all">Tümü</option>
          <option value="unverified">Onay bekleyen</option>
        </select>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-section">
              <th className="text-left p-4 text-sub-text font-medium">Uzmanlık</th>
              <th className="text-left p-4 text-sub-text font-medium">Kullanıcı</th>
              <th className="text-left p-4 text-sub-text font-medium">Sertifika</th>
              <th className="text-left p-4 text-sub-text font-medium">Durum</th>
              <th className="text-right p-4 text-sub-text font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {filtered.map((skill) => (
              <tr key={skill.id} className="hover:bg-dark-section transition">
                <td className="p-4 text-white">{skill.category.name}{skill.title ? ` - ${skill.title}` : ""}</td>
                <td className="p-4 text-sub-text">{skill.user.name}<br /><span className="text-xs">{skill.user.email}</span></td>
                <td className="p-4">
                  {skill.certificate ? (
                    <a href={skill.certificate} target="_blank" rel="noopener noreferrer" className="text-montaj hover:underline">Sertifika ↗</a>
                  ) : (
                    <span className="text-sub-text">—</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${skill.verified ? "bg-green-900/30 text-green-400" : "bg-amber-900/30 text-amber-400"}`}>
                    {skill.verified ? "Onaylı" : "Beklemede"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleVerify(skill.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      skill.verified
                        ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30"
                        : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                    }`}
                  >
                    {skill.verified ? "Onayı Kaldır" : "Onayla"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-sub-text text-center">Sertifika bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
