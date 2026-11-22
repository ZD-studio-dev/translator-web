import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  buildClientUserStatusFields,
  chargeSessionUsage,
  CLIENT_PROFILE_SELECT,
  commitSessionUpdate,
  elapsedSecondsSince,
  getSessionModeFromRow,
  GRACE_PERIOD_SEC,
  logDbError,
  parseCredits,
  readReportedSeconds,
  readSessionId,
  resolveBillableSeconds,
  type ProfileCreditsRow,
  type TranslationSessionRow,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";

type StopBody = {
  session_id?: string;
  sessionId?: string;
  seconds?: number;
  elapsed_seconds?: number;
  billable_seconds?: number;
  duration_seconds?: number;
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

  const sessionId = readSessionId(body);
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
      logDbError("stop session read failed", sessionError, {
        userId: auth.userId,
        sessionId,
      });
      return NextResponse.json(
        { error: "Failed to read session" },
        { status: 500 },
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionRow = session as TranslationSessionRow;
    const mode = getSessionModeFromRow(sessionRow);
    const reportedSeconds = readReportedSeconds(body);

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(CLIENT_PROFILE_SELECT)
      .eq("id", auth.userId)
      .single();

    if (profileError) {
      logDbError("stop profile read failed", profileError, {
        userId: auth.userId,
        sessionId,
      });
      return NextResponse.json(
        { error: "Failed to read profile" },
        { status: 500 },
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileRow = profile as ProfileCreditsRow;
    const creditsBalance = parseCredits(profileRow.credits_balance);
    const withUserStatus = (balance: number) =>
      buildClientUserStatusFields(profileRow, { creditsBalance: balance });

    if (sessionRow.status !== "active") {
      if (reportedSeconds !== null && reportedSeconds > 0) {
        console.error("stop billing skipped because session is not active", {
          userId: auth.userId,
          sessionId,
          status: sessionRow.status,
          seconds: reportedSeconds,
        });
      }
      return NextResponse.json({
        session_id: sessionId,
        status: sessionRow.status,
        total_credits_charged: parseCredits(sessionRow.total_credits_charged),
        total_seconds: parseCredits(sessionRow.total_seconds),
        waived: false,
        charged: 0,
        charged_seconds: 0,
        ...withUserStatus(creditsBalance),
      });
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const totalDurationSec = elapsedSecondsSince(sessionRow.started_at, now);
    const priorCharged = parseCredits(sessionRow.total_credits_charged);
    const hasReportedUsage = reportedSeconds !== null && reportedSeconds > 0;

    if (
      !hasReportedUsage &&
      totalDurationSec < GRACE_PERIOD_SEC &&
      priorCharged === 0
    ) {
      await commitSessionUpdate(admin, sessionId, auth.userId, {
        status: "completed",
        ended_at: nowIso,
        total_seconds: totalDurationSec,
      });

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

    const billableSeconds = resolveBillableSeconds(
      reportedSeconds,
      elapsedSecondsSince(sessionRow.last_billed_at, now),
    );
    const result = await chargeSessionUsage(admin, {
      userId: auth.userId,
      sessionId,
      mode,
      phase: "stop",
      chargeSeconds: billableSeconds,
      currentBalance: creditsBalance,
      priorTotalSeconds: parseCredits(sessionRow.total_seconds),
      priorCreditsCharged: priorCharged,
      sessionPatch: {
        status: "completed",
        ended_at: nowIso,
        last_billed_at: nowIso,
      },
    });

    return NextResponse.json({
      session_id: sessionId,
      status: "completed",
      waived: false,
      total_credits_charged: priorCharged + result.charged,
      total_seconds: parseCredits(sessionRow.total_seconds) + result.charged,
      charged: result.charged,
      charged_seconds: result.charged,
      ...withUserStatus(result.balance),
    });
  } catch (err) {
    logDbError("POST /api/client/session/stop error", err, {
      userId: auth.userId,
      sessionId,
    });
    return NextResponse.json(
      { error: "Failed to stop session" },
      { status: 500 },
    );
  }
}
