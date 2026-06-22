import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Step 1: Import test
    let importOk = false;
    let sendEmail: any = null;
    let err1: string | null = null;
    try {
      const mod = await import("@/lib/email");
      sendEmail = mod.sendEmail;
      importOk = true;
    } catch (e: any) {
      err1 = e?.message || String(e);
    }

    // Step 2: Prisma test
    let prismaOk = false;
    let err2: string | null = null;
    try {
      const { prisma } = await import("@/lib/prisma");
      const user = await prisma.user.findUnique({ where: { email } });
      prismaOk = true;
    } catch (e: any) {
      err2 = e?.message || String(e);
    }

    // Step 3: crypto test
    let cryptoOk = false;
    let err3: string | null = null;
    try {
      const crypto = await import("crypto");
      const token = crypto.randomUUID();
      cryptoOk = !!token;
    } catch (e: any) {
      err3 = e?.message || String(e);
    }

    // Step 4: SMTP test
    let smtpOk = false;
    let err4: string | null = null;
    let smtpEnv: Record<string, string | undefined> = {};
    try {
      const nodemailer = await import("nodemailer");
      const host = process.env.SMTP_HOST;
      const port = process.env.SMTP_PORT;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      smtpEnv = { host, port, user: user ? "***" : undefined, pass: pass ? "***" : undefined };
      if (host && user && pass) {
        const transporter = nodemailer.default.createTransport({
          host,
          port: Number(port) || 587,
          secure: Number(port) === 465,
          auth: { user, pass },
          tls: { rejectUnauthorized: false },
        });
        await transporter.verify();
        smtpOk = true;
      } else {
        err4 = `SMTP env eksik: host=${!!host} user=${!!user} pass=${!!pass}`;
      }
    } catch (e: any) {
      err4 = e?.message || String(e);
    }

    return NextResponse.json({
      importOk,
      err1,
      prismaOk,
      err2,
      cryptoOk,
      err3,
      smtpOk,
      smtpEnv,
      err4,
    });
  } catch (e: any) {
    return NextResponse.json({ fatal: e?.message || String(e) }, { status: 500 });
  }
}
