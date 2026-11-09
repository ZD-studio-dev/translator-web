import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnvFile(filePath) {
  const env = {};
  let raw = "";
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    return env;
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = { ...process.env, ...loadEnvFile(resolve(ROOT, ".env.local")) };

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_URL = env.CLIENT_API_BASE_URL || "http://localhost:3000";

const TEST_EMAIL =
  env.TEST_CLIENT_EMAIL || "client-api-test@zd-translate.local";
const TEST_PASSWORD = env.TEST_CLIENT_PASSWORD || "ClientApiTest123!";

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function log(step, payload) {
  console.log(`\n=== ${step} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function apiRequest(method, path, token, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function ensureTestUserAndToken() {
  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let signIn = await anon.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (signIn.error) {
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
      });

    if (createError) {
      throw createError;
    }

    const userId = created.user.id;
    await admin.from("profiles").upsert({
      id: userId,
      email: TEST_EMAIL,
      credits_balance: 600,
    });

    signIn = await anon.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    if (signIn.error || !signIn.data.session) {
      throw signIn.error ?? new Error("Sign-in failed after user creation");
    }
  }

  const userId = signIn.data.user.id;
  await admin
    .from("profiles")
    .update({
      credits_balance: 600,
      email: TEST_EMAIL,
      plan_tier: "free",
      is_pro: false,
      subscription_expires_at: null,
      subscription_period: null,
    })
    .eq("id", userId);

  return {
    token: signIn.data.session.access_token,
    userId,
    admin,
  };
}

async function main() {
  console.log(`Base URL: ${BASE_URL}`);
  const { token, admin, userId } = await ensureTestUserAndToken();
  log("Auth ready", { userId, email: TEST_EMAIL });

  const userRes = await apiRequest("GET", "/api/client/user", token);
  log("GET /api/client/user", userRes);
  assert(userRes.status === 200, "GET /api/client/user should return 200");
  assert(
    userRes.json.credits_balance === 600,
    `Expected credits_balance 600, got ${userRes.json.credits_balance}`,
  );
  assert(
    userRes.json.remaining_seconds === 600,
    "remaining_seconds should mirror credits_balance",
  );

  const startGrace = await apiRequest(
    "POST",
    "/api/client/session/start",
    token,
    { provider: "openai", mode: "s2s" },
  );
  log("POST /api/client/session/start (grace test)", startGrace);
  assert(startGrace.status === 200, "session/start should succeed");
  const graceSessionId = startGrace.json.session_id;

  await sleep(2000);

  const stopGrace = await apiRequest(
    "POST",
    "/api/client/session/stop",
    token,
    { session_id: graceSessionId },
  );
  log("POST /api/client/session/stop (grace test)", stopGrace);
  assert(stopGrace.json.waived === true, "Expected waived: true within 5s");
  assert(
    stopGrace.json.credits_balance === 600,
    `Expected balance still 600 after grace stop, got ${stopGrace.json.credits_balance}`,
  );

  await admin
    .from("profiles")
    .update({ credits_balance: 600, plan_tier: "free", is_pro: false })
    .eq("id", userId);

  const startBilling = await apiRequest(
    "POST",
    "/api/client/session/start",
    token,
    { provider: "openai", mode: "s2s" },
  );
  log("POST /api/client/session/start (S2S billing)", startBilling);
  const billingSessionId = startBilling.json.session_id;

  await sleep(6000);

  const heartbeat = await apiRequest(
    "POST",
    "/api/client/session/heartbeat",
    token,
    { session_id: billingSessionId },
  );
  log("POST /api/client/session/heartbeat (S2S)", heartbeat);
  assert(
    heartbeat.json.charged >= 5 && heartbeat.json.charged <= 8,
    `Expected heartbeat charge ~6, got ${heartbeat.json.charged}`,
  );

  await sleep(3000);

  const stopBilling = await apiRequest(
    "POST",
    "/api/client/session/stop",
    token,
    { session_id: billingSessionId },
  );
  log("POST /api/client/session/stop (S2S)", stopBilling);
  const finalBalance = stopBilling.json.credits_balance;
  const totalCharged = stopBilling.json.total_credits_charged;
  assert(
    totalCharged >= 8 && totalCharged <= 11,
    `Expected total charged ~9, got ${totalCharged}`,
  );
  assert(
    finalBalance >= 589 && finalBalance <= 592,
    `Expected final balance ~591, got ${finalBalance}`,
  );

  const futureExpiry = new Date();
  futureExpiry.setMonth(futureExpiry.getMonth() + 1);

  await admin
    .from("profiles")
    .update({
      credits_balance: 10,
      plan_tier: "pro",
      is_pro: true,
      subscription_expires_at: futureExpiry.toISOString(),
      subscription_period: "monthly",
    })
    .eq("id", userId);

  const startS2tLowBalance = await apiRequest(
    "POST",
    "/api/client/session/start",
    token,
    { provider: "openai", mode: "s2t" },
  );
  log("POST /api/client/session/start (Pro S2T, low balance)", startS2tLowBalance);
  assert(
    startS2tLowBalance.status === 200,
    "Pro S2T should start even with balance < 30",
  );
  const s2tSessionId = startS2tLowBalance.json.session_id;

  await sleep(6000);

  const hbS2t = await apiRequest(
    "POST",
    "/api/client/session/heartbeat",
    token,
    { session_id: s2tSessionId },
  );
  log("POST /api/client/session/heartbeat (Pro S2T)", hbS2t);
  assert(hbS2t.json.charged === 0, "Pro S2T heartbeat must charge 0");
  assert(hbS2t.json.credits_balance === 10, "Pro S2T must not deduct balance");

  await sleep(1000);

  const stopS2t = await apiRequest(
    "POST",
    "/api/client/session/stop",
    token,
    { session_id: s2tSessionId },
  );
  log("POST /api/client/session/stop (Pro S2T)", stopS2t);
  assert(stopS2t.json.charged === 0, "Pro S2T stop must charge 0");
  assert(
    stopS2t.json.credits_balance === 10,
    "Balance unchanged after Pro S2T",
  );

  const userPro = await apiRequest("GET", "/api/client/user", token);
  log("GET /api/client/user (pro)", userPro);
  assert(userPro.json.is_pro === true, "is_pro should be true");
  assert(userPro.json.unlimited_s2t === true, "unlimited_s2t should be true");

  console.log("\n✅ All client API checks passed (S2S billing + Pro S2T unlimited).");
}

main().catch((err) => {
  console.error("\n❌ Test run failed:", err.message);
  process.exit(1);
});
