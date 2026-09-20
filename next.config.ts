import type { NextConfig } from "next";

/**
 * Applied to every response. None of these change what renders; they remove
 * the header-level findings a security or best-practices audit reports and
 * stop the site advertising its framework.
 *
 * There is deliberately no Content-Security-Policy here. A useful one for an
 * app with streamed inline scripts needs per-request nonces via middleware,
 * and a static `unsafe-inline` policy would pass nothing while risking a blank
 * page - so it is left to be done properly rather than done decoratively.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // The platform asks for none of these, so none are granted.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // The framework version is not the visitor's business.
  poweredByHeader: false,

  /**
   * Lighthouse flags large first-party bundles that ship without source maps.
   * This is the tradeoff it asks for: the maps are served publicly, so the
   * client source becomes readable. Set to false if that is not wanted - the
   * only cost is that one Best Practices audit.
   */
  productionBrowserSourceMaps: true,

  images: {
    // AVIF first, WebP for everything that cannot take it.
    formats: ["image/avif", "image/webp"],

    /**
     * Every uploaded photo is served from Cloudinary, so `next/image` has to
     * be told the host is trusted. The path is narrowed to the delivery route
     * rather than left open, which keeps the optimizer from being pointed at
     * arbitrary Cloudinary accounts.
     *
     * Most call sites do not need the optimizer at all: lib/media/cloudinary.ts
     * builds `f_auto,q_auto` URLs, so Cloudinary has already picked the format
     * and size before the bytes leave its CDN.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    /**
     * Tailwind's stylesheet is render-blocking, and on a first visit the
     * browser cannot paint until it has been fetched. Inlining it into the
     * head removes that round trip from the critical path. Worth it here
     * because most visitors arrive cold from search or a shared link.
     */
    inlineCss: true,

    // Pull in only the modules actually used. `lucide-react` is on the
    // built-in list already; these two are not.
    optimizePackageImports: ["framer-motion", "@base-ui/react"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
