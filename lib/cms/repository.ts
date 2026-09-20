import * as seed from "@/lib/content/data";
import type {
  EditorialMeta,
  ReviewStatus,
  WorkflowStatus,
} from "@/lib/content/types";
import { pageSeeds } from "@/lib/content/pages";
import { checklistItems, quizQuestions } from "@/lib/content/learning";
import { courtProfiles } from "@/lib/content/case-law";
import { constitutionChapters } from "@/lib/content/constitution";
import { constitutionSections } from "@/lib/content/constitution-sections";
import type { LiveEvent, MediaDetail, RelatedRefs } from "@/lib/content/types";
import type { PageBlock } from "./blocks";
import {
  collections,
  encodeList,
  getCollection,
  titleFieldFor,
  type CollectionId,
} from "./collections";
import { publicHrefFor } from "./public-href";
import { serialiseRows } from "./rows";
import { ConvexCmsRepository } from "./convex-repository";

/**
 * CMS data layer.
 *
 * The admin UI works against a flat, generic record so it can render any
 * collection without bespoke screens. `fields` holds the collection-specific
 * values keyed by the field names declared in `collections.ts`.
 *
 * Two adapters implement `CmsRepository`. Convex (./convex-repository.ts) is
 * the real one and is used whenever a deployment is configured. The in-process
 * store below, seeded from `lib/content/data.ts` and `lib/content/pages.ts`,
 * is the fallback for a checkout with no environment - it keeps the admin
 * explorable offline, but its writes are process-local and reset on restart.
 * `isCmsPersistent` reports which is in use so the admin can say so plainly.
 */

export interface CmsRecord {
  id: string;
  collection: CollectionId;
  /** Primary label shown in lists. */
  title: string;
  subtitle?: string;
  status: WorkflowStatus;
  review?: ReviewStatus;
  reviewedBy?: string;
  lastReviewed?: string;
  updatedAt: string;
  /** Public URL, when the record has one. */
  publicHref?: string;
  fields: Record<string, string>;
  /** Ordered content blocks, on block-composed collections only. */
  blocks?: PageBlock[];
}

/**
 * A record as it appears in a list - everything the admin list rows and the
 * review queue render, and nothing else.
 *
 * The body of a record is deliberately absent. Lists show titles and statuses,
 * so carrying `fields` and `blocks` through them meant transferring the full
 * text of a collection to draw a page of links. The whole record is read by
 * `get` when one is actually opened.
 */
export type CmsRecordSummary = Omit<CmsRecord, "fields" | "blocks">;

export interface CmsListFilters {
  status?: WorkflowStatus | "all";
  query?: string;
}

export interface CollectionCounts {
  collection: CollectionId;
  total: number;
  draft: number;
  review: number;
  published: number;
  archived: number;
}

export interface ActivityEntry {
  id: string;
  collection: CollectionId;
  recordId: string;
  title: string;
  action: string;
  actor: string;
  at: string;
}

export interface CmsRepository {
  listCollectionsSummary(): Promise<CollectionCounts[]>;
  list(
    collection: CollectionId,
    filters?: CmsListFilters
  ): Promise<CmsRecordSummary[]>;
  get(collection: CollectionId, id: string): Promise<CmsRecord | null>;
  /**
   * Adds a record. It always starts as a draft, whoever creates it: appearing
   * on the public site stays a separate, deliberate act through `setStatus`.
   */
  create(
    collection: CollectionId,
    id: string,
    fields: Record<string, string>,
    actor: string
  ): Promise<CmsRecord>;
  updateFields(
    collection: CollectionId,
    id: string,
    fields: Record<string, string>,
    actor: string
  ): Promise<CmsRecord>;
  setStatus(
    collection: CollectionId,
    id: string,
    status: WorkflowStatus,
    actor: string
  ): Promise<CmsRecord>;
  /**
   * Replaces the ordered blocks of a record. Only meaningful for collections
   * with `hasBlocks`; other collections never call it.
   */
  updateBlocks(
    collection: CollectionId,
    id: string,
    blocks: PageBlock[],
    actor: string
  ): Promise<CmsRecord>;
  remove(collection: CollectionId, id: string, actor: string): Promise<void>;
  recentActivity(limit?: number): Promise<ActivityEntry[]>;
  reviewQueue(limit?: number): Promise<CmsRecordSummary[]>;
}

/* -------------------------------------------------------------------------- */
/* Seeding                                                                     */
/* -------------------------------------------------------------------------- */

const nowIso = () => new Date().toISOString();

