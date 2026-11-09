import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  buildClientUserStatusFields,
  CLIENT_PROFILE_SELECT,
  EphemeralCredentialsError,
  HEARTBEAT_INTERVAL_SEC,
  isUserPro,
  issueEphemeralCredentials,
  MIN_CREDITS_TO_START,
  parseCredits,
  parseSessionModeFromBody,
  type ProfileCreditsRow,
  type SessionMode,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

type StartBody = {
  provider?: "openai" | "qwen" | "doubao";
  mode?: SessionMode | string;
  session_mode?: SessionMode | string;
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

  const mode = parseSessionModeFromBody(body);

  try {
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(CLIENT_PROFILE_SELECT)
      .eq("id", auth.userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileRow = profile as ProfileCreditsRow;
    const creditsBalance = parseCredits(profileRow.credits_balance);
    const proActive = isUserPro(profileRow, admin);
    const userStatus = buildClientUserStatusFields(profileRow, {
      creditsBalance,
    });
    const skipBalanceCheck = proActive && mode === "s2t";

    if (!skipBalanceCheck && creditsBalance < MIN_CREDITS_TO_START) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          ...userStatus,
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
    let credentials;
    try {
      credentials = await issueEphemeralCredentials(sessionId, provider);
    } catch (credErr) {
      if (credErr instanceof EphemeralCredentialsError) {
        await admin
          .from("translation_sessions")
          .update({
            status: "ended",
            ended_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
        return NextResponse.json(
          { error: credErr.message, provider },
          { status: 503 },
        );
      }
      throw credErr;
    }

    return NextResponse.json({
      session_id: sessionId,
      ws_url: credentials.ws_url,
      ephemeral_token: credentials.ephemeral_token,
      heartbeat_interval_sec: HEARTBEAT_INTERVAL_SEC,
      provider,
      mode,
      ...userStatus,
    });
  } catch (err) {
    console.error("POST /api/client/session/start error:", err);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 },
    );
  }
}
