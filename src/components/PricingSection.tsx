"use client";

import { Check, Clock3, Sparkles } from "lucide-react";
import { useState } from "react";
import { GetStartedButton } from "@/app/get-started-button";
import { CheckoutButton } from "@/components/checkout-button";
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
  const { locale, t } = useLanguage();
  const p = t.pricing;
  const c = t.common;
  const [tab, setTab] = useState<"membership" | "packs">(defaultTab);

  const tabClass = (active: boolean) =>
    active
      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
      : "text-slate-500 hover:bg-white hover:text-slate-900";

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
          <div className="mx-auto mt-7 grid max-w-5xl items-stretch gap-4 lg:grid-cols-3">
            <article className="flex min-h-[370px] flex-col rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {p.membership.free.badge}
                </span>
                <Sparkles className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">
                {p.membership.free.name}
              </p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">$0</p>
              <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-5 text-emerald-700">
                {p.membership.free.creditsLine}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                {p.membership.free.benefits.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600" aria-hidden>
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <GetStartedButton className="mt-5 flex h-10 w-full items-center justify-center rounded-xl border-2 border-blue-600 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                {p.membership.free.cta}
              </GetStartedButton>
            </article>

            <article className="relative flex min-h-[370px] flex-col rounded-[22px] border-2 border-blue-500 bg-white p-6 shadow-[0_18px_42px_rgba(37,99,235,0.16)]">
              <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                {p.membership.pro.badge}
              </span>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">PRO</span>
                <Clock3 className="h-4.5 w-4.5 text-blue-600" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">
                {p.membership.pro.name}
              </p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                $19<span className="ml-1 text-sm font-semibold text-slate-400">{c.perMonth}</span>
              </p>
              <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-5 text-emerald-700">
                {p.membership.pro.creditsLine}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                {p.membership.pro.benefits.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-blue-600 text-white" aria-hidden>
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton
                payload={{ plan: "pro_monthly" }}
                label={p.membership.pro.cta}
                className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              />
            </article>

            <article className="relative flex min-h-[370px] flex-col rounded-[22px] border-2 border-violet-500 bg-[linear-gradient(145deg,#ffffff_0%,#fbf9ff_100%)] p-6 shadow-[0_18px_42px_rgba(124,58,237,0.16)]">
              <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                {locale === "zh" ? "省 22%" : "Save 22%"}
              </span>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">PRO</span>
                <Clock3 className="h-4.5 w-4.5 text-violet-600" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">
                {locale === "zh" ? "Pro 季度会员" : "Pro Quarterly"}
              </p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                $34.90
                <span className="ml-1 text-sm font-semibold text-slate-400">
                  {locale === "zh" ? "/季" : "/quarter"}
                </span>
              </p>
              <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold leading-5 text-emerald-700">
                {locale === "zh"
                  ? "季度共 450 分钟 S2S 语音"
                  : "450 minutes of S2S voice per quarter"}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-[13px] leading-5 text-slate-600">
                {(locale === "zh"
                  ? ["包含月度会员全部权益", "更多语音同传时长", "可叠加额外加时包"]
                  : [
                      "Includes all monthly Pro benefits",
                      "More live interpretation time",
                      "Stack additional credit packs anytime",
                    ]
                ).map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-violet-600 text-white" aria-hidden>
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                title={locale === "zh" ? "季度订阅结账尚未配置" : "Quarterly checkout is not configured yet"}
                className="mt-5 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-200"
              >
                {locale === "zh" ? "订阅 — $34.90/季" : "Subscribe — $34.90/quarter"}
              </button>
            </article>
          </div>
        ) : (
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {(
              [
                { id: "starter" as const, highlight: false, copy: p.packs.starter },
                { id: "popular" as const, highlight: true, copy: p.packs.popular },
                { id: "pro" as const, highlight: false, copy: p.packs.pro },
              ] as const
            ).map(({ id, highlight, copy }) => (
              <article
                key={id}
                className={`relative flex min-h-[360px] flex-col rounded-[24px] bg-white p-7 transition hover:-translate-y-1 ${highlight ? "border-2 border-violet-500 shadow-[0_22px_60px_rgba(124,58,237,0.16)]" : "border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"}`}
              >
                {highlight && copy.badge ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                    {copy.badge}
                  </span>
                ) : null}
                <p className="text-xl font-black text-slate-950">{copy.name}</p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{copy.price}</p>
                <p className="mt-5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-bold leading-6 text-emerald-700">{copy.creditsLine}</p>
                <p className="mt-4 text-xs leading-6 text-slate-400">{p.packs.neverExpire}</p>
                <ul className="mt-7 flex-1 space-y-3 text-sm leading-6 text-slate-600">
                  {copy.bullets.map((line) => (
                    <li key={line} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{line}</li>
                  ))}
                </ul>
                <CheckoutButton
                  payload={{ pack_id: id }}
                  label={copy.cta}
                  className={`mt-7 flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${highlight ? "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700" : "border-2 border-blue-600 text-blue-700 hover:bg-blue-50"}`}
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
