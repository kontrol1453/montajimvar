import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import JobCreateClient from "./JobCreateClient";

export const dynamic = "force-dynamic";

export default async function IsVerPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/giris?callbackUrl=/is-ver");
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">İş Ver</h1>
        <p className="text-muted-text">
          Profesyonel montajcılara işini ver, en iyi teklifleri al
        </p>
      </div>

      <JobCreateClient />
    </div>
  );
}
