"use client";

import Link from "next/link";
import { GetStartedButton } from "@/app/get-started-button";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { PricingSection } from "@/components/PricingSection";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/i18n/language-provider";

type HomePageClientProps = {
  userEmail: string | null;
};

export function HomePageClient({ userEmail }: HomePageClientProps) {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader userEmail={userEmail} />

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
            <div className="w-full lg:min-h-[520px]">
              <InteractiveDemo />
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

        <PricingSection />

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
