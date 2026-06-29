"use client";

import { useState, useEffect } from "react";

interface Skill {
  id: number;
  categoryId: number;
  title: string | null;
  yearsExp: number | null;
  certificate: string | null;
  verified: boolean;
  category: { id: number; name: string; icon: string | null };
}

export default function ProfileSkills({ userId }: { userId: number }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/skills?userId=${userId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSkills(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return null;
  if (skills.length === 0) return null;

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Uzmanlıklar & Sertifikalar</h2>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-start gap-3 bg-dark-bg rounded-lg p-3 border border-dark-border">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium">{skill.category.name}</span>
                {skill.verified && (
                  <span className="bg-green-900/30 text-green-400 text-xs px-1.5 py-0.5 rounded">Onaylı</span>
                )}
              </div>
              {skill.title && <p className="text-sm text-gray-200 mt-0.5">{skill.title}</p>}
              <div className="flex items-center gap-3 mt-1">
                {skill.yearsExp && (
                  <span className="text-xs text-sub-text">{skill.yearsExp} yıl deneyim</span>
                )}
                {skill.certificate && (
                  <a
                    href={skill.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-montaj hover:underline inline-flex items-center gap-1"
                  >
                    Sertifika ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
