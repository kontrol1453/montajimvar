"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: number; name: string; avatar?: string | null };
  receiver: { id: number; name: string; avatar?: string | null };
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = React.use(params);
  const otherUserId = Number(resolved.id);
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentUserId = (session?.user as any)?.id;

  useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/messages?conversationWith=${otherUserId}`)
      .then((r) => r.json())
      .then((data: Message[]) => {
        setMessages(data);
        if (data.length > 0) {
          const other = data[0].senderId === otherUserId ? data[0].sender : data[0].receiver;
          setOtherUser(other);
        }
        setLoading(false);
      });
  }, [session, otherUserId]);

  // Mark unread messages as read
  useEffect(() => {
    const unread = messages.filter(
      (m) => m.receiverId === currentUserId && !m.isRead
    );
    unread.forEach((m) => {
      fetch(`/api/messages/${m.id}`, { method: "PATCH" }).catch(() => {});
    });
  }, [messages, currentUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUserId,
          content: replyText.trim(),
          subject: messages[0]?.subject || "",
        }),
      });

      if (res.ok) {
        const newMsg: Message = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setReplyText("");
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  if (!session?.user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-sub-text">Giriş yapmalısınız.</p>
        <Link href="/auth/giris" className="text-montaj hover:underline mt-2 inline-block">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-dark-card rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/mesajlar"
          className="text-sub-text hover:text-white transition"
        >
          ← Geri
        </Link>
        <h1 className="text-xl font-bold text-white truncate">
          {otherUser?.name || "Kullanıcı"}
        </h1>
      </div>

      {/* Messages */}
      <div className="bg-dark-card rounded-xl border border-dark-border mb-6">
        {messages.length > 0 ? (
          <div className="divide-y divide-dark-border max-h-[60vh] overflow-y-auto">
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`p-4 ${isMine ? "bg-dark-section/50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isMine
                          ? "bg-montaj/20 text-montaj"
                          : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {msg.sender.name[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">
                          {msg.sender.name}
                        </span>
                        <span className="text-xs text-sub-text">
                          {formatDate(new Date(msg.createdAt))}
                        </span>
                        {!msg.isRead && !isMine && (
                          <span className="w-1.5 h-1.5 bg-montaj rounded-full" />
                        )}
                      </div>
                      {msg.subject && (
                        <p className="text-xs text-sub-text mb-1">
                          {msg.subject}
                        </p>
                      )}
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sub-text">Henüz mesaj yok.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply Form */}
      <form onSubmit={handleReply} className="flex gap-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Mesajınızı yazın..."
          rows={3}
          className="flex-1 px-4 py-3 border border-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-montaj bg-dark-bg text-white placeholder-gray-500 resize-none"
        />
        <button
          type="submit"
          disabled={!replyText.trim() || sending}
          className="self-end px-6 py-3 bg-montaj text-white rounded-xl hover:bg-montaj-dark transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
}
