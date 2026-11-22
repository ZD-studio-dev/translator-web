export const instant = false;

import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { AudioLines } from "lucide-react";
import { PricingSection } from "@/components/PricingSection";
import { LanguageToggle } from "@/components/language-toggle";
import { loadBillingProfile, resolveMembershipPlan } from "@/utils/membership-plan";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Pricing — Real-Time Translator",
  description:
    "Membership and extra translation time for real-time subtitles and voice interpretation.",
};

function emailLocalPart(email: string): string {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

export default async function PricingPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userEmail = user?.email ?? null;
  const profile = user ? await loadBillingProfile(supabase, user.id) : null;
  const membership = user
    ? await resolveMembershipPlan(supabase, user.id, profile)
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="https://www.zdtranslate.com/" className="flex items-center gap-3 font-bold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-200">
              <AudioLines className="h-5 w-5" />
            </span>
            Real-Time Translator
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {userEmail ? (
              <Link
                href="/dashboard"
                title={userEmail}
                className="flex h-10 max-w-[190px] items-center gap-2 rounded-xl bg-blue-600 px-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 sm:px-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-black ring-1 ring-white/40">
                  {(emailLocalPart(userEmail)[0] ?? "?").toUpperCase()}
                </span>
                <span className="hidden truncate sm:inline">{emailLocalPart(userEmail)}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>
        <PricingSection
          defaultTab="membership"
          isPro={membership?.isPro ?? false}
          isLoggedIn={Boolean(user)}
          planTier={membership?.planTier ?? null}
          customerPortalUrl={profile?.customer_portal_url ?? null}
        />
      </main>
    </div>
  );
}
