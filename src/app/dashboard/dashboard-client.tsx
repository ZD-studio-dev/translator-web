"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AudioLines, Download, Plus } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import type { DashboardCreditTransaction } from "@/app/dashboard/page";
import { SignOutButton } from "@/app/dashboard/sign-out-button";
import { UpgradeProButton } from "@/app/dashboard/upgrade-pro-button";
import { PricingSection, type MembershipPlanTier } from "@/components/PricingSection";
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
  planTier: MembershipPlanTier;
  customerPortalUrl: string | null;
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

function PaymentSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(
    () => searchParams.get("payment") === "success",
  );

  useEffect(() => {
    if (searchParams.get("payment") !== "success") {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace("/dashboard", { scroll: false });
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [searchParams, router]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-center text-sm font-medium text-emerald-800"
      role="status"
    >
      {t.dashboard.paymentSuccessBanner}
    </div>
  );
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
  planTier,
  customerPortalUrl,
  winDownloadUrl,
  macDownloadUrl,
  transactions,
}: DashboardClientProps) {
  const { t, locale } = useLanguage();
  const d = t.dashboard;
  const expiresLabel = formatExpiresAt(subscriptionExpiresAt, locale);
  const [showGrantedNotice, setShowGrantedNotice] = useState(false);
  const portalUrl = customerPortalUrl?.trim() || null;

  function typeLabel(type: string) {
    const map = d.transactionTypes as Record<string, string>;
    return map[type] ?? type;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Suspense fallback={null}>
        <PaymentSuccessBanner />
      </Suspense>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-900"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white"
              aria-hidden
            >
              <AudioLines className="h-4 w-4" />
            </span>
            {t.common.brand}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {d.creditsOverview}
              </p>
              <p className="mt-2 text-sm text-slate-600">{email}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                {d.voiceTimeLabel}
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-4xl">
                  {formatVoiceTimeRemaining(creditsBalance, locale)}
                </p>
                <span
                  className={`mb-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    isPro
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {isPro ? d.badgePro : d.badgeFree}
                </span>
              </div>
              {isPro && expiresLabel ? (
                <p className="mt-2 text-sm text-slate-600">
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
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
            >
              <Plus className="h-4 w-4" aria-hidden />
              {d.topUpCredits}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">{d.subscription}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {isPro ? d.proSummary : d.freeSummary}
              </p>
              {!isPro ? (
                <div className="mt-5">
                  <UpgradeProButton />
                </div>
              ) : null}
            </div>
            {isPro ? (
              <div className="shrink-0">
                {portalUrl ? (
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    {d.manageSubscription}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowGrantedNotice(true)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                  >
                    {d.manageSubscription}
                  </button>
                )}
                {showGrantedNotice ? (
                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500" role="status">
                    {d.grantedMembershipNotice}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold text-slate-900">{d.desktopTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{d.desktopIntro}</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {d.desktopSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {winDownloadUrl ? (
              <a
                href={winDownloadUrl}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadWindows}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-400"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadWindows}
                <span>· {d.downloadWindowsSoon}</span>
              </button>
            )}
            {macDownloadUrl ? (
              <a
                href={macDownloadUrl}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadMac}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-400"
              >
                <Download className="h-4 w-4" aria-hidden />
                {d.downloadMac}
                <span>· {d.downloadMacSoon}</span>
              </button>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-semibold text-slate-900">
            {d.recentActivity}
          </h2>
          {transactions.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{d.noTransactions}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
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
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => {
                    const amount = Number(tx.amount);
                    const isCredit = amount > 0;
                    return (
                      <tr key={tx.id} className="text-slate-800">
                        <td className="whitespace-nowrap py-3 pr-4 text-slate-600">
                          {formatTransactionDate(tx.created_at, locale)}
                        </td>
                        <td className="py-3 pr-4">{typeLabel(tx.type)}</td>
                        <td className="max-w-xs truncate py-3 pr-4 text-slate-600">
                          {tx.description ?? "—"}
                        </td>
                        <td
                          className={`py-3 pr-4 text-right font-medium tabular-nums ${
                            isCredit ? "text-emerald-700" : "text-slate-500"
                          }`}
                        >
                          {isCredit ? "+" : ""}
                          {amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-right tabular-nums text-slate-600">
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
          isPro={isPro}
          isLoggedIn
          planTier={planTier}
          customerPortalUrl={customerPortalUrl}
        />
      </main>
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-sm text-slate-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/" className="hover:text-slate-900">{d.footerHome}</Link>
            <Link href="/#install" className="hover:text-slate-900">{d.footerInstall}</Link>
            <Link href="/faq" className="hover:text-slate-900">{d.footerFaq}</Link>
            <Link href="/terms" className="hover:text-slate-900">{t.legal.termsOfService}</Link>
            <Link href="/privacy" className="hover:text-slate-900">{t.legal.privacyPolicy}</Link>
          </nav>
          <a href="mailto:support@zdtranslate.com" className="hover:text-slate-900">
            support@zdtranslate.com
          </a>
        </div>
      </footer>
    </div>
  );
}
