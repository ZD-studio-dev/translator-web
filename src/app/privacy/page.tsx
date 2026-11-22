export const instant = false;
import type { Metadata } from "next";
import { connection } from "next/server";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Privacy Policy — Real-Time Translator",
  description: "Privacy Policy for Real-Time Translator.",
};

export default async function PrivacyPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LegalDocumentPage doc="privacy" userEmail={user?.email ?? null} />;
}
