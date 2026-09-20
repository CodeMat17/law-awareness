import { unstable_cache } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { decodeList } from "@/lib/cms/collections";
import { paragraphs, parseRows, type RowValue } from "@/lib/cms/rows";
import type {
  Article,
  Audience,
  BusinessGuideDetail,
  CaseRecord,
  CaseStanding,
  CeoBriefing,
  Checklist,
  ComplianceTopic,
  ContentKind,
  ContractType,
  CourtLevel,
  EditorialMeta,
  ExperienceBand,
  GlossaryTerm,
  IndustryHub,
  LawCategory,
  LawHistory,
  ChecklistItem,
  LawyerListing,
  LegalProblem,
  ListingAvailability,
  ListingStatus,
  MediaFormat,
  MediaKind,
  MediaSeason,
  MediaSeries,
  ProblemUrgency,
  PublicQuestion,
  Quiz,
  ReferralKind,
  ReferralRoute,
  RegulatoryUpdate,
  ReviewStatus,
  RightGuide,
  TickerItem,
  TickerTone,
  AgendaSlot,
  AlertTopic,
  CalendarCadence,
  CalendarEntry,
  ConstitutionSection,
  CourtProfile,
  HealthCheckQuestion,
  LawEntry,
  LiveEvent,
  LiveStatus,
  MediaChapter,
  MediaContributor,
  MediaDetail,
  MediaTranscript,
  ProfileQuestion,
  QuizQuestion,
  RelatedRefs,
  SafetyGuide,
  TranscriptStatus,
} from "./types";
import type { ConstitutionChapter } from "./constitution";

/**
 * Convex readers for the public site.
 *
 * This module holds only the fetch-and-map functions, not the repository class
 * that uses them. The class lives in ./repository.ts and extends the seed-backed
 * one, and if that subclass lived here the two modules would import each other
 * at runtime - a cycle that fails at module-evaluation time, not at type-check
 * time, so it surfaces as a build error rather than a compiler error.
 *
 * A reader returns `null` for one case and one only: Convex was unreachable.
 * An empty collection comes back as an empty array, which is a different thing
 * and is treated as one - it means an editor emptied it, and the site renders
 * nothing rather than quietly restoring content that was deliberately removed.
 * Only the unreachable case falls back to the seed, so a backend that is
 * briefly down still serves the last known content instead of a blank page.
 *
 * This used to be a three-way distinction in which "empty" and "unreachable"
 * both meant "use the seed". That made the seed a permanent shadow copy of the
 * site: deleting the last record in a collection brought the seeded version of
 * it back, and no editor could tell why.
 *
 * A reader now returns the whole of the record its collection models. Where a
 * reader once handed back a partial record for the repository to merge over a
 * seed entry, the missing fields have been added to the collection instead -
 * so an empty list here means an editor has not filled one in, never that the
 * CMS cannot express it.
 */

const TICKER_TONES: TickerTone[] = [
  "update",
  "alert",
  "live",
  "business",
  "notice",
];

function asTickerTone(value: string | undefined): TickerTone {
  return TICKER_TONES.includes(value as TickerTone)
    ? (value as TickerTone)
    : "update";
}

/**
 * Cache tags, one per collection.
 *
 * Convex's client fetches without a cache, which makes any route that reads it
 * dynamic. For a page that is fine; for the ticker it is not, because the
 * ticker renders in the site layout and would therefore make every route on
 * the site render per request. These reads are cached and invalidated by tag
 * instead - see `revalidateFor` in lib/cms/actions.ts, which fires the tag
 * whenever a record in the matching collection changes.
 */
export const contentTag = (collection: string) => `content:${collection}`;

/**
 * How long a cached collection read may go unchecked.
 *
 * The tag above is the fast path: a CMS write fires it and the pages that read
 * the collection re-render on the next request. This is the floor underneath
 * it, and it is deliberately short. A hub page is prerendered and inherits its
 * own freshness from this number, so anything that reaches Convex without
 * going through `revalidateFor` - a seed script, an edit made in the Convex
 * dashboard, a write served by another instance - leaves the hub serving a
 * list the new record is missing from until this elapses. At an hour that
 * reads as "published items never appear"; at a minute it heals itself before
 * anyone notices.
 */
const CONTENT_REVALIDATE = 60;

/**
 * The collections the public site actually reads from the CMS.
 *
 * This is the list the header comment above describes, written down rather
 * than left implicit in which methods `ConvexContentRepository` overrides.
 * The admin reads it to tell an editor the truth about a record: a collection
 * missing from here can be edited, but the site still renders it from the
 * seed, so publishing changes nothing a reader can see.
 *
 * Every collection in the registry is now on it. The set is kept rather than
 * removed because it is the check on the next one added: a collection belongs
 * here in the same change that adds its reader and its override - never
 * before, or the admin starts promising a page that does not exist.
 */
export const siteBackedCollections: ReadonlySet<string> = new Set([
  // Pages are read by ./page-repository.ts rather than from here, but they are
  // database-driven all the same, and this set is what the admin tells editors.
  "pages",
  "ticker",
  "articles",
  "rights",
  "laws",
  "business-guides",
  "cases",
  "law-histories",
  "media",
  "media-series",
  "glossary",
  "quizzes",
  "checklists",
  "compliance-topics",
  "contracts",
  "industries",
  "ceo-briefings",
  "regulatory-updates",
  "legal-problems",
  "referral-routes",
  "lawyer-listings",
  "questions",
  "law-entries",
  "safety-guides",
  "constitution-chapters",
  "constitution-sections",
  "courts",
  "alert-topics",
  "calendar-entries",
  "health-check",
  "profile-questions",
]);

