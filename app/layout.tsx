import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import "./globals.css";

/**
 * Nunito is the only typeface in the product. Weights cover the full editorial
 * scale from body copy (400) through display headings (800/900).
 */
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawawareness.tv";

const DESCRIPTION =
  "Understand Nigerian law, protect yourself, protect your business, and know when professional legal help may be necessary. A national legal education, awareness and compliance platform.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Law Awareness TV — Know the Law. Know Your Rights.",
    template: "%s | Law Awareness TV",
  },
  description: DESCRIPTION,
  applicationName: "Law Awareness TV",
  /**
   * Keywords carry no ranking weight with Google, but they are still read by
   * several social and regional crawlers and they document what each section
   * of the platform is for. Grouped by pillar so the list stays maintainable
   * rather than becoming a bag of synonyms.
   */
  keywords: [
    // Platform
    "Nigerian law",
    "law awareness",
    "legal awareness Nigeria",
    "legal education Nigeria",
    "plain language law",
    "legal literacy",
    "Law Awareness TV",
    // Constitution and rights
    "Nigerian Constitution",
    "fundamental human rights Nigeria",
    "know your rights Nigeria",
    "chapter iv rights",
    "right to fair hearing",
    "police stop and search rights",
    "rights on arrest and detention",
    "bail in Nigeria",
    "human rights enforcement procedure",
    // Everyday law
    "tenancy law Nigeria",
    "landlord and tenant rights",
    "employment rights Nigeria",
    "employment contract Nigeria",
    "family law Nigeria",
    "consumer rights Nigeria",
    "inheritance and succession Nigeria",
    "how to report a crime in Nigeria",
    // Safety
    "avoid online scams Nigeria",
    "fraud prevention Nigeria",
    "before you sign a contract",
    "property purchase due diligence",
    // Business and compliance
    "business compliance Nigeria",
    "CAC registration",
    "Companies and Allied Matters Act",
    "CAMA 2020",
    "FIRS tax compliance",
    "NDPR compliance",
    "Nigeria Data Protection Act",
    "regulatory watch Nigeria",
    "SME legal compliance",
    "corporate governance Nigeria",
    "startup legal Nigeria",
    "intellectual property Nigeria",
    // Access to justice
    "legal aid Nigeria",
    "find a lawyer in Nigeria",
    "free legal advice Nigeria",
    "access to justice Nigeria",
    // Media
    "legal explainer videos",
    "law podcast Nigeria",
  ],
  authors: [{ name: "Law Awareness TV" }],
  creator: "Law Awareness TV",
  publisher: "Law Awareness TV",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "Law Awareness TV",
    title: "Law Awareness TV — Know the Law. Know Your Rights.",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Law Awareness TV — Know the Law. Know Your Rights.",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Law",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#10201b" },
  ],
  colorScheme: "light dark",
};

/**
 * Organization and WebSite, emitted as one @graph so the two nodes reference
 * each other by @id instead of repeating themselves. Claims only what the
 * platform actually is - no ratings, no awards, no invented authorship.
 */
const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Law Awareness TV",
      url: SITE_URL,
      // The brand lockup served by the opengraph-image file convention. One
      // asset, one URL - the schema logo cannot drift from the share card.
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 800,
      },
      description: DESCRIPTION,
      areaServed: { "@type": "Country", name: "Nigeria" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Law Awareness TV",
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: "en-NG",
      publisher: { "@id": `${SITE_URL}/#organization` },
      // The site search really does live at /search?q=, so the sitelinks
      // search box this describes resolves to a working page.
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NG"
      suppressHydrationWarning
      className={`${nunito.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <ClerkProvider>
          <ConvexClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
