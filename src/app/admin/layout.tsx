import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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
      <AdminNav />
      <div className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
