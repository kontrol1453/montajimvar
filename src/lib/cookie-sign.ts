import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET;
if (!SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set for cookie signing");
}

export function signCookieValue(value: string, ttlSeconds: number): string {
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${value}|${expiry}`;
  const sig = crypto.createHmac("sha256", SECRET!).update(payload).digest("hex");
  return `${payload}|${sig}`;
}

export function verifySignedCookie(value: string): string | null {
  const parts = value.split("|");
  if (parts.length !== 3) return null;

  const [rawValue, expiryStr, sig] = parts;
  const payload = `${rawValue}|${expiryStr}`;
  const expectedSig = crypto.createHmac("sha256", SECRET!).update(payload).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return null;
  }

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() / 1000 > expiry) {
    return null;
  }

  return rawValue;
}