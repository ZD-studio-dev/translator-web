export const instant = false;
import type { Metadata } from "next";
import { connection } from "next/server";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Terms of Service — ZD Translate",
  description: "Terms of Service for ZD Translate.",
};

export default async function TermsPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LegalDocumentPage doc="terms" isLoggedIn={!!user} />;
}
