export const instant = false;
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/dashboard/dashboard-client";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, plan, is_pro, subscription_status, plan_tier, credits_balance")
    .eq("id", user.id)
    .single();

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("id, created_at, type, description, amount, balance_after")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const email = profile?.email ?? user.email ?? "Unknown";
  const planTierRaw = profile?.plan_tier ?? (profile?.is_pro ? "pro" : "free");
  const planTier =
    planTierRaw === "pro" || profile?.is_pro || profile?.plan === "pro"
      ? "pro"
      : "free";
  const creditsBalance = parseCreditsBalance(profile?.credits_balance);

  const storeUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL?.replace(
    /\/$/,
    "",
  );
  const billingUrl = storeUrl ? `${storeUrl}/billing` : null;
  const winDownloadUrl = process.env.NEXT_PUBLIC_WIN_DOWNLOAD_URL?.trim() || null;
  const macDownloadUrl = process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() || null;

  return (
    <DashboardClient
      email={email}
      planTier={planTier}
      creditsBalance={creditsBalance}
      billingUrl={billingUrl}
      winDownloadUrl={winDownloadUrl}
      macDownloadUrl={macDownloadUrl}
      transactions={(transactions ?? []) as DashboardCreditTransaction[]}
    />
  );
}
