export const instant = false;
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { AudioLines } from "lucide-react";
import { PricingSection } from "@/components/PricingSection";
import { LanguageToggle } from "@/components/language-toggle";

export const metadata: Metadata = {
  title: "Pricing — ZD Translate",
  description:
    "Membership plans and pay-as-you-go credit packs for real-time AI voice translation. 1 credit = 1 second of live interpretation.",
};

export default async function PricingPage() {
  await connection();

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 font-bold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-200">
              <AudioLines className="h-5 w-5" />
            </span>
            Meeting Translator
          </Link>
          <LanguageToggle />
        </div>
      </header>
      <main>
        <PricingSection defaultTab="membership" />
      </main>
    </div>
  );
}
