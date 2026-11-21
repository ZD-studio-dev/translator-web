import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  buildClientUserStatusFields,
  CLIENT_PROFILE_SELECT,
  computeBillableCharge,
  elapsedSecondsSince,
  getSessionModeFromRow,
  GRACE_PERIOD_SEC,
  insertCreditTransaction,
  isUserPro,
  parseCredits,
  type ProfileCreditsRow,
  type TranslationSessionRow,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

type StopBody = {
  session_id?: string;
};

export async function POST(request: Request) {
  const auth = await getClientUserId(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: StopBody;
  try {
    body = (await request.json()) as StopBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { data: session, error: sessionError } = await admin
      .from("translation_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", auth.userId)
      .maybeSingle();

    if (sessionError) {
      throw sessionError;
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionRow = session as TranslationSessionRow;
    const mode = getSessionModeFromRow(sessionRow);

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
    let creditsBalance = parseCredits(profileRow.credits_balance);

    const withUserStatus = (balance: number) =>
      buildClientUserStatusFields(profileRow, { creditsBalance: balance });

    if (sessionRow.status !== "active") {
      return NextResponse.json({
        session_id: sessionId,
        status: sessionRow.status,
        total_credits_charged: sessionRow.total_credits_charged,
        total_seconds: sessionRow.total_seconds,
        waived: false,
        charged: 0,
        charged_seconds: 0,
        ...withUserStatus(creditsBalance),
      });
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const totalDurationSec = elapsedSecondsSince(sessionRow.started_at, now);

    if (
      totalDurationSec < GRACE_PERIOD_SEC &&
      sessionRow.total_credits_charged === 0
    ) {
      const { error: completeError } = await admin
        .from("translation_sessions")
        .update({
          status: "completed",
          ended_at: nowIso,
          total_seconds: totalDurationSec,
        })
        .eq("id", sessionId)
        .eq("user_id", auth.userId);

      if (completeError) {
        throw completeError;
      }

      return NextResponse.json({
        session_id: sessionId,
        status: "completed",
        waived: true,
        total_credits_charged: 0,
        total_seconds: totalDurationSec,
        charged: 0,
        charged_seconds: 0,
        ...withUserStatus(creditsBalance),
      });
    }

    const remainingSec = Math.max(
      0,
      elapsedSecondsSince(sessionRow.last_billed_at, now),
    );
    const charge = computeBillableCharge(
      proActive,
      mode,
      remainingSec,
      creditsBalance,
    );
    const newBalance = creditsBalance - charge;
    const totalCharged = sessionRow.total_credits_charged + charge;
    const totalSeconds =
      sessionRow.total_seconds + (remainingSec > 0 ? remainingSec : 0);

    if (charge > 0) {
      const { error: profileUpdateError } = await admin
        .from("profiles")
        .update({ credits_balance: newBalance })
        .eq("id", auth.userId);

      if (profileUpdateError) {
        throw profileUpdateError;
      }
    }

    const { error: sessionUpdateError } = await admin
      .from("translation_sessions")
      .update({
        status: "completed",
        ended_at: nowIso,
        last_billed_at: nowIso,
        total_seconds: totalSeconds,
        total_credits_charged: totalCharged,
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
          mode === "s2s"
            ? "S2S voice session (stop settlement)"
            : "Session stop settlement",
      });
    }

    const finalBalance = charge > 0 ? newBalance : creditsBalance;

    return NextResponse.json({
      session_id: sessionId,
      status: "completed",
      waived: false,
      total_credits_charged: totalCharged,
      total_seconds: totalSeconds,
      charged: charge,
      charged_seconds: charge,
      ...withUserStatus(finalBalance),
    });
  } catch (err) {
    console.error("POST /api/client/session/stop error:", err);
    return NextResponse.json(
      { error: "Failed to stop session" },
      { status: 500 },
    );
  }
}
