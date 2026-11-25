import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isUserPro,
  logDbError,
  readDashscopeApiKeys,
  type ProfileCreditsRow,
} from "@/utils/api/client-session";
import {
  deletePublicObject,
  readR2Config,
  uploadPublicObject,
  type R2Config,
} from "@/utils/api/r2";

export const VOICE_CLONE_LIMIT = 3;
export const VOICE_CLONE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_VOICE_AUDIO_BYTES = 10 * 1024 * 1024;

const DASHSCOPE_ENROLL_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/audio/tts/customization";
const VOICE_TARGET_MODEL = "qwen3.5-livetranslate-flash-realtime";

const AUDIO_TYPES: Record<string, string> = {
  wav: "audio/wav",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
};

export type VoiceProfileRow = ProfileCreditsRow & {
  voice_clone_count: number | null;
  voice_clone_updated_at: string | null;
};

export class VoiceEnrollError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "VoiceEnrollError";
    this.status = status;
  }
}

export function readS2sVoiceId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function voicePreferredName(userId: string): string {
  const shortId = userId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  return `u_${shortId || "user"}`;
}

export function voiceCloneLimitReached(
  count: number,
  updatedAt: string | null,
  now = Date.now(),
): boolean {
  if (count < VOICE_CLONE_LIMIT) return false;
  if (!updatedAt) return true;
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(updated)) return true;
  return now - updated < VOICE_CLONE_WINDOW_MS;
}

export function nextVoiceCloneCount(
  count: number,
  updatedAt: string | null,
  now = Date.now(),
): number {
  if (!updatedAt) return count + 1;
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(updated) || now - updated >= VOICE_CLONE_WINDOW_MS) {
    return 1;
  }
  return count + 1;
}

export function readUploadedAudio(form: FormData): File | null {
  for (const key of ["audio", "file", "voice"]) {
    const value = form.get(key);
    if (value instanceof File) return value;
  }
  for (const value of form.values()) {
    if (value instanceof File) return value;
  }
  return null;
}

export function audioExtension(file: File): "wav" | "mp3" | "m4a" | null {
  const fromName = file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (fromName === "wav" || fromName === "mp3" || fromName === "m4a") {
    return fromName;
  }
  const mime = file.type.toLowerCase();
  if (mime === "audio/wav" || mime === "audio/x-wav" || mime === "audio/wave") {
    return "wav";
  }
  if (mime === "audio/mpeg" || mime === "audio/mp3") return "mp3";
  if (mime === "audio/mp4" || mime === "audio/m4a" || mime === "audio/x-m4a") {
    return "m4a";
  }
  return null;
}

export async function loadS2sVoiceId(
  admin: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await admin
    .from("profiles")
    .select("s2s_voice_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    if (/s2s_voice_id/i.test(error.message ?? "")) {
      logDbError(
        "profiles.s2s_voice_id is missing; session will use the default voice",
        error,
        { userId },
      );
      return null;
    }
    throw error;
  }

  return readS2sVoiceId(data?.s2s_voice_id);
}

export function assertCanEnrollVoice(profile: VoiceProfileRow): void {
  if (!isUserPro(profile)) {
    throw new VoiceEnrollError("Pro membership required", 403);
  }
  const count = Number(profile.voice_clone_count ?? 0);
  if (
    voiceCloneLimitReached(
      Number.isFinite(count) ? count : 0,
      profile.voice_clone_updated_at,
    )
  ) {
    throw new VoiceEnrollError(
      "Voice enrollment is limited to 3 times every 30 days",
      429,
    );
  }
}

async function createDashscopeVoice(
  audioUrl: string,
  preferredName: string,
): Promise<string> {
  const keys = readDashscopeApiKeys();
  if (keys.length === 0) {
    throw new VoiceEnrollError("DASHSCOPE_API_KEY is not configured", 500);
  }

  const failures: string[] = [];
  for (let index = 0; index < keys.length; index += 1) {
    const keyNumber = index + 1;
    try {
      const response = await fetch(DASHSCOPE_ENROLL_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keys[index]}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-voice-enrollment",
          input: {
            action: "create",
            target_model: VOICE_TARGET_MODEL,
            preferred_name: preferredName,
            audio: { data: audioUrl },
          },
        }),
      });
      const raw = await response.text();
      const payload = parseDashscopePayload(raw);
      const voice = payload.output?.voice?.trim();
      if (response.ok && voice) {
        console.info(`[dashscope] voice enrollment using key #${keyNumber}`, {
          requestId: payload.request_id,
        });
        return voice;
      }
      console.error(`[dashscope] voice enrollment key #${keyNumber} failed`, {
        status: response.status,
        code: payload.code,
        message: payload.message,
        requestId: payload.request_id,
      });
      failures.push(
        `key #${keyNumber} HTTP ${response.status}${payload.code ? ` ${payload.code}` : ""}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "request failed";
      console.error(
        `[dashscope] voice enrollment key #${keyNumber} request error:`,
        message,
      );
      failures.push(`key #${keyNumber} ${message}`);
    }
  }

  throw new VoiceEnrollError(
    `Voice enrollment failed (${failures.join("; ") || "no key attempted"})`,
    502,
  );
}

