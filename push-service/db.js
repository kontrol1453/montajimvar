const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "push.db");

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      user_agent TEXT,
      is_ios INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
      ON subscriptions(user_id);

    CREATE INDEX IF NOT EXISTS idx_subscriptions_endpoint
      ON subscriptions(endpoint);
  `);
  try {
    db.exec("ALTER TABLE subscriptions ADD COLUMN is_ios INTEGER DEFAULT 0");
  } catch {}
}

// Subscribe: upsert by endpoint
function upsertSubscription({ userId, endpoint, keys, userAgent, isIOS }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO subscriptions (user_id, endpoint, p256dh, auth, user_agent, is_ios, updated_at)
    VALUES (@userId, @endpoint, @p256dh, @auth, @userAgent, @isIOS, datetime('now'))
    ON CONFLICT(endpoint) DO UPDATE SET
      user_id = @userId,
      p256dh = @p256dh,
      auth = @auth,
      user_agent = @userAgent,
      is_ios = @isIOS,
      updated_at = datetime('now')
  `);
  stmt.run({
    userId,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    userAgent: userAgent || null,
    isIOS: isIOS ? 1 : 0,
  });
  return { success: true };
}

// Unsubscribe: remove by endpoint + userId
function deleteSubscription({ endpoint, userId }) {
  const db = getDb();
  const stmt = db.prepare(
    "DELETE FROM subscriptions WHERE endpoint = ? AND user_id = ?"
  );
  stmt.run(endpoint, userId);
  return { success: true };
}

// Get all subscriptions for a user (for sending push)
function getSubscriptionsByUserId(userId) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM subscriptions WHERE user_id = ?")
    .all(userId);
}

// Delete a specific subscription by endpoint (for cleanup on 410/404)
function deleteSubscriptionByEndpoint(endpoint) {
  const db = getDb();
  db.prepare("DELETE FROM subscriptions WHERE endpoint = ?").run(endpoint);
}

module.exports = {
  getDb,
  upsertSubscription,
  deleteSubscription,
  getSubscriptionsByUserId,
  deleteSubscriptionByEndpoint,
};
