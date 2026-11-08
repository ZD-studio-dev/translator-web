"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";
import {
  buildDesktopClientCallbackUrl,
  parseDesktopAuthState,
  parseLoopbackCallbackPort,
} from "@/utils/safe-redirect";
import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

type AuthPhase = "checking" | "invalid_port" | "authorizing" | "error";

function DesktopAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const d = t.desktopAuth;
  const c = t.common;
  const callbackPort = parseLoopbackCallbackPort(searchParams.get("port"));
  const authState = parseDesktopAuthState(searchParams.get("state"));
  const invalidRequest = callbackPort === null || authState === null;

  const [phase, setPhase] = useState<AuthPhase>(
    invalidRequest ? "invalid_port" : "checking",
  );
  const [session, setSession] = useState<Session | null>(null);
  const [clientUrl, setClientUrl] = useState<string | null>(null);

  const openClient = useCallback(() => {
    if (!clientUrl) {
      return;
    }
    window.location.href = clientUrl;
  }, [clientUrl]);

  useEffect(() => {
    if (invalidRequest || callbackPort === null || authState === null) {
      return;
    }
    const verifiedPort = callbackPort;
    const verifiedState = authState;

    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("desktop-auth getSession:", error);
        setPhase("error");
        return;
      }

      const activeSession = data.session;
      if (!activeSession) {
        const returnQuery = new URLSearchParams({
          port: String(verifiedPort),
          state: verifiedState,
        });
        const returnPath = `/desktop-auth?${returnQuery.toString()}`;
        router.replace(
          `/login?next=${encodeURIComponent(returnPath)}`,
        );
        return;
      }

      const url = buildDesktopClientCallbackUrl(
        verifiedPort,
        activeSession.access_token,
        activeSession.refresh_token,
        verifiedState,
      );

      setSession(activeSession);
      setClientUrl(url);
      setPhase("authorizing");
      window.location.href = url;
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [authState, callbackPort, invalidRequest, router]);

  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-lg justify-end px-6 pt-6">
        <LanguageToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Link
          href="/"
          className="mb-8 text-sm font-semibold tracking-tight text-white"
        >
          {c.brand}
        </Link>

        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 text-center shadow-xl shadow-black/40">
          {phase === "checking" ? (
            <>
              <p className="text-sm text-zinc-400">{c.loading}</p>
            </>
          ) : null}

          {phase === "invalid_port" ? (
            <>
              <h1 className="text-lg font-semibold text-white">{d.invalidPortTitle}</h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {d.invalidPortBody}
              </p>
              <Link
                href="/"
                className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-300"
              >
                {d.backHome}
              </Link>
            </>
          ) : null}

          {phase === "error" ? (
            <>
              <h1 className="text-lg font-semibold text-white">{d.errorTitle}</h1>
              <p className="mt-3 text-sm text-zinc-400">{d.errorBody}</p>
              <Link
                href="/login"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-zinc-600 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
              >
                {d.signInAgain}
              </Link>
            </>
          ) : null}

          {phase === "authorizing" ? (
            <>
              <div
                className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-600 border-t-white"
                aria-hidden
              />
              <h1 className="mt-6 text-lg font-semibold text-white">
                {d.authorizingTitle}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {d.authorizingBody}
              </p>
              {callbackPort !== null ? (
                <p className="mt-2 text-xs text-zinc-500">
                  {d.localPortLabel}: {callbackPort}
                </p>
              ) : null}
              <button
                type="button"
                onClick={openClient}
                disabled={!session || !clientUrl}
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {d.openClient}
              </button>
              <p className="mt-4 text-xs text-zinc-500">{d.manualHint}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function DesktopAuthPage() {
  const { t } = useLanguage();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-zinc-950 text-sm text-zinc-400">
          {t.common.loading}
        </div>
      }
    >
      <DesktopAuthContent />
    </Suspense>
  );
}
