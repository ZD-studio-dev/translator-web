export const instant = false;
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/dashboard/dashboard-client";
import { createClient } from "@/utils/supabase/server";

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
    .select("email, plan, is_pro, subscription_status")
    .eq("id", user.id)
    .single();

  const email = profile?.email ?? user.email ?? "Unknown";
  const isPro = profile?.is_pro === true || profile?.plan === "pro";
  const storeUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL?.replace(
    /\/$/,
    "",
  );
  const billingUrl = storeUrl ? `${storeUrl}/billing` : null;

  return (
    <DashboardClient
      email={email}
      isPro={isPro}
      billingUrl={billingUrl}
    />
  );
}
