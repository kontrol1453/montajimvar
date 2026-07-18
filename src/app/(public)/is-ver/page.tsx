import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import JobCreateClient from "./JobCreateClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İş Ver - Montajım Var",
  description: "Montaj işinizi verin, profesyonel ekiplerden teklif alın. Mobilya, klima, tabela, AVM montajı için en uygun teklifi bulun.",
  robots: { index: false, follow: false },
};

export default async function IsVerPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/giris?callbackUrl=/is-ver");
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="h2 mb-2">İş Ver</h1>
        <p className="body-small">
          Profesyonel montajcılara işini ver, en iyi teklifleri al
        </p>
      </div>

      <JobCreateClient />
    </div>
  );
}
