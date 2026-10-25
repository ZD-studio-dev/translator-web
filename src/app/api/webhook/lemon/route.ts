import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data?: {
    attributes?: {
      status?: string;
    };
  };
};

function verifySignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) {
    return false;
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    const digestBuffer = Buffer.from(digest, "utf8");
    const signatureBuffer = Buffer.from(signatureHeader, "utf8");
    if (digestBuffer.length !== signatureBuffer.length) {
      return false;
    }
    return timingSafeEqual(digestBuffer, signatureBuffer);
  } catch {
    return false;
  }
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LemonWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LemonWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const userId = payload.meta?.custom_data?.user_id;
  const status = payload.data?.attributes?.status ?? "unknown";

  if (!eventName || !userId) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const cancelOrExpireEvents = new Set([
    "subscription_cancelled",
    "subscription_expired",
  ]);

  let isPro: boolean | null = null;
  let subscriptionStatus: string | null = null;

  if (
    (eventName === "subscription_created" ||
      eventName === "subscription_updated") &&
    status === "active"
  ) {
    isPro = true;
    subscriptionStatus = "active";
  } else if (
    cancelOrExpireEvents.has(eventName) ||
    (eventName === "subscription_updated" && status !== "active")
  ) {
    isPro = false;
    subscriptionStatus = status;
  }

  if (isPro === null || subscriptionStatus === null) {
    return NextResponse.json({ received: true, ignored: eventName });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        is_pro: isPro,
        subscription_status: subscriptionStatus,
        ...(isPro ? { plan: "pro" } : { plan: "free" }),
      })
      .eq("id", userId);

    if (error) {
      console.error("Webhook profile update error:", error);
      return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true, updated: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
