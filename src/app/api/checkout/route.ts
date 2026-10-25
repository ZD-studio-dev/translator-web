import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const LEMON_CHECKOUTS_URL = "https://api.lemonsqueezy.com/v1/checkouts";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!storeId || !variantId) {
    return NextResponse.json(
      { error: "Missing LEMONSQUEEZY_STORE_ID or LEMONSQUEEZY_VARIANT_ID" },
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
