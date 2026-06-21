"use client";

import { useState } from "react";

interface Permission {
  role: string;
  feature: string;
  enabled: boolean;
}

interface Props {
  roles: string[];
  roleLabels: Record<string, string>;
  features: string[];
  featureLabels: Record<string, string>;
  initialPermissions: Permission[];
}

export default function PermissionManager({
  roles,
  roleLabels,
  features,
  featureLabels,
  initialPermissions,
}: Props) {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  function getEnabled(role: string, feature: string): boolean {
    return permissions.find(
      (p) => p.role === role && p.feature === feature
    )?.enabled ?? true;
  }

  async function handleToggle(role: string, feature: string, current: boolean) {
    const key = `${role}:${feature}`;
    setSaving((prev) => ({ ...prev, [key]: true }));

    // Optimistic update
    setPermissions((prev) =>
      prev.map((p) =>
        p.role === role && p.feature === feature ? { ...p, enabled: !current } : p
      )
    );

    try {
      const res = await fetch("/api/admin/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          feature,
          enabled: !current,
        }),
      });

      if (!res.ok) {
        // Revert on error
        setPermissions((prev) =>
          prev.map((p) =>
            p.role === role && p.feature === feature
              ? { ...p, enabled: current }
              : p
          )
        );
      }
    } catch {
      // Revert on error
      setPermissions((prev) =>
        prev.map((p) =>
          p.role === role && p.feature === feature ? { ...p, enabled: current } : p
        )
      );
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  }

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-section">
              <th className="text-left p-4 text-sub-text font-medium min-w-[200px]">
                Özellik
              </th>
              {roles.map((role) => (
                <th
                  key={role}
                  className="text-center p-4 text-sub-text font-medium min-w-[120px]"
                >
                  {roleLabels[role] || role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {features.map((feature) => (
              <tr key={feature} className="hover:bg-dark-section transition">
                <td className="p-4">
                  <span className="text-white">
                    {featureLabels[feature] || feature}
                  </span>
                </td>
                {roles.map((role) => {
                  const enabled = getEnabled(role, feature);
                  const key = `${role}:${feature}`;
                  const isSaving = saving[key];
                  return (
                    <td key={role} className="p-4 text-center">
                      <button
                        onClick={() => handleToggle(role, feature, enabled)}
                        disabled={isSaving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-montaj/50 ${
                          enabled ? "bg-montaj" : "bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      {isSaving && (
                        <span className="ml-1 text-xs text-sub-text">...</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
