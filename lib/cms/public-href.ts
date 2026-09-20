import type { CollectionId } from "./collections";

/**
 * The public route a record answers at, derived from its fields.
 *
 * The seed mappers in `repository.ts` build the same hrefs when they turn the
 * bundled content into records. This exists because a record created in the
 * admin has to land on the same route as a seeded one - otherwise a video
 * added by hand would have no "View" link, and saving it would revalidate
 * nothing on the public site.
 *
 * A collection with no page of its own returns undefined rather than a guess.
 */
export function publicHrefFor(
  collection: CollectionId,
  fields: Record<string, string>
): string | undefined {
  const slug = fields.slug?.trim();

  switch (collection) {
    case "pages":
      return fields.path?.trim() || undefined;
    case "ticker":
      return fields.href?.trim() || undefined;
    case "law-histories":
      return fields.lawSlug?.trim()
        ? `/know-the-law/amendments#${fields.lawSlug.trim()}`
        : undefined;

    // A law entry sits under the category it is filed in, so its route needs
    // both. A category that has not been set yet has no route to point at.
    case "law-entries": {
      const category = fields.category?.trim();
      return category && slug
        ? `/know-the-law/${category}/${slug}`
        : undefined;
    }

    // The Constitution is browsed by chapter. A chapter is a page; a section
    // is an anchor within one, and never a page of its own.
    case "constitution-chapters":
      return fields.numeral?.trim()
        ? `/constitution/chapter-${fields.numeral.trim().toLowerCase()}`
        : undefined;
    case "constitution-sections":
      return fields.chapter?.trim()
        ? `/constitution/chapter-${fields.chapter.trim().toLowerCase()}#s-${fields.number?.trim() ?? ""}`
        : undefined;

    // These four furnish pages rather than having pages. A court appears on
    // every case; a calendar entry, a health-check question and a profile
    // question each make up part of one standing tool.
    case "courts":
    case "alert-topics":
      return undefined;
    case "calendar-entries":
      return "/business/legal-calendar";
    case "health-check":
      return "/business/health-check";
    case "profile-questions":
      return "/business-account";
    // A live strand is indexed by the schedule at /live rather than by a
    // series page of its own.
    case "media-series":
      if (fields.kind === "live") return "/live";
      if (!slug) return undefined;
      return `/${fields.kind === "podcast" ? "listen" : "watch"}/series/${slug}`;
    case "media":
      if (!slug) return undefined;
      return `/${
        fields.kind === "podcast"
          ? "listen"
          : fields.kind === "live"
            ? "live"
            : "watch"
      }/${slug}`;
    default:
      break;
  }

  if (!slug) return undefined;

  const prefixes: Partial<Record<CollectionId, string>> = {
    articles: "/law-and-society",
    rights: "/your-rights",
    laws: "/know-the-law",
    cases: "/cases",
    "business-guides": "/business/guides",
    glossary: "/glossary",
    quizzes: "/quizzes",
    checklists: "/resources",
    "compliance-topics": "/business/compliance",
    contracts: "/business/contracts",
    industries: "/business/industries",
    "ceo-briefings": "/business/ceo",
    "regulatory-updates": "/business/regulatory-watch",
    "legal-problems": "/legal-help/problem",
    "lawyer-listings": "/lawyers",
    questions: "/ask",
    "safety-guides": "/stay-safe",
  };

  // Referral routes are anchors on a single page, not pages of their own.
  if (collection === "referral-routes") return `/legal-help/legal-aid#${slug}`;

  const prefix = prefixes[collection];
  return prefix ? `${prefix}/${slug}` : undefined;
}

/**
 * The public routes that *list* a record, as opposed to the one that shows it.
 *
 * Publishing has to reach both. A record's own route is revalidated from its
 * `publicHrefFor`, but the hub that indexes it - /watch for a video, /glossary
 * for a term - is a separately cached page, and invalidating the data tag the
 * hub reads does not re-render it: the tag governs the fetch, the page's own
 * `revalidate` governs the HTML. Without this, a newly published record sits
 * at a working URL that nothing links to until the hub's window expires.
 *
 * Routes are named rather than derived so the list is reviewable: a hub added
 * to the site has to be added here, and the failure of forgetting is a stale
 * index rather than a silently wrong page.
 *
 * The ticker is the exception and is handled by its caller: it renders in the
 * site layout, so its index is every route on the site.
 */
