export function parseCreditsBalance(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
  }
  return 0;
}

export function formatVoiceTimeRemaining(
  totalSeconds: number,
  locale: "en" | "zh",
): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (locale === "zh") {
    return `${minutes} 分钟（${secs} 秒）`;
  }
  return `${minutes} min (${secs} sec)`;
}

/** @deprecated Alias for voice time display — balance is stored in seconds. */
export function formatCreditsAsLiveDuration(
  credits: number,
  locale: "en" | "zh",
): string {
  return formatVoiceTimeRemaining(credits, locale);
}