/**
 * The breaking-updates stripe above the navigation.
 *
 * Convex returns published rows only, so there is no status filtering here -
 * unlike the seed path, an unpublished headline is never fetched at all.
 *
 * `unstable_cache` rather than the `use cache` directive that replaces it in
 * Next 16: `use cache` requires the `cacheComponents` flag, which changes how
 * every dynamic route in the application is compiled and is not a decision to
 * make on the way past. This is isolated to one function, so switching later
 * is a local change.
 */
export const fetchTickerItems = unstable_cache(
  async (): Promise<TickerItem[] | null> => {
    try {
      const rows = await fetchQuery(api.content.publishedByCollection, {
        collection: "ticker",
      });

      return rows.map((row) => ({
        id: row.recordId,
        label: row.fields.label ?? "",
        tone: asTickerTone(row.fields.tone),
        headline: row.fields.headline ?? row.title,
        href: row.fields.href ?? "/",
        publishedAt: row.fields.publishedAt ?? "",
        status: "published" as const,
      }));
    } catch {
      return null;
    }
  },
  ["content", "ticker"],
  { tags: [contentTag("ticker")], revalidate: CONTENT_REVALIDATE }
);

/* -------------------------------------------------------------------------- */
/* Case law                                                                    */
/* -------------------------------------------------------------------------- */

const COURT_LEVELS: CourtLevel[] = [
  "supreme-court",
  "court-of-appeal",
  "federal-high-court",
  "state-high-court",
  "national-industrial-court",
  "tribunal",
];

const CASE_STANDINGS: CaseStanding[] = [
  "followed",
  "distinguished",
  "overtaken-by-statute",
  "position-not-stated",
];

const REVIEW_STATUSES: ReviewStatus[] = [
  "educational",
  "reviewed",
  "updated",
  "archived",
];

/**
 * Editorial metadata, rebuilt from the flat fields the CMS stores.
 *
 * `review` falls back to "educational" rather than "reviewed": an unset or
 * unrecognised value must never be read as a claim that a lawyer checked this.
 */
function toMeta(fields: Record<string, string>): EditorialMeta {
  const review = fields.review as ReviewStatus | undefined;
  const label = fields.sourceLabel?.trim();
  return {
    // Only published rows are fetched, so the status is known by construction.
    status: "published",
    review:
      review && REVIEW_STATUSES.includes(review) ? review : "educational",
    lastReviewed: fields.lastReviewed ?? "",
    reviewedBy: fields.reviewedBy?.trim() || undefined,
    source: label
      ? { label, citation: fields.sourceCitation?.trim() || undefined }
      : undefined,
  };
}

interface CaseRow {
  recordId: string;
  title: string;
  fields: Record<string, string>;
}

function toCaseRecord(row: CaseRow): CaseRecord {
  const f = row.fields;
  const court = f.court as CourtLevel;
  const standing = f.standing as CaseStanding;
  return {
    id: row.recordId,
    slug: f.slug ?? "",
    title: f.title || row.title,
    court: COURT_LEVELS.includes(court) ? court : "tribunal",
    year: Number.parseInt(f.year ?? "", 10) || 0,
    subject: f.subject ?? "",
    legalIssue: f.legalIssue ?? "",
    issueTag: f.issueTag ?? "",
    background: decodeList(f.background),
    decision: decodeList(f.decision),
    keyPrinciple: f.keyPrinciple ?? "",
    plainLanguage: decodeList(f.plainLanguage),
    doesNotSettle: decodeList(f.doesNotSettle),
    standing: CASE_STANDINGS.includes(standing)
      ? standing
      : "position-not-stated",
    whereToFindIt: f.whereToFindIt ?? "",
    instruments: decodeList(f.instruments),
    meta: toMeta(f),
  };
}

/**
 * Every published case.
 *
 * Ordering is left to the caller: the explorer ranks by court seniority and
 * then by year, which depends on the court hierarchy in ./case-law.ts and so
 * belongs with the repository rather than here.
 */
export const fetchCases = unstable_cache(
  async (): Promise<CaseRecord[] | null> => {
    try {
      const rows = await fetchQuery(api.content.publishedByCollection, {
        collection: "cases",
      });
      return rows.map(toCaseRecord);
    } catch {
      return null;
    }
  },
  ["content", "cases"],
  { tags: [contentTag("cases")], revalidate: CONTENT_REVALIDATE }
);

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

const MEDIA_KINDS: MediaKind[] = ["video", "podcast", "live"];
const MEDIA_FORMATS: MediaFormat[] = [
  "explainer",
  "interview",
  "documentary",
  "webinar",
  "short",
  "broadcast",
  "episode",
  "audio-explainer",
  "live-session",
];

/**
 * The part of a media item the CMS actually models.
 *
 * Deliberately not a `MediaDetail`. The CMS holds thirteen fields; the full
 * type also carries topics, takeaways, chapters, contributors and a
 * transcript, and inventing empty ones here would let a caller mistake "the
 * CMS does not model this" for "the editor left it blank". The repository
 * merges this over a seed record where one exists, and fills the rest in
 * honestly where one does not.
 */
export interface MediaCmsRecord extends MediaDetail {
  /**
   * Present only on a live session, and the test for one: a video and an
   * episode store these empty, so `live` being set is what tells the
   * repository this row belongs in the schedule rather than in a hub.
   */
  live?: Pick<
    LiveEvent,
    "liveStatus" | "agenda" | "questionPolicy" | "registration" | "archivePolicy"
  >;
}

interface ContentRow {
  recordId: string;
  title: string;
  fields: Record<string, string>;
}

/**
 * Guesses a MIME type from a Cloudinary delivery URL.
 *
 * The CMS stores only the URL, and the player needs a type. Cloudinary keeps
 * the original extension, so the extension is the honest source - and audio
 * and video are told apart by it rather than by the item's `kind`, since a
 * podcast published as an MP4 is a real thing.
 */
