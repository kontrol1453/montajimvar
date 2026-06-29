"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface JobMessage {
  id: number;
  jobId: number;
  senderId: number;
  message: string;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender: { id: number; name: string; avatar: string | null };
}

interface Props {
  jobId: number;
  customerId: number;
  artisanId: number;
}

export default function JobMessagesPanel({ jobId, customerId, artisanId }: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<JobMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as any)?.id;

  const isParticipant = userId === customerId || userId === artisanId;

  useEffect(() => {
    if (!open || !isParticipant) return;
    fetch(`/api/job-messages?jobId=${jobId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMessages(data))
      .catch(() => {});
  }, [jobId, open, isParticipant]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!open || !isParticipant) return;
    const interval = setInterval(() => {
      fetch(`/api/job-messages?jobId=${jobId}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => setMessages((prev) => {
          if (data.length > prev.length) return data;
          return prev;
        }))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [jobId, open, isParticipant]);

  async function sendMessage() {
    if (!newMessage.trim() || sending || !isParticipant) return;
    setSending(true);
    try {
      const res = await fetch("/api/job-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, message: newMessage.trim() }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      }
    } catch {}
    setSending(false);
  }

  if (!isParticipant) return null;

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-dark-bg/50 transition"
      >
        <h3 className="text-lg font-semibold text-white">İş Mesajları</h3>
        <svg
          className={`w-5 h-5 text-sub-text transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-dark-border">
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-sub-text text-center py-8">Henüz mesaj yok. İş hakkında iletişime geçin.</p>
            )}
            {messages.map((msg) => {
              const isMine = msg.senderId === userId;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      isMine
                        ? "bg-montaj text-white rounded-br-sm"
                        : "bg-dark-bg border border-dark-border text-gray-200 rounded-bl-sm"
                    }`}
                  >
                    {!isMine && (
                      <p className="text-[10px] text-sub-text mb-0.5">{msg.sender.name}</p>
                    )}
                    <p>{msg.message}</p>
                    {msg.fileUrl && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-montaj hover:underline mt-1 inline-block"
                      >
                        Dosyayı Aç ↗
                      </a>
                    )}
                    <p className="text-[10px] text-right mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-dark-border p-3 flex gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Mesaj yazın..."
              className="flex-1 px-3 py-2 border border-dark-border rounded-lg text-sm bg-dark-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-montaj"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-4 py-2 bg-montaj text-white rounded-lg text-sm hover:bg-montaj/90 transition disabled:opacity-50"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
