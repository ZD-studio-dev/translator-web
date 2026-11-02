export const instant = false;
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            ZD Translate
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
