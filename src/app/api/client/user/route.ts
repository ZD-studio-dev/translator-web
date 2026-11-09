import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  buildClientUserStatusFields,
  CLIENT_PROFILE_SELECT,
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
      .select(CLIENT_PROFILE_SELECT)
      .eq("id", auth.userId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const row = profile as ProfileCreditsRow;
    const status = buildClientUserStatusFields(row);

    return NextResponse.json({
      id: auth.userId,
      user_id: auth.userId,
      email: row.email,
      ...status,
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
