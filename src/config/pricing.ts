export type CheckoutPlan = "pro_monthly";
export type CheckoutPackId = "starter" | "popular" | "pro";

export type CheckoutPayload =
  | { plan: CheckoutPlan }
  | { pack_id: CheckoutPackId };

export function resolveCheckoutVariantId(payload: CheckoutPayload): string | null {
  if ("pack_id" in payload) {
    const packVariants: Record<CheckoutPackId, string | undefined> = {
      starter: process.env.LEMONSQUEEZY_VARIANT_PACK_STARTER,
      popular: process.env.LEMONSQUEEZY_VARIANT_PACK_POPULAR,
      pro: process.env.LEMONSQUEEZY_VARIANT_PACK_PRO,
    };
    return packVariants[payload.pack_id] ?? null;
  }

  return (
    process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY ??
    process.env.LEMONSQUEEZY_VARIANT_ID ??
    null
  );
}
