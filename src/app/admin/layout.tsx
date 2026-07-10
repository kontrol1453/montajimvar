import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";
import NotificationBell from "./NotificationBell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    redirect("/auth/giris");
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <AdminNav />

      {/* Main content */}
      <div className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        {/* Top bar with notification */}
        <div className="hidden lg:flex items-center justify-end h-14 px-6 border-b border-dark-border bg-black/50">
          <NotificationBell />
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
