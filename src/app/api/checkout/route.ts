import {
  normalizePackId,
  resolveCheckoutVariantId,
  type CheckoutPayload,
} from "@/config/pricing";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const LEMON_CHECKOUTS_URL = "https://api.lemonsqueezy.com/v1/checkouts";

function parseCheckoutBody(body: unknown): CheckoutPayload | null {
  if (!body || typeof body !== "object") {
    return { plan: "pro_monthly" };
  }
  const record = body as Record<string, unknown>;
  const packId = normalizePackId(
    typeof record.pack_id === "string" ? record.pack_id : undefined,
  );
  if (packId) {
    return { pack_id: packId };
  }
  const plan = record.plan;
  if (plan === "pro_quarterly") {
    return { plan: "pro_quarterly" };
  }
  if (plan === "pro_monthly") {
    return { plan: "pro_monthly" };
  }
  return { plan: "pro_monthly" };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let checkoutPayload: CheckoutPayload = { plan: "pro_monthly" };
  try {
    const json = await request.json();
    checkoutPayload = parseCheckoutBody(json) ?? checkoutPayload;
  } catch {
    checkoutPayload = { plan: "pro_monthly" };
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = resolveCheckoutVariantId(checkoutPayload);

  if (!storeId || !variantId) {
    return NextResponse.json(
      {
        error:
          "Checkout is not configured for this product (missing store or variant ID)",
      },
      { status: 500 },
    );
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing LEMONSQUEEZY_API_KEY" },
      { status: 500 },
    );
  }

  const userEmail = user.email;
  if (!userEmail) {
    return NextResponse.json(
      { error: "Account email is required for checkout" },
      { status: 400 },
    );
  }

  const userId = user.id;

  const response = await fetch(LEMON_CHECKOUTS_URL, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: userEmail,
            custom: {
              user_id: userId,
              ...("pack_id" in checkoutPayload
                ? { pack_id: checkoutPayload.pack_id }
                : { plan: checkoutPayload.plan }),
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    console.error("Lemon Squeezy API response:", await response.text());
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }

  const res = (await response.json()) as {
    data?: { attributes?: { url?: string } };
  };
  const url = res.data?.attributes?.url;

  if (!url) {
    return NextResponse.json(
      { error: "Checkout URL missing from Lemon Squeezy response" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url });
}
