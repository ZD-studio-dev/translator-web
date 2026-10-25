"use client";

import { useEffect, useState } from "react";

export function UpgradeProButton() {
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

  async function handleUpgrade() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        setLoading(false);
        window.location.href = data.url;
        return;
      }

      setLoading(false);
      setError(data.error ?? "Failed to create checkout session");
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
      setError("Failed to create checkout session");
    }
  }

  return (
    <div>
      {error ? (
        <p className="mb-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Upgrade to Pro ($9.9/mo)"}
      </button>
    </div>
  );
}
