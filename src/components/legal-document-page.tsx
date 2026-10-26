"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { legalContent, type LegalDocumentContent } from "@/i18n/legal-content";
import { useLanguage } from "@/i18n/language-provider";

type LegalDocumentPageProps = {
  doc: "terms" | "privacy";
  isLoggedIn: boolean;
};

export function LegalDocumentPage({ doc, isLoggedIn }: LegalDocumentPageProps) {
  const { locale, t } = useLanguage();
  const c = t.common;
  const content: LegalDocumentContent = legalContent[locale][doc];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-6">
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

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:py-16">
        <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {content.pageTitle}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{content.lastUpdated}</p>
          <p className="mt-6 text-sm leading-relaxed text-zinc-300">
            {content.intro}
          </p>
          <div className="mt-10 space-y-8">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-semibold text-white">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph, pi) => (
                    <p
                      key={pi}
                      className="text-sm leading-relaxed text-zinc-400"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            {t.login.backHome}
          </Link>
        </p>
      </main>
    </div>
  );
}