function parseDashscopePayload(raw: string): {
  output?: { voice?: string };
  code?: string;
  message?: string;
  request_id?: string;
} {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as {
      output?: { voice?: string };
      code?: string;
      message?: string;
      request_id?: string;
    };
  } catch {
    return { message: raw.slice(0, 180) };
  }
}

export async function saveEnrolledVoice(
  admin: SupabaseClient,
  userId: string,
  voiceId: string,
  cloneCount: number,
): Promise<void> {
  const { data, error } = await admin
    .from("profiles")
    .update({
      s2s_voice_id: voiceId,
      voice_clone_count: cloneCount,
      voice_clone_updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("s2s_voice_id, voice_clone_count");

  if (error || !data || data.length !== 1) {
    const failure =
      error ??
      new Error(
        `profiles voice update matched ${data?.length ?? 0} rows for user ${userId}`,
      );
    logDbError("profiles voice enrollment update failed", failure, {
      userId,
      voiceId,
    });
    throw new VoiceEnrollError("Failed to save voice profile", 500);
  }
}

export async function clearEnrolledVoice(
  admin: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data, error } = await admin
    .from("profiles")
    .update({ s2s_voice_id: null })
    .eq("id", userId)
    .select("s2s_voice_id");

  if (error || !data || data.length !== 1) {
    const failure =
      error ??
      new Error(
        `profiles voice clear matched ${data?.length ?? 0} rows for user ${userId}`,
      );
    logDbError("profiles voice clear failed", failure, { userId });
    throw new VoiceEnrollError("Failed to clear voice profile", 500);
  }
}

export async function enrollVoiceFromAudio(params: {
  admin: SupabaseClient;
  userId: string;
  profile: VoiceProfileRow;
  file: File;
}): Promise<string> {
  assertCanEnrollVoice(params.profile);

  const extension = audioExtension(params.file);
  if (!extension || params.file.size > MAX_VOICE_AUDIO_BYTES) {
    throw new VoiceEnrollError(
      "Audio must be a .wav, .m4a, or .mp3 file up to 10MB",
      400,
    );
  }

  const r2 = readR2Config();
  if (!r2) {
    throw new VoiceEnrollError("R2 storage is not configured", 500);
  }

  const audio = Buffer.from(await params.file.arrayBuffer());
  if (audio.length <= 0 || audio.length > MAX_VOICE_AUDIO_BYTES) {
    throw new VoiceEnrollError(
      "Audio must be a .wav, .m4a, or .mp3 file up to 10MB",
      400,
    );
  }

  const objectKey = `tmp-voice/${randomUUID()}.${extension}`;
  let uploaded = false;
  try {
    const audioUrl = await uploadVoiceObject(
      r2,
      objectKey,
      audio,
      AUDIO_TYPES[extension],
    );
    uploaded = true;
    const voiceId = await createDashscopeVoice(
      audioUrl,
      voicePreferredName(params.userId),
    );
    const currentCount = Number(params.profile.voice_clone_count ?? 0);
    await saveEnrolledVoice(
      params.admin,
      params.userId,
      voiceId,
      nextVoiceCloneCount(
        Number.isFinite(currentCount) ? currentCount : 0,
        params.profile.voice_clone_updated_at,
      ),
    );
    return voiceId;
  } finally {
    if (uploaded) {
      try {
        await deletePublicObject(r2, objectKey);
      } catch (err) {
        console.error("[voice] failed to delete temporary R2 audio", {
          objectKey,
          message: err instanceof Error ? err.message : "delete failed",
        });
      }
    }
  }
}

async function uploadVoiceObject(
  config: R2Config,
  objectKey: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  try {
    return await uploadPublicObject(config, objectKey, body, contentType);
  } catch (err) {
    const message = err instanceof Error ? err.message : "upload failed";
    console.error("[voice] temporary R2 upload failed", { objectKey, message });
    throw new VoiceEnrollError("Failed to upload temporary audio", 502);
  }
}