function fromMeta(meta: EditorialMeta): Pick<
  CmsRecord,
  "status" | "review" | "reviewedBy" | "lastReviewed"
> {
  return {
    status: meta.status,
    review: meta.review,
    reviewedBy: meta.reviewedBy,
    lastReviewed: meta.lastReviewed,
  };
}

/**
 * Stores a record's cross-references as JSON.
 *
 * A record with no references stores an empty string rather than "{}", so an
 * editor opening the locked field sees nothing rather than punctuation, and so
 * the read path can tell "no references" from "references that decoded to
 * nothing" without parsing.
 */
/**
 * Whether a media record is a live session.
 *
 * `liveStatus` is the field only a `LiveEvent` has, and the seed pools videos,
 * episodes and live sessions into one array to build the media collection - so
 * this is what tells them apart on the way in. A plain `in` check narrows to
 * `unknown` against the shared `MediaDetail` type; a guard gives the five live
 * fields their real types.
 */
function isLiveEvent(item: MediaDetail): item is LiveEvent {
  return "liveStatus" in item;
}

function relatedField(related: RelatedRefs | undefined): string {
  if (!related) return "";
  const entries = Object.entries(related).filter(
    ([, value]) => Array.isArray(value) && value.length > 0
  );
  return entries.length > 0 ? JSON.stringify(Object.fromEntries(entries)) : "";
}

function metaFields(meta: EditorialMeta): Record<string, string> {
  return {
    review: meta.review,
    lastReviewed: meta.lastReviewed,
    reviewedBy: meta.reviewedBy ?? "",
    sourceLabel: meta.source?.label ?? "",
    sourceCitation: meta.source?.citation ?? "",
  };
}

