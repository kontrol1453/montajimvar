"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface JobInfo {
  id: number;
  title: string;
  status: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  assigned: "bg-purple-500",
  en_route: "bg-cyan-500",
  in_progress: "bg-montaj",
  completed: "bg-green-500",
  review_pending: "bg-green-400",
  cancelled: "bg-red-500",
};

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function CalendarView({ dateMap }: { dateMap: Record<string, JobInfo[]> }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const pad = firstDay === 0 ? 6 : firstDay - 1;
    const days: (number | null)[] = Array(pad).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month, daysInMonth, firstDay]);

  const formatted = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }} className="p-2 hover:bg-dark-card rounded-lg transition">
          <ChevronLeft size={20} className="text-sub-text" />
        </button>
        <h1 className="text-xl font-bold text-white">{MONTHS[month]} {year}</h1>
        <button onClick={() => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }} className="p-2 hover:bg-dark-card rounded-lg transition">
          <ChevronRight size={20} className="text-sub-text" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-dark-border rounded-xl overflow-hidden">
        {DAYS.map((d) => (
          <div key={d} className="bg-dark-section p-2 text-center text-xs font-medium text-sub-text">{d}</div>
        ))}
        {calendarDays.map((d, i) => {
          const key = d ? formatted(d) : `empty-${i}`;
          const jobs = d ? dateMap[key] : [];
          const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

          return (
            <div
              key={key}
              className={`bg-dark-card min-h-[90px] p-1.5 ${isToday ? "ring-1 ring-montaj" : ""} ${d ? "" : ""}`}
            >
              {d && (
                <>
                  <p className={`text-xs mb-1 ${isToday ? "text-montaj font-bold" : "text-sub-text"}`}>{d}</p>
                  {jobs && jobs.length > 0 && (
                    <div className="space-y-0.5">
                      {jobs.slice(0, 2).map((job) => (
                        <Link key={job.id} href={`/isler/${job.id}`} className="block">
                          <div className={`w-full h-1.5 rounded-full ${STATUS_COLORS[job.status] || "bg-gray-500"}`} />
                        </Link>
                      ))}
                      {jobs.length > 2 && (
                        <p className="text-xs text-sub-text">+{jobs.length - 2} daha</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Bu Ayki İşler</h2>
        {Object.entries(dateMap).filter(([date]) => date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length === 0 ? (
          <p className="text-sub-text text-sm">Bu ayda iş bulunmuyor.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(dateMap)
              .filter(([date]) => date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, jobs]) => (
                <div key={date} className="bg-dark-card rounded-xl border border-dark-border p-4">
                  <p className="text-xs text-sub-text mb-2">
                    {new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                  </p>
                  <div className="space-y-2">
                    {jobs.map((job) => (
                      <Link key={job.id} href={`/isler/${job.id}`} className="flex items-center gap-3 hover:bg-dark-section rounded-lg p-2 -mx-2 transition">
                        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[job.status] || "bg-gray-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{job.title}</p>
                          <p className="text-sub-text text-xs">{job.city}</p>
                        </div>
                        <span className="text-xs text-sub-text">{job.status}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
