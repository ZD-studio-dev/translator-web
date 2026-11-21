export const instant = false;
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/dashboard/dashboard-client";
import { loadBillingProfile, resolveMembershipPlan } from "@/utils/membership-plan";
import { createClient } from "@/utils/supabase/server";
import { parseCreditsBalance } from "@/utils/credits";

export type DashboardCreditTransaction = {
  id: string;
  created_at: string;
  type: string;
  description: string | null;
  amount: number;
  balance_after: number;
};

export default async function DashboardPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await loadBillingProfile(supabase, user.id);

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("id, created_at, type, description, amount, balance_after")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const email = profile?.email ?? user.email ?? "Unknown";
  const creditsBalance = parseCreditsBalance(profile?.credits_balance);
  const membership = await resolveMembershipPlan(supabase, user.id, profile);
  const winDownloadUrl =
    process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_WIN_DOWNLOAD_URL?.trim() ||
    null;
  const macDownloadUrl =
    process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ||
    null;

  return (
    <DashboardClient
      email={email}
      isPro={membership.isPro}
      creditsBalance={creditsBalance}
      subscriptionPeriod={membership.subscriptionPeriod}
      subscriptionExpiresAt={profile?.subscription_expires_at ?? null}
      planTier={membership.planTier}
      customerPortalUrl={profile?.customer_portal_url ?? null}
      winDownloadUrl={winDownloadUrl}
      macDownloadUrl={macDownloadUrl}
      transactions={(transactions ?? []) as DashboardCreditTransaction[]}
    />
  );
}