export function buildSeed(): Map<CollectionId, CmsRecord[]> {
  const store = new Map<CollectionId, CmsRecord[]>();
  const stamp = nowIso();

  store.set(
    "pages",
    pageSeeds.map((page) => ({
      id: page.id,
      collection: "pages" as const,
      title: page.title,
      subtitle: page.path,
      // Pages ship published: they are the standing surfaces of the site, and
      // seeding must not take About offline until someone presses publish.
      status: "published" as const,
      updatedAt: stamp,
      publicHref: page.path,
      blocks: page.blocks,
      fields: {
        path: page.path,
        title: page.title,
        eyebrow: page.eyebrow,
        lede: page.lede,
        layout: page.layout,
        updated: page.updated ?? "",
        metaTitle: page.metaTitle ?? "",
        metaDescription: page.metaDescription ?? "",
      },
    }))
  );

  store.set(
    "ticker",
    seed.tickerItems.map((item) => ({
      id: item.id,
      collection: "ticker" as const,
      title: item.headline,
      subtitle: item.label,
      status: item.status,
      updatedAt: stamp,
      publicHref: item.href,
      fields: {
        headline: item.headline,
        label: item.label,
        tone: item.tone,
        href: item.href,
        publishedAt: item.publishedAt,
      },
    }))
  );

  store.set(
    "articles",
    seed.latestArticles.map((item) => ({
      id: item.id,
      collection: "articles" as const,
      title: item.title,
      subtitle: item.category,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/law-and-society/${item.slug}`,
      fields: {
        title: item.title,
        standfirst: item.standfirst,
        kind: item.kind,
        category: item.category,
        slug: item.slug,
        readingMinutes: String(item.readingMinutes),
        publishedAt: item.publishedAt,
        // Seeded articles point at a file under /public. New ones get a
        // Cloudinary URL from the upload field; both are just a string here.
        image: item.image ?? "",
        audiences: encodeList(item.audiences),
        // Paragraphs are one multiline column, split on blank lines the way
        // prose is read everywhere else in the CMS.
        body: serialiseRows(
          (item.body ?? []).map((section) => ({
            heading: section.heading,
            paragraphs: section.paragraphs.join("\n\n"),
          }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "rights",
    seed.rightGuides.map((item) => ({
      id: item.id,
      collection: "rights" as const,
      title: item.title,
      subtitle: item.category,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/your-rights/${item.slug}`,
      fields: {
        title: item.title,
        situation: item.situation,
        summary: item.summary,
        category: item.category,
        slug: item.slug,
        protects: encodeList(item.protects),
        doNow: encodeList(item.doNow),
        avoid: encodeList(item.avoid),
        whenToSeeALawyer: encodeList(item.whenToSeeALawyer),
        steps: serialiseRows(
          item.steps.map((step) => ({ title: step.title, body: step.body }))
        ),
        misconceptions: serialiseRows(
          item.misconceptions.map((entry) => ({
            myth: entry.myth,
            reality: entry.reality,
          }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "laws",
    seed.lawCategoryDefs.map((item) => ({
      id: `law-${item.slug}`,
      collection: "laws" as const,
      title: item.name,
      subtitle: item.blurb,
      status: "published" as const,
      updatedAt: stamp,
      publicHref: `/know-the-law/${item.slug}`,
      fields: {
        name: item.name,
        blurb: item.blurb,
        slug: item.slug,
        icon: item.icon,
      },
    }))
  );

  store.set(
    "cases",
    seed.caseRecords.map((item) => ({
      id: item.id,
      collection: "cases" as const,
      title: item.title,
      subtitle: `${item.issueTag} · ${item.year}`,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/cases/${item.slug}`,
      fields: {
        title: item.title,
        slug: item.slug,
        court: item.court,
        year: String(item.year),
        subject: item.subject,
        issueTag: item.issueTag,
        legalIssue: item.legalIssue,
        keyPrinciple: item.keyPrinciple,
        standing: item.standing,
        whereToFindIt: item.whereToFindIt,
        background: encodeList(item.background),
        decision: encodeList(item.decision),
        plainLanguage: encodeList(item.plainLanguage),
        doesNotSettle: encodeList(item.doesNotSettle),
        instruments: encodeList(item.instruments),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "law-histories",
    seed.lawHistories.map((item) => ({
      id: item.id,
      collection: "law-histories" as const,
      title: item.instrument,
      subtitle: `${item.versions.length} versions`,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/know-the-law/amendments#${item.lawSlug}`,
      fields: {
        instrument: item.instrument,
        lawSlug: item.lawSlug,
        category: item.category,
        topic: item.topic ?? "",
        versionCount: String(item.versions.length),
        current:
          item.versions.find((version) => version.current)?.label ??
          "Not stated",
        whereToFindIt: item.whereToFindIt,
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "business-guides",
    seed.businessGuideDetails.map((item) => ({
      id: item.id,
      collection: "business-guides" as const,
      title: item.title,
      subtitle: item.area,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/business/guides/${item.slug}`,
      fields: {
        title: item.title,
        situation: item.situation,
        summary: item.summary,
        area: item.area,
        slug: item.slug,
        checklistCount: String(item.checklistCount),
        context: encodeList(item.context),
        commonMistakes: encodeList(item.commonMistakes),
        redFlags: encodeList(item.redFlags),
        whenToInvolveALawyer: encodeList(item.whenToInvolveALawyer),
        keyConsiderations: serialiseRows(
          item.keyConsiderations.map((entry) => ({
            heading: entry.heading,
            body: entry.body,
            instrument: entry.instrument ?? "",
          }))
        ),
        // The step id is not stored: it is positional, and an id an editor can
        // edit is an id that stops matching the step it names.
        checklist: serialiseRows(
          item.checklist.map((step) => ({
            label: step.label,
            detail: step.detail,
          }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "media",
    [...seed.liveEvents, ...seed.videos, ...seed.podcastEpisodes].map((item) => ({
      id: item.id,
      collection: "media" as const,
      title: item.title,
      subtitle: item.series ?? item.kind,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/${
        item.kind === "podcast" ? "listen" : item.kind === "live" ? "live" : "watch"
      }/${item.slug}`,
      fields: {
        title: item.title,
        description: item.description,
        kind: item.kind,
        format: item.format,
        series: item.series ?? "",
        seriesSlug: item.seriesSlug ?? "",
        host: item.host ?? "",
        duration: item.duration ?? "",
        season: item.season === undefined ? "" : String(item.season),
        episode: item.episode === undefined ? "" : String(item.episode),
        slug: item.slug,
        publishedAt: item.publishedAt,
        // The playable file lives in Cloudinary. An item with no `source` is
        // one that has not been released - the field stays empty and the page
        // renders its "not yet available" stage.
        fileUrl: item.source?.url ?? "",
        posterUrl: item.source?.posterUrl ?? "",
        captionsUrl: item.source?.captionsUrl ?? "",
        topics: encodeList(item.topics),
        takeaways: encodeList(item.takeaways),
        contributors: serialiseRows(
          item.contributors.map((person) => ({
            name: person.name,
            role: person.role,
            bio: person.bio,
          }))
        ),
        chapters: serialiseRows(
          item.chapters.map((chapter) => ({
            startSeconds: String(chapter.startSeconds),
            title: chapter.title,
            summary: chapter.summary,
          }))
        ),
        transcriptStatus: item.transcript.status,
        transcriptCues: serialiseRows(
          item.transcript.cues.map((cue) => ({
            startSeconds: String(cue.startSeconds),
            speaker: cue.speaker,
            text: cue.text,
          }))
        ),
        // The five live fields are set only on a live session; on a video or an
        // episode they store empty, which is what the read path treats as "this
        // is not a live item" rather than "this live item has no agenda".
        liveStatus: isLiveEvent(item) ? item.liveStatus : "",
        scheduledFor: item.scheduledFor ?? "",
        agenda: isLiveEvent(item)
          ? serialiseRows(
              item.agenda.map((slot) => ({
                label: slot.label,
                title: slot.title,
                detail: slot.detail,
              }))
            )
          : "",
        questionPolicy: isLiveEvent(item) ? item.questionPolicy : "",
        registration: isLiveEvent(item) ? item.registration : "",
        archivePolicy: isLiveEvent(item) ? item.archivePolicy : "",
        trending: item.trending ? "yes" : "",
        featured: item.featured ? "yes" : "",
        related: relatedField(item.related),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "media-series",
    seed.mediaSeries.map((item) => ({
      id: item.id,
      collection: "media-series" as const,
      title: item.title,
      subtitle: item.tagline,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      // A live strand is indexed by the schedule at /live rather than by a
      // series page, so it has no public href of its own.
      publicHref:
        item.kind === "live"
          ? "/live"
          : `/${item.kind === "podcast" ? "listen" : "watch"}/series/${item.slug}`,
      fields: {
        title: item.title,
        tagline: item.tagline,
        description: item.description,
        kind: item.kind,
        cadence: item.cadence,
        host: item.host ?? "",
        icon: item.icon,
        slug: item.slug,
        seasons: serialiseRows(
          (item.seasons ?? []).map((season) => ({
            number: String(season.number),
            title: season.title,
            summary: season.summary,
          }))
        ),
        related: relatedField(item.related),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "glossary",
    seed.glossaryTerms.map((item) => ({
      id: item.id,
      collection: "glossary" as const,
      title: item.term,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/glossary/${item.slug}`,
      fields: {
        term: item.term,
        definition: item.definition,
        example: item.example,
        whyItMatters: item.whyItMatters,
        slug: item.slug,
        alsoKnownAs: encodeList(item.alsoKnownAs ?? []),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "quizzes",
    seed.quizzes.map((item) => ({
      id: item.id,
      collection: "quizzes" as const,
      title: item.title,
      subtitle: item.level,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/quizzes/${item.slug}`,
      fields: {
        title: item.title,
        description: item.description,
        level: item.level,
        questionCount: String(item.questionCount),
        minutes: String(item.minutes),
        slug: item.slug,
        // Answers are stored 1-based, as an editor counts the options on the
        // form. The read path subtracts one to get back to the array index.
        questions: serialiseRows(
          (quizQuestions[item.slug] ?? []).map((question) => ({
            prompt: question.prompt,
            options: encodeList(question.options),
            answer: String(question.answer + 1),
            explanation: question.explanation,
          }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "checklists",
    seed.checklists.map((item) => ({
      id: item.id,
      collection: "checklists" as const,
      title: item.title,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/resources/${item.slug}`,
      fields: {
        title: item.title,
        description: item.description,
        itemCount: String(item.itemCount),
        slug: item.slug,
        audience: item.audience,
        // The lines live beside the checklists rather than on them, so they
        // are gathered here - the CMS record is the whole checklist, which is
        // what an editor opens to work on.
        items: serialiseRows(
          (checklistItems[item.slug] ?? []).map((line) => ({
            group: line.group,
            label: line.label,
            detail: line.detail,
          }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  /* Business & enterprise - Phase 3 ---------------------------------------- */

  store.set(
    "compliance-topics",
    seed.complianceTopics.map((item) => ({
      id: item.id,
      collection: "compliance-topics" as const,
      title: item.title,
      subtitle: item.areaId,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/business/compliance/${item.slug}`,
      fields: {
        title: item.title,
        summary: item.summary,
        areaId: item.areaId,
        slug: item.slug,
        icon: item.icon,
        whatItCovers: encodeList(item.whatItCovers),
        appliesWhen: encodeList(item.appliesWhen),
        goodPractice: encodeList(item.goodPractice),
        commonGaps: encodeList(item.commonGaps),
        whenToInvolveALawyer: encodeList(item.whenToInvolveALawyer),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "contracts",
    seed.contractTypes.map((item) => ({
      id: item.id,
      collection: "contracts" as const,
      title: item.name,
      subtitle: item.family,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/business/contracts/${item.slug}`,
      fields: {
        name: item.name,
        family: item.family,
        whatItIs: item.whatItIs,
        whyItMatters: item.whyItMatters,
        slug: item.slug,
        commonlyUsedWhen: encodeList(item.commonlyUsedWhen),
        commonMistakes: encodeList(item.commonMistakes),
        warningSigns: encodeList(item.warningSigns),
        whenLegalReviewIsAppropriate: encodeList(item.whenLegalReviewIsAppropriate),
        importantClauses: serialiseRows(
          item.importantClauses.map((clause) => ({
            name: clause.name,
            purpose: clause.purpose,
            whatToCheck: clause.whatToCheck,
          }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "industries",
    seed.industryHubs.map((item) => ({
      id: item.id,
      collection: "industries" as const,
      title: item.name,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/business/industries/${item.slug}`,
      fields: {
        name: item.name,
        blurb: item.blurb,
        slug: item.slug,
        icon: item.icon,
        overview: encodeList(item.overview),
        regulatoryThemes: encodeList(item.regulatoryThemes),
        complianceTopics: encodeList(item.complianceTopics),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "ceo-briefings",
    seed.ceoBriefings.map((item) => ({
      id: item.id,
      collection: "ceo-briefings" as const,
      title: item.title,
      subtitle: item.question,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/business/ceo/${item.slug}`,
      fields: {
        title: item.title,
        question: item.question,
        summary: item.summary,
        readingMinutes: String(item.readingMinutes),
        slug: item.slug,
        keyPoints: encodeList(item.keyPoints),
        questionsForTheBoard: encodeList(item.questionsForTheBoard),
        whereRiskLands: encodeList(item.whereRiskLands),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "regulatory-updates",
    seed.regulatoryUpdates.map((item) => ({
      id: item.id,
      collection: "regulatory-updates" as const,
      title: item.title,
      subtitle: item.topic,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/business/regulatory-watch/${item.slug}`,
      fields: {
        title: item.title,
        topic: item.topic,
        effectiveFrom: item.effectiveFrom,
        guidanceNote: item.guidanceNote ?? "",
        publishedAt: item.publishedAt,
        slug: item.slug,
        report: encodeList(item.report),
        explanation: encodeList(item.explanation),
        whoIsAffected: encodeList(item.whoIsAffected),
        businessConsiderations: encodeList(item.businessConsiderations),
        individualConsiderations: encodeList(item.individualConsiderations),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "legal-problems",
    seed.legalProblems.map((item) => ({
      id: item.id,
      collection: "legal-problems" as const,
      title: item.title,
      subtitle: item.category,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/legal-help/problem/${item.slug}`,
      fields: {
        title: item.title,
        situation: item.situation,
        summary: item.summary,
        category: item.category,
        urgency: item.urgency,
        slug: item.slug,
        icon: item.icon,
        rightsInThisSituation: encodeList(item.rightsInThisSituation),
        doNow: encodeList(item.doNow),
        avoid: encodeList(item.avoid),
        whenToGetHelp: encodeList(item.whenToGetHelp),
        referralRoutes: encodeList(item.referralRoutes),
        steps: serialiseRows(
          item.steps.map((step) => ({ title: step.title, body: step.body }))
        ),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "referral-routes",
    seed.referralRoutes.map((item) => ({
      id: item.id,
      collection: "referral-routes" as const,
      title: item.name,
      subtitle: item.kind,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/legal-help/legal-aid#${item.slug}`,
      fields: {
        name: item.name,
        kind: item.kind,
        whatItIs: item.whatItIs,
        howToFind: item.howToFind,
        slug: item.slug,
        icon: item.icon,
        whoItIsFor: encodeList(item.whoItIsFor),
        howItTypicallyWorks: encodeList(item.howItTypicallyWorks),
        whatToBring: encodeList(item.whatToBring),
        limits: encodeList(item.limits),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "lawyer-listings",
    seed.lawyerListings.map((item) => ({
      id: item.id,
      collection: "lawyer-listings" as const,
      title: item.displayName,
      subtitle: `${item.city}, ${item.state}`,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/lawyers/${item.slug}`,
      fields: {
        displayName: item.displayName,
        listingStatus: item.listingStatus,
        focus: item.focus,
        state: item.state,
        city: item.city,
        availability: item.availability,
        experienceBand: item.experienceBand,
        consultation: item.consultation,
        slug: item.slug,
        practiceAreas: encodeList(item.practiceAreas),
        languages: encodeList(item.languages),
        about: encodeList(item.about),
        credentials: encodeList(item.credentials),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "questions",
    seed.publicQuestions.map((item) => ({
      id: item.id,
      collection: "questions" as const,
      title: item.question,
      subtitle: item.topic,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/ask/${item.slug}`,
      fields: {
        question: item.question,
        askedBy: item.askedBy,
        topic: item.topic,
        askedOn: item.askedOn,
        lawyerNote: item.lawyerNote ?? "",
        slug: item.slug,
        generalAnswer: encodeList(item.generalAnswer),
        whatTheLawSays: encodeList(item.whatTheLawSays),
        whatToDoNext: encodeList(item.whatToDoNext),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "law-entries",
    seed.lawEntries.map((item) => ({
      id: item.id,
      collection: "law-entries" as const,
      title: item.title,
      subtitle: item.instrument,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/know-the-law/${item.category}/${item.slug}`,
      fields: {
        title: item.title,
        instrument: item.instrument,
        summary: item.summary,
        slug: item.slug,
        category: item.category,
        covers: encodeList(item.covers),
        affects: encodeList(item.affects),
        explanation: encodeList(item.explanation),
        provisions: serialiseRows(
          item.provisions.map((provision) => ({
            heading: provision.heading,
            citation: provision.citation,
            plainLanguage: provision.plainLanguage,
          }))
        ),
        examples: serialiseRows(
          item.examples.map((example) => ({
            situation: example.situation,
            outcome: example.outcome,
          }))
        ),
        shouldDo: encodeList(item.shouldDo),
        shouldNotDo: encodeList(item.shouldNotDo),
        misconceptions: serialiseRows(
          item.misconceptions.map((entry) => ({
            myth: entry.myth,
            reality: entry.reality,
          }))
        ),
        whenToSeeALawyer: encodeList(item.whenToSeeALawyer),
        amendmentNote: item.amendmentNote ?? "",
        related: relatedField(item.related),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "safety-guides",
    seed.safetyGuides.map((item) => ({
      id: item.id,
      collection: "safety-guides" as const,
      title: item.title,
      subtitle: item.area,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: `/stay-safe/${item.slug}`,
      fields: {
        title: item.title,
        risk: item.risk,
        summary: item.summary,
        area: item.area,
        slug: item.slug,
        icon: item.icon,
        series: item.series ?? "",
        whatToLookFor: encodeList(item.whatToLookFor),
        redFlags: encodeList(item.redFlags),
        questionsToAsk: encodeList(item.questionsToAsk),
        stopAndGetHelp: encodeList(item.stopAndGetHelp),
        related: relatedField(item.related),
        ...metaFields(item.meta),
      },
    }))
  );

  // The Constitution has no editorial metadata of its own: the text is not
  // ours to review, and only the restatement beside it is. Both chapter and
  // section records ship published for the same reason `pages` do - seeding
  // must not take the Constitution explorer offline.
  store.set(
    "constitution-chapters",
    constitutionChapters.map((item) => ({
      id: `constitution-chapter-${item.numeral.toLowerCase()}`,
      collection: "constitution-chapters" as const,
      title: item.title,
      subtitle: `Chapter ${item.numeral}`,
      status: "published" as const,
      updatedAt: stamp,
      publicHref: `/constitution/chapter-${item.numeral.toLowerCase()}`,
      fields: {
        title: item.title,
        numeral: item.numeral,
        summary: item.summary,
        covers: encodeList(item.covers),
        href: item.href ?? "",
        hrefLabel: item.hrefLabel ?? "",
      },
    }))
  );

  store.set(
    "constitution-sections",
    constitutionSections.map((item) => ({
      id: item.id,
      collection: "constitution-sections" as const,
      title: item.heading,
      subtitle: `Section ${item.number}`,
      status: "published" as const,
      updatedAt: stamp,
      // A section is rendered inside its chapter rather than at an address of
      // its own, so the chapter route is what publishing it affects.
      publicHref: `/constitution/chapter-${item.chapter.toLowerCase()}#s-${item.number}`,
      fields: {
        heading: item.heading,
        number: item.number,
        chapter: item.chapter,
        plainLanguage: item.plainLanguage,
        qualifications: encodeList(item.qualifications ?? []),
        related: relatedField(item.related),
      },
    }))
  );

  store.set(
    "courts",
    courtProfiles.map((item) => ({
      id: item.id,
      collection: "courts" as const,
      title: item.name,
      subtitle: `Rank ${item.rank}`,
      status: "published" as const,
      updatedAt: stamp,
      fields: {
        name: item.name,
        courtId: item.id,
        rank: String(item.rank),
        jurisdiction: item.jurisdiction,
        bindingEffect: item.bindingEffect,
      },
    }))
  );

  store.set(
    "alert-topics",
    seed.alertTopics.map((item) => ({
      id: `alert-topic-${item.slug}`,
      collection: "alert-topics" as const,
      title: item.label,
      subtitle: item.slug,
      status: "published" as const,
      updatedAt: stamp,
      fields: {
        label: item.label,
        slug: item.slug,
        description: item.description,
        icon: item.icon,
      },
    }))
  );

  store.set(
    "calendar-entries",
    seed.calendarEntries.map((item) => ({
      id: item.id,
      collection: "calendar-entries" as const,
      title: item.title,
      subtitle: item.cadence,
      ...fromMeta(item.meta),
      status: item.meta.status,
      updatedAt: stamp,
      publicHref: "/business/legal-calendar",
      fields: {
        title: item.title,
        cadence: item.cadence,
        trigger: item.trigger,
        timing: item.timing,
        summary: item.summary,
        areaId: item.areaId,
        icon: item.icon,
        whatToPrepare: encodeList(item.whatToPrepare),
        ...metaFields(item.meta),
      },
    }))
  );

  store.set(
    "health-check",
    seed.healthCheckQuestions.map((item) => ({
      id: item.id,
      collection: "health-check" as const,
      title: item.prompt,
      subtitle: item.areaId,
      status: "published" as const,
      updatedAt: stamp,
      publicHref: "/business/health-check",
      fields: {
        prompt: item.prompt,
        help: item.help ?? "",
        areaId: item.areaId,
      },
    }))
  );

  store.set(
    "profile-questions",
    seed.profileQuestions.map((item) => ({
      id: item.id,
      collection: "profile-questions" as const,
      title: item.label,
      subtitle: item.kind === "boolean" ? "Yes or no" : "Choose one",
      status: "published" as const,
      updatedAt: stamp,
      publicHref: "/business-account",
      fields: {
        label: item.label,
        help: item.help ?? "",
        kind: item.kind,
        // Areas are comma-separated inside the column because a row column is
        // a single string; the read path splits them back out.
        options: serialiseRows(
          item.options.map((option) => ({
            label: option.label,
            value: option.value,
            areas: option.areas.join(", "),
          }))
        ),
      },
    }))
  );

  return store;
}

/* -------------------------------------------------------------------------- */
/* In-memory adapter                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Survives hot reloads in development by hanging off `globalThis`, so an edit
 * made in the CMS is not lost every time a file changes.
 */
const globalStore = globalThis as unknown as {
  __lawCms?: { records: Map<CollectionId, CmsRecord[]>; activity: ActivityEntry[] };
};

function store() {
  if (!globalStore.__lawCms) {
    globalStore.__lawCms = { records: buildSeed(), activity: [] };
  }
  return globalStore.__lawCms;
}


const REVIEW_VALUES: ReviewStatus[] = [
  "educational",
  "reviewed",
  "updated",
  "archived",
];

function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_VALUES as string[]).includes(value);
}

class InMemoryCmsRepository implements CmsRepository {
  async listCollectionsSummary(): Promise<CollectionCounts[]> {
    return collections.map((definition) => {
      const records = store().records.get(definition.id) ?? [];
      return {
        collection: definition.id,
        total: records.length,
        draft: records.filter((r) => r.status === "draft").length,
        review: records.filter((r) => r.status === "review").length,
        published: records.filter((r) => r.status === "published").length,
        archived: records.filter((r) => r.status === "archived").length,
      };
    });
  }

  async list(
    collection: CollectionId,
    filters: CmsListFilters = {}
  ): Promise<CmsRecord[]> {
    const records = store().records.get(collection) ?? [];
    const query = filters.query?.trim().toLowerCase();

    return records.filter((record) => {
      if (
        filters.status &&
        filters.status !== "all" &&
        record.status !== filters.status
      ) {
        return false;
      }
      if (!query) return true;
      return (
        record.title.toLowerCase().includes(query) ||
        (record.subtitle?.toLowerCase().includes(query) ?? false)
      );
    });
  }

  async get(collection: CollectionId, id: string): Promise<CmsRecord | null> {
    const records = store().records.get(collection) ?? [];
    return records.find((record) => record.id === id) ?? null;
  }

  async create(
    collection: CollectionId,
    id: string,
    fields: Record<string, string>,
    actor: string
  ): Promise<CmsRecord> {
    const records = store().records.get(collection) ?? [];
    if (records.some((item) => item.id === id)) {
      throw new Error("A record with that id already exists");
    }

    const record: CmsRecord = {
      id,
      collection,
      title: fields[titleFieldFor(collection)] || id,
      subtitle: collection === "pages" ? fields.path : undefined,
      status: "draft",
      review:
        fields.review && isReviewStatus(fields.review)
          ? fields.review
          : undefined,
      reviewedBy: fields.reviewedBy || undefined,
      lastReviewed: fields.lastReviewed || undefined,
      updatedAt: nowIso(),
      publicHref: publicHrefFor(collection, fields),
      fields,
      blocks: getCollection(collection)?.hasBlocks ? [] : undefined,
    };

    // Newest first, matching the order a freshly created record is looked for.
    store().records.set(collection, [record, ...records]);
    this.log(collection, record, "created", actor);
    return record;
  }

  async updateFields(
    collection: CollectionId,
    id: string,
    fields: Record<string, string>,
    actor: string
  ): Promise<CmsRecord> {
    const record = await this.get(collection, id);
    if (!record) throw new Error("Record not found");

    record.fields = { ...record.fields, ...fields };

    const label = record.fields[titleFieldFor(collection)];
    if (label) record.title = label;

    const review = record.fields.review;
    if (review && isReviewStatus(review)) record.review = review;
    if ("reviewedBy" in fields) record.reviewedBy = fields.reviewedBy || undefined;
    if ("lastReviewed" in fields) record.lastReviewed = fields.lastReviewed;

    record.updatedAt = nowIso();
    this.log(collection, record, "updated", actor);
    return record;
  }

  async updateBlocks(
    collection: CollectionId,
    id: string,
    blocks: PageBlock[],
    actor: string
  ): Promise<CmsRecord> {
    const record = await this.get(collection, id);
    if (!record) throw new Error("Record not found");
    record.blocks = blocks;
    record.updatedAt = nowIso();
    this.log(collection, record, "reshaped", actor);
    return record;
  }

  async setStatus(
    collection: CollectionId,
    id: string,
    status: WorkflowStatus,
    actor: string
  ): Promise<CmsRecord> {
    const record = await this.get(collection, id);
    if (!record) throw new Error("Record not found");
    record.status = status;
    record.updatedAt = nowIso();
    this.log(collection, record, `moved to ${status}`, actor);
    return record;
  }

  async remove(
    collection: CollectionId,
    id: string,
    actor: string
  ): Promise<void> {
    const records = store().records.get(collection) ?? [];
    const record = records.find((item) => item.id === id);
    if (!record) return;
    store().records.set(
      collection,
      records.filter((item) => item.id !== id)
    );
    this.log(collection, record, "deleted", actor);
  }

  async recentActivity(limit = 8): Promise<ActivityEntry[]> {
    return store().activity.slice(0, limit);
  }

  async reviewQueue(limit = 6): Promise<CmsRecord[]> {
    const queue: CmsRecord[] = [];
    for (const records of store().records.values()) {
      queue.push(
        ...records.filter(
          (record) => record.status === "review" || record.status === "draft"
        )
      );
    }
    return queue
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit);
  }

  private log(
    collection: CollectionId,
    record: CmsRecord,
    action: string,
    actor: string
  ): void {
    store().activity.unshift({
      id: `${record.id}-${Date.now()}`,
      collection,
      recordId: record.id,
      title: record.title,
      action,
      actor,
      at: nowIso(),
    });
    store().activity = store().activity.slice(0, 50);
  }
}

const memoryRepository = new InMemoryCmsRepository();
let convexRepository: CmsRepository | undefined;

/**
 * Resolve the active CMS repository.
 *
 * Convex whenever a deployment is configured, which is the real system: edits
 * persist, and the public site reads the same rows.
 *
 * The in-memory adapter remains for a checkout with no Convex URL - it keeps
 * the admin explorable offline. Its writes are process-local and reset on
 * restart, so it must never be mistaken for the live CMS; `isCmsPersistent`
 * exists so the admin can say which one is in use rather than letting someone
 * spend an afternoon editing content that will vanish.
 */
export function getCms(): CmsRepository {
  if (!isCmsPersistent()) return memoryRepository;
  if (!convexRepository) convexRepository = new ConvexCmsRepository();
  return convexRepository;
}

/** Whether edits made in the CMS will actually survive. */
export function isCmsPersistent(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}
