"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/i18n/language-provider";

type FaqPageClientProps = {
  userEmail: string | null;
};

export function FaqPageClient({ userEmail }: FaqPageClientProps) {
  const { locale, t } = useLanguage();
  const zh = locale === "zh";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <SiteHeader userEmail={userEmail} contentMaxWidthClass="max-w-6xl" />

      <main className="w-full flex-1 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.22em] text-blue-600">
              FAQ
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {t.home.faqTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
              {zh
                ? "关于账户、订阅与会议使用方式的常见解答。"
                : "Quick answers about your account, subscription, and meeting setup."}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {t.home.faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition open:border-blue-200 open:shadow-md sm:px-8 sm:py-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold text-slate-900 marker:content-none sm:text-lg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-blue-600 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-5 max-w-4xl border-t border-slate-100 pt-5 text-base leading-8 text-slate-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            <Link href="/" className="font-semibold text-blue-600 transition hover:text-blue-700">
              {zh ? "返回首页" : "Back to home"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
