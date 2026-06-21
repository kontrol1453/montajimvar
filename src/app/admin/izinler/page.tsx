import { prisma } from "@/lib/prisma";
import { FEATURE_LABELS } from "@/lib/permissions";
import PermissionManager from "./PermissionManager";

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
};

export default async function AdminPermissionsPage() {
  const permissions = await prisma.rolePermission.findMany({
    orderBy: [{ role: "asc" }, { feature: "asc" }],
  });

  // Group by role
  const grouped: Record<string, { feature: string; enabled: boolean }[]> = {};
  for (const perm of permissions) {
    if (!grouped[perm.role]) grouped[perm.role] = [];
    grouped[perm.role].push({ feature: perm.feature, enabled: perm.enabled });
  }

  // Get all unique features from the DB
  const allFeatures = [...new Set(permissions.map((p) => p.feature))];

  const roles = ["CUSTOMER", "ASSEMBLER", "MANUFACTURER"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Rol İzinleri</h1>
      <p className="text-sub-text text-sm mb-6">
        Her rol için hangi özelliklerin aktif olacağını belirleyin.
      </p>

      <PermissionManager
        roles={roles}
        roleLabels={ROLE_LABELS}
        features={allFeatures}
        featureLabels={FEATURE_LABELS}
        initialPermissions={permissions.map((p) => ({
          role: p.role,
          feature: p.feature,
          enabled: p.enabled,
        }))}
      />
    </div>
  );
}