function mimeTypeFor(url: string): string {
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const types: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    wav: "audio/wav",
    ogg: "audio/ogg",
  };
  return types[extension] ?? "video/mp4";
}

/**
 * Reads a media row back into the whole of `MediaDetail`.
 *
 * The collection used to store a card's worth of a video - title, format,
 * file - and the repository merged the result over the seed record to recover
 * topics, takeaways, contributors, chapters and the transcript. It now stores
 * all of them, which is what lets the seed go: an item the CMS knows about is
 * the whole item, and an empty list here means an editor has not filled it in
 * rather than that the CMS cannot express it.
 */
function toMediaRecord(row: ContentRow): MediaCmsRecord {
  const f = row.fields;
  const kind = f.kind as MediaKind;
  const format = f.format as MediaFormat;
  const fileUrl = f.fileUrl?.trim();
  const liveStatus = f.liveStatus?.trim();

  return {
    id: row.recordId,
    slug: f.slug ?? "",
    kind: MEDIA_KINDS.includes(kind) ? kind : "video",
    title: f.title || row.title,
    description: f.description ?? "",
    format: MEDIA_FORMATS.includes(format) ? format : "explainer",
    series: f.series?.trim() || undefined,
    seriesSlug: f.seriesSlug?.trim() || undefined,
    host: f.host?.trim() || undefined,
    duration: f.duration?.trim() || undefined,
    publishedAt: f.publishedAt ?? "",
    scheduledFor: f.scheduledFor?.trim() || undefined,
    // Zero is not a season and not an episode, so an unset number stays unset
    // rather than becoming a season 0 the series page would group items under.
    season: asNumber(f.season) || undefined,
    episode: asNumber(f.episode) || undefined,
    // "On air" is a property of the schedule, not a second field an editor can
    // contradict: it is the live status and nothing else.
    isLiveNow: liveStatus === "live" ? true : undefined,
    topics: decodeList(f.topics),
    takeaways: decodeList(f.takeaways),
    contributors: toContributors(row.recordId, f.contributors),
    chapters: toChapters(row.recordId, f.chapters),
    transcript: toTranscript(row.recordId, f),
    trending: asFlag(f.trending),
    featured: asFlag(f.featured),
    related: toRelated(f.related),
    // No file means the item has not been released. That is a real editorial
    // state, and the media page renders it as one, so it must stay undefined
    // rather than becoming a source pointing at nothing.
    source: fileUrl
      ? {
          url: fileUrl,
          mimeType: mimeTypeFor(fileUrl),
          captionsUrl: f.captionsUrl?.trim() || undefined,
          posterUrl: f.posterUrl?.trim() || undefined,
        }
      : undefined,
    live: LIVE_STATUSES.includes(liveStatus as LiveStatus)
      ? {
          liveStatus: liveStatus as LiveStatus,
          agenda: toAgenda(row.recordId, f.agenda),
          questionPolicy: f.questionPolicy ?? "",
          registration: f.registration ?? "",
          archivePolicy: f.archivePolicy ?? "",
        }
      : undefined,
    meta: toMeta(f),
  };
}

/*
 * Rows carry no identity of their own - they are an ordered list in one
 * string - so ids are minted from the record and the position. React keys and
 * anchor targets need them to be stable, and position is the only thing about
 * a row that is.
 */
function toContributors(
  recordId: string,
  value: string | undefined
): MediaContributor[] {
  return rowsOf(value).map((entry, index) => ({
    id: `${recordId}-contributor-${index + 1}`,
    name: entry.name ?? "",
    role: entry.role ?? "",
    bio: entry.bio ?? "",
  }));
}

function toChapters(recordId: string, value: string | undefined): MediaChapter[] {
  return rowsOf(value).map((entry, index) => ({
    id: `${recordId}-chapter-${index + 1}`,
    startSeconds: asNumber(entry.startSeconds),
    title: entry.title ?? "",
    summary: entry.summary ?? "",
  }));
}

function toAgenda(recordId: string, value: string | undefined): AgendaSlot[] {
  return rowsOf(value).map((entry, index) => ({
    id: `${recordId}-slot-${index + 1}`,
    label: entry.label ?? "",
    title: entry.title ?? "",
    detail: entry.detail ?? "",
  }));
}

/**
 * A transcript is its status and its cues, and the two can disagree.
 *
 * A status of "published" with no cues would tell a reader a transcript exists
 * and then show them nothing, so it is corrected down to "in-progress" here.
 * The other direction is left alone: cues stored against an "in-progress"
 * transcript are work an editor has not finished declaring done.
 */
function toTranscript(
  recordId: string,
  fields: Record<string, string>
): MediaTranscript {
  const cues = rowsOf(fields.transcriptCues).map((entry, index) => ({
    id: `${recordId}-cue-${index + 1}`,
    startSeconds: asNumber(entry.startSeconds),
    speaker: entry.speaker ?? "",
    text: entry.text ?? "",
  }));
  const status = asEnum(
    TRANSCRIPT_STATUSES,
    fields.transcriptStatus,
    "unavailable"
  );
  return {
    status: status === "published" && cues.length === 0 ? "in-progress" : status,
    cues,
  };
}

/** Every published video, episode and live item held in the CMS. */
export const fetchMedia = unstable_cache(
  async (): Promise<MediaCmsRecord[] | null> => {
    try {
      const rows = await fetchQuery(api.content.publishedByCollection, {
        collection: "media",
      });
      return rows.map(toMediaRecord);
    } catch {
      return null;
    }
  },
  ["content", "media"],
  { tags: [contentTag("media")], revalidate: CONTENT_REVALIDATE }
);

/** The part of a series the CMS models. */
/**
 * A series as the CMS holds it.
 *
 * `topics` is absent on purpose, and is the one part of `MediaSeries` that is
 * not stored: a series is about whatever its items are about, so storing it
 * separately creates a second answer that goes stale the moment an item is
 * added. The repository derives it from the items instead.
 */
