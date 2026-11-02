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

export function formatCreditsAsLiveDuration(
  credits: number,
  locale: "en" | "zh",
): string {
  const totalSeconds = Math.max(0, Math.floor(credits));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (locale === "zh") {
    return `≈ ${minutes} 分 ${seconds} 秒实时同传剩余`;
  }
  return `≈ ${minutes} mins ${seconds} secs of live translation remaining`;
}
