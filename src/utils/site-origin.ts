const DEFAULT_PUBLIC_ORIGIN = "https://www.zdtranslate.com";

export function resolveSiteOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  const originHeader = request.headers.get("origin")?.trim().replace(/\/$/, "");
  if (originHeader) {
    return originHeader;
  }

  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    request.headers.get("host")?.trim();
  if (host) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "https";
    return `${proto}://${host}`;
  }

  return DEFAULT_PUBLIC_ORIGIN;
}
