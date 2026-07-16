import { NextRequest, NextResponse } from "next/server";
import { signCookieValue } from "@/lib/cookie-sign";

const VALID_ROLES = ["CUSTOMER", "ASSEMBLER", "MANUFACTURER"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });
    }

    const signedValue = signCookieValue(role, 300);

    const response = NextResponse.json({ ok: true });
    response.cookies.set("google_signup_role", signedValue, {
      path: "/",
      maxAge: 300,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}