import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUSH_SERVICE_URL = process.env.NEXT_PUBLIC_PUSH_SERVICE_URL || "http://localhost:3001";
const PUSH_SERVICE_KEY = process.env.PUSH_SERVICE_KEY;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erisim." }, { status: 403 });
  }

  if (!PUSH_SERVICE_KEY) {
    return NextResponse.json({ error: "Push servisi anahtari yapilandirilmamis." }, { status: 500 });
  }

  const { userId, title, body } = await request.json();

  if (!userId || !title) {
    return NextResponse.json({ error: "userId ve title gerekli." }, { status: 400 });
  }

  try {
    const res = await fetch(`${PUSH_SERVICE_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Push-Service-Key": PUSH_SERVICE_KEY,
      },
      body: JSON.stringify({ userId, title, body: body || "", url: "/" }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Send-push error:", err);
    return NextResponse.json({ error: "Push servisine ulasilamadi." }, { status: 502 });
  }
}
