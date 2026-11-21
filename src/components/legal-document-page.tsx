"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { legalContent, type LegalDocumentContent } from "@/i18n/legal-content";
import { useLanguage } from "@/i18n/language-provider";

type LegalDocumentPageProps = {
  doc: "terms" | "privacy";
  userEmail: string | null;
};

export function LegalDocumentPage({ doc, userEmail }: LegalDocumentPageProps) {
  const { locale, t } = useLanguage();
  const content: LegalDocumentContent = legalContent[locale][doc];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#EEF4FF] via-[#F8FAFC] to-white text-slate-900">
      <SiteHeader
        userEmail={userEmail}
        contentMaxWidthClass="max-w-4xl"
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:py-16">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {content.pageTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{content.lastUpdated}</p>
          <p className="mt-6 text-sm leading-relaxed text-slate-700">
            {content.intro}
          </p>
          <div className="mt-10 space-y-8">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-semibold text-slate-900">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph, pi) => (
                    <p
                      key={pi}
                      className="text-sm leading-relaxed text-slate-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">
            {t.login.backHome}
          </Link>
        </p>
      </main>
    </div>
  );
}
