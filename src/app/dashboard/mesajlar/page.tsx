import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;

  const messages = await prisma.message.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  const sentMessages = await prisma.message.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      receiver: { select: { id: true, name: true } },
    },
    take: 20,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Mesajlarım</h1>

      {/* Gelen Kutusu */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Gelen Kutusu</h2>
        {messages.length > 0 ? (
          <div className="bg-dark-card rounded-xl border border-dark-border divide-y">
            {messages.map((msg) => (
              <Link
                key={msg.id}
                href={`/dashboard/mesajlar/${msg.senderId}`}
                className={`block p-4 hover:bg-dark-section transition ${!msg.isRead ? "bg-montaj/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.isRead && (
                        <span className="w-2 h-2 bg-montaj rounded-full shrink-0" />
                      )}
                      <span className="font-medium text-sm text-white">
                        {msg.sender.name}
                      </span>
                      <span className="text-xs text-sub-text">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="text-sm font-medium text-gray-200 mb-1">
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-sm text-muted-text line-clamp-2">{msg.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center">
            <p className="text-sub-text">Henüz mesajınız yok.</p>
          </div>
        )}
      </section>

      {/* Gönderilenler */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Gönderilenler</h2>
        {sentMessages.length > 0 ? (
          <div className="bg-dark-card rounded-xl border border-dark-border divide-y">
            {sentMessages.map((msg) => (
              <Link
                key={msg.id}
                href={`/dashboard/mesajlar/${msg.receiverId}`}
                className="block p-4 hover:bg-dark-section transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-sub-text">Alıcı:</span>
                      <span className="font-medium text-sm text-white">
                        {msg.receiver.name}
                      </span>
                      <span className="text-xs text-sub-text">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="text-sm font-medium text-gray-200 mb-1">
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-sm text-muted-text line-clamp-2">{msg.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-dark-card rounded-xl border border-dark-border p-8 text-center">
            <p className="text-sub-text">Henüz mesaj göndermediniz.</p>
            <Link
              href="/ara"
              className="inline-block mt-2 text-sm text-montaj hover:underline"
            >
              Firma ara
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
