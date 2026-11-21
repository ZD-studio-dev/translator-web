export const instant = false;
import type { Metadata } from "next";
import { connection } from "next/server";
import { HomePageClient } from "@/app/home-page-client";
import { resolveCustomerPortalUrl } from "@/config/pricing";
import { type ProfileCreditsRow } from "@/utils/api/client-session";
import { resolveMembershipPlan } from "@/utils/membership-plan";
import { createClient } from "@/utils/supabase/server";

const seoTitle = "ZD Meeting Translator — Real-Time AI Desktop Translator";
const seoDescription =
  "Instant, context-aware screen, voice, and text translation for desktop. Break language barriers seamlessly without switching windows.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  keywords: [
    "AI translation",
    "desktop translator",
    "real-time translation",
    "screen translation",
    "voice translation",
  ],
  openGraph: {
    title: seoTitle,
    description: seoDescription,
  },
};

export default async function Home() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const customerPortalUrl = resolveCustomerPortalUrl(
    process.env.LEMONSQUEEZY_CUSTOMER_PORTAL_URL ??
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_CUSTOMER_PORTAL_URL,
  );

  if (!user) {
    return <HomePageClient userEmail={null} customerPortalUrl={customerPortalUrl} />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "email, plan, is_pro, subscription_status, plan_tier, credits_balance, subscription_period, subscription_expires_at",
    )
    .eq("id", user.id)
    .single();

  const membership = await resolveMembershipPlan(
    supabase,
    user.id,
    (profile as ProfileCreditsRow | null) ?? null,
  );

  return (
    <HomePageClient
      userEmail={profile?.email ?? user.email ?? null}
      isPro={membership.isPro}
      planTier={membership.planTier}
      customerPortalUrl={customerPortalUrl}
    />
  );
}
