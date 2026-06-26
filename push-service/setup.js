// Run once on Pi: node setup.js
// Generates VAPID keys and .env file

const webpush = require("web-push");
const fs = require("fs");
const path = require("path");

const keys = webpush.generateVAPIDKeys();

const envContent = `# Push Service Configuration
PORT=3001

# VAPID Keys (generated - do not share private key)
VAPID_PUBLIC_KEY=${keys.publicKey}
VAPID_PRIVATE_KEY=${keys.privateKey}
VAPID_SUBJECT=mailto:noreply@montajimvar.app

# CORS - allow the main site
CORS_ORIGIN=https://montajimvar.xyz

# Auth token for send endpoint (shared secret with main site)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Then set PUSH_SERVICE_KEY on Vercel env vars too
PUSH_SERVICE_KEY=
`;

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  console.log(".env already exists, skipping.");
  console.log("\nYour VAPID Public Key (set on Vercel as NEXT_PUBLIC_VAPID_PUBLIC_KEY):");
  console.log(keys.publicKey);
} else {
  fs.writeFileSync(envPath, envContent);
  console.log(".env file created.");
  console.log("\nIMPORTANT: Set this on Vercel Environment Variables:");
  console.log("NEXT_PUBLIC_VAPID_PUBLIC_KEY=" + keys.publicKey);
  console.log("\nAlso generate and set PUSH_SERVICE_KEY (shared secret):");
  console.log("Run: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
}

console.log("\nSetup complete!");
