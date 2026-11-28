/** Public Windows installer. */
export const WINDOWS_DOWNLOAD_URL =
  "https://dl.zdtranslate.com/ZD-Translate-Windows.exe";

/** Public macOS arm64 package. */
export const MACOS_DOWNLOAD_URL =
  "https://dl.zdtranslate.com/RealTimeTranslator-1.1.0-macOS-arm64.zip";

/** Public desktop installer URLs. */
export function desktopDownloadUrls(): {
  winDownloadUrl: string;
  macDownloadUrl: string;
} {
  const win =
    process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_WIN_DOWNLOAD_URL?.trim() ||
    WINDOWS_DOWNLOAD_URL;
  const mac =
    process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ||
    MACOS_DOWNLOAD_URL;
  return { winDownloadUrl: win, macDownloadUrl: mac };
}
