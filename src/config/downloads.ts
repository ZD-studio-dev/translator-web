/** Public Windows installer. macOS stays unset until a package exists. */
export const WINDOWS_DOWNLOAD_URL =
  "https://dl.zdtranslate.com/ZD-Translate-Windows.exe";

/** Public desktop installer URLs. macOS is null until a build is published. */
export function desktopDownloadUrls(): {
  winDownloadUrl: string;
  macDownloadUrl: string | null;
} {
  const win =
    process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_WIN_DOWNLOAD_URL?.trim() ||
    WINDOWS_DOWNLOAD_URL;
  const mac =
    process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ||
    null;
  return { winDownloadUrl: win, macDownloadUrl: mac };
}
