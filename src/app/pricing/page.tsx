export const instant = false;
import type { Metadata } from "next";
import { connection } from "next/server";
import { PricingSection } from "@/components/PricingSection";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Pricing — ZD Translate",
  description:
    "Membership plans and pay-as-you-go credit packs for real-time AI voice translation. 1 credit = 1 second of live interpretation.",
};

export default async function PricingPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader userEmail={user?.email ?? null} sticky={false} />
      <main>
        <PricingSection defaultTab="membership" />
      </main>
    </div>
  );
}
