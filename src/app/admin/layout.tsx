import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "./AdminNav";

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
      {/* Admin Navbar */}
      <nav className="bg-black border-b border-dark-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-montaj font-bold">Montajım Var</span>
                <span className="text-xs bg-montaj/20 text-montaj px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </Link>
              <AdminNav />
            </div>
            <Link
              href="/"
              className="text-xs text-sub-text hover:text-montaj transition"
            >
              ← Siteye Dön
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