export interface MediaSeriesCmsRecord extends Omit<MediaSeries, "topics"> {
  artwork?: string;
}

function toSeriesRecord(row: ContentRow): MediaSeriesCmsRecord {
  const f = row.fields;
  const kind = f.kind as MediaKind;
  return {
    id: row.recordId,
    slug: f.slug ?? "",
    kind: MEDIA_KINDS.includes(kind) ? kind : "video",
    title: f.title || row.title,
    tagline: f.tagline ?? "",
    description: f.description ?? "",
    icon: f.icon?.trim() || "video",
    cadence: f.cadence ?? "",
    host: f.host?.trim() || undefined,
    artwork: f.artwork?.trim() || undefined,
    // A series with no seasons listed is one that does not run in seasons -
    // which the series page renders differently from a season with no items.
    seasons: toSeasons(row.recordId, f.seasons),
    related: toRelated(f.related),
    meta: toMeta(f),
  };
}

function toSeasons(
  recordId: string,
  value: string | undefined
): MediaSeason[] | undefined {
  const seasons = rowsOf(value).map((entry, index) => ({
    id: `${recordId}-season-${index + 1}`,
    number: asNumber(entry.number),
    title: entry.title ?? "",
    summary: entry.summary ?? "",
  }));
  return seasons.length > 0 ? seasons : undefined;
}

/** Every published series held in the CMS. */
export const fetchMediaSeries = unstable_cache(
  async (): Promise<MediaSeriesCmsRecord[] | null> => {
    try {
      const rows = await fetchQuery(api.content.publishedByCollection, {
        collection: "media-series",
      });
      return rows.map(toSeriesRecord);
    } catch {
      return null;
    }
  },
  ["content", "media-series"],
  { tags: [contentTag("media-series")], revalidate: CONTENT_REVALIDATE }
);

/* -------------------------------------------------------------------------- */
/* Everything else                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Builds a cached reader for one collection.
 *
 * The four readers above predate this and are left written out, because each
 * carries a note about the collection it reads. Everything below follows the
 * same three rules and would only repeat them twenty-odd times: published rows
 * only, `null` for an unreachable backend and an empty array for an empty
 * collection, and a cache tag the CMS fires on write.
 */
function collectionReader<T>(
  collection: string,
  map: (row: ContentRow) => T
): () => Promise<T[] | null> {
  return unstable_cache(
    async (): Promise<T[] | null> => {
      try {
        const rows = await fetchQuery(api.content.publishedByCollection, {
          collection,
        });
          return rows.map(map);
      } catch {
        return null;
      }
    },
    ["content", collection],
    { tags: [contentTag(collection)], revalidate: CONTENT_REVALIDATE }
  );
}

/**
 * Reads a stored value back as one of a closed set.
 *
 * A value that is missing or no longer recognised falls back rather than
 * reaching the site as-is: these keys drive ordering, filtering and labelling,
 * and a stray one would render as a filter nothing matches.
 */
function asEnum<T extends string>(
  values: readonly T[],
  value: string | undefined,
  fallback: T
): T {
  return values.includes(value as T) ? (value as T) : fallback;
}

/** A stored number field. Absent or unparseable reads as zero, never NaN. */
function asNumber(value: string | undefined): number {
  return Number.parseInt(value ?? "", 10) || 0;
}

/**
 * The keys `RelatedRefs` may carry.
 *
 * Read-path validation, not decoration: the stored value is JSON written by the
 * seed, and a key that is not one of these would travel all the way to a
 * "Related" strip that renders nothing and explains nothing. Unknown keys and
 * non-string entries are dropped here instead.
 */
const RELATED_KEYS = [
  "laws",
  "rights",
  "safety",
  "guides",
  "articles",
  "media",
  "terms",
  "compliance",
  "contracts",
  "industries",
  "briefings",
  "updates",
  "problems",
  "questions",
  "referrals",
  "cases",
  "sections",
] as const;

/**
 * Reads a stored `related` field back.
 *
 * Returns `undefined` rather than an empty object for a record with no
 * references, because `RelatedRefs` being absent is what every caller already
 * tests for - `getRelated` returns nothing for it without doing any work.
 */
function toRelated(value: string | undefined): RelatedRefs | undefined {
  if (!value?.trim()) return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return undefined;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }
  const source = parsed as Record<string, unknown>;
  const refs: RelatedRefs = {};
  for (const key of RELATED_KEYS) {
    const entry = source[key];
    if (!Array.isArray(entry)) continue;
    const slugs = entry.filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0
    );
    if (slugs.length > 0) refs[key] = slugs;
  }
  return Object.keys(refs).length > 0 ? refs : undefined;
}

/** A stored checkbox-style field. Only "yes" is true; anything else is not. */
function asFlag(value: string | undefined): boolean | undefined {
  return value?.trim() === "yes" ? true : undefined;
}

const LIVE_STATUSES: LiveStatus[] = ["live", "scheduled", "ended"];
const TRANSCRIPT_STATUSES: TranscriptStatus[] = [
  "published",
  "in-progress",
  "unavailable",
];
const CALENDAR_CADENCES: CalendarCadence[] = [
  "annual",
  "quarterly",
  "monthly",
  "ongoing",
  "event-driven",
];

const CONTENT_KINDS: ContentKind[] = [
  "news",
  "analysis",
  "explainer",
  "opinion",
  "educational",
];

const AUDIENCES: Audience[] = [
  "citizens",
  "business",
  "professionals",
  "learners",
  "viewers",
];

const QUIZ_LEVELS: Quiz["level"][] = ["starter", "core", "advanced"];

const PROBLEM_URGENCIES: ProblemUrgency[] = [
  "immediate",
  "time-sensitive",
  "considered",
];

