"use client";

import { Check, Clock3, Sparkles } from "lucide-react";
import { useState } from "react";
import { GetStartedButton } from "@/app/get-started-button";
import { CheckoutButton } from "@/components/checkout-button";
import {
  formatUsd,
  PACK_USD,
  PRICING_USD,
  PRO_QUARTERLY_COMPARE_AT_USD,
  resolveCustomerPortalUrl,
  type CheckoutPlan,
} from "@/config/pricing";
import { useLanguage } from "@/i18n/language-provider";

export type MembershipPlanTier = CheckoutPlan | null;

type PricingSectionProps = {
  sectionId?: string;
  defaultTab?: "membership" | "packs";
  showTitle?: boolean;
  embedded?: boolean;
  isPro?: boolean;
  planTier?: MembershipPlanTier;
  customerPortalUrl?: string | null;
};

type PlanAction = "checkout" | "current" | "portal" | "blocked";

function planAction(
  plan: CheckoutPlan,
  isPro: boolean,
  planTier: MembershipPlanTier,
): PlanAction {
  if (!isPro) return "checkout";
  if (planTier === "pro_quarterly") {
    return plan === "pro_quarterly" ? "current" : "blocked";
  }
  return plan === "pro_monthly" ? "current" : "portal";
}

export function PricingSection({
  sectionId = "pricing-section",
  defaultTab = "membership",
  showTitle = true,
  embedded = false,
  isPro = false,
  planTier = null,
  customerPortalUrl = null,
}: PricingSectionProps) {
  const { t } = useLanguage();
  const p = t.pricing;
  const c = t.common;
  const [tab, setTab] = useState<"membership" | "packs">(defaultTab);
  const portalUrl = resolveCustomerPortalUrl(customerPortalUrl);
  const activePlan: MembershipPlanTier = isPro
    ? planTier === "pro_quarterly"
      ? "pro_quarterly"
      : "pro_monthly"
    : null;

  const tabClass = (active: boolean) =>
    active
      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
      : "text-slate-500 hover:bg-white hover:text-slate-900";

  const packCards = [
    { id: "pack_1h" as const, highlight: false, bestValue: false, copy: p.packs.pack1h },
    { id: "pack_3h" as const, highlight: true, bestValue: false, copy: p.packs.pack3h },
    { id: "pack_10h" as const, highlight: false, bestValue: true, copy: p.packs.pack10h },
  ];

  const checkIcon = (tone: "soft" | "blue" | "violet" = "blue") => (
    <span
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
        tone === "soft"
          ? "bg-blue-50 text-blue-600"
          : tone === "violet"
            ? "bg-violet-600 text-white"
            : "bg-blue-600 text-white"
      }`}
      aria-hidden
    >
      <Check className="h-3 w-3" />
    </span>
  );

  return (
    <section
      id={sectionId}
      className={
        embedded
          ? "scroll-mt-24 rounded-[26px] border border-blue-100 bg-white py-8 shadow-sm sm:py-10"
          : "scroll-mt-24 bg-white px-5 pb-10 pt-1 sm:px-8 sm:pb-12 sm:pt-2"
      }
    >
      <div className={embedded ? "px-6 sm:px-8" : "mx-auto max-w-5xl"}>
        {showTitle ? (
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold tracking-[0.18em] text-blue-600">PRICING</p>
            <h2 className="mt-1.5 text-3xl font-black tracking-tight text-slate-950 sm:text-[38px]">
              {p.title}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {p.subtitle}
            </p>
          </div>
        ) : embedded ? (
          <h2 className="text-center text-xl font-black text-slate-950">
            {p.embeddedTitle}
          </h2>
        ) : null}

        <div
          className={`flex justify-center ${showTitle || embedded ? "mt-5" : "mt-0"}`}
          role="tablist"
          aria-label={p.tabAria}
        >
          <div className="inline-flex rounded-xl border border-blue-100 bg-blue-50/70 p-1 shadow-inner">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "membership"}
              className={`rounded-lg px-5 py-2 text-sm font-bold transition ${tabClass(tab === "membership")}`}
              onClick={() => setTab("membership")}
            >
              {p.tabMembership}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "packs"}
              className={`rounded-lg px-5 py-2 text-sm font-bold transition ${tabClass(tab === "packs")}`}
              onClick={() => setTab("packs")}
            >
              {p.tabPacks}
            </button>
          </div>
        </div>

        {tab === "membership" ? (
          <div
            className={`mx-auto mt-7 grid max-w-5xl items-stretch gap-4 ${
              isPro ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {isPro ? null : (
            <article className="flex min-h-[390px] flex-col rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {p.membership.free.badge}
                </span>
                <Sparkles className="h-5 w-5 text-slate-400" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">{p.membership.free.name}</p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">$0</p>
              <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-5 text-emerald-700">
                {p.membership.free.timeLine}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                {p.membership.free.benefits.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    {checkIcon("soft")}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <GetStartedButton className="mt-5 flex h-10 w-full items-center justify-center rounded-xl border-2 border-blue-600 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                {p.membership.free.cta}
              </GetStartedButton>
            </article>
            )}

            <article className="relative flex min-h-[390px] flex-col rounded-[22px] border-2 border-blue-500 bg-white p-6 shadow-[0_18px_42px_rgba(37,99,235,0.16)]">
              <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                {p.membership.proMonthly.badge}
              </span>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">PRO</span>
                <Clock3 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">{p.membership.proMonthly.name}</p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                {formatUsd(PRICING_USD.proMonthly)}
                <span className="ml-1 text-sm font-semibold text-slate-400">{c.perMonth}</span>
              </p>
              <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-5 text-emerald-700">
                {p.membership.proMonthly.highlight}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{p.membership.proMonthly.s2sLine}</p>
              <ul className="mt-4 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                {p.membership.proMonthly.benefits.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    {checkIcon()}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <MembershipPlanButton
                action={planAction("pro_monthly", isPro, activePlan)}
                checkoutPlan="pro_monthly"
                checkoutLabel={p.membership.proMonthly.cta}
                currentLabel={p.currentPlan}
                portalLabel={p.switchToQuarterly}
                portalUrl={portalUrl}
                className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              />
            </article>

            <article className="relative flex min-h-[390px] flex-col rounded-[22px] border-2 border-violet-500 bg-[linear-gradient(145deg,#ffffff_0%,#fbf9ff_100%)] p-6 shadow-[0_18px_42px_rgba(124,58,237,0.16)]">
              <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                {p.membership.proQuarterly.badge}
              </span>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">PRO</span>
                <Clock3 className="h-5 w-5 text-violet-600" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">{p.membership.proQuarterly.name}</p>
              <p className="mt-1 text-xs text-slate-400">
                <span className="mr-2 line-through decoration-slate-400 decoration-2">
                  {formatUsd(PRO_QUARTERLY_COMPARE_AT_USD)}
                </span>
                {p.membership.proQuarterly.compareAtNote}
              </p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                {formatUsd(PRICING_USD.proQuarterly)}
                <span className="ml-1 text-sm font-semibold text-slate-400">{c.perQuarter}</span>
              </p>
              <p className="mt-2 text-xs font-bold text-emerald-600">{p.membership.proQuarterly.savingsCallout}</p>
              <p className="mt-3 rounded-xl bg-violet-50 px-3 py-2.5 text-xs font-bold leading-5 text-violet-700">
                {p.membership.proQuarterly.highlight}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{p.membership.proQuarterly.s2sLine}</p>
              <ul className="mt-4 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                {p.membership.proQuarterly.benefits.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    {checkIcon("violet")}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <MembershipPlanButton
                action={planAction("pro_quarterly", isPro, activePlan)}
                checkoutPlan="pro_quarterly"
                checkoutLabel={p.membership.proQuarterly.cta}
                currentLabel={p.currentPlan}
                portalLabel={p.switchToQuarterly}
                portalUrl={portalUrl}
                className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              />
            </article>
          </div>
        ) : (
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {packCards.map(({ id, highlight, bestValue, copy }) => (
              <article
                key={id}
                className={`relative flex min-h-[350px] flex-col rounded-[22px] bg-white p-6 transition hover:-translate-y-1 ${
                  highlight
                    ? "border-2 border-violet-500 shadow-[0_18px_42px_rgba(124,58,237,0.16)]"
                    : bestValue
                      ? "border-2 border-orange-400 shadow-[0_18px_42px_rgba(249,115,22,0.13)]"
                      : "border border-slate-200 shadow-[0_14px_32px_rgba(15,23,42,0.07)]"
                }`}
              >
                {highlight && "badge" in copy && copy.badge ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                    {copy.badge}
                  </span>
                ) : null}
                {bestValue && "bestValueBadge" in copy && copy.bestValueBadge ? (
                  <span className="absolute -top-3 right-4 max-w-[11rem] rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-center text-[11px] font-bold leading-tight text-white shadow-lg">
                    {copy.bestValueBadge}
                  </span>
                ) : null}
                <p className="text-lg font-black text-slate-950">{copy.name}</p>
                <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{formatUsd(PACK_USD[id])}</p>
                <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-5 text-emerald-700">
                  {copy.timeLine}
                </p>
                {"valueCallout" in copy && copy.valueCallout ? (
                  <p className="mt-2 text-xs font-bold text-orange-600">{copy.valueCallout}</p>
                ) : null}
                <p className="mt-3 text-xs leading-5 text-slate-400">{p.packs.neverExpire}</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                  {copy.bullets.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      {checkIcon(highlight ? "violet" : "blue")}
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton
                  payload={{ pack_id: id }}
                  label={copy.cta}
                  className={`mt-5 flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    highlight
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-200 hover:-translate-y-0.5"
                      : bestValue
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:-translate-y-0.5"
                        : "border-2 border-blue-600 text-blue-700 hover:bg-blue-50"
                  }`}
                />
              </article>
            ))}
          </div>
        )}

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-6 text-slate-400">{p.footnote}</p>
      </div>
    </section>
  );
}

const blockedPlanClassName =
  "mt-5 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-400";

function MembershipPlanButton({
  action,
  checkoutPlan,
  checkoutLabel,
  currentLabel,
  portalLabel,
  portalUrl,
  className,
}: {
  action: PlanAction;
  checkoutPlan: CheckoutPlan;
  checkoutLabel: string;
  currentLabel: string;
  portalLabel: string;
  portalUrl: string;
  className: string;
}) {
  if (action === "checkout") {
    return (
      <CheckoutButton
        payload={{ plan: checkoutPlan }}
        label={checkoutLabel}
        className={className}
      />
    );
  }

  if (action === "portal") {
    return (
      <a
        href={portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {portalLabel}
      </a>
    );
  }

  return (
    <button type="button" disabled className={blockedPlanClassName}>
      {action === "current" ? currentLabel : checkoutLabel}
    </button>
  );
}
