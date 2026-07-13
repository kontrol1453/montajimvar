import { Suspense } from "react";
import { PageContainer, Stack } from "@/components/ui/Typography";
import { SectionSkeleton } from "@/components/admin/SectionContainer";
import CommandCenterClient from "./CommandCenterClient";

export const dynamic = "force-dynamic";

export default function CommandCenterPage() {
  return (
    <PageContainer size="full">
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="animate-pulse space-y-2">
              <div className="h-7 w-48 bg-[var(--admin-surface-muted)] rounded" />
              <div className="h-4 w-72 bg-[var(--admin-surface-muted)] rounded" />
            </div>
            <SectionSkeleton variant="metric" count={6} />
            <SectionSkeleton variant="card" count={4} />
            <SectionSkeleton variant="list" count={3} />
          </div>
        }
      >
        <CommandCenterClient />
      </Suspense>
    </PageContainer>
  );
}
