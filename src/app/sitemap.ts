import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = baseUrl.replace(/\/$/, "");
  const lastModified = new Date();
  return [
    {
      url: `${origin}/`,
      lastModified,
    },
    {
      url: `${origin}/terms`,
      lastModified,
    },
    {
      url: `${origin}/privacy`,
      lastModified,
    },
  ];
}
