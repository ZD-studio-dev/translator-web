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

export type RealtimeProvider = "openai" | "qwen" | "doubao";

export type EphemeralCredentials = {
  ws_url: string;
  ephemeral_token: string;
};

const OPENAI_REALTIME_MODEL = "gpt-4o-realtime-preview";
const OPENAI_REALTIME_WS_URL = `wss://api.openai.com/v1/realtime?model=${OPENAI_REALTIME_MODEL}`;
const QWEN_REALTIME_WS_URL =
  "wss://dashscope.aliyuncs.com/api-ws/v1/realtime";
const DOUBAO_REALTIME_WS_URL =
  process.env.DOUBAO_WS_URL ??
  "wss://openspeech.bytedance.com/api/v3/realtime/dialogue";
const DOUBAO_RESOURCE_ID =
  process.env.DOUBAO_RESOURCE_ID ?? "volc.speech.dialog";
const DOUBAO_APP_KEY =
  process.env.DOUBAO_APP_KEY ?? "PlgvMymc7f3tQnJ6";

function mockEphemeralCredentials(
  sessionId: string,
  provider: RealtimeProvider,
  wsUrl: string,
): EphemeralCredentials {
  return {
    ws_url: wsUrl,
    ephemeral_token: `eph_mock_${provider}_${sessionId}`,
  };
}

async function issueOpenAiCredentials(
  sessionId: string,
): Promise<EphemeralCredentials | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_REALTIME_MODEL,
        voice: "verse",
      }),
    });

    if (!res.ok) {
      console.error("OpenAI Realtime session error:", await res.text());
      return null;
    }

    const data = (await res.json()) as {
      client_secret?: { value?: string };
    };
    const token = data.client_secret?.value;
    if (!token) {
      return null;
    }

    return {
      ws_url: OPENAI_REALTIME_WS_URL,
      ephemeral_token: token,
    };
  } catch (err) {
    console.error("OpenAI Realtime session error:", err);
    return null;
  }
}

async function issueQwenCredentials(
  sessionId: string,
): Promise<EphemeralCredentials | null> {
  const apiKey = process.env.DASHSCOPE_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  try {
    const res = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/tokens?expire_in_seconds=60",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!res.ok) {
      console.error("DashScope token error:", await res.text());
      return null;
    }

    const data = (await res.json()) as {
      token?: string;
      code?: string;
      message?: string;
    };

    if (!data.token) {
      console.error(
        "DashScope token missing in response:",
        data.code ?? data.message ?? sessionId,
      );
      return null;
    }

    return {
      ws_url: QWEN_REALTIME_WS_URL,
      ephemeral_token: data.token,
    };
  } catch (err) {
    console.error("DashScope token error:", err);
    return null;
  }
}

function issueDoubaoCredentials(
  sessionId: string,
): EphemeralCredentials | null {
  const appId = process.env.DOUBAO_APP_ID?.trim();
  const accessKey = process.env.DOUBAO_ACCESS_KEY?.trim();
  if (!appId || !accessKey) {
    return null;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 60;
  const authBundle = {
    app_id: appId,
    access_key: accessKey,
    resource_id: DOUBAO_RESOURCE_ID,
    app_key: DOUBAO_APP_KEY,
    connect_id: sessionId,
    expires_at: expiresAt,
  };

  return {
    ws_url: DOUBAO_REALTIME_WS_URL,
    ephemeral_token: JSON.stringify(authBundle),
  };
}

export async function issueEphemeralCredentials(
  sessionId: string,
  provider: RealtimeProvider,
): Promise<EphemeralCredentials> {
  if (provider === "openai") {
    const creds = await issueOpenAiCredentials(sessionId);
    return (
      creds ??
      mockEphemeralCredentials(sessionId, provider, OPENAI_REALTIME_WS_URL)
    );
  }

  if (provider === "qwen") {
    const creds = await issueQwenCredentials(sessionId);
    return (
      creds ?? mockEphemeralCredentials(sessionId, provider, QWEN_REALTIME_WS_URL)
    );
  }

  if (provider === "doubao") {
    const creds = issueDoubaoCredentials(sessionId);
    return (
      creds ??
      mockEphemeralCredentials(sessionId, provider, DOUBAO_REALTIME_WS_URL)
    );
  }

  return mockEphemeralCredentials(sessionId, "openai", OPENAI_REALTIME_WS_URL);
}
