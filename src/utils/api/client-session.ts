import type { SupabaseClient } from "@supabase/supabase-js";

export const MIN_CREDITS_TO_START = 30;
export const HEARTBEAT_MAX_ELAPSED_SEC = 45;
export const LOW_CREDITS_STOP_THRESHOLD = 10;
export const GRACE_PERIOD_SEC = 5;
export const HEARTBEAT_INTERVAL_SEC = 30;

export type TranslationSessionRow = {
  id: string;
  user_id: string;
  status: string;
  started_at: string;
  last_billed_at: string;
  ended_at: string | null;
  total_seconds: number;
  total_credits_charged: number;
  provider: string | null;
};

export type ProfileCreditsRow = {
  email: string | null;
  plan_tier: string | null;
  credits_balance: number;
  is_pro: boolean | null;
  plan?: string | null;
};

export function parseCredits(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchActiveSession(
  admin: SupabaseClient,
  userId: string,
  sessionId: string,
) {
  const { data, error } = await admin
    .from("translation_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data as TranslationSessionRow | null;
}

export function elapsedSecondsSince(isoTimestamp: string, now = new Date()) {
  const last = new Date(isoTimestamp).getTime();
  const diffMs = now.getTime() - last;
  return Math.max(0, Math.floor(diffMs / 1000));
}

export async function insertCreditTransaction(
  admin: SupabaseClient,
  params: {
    userId: string;
    sessionId: string;
    amount: number;
    balanceAfter: number;
    type: string;
    description: string;
  },
) {
  if (params.amount === 0) return;
  const { error } = await admin.from("credit_transactions").insert({
    user_id: params.userId,
    session_id: params.sessionId,
    amount: params.amount,
    balance_after: params.balanceAfter,
    type: params.type,
    description: params.description,
  });
  if (error) {
    throw error;
  }
}

export async function issueEphemeralCredentials(
  sessionId: string,
  provider: string,
) {
  const wsUrl = "wss://api.openai.com/v1/realtime";

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          client_secret?: { value?: string };
        };
        const token = data.client_secret?.value;
        if (token) {
          return { ws_url: wsUrl, ephemeral_token: token };
        }
      }
    } catch (err) {
      console.error("OpenAI Realtime session error:", err);
    }
  }

  return {
    ws_url: wsUrl,
    ephemeral_token: `eph_mock_${sessionId}`,
  };
}
