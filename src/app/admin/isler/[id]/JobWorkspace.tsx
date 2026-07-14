"use client";

import { useState, useEffect } from "react";
import { Stack } from "@/components/ui/Typography";
import EntityTabs, { type TabDef } from "@/components/admin/entity/EntityTabs";
import JobHeader from "./JobHeader";
import JobOverview from "./JobOverview";
import JobOffers from "./JobOffers";
import JobParticipants from "./JobParticipants";
import JobTimeline from "./JobTimeline";
import JobMessages from "./JobMessages";
import JobReviewsDisputes from "./JobReviewsDisputes";
import JobPayment from "./JobPayment";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";

const TAB_COMPONENTS: Record<string, any> = {
  overview: JobOverview,
  offers: JobOffers,
  participants: JobParticipants,
  timeline: JobTimeline,
  messages: JobMessages,
  reviews_disputes: JobReviewsDisputes,
  payment: JobPayment,
};

export default function JobWorkspace({ job, activeTab }: any) {
  const tabs: TabDef[] = [
    { id: "overview", label: "Genel Bakış" },
    { id: "offers", label: "Teklifler", count: job._count.offers },
    { id: "participants", label: "Katılımcılar" },
    { id: "timeline", label: "Zaman Çizgisi" },
    { id: "messages", label: "Mesajlar", count: job._count.messages },
    { id: "reviews_disputes", label: "Yorum & Anlaşmazlık" },
    { id: "payment", label: "Ödeme" },
  ];

  const [currentTab, setCurrentTab] = useState(activeTab || "overview");

  useEffect(() => {
    if (activeTab && activeTab !== currentTab) setCurrentTab(activeTab);
  }, [activeTab]);

  return (
    <Stack size="lg">
      <JobHeader job={job} />

      <EntityTabs tabs={tabs} defaultTab="overview" />

      <div id={`tabpanel-${currentTab}`} role="tabpanel" aria-labelledby={`tab-${currentTab}`}>
        {currentTab === "overview" ? (
          <JobOverview job={job} />
        ) : (
          <LazyTabContent jobId={job.id} tab={currentTab} />
        )}
      </div>
    </Stack>
  );
}

function LazyTabContent({ jobId, tab }: { jobId: number; tab: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/admin/jobs/${jobId}/detail?tab=${tab}`);
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
  }, [jobId, tab]);

  if (error) return (
    <div className="mt-4 p-8 text-center rounded-lg border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)]" role="alert">
      <p className="text-sm font-medium text-[var(--admin-danger)]">{error}</p>
    </div>
  );
  if (loading) return <LoadingSkeleton variant="page" className="mt-4" />;

  const Component = TAB_COMPONENTS[tab];
  if (!Component) return <p className="mt-4 text-sm text-[var(--admin-text-muted)]">Bu sekme henüz hazır değil.</p>;
  return <Component jobId={jobId} data={data} />;
}