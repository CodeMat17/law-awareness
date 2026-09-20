import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawawareness.tv";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The CMS and account areas are never indexed.
        disallow: ["/admin", "/admin/", "/business-account"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
