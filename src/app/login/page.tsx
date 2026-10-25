"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleGoogleLogin() {
    // Mock: navigate to dashboard. Replace with:
    // await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '...' } })
    router.push("/dashboard");
  }

  function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-950 px-6 py-12 text-zinc-100">
      <Link
        href="/"
        className="mb-8 text-sm font-semibold tracking-tight text-white"
      >
        ZD Translate
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl shadow-black/40">
        <h1 className="text-center text-xl font-semibold text-white">
          Sign in to your account
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Use Google or your email to continue
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-600 bg-zinc-950 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-zinc-900/80 px-3 text-zinc-500">OR</span>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Sign in / Sign up
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-600">
        <Link href="/" className="text-zinc-500 hover:text-zinc-400">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
