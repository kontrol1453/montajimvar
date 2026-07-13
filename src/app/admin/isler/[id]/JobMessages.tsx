"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface MessageRow {
  id: number;
  sender: { id: number; name: string };
  message: string;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

interface JobMessagesProps {
  jobId: number;
  data?: MessageRow[];
}

export default function JobMessages({ jobId, data }: JobMessagesProps) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-4 py-8 text-center rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <p className="text-sm text-[var(--admin-text-muted)]">Henüz mesaj bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
      {data.map((msg) => (
        <div
          key={msg.id}
          className="p-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]"
        >
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/admin/kullanicilar/${msg.sender.id}`}
              className="text-sm font-medium text-[var(--admin-primary)] hover:underline"
            >
              {msg.sender.name}
            </Link>
            <span className="text-[10px] text-[var(--admin-text-muted)]">
              {formatDate(new Date(msg.createdAt))}
            </span>
          </div>
          <p className="text-sm text-[var(--admin-text-primary)] whitespace-pre-wrap">{msg.message}</p>
          {msg.fileUrl && (
            <a
              href={msg.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--admin-primary)] hover:underline mt-1 inline-block"
            >
              Dosya ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}