const REFERRAL_KINDS: ReferralKind[] = [
  "legal-aid",
  "professional-body",
  "public-institution",
  "civil-society",
  "law-clinic",
];

const LISTING_STATUSES: ListingStatus[] = [
  "sample",
  "pending-verification",
  "verified",
];

const LISTING_AVAILABILITY: ListingAvailability[] = [
  "accepting",
  "waitlist",
  "not-accepting",
];

const EXPERIENCE_BANDS: ExperienceBand[] = ["1-5", "6-10", "11-20", "20+"];

function asAudiences(value: string | undefined): Audience[] {
  return decodeList(value).filter((entry): entry is Audience =>
    (AUDIENCES as string[]).includes(entry)
  );
}

/**
 * Reads a rows field back, dropping rows that are entirely empty.
 *
 * The write path already normalises, so this guards the other way in: rows
 * written before a column existed, or by an older shape of the registry, must
 * not reach the site as blank entries.
 */
function rowsOf(value: string | undefined): RowValue[] {
  return parseRows(value).filter((row) =>
    Object.values(row).some((entry) => entry.trim().length > 0)
  );
}

/**
 * The part of an article the CMS models - which is now the whole of it, less
 * the related-content graph.
 */
export type ArticleCmsRecord = Omit<Article, "related">;

export const fetchArticles = collectionReader<ArticleCmsRecord>(
  "articles",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    kind: asEnum(CONTENT_KINDS, row.fields.kind, "educational"),
    title: row.fields.title || row.title,
    standfirst: row.fields.standfirst ?? "",
    category: row.fields.category ?? "",
    readingMinutes: asNumber(row.fields.readingMinutes),
    publishedAt: row.fields.publishedAt ?? "",
    image: row.fields.image?.trim() || undefined,
    audiences: asAudiences(row.fields.audiences),
    // An article with no sections keeps `body` undefined rather than an empty
    // array: the page reads that as "not written out yet" and renders the
    // standfirst, which is a real editorial state.
    body: toArticleBody(row.fields.body),
    meta: toMeta(row.fields),
  })
);

function toArticleBody(value: string | undefined) {
  const sections = rowsOf(value).map((section) => ({
    heading: section.heading ?? "",
    paragraphs: paragraphs(section.paragraphs),
  }));
  return sections.length > 0 ? sections : undefined;
}

/** A law category without `entryCount`, which is counted, never stored. */
export type LawCategoryCmsRecord = Omit<LawCategory, "entryCount">;

export const fetchLawCategories = collectionReader<LawCategoryCmsRecord>(
  "laws",
  (row) => ({
    slug: row.fields.slug ?? "",
    name: row.fields.name || row.title,
    blurb: row.fields.blurb ?? "",
    icon: row.fields.icon?.trim() || "landmark",
  })
);

export type RightCmsRecord = Omit<RightGuide, "related">;

export const fetchRights = collectionReader<RightCmsRecord>("rights", (row) => ({
  id: row.recordId,
  slug: row.fields.slug ?? "",
  title: row.fields.title || row.title,
  situation: row.fields.situation ?? "",
  summary: row.fields.summary ?? "",
  category: row.fields.category ?? "",
  protects: decodeList(row.fields.protects),
  doNow: decodeList(row.fields.doNow),
  avoid: decodeList(row.fields.avoid),
  whenToSeeALawyer: decodeList(row.fields.whenToSeeALawyer),
  steps: rowsOf(row.fields.steps).map((step) => ({
    title: step.title ?? "",
    body: step.body ?? "",
  })),
  misconceptions: rowsOf(row.fields.misconceptions).map((entry) => ({
    myth: entry.myth ?? "",
    reality: entry.reality ?? "",
  })),
  meta: toMeta(row.fields),
}));

export type BusinessGuideCmsRecord = Omit<BusinessGuideDetail, "related">;

export const fetchBusinessGuides = collectionReader<BusinessGuideCmsRecord>(
  "business-guides",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    title: row.fields.title || row.title,
    situation: row.fields.situation ?? "",
    summary: row.fields.summary ?? "",
    area: row.fields.area ?? "",
    checklistCount: asNumber(row.fields.checklistCount),
    context: decodeList(row.fields.context),
    commonMistakes: decodeList(row.fields.commonMistakes),
    redFlags: decodeList(row.fields.redFlags),
    whenToInvolveALawyer: decodeList(row.fields.whenToInvolveALawyer),
    keyConsiderations: rowsOf(row.fields.keyConsiderations).map((entry) => ({
      heading: entry.heading ?? "",
      body: entry.body ?? "",
      instrument: entry.instrument?.trim() || undefined,
    })),
    // Step ids are positional and generated here, never stored: an id an
    // editor could edit is an id that stops naming its step.
    checklist: rowsOf(row.fields.checklist).map((step, index) => ({
      id: `${row.fields.slug ?? row.recordId}-step-${index + 1}`,
      label: step.label ?? "",
      detail: step.detail ?? "",
    })),
    meta: toMeta(row.fields),
  })
);

export type GlossaryCmsRecord = Omit<GlossaryTerm, "related">;

export const fetchGlossaryTerms = collectionReader<GlossaryCmsRecord>(
  "glossary",
  (row) => {
    const alsoKnownAs = decodeList(row.fields.alsoKnownAs);
    return {
      id: row.recordId,
      slug: row.fields.slug ?? "",
      term: row.fields.term || row.title,
      definition: row.fields.definition ?? "",
      example: row.fields.example ?? "",
      whyItMatters: row.fields.whyItMatters ?? "",
      alsoKnownAs: alsoKnownAs.length > 0 ? alsoKnownAs : undefined,
      meta: toMeta(row.fields),
    };
  }
);

/**
 * A quiz and the questions that make it up.
 *
 * `questionCount` is counted here rather than read from the stored field: the
 * two used to be able to disagree, and a quiz advertising ten questions and
 * asking eight is a bug a reader meets rather than one an editor sees.
 */
