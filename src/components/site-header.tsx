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
          ? "sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur"
          : "border-b border-slate-200 bg-white/80 backdrop-blur"
      }
    >
      <div
        className={`mx-auto flex h-14 ${contentMaxWidthClass} items-center justify-between gap-4 px-6`}
      >
        <Link
          href="https://www.zdtranslate.com/"
          className="text-sm font-semibold tracking-tight text-slate-900"
        >
          {c.brand}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isLoggedIn && userEmail ? (
            <Link
              href="/dashboard"
              className="flex max-w-[220px] items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-slate-200 hover:bg-white hover:shadow-sm"
              title={userEmail}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white"
                aria-hidden
              >
                {avatarInitial(userEmail)}
              </span>
              <span className="truncate text-sm font-medium text-slate-700">
                {emailLocalPart(userEmail)}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
            >
              {c.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
