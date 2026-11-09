import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  isProActive,
  normalizeSubscriptionPeriod,
  parseCredits,
  type ProfileCreditsRow,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const auth = await getClientUserId(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const admin = createAdminClient();
    const { data: profile, error } = await admin
      .from("profiles")
      .select(
        "email, plan_tier, credits_balance, is_pro, plan, subscription_period, subscription_expires_at",
      )
      .eq("id", auth.userId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const row = profile as ProfileCreditsRow;
    const remainingSeconds = parseCredits(row.credits_balance);
    const planTier =
      row.plan_tier ?? (row.plan === "pro" ? "pro" : "free");
    const proActive = isProActive(row);

    return NextResponse.json({
      id: auth.userId,
      user_id: auth.userId,
      email: row.email,
      plan_tier: planTier,
      credits_balance: remainingSeconds,
      is_pro: proActive,
      remaining_seconds: remainingSeconds,
      remaining_minutes: Math.floor(remainingSeconds / 60),
      unlimited_s2t: proActive,
      subscription_period: normalizeSubscriptionPeriod(row.subscription_period),
      subscription_expires_at: row.subscription_expires_at ?? null,
    });
  } catch (err) {
    console.error("GET /api/client/user error:", err);
    return NextResponse.json(
      { error: "Failed to load user profile" },
      { status: 500 },
    );
  }
}
