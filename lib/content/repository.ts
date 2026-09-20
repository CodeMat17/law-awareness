import {
  fetchArticles,
  fetchBusinessGuides,
  fetchCases,
  fetchCeoBriefings,
  fetchChecklists,
  fetchComplianceTopics,
  fetchContractTypes,
  fetchGlossaryTerms,
  fetchIndustryHubs,
  fetchLawCategories,
  fetchLawHistories,
  fetchLawyerListings,
  fetchLegalProblems,
  fetchMedia,
  fetchMediaSeries,
  fetchPublicQuestions,
  fetchQuizzes,
  fetchReferralRoutes,
  fetchRegulatoryUpdates,
  fetchRights,
  fetchTickerItems,
  fetchAlertTopics,
  fetchCalendarEntries,
  fetchConstitutionChapters,
  fetchConstitutionSections,
  fetchCourtProfiles,
  fetchHealthCheckQuestions,
  fetchLawEntries,
  fetchProfileQuestions,
  fetchSafetyGuides,
} from "./convex-repository";
import * as seed from "./data";
import { checklistItems, quizQuestions } from "./learning";
import { caseRecords, courtProfiles } from "./case-law";
import { constitutionSections } from "./constitution-sections";
import { constitutionChapters, type ConstitutionChapter } from "./constitution";
import { lawHistories } from "./versions";
import type {
  AlertTopic,
  Article,
  CaseRecord,
  ConstitutionSection,
  CourtLevel,
  CourtProfile,
  LawHistory,
  LawVersion,
  BusinessArea,
  BusinessGuide,
  BusinessGuideDetail,
  CalendarEntry,
  CeoBriefing,
  Checklist,
  ChecklistItem,
  ComplianceArea,
  ComplianceTopic,
  ContractType,
  EntryPoint,
  GlossaryTerm,
  HealthCheckQuestion,
  IndustryHub,
  IssueCategory,
  LawCategory,
  LawEntry,
  LawyerListing,
  LegalProblem,
  LiveEvent,
  MediaDetail,
  MediaItem,
  MediaKind,
  MediaSeries,
  NavGroup,
  PlatformStat,
  ProfileQuestion,
  PublicQuestion,
  Quiz,
  QuizQuestion,
  ReferralRoute,
  RegulatoryUpdate,
  RelatedItem,
  RelatedRefs,
  RightGuide,
  RightSummary,
  SafetyGuide,
  SearchDocument,
  TickerItem,
  WorkflowStatus,
} from "./types";

/**
 * The facets the lawyer directory filters on (spec section 36).
 *
 * Derived from the listings rather than maintained beside them, so a filter
 * option can never exist without a listing behind it.
 */
/**
 * The facets the Case Law Explorer filters on (spec section 29).
 *
 * Derived from the records, exactly as `DirectoryFacets` is, so the explorer
 * can never offer a court, a year or a subject with no case behind it. The
 * spec also lists judge and case number as filters; neither is offered,
 * because neither is stored — see the editorial note in ./case-law.
 */
export interface CaseFacets {
  courts: CourtProfile[];
  years: number[];
  subjects: { slug: string; name: string }[];
  issues: string[];
}

export interface DirectoryFacets {
  states: string[];
  cities: string[];
  practiceAreas: string[];
  languages: string[];
  experienceBands: string[];
  availability: string[];
}

/**
 * The data seam.
 *
 * Every server component reads content through `getContent()`, and the concrete
 * adapter is chosen in one place. `ConvexContentRepository` below extends the
 * seed-backed one and overrides a method per collection that Convex owns. That
 * let the cutover advance collection by collection without a page, section or
 * component being touched, and it is now complete: every collection the site
 * renders is overridden, and `InMemoryContentRepository` survives as the
 * offline fallback rather than as the source of anything a reader sees.
 *
 * Read methods return PUBLISHED content only. The CMS reads drafts through
 * `lib/cms/repository.ts`, which is guarded by authentication.
 */
export interface ContentRepository {
  getNavigation(): Promise<NavGroup[]>;
  getTickerItems(): Promise<TickerItem[]>;
  getEntryPoints(): Promise<EntryPoint[]>;
  getPlatformStats(): Promise<PlatformStat[]>;
  getIssueCategories(): Promise<IssueCategory[]>;
  getLawCategories(): Promise<LawCategory[]>;
  getLawCategory(slug: string): Promise<LawCategory | null>;
  /** Published law entries, optionally narrowed to one category. */
  getLawEntries(categorySlug?: string): Promise<LawEntry[]>;
  getLawEntry(slug: string): Promise<LawEntry | null>;
  getFeaturedRights(limit?: number): Promise<RightSummary[]>;
  getRightGuides(): Promise<RightGuide[]>;
  getRightGuide(slug: string): Promise<RightGuide | null>;
  /** Stay Safe guides, optionally narrowed to one series. */
  getSafetyGuides(series?: string): Promise<SafetyGuide[]>;
  getSafetyGuide(slug: string): Promise<SafetyGuide | null>;
  getBusinessGuides(limit?: number): Promise<BusinessGuide[]>;
  getBusinessGuide(slug: string): Promise<BusinessGuideDetail | null>;
  getComplianceAreas(): Promise<ComplianceArea[]>;

  /* Business & enterprise - Phase 3 */
  getBusinessAreas(): Promise<BusinessArea[]>;
  /** Compliance Centre topics, optionally narrowed to one compliance area. */
  getComplianceTopics(areaId?: string): Promise<ComplianceTopic[]>;
  getComplianceTopic(slug: string): Promise<ComplianceTopic | null>;
  getHealthCheckQuestions(): Promise<HealthCheckQuestion[]>;
  getProfileQuestions(): Promise<ProfileQuestion[]>;
  getAlertTopics(): Promise<AlertTopic[]>;
  getCalendarEntries(): Promise<CalendarEntry[]>;
  /** Regulatory Watch entries, newest first, optionally narrowed to a topic. */
  getRegulatoryUpdates(topic?: string, limit?: number): Promise<RegulatoryUpdate[]>;
  getRegulatoryUpdate(slug: string): Promise<RegulatoryUpdate | null>;
  getContractTypes(): Promise<ContractType[]>;
  getContractType(slug: string): Promise<ContractType | null>;
  getIndustryHubs(): Promise<IndustryHub[]>;
  getIndustryHub(slug: string): Promise<IndustryHub | null>;
  getCeoBriefings(limit?: number): Promise<CeoBriefing[]>;
  getCeoBriefing(slug: string): Promise<CeoBriefing | null>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  getLiveEvent(): Promise<MediaItem | null>;
  getMediaItems(limit?: number): Promise<MediaItem[]>;

  /* Media - Phase 4 */
  getVideos(limit?: number): Promise<MediaDetail[]>;
  getPodcastEpisodes(limit?: number): Promise<MediaDetail[]>;
  /** One video or episode. The kind decides which pool is searched. */
  getMediaDetail(kind: MediaKind, slug: string): Promise<MediaDetail | null>;
  /** Live sessions: on air first, then upcoming, then the archive. */
  getLiveEvents(): Promise<LiveEvent[]>;
  getLiveEventBySlug(slug: string): Promise<LiveEvent | null>;
  getMediaSeries(kind?: MediaKind): Promise<MediaSeries[]>;
  getMediaSeriesBySlug(slug: string): Promise<MediaSeries | null>;
  /** Everything belonging to one series, live sessions included. */
  getSeriesItems(slug: string): Promise<MediaDetail[]>;
  /** Topics in use, derived from the items. */
  getMediaTopics(kind?: MediaKind): Promise<string[]>;
  /* Legal help - Phase 5 */
  /** Problem pathways, optionally narrowed to one category. */
  getLegalProblems(category?: string): Promise<LegalProblem[]>;
  getLegalProblem(slug: string): Promise<LegalProblem | null>;
  /** Categories in use, derived from the pathways themselves. */
  getProblemCategories(): Promise<string[]>;
  getReferralRoutes(): Promise<ReferralRoute[]>;
  getReferralRoute(slug: string): Promise<ReferralRoute | null>;
  /** The routes one pathway points at, in the order the pathway lists them. */
  getReferralRoutesFor(slugs: string[]): Promise<ReferralRoute[]>;
  getLawyerListings(): Promise<LawyerListing[]>;
  getLawyerListing(slug: string): Promise<LawyerListing | null>;
  /** Filter facets, derived from the listings so they cannot go stale. */
  getDirectoryFacets(): Promise<DirectoryFacets>;
  /** Published questions, newest first. */
  getPublicQuestions(limit?: number): Promise<PublicQuestion[]>;
  getPublicQuestion(slug: string): Promise<PublicQuestion | null>;
  getQuestionTopics(): Promise<string[]>;

