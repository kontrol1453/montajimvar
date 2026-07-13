import { prisma } from "@/lib/prisma";
import { FEATURE_LABELS } from "@/lib/permissions";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
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

  const allFeatures = [...new Set(permissions.map((p) => p.feature))];
  const roles = ["CUSTOMER", "ASSEMBLER", "MANUFACTURER"];

  return (
    <PageContainer>
      <PageTitle className="mb-2">Rol İzinleri</PageTitle>
      <p className="text-[var(--admin-text-secondary)] text-sm mb-6">
        Her rol için hangi özelliklerin aktif olacağını belirleyin.
      </p>

      <PermissionManager
        roles={roles}
        roleLabels={ROLE_LABELS}
        features={allFeatures}
        featureLabels={FEATURE_LABELS}
        initialPermissions={permissions.map((p) => ({ role: p.role, feature: p.feature, enabled: p.enabled }))}
      />
    </PageContainer>
  );
}
