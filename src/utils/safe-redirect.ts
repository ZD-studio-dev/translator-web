/** Allows same-origin path-only redirects (blocks open redirects). */
export function getSafeRedirectPath(next: string | null | undefined): string | null {
  if (!next?.trim()) {
    return null;
  }
  const path = next.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return null;
  }
  if (path.includes("://") || path.includes("\\")) {
    return null;
  }
  return path;
}

export function parseLoopbackCallbackPort(
  value: string | null | undefined,
): number | null {
  const raw = (value ?? "54321").trim();
  if (!/^\d{1,5}$/.test(raw)) {
    return null;
  }
  const port = Number.parseInt(raw, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }
  return port;
}

export function buildDesktopClientCallbackUrl(
  port: number,
  accessToken: string,
  refreshToken: string,
): string {
  const params = new URLSearchParams({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return `http://127.0.0.1:${port}/callback?${params.toString()}`;
}
