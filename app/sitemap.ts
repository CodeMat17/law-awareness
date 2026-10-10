import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/repository";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lawawareness.org";

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
  { path: "/know-the-law/your-rights", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/business", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/business/compliance", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/business/regulatory-watch", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/business/guides", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/business/contracts", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/know-the-law/stay-safe", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/news", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/constitution", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/constitutions", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/search", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/programmes", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/watch", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/listen", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/live", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/san-of-the-week", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/legal-help", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/legal-help/problem", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/legal-help/legal-aid", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/ask", priority: 0.7, changeFrequency: "weekly" as const },
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
    guides,
    complianceTopics,
    contracts,
    updates,
    videos,
    episodes,
    liveEvents,
    series,
    problems,
    questions,
    articles,
    chapters,
    programmes,
    sanFeatures,
  ] = await Promise.all([
    content.getLawCategories(),
    content.getLawEntries(),
    content.getRightGuides(),
    content.getSafetyGuides(),
    content.getBusinessGuides(),
    content.getComplianceTopics(),
    content.getContractTypes(),
    content.getRegulatoryUpdates(),
    content.getVideos(),
    content.getPodcastEpisodes(),
    content.getLiveEvents(),
    content.getMediaSeries(),
    content.getLegalProblems(),
    content.getPublicQuestions(),
    content.getLatestArticles(),
    content.getConstitutionChapters(),
    content.getProgrammeCategories(),
    content.getSanFeatures(),
  ]);

  const detail: MetadataRoute.Sitemap = [
    ...sanFeatures.map((feature) => ({
      url: `${SITE_URL}/san-of-the-week/${feature.slug}`,
      lastModified: dateOf(feature.weekOf),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...programmes.map((programme) => ({
      url: `${SITE_URL}/programmes/${programme.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Chapter pages exist for all eight chapters; the ones with no sections
    // explained yet still map the chapter, which is worth indexing.
    ...chapters.map((chapter) => ({
      url: `${SITE_URL}/constitution/chapter-${chapter.numeral.toLowerCase()}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/news/${article.slug}`,
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
      url: `${SITE_URL}/know-the-law/your-rights/${guide.slug}`,
      lastModified: dateOf(guide.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...safety.map((guide) => ({
      url: `${SITE_URL}/know-the-law/stay-safe/${guide.slug}`,
      lastModified: dateOf(guide.meta.lastReviewed),
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
    "/know-the-law/your-rights": reviewed(rights),
    "/business": businessDates,
    "/business/compliance": reviewed(complianceTopics),
    "/business/regulatory-watch": published(updates),
    "/business/guides": reviewed(guides),
    "/business/contracts": reviewed(contracts),
    "/know-the-law/stay-safe": reviewed(safety),
    "/news": published(articles),
    "/watch": [...published(videos), ...reviewed(series)],
    "/listen": [...published(episodes), ...reviewed(series)],
    "/live": published(liveEvents),
    "/san-of-the-week": sanFeatures.map((feature) => feature.weekOf),
    "/legal-help/problem": reviewed(problems),
    "/ask": reviewed(questions),
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