  /* Professional/advanced - Phase 6 */
  /** Decided cases, most authoritative court first, then newest. */
  getCases(): Promise<CaseRecord[]>;
  getCase(slug: string): Promise<CaseRecord | null>;
  /** Explorer facets, derived from the records so they cannot go stale. */
  getCaseFacets(): Promise<CaseFacets>;
  /** The court hierarchy, ranked. */
  getCourtProfiles(): Promise<CourtProfile[]>;
  getConstitutionChapters(): Promise<ConstitutionChapter[]>;
  getConstitutionChapter(numeral: string): Promise<ConstitutionChapter | null>;
  /** Sections, optionally narrowed to one chapter, in document order. */
  getConstitutionSections(chapter?: string): Promise<ConstitutionSection[]>;
  getConstitutionSection(number: string): Promise<ConstitutionSection | null>;
  /** Version histories, optionally narrowed to one followable topic. */
  getLawHistories(topic?: string): Promise<LawHistory[]>;
  getLawHistory(lawSlug: string): Promise<LawHistory | null>;
  /** The version currently in force, or null where the record does not say. */
  getCurrentVersion(lawSlug: string): Promise<LawVersion | null>;

  getGlossaryTerms(limit?: number): Promise<GlossaryTerm[]>;
  getGlossaryTerm(slug: string): Promise<GlossaryTerm | null>;
  getQuizzes(limit?: number): Promise<Quiz[]>;
  getQuiz(slug: string): Promise<Quiz | null>;
  /** The questions behind a quiz, in the order they are asked. */
  getQuizQuestions(slug: string): Promise<QuizQuestion[]>;
  getChecklists(limit?: number): Promise<Checklist[]>;
  getChecklist(slug: string): Promise<Checklist | null>;
  /** The lines of a checklist, in order. Grouping is carried on each line. */
  getChecklistItems(slug: string): Promise<ChecklistItem[]>;
  /** Resolves stored cross-reference slugs into renderable items. */
  getRelated(refs: RelatedRefs | undefined): Promise<RelatedItem[]>;
  /** Everything searchable, in one shape. */
  getSearchDocuments(): Promise<SearchDocument[]>;
}

interface HasStatus {
  status: WorkflowStatus;
}
interface HasMeta {
  meta: { status: WorkflowStatus };
}

function isPublishedItem(item: HasStatus): boolean {
  return item.status === "published";
}

function isPublished<T extends HasMeta>(item: T): boolean {
  return item.meta.status === "published";
}

/** Newest first, by publication date. */
function newestFirst<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

