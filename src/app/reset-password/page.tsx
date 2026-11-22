"use client";

import Link from "next/link";
import { AudioLines } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const l = t.login;
  const c = t.common;
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirmPassword) {
      setError(l.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setMessage(l.resetSuccess);
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : l.signInFailed);
    } finally {
      setLoading(false);
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
          <h1 className="text-center text-xl font-semibold text-slate-900">
            {l.resetTitle}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            {l.resetSubtitle}
          </p>

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

          {!ready ? (
            <p className="mt-8 text-center text-sm text-slate-600">{c.loading}</p>
          ) : hasSession ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-medium text-slate-600"
                >
                  {l.password}
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563EB] disabled:opacity-60"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-xs font-medium text-slate-600"
                >
                  {l.confirmPassword}
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563EB] disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-[#2563EB] text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? l.pleaseWait : l.resetSubmit}
              </button>
            </form>
          ) : (
            <p className="mt-8 text-center text-sm leading-6 text-slate-600">
              {l.resetNeedLink}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/login" className="text-slate-500 hover:text-slate-900">
            {l.useSignIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
