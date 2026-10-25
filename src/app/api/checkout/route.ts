import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

type VariantResponse = {
  data?: {
    relationships?: { store?: { data?: { id?: string } } };
  };
  included?: Array<{ type?: string; id?: string }>;
};

async function getStoreIdForVariant(
  apiKey: string,
  variantId: string,
): Promise<string | null> {
  const envStoreId = process.env.LEMONSQUEEZY_STORE_ID;

  const res = await fetch(
    `${LEMON_API}/variants/${variantId}?include=store`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error(
      "Lemon Squeezy variant fetch error:",
      detail || res.statusText,
    );
    return envStoreId ?? null;
  }

  const json = (await res.json()) as VariantResponse;

  const storeIdFromRelationship =
    json.data?.relationships?.store?.data?.id ?? null;
  if (storeIdFromRelationship) {
    return storeIdFromRelationship;
  }

  const storeFromIncluded = json.included?.find(
    (item) => item.type === "stores" && item.id,
  );
  if (storeFromIncluded?.id) {
    return storeFromIncluded.id;
  }

  return envStoreId ?? null;
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

    if (!storeId) {
      return NextResponse.json(
        {
          error:
            "Could not resolve Lemon Squeezy store ID. Set LEMONSQUEEZY_STORE_ID or check the variant ID.",
        },
        { status: 500 },
      );
    }

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
      const detailText = await res.text();
      let detailJson: unknown = detailText;
      try {
        detailJson = JSON.parse(detailText) as unknown;
      } catch {
        // keep raw text
      }
      console.error(
        "Lemon Squeezy checkout error:",
        JSON.stringify(detailJson, null, 2),
      );
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
