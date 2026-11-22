"use client";

import Link from "next/link";
import { AudioLines } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";
import { getSafeRedirectPath } from "@/utils/safe-redirect";
import { createClient } from "@/utils/supabase/client";

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth";
  const nextPath =
    getSafeRedirectPath(searchParams.get("next")) ?? "/dashboard";
  const { t } = useLanguage();
  const l = t.login;
  const c = t.common;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const downloadNotice = searchParams.get("notice") === "download";

  useEffect(() => {
    setGoogleLoading(false);
    setEmailLoading(false);
  }, []);

  useEffect(() => {
    if (authError) {
      setError(l.authFailed);
    }
  }, [authError, l.authFailed]);

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", nextPath);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  async function handleEmailSignIn(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setEmailLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      window.location.assign(nextPath);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : l.signInFailed,
      );
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError(l.forgotEmailRequired);
      return;
    }
    setResetLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = new URL("/auth/callback", window.location.origin);
      redirectTo.searchParams.set("next", "/reset-password");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmed,
        { redirectTo: redirectTo.toString() },
      );
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setMessage(l.resetEmailSent);
    } catch (err) {
      setError(err instanceof Error ? err.message : l.signInFailed);
    } finally {
      setResetLoading(false);
    }
  }

  async function handleEmailSignUp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirmPassword) {
      setError(l.passwordMismatch);
      return;
    }
    setEmailLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        window.location.assign(nextPath);
        return;
      }
      setError(l.confirmEmail);
      setMode("signin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : l.signUpFailed,
      );
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-[#EEF4FF] via-[#F8FAFC] to-white text-slate-900">
      <div className="mx-auto flex w-full max-w-sm justify-end px-6 pt-6">
        <LanguageToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-900"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-[0_10px_28px_rgba(37,99,235,0.25)]"
            aria-hidden
          >
            <AudioLines className="h-5 w-5" />
          </span>
          {c.brand}
        </Link>

        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          {downloadNotice ? (
            <p
              className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-center text-sm text-blue-800"
              role="status"
            >
              {l.downloadAfterSignIn}
            </p>
          ) : null}
          <h1 className="text-center text-xl font-semibold text-slate-900">
            {mode === "signup" ? l.signupTitle : l.title}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">{l.subtitle}</p>

          {message ? (
            <p
              className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800"
              role="status"
            >
              {message}
            </p>
          ) : null}

          {error ? (
            <p
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || emailLoading}
            className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? l.redirecting : l.continueGoogle}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-white px-3 text-slate-500">{l.or}</span>
            </div>
          </div>

          <form
            onSubmit={mode === "signin" ? handleEmailSignIn : handleEmailSignUp}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-600"
              >
                {l.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={emailLoading || googleLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={l.emailPlaceholder}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563EB] disabled:opacity-60"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-600"
                >
                  {l.password}
                </label>
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={emailLoading || googleLoading || resetLoading}
                    className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resetLoading ? l.sendingReset : l.forgotPassword}
                  </button>
                ) : null}
              </div>
              <input
                id="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
                minLength={6}
                disabled={emailLoading || googleLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563EB] disabled:opacity-60"
              />
            </div>
            {mode === "signup" ? (
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-medium text-slate-600"
                >
                  {l.confirmPassword}
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={emailLoading || googleLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563EB] disabled:opacity-60"
                />
              </div>
            ) : null}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={emailLoading || googleLoading}
                className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {emailLoading
                  ? l.pleaseWait
                  : mode === "signin"
                    ? l.signIn
                    : l.signUp}
              </button>
              <button
                type="button"
                disabled={emailLoading || googleLoading}
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setMessage(null);
                  setConfirmPassword("");
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mode === "signin" ? l.createAccount : l.useSignIn}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="text-slate-500 hover:text-slate-900">
            {l.backHome}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-[#F8FAFC] text-sm text-slate-600">
          {t.common.loading}
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
