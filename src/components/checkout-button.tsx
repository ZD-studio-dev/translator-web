"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CheckoutPayload } from "@/config/pricing";
import { useLanguage } from "@/i18n/language-provider";

type CheckoutButtonProps = {
  payload: CheckoutPayload;
  label: string;
  className?: string;
  disabled?: boolean;
  blockedMessage?: string | null;
};

export function CheckoutButton({
  payload,
  label,
  className,
  disabled = false,
  blockedMessage = null,
}: CheckoutButtonProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resetState = () => setLoading(false);
    window.addEventListener("focus", resetState);
    window.addEventListener("pageshow", resetState);
    return () => {
      window.removeEventListener("focus", resetState);
      window.removeEventListener("pageshow", resetState);
    };
  }, []);

  async function handleCheckout() {
    setError(null);
    if (blockedMessage) {
      setError(blockedMessage);
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (res.status === 401) {
        setLoading(false);
        router.push("/login");
        return;
      }

      if (data.error === "packs_pro_only") {
        setLoading(false);
        setError(t.pricing.packsProOnly);
        return;
      }

      if (data.url) {
        setLoading(false);
        window.location.href = data.url;
        return;
      }

      setLoading(false);
      setError(data.error ?? t.dashboard.checkoutFailed);
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
      setError(t.dashboard.checkoutFailed);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={className}
      >
        {loading ? t.dashboard.upgradeRedirecting : label}
      </button>
      {error ? (
        <p className="mt-2 text-xs leading-5 text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
