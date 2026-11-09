export type CheckoutPlan = "pro_monthly" | "pro_quarterly";
export type CheckoutPackId = "pack_1h" | "pack_3h" | "pack_10h";

/** Seconds granted (stored in `credits_balance`). */
export const TIME_PACK_GRANTS_SECONDS: Record<CheckoutPackId, number> = {
  pack_1h: 3600,
  pack_3h: 10800,
  pack_10h: 36000,
};

export const PRO_MONTHLY_VOICE_SECONDS = 7200;
export const PRO_QUARTERLY_VOICE_SECONDS = 27000;

/** @deprecated Use TIME_PACK_GRANTS_SECONDS — legacy pack ids */
export const CREDIT_PACK_GRANTS = {
  starter: TIME_PACK_GRANTS_SECONDS.pack_1h,
  popular: TIME_PACK_GRANTS_SECONDS.pack_3h,
  pro: TIME_PACK_GRANTS_SECONDS.pack_10h,
  pack_1h: TIME_PACK_GRANTS_SECONDS.pack_1h,
  pack_3h: TIME_PACK_GRANTS_SECONDS.pack_3h,
  pack_10h: TIME_PACK_GRANTS_SECONDS.pack_10h,
};

export const PRO_MONTHLY_CREDIT_GRANT = PRO_MONTHLY_VOICE_SECONDS;

const LEGACY_PACK_IDS: Record<string, CheckoutPackId> = {
  starter: "pack_1h",
  popular: "pack_3h",
  pro: "pack_10h",
  pack_1h: "pack_1h",
  pack_3h: "pack_3h",
  pack_10h: "pack_10h",
};

export function normalizePackId(
  value: string | undefined,
): CheckoutPackId | null {
  if (!value) return null;
  return LEGACY_PACK_IDS[value] ?? null;
}

export type CheckoutPayload =
  | { plan: CheckoutPlan }
  | { pack_id: CheckoutPackId };

export function resolveCheckoutVariantId(payload: CheckoutPayload): string | null {
  if ("pack_id" in payload) {
    const packVariants: Record<CheckoutPackId, string | undefined> = {
      pack_1h:
        process.env.LEMONSQUEEZY_VARIANT_PACK_1H ??
        process.env.LEMONSQUEEZY_VARIANT_PACK_STARTER,
      pack_3h:
        process.env.LEMONSQUEEZY_VARIANT_PACK_3H ??
        process.env.LEMONSQUEEZY_VARIANT_PACK_POPULAR,
      pack_10h:
        process.env.LEMONSQUEEZY_VARIANT_PACK_10H ??
        process.env.LEMONSQUEEZY_VARIANT_PACK_PRO,
    };
    return packVariants[payload.pack_id] ?? null;
  }

  if (payload.plan === "pro_quarterly") {
    return (
      process.env.LEMONSQUEEZY_VARIANT_PRO_QUARTERLY ??
      process.env.LEMONSQUEEZY_VARIANT_PRO_QUARTERLY_ID ??
      null
    );
  }

  return (
    process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY ??
    process.env.LEMONSQUEEZY_VARIANT_ID ??
    null
  );
}
