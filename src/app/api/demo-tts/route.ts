import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 503 },
    );
  }

  let body: { text?: string; lang?: string };
  try {
    body = (await request.json()) as { text?: string; lang?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim();
  const lang = body.lang === "zh" ? "zh" : "en";

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const voice = lang === "zh" ? "nova" : "alloy";

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      voice,
      input: text,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("OpenAI TTS error:", detail);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 502 },
    );
  }

  const audio = await response.arrayBuffer();
  return new NextResponse(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
