export const instant = false;

import type { Metadata } from "next";
import { connection } from "next/server";
import { FaqPageClient } from "@/app/faq/faq-page-client";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Help Center & FAQ — Real-Time Translator",
  description:
    "Setup guides and answers for Real-Time Translator on macOS, Windows, accounts, billing, and audio troubleshooting.",
};

export default async function FaqPage() {
  await connection();
  let userEmail: string | null = null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return <FaqPageClient userEmail={userEmail} />;
}