export function indexRoutesFor(
  collection: CollectionId,
  fields: Record<string, string>
): string[] {
  const slug = fields.slug?.trim();

  switch (collection) {
    // A page is its own route; there is no index above it.
    case "pages":
    case "ticker":
      return [];

    // The homepage carries the latest strip for these, so it is an index too.
    case "articles":
      return ["/law-and-society", "/"];
    case "rights":
      return ["/your-rights", "/"];

    case "laws":
      return ["/know-the-law"];
    case "cases":
      return ["/cases"];
    case "law-histories":
      return ["/know-the-law/amendments"];
    case "glossary":
      return ["/glossary"];
    case "quizzes":
      return ["/quizzes"];
    case "checklists":
      return ["/resources"];
    case "lawyer-listings":
      return ["/lawyers"];
    case "questions":
      return ["/ask"];

    // Business hubs list their own section as well as the section landing.
    case "business-guides":
      return ["/business/guides", "/business"];
    case "compliance-topics":
      return ["/business/compliance", "/business"];
    case "contracts":
      return ["/business/contracts", "/business"];
    case "industries":
      return ["/business/industries", "/business"];
    case "ceo-briefings":
      return ["/business/ceo", "/business"];
    case "regulatory-updates":
      return ["/business/regulatory-watch", "/business"];

    // A law entry is indexed by its own category page as well as by the
    // library above it, so publishing one has to reach both.
    case "law-entries": {
      const category = fields.category?.trim();
      return [
        ...(category ? [`/know-the-law/${category}`] : []),
        "/know-the-law",
      ];
    }
    // Stay Safe guides show on the homepage strip as well as their own hub.
    case "safety-guides":
      return ["/stay-safe", "/"];

    // A section is rendered inside its chapter, and the chapter list above it
    // shows what each chapter covers - so both are stale when one changes.
    case "constitution-chapters":
    case "constitution-sections":
      return ["/constitution"];

    // A court is named on every case page and is a filter on the explorer.
    // Only the explorer is listed: revalidating every case page to rename a
    // court would be the whole collection, and the name a case shows comes
    // from a tagged read that the write already invalidates.
    case "courts":
      return ["/cases"];

    // These have no index above them - each is one standing page, which is
    // already the route `publicHrefFor` returns.
    case "alert-topics":
    case "calendar-entries":
    case "health-check":
    case "profile-questions":
      return [];

    case "legal-problems":
      return ["/legal-help/problem", "/legal-help"];
    case "referral-routes":
      return ["/legal-help/legal-aid", "/legal-help"];

    // A media item is indexed by its hub and, when it belongs to one, by its
    // series page. The homepage carries the latest of these too.
    case "media": {
      const seriesSlug = fields.seriesSlug?.trim();
      if (fields.kind === "podcast") {
        return [
          "/listen",
          "/",
          ...(seriesSlug ? [`/listen/series/${seriesSlug}`] : []),
        ];
      }
      if (fields.kind === "live") return ["/live", "/"];
      return [
        "/watch",
        "/",
        ...(seriesSlug ? [`/watch/series/${seriesSlug}`] : []),
      ];
    }

    // A series is listed on its hub. Its own page is the `publicHrefFor` one,
    // except for live strands, which have none.
    case "media-series":
      if (fields.kind === "live") return ["/live"];
      if (fields.kind === "podcast") return ["/listen"];
      return ["/watch"];
  }

  // Exhaustive above; this keeps a newly added collection honest rather than
  // silently indexing nowhere.
  void slug;
  return [];
}

/**
 * Turns a title into a URL slug.
 *
 * Shared by the create form and the create action deliberately: the slug the
 * editor is shown while typing has to be the slug that is actually stored, and
 * two implementations of this would eventually disagree about an apostrophe.
 */
export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      // Strip accents so "Lagôs" and "Lagos" do not become different records.
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Apostrophes close up rather than becoming a separator, so "Nigeria's"
      // reads as "nigerias" and not "nigeria-s".
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64)
      .replace(/-+$/g, "")
  );
}

/**
 * The record id given to a newly created record.
 *
 * Derived from the slug, so ids stay readable and a record's admin URL matches
 * the thing it is. Falls back to the title for collections that have no slug
 * field, and to a timestamp when neither yields anything usable.
 */
export function recordIdFrom(
  collection: CollectionId,
  fields: Record<string, string>,
  titleFieldName: string
): string {
  const candidate =
    fields.slug?.trim() ||
    fields.lawSlug?.trim() ||
    fields[titleFieldName]?.trim() ||
    "";
  return slugify(candidate) || `${collection}-${Date.now()}`;
}
