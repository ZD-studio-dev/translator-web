import { createClient } from "@supabase/supabase-js";
import { createHmac } from "node:crypto";
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
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET = env.LEMONSQUEEZY_WEBHOOK_SECRET;
const BASE_URL = env.CLIENT_API_BASE_URL || "http://localhost:3000";
const WEBHOOK_URL = `${BASE_URL}/api/webhooks/lemonsqueezy`;

const TEST_EMAIL =
  env.TEST_CLIENT_EMAIL || "client-api-test@zd-translate.local";
const TEST_USER_ID = env.TEST_USER_ID?.trim();

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function resolveUserId(admin) {
  if (TEST_USER_ID) {
    return TEST_USER_ID;
  }

  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
  if (error) {
    throw error;
  }
  const match = data.users.find(
    (u) => u.email?.toLowerCase() === TEST_EMAIL.toLowerCase(),
  );
  if (!match) {
    throw new Error(
      `No user found for ${TEST_EMAIL}. Set TEST_USER_ID in .env.local or run test:client-apis first.`,
    );
  }
  return match.id;
}

async function fetchCreditsBalance(admin, userId) {
  const { data, error } = await admin
    .from("profiles")
    .select("credits_balance")
    .eq("id", userId)
    .single();
  if (error) {
    throw error;
  }
  return Number(data.credits_balance ?? 0);
}

async function fetchLatestTransaction(admin, userId) {
  const { data, error } = await admin
    .from("credit_transactions")
    .select("id, type, amount, balance_after, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase env in .env.local");
  }
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing LEMONSQUEEZY_WEBHOOK_SECRET in .env.local");
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const userId = await resolveUserId(admin);
  const balanceBefore = await fetchCreditsBalance(admin, userId);

  const orderId = `test-${Date.now()}`;
  const payload = {
    meta: {
      event_name: "order_created",
      custom_data: {
        user_id: userId,
        pack_id: "starter",
      },
    },
    data: {
      type: "orders",
      id: orderId,
      attributes: {
        status: "paid",
      },
    },
  };

  const rawBody = JSON.stringify(payload);
  const signature = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  console.log(`POST ${WEBHOOK_URL}`);
  console.log(`User: ${userId} (${TEST_EMAIL})`);
  console.log(`Balance before: ${balanceBefore}`);

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
    body: rawBody,
  });

  const body = await res.json().catch(() => ({}));
  console.log(`Webhook status: ${res.status}`);
  console.log(JSON.stringify(body, null, 2));

  assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);

  const balanceAfter = await fetchCreditsBalance(admin, userId);
  const latestTx = await fetchLatestTransaction(admin, userId);

  console.log(`Balance after: ${balanceAfter}`);
  console.log("Latest credit_transactions row:");
  console.log(JSON.stringify(latestTx, null, 2));

  assert(
    balanceAfter === balanceBefore + 1800,
    `Expected balance ${balanceBefore + 1800}, got ${balanceAfter}`,
  );
  assert(latestTx?.type === "topup", `Expected type topup, got ${latestTx?.type}`);
  assert(latestTx?.amount === 1800, `Expected amount 1800, got ${latestTx?.amount}`);
  assert(
    latestTx?.description?.includes(`Order #${orderId}`),
    "Description should include order id for idempotency",
  );

  const resDup = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
    body: rawBody,
  });
  const bodyDup = await resDup.json().catch(() => ({}));
  assert(resDup.status === 200, "Duplicate webhook should still return 200");
  assert(bodyDup.duplicate === true, "Duplicate should be flagged");

  const balanceAfterDup = await fetchCreditsBalance(admin, userId);
  assert(
    balanceAfterDup === balanceAfter,
    "Duplicate webhook must not grant credits twice",
  );

  console.log("\n✅ Webhook credit grant test passed.");
  if (balanceBefore === 589 && balanceAfter === 2389) {
    console.log("(Example expectation 589 → 2389 matched.)");
  }
}

main().catch((err) => {
  console.error("\n❌ Webhook test failed:", err.message);
  process.exit(1);
});