export interface QuizCmsRecord extends Quiz {
  questions: QuizQuestion[];
}

/**
 * Reads one question back.
 *
 * The answer is stored 1-based, as an editor counts the options on the form,
 * and is subtracted back to an index here. An answer that points past the end
 * of the options - or at nothing at all - falls back to the first option
 * rather than reaching the quiz as an index that marks every attempt wrong.
 */
function toQuizQuestions(
  recordId: string,
  value: string | undefined
): QuizQuestion[] {
  return rowsOf(value).map((entry, index) => {
    const options = decodeList(entry.options);
    const answer = asNumber(entry.answer) - 1;
    return {
      id: `${recordId}-question-${index + 1}`,
      prompt: entry.prompt ?? "",
      options,
      answer: answer >= 0 && answer < options.length ? answer : 0,
      explanation: entry.explanation ?? "",
    };
  });
}

export const fetchQuizzes = collectionReader<QuizCmsRecord>("quizzes", (row) => {
  const questions = toQuizQuestions(row.recordId, row.fields.questions);
  return {
    id: row.recordId,
    slug: row.fields.slug ?? "",
    title: row.fields.title || row.title,
    description: row.fields.description ?? "",
    // Counted, never read: the stored field is locked in the admin for the
    // same reason.
    questionCount: questions.length,
    minutes: asNumber(row.fields.minutes),
    level: asEnum(QUIZ_LEVELS, row.fields.level, "starter"),
    questions,
    meta: toMeta(row.fields),
  };
});

/**
 * A checklist and the lines on it.
 *
 * The lines are part of the record rather than a table beside it, because that
 * is what an editor opens to work on: a checklist with its lines somewhere
 * else is a checklist nobody can finish writing.
 */
export interface ChecklistCmsRecord extends Checklist {
  items: ChecklistItem[];
}

export const fetchChecklists = collectionReader<ChecklistCmsRecord>(
  "checklists",
  (row) => {
    const slug = row.fields.slug ?? "";
    const items = rowsOf(row.fields.items).map((line, index) => ({
      id: `${slug || row.recordId}-${index + 1}`,
      group: line.group ?? "",
      label: line.label ?? "",
      detail: line.detail ?? "",
    }));

    return {
      id: row.recordId,
      slug,
      title: row.fields.title || row.title,
      description: row.fields.description ?? "",
      // Counted from the lines rather than read from the field, so a checklist
      // can never advertise more steps than it has.
      itemCount: items.length || asNumber(row.fields.itemCount),
      audience: asEnum(AUDIENCES, row.fields.audience, "citizens"),
      items,
      meta: toMeta(row.fields),
    };
  }
);

export type ComplianceTopicCmsRecord = Omit<ComplianceTopic, "related">;

export const fetchComplianceTopics = collectionReader<ComplianceTopicCmsRecord>(
  "compliance-topics",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    title: row.fields.title || row.title,
    areaId: row.fields.areaId ?? "",
    summary: row.fields.summary ?? "",
    icon: row.fields.icon?.trim() || "list-checks",
    whatItCovers: decodeList(row.fields.whatItCovers),
    appliesWhen: decodeList(row.fields.appliesWhen),
    goodPractice: decodeList(row.fields.goodPractice),
    commonGaps: decodeList(row.fields.commonGaps),
    whenToInvolveALawyer: decodeList(row.fields.whenToInvolveALawyer),
    meta: toMeta(row.fields),
  })
);

export type ContractCmsRecord = Omit<ContractType, "related">;

export const fetchContractTypes = collectionReader<ContractCmsRecord>(
  "contracts",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    name: row.fields.name || row.title,
    family: row.fields.family ?? "",
    whatItIs: row.fields.whatItIs ?? "",
    whyItMatters: row.fields.whyItMatters ?? "",
    commonlyUsedWhen: decodeList(row.fields.commonlyUsedWhen),
    commonMistakes: decodeList(row.fields.commonMistakes),
    warningSigns: decodeList(row.fields.warningSigns),
    whenLegalReviewIsAppropriate: decodeList(
      row.fields.whenLegalReviewIsAppropriate
    ),
    importantClauses: rowsOf(row.fields.importantClauses).map((clause) => ({
      name: clause.name ?? "",
      purpose: clause.purpose ?? "",
      whatToCheck: clause.whatToCheck ?? "",
    })),
    meta: toMeta(row.fields),
  })
);

export type IndustryCmsRecord = Omit<IndustryHub, "related">;

export const fetchIndustryHubs = collectionReader<IndustryCmsRecord>(
  "industries",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    name: row.fields.name || row.title,
    blurb: row.fields.blurb ?? "",
    icon: row.fields.icon?.trim() || "hard-hat",
    overview: decodeList(row.fields.overview),
    regulatoryThemes: decodeList(row.fields.regulatoryThemes),
    complianceTopics: decodeList(row.fields.complianceTopics),
    meta: toMeta(row.fields),
  })
);

export type CeoBriefingCmsRecord = Omit<CeoBriefing, "related">;

export const fetchCeoBriefings = collectionReader<CeoBriefingCmsRecord>(
  "ceo-briefings",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    title: row.fields.title || row.title,
    question: row.fields.question ?? "",
    summary: row.fields.summary ?? "",
    readingMinutes: asNumber(row.fields.readingMinutes),
    keyPoints: decodeList(row.fields.keyPoints),
    questionsForTheBoard: decodeList(row.fields.questionsForTheBoard),
    whereRiskLands: decodeList(row.fields.whereRiskLands),
    meta: toMeta(row.fields),
  })
);

export type RegulatoryUpdateCmsRecord = Omit<RegulatoryUpdate, "related">;

