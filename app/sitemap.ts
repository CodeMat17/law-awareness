import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/repository";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawawareness.tv";

/**
 * Newest of a set of date strings, or undefined when nothing dates the page.
 * `lastModified` is a claim about the page, so a hub only makes one when its
 * own content can back it up.
 */
/**
 * One date string as a `Date`, or undefined when it is missing or unparseable.
 *
 * Every date here comes from an editable record, and a record an editor has
 * not dated stores an empty string - which `new Date("")` turns into an
 * Invalid Date that throws only later, when Next serialises the sitemap. That
 * failed the whole build over one blank field on one record. A page with no
 * usable date now simply makes no `lastModified` claim, which is what the
 * absence of a date actually means.
 */
function dateOf(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : undefined;
}

function newest(...dates: (string | undefined)[]): Date | undefined {
  const stamps = dates
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter((time) => Number.isFinite(time));
  return stamps.length ? new Date(Math.max(...stamps)) : undefined;
}

/** Top-level routes. Detail pages join this as each phase lands. */
const routes = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/know-the-law", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/your-rights", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/business", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/business/health-check", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/business/compliance", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/business/regulatory-watch", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/business/guides", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/business/contracts", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/business/industries", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/business/legal-calendar", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/business/ceo", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/stay-safe", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/law-and-society", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/constitution", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/cases", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/know-the-law/amendments", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/glossary", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/search", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/watch", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/listen", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/live", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/legal-help", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/legal-help/problem", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/legal-help/legal-aid", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/lawyers", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/ask", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/quizzes", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/resources", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/about/editorial-policy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/about/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/about/terms", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/about/accessibility", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/donate", priority: 0.6, changeFrequency: "yearly" as const },
];

