export const dynamic = "force-dynamic";
export const instant = false;
import Link from "next/link";
import { Download } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
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

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16 sm:py-24">
        <section className="flex flex-col items-center text-center">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Real-time voice &amp; subtitles for global meetings
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            实时跨国会议语音与字幕翻译桌面工具 — translate speech and
            captions live, right on your desktop.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download Windows Client
            </button>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-600 px-6 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-400 hover:bg-zinc-900"
            >
              Get Started
            </Link>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-center text-sm font-medium uppercase tracking-wider text-zinc-500">
            Plans
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <p className="text-lg font-semibold text-white">Free</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                $0
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                <li>Limited trial minutes per month</li>
                <li>Core live translation</li>
                <li>Windows desktop client</li>
              </ul>
              <Link
                href="/login"
                className="mt-8 flex h-10 w-full items-center justify-center rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                Get Started
              </Link>
            </div>

            <div className="rounded-xl border border-zinc-600 bg-zinc-900 p-6 ring-1 ring-zinc-700/50">
              <p className="text-lg font-semibold text-white">Pro</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                $9.9
                <span className="text-base font-normal text-zinc-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                <li>Unlimited meeting translation</li>
                <li>Priority models &amp; lower latency</li>
                <li>Sync Pro benefits on desktop sign-in</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-8 flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-8 text-center text-xs text-zinc-600">
        © 2026 ZD Translate
      </footer>
    </div>
  );
}