export const fetchRegulatoryUpdates =
  collectionReader<RegulatoryUpdateCmsRecord>("regulatory-updates", (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    title: row.fields.title || row.title,
    topic: row.fields.topic ?? "",
    report: decodeList(row.fields.report),
    explanation: decodeList(row.fields.explanation),
    whoIsAffected: decodeList(row.fields.whoIsAffected),
    effectiveFrom: row.fields.effectiveFrom ?? "",
    businessConsiderations: decodeList(row.fields.businessConsiderations),
    individualConsiderations: decodeList(row.fields.individualConsiderations),
    guidanceNote: row.fields.guidanceNote?.trim() || undefined,
    publishedAt: row.fields.publishedAt ?? "",
    meta: toMeta(row.fields),
  }));

/**
 * A pathway without its triage questions.
 *
 * A `TriageQuestion` carries its own list of answers, each with a label and
 * what it leads to - rows are one level deep, so this one shape still has no
 * form and still comes from the seed.
 */
export type LegalProblemCmsRecord = Omit<LegalProblem, "triage" | "related">;

export const fetchLegalProblems = collectionReader<LegalProblemCmsRecord>(
  "legal-problems",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    category: row.fields.category ?? "",
    title: row.fields.title || row.title,
    situation: row.fields.situation ?? "",
    summary: row.fields.summary ?? "",
    icon: row.fields.icon?.trim() || "list-checks",
    urgency: asEnum(PROBLEM_URGENCIES, row.fields.urgency, "considered"),
    rightsInThisSituation: decodeList(row.fields.rightsInThisSituation),
    doNow: decodeList(row.fields.doNow),
    avoid: decodeList(row.fields.avoid),
    whenToGetHelp: decodeList(row.fields.whenToGetHelp),
    referralRoutes: decodeList(row.fields.referralRoutes),
    steps: rowsOf(row.fields.steps).map((step) => ({
      title: step.title ?? "",
      body: step.body ?? "",
    })),
    meta: toMeta(row.fields),
  })
);

/** Referral routes are modelled in full, so this is the whole domain object. */
export const fetchReferralRoutes = collectionReader<ReferralRoute>(
  "referral-routes",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    name: row.fields.name || row.title,
    kind: asEnum(REFERRAL_KINDS, row.fields.kind, "public-institution"),
    icon: row.fields.icon?.trim() || "scale",
    whatItIs: row.fields.whatItIs ?? "",
    whoItIsFor: decodeList(row.fields.whoItIsFor),
    howItTypicallyWorks: decodeList(row.fields.howItTypicallyWorks),
    whatToBring: decodeList(row.fields.whatToBring),
    limits: decodeList(row.fields.limits),
    howToFind: row.fields.howToFind ?? "",
    meta: toMeta(row.fields),
  })
);

/**
 * Directory listings, modelled in full.
 *
 * `listingStatus` falls back to "sample" rather than to anything stronger: an
 * unset or unrecognised value must never be read as a claim that a
 * practitioner has been verified.
 */
export const fetchLawyerListings = collectionReader<LawyerListing>(
  "lawyer-listings",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    displayName: row.fields.displayName || row.title,
    listingStatus: asEnum(LISTING_STATUSES, row.fields.listingStatus, "sample"),
    focus: row.fields.focus ?? "",
    practiceAreas: decodeList(row.fields.practiceAreas),
    state: row.fields.state ?? "",
    city: row.fields.city ?? "",
    languages: decodeList(row.fields.languages),
    experienceBand: asEnum(EXPERIENCE_BANDS, row.fields.experienceBand, "1-5"),
    availability: asEnum(
      LISTING_AVAILABILITY,
      row.fields.availability,
      "not-accepting"
    ),
    consultation: row.fields.consultation ?? "",
    about: decodeList(row.fields.about),
    credentials: decodeList(row.fields.credentials),
    meta: toMeta(row.fields),
  })
);

export type PublicQuestionCmsRecord = Omit<PublicQuestion, "related">;

export const fetchPublicQuestions = collectionReader<PublicQuestionCmsRecord>(
  "questions",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    question: row.fields.question || row.title,
    askedBy: row.fields.askedBy ?? "",
    topic: row.fields.topic ?? "",
    askedOn: row.fields.askedOn ?? "",
    generalAnswer: decodeList(row.fields.generalAnswer),
    whatTheLawSays: decodeList(row.fields.whatTheLawSays),
    whatToDoNext: decodeList(row.fields.whatToDoNext),
    lawyerNote: row.fields.lawyerNote?.trim() || undefined,
    meta: toMeta(row.fields),
  })
);

/**
 * A law history without its versions.
 *
 * A `LawVersion` is a structured row - label, kind, effective year, whether it
 * is in force - and the CMS models only the count and the current label. The
 * repository merges this over the seeded history so the amendment timeline
 * keeps its versions; a history the CMS alone knows about has none, and the
 * tracker renders it as an instrument with no timeline on record rather than
 * inventing one.
 */
export type LawHistoryCmsRecord = Omit<LawHistory, "versions">;

export const fetchLawHistories = collectionReader<LawHistoryCmsRecord>(
  "law-histories",
  (row) => ({
    id: row.recordId,
    lawSlug: row.fields.lawSlug ?? "",
    category: row.fields.category ?? "",
    instrument: row.fields.instrument || row.title,
    topic: row.fields.topic?.trim() || undefined,
    whereToFindIt: row.fields.whereToFindIt ?? "",
    meta: toMeta(row.fields),
  })
);


/* -------------------------------------------------------------------------- */
/* Know the Law, the Constitution and the courts                               */
/* -------------------------------------------------------------------------- */

