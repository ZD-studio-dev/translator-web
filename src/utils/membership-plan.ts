import {
  matchProPlanByVariantId,
  PRO_QUARTERLY_VOICE_SECONDS,
  type CheckoutPlan,
} from "@/config/pricing";
import { isUserPro, type ProfileCreditsRow } from "@/utils/api/client-session";
import type { SupabaseClient } from "@supabase/supabase-js";

export type MembershipSnapshot = {
  isPro: boolean;
  planTier: CheckoutPlan | null;
  subscriptionPeriod: "monthly" | "quarterly" | null;
  hasSubscription: boolean;
};

function explicitPlanTier(planTier: string | null | undefined): CheckoutPlan | null {
  const normalized = planTier?.trim().toLowerCase();
  if (normalized === "pro_monthly" || normalized === "pro_quarterly") {
    return normalized;
  }
  return null;
}

function planTierIsUnspecified(planTier: string | null | undefined): boolean {
  const normalized = planTier?.trim().toLowerCase() ?? "";
  return normalized === "" || normalized === "pro";
}

async function inferLegacyPlanTier(
  supabase: SupabaseClient,
  userId: string,
): Promise<CheckoutPlan> {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("variant_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const fromVariant = matchProPlanByVariantId(
    (subscription as { variant_id?: unknown } | null)?.variant_id,
  );
  if (fromVariant) return fromVariant;

  const { data: grant } = await supabase
    .from("credit_transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "subscription_grant")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (Number(grant?.amount) === PRO_QUARTERLY_VOICE_SECONDS) {
    return "pro_quarterly";
  }
  return "pro_monthly";
}

/** Same Pro plan resolution used by `/dashboard` and the homepage pricing section. */
export async function resolveMembershipPlan(
  supabase: SupabaseClient,
  userId: string,
  profile: ProfileCreditsRow | null,
): Promise<MembershipSnapshot> {
  const isPro = profile ? isUserPro(profile) : false;

  let subscriptionPeriod: "monthly" | "quarterly" | null = null;
  if (profile?.subscription_period === "monthly") subscriptionPeriod = "monthly";
  if (profile?.subscription_period === "quarterly") subscriptionPeriod = "quarterly";

  const storedPlanTier = explicitPlanTier(profile?.plan_tier);
  const planTier = !isPro
    ? null
    : storedPlanTier ??
      (planTierIsUnspecified(profile?.plan_tier)
        ? await inferLegacyPlanTier(supabase, userId)
        : "pro_monthly");

  if (planTier === "pro_quarterly") subscriptionPeriod = "quarterly";
  if (planTier === "pro_monthly") subscriptionPeriod = "monthly";

  const hasSubscription =
    isPro &&
    (subscriptionPeriod !== null ||
      (profile?.subscription_status != null &&
        profile.subscription_status.toLowerCase() !== "expired"));

  return { isPro, planTier, subscriptionPeriod, hasSubscription };
}
