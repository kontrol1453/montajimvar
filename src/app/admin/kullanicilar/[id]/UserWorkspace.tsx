"use client";

import { useState, useEffect } from "react";
import { Stack } from "@/components/ui/Typography";
import EntityTabs, { type TabDef } from "@/components/admin/entity/EntityTabs";
import UserHeader from "./UserHeader";
import UserOverview from "./UserOverview";
import UserJobs from "./UserJobs";
import UserOffers from "./UserOffers";
import UserReviews from "./UserReviews";
import UserCertificates from "./UserCertificates";
import UserDisputes from "./UserDisputes";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

interface UserWorkspaceProps {
  data: any;
  userId: number;
  activeTab?: string;
}

const TAB_COMPONENTS: Record<string, any> = {
  overview: UserOverview,
  jobs: UserJobs,
  offers: UserOffers,
  reviews: UserReviews,
  certificates: UserCertificates,
  disputes: UserDisputes,
};

export default function UserWorkspace({ data, userId, activeTab }: UserWorkspaceProps) {
  const user = data.user;
  const summary = data.summary;

  const tabs: TabDef[] = [
    { id: "overview", label: "Genel Bakış" },
    { id: "jobs", label: "İşler", count: summary.totalJobs },
    { id: "offers", label: "Teklifler", count: summary.totalOffers },
    { id: "reviews", label: "Yorumlar", count: summary.totalReviews },
    { id: "certificates", label: "Sertifikalar", count: summary.totalCertificates },
    { id: "disputes", label: "Anlaşmazlıklar", count: summary.totalDisputes },
  ];

  const [currentTab, setCurrentTab] = useState(activeTab || "overview");
  const [loadingTabs, setLoadingTabs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeTab && activeTab !== currentTab) setCurrentTab(activeTab);
  }, [activeTab]);

  return (
    <Stack size="lg">
      <UserHeader user={user} summary={summary} />

      <EntityTabs tabs={tabs} defaultTab="overview" />

      <div id={`tabpanel-${currentTab}`} role="tabpanel" aria-labelledby={`tab-${currentTab}`}>
        {loadingTabs[currentTab] ? (
          <LoadingSkeleton variant="page" className="mt-4" />
        ) : currentTab === "overview" ? (
          <UserOverview user={user} summary={summary} />
        ) : (
          <LazyTabContent userId={userId} tab={currentTab} />
        )}
      </div>
    </Stack>
  );
}

function LazyTabContent({ userId, tab }: { userId: number; tab: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/users/${userId}/detail?tab=${tab}`);
        if (!res.ok) throw new Error("Veri yüklenemedi.");
        const d = await res.json();
        if (!cancelled) setData(d);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId, tab]);

  if (error) {
    return (
      <div className="mt-4 p-8 text-center rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)]" role="alert">
        <p className="text-sm font-medium text-[var(--admin-danger)]">{error}</p>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton variant="page" className="mt-4" />;

  const Component = TAB_COMPONENTS[tab];
  if (!Component) return <p className="mt-4 text-sm text-[var(--admin-text-muted)]">Bu sekme için içerik henüz hazır değil.</p>;

  return <Component userId={userId} data={data} />;
}