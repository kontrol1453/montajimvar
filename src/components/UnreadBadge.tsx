"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UnreadBadge() {
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session?.user) {
      setUnread(0);
      return;
    }

    async function fetchUnread() {
      try {
        const res = await fetch("/api/messages?type=inbox");
        if (!res.ok) return;
        const messages = await res.json();
        const count = messages.filter((m: { isRead: boolean }) => !m.isRead).length;
        setUnread(count);
      } catch {
        // silently fail
      }
    }

    fetchUnread();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [session]);

  if (unread === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg ring-2 ring-dark-bg">
      {unread > 99 ? "99+" : unread}
    </span>
  );
}
