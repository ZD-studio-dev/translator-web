"use client";

import { useState } from "react";
import { GetStartedButton } from "@/app/get-started-button";
import { CheckoutButton } from "@/components/checkout-button";
import {
  formatUsd,
  PACK_USD,
  PRICING_USD,
  PRO_QUARTERLY_COMPARE_AT_USD,
} from "@/config/pricing";
import { useLanguage } from "@/i18n/language-provider";

type PricingSectionProps = {
  sectionId?: string;
  defaultTab?: "membership" | "packs";
  showTitle?: boolean;
  embedded?: boolean;
};

export function PricingSection({
  sectionId = "pricing-section",
  defaultTab = "membership",
  showTitle = true,
  embedded = false,
}: PricingSectionProps) {
  const { t } = useLanguage();
  const p = t.pricing;
  const c = t.common;
  const [tab, setTab] = useState<"membership" | "packs">(defaultTab);

  const tabClass = (active: boolean) =>
    active
      ? "bg-white text-zinc-950"
      : "text-zinc-300 hover:bg-zinc-800 hover:text-white";

  const packCards = [
    { id: "pack_1h" as const, highlight: false, bestValue: false, copy: p.packs.pack1h },
    { id: "pack_3h" as const, highlight: true, bestValue: false, copy: p.packs.pack3h },
    { id: "pack_10h" as const, highlight: false, bestValue: true, copy: p.packs.pack10h },
  ];

  return (
    <section
      id={sectionId}
      className={
        embedded
          ? "scroll-mt-20 rounded-xl border border-zinc-800 bg-zinc-900/40 py-8 sm:py-10"
          : "scroll-mt-20 border-t border-zinc-800/80 bg-zinc-900/20 py-16 sm:py-24"
      }
    >
      <div className={embedded ? "px-6" : "mx-auto max-w-6xl px-6"}>
        {showTitle ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {p.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              {p.subtitle}
            </p>
          </div>
        ) : embedded ? (
          <h2 className="text-center text-lg font-semibold text-white">
            {p.embeddedTitle}
          </h2>
        ) : null}

        <div
          className={`flex justify-center ${showTitle || embedded ? "mt-8" : "mt-0"}`}
          role="tablist"
          aria-label={p.tabAria}
        >
          <div className="inline-flex rounded-lg border border-zinc-700 bg-zinc-950/80 p-1">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "membership"}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tabClass(tab === "membership")}`}
              onClick={() => setTab("membership")}
            >
              {p.tabMembership}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "packs"}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tabClass(tab === "packs")}`}
              onClick={() => setTab("packs")}
            >
              {p.tabPacks}
            </button>
          </div>
        </div>

        {tab === "membership" ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {p.membership.free.badge}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {p.membership.free.name}
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">$0</p>
              <p className="mt-2 text-sm font-medium text-emerald-400/90">
                {p.membership.free.timeLine}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-zinc-400">
                {p.membership.free.benefits.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-emerald-500/80" aria-hidden>
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <GetStartedButton className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
                {p.membership.free.cta}
              </GetStartedButton>
            </div>

            <div className="relative flex flex-col rounded-2xl border border-emerald-500/40 bg-zinc-900 p-8 ring-1 ring-emerald-500/20">
              <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-zinc-950">
                {p.membership.proMonthly.badge}
              </span>
              <p className="text-lg font-semibold text-white">
                {p.membership.proMonthly.name}
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {formatUsd(PRICING_USD.proMonthly)}
                <span className="text-base font-normal text-zinc-500">
                  {c.perMonth}
                </span>
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-400/90">
                {p.membership.proMonthly.highlight}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {p.membership.proMonthly.s2sLine}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-zinc-300">
                {p.membership.proMonthly.benefits.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-emerald-400" aria-hidden>
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton
                payload={{ plan: "pro_monthly" }}
                label={p.membership.proMonthly.cta}
                className="mt-8 flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="relative flex flex-col rounded-2xl border-2 border-amber-400/70 bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-950 p-8 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/35 lg:scale-[1.02]">
              <div className="absolute -top-3 right-6 flex flex-wrap justify-end gap-1.5">
                <span className="rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-zinc-950">
                  {p.membership.proQuarterly.badge}
                </span>
              </div>
              <p className="text-lg font-semibold text-white">
                {p.membership.proQuarterly.name}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                <span className="mr-2 line-through decoration-zinc-500 decoration-2">
                  {formatUsd(PRO_QUARTERLY_COMPARE_AT_USD)}
                </span>
                <span className="text-zinc-400">
                  {p.membership.proQuarterly.compareAtNote}
                </span>
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {formatUsd(PRICING_USD.proQuarterly)}
                <span className="text-base font-normal text-zinc-500">
                  /3 mo
                </span>
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-400">
                {p.membership.proQuarterly.savingsCallout}
              </p>
              <p className="mt-3 text-sm font-medium text-amber-200">
                {p.membership.proQuarterly.highlight}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {p.membership.proQuarterly.s2sLine}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-zinc-300">
                {p.membership.proQuarterly.benefits.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-amber-400" aria-hidden>
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton
                payload={{ plan: "pro_quarterly" }}
                label={p.membership.proQuarterly.cta}
                className="mt-8 flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-amber-300 to-amber-500 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/40 transition-all hover:from-amber-200 hover:to-amber-400 hover:shadow-amber-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {packCards.map(({ id, highlight, bestValue, copy }) => (
              <div
                key={id}
                className={`relative flex flex-col rounded-2xl p-8 ${
                  highlight
                    ? "border-2 border-amber-400/70 bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30 md:scale-[1.03]"
                    : bestValue
                      ? "border border-orange-500/40 bg-zinc-900/80 ring-1 ring-orange-500/20"
                      : "border border-zinc-800 bg-zinc-950/60"
                }`}
              >
                {highlight && "badge" in copy && copy.badge ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-zinc-950 shadow-md shadow-amber-500/30">
                    {copy.badge}
                  </span>
                ) : null}
                {bestValue && "bestValueBadge" in copy && copy.bestValueBadge ? (
                  <span className="absolute -top-3 right-4 max-w-[11rem] rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-0.5 text-center text-[11px] font-semibold leading-tight text-white shadow-md shadow-orange-500/40">
                    {copy.bestValueBadge}
                  </span>
                ) : null}
                <p className="text-lg font-semibold text-white">{copy.name}</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {formatUsd(PACK_USD[id])}
                </p>
                <p className="mt-2 text-sm font-medium text-emerald-400/90">
                  {copy.timeLine}
                </p>
                {"valueCallout" in copy && copy.valueCallout ? (
                  <p className="mt-2 text-sm font-semibold text-amber-300">
                    {copy.valueCallout}
                  </p>
                ) : null}
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                  {p.packs.neverExpire}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-zinc-300">
                  {copy.bullets.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-emerald-500/90" aria-hidden>
                        ✓
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton
                  payload={{ pack_id: id }}
                  label={copy.cta}
                  className={`mt-8 flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    highlight
                      ? "bg-gradient-to-r from-amber-300 to-amber-500 font-semibold text-zinc-950 shadow-lg shadow-amber-500/35 hover:from-amber-200 hover:to-amber-400"
                      : bestValue
                        ? "border border-orange-500/60 bg-orange-500/15 text-orange-100 hover:bg-orange-500/25"
                        : "border border-zinc-600 text-zinc-100 hover:bg-zinc-900"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500">{p.footnote}</p>
      </div>
    </section>
  );
}
