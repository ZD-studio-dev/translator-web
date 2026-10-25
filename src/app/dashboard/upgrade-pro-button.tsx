"use client";

import { useState } from "react";

export function UpgradeProButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setLoading(false);
        return;
      }

      const opened = window.open(data.url, "_blank", "noopener,noreferrer");
      setLoading(false);

      if (!opened) {
        setError(
          "Pop-up was blocked. Allow pop-ups for this site and try again.",
        );
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Could not start checkout. Please try again.");
      setLoading(false);
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
        {loading ? "Opening checkout…" : "Upgrade to Pro ($9.9/mo)"}
      </button>
    </div>
  );
}
