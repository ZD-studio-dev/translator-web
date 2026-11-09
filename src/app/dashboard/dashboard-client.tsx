"use client";

import Link from "next/link";
import { Download, Plus } from "lucide-react";
import type { DashboardCreditTransaction } from "@/app/dashboard/page";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { UpgradeProButton } from "@/app/dashboard/upgrade-pro-button";
import { PricingSection } from "@/components/PricingSection";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";
import type { Locale } from "@/i18n/dictionaries";
import { formatVoiceTimeRemaining } from "@/utils/credits";

type DashboardClientProps = {
  email: string;
  isPro: boolean;
  creditsBalance: number;
  subscriptionPeriod: "monthly" | "quarterly" | null;
  subscriptionExpiresAt: string | null;
  billingUrl: string | null;
  winDownloadUrl: string | null;
  macDownloadUrl: string | null;
  transactions: DashboardCreditTransaction[];
};

function formatTransactionDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function scrollToTopUp() {
  document.getElementById("dashboard-topup")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function formatExpiresAt(iso: string | null, locale: Locale) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    dateStyle: "medium",
  }).format(date);
}

export function DashboardClient({
  email,
  isPro,
  creditsBalance,
  subscriptionPeriod,
  subscriptionExpiresAt,
  billingUrl,
  winDownloadUrl,
  macDownloadUrl,
  transactions,
}: DashboardClientProps) {
  const { t, locale } = useLanguage();
  const d = t.dashboard;
  const expiresLabel = formatExpiresAt(subscriptionExpiresAt, locale);

  function typeLabel(type: string) {
    const map = d.transactionTypes as Record<string, string>;
    return map[type] ?? type;
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            {t.common.brand}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {d.creditsOverview}
              </p>
              <p className="mt-2 text-sm text-zinc-400">{email}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                {d.voiceTimeLabel}
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
                  {formatVoiceTimeRemaining(creditsBalance, locale)}
                </p>
                <span
                  className={`mb-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    isPro
                      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-zinc-800 text-zinc-300 ring-1 ring-zinc-700"
                  }`}
                >
                  {isPro ? d.badgePro : d.badgeFree}
                </span>
              </div>
              {isPro ? (
                <p className="mt-3 inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300">
                  {d.unlimitedS2t}
                </p>
              ) : null}
              {isPro && expiresLabel ? (
                <p className="mt-2 text-sm text-zinc-400">
                  {d.subscriptionExpires}: {expiresLabel}
                  {subscriptionPeriod
                    ? ` (${subscriptionPeriod === "quarterly" ? "Quarterly" : "Monthly"})`
                    : ""}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={scrollToTopUp}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" aria-hidden />
              {d.topUpCredits}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-white">{d.subscription}</h2>
          {!isPro ? (
            <>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
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

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-white">{d.desktopTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{d.desktopIntro}</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
            {d.desktopSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {winDownloadUrl ? (
              <a
                href={winDownloadUrl}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-600 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadWindows}
              </a>
            ) : (
              <p className="text-sm text-zinc-500">{d.downloadWindowsSoon}</p>
            )}
            {macDownloadUrl ? (
              <a
                href={macDownloadUrl}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-600 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadMac}
              </a>
            ) : (
              <p className="text-sm text-zinc-500">{d.downloadMacSoon}</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-white">
            {d.recentActivity}
          </h2>
          {transactions.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">{d.noTransactions}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-4 font-medium">{d.colTime}</th>
                    <th className="pb-3 pr-4 font-medium">{d.colType}</th>
                    <th className="pb-3 pr-4 font-medium">{d.colDescription}</th>
                    <th className="pb-3 pr-4 font-medium text-right">
                      {d.colAmount}
                    </th>
                    <th className="pb-3 font-medium text-right">
                      {d.colBalance}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {transactions.map((tx) => {
                    const amount = Number(tx.amount);
                    const isCredit = amount > 0;
                    return (
                      <tr key={tx.id} className="text-zinc-300">
                        <td className="py-3 pr-4 whitespace-nowrap text-zinc-400">
                          {formatTransactionDate(tx.created_at, locale)}
                        </td>
                        <td className="py-3 pr-4">{typeLabel(tx.type)}</td>
                        <td className="py-3 pr-4 max-w-xs truncate text-zinc-400">
                          {tx.description ?? "—"}
                        </td>
                        <td
                          className={`py-3 pr-4 text-right tabular-nums font-medium ${
                            isCredit ? "text-emerald-400" : "text-zinc-500"
                          }`}
                        >
                          {isCredit ? "+" : ""}
                          {amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-right tabular-nums text-zinc-400">
                          {Number(tx.balance_after).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <PricingSection
          sectionId="dashboard-topup"
          defaultTab="packs"
          showTitle={false}
          embedded
        />
      </main>
    </div>
  );
}
