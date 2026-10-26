"use client";

import Link from "next/link";
import { GetStartedButton } from "@/app/get-started-button";
import { UpgradeProButton } from "@/app/dashboard/upgrade-pro-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";

type HomePageClientProps = {
  isLoggedIn: boolean;
};

export function HomePageClient({ isLoggedIn }: HomePageClientProps) {
  const { t } = useLanguage();
  const h = t.home;
  const c = t.common;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            {c.brand}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              {isLoggedIn ? c.dashboard : c.signIn}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {h.heroTitle}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
                {h.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <GetStartedButton className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                  {h.ctaPrimary}
                </GetStartedButton>
                <a
                  href="#pricing-section"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-600 px-8 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
                >
                  {h.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="aspect-video rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-xl shadow-black/40">
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-6 text-center">
                <span className="rounded-full border border-zinc-600/80 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-sm">
                  {h.demoBadge}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="proof-section"
          className="border-y border-zinc-800/80 bg-zinc-900/30 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-sm font-medium uppercase tracking-wider text-zinc-400">
              {h.proofTitle}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {h.testimonials.map((item) => (
                <div
                  key={item.author}
                  className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-lg shadow-black/20"
                >
                  <p className="tracking-widest text-amber-400/90" aria-hidden>
                    ★★★★★
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-xs font-medium text-zinc-500">
                    — {item.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-16 px-6 py-16 sm:py-24">
          <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
            {h.featuresTitle}
          </h2>
          {h.features.map((feature, i) => (
            <div
              key={feature.title}
              className={`grid items-center gap-8 lg:grid-cols-2 ${i === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
              <div className="flex aspect-video items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-900/50">
                <span className="rounded-full border border-zinc-600/60 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-sm">
                  {feature.label}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section
          id="pricing-section"
          className="border-t border-zinc-800/80 bg-zinc-900/20 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-2xl font-semibold text-white">
              {h.pricingTitle}
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
                <p className="text-lg font-semibold text-white">{h.planFree}</p>
                <p className="mt-1 text-3xl font-semibold text-white">$0</p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                  {h.freeBenefits.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <GetStartedButton className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
                  {h.getStarted}
                </GetStartedButton>
              </div>
              <div className="rounded-2xl border border-zinc-600 bg-zinc-900 p-8 ring-1 ring-zinc-700/50">
                <p className="text-lg font-semibold text-white">{h.planPro}</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  $9.9
                  <span className="text-base font-normal text-zinc-500">
                    {c.perMonth}
                  </span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                  {h.proBenefits.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="mt-8 [&_button]:flex [&_button]:h-11 [&_button]:w-full [&_button]:items-center [&_button]:justify-center">
                  <UpgradeProButton />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <h2 className="text-center text-2xl font-semibold text-white">
            {h.faqTitle}
          </h2>
          <div className="mt-8 space-y-3">
            {h.faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-zinc-200 marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-zinc-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80 px-6 py-8 text-center text-xs text-zinc-600">
        <p>{h.footer}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/terms" className="text-zinc-500 hover:text-zinc-300">
            {t.legal.termsOfService}
          </Link>
          <span className="hidden text-zinc-700 sm:inline" aria-hidden>
            ·
          </span>
          <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300">
            {t.legal.privacyPolicy}
          </Link>
          <span className="hidden text-zinc-700 sm:inline" aria-hidden>
            ·
          </span>
          <a
            href="mailto:support@zdtranslate.com"
            className="text-zinc-500 hover:text-zinc-300"
          >
            support@zdtranslate.com
          </a>
        </div>
      </footer>
    </div>
  );
}
