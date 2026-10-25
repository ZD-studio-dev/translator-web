import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

async function getStoreIdForVariant(apiKey: string, variantId: string) {
  const res = await fetch(`${LEMON_API}/variants/${variantId}`, {
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load Lemon Squeezy variant");
  }

  const json = (await res.json()) as {
    data?: { relationships?: { store?: { data?: { id?: string } } } };
  };
  const storeId = json.data?.relationships?.store?.data?.id;
  if (!storeId) {
    throw new Error("Variant is missing store relationship");
  }
  return storeId;
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!apiKey || !variantId) {
    return NextResponse.json(
      { error: "Checkout is not configured" },
      { status: 500 },
    );
  }

  const email = user.email;
  if (!email) {
    return NextResponse.json(
      { error: "Account email is required for checkout" },
      { status: 400 },
    );
  }

  try {
    const storeId = await getStoreIdForVariant(apiKey, variantId);

    const res = await fetch(`${LEMON_API}/checkouts`, {
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
              email,
              custom: {
                user_id: user.id,
              },
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: storeId },
            },
            variant: {
              data: { type: "variants", id: variantId },
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Lemon Squeezy checkout error:", detail);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 502 },
      );
    }

    const json = (await res.json()) as {
      data?: { attributes?: { url?: string } };
    };
    const url = json.data?.attributes?.url;

    if (!url) {
      return NextResponse.json(
        { error: "Checkout URL missing from Lemon Squeezy response" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Checkout route error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
