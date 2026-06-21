import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
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
              <div className="hidden md:flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-sub-text hover:text-white transition">
                  Panel
                </Link>
                <Link href="/admin/kullanicilar" className="text-sub-text hover:text-white transition">
                  Kullanıcılar
                </Link>
                <Link href="/admin/firmalar" className="text-sub-text hover:text-white transition">
                  Firmalar
                </Link>
                <Link href="/admin/kategoriler" className="text-sub-text hover:text-white transition">
                  Kategoriler
                </Link>
                <Link href="/admin/izinler" className="text-sub-text hover:text-white transition">
                  İzinler
                </Link>
              </div>
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
