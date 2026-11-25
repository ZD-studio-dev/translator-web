import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  buildClientUserStatusFields,
  chargeSessionUsage,
  CLIENT_PROFILE_SELECT,
  computeBillableCharge,
  elapsedSecondsSince,
  fetchActiveSession,
  getSessionModeFromRow,
  HEARTBEAT_INTERVAL_SEC,
  HEARTBEAT_MAX_ELAPSED_SEC,
  logDbError,
  LOW_CREDITS_STOP_THRESHOLD,
  parseCredits,
  readReportedSeconds,
  readSessionId,
  resolveBillableSeconds,
  type ProfileCreditsRow,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";
import { loadS2sVoiceId } from "@/utils/api/voice-enroll";

type HeartbeatBody = {
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

  let body: HeartbeatBody;
  try {
    body = (await request.json()) as HeartbeatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = readSessionId(body);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const session = await fetchActiveSession(admin, auth.userId, sessionId);
    const reportedSeconds = readReportedSeconds(body);

    if (!session || session.status !== "active") {
      console.error("heartbeat billing skipped: active session not found", {
        userId: auth.userId,
        sessionId,
        status: session?.status ?? null,
        seconds: reportedSeconds,
      });
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

    if (profileError) {
      logDbError("heartbeat profile read failed", profileError, {
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
    const mode = getSessionModeFromRow(session);
    const now = new Date();
    const creditsBalance = parseCredits(profileRow.credits_balance);
    const elapsedSeconds = Math.min(
      elapsedSecondsSince(session.last_billed_at, now),
      HEARTBEAT_MAX_ELAPSED_SEC,
    );
    const billableSeconds = Math.min(
      resolveBillableSeconds(reportedSeconds, elapsedSeconds),
      HEARTBEAT_MAX_ELAPSED_SEC,
    );
    const charge = computeBillableCharge(billableSeconds, creditsBalance);
    const shouldStop =
      charge > 0 && creditsBalance - charge < LOW_CREDITS_STOP_THRESHOLD;

    const result = await chargeSessionUsage(admin, {
      userId: auth.userId,
      sessionId,
      mode,
      phase: "heartbeat",
      chargeSeconds: billableSeconds,
      currentBalance: creditsBalance,
      priorTotalSeconds: parseCredits(session.total_seconds),
      priorCreditsCharged: parseCredits(session.total_credits_charged),
      sessionPatch: {
        last_billed_at: now.toISOString(),
        ...(shouldStop ? { status: "terminated_no_credits" } : {}),
      },
    });

    const s2sVoiceId = await loadS2sVoiceId(admin, auth.userId);

    return NextResponse.json({
      should_stop: shouldStop,
      charged: result.charged,
      charged_seconds: result.charged,
      heartbeat_interval_sec: HEARTBEAT_INTERVAL_SEC,
      s2s_voice_id: s2sVoiceId,
      ...(shouldStop ? { message: "Out of credits" } : {}),
      ...buildClientUserStatusFields(profileRow, {
        creditsBalance: result.balance,
      }),
    });
  } catch (err) {
    logDbError("POST /api/client/session/heartbeat error", err, {
      userId: auth.userId,
      sessionId,
    });
    return NextResponse.json(
      { error: "Heartbeat processing failed" },
      { status: 500 },
    );
  }
}
