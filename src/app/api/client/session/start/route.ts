import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  HEARTBEAT_INTERVAL_SEC,
  issueEphemeralCredentials,
  MIN_CREDITS_TO_START,
  parseCredits,
  type ProfileCreditsRow,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

type StartBody = {
  provider?: "openai" | "qwen" | "doubao";
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

  try {
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("credits_balance")
      .eq("id", auth.userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const creditsBalance = parseCredits(
      (profile as ProfileCreditsRow).credits_balance,
    );

    if (creditsBalance < MIN_CREDITS_TO_START) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          credits_balance: creditsBalance,
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
      heartbeat_interval_sec: HEARTBEAT_INTERVAL_SEC,
      provider,
    });
  } catch (err) {
    console.error("POST /api/client/session/start error:", err);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 },
    );
  }
}
