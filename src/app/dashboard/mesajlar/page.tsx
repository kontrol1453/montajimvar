import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import MarkAllReadButton from "./MarkAllReadButton";

type MessageWithUser = {
  id: number;
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender: { id: number; name: string };
  receiver: { id: number; name: string };
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;

  const allMessages = await prisma.message.findMany({
    where: {
      OR: [
        { receiverId: userId },
        { senderId: userId },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
    take: 200,
  });

  // Group by conversation partner
  const conversations = new Map<number, { user: { id: number; name: string }; messages: MessageWithUser[]; unread: number }>();

  for (const msg of allMessages) {
    const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const partner = msg.senderId === userId ? msg.receiver : msg.sender;

    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, { user: partner, messages: [], unread: 0 });
    }

    const conv = conversations.get(partnerId)!;
    conv.messages.push(msg);
    if (msg.receiverId === userId && !msg.isRead) {
      conv.unread++;
    }
  }

  const totalUnread = Array.from(conversations.values()).reduce((sum, c) => sum + c.unread, 0);
  const conversationList = Array.from(conversations.entries());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mesajlarım</h1>
          {totalUnread > 0 && (
            <p className="text-sm text-muted-text mt-1">{totalUnread} okunmamış mesaj</p>
          )}
        </div>
        {totalUnread > 0 && <MarkAllReadButton />}
      </div>

      {conversationList.length > 0 ? (
        <div className="bg-dark-card rounded-xl border border-dark-border divide-y divide-dark-border">
          {conversationList.map(([partnerId, conv]) => {
            const lastMsg = conv.messages[0];
            return (
              <Link
                key={partnerId}
                href={`/dashboard/mesajlar/${partnerId}`}
                className="block p-4 hover:bg-dark-section transition"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    conv.unread > 0
                      ? "bg-montaj/20 text-montaj ring-2 ring-montaj/30"
                      : "bg-dark-section text-sub-text"
                  }`}>
                    {conv.user.name[0]?.toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm ${conv.unread > 0 ? "font-semibold text-white" : "font-medium text-gray-200"}`}>
                        {conv.user.name}
                      </span>
                      <span className="text-xs text-sub-text shrink-0">
                        {formatDate(lastMsg.createdAt)}
                      </span>
                    </div>
                    {lastMsg.subject && (
                      <p className="text-xs text-sub-text truncate mb-0.5">{lastMsg.subject}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-text truncate flex-1">
                        {lastMsg.senderId === userId && <span className="text-xs text-sub-text">Sen: </span>}
                        {lastMsg.content}
                      </p>
                      {conv.unread > 0 && (
                        <span className="shrink-0 bg-montaj text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                          {conv.unread > 99 ? "99+" : conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-dark-card rounded-xl border border-dark-border p-12 text-center">
          <div className="w-16 h-16 bg-dark-section rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-sub-text mb-2">Henüz mesajınız yok.</p>
          <p className="text-sm text-muted-text">
            Firmalara mesaj göndererek iletişime başlayabilirsiniz.
          </p>
          <Link
            href="/ara"
            className="inline-block mt-4 px-5 py-2 bg-montaj text-white text-sm font-medium rounded-lg hover:bg-montaj-dark transition"
          >
            Firma Ara
          </Link>
        </div>
      )}
    </div>
  );
}