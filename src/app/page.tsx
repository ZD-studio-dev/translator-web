export const instant = false;
import type { Metadata } from "next";
import { connection } from "next/server";
import { HomePageClient } from "@/app/home-page-client";
import { createClient } from "@/utils/supabase/server";

const seoTitle = "ZD Translate — Real-Time AI Desktop Translator";
const seoDescription =
  "Instant, context-aware screen, voice, and text translation for desktop. Break language barriers seamlessly without switching windows.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  keywords: [
    "AI translation",
    "desktop translator",
    "real-time translation",
    "screen translation",
    "voice translation",
  ],
  openGraph: {
    title: seoTitle,
    description: seoDescription,
  },
};

export default async function Home() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HomePageClient isLoggedIn={!!user} />;
}
