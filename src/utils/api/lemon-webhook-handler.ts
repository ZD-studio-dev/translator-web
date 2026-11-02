import {
  CREDIT_PACK_GRANTS,
  PRO_MONTHLY_CREDIT_GRANT,
  type CheckoutPackId,
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

function isPackId(value: string | undefined): value is CheckoutPackId {
  return value === "starter" || value === "popular" || value === "pro";
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

async function fetchProfileCredits(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("credits_balance, plan_tier, is_pro, subscription_status")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Profile not found");
  }

  return {
    creditsBalance: parseCreditsBalance(data.credits_balance),
    planTier: data.plan_tier as string | null,
    isPro: data.is_pro === true,
    subscriptionStatus: data.subscription_status as string | null,
  };
}

async function applyCreditGrant(params: {
  userId: string;
  grantAmount: number;
  type: string;
  description: string;
  profilePatch?: Record<string, unknown>;
}) {
  const admin = createAdminClient();
  const profile = await fetchProfileCredits(params.userId);
  const newBalance = profile.creditsBalance + params.grantAmount;

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
    amount: params.grantAmount,
    balance_after: newBalance,
    type: params.type,
    description: params.description,
  });

  if (txError) {
    throw txError;
  }

  return { newBalance, grantAmount: params.grantAmount };
}

async function handleOrderCreated(
  userId: string,
  custom: LemonCustomData,
  orderId: string,
) {
  if (!isPackId(custom.pack_id)) {
    return NextResponse.json({
      received: true,
      skipped: true,
      reason: "order_created without pack_id (subscription grants use subscription_payment_success)",
    });
  }

  const marker = `Order #${orderId}`;
  if (await transactionExistsForMarker(userId, marker)) {
    return NextResponse.json({ received: true, duplicate: true, marker });
  }

  const grantAmount = CREDIT_PACK_GRANTS[custom.pack_id];
  const description = `Credit Pack (${custom.pack_id}) - Order #${orderId}`;

  const result = await applyCreditGrant({
    userId,
    grantAmount,
    type: "topup",
    description,
  });

  return NextResponse.json({
    received: true,
    granted: true,
    kind: "credit_pack",
    pack_id: custom.pack_id,
    ...result,
  });
}

async function handleSubscriptionPaymentSuccess(
  userId: string,
  invoiceId: string,
) {
  const marker = `Invoice #${invoiceId}`;
  if (await transactionExistsForMarker(userId, marker)) {
    return NextResponse.json({ received: true, duplicate: true, marker });
  }

  const description = `Pro Monthly Subscription Grant - Invoice #${invoiceId}`;
  const result = await applyCreditGrant({
    userId,
    grantAmount: PRO_MONTHLY_CREDIT_GRANT,
    type: "subscription_grant",
    description,
    profilePatch: {
      plan_tier: "pro",
      is_pro: true,
      subscription_status: "active",
      plan: "pro",
    },
  });

  return NextResponse.json({
    received: true,
    granted: true,
    kind: "pro_monthly",
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
      return await handleSubscriptionPaymentSuccess(userId, resourceId);
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
