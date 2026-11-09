"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/i18n/language-provider";

type SiteHeaderProps = {
  userEmail?: string | null;
  sticky?: boolean;
  contentMaxWidthClass?: string;
};

function emailLocalPart(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  return email.slice(0, at);
}

function avatarInitial(email: string): string {
  const part = emailLocalPart(email).trim();
  return (part[0] ?? "?").toUpperCase();
}

export function SiteHeader({
  userEmail = null,
  sticky = true,
  contentMaxWidthClass = "max-w-6xl",
}: SiteHeaderProps) {
  const { t } = useLanguage();
  const c = t.common;
  const isLoggedIn = Boolean(userEmail?.trim());

  return (
    <header
      className={
        sticky
          ? "sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur"
          : "border-b border-zinc-800/80 bg-zinc-950"
      }
    >
      <div
        className={`mx-auto flex h-14 ${contentMaxWidthClass} items-center justify-between gap-4 px-6`}
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-white"
        >
          {c.brand}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isLoggedIn && userEmail ? (
            <Link
              href="/dashboard"
              className="flex max-w-[220px] items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-sm hover:shadow-black/20"
              title={userEmail}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-zinc-100 ring-1 ring-zinc-600"
                aria-hidden
              >
                {avatarInitial(userEmail)}
              </span>
              <span className="truncate text-sm font-medium text-zinc-200">
                {emailLocalPart(userEmail)}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              {c.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
