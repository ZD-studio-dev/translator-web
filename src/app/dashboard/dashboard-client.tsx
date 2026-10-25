"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { UpgradeProButton } from "@/app/dashboard/upgrade-pro-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";

type DashboardClientProps = {
  email: string;
  isPro: boolean;
  billingUrl: string | null;
};

export function DashboardClient({
  email,
  isPro,
  billingUrl,
}: DashboardClientProps) {
  const { t } = useLanguage();
  const d = t.dashboard;
  const c = t.common;

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            {c.brand}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {d.account}
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
              {isPro ? d.proPlan : d.freePlan}
            </span>
          </div>

          <hr className="my-8 border-zinc-800" />

          <section>
            <h2 className="text-sm font-semibold text-white">{d.subscription}</h2>
            {!isPro ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {d.freeSummary}
                </p>
                <div className="mt-5">
                  <UpgradeProButton />
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-zinc-400">{d.proSummary}</p>
                {billingUrl ? (
                  <a
                    href={billingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-zinc-600 px-5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
                  >
                    {d.manageSubscription}
                  </a>
                ) : null}
              </>
            )}
          </section>

          <hr className="my-8 border-zinc-800" />

          <section className="rounded-lg border border-zinc-700/80 bg-zinc-950/60 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {d.desktopTitle}
                </h2>
                <p className="mt-1 max-w-md text-sm text-zinc-400">
                  {d.desktopBody}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-600 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadDesktop}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
