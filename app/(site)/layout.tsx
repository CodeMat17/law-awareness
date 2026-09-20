import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { UpdateTicker } from "@/components/site/update-ticker";
import { getContent } from "@/lib/content/repository";
import { buildSearchIndex, searchSuggestions } from "@/lib/search-index";

/**
 * Public site shell: breaking-updates stripe, primary navigation, content,
 * footer. Everything here is server-rendered; only the interactive pieces
 * inside the header and ticker are client components.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const content = getContent();
  const [navigation, ticker, searchEntries] = await Promise.all([
    content.getNavigation(),
    content.getTickerItems(),
    buildSearchIndex(),
  ]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-[0.85rem] focus:font-extrabold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      {/*
        Top chrome is FIXED, not sticky.

        Sticky depends on the whole ancestor chain staying free of scroll
        containers, clipping and transforms, and on the document never becoming
        wider than the viewport - a page that overflows horizontally drags the
        pinned bars out of alignment. Fixed positioning against the viewport has
        none of those dependencies, so the bars behave identically on every page
        regardless of what the page below them does.

        `--chrome-h` (globals.css) is the single source of truth for the height,
        used by the spacer below and by every in-page scroll offset.
      */}
      <div className="fixed inset-x-0 top-0 z-90 bg-background">
        <UpdateTicker items={ticker} />
        <SiteHeader
          groups={navigation}
          searchEntries={searchEntries}
          searchSuggestions={searchSuggestions}
        />
      </div>
      {/* Reserves the space the fixed chrome occupies. */}
      <div aria-hidden className="h-(--chrome-h) shrink-0" />
      <main id="main" className="min-w-0 flex-1 overflow-x-clip">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
