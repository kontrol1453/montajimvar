#!/usr/bin/env node
/**
 * Montajım Var — Preview Router
 * Sprint 11 — Wildcard hostname → per-branch preview port dispatcher
 *
 * Runs on Pi at port 3019 (behind cloudflared wildcard ingress).
 * For any host matching `preview-<slug>.test.montajimvar.xyz`:
 *   1. Extract slug from Host header
 *   2. Hash slug → port (3020-3099)
 *   3. HTTP-proxy request to localhost:<port>
 *   4. If preview not running → 502 with helpful JSON
 *
 * Lifecycle: PM2 process "montajimvar-preview-router"
 *   pm2 start preview-router.mjs --name montajimvar-preview-router
 *   pm2 save
 */

import http from "node:http";
import net from "node:net";

const ROUTER_PORT = Number(process.env.PREVIEW_ROUTER_PORT || 3019);
const PORT_RANGE_START = 3020;
const PORT_RANGE_END = 3099;
const PORT_RANGE_SIZE = PORT_RANGE_END - PORT_RANGE_START + 1;
const PREVIEW_HOST_SUFFIX = ".test.montajimvar.xyz";
const PREVIEW_PREFIX = "preview-";
const SOCKET_TIMEOUT_MS = 30_000;
const UPSTREAM_TIMEOUT_MS = 30_000;

/**
 * Deterministic slug → port hash.
 * Same algorithm as .github/workflows/preview.yml (cksum % range).
 * cksum is POSIX; here we replicate it with a simple FNV-1a-ish hash.
 */
function slugToPort(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return PORT_RANGE_START + (h % PORT_RANGE_SIZE);
}

/**
 * Extract slug from Host header.
 * Accepts: "preview-<slug>.test.montajimvar.xyz" or with port.
 */
function extractSlug(hostHeader) {
  if (!hostHeader) return null;
  const host = hostHeader.split(":")[0].toLowerCase();
  if (!host.endsWith(PREVIEW_HOST_SUFFIX)) return null;
  const prefix = host.slice(0, -PREVIEW_HOST_SUFFIX.length);
  if (!prefix.startsWith(PREVIEW_PREFIX)) return null;
  const slug = prefix.slice(PREVIEW_PREFIX.length);
  if (!/^[a-z0-9][a-z0-9-]{0,19}$/.test(slug)) return null;
  return slug;
}

/**
 * Try to establish a TCP connection to upstream to detect "down" before proxying.
 * Returns true if connectable within timeout.
 */
function checkUpstream(port) {
  return new Promise((resolve) => {
    const sock = net.createConnection({ port, host: "127.0.0.1" });
    const timer = setTimeout(() => {
      sock.destroy();
      resolve(false);
    }, 500);
    sock.once("connect", () => {
      clearTimeout(timer);
      sock.destroy();
      resolve(true);
    });
    sock.once("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

/**
 * Pipe two duplex streams, propagating errors and end events both ways.
 */
function pipeBoth(src, dst) {
  src.pipe(dst);
  dst.pipe(src);
  src.on("error", () => dst.destroy());
  dst.on("error", () => src.destroy());
}

/**
 * Send a JSON error response.
 */
function sendJsonError(res, status, code, message, extra = {}) {
  const body = JSON.stringify({ status: "error", code, message, ...extra });
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

/**
 * Main router handler.
 */
async function handle(req, res) {
  const host = req.headers.host;
  const slug = extractSlug(host);

  // No preview host → 404
  if (slug === null) {
    sendJsonError(res, 404, "NO_PREVIEW_HOST", `Host "${host}" is not a preview hostname.`);
    return;
  }

  const port = slugToPort(slug);

  // Check if upstream preview is running on this port
  const alive = await checkUpstream(port);
  if (!alive) {
    sendJsonError(res, 502, "PREVIEW_NOT_RUNNING", "No preview process listening on this port.", {
      slug,
      port,
      hint: "Open a PR to trigger a preview deploy, or run: pm2 start npm --name montajimvar-preview-" + slug + " -- start -- --port " + port,
    });
    return;
  }

  // Proxy to upstream preview — preserve method, headers, body
  const upstreamReq = http.request(
    {
      host: "127.0.0.1",
      port,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: req.headers.host, // pass original Host so preview app sees correct public URL
        "x-forwarded-for": (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "") + ", " + (req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""),
        "x-forwarded-host": req.headers.host,
        "x-forwarded-proto": "https",
      },
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    }
  );

  upstreamReq.on("error", (err) => {
    sendJsonError(res, 502, "UPSTREAM_ERROR", "Preview upstream request failed.", {
      slug,
      port,
      error: err.message,
    });
  });

  upstreamReq.setTimeout(UPSTREAM_TIMEOUT_MS, () => {
    upstreamReq.destroy();
    sendJsonError(res, 504, "UPSTREAM_TIMEOUT", "Preview upstream timed out.", { slug, port });
  });

  // Pipe request body to upstream
  pipeBoth(req, upstreamReq);
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  Promise.resolve(handle(req, res)).catch((err) => {
    console.error(`[router] unhandled error for ${req.headers.host}: ${err.stack || err}`);
    if (!res.headersSent) {
      sendJsonError(res, 500, "ROUTER_ERROR", "Preview router internal error.", {
        error: err.message,
      });
    }
  });
});

server.on("connection", (socket) => {
  socket.setTimeout(SOCKET_TIMEOUT_MS);
  socket.on("timeout", () => socket.destroy());
});

server.listen(ROUTER_PORT, "127.0.0.1", () => {
  console.log(`[preview-router] listening on 127.0.0.1:${ROUTER_PORT}`);
  console.log(`[preview-router] slug → port hash range: ${PORT_RANGE_START}-${PORT_RANGE_END}`);
  console.log(`[preview-router] host suffix: *${PREVIEW_HOST_SUFFIX}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`[preview-router] received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGQUIT", () => shutdown("SIGQUIT"));

// Health endpoint for PM2 / cloudflared (localhost-only)
// — if a request to /__router_health arrives from localhost, return 200
server.on("request", (req, res) => {
  if (req.url === "/__router_health" && (req.socket.remoteAddress === "127.0.0.1" || req.socket.remoteAddress === "::1")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "preview-router", port: ROUTER_PORT }));
  }
});
