"use client";

import { useState, useEffect } from "react";
import { Stack } from "@/components/ui/Typography";
import EntityTabs, { type TabDef } from "@/components/admin/entity/EntityTabs";
import CompanyHeader from "./CompanyHeader";
import CompanyOverview from "./CompanyOverview";
import CompanyJobs from "./CompanyJobs";
import CompanyReviews from "./CompanyReviews";
import CompanyDisputes from "./CompanyDisputes";
import CompanySubscription from "./CompanySubscription";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

const TAB_COMPONENTS: Record<string, any> = {
  overview: CompanyOverview,
  jobs: CompanyJobs,
  reviews: CompanyReviews,
  disputes: CompanyDisputes,
  subscription: CompanySubscription,
};

export default function CompanyWorkspace({ profile, summary, activeTab }: any) {
  const tabs: TabDef[] = [
    { id: "overview", label: "Genel Bakış" },
    { id: "jobs", label: "İşler", count: summary.totalJobs },
    { id: "reviews", label: "Yorumlar", count: profile._count.reviews },
    { id: "disputes", label: "Anlaşmazlıklar" },
  ];

  if (profile.subscription) {
    tabs.push({ id: "subscription", label: "Abonelik" });
  }

  const [currentTab, setCurrentTab] = useState(activeTab || "overview");

  useEffect(() => {
    if (activeTab && activeTab !== currentTab) setCurrentTab(activeTab);
  }, [activeTab]);

  return (
    <Stack size="lg">
      <CompanyHeader profile={profile} summary={summary} />

      <EntityTabs tabs={tabs} defaultTab="overview" />

      <div id={`tabpanel-${currentTab}`} role="tabpanel" aria-labelledby={`tab-${currentTab}`}>
        {currentTab === "overview" ? (
          <CompanyOverview profile={profile} summary={summary} />
        ) : (
          <LazyTabContent profileId={profile.id} tab={currentTab} />
        )}
      </div>
    </Stack>
  );
}

function LazyTabContent({ profileId, tab }: { profileId: number; tab: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/admin/profiles/${profileId}/detail?tab=${tab}`);
        if (!res.ok) throw new Error("Veri yüklenemedi.");
        const d = await res.json();
        if (!cancelled) setData(d);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Hata oluştu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [profileId, tab]);

  if (error) return (
    <div className="mt-4 p-8 text-center rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)]" role="alert">
      <p className="text-sm font-medium text-[var(--admin-danger)]">{error}</p>
    </div>
  );
  if (loading) return <LoadingSkeleton variant="page" className="mt-4" />;

  const Component = TAB_COMPONENTS[tab];
  if (!Component) return <p className="mt-4 text-sm text-[var(--admin-text-muted)]">Bu sekme henüz hazır değil.</p>;
  return <Component profileId={profileId} data={data} />;
}