export const fetchLawEntries = collectionReader<LawEntry>(
  "law-entries",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    category: row.fields.category ?? "",
    title: row.fields.title || row.title,
    instrument: row.fields.instrument ?? "",
    summary: row.fields.summary ?? "",
    covers: decodeList(row.fields.covers),
    affects: decodeList(row.fields.affects),
    explanation: decodeList(row.fields.explanation),
    provisions: rowsOf(row.fields.provisions).map((entry, index) => ({
      id: `${row.recordId}-provision-${index + 1}`,
      heading: entry.heading ?? "",
      citation: entry.citation ?? "",
      plainLanguage: entry.plainLanguage ?? "",
    })),
    examples: rowsOf(row.fields.examples).map((entry) => ({
      situation: entry.situation ?? "",
      outcome: entry.outcome ?? "",
    })),
    shouldDo: decodeList(row.fields.shouldDo),
    shouldNotDo: decodeList(row.fields.shouldNotDo),
    misconceptions: rowsOf(row.fields.misconceptions).map((entry) => ({
      myth: entry.myth ?? "",
      reality: entry.reality ?? "",
    })),
    whenToSeeALawyer: decodeList(row.fields.whenToSeeALawyer),
    amendmentNote: row.fields.amendmentNote?.trim() || undefined,
    related: toRelated(row.fields.related),
    meta: toMeta(row.fields),
  })
);

export const fetchSafetyGuides = collectionReader<SafetyGuide>(
  "safety-guides",
  (row) => ({
    id: row.recordId,
    slug: row.fields.slug ?? "",
    title: row.fields.title || row.title,
    series: row.fields.series?.trim() || undefined,
    risk: row.fields.risk ?? "",
    summary: row.fields.summary ?? "",
    area: row.fields.area ?? "",
    icon: row.fields.icon?.trim() || "shield",
    whatToLookFor: decodeList(row.fields.whatToLookFor),
    redFlags: decodeList(row.fields.redFlags),
    questionsToAsk: decodeList(row.fields.questionsToAsk),
    stopAndGetHelp: decodeList(row.fields.stopAndGetHelp),
    related: toRelated(row.fields.related),
    meta: toMeta(row.fields),
  })
);

export const fetchConstitutionChapters = collectionReader<ConstitutionChapter>(
  "constitution-chapters",
  (row) => ({
    numeral: row.fields.numeral ?? "",
    title: row.fields.title || row.title,
    summary: row.fields.summary ?? "",
    covers: decodeList(row.fields.covers),
    href: row.fields.href?.trim() || undefined,
    hrefLabel: row.fields.hrefLabel?.trim() || undefined,
  })
);

export const fetchConstitutionSections = collectionReader<ConstitutionSection>(
  "constitution-sections",
  (row) => ({
    id: row.recordId,
    number: row.fields.number ?? "",
    chapter: row.fields.chapter ?? "",
    heading: row.fields.heading || row.title,
    plainLanguage: row.fields.plainLanguage ?? "",
    // An empty list would render as a heading with nothing under it. A section
    // with no qualifications recorded has none to show, which is a different
    // thing from a section whose qualifications are still being written.
    qualifications:
      decodeList(row.fields.qualifications).length > 0
        ? decodeList(row.fields.qualifications)
        : undefined,
    related: toRelated(row.fields.related),
  })
);

/**
 * The court hierarchy.
 *
 * `courtId` rather than the record id: cases store the court they were decided
 * in by this value, and it is locked in the admin for that reason. A row whose
 * id is not a court the application knows about is dropped rather than
 * rendered, because it could only ever match no case.
 */
export const fetchCourtProfiles = collectionReader<CourtProfile | null>(
  "courts",
  (row) => {
    const id = row.fields.courtId?.trim();
    if (!COURT_LEVELS.includes(id as CourtLevel)) return null;
    return {
      id: id as CourtLevel,
      name: row.fields.name || row.title,
      rank: asNumber(row.fields.rank),
      jurisdiction: row.fields.jurisdiction ?? "",
      bindingEffect: row.fields.bindingEffect ?? "",
    };
  }
);

/* -------------------------------------------------------------------------- */
/* Business tools                                                              */
/* -------------------------------------------------------------------------- */

export const fetchAlertTopics = collectionReader<AlertTopic>(
  "alert-topics",
  (row) => ({
    slug: row.fields.slug ?? "",
    label: row.fields.label || row.title,
    description: row.fields.description ?? "",
    icon: row.fields.icon?.trim() || "bell",
  })
);

export const fetchCalendarEntries = collectionReader<CalendarEntry>(
  "calendar-entries",
  (row) => ({
    id: row.recordId,
    title: row.fields.title || row.title,
    cadence: asEnum(CALENDAR_CADENCES, row.fields.cadence, "ongoing"),
    trigger: row.fields.trigger ?? "",
    timing: row.fields.timing ?? "",
    summary: row.fields.summary ?? "",
    areaId: row.fields.areaId ?? "",
    icon: row.fields.icon?.trim() || "calendar",
    whatToPrepare: decodeList(row.fields.whatToPrepare),
    meta: toMeta(row.fields),
  })
);

export const fetchHealthCheckQuestions = collectionReader<HealthCheckQuestion>(
  "health-check",
  (row) => ({
    id: row.recordId,
    areaId: row.fields.areaId ?? "",
    prompt: row.fields.prompt || row.title,
    help: row.fields.help?.trim() || undefined,
  })
);

export const fetchProfileQuestions = collectionReader<ProfileQuestion>(
  "profile-questions",
  (row) => ({
    id: row.recordId,
    label: row.fields.label || row.title,
    help: row.fields.help?.trim() || undefined,
    kind: row.fields.kind === "boolean" ? "boolean" : "single",
    options: rowsOf(row.fields.options).map((entry) => ({
      value: entry.value ?? "",
      label: entry.label ?? "",
      // Stored comma-separated inside one row column, because a column is a
      // single string. Blank entries are a trailing comma, not an area.
      areas: (entry.areas ?? "")
        .split(",")
        .map((area) => area.trim())
        .filter(Boolean),
    })),
  })
);
