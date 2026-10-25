export const instant = false;
import Link from "next/link";
import { Download } from "lucide-react";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, plan")
    .eq("id", user.id)
    .single();

  const email = profile?.email ?? user.email ?? "Unknown";
  const plan = profile?.plan === "pro" ? "pro" : "free";
  const isPro = plan === "pro";

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            ZD Translate
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Account
              </p>
              <p className="mt-1 text-lg font-medium text-white">{email}</p>
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${
                isPro
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-zinc-800 text-zinc-300 ring-1 ring-zinc-700"
              }`}
            >
              {isPro ? "Pro Plan" : "Free Plan"}
            </span>
          </div>

          <hr className="my-8 border-zinc-800" />

          <section>
            <h2 className="text-sm font-semibold text-white">Subscription</h2>
            {!isPro ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Free trial: limited minutes of live translation remaining
                  this month. Upgrade to Pro for unlimited usage.
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  Upgrade to Pro ($9.9/mo)
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">
                Your Pro subscription is active. Thank you for supporting ZD
                Translate.
              </p>
            )}
          </section>

          <hr className="my-8 border-zinc-800" />

          <section className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Desktop app
                </h2>
                <p className="mt-1 max-w-md text-sm text-zinc-400">
                  Download the Windows client and sign in with the same account
                  — your Pro benefits sync automatically.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-600 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download Desktop App
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
