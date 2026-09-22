/**
 * Site-wide SEO constants.
 *
 * `openGraph` is merged shallowly across segments: a page that declares its own
 * `openGraph` block replaces the root one wholesale, including its `images`,
 * and the `app/opengraph-image.jpg` file convention does not fill the gap once
 * the root has declared images itself. Anything that overrides `openGraph`
 * therefore has to restate the image, so the card lives here where every
 * segment can reach it rather than only in the root layout.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawawareness.org";

export const SITE_DESCRIPTION =
  "Understand Nigerian law, protect yourself, protect your business, and know when professional legal help may be necessary. A national legal education, awareness and compliance platform.";

/**
 * The brand lockup, the same asset `app/opengraph-image.jpg` serves. The
 * Organization logo in the root layout needs it as an absolute URL, so one
 * constant keeps the share card and the schema from drifting apart.
 */
export const OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 800,
  // Kept in step with app/opengraph-image.alt.txt.
  alt: "Law Awareness TV — Know the Law. Know Your Rights. Protect What Matters.",
} as const;

/**
 * The share image for a media item: its own poster when it has one, otherwise
 * the brand lockup. A poster has no dimensions we can vouch for, so only the
 * alt text travels with it.
 */
export function ogImages(posterUrl: string | undefined, alt: string) {
  return posterUrl ? [{ url: posterUrl, alt }] : [OG_IMAGE];
}
