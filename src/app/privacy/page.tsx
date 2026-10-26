export const instant = false;
import type { Metadata } from "next";
import { connection } from "next/server";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Privacy Policy — ZD Translate",
  description: "Privacy Policy for ZD Translate.",
};

export default async function PrivacyPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LegalDocumentPage doc="privacy" isLoggedIn={!!user} />;
}
