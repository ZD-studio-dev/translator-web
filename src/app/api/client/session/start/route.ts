import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  HEARTBEAT_INTERVAL_SEC,
  isProActive,
  issueEphemeralCredentials,
  MIN_CREDITS_TO_START,
  parseCredits,
  parseSessionMode,
  type ProfileCreditsRow,
  type SessionMode,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

type StartBody = {
  provider?: "openai" | "qwen" | "doubao";
  mode?: SessionMode;
};

export async function POST(request: Request) {
  const auth = await getClientUserId(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: StartBody = {};
  try {
    body = (await request.json()) as StartBody;
  } catch {
    body = {};
  }

  const provider = body.provider ?? "openai";
  if (!["openai", "qwen", "doubao"].includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const mode = parseSessionMode(body.mode);

  try {
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(
        "credits_balance, plan_tier, is_pro, plan, subscription_expires_at",
      )
      .eq("id", auth.userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileRow = profile as ProfileCreditsRow;
    const creditsBalance = parseCredits(profileRow.credits_balance);
    const proActive = isProActive(profileRow);
    const skipBalanceCheck = proActive && mode === "s2t";

    if (!skipBalanceCheck && creditsBalance < MIN_CREDITS_TO_START) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          credits_balance: creditsBalance,
          remaining_seconds: creditsBalance,
        },
        { status: 402 },
      );
    }

    const now = new Date().toISOString();
    const { data: session, error: sessionError } = await admin
      .from("translation_sessions")
      .insert({
        user_id: auth.userId,
        status: "active",
        started_at: now,
        last_billed_at: now,
        total_seconds: 0,
        total_credits_charged: 0,
        provider,
        session_mode: mode,
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("session start insert error:", sessionError);
      return NextResponse.json(
        { error: "Failed to start session" },
        { status: 500 },
      );
    }

    const sessionId = session.id as string;
    const credentials = await issueEphemeralCredentials(sessionId, provider);

    return NextResponse.json({
      session_id: sessionId,
      ws_url: credentials.ws_url,
      ephemeral_token: credentials.ephemeral_token,
      credits_balance: creditsBalance,
      remaining_seconds: creditsBalance,
      heartbeat_interval_sec: HEARTBEAT_INTERVAL_SEC,
      provider,
      mode,
      unlimited_s2t: proActive && mode === "s2t",
    });
  } catch (err) {
    console.error("POST /api/client/session/start error:", err);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 },
    );
  }
}
