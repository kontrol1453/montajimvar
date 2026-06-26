const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const db = require("./db");

// ─── Load .env ───────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.error("ERROR: .env file not found. Run: node setup.js");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
}
loadEnv();

const PORT = parseInt(process.env.PORT || "3001", 10);
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:noreply@montajimvar.app";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://montajimvar.xyz";
const PUSH_SERVICE_KEY = process.env.PUSH_SERVICE_KEY;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("ERROR: VAPID keys not configured. Run: node setup.js");
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// ─── Express app ─────────────────────────────────────────────────────
const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Public VAPID key (for browser subscription)
app.get("/vapid-public-key", (_req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

// ─── Subscribe ───────────────────────────────────────────────────────
// Called from browser after user grants notification permission
// POST /subscribe
// Body: { userId, endpoint, keys: { p256dh, auth }, userAgent }
// Auth: session token passed as Bearer token in Authorization header
app.post("/subscribe", (req, res) => {
  try {
    const { userId, endpoint, keys, userAgent } = req.body;

    if (!userId || !endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "Geçersiz subscription bilgisi." });
    }

    db.upsertSubscription({ userId, endpoint, keys, userAgent });
    res.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Abonelik kaydedilemedi." });
  }
});

// ─── Unsubscribe ─────────────────────────────────────────────────────
// POST /unsubscribe
// Body: { userId, endpoint }
app.post("/unsubscribe", (req, res) => {
  try {
    const { userId, endpoint } = req.body;

    if (!userId || !endpoint) {
      return res.status(400).json({ error: "userId ve endpoint gerekli." });
    }

    db.deleteSubscription({ userId, endpoint });
    res.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).json({ error: "Abonelik silinemedi." });
  }
});

// ─── Send Push (internal - called by main site) ─────────────────────
// POST /send
// Body: { userId, title, body, icon?, badge?, url? }
// Auth: X-Push-Service-Key header must match PUSH_SERVICE_KEY
app.post("/send", (req, res) => {
  // Auth check
  const authKey = req.headers["x-push-service-key"];
  if (PUSH_SERVICE_KEY && authKey !== PUSH_SERVICE_KEY) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }

  const { userId, title, body, icon, badge, url } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ error: "userId ve title gerekli." });
  }

  const payload = {
    title,
    body: body || "",
    icon: icon || "/icon-192.png",
    badge: badge || "/apple-touch-icon.png",
    url: url || "/",
  };

  const subs = db.getSubscriptionsByUserId(userId);

  if (subs.length === 0) {
    return res.json({ sent: 0, total: 0, message: "Abonelik bulunamadı." });
  }

  let sent = 0;
  const results = subs.map((sub) => {
    const subscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    };

    return webpush
      .sendNotification(subscription, JSON.stringify(payload), { TTL: 86400 })
      .then(() => {
        sent++;
      })
      .catch((err) => {
        // Gone/expired subscription
        if (err.statusCode === 410 || err.statusCode === 404) {
          db.deleteSubscriptionByEndpoint(sub.endpoint);
        }
        console.error(`Push failed for ${sub.endpoint.substring(0, 50)}...:`, err.message);
      });
  });

  Promise.allSettled(results).then(() => {
    res.json({ sent, total: subs.length });
  });
});

// ─── Start ───────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Push service running on http://0.0.0.0:${PORT}`);
  console.log(`VAPID key configured: ${VAPID_PUBLIC_KEY.substring(0, 20)}...`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
  console.log(`Push service key auth: ${PUSH_SERVICE_KEY ? "enabled" : "DISABLED (insecure)"}`);
});
