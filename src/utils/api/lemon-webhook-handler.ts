import {
  normalizePackId,
  PRO_MONTHLY_VOICE_SECONDS,
  PRO_QUARTERLY_VOICE_SECONDS,
  TIME_PACK_GRANTS_SECONDS,
} from "@/config/pricing";
import { parseCreditsBalance } from "@/utils/credits";
import { createAdminClient } from "@/utils/supabase/admin";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

type LemonCustomData = {
  user_id?: string;
  plan?: string;
  pack_id?: string;
};

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: LemonCustomData;
  };
  data?: {
    type?: string;
    id?: string;
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

async function transactionExistsForMarker(
  userId: string,
  marker: string,
): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("credit_transactions")
    .select("id")
    .eq("user_id", userId)
    .ilike("description", `%${marker}%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return Boolean(data);
}

type ProfileBillingRow = {
  credits_balance: unknown;
  plan_tier: string | null;
  is_pro: boolean | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  subscription_period: string | null;
};

async function fetchProfileBilling(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select(
      "credits_balance, plan_tier, is_pro, subscription_status, subscription_expires_at, subscription_period",
    )
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Profile not found");
  }

  const row = data as ProfileBillingRow;
  return {
    creditsBalance: parseCreditsBalance(row.credits_balance),
    planTier: row.plan_tier,
    isPro: row.is_pro === true,
    subscriptionStatus: row.subscription_status,
    subscriptionExpiresAt: row.subscription_expires_at,
    subscriptionPeriod: row.subscription_period,
  };
}

function addCalendarMonths(base: Date, months: number): Date {
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  return next;
}

function computeExtendedSubscriptionExpiry(
  currentExpiresAt: string | null,
  months: number,
): string {
  const now = new Date();
  const current = currentExpiresAt ? new Date(currentExpiresAt) : null;
  const base =
    current && !Number.isNaN(current.getTime()) && current > now
      ? current
      : now;
  return addCalendarMonths(base, months).toISOString();
}

async function applyTimeGrant(params: {
  userId: string;
  grantSeconds: number;
  type: string;
  description: string;
  profilePatch?: Record<string, unknown>;
}) {
  const admin = createAdminClient();
  const profile = await fetchProfileBilling(params.userId);
  const newBalance = profile.creditsBalance + params.grantSeconds;

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      credits_balance: newBalance,
      ...params.profilePatch,
    })
    .eq("id", params.userId);

  if (profileError) {
    throw profileError;
  }

  const { error: txError } = await admin.from("credit_transactions").insert({
    user_id: params.userId,
    session_id: null,
    amount: params.grantSeconds,
    balance_after: newBalance,
    type: params.type,
    description: params.description,
  });

  if (txError) {
    throw txError;
  }

  return { newBalance, grantAmount: params.grantSeconds };
}

async function handleOrderCreated(
  userId: string,
  custom: LemonCustomData,
  orderId: string,
) {
  const packId = normalizePackId(custom.pack_id);
  if (!packId) {
    return NextResponse.json({
      received: true,
      skipped: true,
      reason:
        "order_created without pack_id (subscription grants use subscription_payment_success)",
    });
  }

  const marker = `Order #${orderId}`;
  if (await transactionExistsForMarker(userId, marker)) {
    return NextResponse.json({ received: true, duplicate: true, marker });
  }

  const grantSeconds = TIME_PACK_GRANTS_SECONDS[packId];
  const description = `Voice time pack (${packId}) - Order #${orderId}`;

  const result = await applyTimeGrant({
    userId,
    grantSeconds,
    type: "topup",
    description,
  });

  return NextResponse.json({
    received: true,
    granted: true,
    kind: "time_pack",
    pack_id: packId,
    ...result,
  });
}

async function handleSubscriptionPaymentSuccess(
  userId: string,
  invoiceId: string,
  plan: string | undefined,
) {
  const marker = `Invoice #${invoiceId}`;
  if (await transactionExistsForMarker(userId, marker)) {
    return NextResponse.json({ received: true, duplicate: true, marker });
  }

  const isQuarterly = plan === "pro_quarterly";
  const grantSeconds = isQuarterly
    ? PRO_QUARTERLY_VOICE_SECONDS
    : PRO_MONTHLY_VOICE_SECONDS;
  const subscriptionPeriod = isQuarterly ? "quarterly" : "monthly";
  const months = isQuarterly ? 3 : 1;

  const profile = await fetchProfileBilling(userId);
  const subscriptionExpiresAt = computeExtendedSubscriptionExpiry(
    profile.subscriptionExpiresAt,
    months,
  );

  const label = isQuarterly ? "Pro Quarterly" : "Pro Monthly";
  const description = `${label} voice time grant - Invoice #${invoiceId}`;

  const result = await applyTimeGrant({
    userId,
    grantSeconds,
    type: "subscription_grant",
    description,
    profilePatch: {
      plan_tier: "pro",
      is_pro: true,
      subscription_status: "active",
      subscription_period: subscriptionPeriod,
      subscription_expires_at: subscriptionExpiresAt,
      plan: "pro",
    },
  });

  return NextResponse.json({
    received: true,
    granted: true,
    kind: isQuarterly ? "pro_quarterly" : "pro_monthly",
    subscription_period: subscriptionPeriod,
    subscription_expires_at: subscriptionExpiresAt,
    ...result,
  });
}

async function handleSubscriptionCancelled(userId: string, status: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ subscription_status: status || "cancelled" })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  return NextResponse.json({
    received: true,
    updated: true,
    kind: "subscription_cancelled",
  });
}

async function handleSubscriptionExpired(userId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      plan_tier: "free",
      is_pro: false,
      subscription_status: "expired",
      subscription_period: null,
      plan: "free",
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  return NextResponse.json({
    received: true,
    updated: true,
    kind: "subscription_expired",
  });
}

export async function handleLemonWebhook(request: Request) {
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
  const custom = payload.meta?.custom_data ?? {};
  const userId = custom.user_id;
  const resourceId = payload.data?.id;
  const status = payload.data?.attributes?.status ?? "unknown";

  if (!eventName) {
    return NextResponse.json({ received: true, skipped: true, reason: "no event" });
  }

  if (!userId) {
    return NextResponse.json({ received: true, skipped: true, reason: "no user_id" });
  }

  try {
    if (eventName === "order_created") {
      if (!resourceId) {
        return NextResponse.json(
          { error: "order_created missing data.id" },
          { status: 400 },
        );
      }
      return await handleOrderCreated(userId, custom, resourceId);
    }

    if (eventName === "subscription_payment_success") {
      if (!resourceId) {
        return NextResponse.json(
          { error: "subscription_payment_success missing data.id" },
          { status: 400 },
        );
      }
      return await handleSubscriptionPaymentSuccess(
        userId,
        resourceId,
        custom.plan,
      );
    }

    if (eventName === "subscription_cancelled") {
      return await handleSubscriptionCancelled(userId, status);
    }

    if (eventName === "subscription_expired") {
      return await handleSubscriptionExpired(userId);
    }

    return NextResponse.json({ received: true, ignored: eventName });
  } catch (err) {
    console.error("Lemon webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
