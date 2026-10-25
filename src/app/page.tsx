export const instant = false;
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { GetStartedButton } from "@/app/get-started-button";
import { UpgradeProButton } from "@/app/dashboard/upgrade-pro-button";
import { createClient } from "@/utils/supabase/server";

const seoTitle = "ZD Translate — Real-Time AI Desktop Translator";
const seoDescription =
  "Instant, context-aware screen, voice, and text translation for desktop. Break language barriers seamlessly without switching windows.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  keywords: [
    "AI translation",
    "desktop translator",
    "real-time translation",
    "screen translation",
    "voice translation",
  ],
  openGraph: {
    title: seoTitle,
    description: seoDescription,
  },
};

const testimonials = [
  {
    quote:
      "Cut my cross-border meeting prep to zero. The real-time audio translation feels like having a human interpreter.",
    author: "Alex M., Product Manager",
  },
  {
    quote:
      "Finally I can play unlocalized games and read foreign research papers right on my screen with a single hotkey.",
    author: "David K., Software Engineer",
  },
  {
    quote:
      "Way faster and more accurate than browser extensions. It stays out of the way until the exact second I need it.",
    author: "Sarah L., UX Designer",
  },
];

const features = [
  {
    title: "Instant Screen & OCR Translation",
    description:
      "Select any area on your screen—from unselectable UI text and images to PDFs—and get an instant overlay translation with one shortcut.",
    label: "Screen OCR Overlay",
    reverse: false,
  },
  {
    title: "Real-Time System Audio & Voice Captions",
    description:
      "Capture system audio or microphone input during calls, lectures, or livestreams and read live bilingual subtitles in real time.",
    label: "Live Audio Captions",
    reverse: true,
  },
  {
    title: "Context-Aware AI Engine",
    description:
      "Go beyond literal word-for-word translation. ZD Translate understands idioms, technical jargon, and context to deliver natural results.",
    label: "AI Context Engine",
    reverse: false,
  },
];

const faqs = [
  {
    q: "How does the desktop app sync with my Pro account?",
    a: "Simply sign in to the ZD Translate desktop client using the same email account. Your Pro privileges unlock automatically in real time.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can manage or cancel your subscription anytime with one click from your Dashboard via our billing portal—no hidden fees.",
  },
  {
    q: "Does it work over fullscreen apps, games, and video calls?",
    a: "Absolutely. ZD Translate runs as a lightweight native overlay that works seamlessly across any window, PDF, browser, or meeting app.",
  },
];

export default async function Home() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            ZD Translate
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
          >
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Real-Time AI Translation, Right on Your Screen.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
                Translate meetings, streams, games, and documents instantly
                without switching windows. Powered by next-gen AI for
                native-level accuracy.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <GetStartedButton className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                  Get Started Free
                </GetStartedButton>
                <a
                  href="#pricing-section"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-600 px-8 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
                >
                  View Pricing
                </a>
              </div>
            </div>
            <div className="aspect-video rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-xl shadow-black/40">
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-6 text-center">
                <span className="rounded-full border border-zinc-600/80 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-sm">
                  🎬 Interactive Demo Coming Soon — Live Screen &amp; Audio
                  Translation
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
              TRUSTED BY GLOBAL PROFESSIONALS, GAMERS &amp; CREATORS
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {testimonials.map((item) => (
                <div
                  key={item.author}
                  className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-lg shadow-black/20"
                >
                  <p
                    className="text-amber-400/90 tracking-widest"
                    aria-hidden
                  >
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
            Built for Speed, Accuracy, and Zero Friction
          </h2>
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`grid items-center gap-8 lg:grid-cols-2 ${feature.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
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
              Simple, Transparent Pricing
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
                <p className="text-lg font-semibold text-white">Free</p>
                <p className="mt-1 text-3xl font-semibold text-white">$0</p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                  <li>Basic daily text &amp; shortcut translations</li>
                  <li>Standard translation speed &amp; models</li>
                  <li>Community support</li>
                </ul>
                <GetStartedButton className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
                  Get Started
                </GetStartedButton>
              </div>
              <div className="rounded-2xl border border-zinc-600 bg-zinc-900 p-8 ring-1 ring-zinc-700/50">
                <p className="text-lg font-semibold text-white">Pro</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  $9.9
                  <span className="text-base font-normal text-zinc-500">/mo</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                  <li>
                    Unlimited real-time screen, OCR &amp; audio translation
                  </li>
                  <li>Ultra-low latency Pro AI models</li>
                  <li>Custom hotkeys, overlay styles &amp; priority support</li>
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
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
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

      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-600">
        © 2026 ZD Translate. All rights reserved.
      </footer>
    </div>
  );
}
