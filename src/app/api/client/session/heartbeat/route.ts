import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  buildClientUserStatusFields,
  CLIENT_PROFILE_SELECT,
  computeBillableCharge,
  elapsedSecondsSince,
  fetchActiveSession,
  getSessionModeFromRow,
  HEARTBEAT_MAX_ELAPSED_SEC,
  insertCreditTransaction,
  isUserPro,
  LOW_CREDITS_STOP_THRESHOLD,
  parseCredits,
  type ProfileCreditsRow,
  type TranslationSessionRow,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

type HeartbeatBody = {
  session_id?: string;
};

export async function POST(request: Request) {
  const auth = await getClientUserId(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: HeartbeatBody;
  try {
    body = (await request.json()) as HeartbeatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const session = await fetchActiveSession(admin, auth.userId, sessionId);

    if (!session || session.status !== "active") {
      return NextResponse.json(
        { error: "Active session not found" },
        { status: 404 },
      );
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(CLIENT_PROFILE_SELECT)
      .eq("id", auth.userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileRow = profile as ProfileCreditsRow;
    const proActive = isUserPro(profileRow, admin);
    const mode = getSessionModeFromRow(session);

    const now = new Date();
    const nowIso = now.toISOString();
    let creditsBalance = parseCredits(profileRow.credits_balance);

    const elapsedRaw = elapsedSecondsSince(session.last_billed_at, now);
    const elapsedSeconds = Math.min(elapsedRaw, HEARTBEAT_MAX_ELAPSED_SEC);
    const charge = computeBillableCharge(
      proActive,
      mode,
      elapsedSeconds,
      creditsBalance,
    );
    const newBalance = creditsBalance - charge;

    if (charge > 0) {
      const { error: profileUpdateError } = await admin
        .from("profiles")
        .update({ credits_balance: newBalance })
        .eq("id", auth.userId);

      if (profileUpdateError) {
        throw profileUpdateError;
      }
    }

    const sessionRow = session as TranslationSessionRow;
    const { error: sessionUpdateError } = await admin
      .from("translation_sessions")
      .update({
        last_billed_at: nowIso,
        total_seconds: sessionRow.total_seconds + elapsedSeconds,
        total_credits_charged: sessionRow.total_credits_charged + charge,
      })
      .eq("id", sessionId)
      .eq("user_id", auth.userId);

    if (sessionUpdateError) {
      throw sessionUpdateError;
    }

    if (charge > 0) {
      await insertCreditTransaction(admin, {
        userId: auth.userId,
        sessionId,
        amount: -charge,
        balanceAfter: newBalance,
        type: "session_usage",
        description:
          mode === "s2s" ? "S2S voice session (heartbeat)" : "Session heartbeat",
      });
      creditsBalance = newBalance;
    }

    if (
      charge > 0 &&
      creditsBalance < LOW_CREDITS_STOP_THRESHOLD
    ) {
      await admin
        .from("translation_sessions")
        .update({ status: "terminated_no_credits" })
        .eq("id", sessionId)
        .eq("user_id", auth.userId);

      return NextResponse.json({
        should_stop: true,
        charged: charge,
        charged_seconds: charge,
        message: "Out of credits",
        ...buildClientUserStatusFields(profileRow, {
          creditsBalance: Math.max(0, creditsBalance),
        }),
      });
    }

    return NextResponse.json({
      should_stop: false,
      charged: charge,
      charged_seconds: charge,
      ...buildClientUserStatusFields(profileRow, { creditsBalance }),
    });
  } catch (err) {
    console.error("POST /api/client/session/heartbeat error:", err);
    return NextResponse.json(
      { error: "Heartbeat processing failed" },
      { status: 500 },
    );
  }
}
