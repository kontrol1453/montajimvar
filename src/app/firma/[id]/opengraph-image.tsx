import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!profile) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #081020 0%, #0f1a30 50%, #060d1a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(255, 122, 0, 0.15)",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 36, fontWeight: 700, color: "#ff7a00" }}>
            {profile.companyName[0]?.toUpperCase() || "M"}
          </span>
        </div>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            margin: "0 40px",
            lineHeight: 1.2,
          }}
        >
          {profile.companyName}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <span>{profile.city}</span>
          <span>·</span>
          <span>{profile.category.name}</span>
          {profile.ratingAvg > 0 && (
            <>
              <span>·</span>
              <span style={{ color: "#f59e0b" }}>★ {profile.ratingAvg.toFixed(1)}</span>
            </>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.3)",
          }}
        >
          montajimvar.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}