import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const AUTH_RATE_LIMIT = 10;
const API_RATE_LIMIT = 100;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

function getRateLimitHeaders(key: string, limit: number): Record<string, string> {
  const record = rateLimitStore.get(key);
  const remaining = record ? Math.max(0, limit - record.count) : limit;
  const resetAt = record ? record.resetAt : Date.now() + RATE_LIMIT_WINDOW_MS;
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    "Retry-After": String(retryAfter),
  };
}

const ADMIN_ROUTES = ["/admin", "/api/admin"];
const AUTH_ROUTES = ["/api/auth/giris", "/api/auth/kayit", "/api/auth/sifre-sifirla", "/api/auth/mobile-login", "/api/auth/refresh"];
const PROTECTED_API_ROUTES = ["/api/favorites", "/api/messages", "/api/reviews", "/api/upload"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    const rateLimitKey = `auth:${ip}`;
    if (!checkRateLimit(rateLimitKey, AUTH_RATE_LIMIT)) {
      const headers = getRateLimitHeaders(rateLimitKey, AUTH_RATE_LIMIT);
      return new NextResponse(JSON.stringify({ error: "Çok fazla istek. Lütfen bekleyin." }), {
        status: 429,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  }

  if (isProtectedApiRoute) {
    const rateLimitKey = `api:${ip}`;
    if (!checkRateLimit(rateLimitKey, API_RATE_LIMIT)) {
      const headers = getRateLimitHeaders(rateLimitKey, API_RATE_LIMIT);
      return new NextResponse(JSON.stringify({ error: "Çok fazla istek. Lütfen bekleyin." }), {
        status: 429,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  }

  if (isAdminRoute) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const roles = (token?.roles as string[]) || [];

    if (!roles.includes("ADMIN")) {
      if (pathname.startsWith("/api/admin")) {
        return new NextResponse(JSON.stringify({ error: "Yetkisiz erişim" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      const loginUrl = new URL("/auth/giris", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedApiRoute) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Giriş yapmalısınız." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/giris",
    "/api/auth/kayit",
    "/api/auth/sifre-sifirla",
    "/api/auth/mobile-login",
    "/api/auth/refresh",
    "/api/favorites/:path*",
    "/api/messages/:path*",
    "/api/reviews/:path*",
    "/api/upload/:path*",
  ],
};