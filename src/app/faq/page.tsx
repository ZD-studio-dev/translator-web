export const instant = false;

import type { Metadata } from "next";
import { connection } from "next/server";
import { FaqPageClient } from "@/app/faq/faq-page-client";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Real-Time Translator",
  description:
    "Answers about Real-Time Translator accounts, subscriptions, and meeting setup.",
};

export default async function FaqPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <FaqPageClient userEmail={user?.email ?? null} />;
}