/**
 * Published detail pages are read through the repository rather than listed by
 * hand, so the sitemap cannot fall behind the content.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = getContent();

  const [
    categories,
    entries,
    rights,
    safety,
    terms,
    guides,
    complianceTopics,
    contracts,
    industries,
    briefings,
    updates,
    videos,
    episodes,
    liveEvents,
    series,
    problems,
    questions,
    listings,
    articles,
    quizzes,
    checklists,
    cases,
    chapters,
    histories,
  ] = await Promise.all([
    content.getLawCategories(),
    content.getLawEntries(),
    content.getRightGuides(),
    content.getSafetyGuides(),
    content.getGlossaryTerms(),
    content.getBusinessGuides(),
    content.getComplianceTopics(),
    content.getContractTypes(),
    content.getIndustryHubs(),
    content.getCeoBriefings(),
    content.getRegulatoryUpdates(),
    content.getVideos(),
    content.getPodcastEpisodes(),
    content.getLiveEvents(),
    content.getMediaSeries(),
    content.getLegalProblems(),
    content.getPublicQuestions(),
    content.getLawyerListings(),
    content.getLatestArticles(),
    content.getQuizzes(),
    content.getChecklists(),
    content.getCases(),
    content.getConstitutionChapters(),
    content.getLawHistories(),
  ]);

  const detail: MetadataRoute.Sitemap = [
    ...cases.map((record) => ({
      url: `${SITE_URL}/cases/${record.slug}`,
      lastModified: dateOf(record.meta.lastReviewed),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    // Chapter pages exist for all eight chapters; the ones with no sections
    // explained yet still map the chapter, which is worth indexing.
    ...chapters.map((chapter) => ({
      url: `${SITE_URL}/constitution/chapter-${chapter.numeral.toLowerCase()}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...quizzes.map((quiz) => ({
      url: `${SITE_URL}/quizzes/${quiz.slug}`,
      lastModified: dateOf(quiz.meta.lastReviewed),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...checklists.map((checklist) => ({
      url: `${SITE_URL}/resources/${checklist.slug}`,
      lastModified: dateOf(checklist.meta.lastReviewed),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/law-and-society/${article.slug}`,
      lastModified: dateOf(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/know-the-law/${category.slug}`,
      lastModified: newest(
        ...entries
          .filter((entry) => entry.category === category.slug)
          .map((entry) => entry.meta.lastReviewed)
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...entries.map((entry) => ({
      url: `${SITE_URL}/know-the-law/${entry.category}/${entry.slug}`,
      lastModified: dateOf(entry.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...rights.map((guide) => ({
      url: `${SITE_URL}/your-rights/${guide.slug}`,
      lastModified: dateOf(guide.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...safety.map((guide) => ({
      url: `${SITE_URL}/stay-safe/${guide.slug}`,
      lastModified: dateOf(guide.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...terms.map((term) => ({
      url: `${SITE_URL}/glossary/${term.slug}`,
      lastModified: dateOf(term.meta.lastReviewed),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/business/guides/${guide.slug}`,
      lastModified: dateOf(guide.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...complianceTopics.map((topic) => ({
      url: `${SITE_URL}/business/compliance/${topic.slug}`,
      lastModified: dateOf(topic.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...contracts.map((contract) => ({
      url: `${SITE_URL}/business/contracts/${contract.slug}`,
      lastModified: dateOf(contract.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...industries.map((hub) => ({
      url: `${SITE_URL}/business/industries/${hub.slug}`,
      lastModified: dateOf(hub.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...briefings.map((briefing) => ({
      url: `${SITE_URL}/business/ceo/${briefing.slug}`,
      lastModified: dateOf(briefing.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...updates.map((update) => ({
      url: `${SITE_URL}/business/regulatory-watch/${update.slug}`,
      lastModified: dateOf(update.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...videos.map((item) => ({
      url: `${SITE_URL}/watch/${item.slug}`,
      lastModified: dateOf(item.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...episodes.map((item) => ({
      url: `${SITE_URL}/listen/${item.slug}`,
      lastModified: dateOf(item.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // A scheduled session changes up to the moment it airs; an archived one
    // does not. The frequency follows the state rather than the route.
    ...liveEvents.map((event) => ({
      url: `${SITE_URL}/live/${event.slug}`,
      lastModified: dateOf(event.publishedAt),
      changeFrequency:
        event.liveStatus === "ended" ? ("yearly" as const) : ("daily" as const),
      priority: event.liveStatus === "ended" ? 0.6 : 0.8,
    })),
    ...series
      .filter((strand) => strand.kind !== "live")
      .map((strand) => ({
        url: `${SITE_URL}/${strand.kind === "podcast" ? "listen" : "watch"}/series/${strand.slug}`,
        lastModified: dateOf(strand.meta.lastReviewed),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...problems.map((problem) => ({
      url: `${SITE_URL}/legal-help/problem/${problem.slug}`,
      lastModified: dateOf(problem.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...questions.map((question) => ({
      url: `${SITE_URL}/ask/${question.slug}`,
      lastModified: dateOf(question.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Sample listings are excluded: a page that carries `robots: noindex`
    // because it is not a real practitioner has no business in the sitemap.
    ...listings
      .filter((listing) => listing.listingStatus === "verified")
      .map((listing) => ({
        url: `${SITE_URL}/lawyers/${listing.slug}`,
        lastModified: dateOf(listing.meta.lastReviewed),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  const reviewed = (items: { meta: { lastReviewed: string } }[]) =>
    items.map((item) => item.meta.lastReviewed);
  const published = (items: { publishedAt: string }[]) =>
    items.map((item) => item.publishedAt);

  /**
   * A hub's freshness is the freshness of what it lists. Pages with no dated
   * content behind them (policies, contact, tools) send no `lastModified` at
   * all rather than a build timestamp that would mark them changed on every
   * deploy.
   */
  const businessDates = [
    ...reviewed(guides),
    ...reviewed(complianceTopics),
    ...reviewed(contracts),
    ...reviewed(industries),
    ...reviewed(briefings),
    ...published(updates),
  ];
  const hubDates: Record<string, (string | undefined)[]> = {
    "/": [
      ...published(articles),
      ...published(updates),
      ...published(videos),
      ...published(episodes),
    ],
    "/know-the-law": reviewed(entries),
    "/your-rights": reviewed(rights),
    "/business": businessDates,
    "/business/compliance": reviewed(complianceTopics),
    "/business/regulatory-watch": published(updates),
    "/business/guides": reviewed(guides),
    "/business/contracts": reviewed(contracts),
    "/business/industries": reviewed(industries),
    "/business/ceo": reviewed(briefings),
    "/stay-safe": reviewed(safety),
    "/law-and-society": published(articles),
    "/glossary": reviewed(terms),
    "/watch": [...published(videos), ...reviewed(series)],
    "/listen": [...published(episodes), ...reviewed(series)],
    "/live": published(liveEvents),
    "/legal-help/problem": reviewed(problems),
    "/lawyers": reviewed(
      listings.filter((listing) => listing.listingStatus === "verified")
    ),
    "/ask": reviewed(questions),
    "/cases": reviewed(cases),
    "/know-the-law/amendments": reviewed(histories),
    "/quizzes": reviewed(quizzes),
    "/resources": reviewed(checklists),
  };

  return [
    ...routes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: newest(...(hubDates[route.path] ?? [])),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...detail,
  ];
}
