import { Suspense } from "react";
import { PageContainer } from "@/components/ui/Typography";
import { SectionSkeleton } from "@/components/admin/SectionContainer";
import SiteSettingsClient from "./SiteSettingsClient";

export const dynamic = "force-dynamic";

export default function SiteSettingsPage() {
  return (
    <PageContainer size="full">
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="animate-pulse space-y-2">
              <div className="h-7 w-56 bg-[var(--admin-surface-muted)] rounded" />
              <div className="h-4 w-80 bg-[var(--admin-surface-muted)] rounded" />
            </div>
            <SectionSkeleton variant="card" count={4} />
          </div>
        }
      >
        <SiteSettingsClient />
      </Suspense>
    </PageContainer>
  );
}