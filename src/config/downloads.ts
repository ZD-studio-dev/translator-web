/** Public desktop installer URLs. Empty values are treated as not configured. */
export function desktopDownloadUrls(): {
  winDownloadUrl: string | null;
  macDownloadUrl: string | null;
} {
  const win =
    process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_WIN_DOWNLOAD_URL?.trim() ||
    null;
  const mac =
    process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ||
    null;
  return { winDownloadUrl: win, macDownloadUrl: mac };
}
