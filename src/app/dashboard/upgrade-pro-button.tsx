"use client";

import { CheckoutButton } from "@/components/checkout-button";
import { useLanguage } from "@/i18n/language-provider";

export function UpgradeProButton() {
  const { t } = useLanguage();

  return (
    <CheckoutButton
      payload={{ plan: "pro_monthly" }}
      label={t.dashboard.upgradePro}
      className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}
