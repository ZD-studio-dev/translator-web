"use client";

import { useLanguage } from "@/i18n/language-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-zinc-700 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === "en"
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === "zh"
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        中文
      </button>
    </div>
  );
}
