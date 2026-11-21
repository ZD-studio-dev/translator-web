"use client";

import { useLanguage } from "@/i18n/language-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-0.5 rounded-xl border border-blue-100 bg-blue-50/70 p-1 text-xs font-bold"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-lg px-2.5 py-1.5 transition ${
          locale === "en"
            ? "bg-white text-blue-700 shadow-sm"
            : "text-slate-400 hover:text-slate-700"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={`rounded-lg px-2.5 py-1.5 transition ${
          locale === "zh"
            ? "bg-white text-blue-700 shadow-sm"
            : "text-slate-400 hover:text-slate-700"
        }`}
      >
        中文
      </button>
    </div>
  );
}