function take<T>(items: T[], limit?: number): T[] {
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/**
 * In-memory adapter over the seed content. Deterministic, synchronous under the
 * hood, and safe to render on the server with zero network cost.
 */
export class InMemoryContentRepository implements ContentRepository {
  async getNavigation(): Promise<NavGroup[]> {
    return seed.navigation;
  }

  async getTickerItems(): Promise<TickerItem[]> {
    return seed.tickerItems.filter(isPublishedItem);
  }

  async getEntryPoints(): Promise<EntryPoint[]> {
    return seed.entryPoints;
  }

  async getPlatformStats(): Promise<PlatformStat[]> {
    return seed.platformStats;
  }

  async getIssueCategories(): Promise<IssueCategory[]> {
    return seed.issueCategories;
  }

  /**
   * `entryCount` is derived rather than stored, so a category can never claim
   * more explainers than have actually been published.
   */
  async getLawCategories(): Promise<LawCategory[]> {
    const published = seed.lawEntries.filter(isPublished);
    return seed.lawCategoryDefs.map((category) => ({
      ...category,
      entryCount: published.filter((entry) => entry.category === category.slug)
        .length,
    }));
  }

  async getLawCategory(slug: string): Promise<LawCategory | null> {
    const categories = await this.getLawCategories();
    return categories.find((category) => category.slug === slug) ?? null;
  }

  async getLawEntries(categorySlug?: string): Promise<LawEntry[]> {
    return seed.lawEntries
      .filter(isPublished)
      .filter((entry) => !categorySlug || entry.category === categorySlug);
  }

  async getLawEntry(slug: string): Promise<LawEntry | null> {
    const entry = seed.lawEntries.find((item) => item.slug === slug);
    return entry && isPublished(entry) ? entry : null;
  }

  async getFeaturedRights(limit?: number): Promise<RightSummary[]> {
    return take(seed.featuredRights.filter(isPublished), limit);
  }

  async getRightGuides(): Promise<RightGuide[]> {
    return seed.rightGuides.filter(isPublished);
  }

  async getRightGuide(slug: string): Promise<RightGuide | null> {
    const guide = seed.rightGuides.find((item) => item.slug === slug);
    return guide && isPublished(guide) ? guide : null;
  }

  async getSafetyGuides(series?: string): Promise<SafetyGuide[]> {
    return seed.safetyGuides
      .filter(isPublished)
      .filter((guide) => !series || guide.series === series);
  }

  async getSafetyGuide(slug: string): Promise<SafetyGuide | null> {
    const guide = seed.safetyGuides.find((item) => item.slug === slug);
    return guide && isPublished(guide) ? guide : null;
  }

  async getBusinessGuides(limit?: number): Promise<BusinessGuide[]> {
    return take(seed.businessGuides.filter(isPublished), limit);
  }

  async getBusinessGuide(slug: string): Promise<BusinessGuideDetail | null> {
    const guide = seed.businessGuideDetails.find((item) => item.slug === slug);
    return guide && isPublished(guide) ? guide : null;
  }

  async getComplianceAreas(): Promise<ComplianceArea[]> {
    return seed.complianceAreas;
  }

  /* Business & enterprise - Phase 3 -------------------------------------- */

  async getBusinessAreas(): Promise<BusinessArea[]> {
    return seed.businessAreas;
  }

  async getComplianceTopics(areaId?: string): Promise<ComplianceTopic[]> {
    return seed.complianceTopics
      .filter(isPublished)
      .filter((topic) => !areaId || topic.areaId === areaId);
  }

  async getComplianceTopic(slug: string): Promise<ComplianceTopic | null> {
    const topic = seed.complianceTopics.find((item) => item.slug === slug);
    return topic && isPublished(topic) ? topic : null;
  }

  async getHealthCheckQuestions(): Promise<HealthCheckQuestion[]> {
    return seed.healthCheckQuestions;
  }

  async getProfileQuestions(): Promise<ProfileQuestion[]> {
    return seed.profileQuestions;
  }

  async getAlertTopics(): Promise<AlertTopic[]> {
    return seed.alertTopics;
  }

  async getCalendarEntries(): Promise<CalendarEntry[]> {
    return seed.calendarEntries.filter(isPublished);
  }

  async getRegulatoryUpdates(
    topic?: string,
    limit?: number
  ): Promise<RegulatoryUpdate[]> {
    const sorted = [...seed.regulatoryUpdates]
      .filter(isPublished)
      .filter((update) => !topic || update.topic === topic)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return take(sorted, limit);
  }

  async getRegulatoryUpdate(slug: string): Promise<RegulatoryUpdate | null> {
    const update = seed.regulatoryUpdates.find((item) => item.slug === slug);
    return update && isPublished(update) ? update : null;
  }

  async getContractTypes(): Promise<ContractType[]> {
    return seed.contractTypes.filter(isPublished);
  }

  async getContractType(slug: string): Promise<ContractType | null> {
    const contract = seed.contractTypes.find((item) => item.slug === slug);
    return contract && isPublished(contract) ? contract : null;
  }

  async getIndustryHubs(): Promise<IndustryHub[]> {
    return seed.industryHubs.filter(isPublished);
  }

  async getIndustryHub(slug: string): Promise<IndustryHub | null> {
    const hub = seed.industryHubs.find((item) => item.slug === slug);
    return hub && isPublished(hub) ? hub : null;
  }

  async getCeoBriefings(limit?: number): Promise<CeoBriefing[]> {
    return take(seed.ceoBriefings.filter(isPublished), limit);
  }

  async getCeoBriefing(slug: string): Promise<CeoBriefing | null> {
    const briefing = seed.ceoBriefings.find((item) => item.slug === slug);
    return briefing && isPublished(briefing) ? briefing : null;
  }

  async getLatestArticles(limit?: number): Promise<Article[]> {
    const sorted = [...seed.latestArticles]
      .filter(isPublished)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return take(sorted, limit);
  }

  async getArticle(slug: string): Promise<Article | null> {
    const article = seed.latestArticles.find((item) => item.slug === slug);
    return article && isPublished(article) ? article : null;
  }

  /** The session currently on air, if there is one. */
  async getLiveEvent(): Promise<MediaItem | null> {
    const live = seed.liveEvents.find(
      (event) => isPublished(event) && event.liveStatus === "live"
    );
    return live ?? null;
  }

  async getMediaItems(limit?: number): Promise<MediaItem[]> {
    const sorted = [...seed.mediaItems]
      .filter(isPublished)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return take(sorted, limit);
  }

  /* Media - Phase 4 ------------------------------------------------------- */

  async getVideos(limit?: number): Promise<MediaDetail[]> {
    return take(newestFirst(seed.videos.filter(isPublished)), limit);
  }

  async getPodcastEpisodes(limit?: number): Promise<MediaDetail[]> {
    return take(newestFirst(seed.podcastEpisodes.filter(isPublished)), limit);
  }

  async getMediaDetail(
    kind: MediaKind,
    slug: string
  ): Promise<MediaDetail | null> {
    const pool = kind === "podcast" ? seed.podcastEpisodes : seed.videos;
    const item = pool.find((entry) => entry.slug === slug);
    return item && isPublished(item) ? item : null;
  }

  /**
   * Live events, on air first, then upcoming, then the archive. Ordering is
   * derived from `liveStatus` rather than from the clock, so a prerendered
   * schedule cannot disagree with the page it links to.
   */
  async getLiveEvents(): Promise<LiveEvent[]> {
    const rank: Record<LiveEvent["liveStatus"], number> = {
      live: 0,
      scheduled: 1,
      ended: 2,
    };
    return [...seed.liveEvents].filter(isPublished).sort((a, b) => {
      if (rank[a.liveStatus] !== rank[b.liveStatus]) {
        return rank[a.liveStatus] - rank[b.liveStatus];
      }
      // Upcoming reads soonest first; everything else newest first.
      return a.liveStatus === "scheduled"
        ? (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? "")
        : b.publishedAt.localeCompare(a.publishedAt);
    });
  }

  async getLiveEventBySlug(slug: string): Promise<LiveEvent | null> {
    const event = seed.liveEvents.find((entry) => entry.slug === slug);
    return event && isPublished(event) ? event : null;
  }

  async getMediaSeries(kind?: MediaKind): Promise<MediaSeries[]> {
    return seed.mediaSeries
      .filter(isPublished)
      .filter((series) => (kind ? series.kind === kind : true));
  }

  async getMediaSeriesBySlug(slug: string): Promise<MediaSeries | null> {
    const series = seed.mediaSeries.find((entry) => entry.slug === slug);
    return series && isPublished(series) ? series : null;
  }

  /**
   * Every item in a series, newest first. Live sessions are included so an
   * archived event stays reachable from the strand that produced it.
   */
  async getSeriesItems(slug: string): Promise<MediaDetail[]> {
    const pool: MediaDetail[] = [
      ...seed.videos,
      ...seed.podcastEpisodes,
      ...seed.liveEvents,
    ];
    return newestFirst(
      pool.filter((item) => isPublished(item) && item.seriesSlug === slug)
    );
  }

  /** Topics in use, derived from the items rather than maintained by hand. */
  async getMediaTopics(kind?: MediaKind): Promise<string[]> {
    const pool =
      kind === "podcast"
        ? seed.podcastEpisodes
        : kind === "video"
          ? seed.videos
          : [...seed.videos, ...seed.podcastEpisodes];
    const topics = new Set<string>();
    for (const item of pool.filter(isPublished)) {
      for (const topic of item.topics) topics.add(topic);
    }
    return [...topics].sort((a, b) => a.localeCompare(b));
  }

  /* ---------------------------------------------------------------------- */
  /* Legal help - Phase 5                                                    */
  /* ---------------------------------------------------------------------- */

  async getLegalProblems(category?: string): Promise<LegalProblem[]> {
    return seed.legalProblems
      .filter(isPublished)
      .filter((problem) => (category ? problem.category === category : true));
  }

  async getLegalProblem(slug: string): Promise<LegalProblem | null> {
    const problem = seed.legalProblems.find((item) => item.slug === slug);
    return problem && isPublished(problem) ? problem : null;
  }

  /** Derived from the pathways, so the chooser cannot offer an empty group. */
  async getProblemCategories(): Promise<string[]> {
    const categories = new Set<string>();
    for (const problem of seed.legalProblems.filter(isPublished)) {
      categories.add(problem.category);
    }
    return [...categories];
  }

  async getReferralRoutes(): Promise<ReferralRoute[]> {
    return seed.referralRoutes.filter(isPublished);
  }

  async getReferralRoute(slug: string): Promise<ReferralRoute | null> {
    const route = seed.referralRoutes.find((item) => item.slug === slug);
    return route && isPublished(route) ? route : null;
  }

  /**
   * Resolved in the order the pathway lists them, with anything unresolved or
   * unpublished dropped - the same discipline `getRelated()` applies.
   */
  async getReferralRoutesFor(slugs: string[]): Promise<ReferralRoute[]> {
    const routes: ReferralRoute[] = [];
    for (const slug of slugs) {
      const route = await this.getReferralRoute(slug);
      if (route) routes.push(route);
    }
    return routes;
  }

  async getLawyerListings(): Promise<LawyerListing[]> {
    return seed.lawyerListings.filter(isPublished);
  }

  async getLawyerListing(slug: string): Promise<LawyerListing | null> {
    const listing = seed.lawyerListings.find((item) => item.slug === slug);
    return listing && isPublished(listing) ? listing : null;
  }

  async getDirectoryFacets(): Promise<DirectoryFacets> {
    const listings = await this.getLawyerListings();
    const collect = (values: (listing: LawyerListing) => string[]) => {
      const set = new Set<string>();
      for (const listing of listings) {
        for (const value of values(listing)) set.add(value);
      }
      return [...set].sort((a, b) => a.localeCompare(b));
    };

    return {
      states: collect((listing) => [listing.state]),
      cities: collect((listing) => [listing.city]),
      practiceAreas: collect((listing) => listing.practiceAreas),
      languages: collect((listing) => listing.languages),
      // Experience is ordered by seniority, not alphabetically.
      experienceBands: ["1-5", "6-10", "11-20", "20+"].filter((band) =>
        listings.some((listing) => listing.experienceBand === band)
      ),
      availability: collect((listing) => [listing.availability]),
    };
  }

  async getPublicQuestions(limit?: number): Promise<PublicQuestion[]> {
    const sorted = [...seed.publicQuestions]
      .filter(isPublished)
      .sort((a, b) => b.askedOn.localeCompare(a.askedOn));
    return take(sorted, limit);
  }

  async getPublicQuestion(slug: string): Promise<PublicQuestion | null> {
    const question = seed.publicQuestions.find((item) => item.slug === slug);
    return question && isPublished(question) ? question : null;
  }

  async getQuestionTopics(): Promise<string[]> {
    const topics = new Set<string>();
    for (const question of seed.publicQuestions.filter(isPublished)) {
      topics.add(question.topic);
    }
    return [...topics].sort((a, b) => a.localeCompare(b));
  }

  /* Professional/advanced - Phase 6 ------------------------------------- */

  /**
   * Ordered by authority first and recency second, because "which court said
   * it" decides how much a decision matters. Alphabetical order would be
   * actively misleading here.
   */
  async getCases(): Promise<CaseRecord[]> {
    const rank = new Map(courtProfiles.map((court) => [court.id, court.rank]));
    return caseRecords.filter(isPublished).sort((a, b) => {
      const byCourt = (rank.get(a.court) ?? 99) - (rank.get(b.court) ?? 99);
      return byCourt !== 0 ? byCourt : b.year - a.year;
    });
  }

  async getCase(slug: string): Promise<CaseRecord | null> {
    const record = caseRecords.find((item) => item.slug === slug);
    return record && isPublished(record) ? record : null;
  }

  async getCaseFacets(): Promise<CaseFacets> {
    const cases = await this.getCases();
    const categories = await this.getLawCategories();

    const usedCourts = new Set(cases.map((item) => item.court));
    const years = [...new Set(cases.map((item) => item.year))].sort(
      (a, b) => b - a
    );
    const subjects = [...new Set(cases.map((item) => item.subject))]
      .map((slug) => ({
        slug,
        name: categories.find((category) => category.slug === slug)?.name ?? slug,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const issues = [...new Set(cases.map((item) => item.issueTag))].sort(
      (a, b) => a.localeCompare(b)
    );

    return {
      courts: courtProfiles.filter((court) => usedCourts.has(court.id)),
      years,
      subjects,
      issues,
    };
  }

  async getCourtProfiles(): Promise<CourtProfile[]> {
    return [...courtProfiles].sort((a, b) => a.rank - b.rank);
  }

  async getConstitutionChapters(): Promise<ConstitutionChapter[]> {
    return constitutionChapters;
  }

  async getConstitutionChapter(
    numeral: string
  ): Promise<ConstitutionChapter | null> {
    return (
      constitutionChapters.find(
        (chapter) => chapter.numeral.toLowerCase() === numeral.toLowerCase()
      ) ?? null
    );
  }

  /**
   * Document order, not the order of the array: sections are numbered, and a
   * reader looking for s. 45 expects it between 44 and 46.
   */
  async getConstitutionSections(
    chapter?: string
  ): Promise<ConstitutionSection[]> {
    return constitutionSections
      .filter((section) => !chapter || section.chapter === chapter)
      .sort((a, b) => Number(a.number) - Number(b.number));
  }

  async getConstitutionSection(
    number: string
  ): Promise<ConstitutionSection | null> {
    return (
      constitutionSections.find((section) => section.number === number) ?? null
    );
  }

  async getLawHistories(topic?: string): Promise<LawHistory[]> {
    return lawHistories
      .filter(isPublished)
      .filter((history) => !topic || history.topic === topic);
  }

  async getLawHistory(lawSlug: string): Promise<LawHistory | null> {
    const history = lawHistories.find((item) => item.lawSlug === lawSlug);
    return history && isPublished(history) ? history : null;
  }

  /**
   * Returns null rather than falling back to the first version. A record that
   * does not say which version is in force must not be made to say it.
   */
  async getCurrentVersion(lawSlug: string): Promise<LawVersion | null> {
    const history = await this.getLawHistory(lawSlug);
    return history?.versions.find((version) => version.current) ?? null;
  }

  async getGlossaryTerms(limit?: number): Promise<GlossaryTerm[]> {
    const sorted = [...seed.glossaryTerms]
      .filter(isPublished)
      .sort((a, b) => a.term.localeCompare(b.term));
    return take(sorted, limit);
  }

  async getGlossaryTerm(slug: string): Promise<GlossaryTerm | null> {
    const term = seed.glossaryTerms.find((item) => item.slug === slug);
    return term && isPublished(term) ? term : null;
  }

  async getQuizzes(limit?: number): Promise<Quiz[]> {
    return take(seed.quizzes.filter(isPublished), limit);
  }

  async getQuiz(slug: string): Promise<Quiz | null> {
    const quiz = seed.quizzes.find((item) => item.slug === slug);
    return quiz && isPublished(quiz) ? quiz : null;
  }

  /**
   * A quiz whose questions have not been written yet returns an empty list
   * rather than a partly-populated one, so the page can say so plainly.
   */
  async getQuizQuestions(slug: string): Promise<QuizQuestion[]> {
    return quizQuestions[slug] ?? [];
  }

  async getChecklists(limit?: number): Promise<Checklist[]> {
    return take(seed.checklists.filter(isPublished), limit);
  }

  async getChecklist(slug: string): Promise<Checklist | null> {
    const checklist = seed.checklists.find((item) => item.slug === slug);
    return checklist && isPublished(checklist) ? checklist : null;
  }

  async getChecklistItems(slug: string): Promise<ChecklistItem[]> {
    return checklistItems[slug] ?? [];
  }

  /**
   * The content graph. References are stored as slugs; unresolved or
   * unpublished references are dropped silently rather than rendering a
   * dead link.
   */
  async getRelated(refs: RelatedRefs | undefined): Promise<RelatedItem[]> {
    if (!refs) return [];

    const categories = await this.getLawCategories();
    const categoryName = (slug: string) =>
      categories.find((category) => category.slug === slug)?.name ?? "Law";
    // Through the repository rather than the seed array: courts are a
    // collection now, and a related case must be labelled with the court the
    // site is actually rendering, not the one the seed file remembers.
    const courts = await this.getCourtProfiles();
    const courtName = (id: CourtLevel) =>
      courts.find((court) => court.id === id)?.name ?? "Court";

    const items: RelatedItem[] = [];

    for (const slug of refs.laws ?? []) {
      const entry = await this.getLawEntry(slug);
      if (!entry) continue;
      items.push({
        id: `related-law-${entry.id}`,
        kind: "law",
        title: entry.title,
        group: `Know the Law · ${categoryName(entry.category)}`,
        summary: entry.summary,
        href: `/know-the-law/${entry.category}/${entry.slug}`,
        icon: "scale",
      });
    }

    for (const slug of refs.rights ?? []) {
      const guide = await this.getRightGuide(slug);
      if (!guide) continue;
      items.push({
        id: `related-right-${guide.id}`,
        kind: "right",
        title: guide.title,
        group: `Your Rights · ${guide.category}`,
        summary: guide.summary,
        href: `/your-rights/${guide.slug}`,
        icon: "shield-check",
      });
    }

    for (const slug of refs.safety ?? []) {
      const guide = await this.getSafetyGuide(slug);
      if (!guide) continue;
      items.push({
        id: `related-safety-${guide.id}`,
        kind: "safety",
        title: guide.title,
        group: guide.series ? `Stay Safe · ${guide.series}` : "Stay Safe",
        summary: guide.summary,
        href: `/stay-safe/${guide.slug}`,
        icon: "shield",
      });
    }

    const guides = await this.getBusinessGuides();
    for (const slug of refs.guides ?? []) {
      const guide = guides.find((item) => item.slug === slug);
      if (!guide) continue;
      items.push({
        id: `related-guide-${guide.id}`,
        kind: "guide",
        title: guide.title,
        group: `Business · ${guide.area}`,
        summary: guide.summary,
        href: `/business/guides/${guide.slug}`,
        icon: "briefcase",
      });
    }

    const articles = await this.getLatestArticles();
    for (const slug of refs.articles ?? []) {
      const article = articles.find((item) => item.slug === slug);
      if (!article) continue;
      items.push({
        id: `related-article-${article.id}`,
        kind: "article",
        title: article.title,
        group: `Law & Society · ${article.category}`,
        summary: article.standfirst,
        href: `/law-and-society/${article.slug}`,
        icon: "newspaper",
      });
    }

    // Live sessions are resolvable by slug too, so an archived event can be
    // referenced from a law entry exactly as a video is.
    const allMedia = [
      ...(await this.getMediaItems()),
      ...(await this.getLiveEvents()),
    ];
    for (const slug of refs.media ?? []) {
      const item = allMedia.find((entry) => entry.slug === slug);
      if (!item) continue;
      items.push({
        id: `related-media-${item.id}`,
        kind: "media",
        title: item.title,
        group: mediaGroup(item),
        summary: item.description,
        href: `/${mediaSegment(item)}/${item.slug}`,
        icon: mediaIcon(item),
      });
    }

    for (const slug of refs.compliance ?? []) {
      const topic = await this.getComplianceTopic(slug);
      if (!topic) continue;
      items.push({
        id: `related-compliance-${topic.id}`,
        kind: "compliance",
        title: topic.title,
        group: "Compliance Centre",
        summary: topic.summary,
        href: `/business/compliance/${topic.slug}`,
        icon: topic.icon,
      });
    }

    for (const slug of refs.contracts ?? []) {
      const contract = await this.getContractType(slug);
      if (!contract) continue;
      items.push({
        id: `related-contract-${contract.id}`,
        kind: "contract",
        title: contract.name,
        group: `Contracts · ${contract.family}`,
        summary: contract.whatItIs,
        href: `/business/contracts/${contract.slug}`,
        icon: "signature",
      });
    }

    for (const slug of refs.industries ?? []) {
      const hub = await this.getIndustryHub(slug);
      if (!hub) continue;
      items.push({
        id: `related-industry-${hub.id}`,
        kind: "industry",
        title: hub.name,
        group: "Industry hub",
        summary: hub.blurb,
        href: `/business/industries/${hub.slug}`,
        icon: hub.icon,
      });
    }

    for (const slug of refs.briefings ?? []) {
      const briefing = await this.getCeoBriefing(slug);
      if (!briefing) continue;
      items.push({
        id: `related-briefing-${briefing.id}`,
        kind: "briefing",
        title: briefing.title,
        group: "Law for CEOs",
        summary: briefing.summary,
        href: `/business/ceo/${briefing.slug}`,
        icon: "trending-up",
      });
    }

    for (const slug of refs.updates ?? []) {
      const update = await this.getRegulatoryUpdate(slug);
      if (!update) continue;
      items.push({
        id: `related-update-${update.id}`,
        kind: "update",
        title: update.title,
        group: "Regulatory Watch",
        summary: update.explanation[0] ?? "",
        href: `/business/regulatory-watch/${update.slug}`,
        icon: "bell",
      });
    }

    for (const slug of refs.problems ?? []) {
      const problem = await this.getLegalProblem(slug);
      if (!problem) continue;
      items.push({
        id: `related-problem-${problem.id}`,
        kind: "problem",
        title: problem.title,
        group: `Legal Help · ${problem.category}`,
        summary: problem.summary,
        href: `/legal-help/problem/${problem.slug}`,
        icon: problem.icon,
      });
    }

    for (const slug of refs.questions ?? []) {
      const question = await this.getPublicQuestion(slug);
      if (!question) continue;
      items.push({
        id: `related-question-${question.id}`,
        kind: "question",
        title: question.question,
        group: `Ask a Question · ${question.topic}`,
        summary: question.generalAnswer[0] ?? "",
        href: `/ask/${question.slug}`,
        icon: "circle-question",
      });
    }

    for (const slug of refs.referrals ?? []) {
      const route = await this.getReferralRoute(slug);
      if (!route) continue;
      items.push({
        id: `related-referral-${route.id}`,
        kind: "referral",
        title: route.name,
        group: "Where to get help",
        summary: route.whatItIs,
        href: `/legal-help/legal-aid#${route.slug}`,
        icon: route.icon,
      });
    }

    for (const slug of refs.cases ?? []) {
      const record = await this.getCase(slug);
      if (!record) continue;
      items.push({
        id: `related-case-${record.id}`,
        kind: "case",
        title: record.title,
        group: `Case law · ${courtName(record.court)}`,
        summary: record.keyPrinciple,
        href: `/cases/${record.slug}`,
        icon: "gavel",
      });
    }

    for (const number of refs.sections ?? []) {
      const section = await this.getConstitutionSection(number);
      if (!section) continue;
      items.push({
        id: `related-section-${section.id}`,
        kind: "section",
        title: `Section ${section.number} — ${section.heading}`,
        group: `The Constitution · Chapter ${section.chapter}`,
        summary: section.plainLanguage,
        href: `/constitution/chapter-${section.chapter.toLowerCase()}#s-${section.number}`,
        icon: "landmark",
      });
    }

    for (const slug of refs.terms ?? []) {
      const term = await this.getGlossaryTerm(slug);
      if (!term) continue;
      items.push({
        id: `related-term-${term.id}`,
        kind: "term",
        title: term.term,
        group: "Plain language",
        summary: term.definition,
        href: `/glossary/${term.slug}`,
        icon: "book-open",
      });
    }

    return items;
  }

  async getSearchDocuments(): Promise<SearchDocument[]> {
    const [
      categories,
      laws,
      rights,
      safety,
      guides,
      articles,
      media,
      live,
      series,
      terms,
      quizzes,
      checklists,
      complianceTopics,
      contracts,
      industries,
      briefings,
      updates,
      problems,
      questions,
      listings,
      referrals,
      cases,
      sections,
    ] = await Promise.all([
      this.getLawCategories(),
      this.getLawEntries(),
      this.getRightGuides(),
      this.getSafetyGuides(),
      this.getBusinessGuides(),
      this.getLatestArticles(),
      Promise.all([this.getVideos(), this.getPodcastEpisodes()]).then(
        ([videoItems, episodes]) => [...videoItems, ...episodes]
      ),
      this.getLiveEvents(),
      this.getMediaSeries(),
      this.getGlossaryTerms(),
      this.getQuizzes(),
      this.getChecklists(),
      this.getComplianceTopics(),
      this.getContractTypes(),
      this.getIndustryHubs(),
      this.getCeoBriefings(),
      this.getRegulatoryUpdates(),
      this.getLegalProblems(),
      this.getPublicQuestions(),
      this.getLawyerListings(),
      this.getReferralRoutes(),
      this.getCases(),
      this.getConstitutionSections(),
    ]);

    const categoryName = (slug: string) =>
      categories.find((category) => category.slug === slug)?.name ?? "Law";

    return [
      ...laws.map<SearchDocument>((entry) => ({
        id: `law-${entry.id}`,
        type: "law",
        title: entry.title,
        summary: entry.summary,
        group: `Know the Law · ${categoryName(entry.category)}`,
        href: `/know-the-law/${entry.category}/${entry.slug}`,
        keywords: [entry.instrument, categoryName(entry.category), ...entry.covers],
      })),
      ...categories.map<SearchDocument>((category) => ({
        id: `category-${category.slug}`,
        type: "law",
        title: category.name,
        summary: category.blurb,
        group: "Know the Law",
        href: `/know-the-law/${category.slug}`,
        keywords: [category.blurb],
      })),
      ...rights.map<SearchDocument>((guide) => ({
        id: `right-${guide.id}`,
        type: "right",
        title: guide.title,
        summary: guide.summary,
        group: `Your Rights · ${guide.category}`,
        href: `/your-rights/${guide.slug}`,
        keywords: [guide.situation, guide.category, ...guide.protects],
      })),
      ...safety.map<SearchDocument>((guide) => ({
        id: `safety-${guide.id}`,
        type: "safety",
        title: guide.title,
        summary: guide.summary,
        group: guide.series ? `Stay Safe · ${guide.series}` : "Stay Safe",
        href: `/stay-safe/${guide.slug}`,
        keywords: [guide.risk, guide.area, ...guide.redFlags],
      })),
      ...guides.map<SearchDocument>((guide) => ({
        id: `guide-${guide.id}`,
        type: "guide",
        title: guide.title,
        summary: guide.summary,
        group: `Business · ${guide.area}`,
        href: `/business/guides/${guide.slug}`,
        keywords: [guide.situation, guide.area],
      })),
      ...articles.map<SearchDocument>((article) => ({
        id: `article-${article.id}`,
        type: "article",
        title: article.title,
        summary: article.standfirst,
        group: `Law & Society · ${article.category}`,
        href: `/law-and-society/${article.slug}`,
        keywords: [article.category, article.kind],
      })),
      ...media.map<SearchDocument>((item) => ({
        id: `media-${item.id}`,
        type: "media",
        title: item.title,
        summary: item.description,
        group: mediaGroup(item),
        href: `/${mediaSegment(item)}/${item.slug}`,
        keywords: [item.series ?? "", item.host ?? "", ...item.topics].filter(
          Boolean
        ),
      })),
      ...live.map<SearchDocument>((event) => ({
        id: `media-${event.id}`,
        type: "media",
        title: event.title,
        summary: event.description,
        group: "Live",
        href: `/live/${event.slug}`,
        keywords: [event.series ?? "", ...event.topics],
      })),
      ...series
        .filter((strand) => strand.kind !== "live")
        .map<SearchDocument>((strand) => ({
        id: `series-${strand.id}`,
        type: "media",
        title: strand.title,
        summary: strand.description,
        group: strand.kind === "podcast" ? "Listen · Series" : "Watch · Series",
        href: `/${strand.kind === "podcast" ? "listen" : "watch"}/series/${strand.slug}`,
        keywords: [strand.tagline, ...strand.topics],
      })),
      ...terms.map<SearchDocument>((term) => ({
        id: `term-${term.id}`,
        type: "term",
        title: term.term,
        summary: term.definition,
        group: "Plain language",
        href: `/glossary/${term.slug}`,
        keywords: term.alsoKnownAs ?? [],
      })),
      ...quizzes.map<SearchDocument>((quiz) => ({
        id: `quiz-${quiz.id}`,
        type: "quiz",
        title: quiz.title,
        summary: quiz.description,
        group: "Quizzes",
        href: `/quizzes/${quiz.slug}`,
        keywords: [quiz.level],
      })),
      ...checklists.map<SearchDocument>((checklist) => ({
        id: `checklist-${checklist.id}`,
        type: "resource",
        title: checklist.title,
        summary: checklist.description,
        group: "Resources",
        href: `/resources/${checklist.slug}`,
        keywords: [checklist.audience],
      })),
      ...complianceTopics.map<SearchDocument>((topic) => ({
        id: `compliance-${topic.id}`,
        type: "compliance",
        title: topic.title,
        summary: topic.summary,
        group: "Compliance Centre",
        href: `/business/compliance/${topic.slug}`,
        keywords: [...topic.whatItCovers, ...topic.appliesWhen],
      })),
      ...contracts.map<SearchDocument>((contract) => ({
        id: `contract-${contract.id}`,
        type: "contract",
        title: contract.name,
        summary: contract.whatItIs,
        group: `Contracts · ${contract.family}`,
        href: `/business/contracts/${contract.slug}`,
        keywords: [
          contract.family,
          ...contract.commonlyUsedWhen,
          ...contract.importantClauses.map((clause) => clause.name),
        ],
      })),
      ...industries.map<SearchDocument>((hub) => ({
        id: `industry-${hub.id}`,
        type: "industry",
        title: hub.name,
        summary: hub.blurb,
        group: "Industry hubs",
        href: `/business/industries/${hub.slug}`,
        keywords: hub.regulatoryThemes,
      })),
      ...briefings.map<SearchDocument>((briefing) => ({
        id: `briefing-${briefing.id}`,
        type: "briefing",
        title: briefing.title,
        summary: briefing.summary,
        group: "Law for CEOs",
        href: `/business/ceo/${briefing.slug}`,
        keywords: [briefing.question, ...briefing.keyPoints],
      })),
      ...updates.map<SearchDocument>((update) => ({
        id: `update-${update.id}`,
        type: "update",
        title: update.title,
        summary: update.explanation[0] ?? "",
        group: "Regulatory Watch",
        href: `/business/regulatory-watch/${update.slug}`,
        keywords: [update.topic, ...update.whoIsAffected],
      })),
      // Legal help is indexed on the reader's own words for the situation, not
      // on legal vocabulary they may not have.
      ...problems.map<SearchDocument>((problem) => ({
        id: `problem-${problem.id}`,
        type: "problem",
        title: problem.title,
        summary: problem.summary,
        group: `Legal Help · ${problem.category}`,
        href: `/legal-help/problem/${problem.slug}`,
        keywords: [
          problem.situation,
          problem.category,
          ...problem.rightsInThisSituation,
          ...problem.doNow,
        ],
      })),
      ...questions.map<SearchDocument>((question) => ({
        id: `question-${question.id}`,
        type: "question",
        title: question.question,
        summary: question.generalAnswer[0] ?? "",
        group: `Ask a Question · ${question.topic}`,
        href: `/ask/${question.slug}`,
        keywords: [question.topic, ...question.whatToDoNext],
      })),
      ...listings.map<SearchDocument>((listing) => ({
        id: `lawyer-${listing.id}`,
        type: "lawyer",
        title: listing.displayName,
        summary: listing.focus,
        group: `Directory · ${listing.state}`,
        href: `/lawyers/${listing.slug}`,
        keywords: [
          listing.state,
          listing.city,
          ...listing.practiceAreas,
          ...listing.languages,
        ],
      })),
      ...cases.map<SearchDocument>((record) => ({
        id: `case-${record.id}`,
        type: "case",
        title: record.title,
        summary: record.keyPrinciple,
        group: `Case law · ${
          courtProfiles.find((court) => court.id === record.court)?.name ??
          "Court"
        }`,
        href: `/cases/${record.slug}`,
        keywords: [
          String(record.year),
          record.issueTag,
          record.legalIssue,
          categoryName(record.subject),
          ...record.instruments,
        ],
      })),
      ...sections.map<SearchDocument>((section) => ({
        id: `section-${section.id}`,
        type: "section",
        title: `Section ${section.number} — ${section.heading}`,
        summary: section.plainLanguage,
        group: `The Constitution · Chapter ${section.chapter}`,
        href: `/constitution/chapter-${section.chapter.toLowerCase()}#s-${section.number}`,
        keywords: [
          `section ${section.number}`,
          `s. ${section.number}`,
          `chapter ${section.chapter}`,
          "constitution",
        ],
      })),
      ...referrals.map<SearchDocument>((route) => ({
        id: `referral-${route.id}`,
        type: "problem",
        title: route.name,
        summary: route.whatItIs,
        group: "Where to get help",
        href: `/legal-help/legal-aid#${route.slug}`,
        keywords: route.whoItIsFor,
      })),
    ];
  }
}

/** Media routes split by format: podcasts listen, everything else watches. */
function mediaSegment(item: MediaItem): string {
  if (item.kind === "podcast") return "listen";
  if (item.kind === "live") return "live";
  return "watch";
}

/** The hub a media item belongs to, used as its label in search and related. */
function mediaGroup(item: MediaItem): string {
  if (item.kind === "podcast") return item.series ? `Listen · ${item.series}` : "Listen";
  if (item.kind === "live") return "Live";
  return item.series ? `Watch · ${item.series}` : "Watch";
}

function mediaIcon(item: MediaItem): string {
  if (item.kind === "podcast") return "headphones";
  if (item.kind === "live") return "radio";
  return "play";
}

/**
 * The site reading from Convex.
 *
 * It extends the seed-backed repository and overrides one method per
 * collection that Convex fully owns, so coverage is explicit: a collection is
 * database-driven exactly when it appears below, and seed-driven otherwise.
 *
 * Adding a collection is two steps, in this order:
 *
 *   1. complete its fields in lib/cms/collections.ts and its mapper in
 *      lib/cms/repository.ts, so the CMS record loses nothing the site needs;
 *   2. override its read method here, against a reader in
 *      ./convex-repository.ts.
 */
class ConvexContentRepository extends InMemoryContentRepository {
  override async getTickerItems(): Promise<TickerItem[]> {
    return (await fetchTickerItems()) ?? super.getTickerItems();
  }

  /**
   * Cases come back unordered from Convex; the explorer's order - most
   * authoritative court first, then newest - is applied here, using the same
   * hierarchy the seed path uses.
   */
  override async getCases(): Promise<CaseRecord[]> {
    const cases = await fetchCases();
    if (!cases) return super.getCases();

    const rank = new Map(courtProfiles.map((court) => [court.id, court.rank]));
    return [...cases].sort((a, b) => {
      const byCourt = (rank.get(a.court) ?? 99) - (rank.get(b.court) ?? 99);
      return byCourt !== 0 ? byCourt : b.year - a.year;
    });
  }

  override async getCase(slug: string): Promise<CaseRecord | null> {
    const cases = await fetchCases();
    if (!cases) return super.getCase(slug);
    return cases.find((item) => item.slug === slug) ?? null;
  }

  // getCaseFacets is deliberately not overridden: it derives everything from
  // `this.getCases()`, so it follows the override above on its own.

  /* Media ----------------------------------------------------------------- */

  /**
   * Every published video, episode and live session held in the CMS.
   *
   * This used to merge CMS rows over the seed record of the same slug, because
   * the collection stored a card's worth of a video and nothing else. It now
   * stores the whole of a `MediaDetail` - topics, takeaways, contributors,
   * chapters, transcript - so there is nothing left for a seed to supply, and
   * an empty list here means an editor has not filled one in rather than that
   * the CMS could not hold it.
   *
   * `live` is dropped on the way out: it is how a row says it belongs in the
   * schedule rather than in a hub, and `liveEvents()` below is the only reader
   * that wants it.
   */
  private async mediaRecords(): Promise<MediaDetail[] | null> {
    const rows = await fetchMedia();
    if (!rows) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return rows.map(({ live, ...item }) => item);
  }

  /**
   * The live schedule: on air first, then upcoming soonest-first, then the
   * archive newest-first - the same order the seed path applies.
   */
  private async liveEvents(): Promise<LiveEvent[] | null> {
    const rows = await fetchMedia();
    if (!rows) return null;

    const events = rows.flatMap(({ live, ...item }) =>
      live && item.kind === "live" ? [{ ...item, ...live }] : []
    );

    const rank: Record<LiveEvent["liveStatus"], number> = {
      live: 0,
      scheduled: 1,
      ended: 2,
    };
    return events.sort((a, b) => {
      if (rank[a.liveStatus] !== rank[b.liveStatus]) {
        return rank[a.liveStatus] - rank[b.liveStatus];
      }
      return a.liveStatus === "scheduled"
        ? (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? "")
        : b.publishedAt.localeCompare(a.publishedAt);
    });
  }

  override async getLiveEvents(): Promise<LiveEvent[]> {
    return (await this.liveEvents()) ?? super.getLiveEvents();
  }

  override async getLiveEventBySlug(slug: string): Promise<LiveEvent | null> {
    const events = await this.liveEvents();
    if (!events) return super.getLiveEventBySlug(slug);
    return events.find((event) => event.slug === slug) ?? null;
  }

  /** The one session on air now, if any - the banner above the site reads it. */
  override async getLiveEvent(): Promise<MediaItem | null> {
    const events = await this.liveEvents();
    if (!events) return super.getLiveEvent();
    return events.find((event) => event.liveStatus === "live") ?? null;
  }

  override async getVideos(limit?: number): Promise<MediaDetail[]> {
    const merged = await this.mediaRecords();
    if (!merged) return super.getVideos(limit);
    return take(
      newestFirst(merged.filter((item) => item.kind === "video")),
      limit
    );
  }

  override async getPodcastEpisodes(limit?: number): Promise<MediaDetail[]> {
    const merged = await this.mediaRecords();
    if (!merged) return super.getPodcastEpisodes(limit);
    return take(
      newestFirst(merged.filter((item) => item.kind === "podcast")),
      limit
    );
  }

  override async getMediaDetail(
    kind: MediaKind,
    slug: string
  ): Promise<MediaDetail | null> {
    const merged = await this.mediaRecords();
    if (!merged) return super.getMediaDetail(kind, slug);
    return (
      merged.find((item) => item.kind === kind && item.slug === slug) ?? null
    );
  }

  override async getSeriesItems(slug: string): Promise<MediaDetail[]> {
    const merged = await this.mediaRecords();
    if (!merged) return super.getSeriesItems(slug);
    return newestFirst(merged.filter((item) => item.seriesSlug === slug));
  }

  override async getMediaTopics(kind?: MediaKind): Promise<string[]> {
    const merged = await this.mediaRecords();
    if (!merged) return super.getMediaTopics(kind);
    const topics = new Set<string>();
    for (const item of merged) {
      if (kind && item.kind !== kind) continue;
      if (item.kind === "live") continue;
      for (const topic of item.topics) topics.add(topic);
    }
    return [...topics].sort((a, b) => a.localeCompare(b));
  }

  override async getMediaItems(limit?: number): Promise<MediaItem[]> {
    const merged = await this.mediaRecords();
    if (!merged) return super.getMediaItems(limit);
    return take(newestFirst(merged), limit);
  }

  /**
   * Series, with their topics derived from the items in them.
   *
   * `topics` is the one part of a `MediaSeries` the CMS does not store, and
   * deliberately: a series is about whatever its episodes are about, so a
   * stored copy is a second answer that goes stale the moment one is added.
   * Deriving it means the strand page and the topic filters agree by
   * construction.
   */
  override async getMediaSeries(kind?: MediaKind): Promise<MediaSeries[]> {
    const rows = await fetchMediaSeries();
    if (!rows) return super.getMediaSeries(kind);

    const items = (await this.mediaRecords()) ?? [];
    const topicsBySeries = new Map<string, Set<string>>();
    for (const item of items) {
      if (!item.seriesSlug) continue;
      const topics =
        topicsBySeries.get(item.seriesSlug) ??
        topicsBySeries.set(item.seriesSlug, new Set()).get(item.seriesSlug)!;
      for (const topic of item.topics) topics.add(topic);
    }

    const merged = rows.map((row) => ({
      ...row,
      topics: [...(topicsBySeries.get(row.slug) ?? [])].sort((a, b) =>
        a.localeCompare(b)
      ),
    }));

    return kind ? merged.filter((series) => series.kind === kind) : merged;
  }

  override async getMediaSeriesBySlug(
    slug: string
  ): Promise<MediaSeries | null> {
    const all = await this.getMediaSeries();
    return all.find((series) => series.slug === slug) ?? null;
  }

  /* Law & Society --------------------------------------------------------- */

  /**
   * Articles, the CMS merged over the seed.
   *
   * The pattern from here down is the one `mergedMedia` sets out: the seed
   * record is the base and the CMS supplies what it owns, so a save through
   * the admin cannot strip a field the CMS has no form control for. A record
   * the CMS alone knows about is built from what it has, and the page renders
   * the sections that have content.
   */
  private async mergedArticles(): Promise<Article[] | null> {
    const rows = await fetchArticles();
    if (!rows) return null;
    const seeded = new Map(seed.latestArticles.map((item) => [item.slug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      // A CMS-only article has no `body`, which is already optional: the page
      // renders the standfirst and says the piece is not written out yet.
      return base ? { ...base, ...row } : row;
    });
  }

  override async getLatestArticles(limit?: number): Promise<Article[]> {
    const merged = await this.mergedArticles();
    if (!merged) return super.getLatestArticles(limit);
    return take(newestFirst(merged), limit);
  }

  override async getArticle(slug: string): Promise<Article | null> {
    const merged = await this.mergedArticles();
    if (!merged) return super.getArticle(slug);
    return merged.find((item) => item.slug === slug) ?? null;
  }
  /* Know the Law ---------------------------------------------------------- */

  /**
   * Categories from the CMS, counted against the seeded explainers.
   *
   * `entryCount` stays derived, exactly as it is on the seed path: law entries
   * are not a CMS collection yet, so the count is taken from where the entries
   * actually live. A category with no entries behind it counts zero rather
   * than claiming a library it does not have.
   */
  override async getLawCategories(): Promise<LawCategory[]> {
    const rows = await fetchLawCategories();
    if (!rows) return super.getLawCategories();
    const published = seed.lawEntries.filter(isPublished);
    return rows.map((category) => ({
      ...category,
      entryCount: published.filter((entry) => entry.category === category.slug)
        .length,
    }));
  }

  override async getLawCategory(slug: string): Promise<LawCategory | null> {
    const categories = await this.getLawCategories();
    return categories.find((category) => category.slug === slug) ?? null;
  }

  /* Your Rights ----------------------------------------------------------- */

  private async mergedRights(): Promise<RightGuide[] | null> {
    const rows = await fetchRights();
    if (!rows) return null;
    const seeded = new Map(seed.rightGuides.map((item) => [item.slug, item]));
    return rows.map((row) => {
      // The CMS now carries the whole guide, steps and misconceptions
      // included. The seed is merged under it only for `related`, which is a
      // graph between records rather than a field on one.
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getRightGuides(): Promise<RightGuide[]> {
    return (await this.mergedRights()) ?? super.getRightGuides();
  }

  override async getRightGuide(slug: string): Promise<RightGuide | null> {
    const guides = await this.mergedRights();
    if (!guides) return super.getRightGuide(slug);
    return guides.find((guide) => guide.slug === slug) ?? null;
  }

  override async getFeaturedRights(limit?: number): Promise<RightSummary[]> {
    const guides = await this.mergedRights();
    if (!guides) return super.getFeaturedRights(limit);
    return take(guides, limit);
  }

  /* Business guides ------------------------------------------------------- */

  private async mergedBusinessGuides(): Promise<BusinessGuideDetail[] | null> {
    const rows = await fetchBusinessGuides();
    if (!rows) return null;
    const seeded = new Map(
      seed.businessGuideDetails.map((item) => [item.slug, item])
    );
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getBusinessGuides(limit?: number): Promise<BusinessGuide[]> {
    const guides = await this.mergedBusinessGuides();
    if (!guides) return super.getBusinessGuides(limit);
    return take(guides, limit);
  }

  override async getBusinessGuide(
    slug: string
  ): Promise<BusinessGuideDetail | null> {
    const guides = await this.mergedBusinessGuides();
    if (!guides) return super.getBusinessGuide(slug);
    return guides.find((guide) => guide.slug === slug) ?? null;
  }

  /* Learning -------------------------------------------------------------- */

  private async mergedGlossary(): Promise<GlossaryTerm[] | null> {
    const rows = await fetchGlossaryTerms();
    if (!rows) return null;
    const seeded = new Map(seed.glossaryTerms.map((item) => [item.slug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getGlossaryTerms(limit?: number): Promise<GlossaryTerm[]> {
    const terms = await this.mergedGlossary();
    if (!terms) return super.getGlossaryTerms(limit);
    return take(
      [...terms].sort((a, b) => a.term.localeCompare(b.term)),
      limit
    );
  }

  override async getGlossaryTerm(slug: string): Promise<GlossaryTerm | null> {
    const terms = await this.mergedGlossary();
    if (!terms) return super.getGlossaryTerm(slug);
    return terms.find((term) => term.slug === slug) ?? null;
  }

  override async getQuizzes(limit?: number): Promise<Quiz[]> {
    const rows = await fetchQuizzes();
    if (!rows) return super.getQuizzes(limit);
    return take(rows, limit);
  }

  override async getQuiz(slug: string): Promise<Quiz | null> {
    const rows = await fetchQuizzes();
    if (!rows) return super.getQuiz(slug);
    return rows.find((quiz) => quiz.slug === slug) ?? null;
  }

  /**
   * The questions in one quiz.
   *
   * These lived in the seed until the quiz collection grew a row field for
   * them: a question's options are themselves a list, and a row column holds
   * one string, so they are stored one-per-line inside the column and split
   * back out on the way in.
   *
   * A quiz the CMS knows about with no questions stored returns none rather
   * than falling back to the seed. Falling back would put a reader through the
   * questions of an older version of a quiz an editor has since emptied.
   */
  override async getQuizQuestions(slug: string): Promise<QuizQuestion[]> {
    const rows = await fetchQuizzes();
    if (!rows) return super.getQuizQuestions(slug);
    return rows.find((quiz) => quiz.slug === slug)?.questions ?? [];
  }

  override async getChecklists(limit?: number): Promise<Checklist[]> {
    const rows = await fetchChecklists();
    if (!rows) return super.getChecklists(limit);
    return take(rows, limit);
  }

  override async getChecklist(slug: string): Promise<Checklist | null> {
    const rows = await fetchChecklists();
    if (!rows) return super.getChecklist(slug);
    return rows.find((checklist) => checklist.slug === slug) ?? null;
  }

  override async getChecklistItems(slug: string): Promise<ChecklistItem[]> {
    const rows = await fetchChecklists();
    if (!rows) return super.getChecklistItems(slug);
    // A checklist the CMS knows about but has written no lines for returns
    // none, rather than falling through to the seed's lines: the editor
    // emptying a checklist has to be able to empty it.
    return rows.find((checklist) => checklist.slug === slug)?.items ?? [];
  }

  /* Compliance & enterprise ------------------------------------------------ */

  private async mergedComplianceTopics(): Promise<ComplianceTopic[] | null> {
    const rows = await fetchComplianceTopics();
    if (!rows) return null;
    const seeded = new Map(
      seed.complianceTopics.map((item) => [item.slug, item])
    );
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getComplianceTopics(
    areaId?: string
  ): Promise<ComplianceTopic[]> {
    const topics = await this.mergedComplianceTopics();
    if (!topics) return super.getComplianceTopics(areaId);
    return topics.filter((topic) => !areaId || topic.areaId === areaId);
  }

  override async getComplianceTopic(
    slug: string
  ): Promise<ComplianceTopic | null> {
    const topics = await this.mergedComplianceTopics();
    if (!topics) return super.getComplianceTopic(slug);
    return topics.find((topic) => topic.slug === slug) ?? null;
  }

  private async mergedContracts(): Promise<ContractType[] | null> {
    const rows = await fetchContractTypes();
    if (!rows) return null;
    const seeded = new Map(seed.contractTypes.map((item) => [item.slug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getContractTypes(): Promise<ContractType[]> {
    return (await this.mergedContracts()) ?? super.getContractTypes();
  }

  override async getContractType(slug: string): Promise<ContractType | null> {
    const contracts = await this.mergedContracts();
    if (!contracts) return super.getContractType(slug);
    return contracts.find((contract) => contract.slug === slug) ?? null;
  }

  private async mergedIndustries(): Promise<IndustryHub[] | null> {
    const rows = await fetchIndustryHubs();
    if (!rows) return null;
    const seeded = new Map(seed.industryHubs.map((item) => [item.slug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getIndustryHubs(): Promise<IndustryHub[]> {
    return (await this.mergedIndustries()) ?? super.getIndustryHubs();
  }

  override async getIndustryHub(slug: string): Promise<IndustryHub | null> {
    const hubs = await this.mergedIndustries();
    if (!hubs) return super.getIndustryHub(slug);
    return hubs.find((hub) => hub.slug === slug) ?? null;
  }

  private async mergedCeoBriefings(): Promise<CeoBriefing[] | null> {
    const rows = await fetchCeoBriefings();
    if (!rows) return null;
    const seeded = new Map(seed.ceoBriefings.map((item) => [item.slug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getCeoBriefings(limit?: number): Promise<CeoBriefing[]> {
    const briefings = await this.mergedCeoBriefings();
    if (!briefings) return super.getCeoBriefings(limit);
    return take(briefings, limit);
  }

  override async getCeoBriefing(slug: string): Promise<CeoBriefing | null> {
    const briefings = await this.mergedCeoBriefings();
    if (!briefings) return super.getCeoBriefing(slug);
    return briefings.find((briefing) => briefing.slug === slug) ?? null;
  }

  private async mergedRegulatoryUpdates(): Promise<RegulatoryUpdate[] | null> {
    const rows = await fetchRegulatoryUpdates();
    if (!rows) return null;
    const seeded = new Map(
      seed.regulatoryUpdates.map((item) => [item.slug, item])
    );
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getRegulatoryUpdates(
    topic?: string,
    limit?: number
  ): Promise<RegulatoryUpdate[]> {
    const updates = await this.mergedRegulatoryUpdates();
    if (!updates) return super.getRegulatoryUpdates(topic, limit);
    return take(
      newestFirst(updates).filter(
        (update) => !topic || update.topic === topic
      ),
      limit
    );
  }

  override async getRegulatoryUpdate(
    slug: string
  ): Promise<RegulatoryUpdate | null> {
    const updates = await this.mergedRegulatoryUpdates();
    if (!updates) return super.getRegulatoryUpdate(slug);
    return updates.find((update) => update.slug === slug) ?? null;
  }

  /* Legal help ------------------------------------------------------------ */

  private async mergedLegalProblems(): Promise<LegalProblem[] | null> {
    const rows = await fetchLegalProblems();
    if (!rows) return null;
    const seeded = new Map(seed.legalProblems.map((item) => [item.slug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      // Triage questions are the one part still without a form - each carries
      // its own list of answers, and rows are one level deep. A pathway the CMS
      // alone knows about has none, and the page renders the rest of the flow.
      return base ? { ...base, ...row } : { ...row, triage: [] };
    });
  }

  override async getLegalProblems(
    category?: string
  ): Promise<LegalProblem[]> {
    const problems = await this.mergedLegalProblems();
    if (!problems) return super.getLegalProblems(category);
    return problems.filter(
      (problem) => !category || problem.category === category
    );
  }

  override async getLegalProblem(slug: string): Promise<LegalProblem | null> {
    const problems = await this.mergedLegalProblems();
    if (!problems) return super.getLegalProblem(slug);
    return problems.find((problem) => problem.slug === slug) ?? null;
  }

  // getProblemCategories, getReferralRoutesFor, getDirectoryFacets and
  // getQuestionTopics all derive from the methods above, so they follow the
  // overrides on their own.

  override async getReferralRoutes(): Promise<ReferralRoute[]> {
    return (await fetchReferralRoutes()) ?? super.getReferralRoutes();
  }

  override async getReferralRoute(slug: string): Promise<ReferralRoute | null> {
    const routes = await fetchReferralRoutes();
    if (!routes) return super.getReferralRoute(slug);
    return routes.find((route) => route.slug === slug) ?? null;
  }

  override async getLawyerListings(): Promise<LawyerListing[]> {
    return (await fetchLawyerListings()) ?? super.getLawyerListings();
  }

  override async getLawyerListing(slug: string): Promise<LawyerListing | null> {
    const listings = await fetchLawyerListings();
    if (!listings) return super.getLawyerListing(slug);
    return listings.find((listing) => listing.slug === slug) ?? null;
  }

  private async mergedQuestions(): Promise<PublicQuestion[] | null> {
    const rows = await fetchPublicQuestions();
    if (!rows) return null;
    const seeded = new Map(
      seed.publicQuestions.map((item) => [item.slug, item])
    );
    return rows.map((row) => {
      const base = seeded.get(row.slug);
      return base ? { ...base, ...row } : row;
    });
  }

  override async getPublicQuestions(
    limit?: number
  ): Promise<PublicQuestion[]> {
    const questions = await this.mergedQuestions();
    if (!questions) return super.getPublicQuestions(limit);
    return take(
      [...questions].sort((a, b) => b.askedOn.localeCompare(a.askedOn)),
      limit
    );
  }

  override async getPublicQuestion(
    slug: string
  ): Promise<PublicQuestion | null> {
    const questions = await this.mergedQuestions();
    if (!questions) return super.getPublicQuestion(slug);
    return questions.find((question) => question.slug === slug) ?? null;
  }

  override async getQuestionTopics(): Promise<string[]> {
    const questions = await this.mergedQuestions();
    if (!questions) return super.getQuestionTopics();
    const topics = new Set(questions.map((question) => question.topic));
    return [...topics].sort((a, b) => a.localeCompare(b));
  }

  /* Amendment tracking ----------------------------------------------------- */

  private async mergedLawHistories(): Promise<LawHistory[] | null> {
    const rows = await fetchLawHistories();
    if (!rows) return null;
    const seeded = new Map(lawHistories.map((item) => [item.lawSlug, item]));
    return rows.map((row) => {
      const base = seeded.get(row.lawSlug);
      // The version timeline is structured. A history the CMS alone knows
      // about has none, and the tracker says so rather than inventing one.
      return base ? { ...base, ...row } : { ...row, versions: [] };
    });
  }

  override async getLawHistories(topic?: string): Promise<LawHistory[]> {
    const histories = await this.mergedLawHistories();
    if (!histories) return super.getLawHistories(topic);
    return histories.filter((history) => !topic || history.topic === topic);
  }

  override async getLawHistory(lawSlug: string): Promise<LawHistory | null> {
    const histories = await this.mergedLawHistories();
    if (!histories) return super.getLawHistory(lawSlug);
    return histories.find((history) => history.lawSlug === lawSlug) ?? null;
  }

  // getCurrentVersion reads through getLawHistory, so it follows on its own.


  // Live events are deliberately not overridden. A `LiveEvent` additionally
  // carries an agenda, a question policy, a registration note and an archive
  // policy, none of which the CMS models - so /live keeps rendering from the
  // seed until those fields exist rather than showing events with the
  // commitments to an audience stripped out.

  /* Know the Law ---------------------------------------------------------- */

  override async getLawEntries(categorySlug?: string): Promise<LawEntry[]> {
    const rows = await fetchLawEntries();
    if (!rows) return super.getLawEntries(categorySlug);
    return categorySlug
      ? rows.filter((entry) => entry.category === categorySlug)
      : rows;
  }

  override async getLawEntry(slug: string): Promise<LawEntry | null> {
    const rows = await fetchLawEntries();
    if (!rows) return super.getLawEntry(slug);
    return rows.find((entry) => entry.slug === slug) ?? null;
  }

  /* Your Rights ----------------------------------------------------------- */

  override async getSafetyGuides(series?: string): Promise<SafetyGuide[]> {
    const rows = await fetchSafetyGuides();
    if (!rows) return super.getSafetyGuides(series);
    return series ? rows.filter((guide) => guide.series === series) : rows;
  }

  override async getSafetyGuide(slug: string): Promise<SafetyGuide | null> {
    const rows = await fetchSafetyGuides();
    if (!rows) return super.getSafetyGuide(slug);
    return rows.find((guide) => guide.slug === slug) ?? null;
  }

  /* The Constitution and the courts --------------------------------------- */

  override async getConstitutionChapters(): Promise<ConstitutionChapter[]> {
    return (await fetchConstitutionChapters()) ?? super.getConstitutionChapters();
  }

  override async getConstitutionChapter(
    numeral: string
  ): Promise<ConstitutionChapter | null> {
    const rows = await fetchConstitutionChapters();
    if (!rows) return super.getConstitutionChapter(numeral);
    return (
      rows.find(
        (chapter) => chapter.numeral.toLowerCase() === numeral.toLowerCase()
      ) ?? null
    );
  }

  /**
   * Sections, in the order the Constitution numbers them.
   *
   * Convex returns rows unordered, and section numbers are stored as strings -
   * so they are compared as numbers here, or section 10 would sort before
   * section 9.
   */
  override async getConstitutionSections(
    chapter?: string
  ): Promise<ConstitutionSection[]> {
    const rows = await fetchConstitutionSections();
    if (!rows) return super.getConstitutionSections(chapter);
    return rows
      .filter((section) => !chapter || section.chapter === chapter)
      .sort((a, b) => Number(a.number) - Number(b.number));
  }

  override async getConstitutionSection(
    number: string
  ): Promise<ConstitutionSection | null> {
    const rows = await fetchConstitutionSections();
    if (!rows) return super.getConstitutionSection(number);
    return rows.find((section) => section.number === number) ?? null;
  }

  /**
   * The court hierarchy, most authoritative first.
   *
   * A row whose court id the application does not recognise reads as null and
   * is dropped here - it could only ever match no case, so it would render as
   * a filter with nothing behind it.
   */
  override async getCourtProfiles(): Promise<CourtProfile[]> {
    const rows = await fetchCourtProfiles();
    if (!rows) return super.getCourtProfiles();
    const courts = rows.filter((court): court is CourtProfile => court !== null);
    return courts.length > 0
      ? [...courts].sort((a, b) => a.rank - b.rank)
      : super.getCourtProfiles();
  }

  /* Business tools -------------------------------------------------------- */

  override async getAlertTopics(): Promise<AlertTopic[]> {
    return (await fetchAlertTopics()) ?? super.getAlertTopics();
  }

  override async getCalendarEntries(): Promise<CalendarEntry[]> {
    return (await fetchCalendarEntries()) ?? super.getCalendarEntries();
  }

  override async getHealthCheckQuestions(): Promise<HealthCheckQuestion[]> {
    return (
      (await fetchHealthCheckQuestions()) ?? super.getHealthCheckQuestions()
    );
  }

  override async getProfileQuestions(): Promise<ProfileQuestion[]> {
    return (await fetchProfileQuestions()) ?? super.getProfileQuestions();
  }
}

const memoryRepository = new InMemoryContentRepository();
let convexRepository: ContentRepository | undefined;

/**
 * Resolve the active content repository.
 *
 * With a Convex deployment configured, every collection the site renders comes
 * from the database - see `siteBackedCollections` in ./convex-repository.ts,
 * which now lists all of them. The seed is reached only when Convex itself is
 * unreachable, so an outage serves the last known content rather than a blank
 * site; an empty collection is rendered empty, because that is an editorial
 * act rather than a fault.
 *
 * Without a deployment configured the whole site reads the seed, so a checkout
 * with no environment still renders.
 */
export function getContent(): ContentRepository {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return memoryRepository;
  if (!convexRepository) convexRepository = new ConvexContentRepository();
  return convexRepository;
}
