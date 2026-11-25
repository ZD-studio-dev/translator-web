import { NextResponse } from "next/server";
import { getClientUserId } from "@/utils/api/client-auth";
import {
  CLIENT_PROFILE_SELECT,
  logDbError,
  parseCredits,
} from "@/utils/api/client-session";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  assertCanEnrollVoice,
  clearEnrolledVoice,
  enrollVoiceFromAudio,
  MAX_VOICE_AUDIO_BYTES,
  readUploadedAudio,
  VoiceEnrollError,
  type VoiceProfileRow,
} from "@/utils/api/voice-enroll";

const VOICE_PROFILE_SELECT =
  `${CLIENT_PROFILE_SELECT}, s2s_voice_id, voice_clone_count, voice_clone_updated_at`;

async function loadVoiceProfile(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select(VOICE_PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    logDbError("voice profile read failed", error, { userId });
    return { admin, error: NextResponse.json(
      { error: "Failed to read voice profile" },
      { status: 500 },
    ) };
  }
  if (!data) {
    return {
      admin,
      error: NextResponse.json({ error: "Profile not found" }, { status: 404 }),
    };
  }

  const row = data as VoiceProfileRow;
  return {
    admin,
    profile: {
      ...row,
      credits_balance: parseCredits(row.credits_balance),
    },
  };
}

export async function POST(request: Request) {
  const auth = await getClientUserId(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const loaded = await loadVoiceProfile(auth.userId);
    if ("error" in loaded) return loaded.error;
    assertCanEnrollVoice(loaded.profile);

    const declaredLength = Number(request.headers.get("content-length"));
    if (
      Number.isFinite(declaredLength) &&
      declaredLength > MAX_VOICE_AUDIO_BYTES + 64 * 1024
    ) {
      return NextResponse.json(
        { error: "Audio must be a .wav, .m4a, or .mp3 file up to 10MB" },
        { status: 400 },
      );
    }

    const form = await request.formData();
    const file = readUploadedAudio(form);
    if (!file) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    const voiceId = await enrollVoiceFromAudio({
      admin: loaded.admin,
      userId: auth.userId,
      profile: loaded.profile,
      file,
    });
    return NextResponse.json({ voice_id: voiceId });
  } catch (err) {
    if (err instanceof VoiceEnrollError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/voice/enroll error:", err);
    return NextResponse.json(
      { error: "Failed to enroll voice" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await getClientUserId(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const admin = createAdminClient();
    await clearEnrolledVoice(admin, auth.userId);
    return NextResponse.json({ s2s_voice_id: null });
  } catch (err) {
    if (err instanceof VoiceEnrollError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("DELETE /api/voice/enroll error:", err);
    return NextResponse.json(
      { error: "Failed to clear voice" },
      { status: 500 },
    );
  }
}
