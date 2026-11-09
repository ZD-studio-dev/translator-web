import type { SupabaseClient } from "@supabase/supabase-js";

export const MIN_CREDITS_TO_START = 30;
export const HEARTBEAT_MAX_ELAPSED_SEC = 45;
export const LOW_CREDITS_STOP_THRESHOLD = 10;
export const GRACE_PERIOD_SEC = 5;
export const HEARTBEAT_INTERVAL_SEC = 30;

export type SessionMode = "s2t" | "s2s";

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
  session_mode?: string | null;
};

export type ProfileCreditsRow = {
  email: string | null;
  plan_tier: string | null;
  credits_balance: number;
  is_pro: boolean | null;
  plan?: string | null;
  subscription_expires_at?: string | null;
  subscription_period?: string | null;
  subscription_status?: string | null;
};

export function parseSessionMode(value: unknown): SessionMode {
  return value === "s2t" ? "s2t" : "s2s";
}

export function getSessionModeFromRow(session: TranslationSessionRow): SessionMode {
  return parseSessionMode(session.session_mode);
}

const PRO_PLAN_TIERS = new Set(["pro", "pro_monthly", "pro_quarterly"]);

export function isProTier(planTier: string | null | undefined): boolean {
  if (!planTier) return false;
  return PRO_PLAN_TIERS.has(planTier.toLowerCase());
}

/** Active Pro membership (unlimited S2T + S2S billing rules). */
export function isProActive(profile: {
  plan_tier?: string | null;
  is_pro?: boolean | null;
  plan?: string | null;
  subscription_expires_at?: string | null;
}): boolean {
  const tier = profile.plan_tier?.toLowerCase() ?? null;
  const tierIsPro =
    isProTier(tier) ||
    profile.is_pro === true ||
    profile.plan === "pro" ||
    tier === "pro_monthly" ||
    tier === "pro_quarterly";

  if (!tierIsPro) {
    return false;
  }

  const expiresRaw = profile.subscription_expires_at;
  if (!expiresRaw) {
    return true;
  }

  const expiresAt = new Date(expiresRaw);
  if (Number.isNaN(expiresAt.getTime())) {
    return true;
  }

  return expiresAt > new Date();
}

export function shouldChargeSessionSeconds(
  proActive: boolean,
  mode: SessionMode,
): boolean {
  if (proActive && mode === "s2t") {
    return false;
  }
  return true;
}

export function computeBillableCharge(
  proActive: boolean,
  mode: SessionMode,
  elapsedSeconds: number,
  remainingSeconds: number,
): number {
  if (!shouldChargeSessionSeconds(proActive, mode)) {
    return 0;
  }
  return Math.min(remainingSeconds, elapsedSeconds);
}

export function normalizeSubscriptionPeriod(
  value: string | null | undefined,
): "monthly" | "quarterly" | null {
  if (value === "monthly" || value === "quarterly") {
    return value;
  }
  if (value === "pro_monthly") return "monthly";
  if (value === "pro_quarterly") return "quarterly";
  return null;
}

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

export class EphemeralCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EphemeralCredentialsError";
  }
}

const OPENAI_REALTIME_MODEL =
  process.env.OPENAI_REALTIME_MODEL?.trim() ?? "gpt-4o-realtime-preview";
const OPENAI_REALTIME_WS_URL =
  process.env.OPENAI_REALTIME_WS_URL?.trim() ??
  `wss://api.openai.com/v1/realtime?model=${OPENAI_REALTIME_MODEL}`;
const DASHSCOPE_TOKENS_URL =
  process.env.DASHSCOPE_TOKENS_URL?.trim() ??
  "https://dashscope.aliyuncs.com/api/v1/tokens?expire_in_seconds=1800";
const QWEN_WS_URL =
  process.env.DASHSCOPE_WS_URL?.trim() ??
  "wss://dashscope.aliyuncs.com/api-ws/v1/inference";
const DOUBAO_REALTIME_WS_URL =
  process.env.DOUBAO_WS_URL ??
  "wss://openspeech.bytedance.com/api/v3/realtime/dialogue";
const DOUBAO_RESOURCE_ID =
  process.env.DOUBAO_RESOURCE_ID ?? "volc.speech.dialog";
const DOUBAO_APP_KEY =
  process.env.DOUBAO_APP_KEY ?? "PlgvMymc7f3tQnJ6";

const PLACEHOLDER_KEY_RE =
  /xxxx|your[_-]?key|placeholder|changeme|replace[_-]?me|example/i;

function isUsableApiKey(
  key: string | undefined,
  options?: { minLength?: number },
): key is string {
  const trimmed = key?.trim();
  if (!trimmed) return false;
  if (PLACEHOLDER_KEY_RE.test(trimmed)) return false;
  const minLength = options?.minLength ?? 8;
  if (trimmed.length < minLength) return false;
  return true;
}

async function issueOpenAiCredentials(
  _sessionId: string,
): Promise<EphemeralCredentials> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!isUsableApiKey(apiKey)) {
    throw new EphemeralCredentialsError("OPENAI_API_KEY is not configured");
  }

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_after: { anchor: "created_at", seconds: 600 },
        session: {
          type: "realtime",
          model: OPENAI_REALTIME_MODEL,
        },
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        value?: string;
        client_secret?: { value?: string };
      };
      const token = data.value ?? data.client_secret?.value;
      if (token) {
        return {
          ws_url: OPENAI_REALTIME_WS_URL,
          ephemeral_token: token,
        };
      }
      console.error("OpenAI client_secrets missing token in response");
    } else {
      console.error("OpenAI client_secrets error:", await res.text());
    }
  } catch (err) {
    console.error("OpenAI client_secrets error:", err);
  }

  return {
    ws_url: OPENAI_REALTIME_WS_URL,
    ephemeral_token: apiKey,
  };
}

async function issueQwenCredentials(
  _sessionId: string,
): Promise<EphemeralCredentials> {
  const apiKey = process.env.DASHSCOPE_API_KEY?.trim();
  if (!isUsableApiKey(apiKey)) {
    throw new EphemeralCredentialsError("DASHSCOPE_API_KEY is not configured");
  }

  try {
    const res = await fetch(DASHSCOPE_TOKENS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (res.ok) {
      const data = (await res.json()) as {
        token?: string;
        code?: string;
        message?: string;
      };

      if (data.token) {
        return {
          ws_url: QWEN_WS_URL,
          ephemeral_token: data.token,
        };
      }
      console.error(
        "DashScope token missing in response:",
        data.code ?? data.message,
      );
    } else {
      console.error("DashScope token error:", await res.text());
    }
  } catch (err) {
    console.error("DashScope token error:", err);
  }

  return {
    ws_url: QWEN_WS_URL,
    ephemeral_token: apiKey,
  };
}

function issueDoubaoCredentials(sessionId: string): EphemeralCredentials {
  const appId = process.env.DOUBAO_APP_ID?.trim();
  const accessKey = process.env.DOUBAO_ACCESS_KEY?.trim();
  if (!isUsableApiKey(appId) || !isUsableApiKey(accessKey)) {
    throw new EphemeralCredentialsError(
      "DOUBAO_APP_ID / DOUBAO_ACCESS_KEY is not configured",
    );
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
    return issueOpenAiCredentials(sessionId);
  }

  if (provider === "qwen") {
    return issueQwenCredentials(sessionId);
  }

  if (provider === "doubao") {
    return issueDoubaoCredentials(sessionId);
  }

  throw new EphemeralCredentialsError(`Unsupported provider: ${provider}`);
}
