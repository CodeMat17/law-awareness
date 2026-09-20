/**
 * Content model for Law Awareness TV.
 *
 * These types are the single contract between the presentation layer and the
 * data layer. Today they are served from an in-memory adapter; when Convex is
 * introduced, the Convex schema mirrors these shapes and only the adapter in
 * `lib/content/repository.ts` changes. No component imports data directly.
 */

/** Editorial workflow state. Every content type carries one. */
export type WorkflowStatus = "draft" | "review" | "published" | "archived";

/**
 * Credibility signal shown to readers. `reviewed` may only be set by a human
 * editorial process - never inferred, never defaulted.
 */
export type ReviewStatus = "educational" | "reviewed" | "updated" | "archived";

/** Distinguishes reporting from explanation from opinion. */
export type ContentKind =
  | "news"
  | "analysis"
  | "explainer"
  | "opinion"
  | "educational";

export type Audience =
  | "citizens"
  | "business"
  | "professionals"
  | "learners"
  | "viewers";

export interface EditorialMeta {
  /** Workflow state used by the CMS. Only `published` is publicly readable. */
  status: WorkflowStatus;
  /** Credibility badge surfaced to readers. */
  review: ReviewStatus;
  /** ISO date (YYYY-MM-DD). */
  lastReviewed: string;
  /** Display name of the reviewer, when a human has actually reviewed it. */
  reviewedBy?: string;
  /** Authoritative source the content points readers to. */
  source?: SourceReference;
}

export interface SourceReference {
  label: string;
  /** Citation of the instrument, e.g. "Constitution of Nigeria 1999, s. 35". */
  citation?: string;
  url?: string;
}

export interface Taxonomy {
  slug: string;
  name: string;
  /** Short line used on cards and hub headers. */
  blurb: string;
  /** Lucide icon name, resolved through `lib/icons.ts`. */
  icon: string;
}

/* -------------------------------------------------------------------------- */
/* Ticker                                                                      */
/* -------------------------------------------------------------------------- */

export type TickerTone = "update" | "alert" | "live" | "business" | "notice";

export interface TickerItem {
  id: string;
  /** Badge text, e.g. "LEGAL UPDATE". */
  label: string;
  tone: TickerTone;
  headline: string;
  href: string;
  publishedAt: string;
  status: WorkflowStatus;
}

/* -------------------------------------------------------------------------- */
/* Legal knowledge                                                             */
/* -------------------------------------------------------------------------- */

export interface LawCategory extends Taxonomy {
  /** Number of published explainers in the category. */
  entryCount: number;
}

export interface RightSummary {
  id: string;
  slug: string;
  /** Situation-first title: "If the police stop you". */
  title: string;
  situation: string;
  summary: string;
  category: string;
  meta: EditorialMeta;
}

export interface IssueCategory extends Taxonomy {
  /** Route the issue finder sends the reader to. */
  href: string;
}

export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  definition: string;
  example: string;
  whyItMatters: string;
  /** Other wording a reader may meet for the same idea. */
  alsoKnownAs?: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* -------------------------------------------------------------------------- */
/* Editorial + business                                                        */
/* -------------------------------------------------------------------------- */

/** One titled block of an article body. */
export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  slug: string;
  kind: ContentKind;
  title: string;
  standfirst: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  /** Optional lead image path under /public. */
  image?: string;
  audiences: Audience[];
  /** Full piece. Absent while only the standfirst has been written. */
  body?: ArticleSection[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

export interface BusinessGuide {
  id: string;
  slug: string;
  title: string;
  /** "Before you sign a supplier contract" framing. */
  situation: string;
  summary: string;
  area: string;
  checklistCount: number;
  meta: EditorialMeta;
}

export interface ComplianceArea {
  id: string;
  name: string;
  /** Illustrative readiness weighting used by the health-check preview. */
  weight: number;
  icon: string;
}

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

export type MediaKind = "video" | "podcast" | "live";

export interface MediaItem {
  id: string;
  slug: string;
  kind: MediaKind;
  title: string;
  description: string;
  /** Human duration label, e.g. "24 min". Absent while live. */
  duration?: string;
  series?: string;
  host?: string;
  publishedAt: string;
  /** Set only for `kind: "live"`. */
  isLiveNow?: boolean;
  scheduledFor?: string;
  meta: EditorialMeta;
}

/* -------------------------------------------------------------------------- */
/* Learning                                                                    */
/* -------------------------------------------------------------------------- */

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  minutes: number;
  level: "starter" | "core" | "advanced";
  meta: EditorialMeta;
}

/** One multiple-choice question in a quiz. */
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Why that answer is right - shown after the reader has chosen. */
  explanation: string;
}

/** One line of a checklist, grouped into a stage of the task. */
export interface ChecklistItem {
  id: string;
  /** Stage heading this line sits under. */
  group: string;
  label: string;
  detail: string;
}

export interface Checklist {
  id: string;
  slug: string;
  title: string;
  description: string;
  itemCount: number;
  audience: Audience;
  meta: EditorialMeta;
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  links: NavLink[];
}

/* -------------------------------------------------------------------------- */
/* Homepage entry points                                                       */
/* -------------------------------------------------------------------------- */

export interface EntryPoint {
  id: string;
  audience: Audience;
  eyebrow: string;
  promise: string;
  href: string;
  icon: string;
}

export interface PlatformStat {
  id: string;
  value: string;
  label: string;
  detail: string;
}

/* -------------------------------------------------------------------------- */
/* Legal knowledge — Phase 2                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Cross-references between content records, stored as slugs so the CMS can
 * persist them as plain strings. `lib/content/repository.ts` resolves them into
 * `RelatedItem[]`; nothing in the presentation layer follows a reference itself.
 */
export interface RelatedRefs {
  laws?: string[];
  rights?: string[];
  safety?: string[];
  guides?: string[];
  articles?: string[];
  media?: string[];
  terms?: string[];
  /* Phase 3 — business & enterprise */
  compliance?: string[];
  contracts?: string[];
  industries?: string[];
  briefings?: string[];
  updates?: string[];
  /* Phase 5 — legal help */
  problems?: string[];
  questions?: string[];
  referrals?: string[];
  /* Phase 6 — professional/advanced */
  cases?: string[];
  /** Constitution section numbers, e.g. ["35", "36"]. */
  sections?: string[];
}

export type RelatedKind =
  | "law"
  | "right"
  | "safety"
  | "guide"
  | "article"
  | "media"
  | "term"
  | "compliance"
  | "contract"
  | "industry"
  | "briefing"
  | "update"
  | "problem"
  | "question"
  | "referral"
  | "case"
  | "section";

/** A resolved cross-reference, ready to render. */
export interface RelatedItem {
  id: string;
  kind: RelatedKind;
  title: string;
  group: string;
  summary: string;
  href: string;
  icon: string;
}

/**
 * One provision of a law.
 *
 * The platform never reproduces or invents statutory wording. `citation` names
 * where the official text lives and `plainLanguage` is our explanation of it —
 * the two are rendered in visibly separate panes so a summary can never be
 * mistaken for the text of the law.
 */
export interface LawProvision {
  id: string;
  heading: string;
  /** e.g. "Constitution 1999, s. 35". Never invented. */
  citation: string;
  plainLanguage: string;
}

export interface Misconception {
  myth: string;
  reality: string;
}

/** A worked situation showing how the law lands in ordinary life. */
export interface LawExample {
  situation: string;
  outcome: string;
}

export interface LawEntry {
  id: string;
  slug: string;
  /** Slug of the owning `LawCategory`. */
  category: string;
  title: string;
  /** The instrument this entry explains, named exactly. */
  instrument: string;
  summary: string;
  covers: string[];
  affects: string[];
  /** Paragraphs of plain-language explanation. */
  explanation: string[];
  provisions: LawProvision[];
  examples: LawExample[];
  shouldDo: string[];
  shouldNotDo: string[];
  misconceptions: Misconception[];
  whenToSeeALawyer: string[];
  /** Amendment/consolidation status in general terms, when it is known. */
  amendmentNote?: string;
  related?: RelatedRefs;
  meta: EditorialMeta;
}

export interface RightStep {
  title: string;
  body: string;
}

/** A situation-first rights guide. Extends the summary used on cards. */
export interface RightGuide extends RightSummary {
  /** What the law actually protects in this situation. */
  protects: string[];
  /** Ordered, practical steps through the situation. */
  steps: RightStep[];
  doNow: string[];
  avoid: string[];
  misconceptions: Misconception[];
  whenToSeeALawyer: string[];
  related?: RelatedRefs;
}

/** Practical risk-prevention guide. `series` groups the Before You Sign run. */
export interface SafetyGuide {
  id: string;
  slug: string;
  title: string;
  series?: string;
  /** The moment of exposure: "You are handed a tenancy agreement". */
  risk: string;
  summary: string;
  area: string;
  icon: string;
  whatToLookFor: string[];
  redFlags: string[];
  questionsToAsk: string[];
  stopAndGetHelp: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export type SearchType =
  | "law"
  | "right"
  | "safety"
  | "guide"
  | "article"
  | "media"
  | "term"
  | "quiz"
  | "resource"
  | "compliance"
  | "contract"
  | "industry"
  | "briefing"
  | "update"
  | "problem"
  | "question"
  | "lawyer"
  | "case"
  | "section";

export interface SearchDocument {
  id: string;
  type: SearchType;
  title: string;
  summary: string;
  group: string;
  href: string;
  /** Extra matchable text: categories, instruments, situations. */
  keywords: string[];
}

/* -------------------------------------------------------------------------- */
/* Business & enterprise — Phase 3                                             */
/* -------------------------------------------------------------------------- */

/** One of the Business & Enterprise subsections (spec section 17). */
export interface BusinessArea extends Taxonomy {
  /** Where the area's content is gathered. */
  href: string;
}

/**
 * A "Before You Do This" guide (spec section 20).
 *
 * Extends the card-level `BusinessGuide` with the full body, so a card and its
 * page can never describe different things. `checklistCount` on the summary is
 * derived from `checklist.length` in the repository.
 */
export interface BusinessGuideDetail extends BusinessGuide {
  /** Paragraphs framing the decision the reader is about to make. */
  context: string[];
  keyConsiderations: BusinessConsideration[];
  commonMistakes: string[];
  redFlags: string[];
  checklist: ChecklistStep[];
  whenToInvolveALawyer: string[];
  related?: RelatedRefs;
}

export interface BusinessConsideration {
  heading: string;
  body: string;
  /** The instrument this consideration sits under, named exactly. */
  instrument?: string;
}

export interface ChecklistStep {
  id: string;
  label: string;
  detail: string;
}

/* Compliance Centre ------------------------------------------------------- */

/** A Compliance Centre topic (spec section 21). */
export interface ComplianceTopic {
  id: string;
  slug: string;
  title: string;
  /** Owning `ComplianceArea` id, so the health check and centre share a spine. */
  areaId: string;
  summary: string;
  icon: string;
  /** What the obligation is about, in general terms. */
  whatItCovers: string[];
  /** Circumstances that make the topic relevant — never a definitive test. */
  appliesWhen: string[];
  /** Practices a business can put in place. Educational, not prescriptive. */
  goodPractice: string[];
  /** How things typically go wrong. */
  commonGaps: string[];
  whenToInvolveALawyer: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* Regulatory Watch -------------------------------------------------------- */

/**
 * A Regulatory Watch entry (spec section 22).
 *
 * `report` is what happened; `explanation` is what it means. The two are stored
 * separately because the spec requires them to be visibly separate on the page —
 * news reporting must never be presented as legal explanation.
 */
export interface RegulatoryUpdate {
  id: string;
  slug: string;
  title: string;
  /** Topic slug users can follow — see `AlertTopic`. */
  topic: string;
  /** Neutral reporting: what changed. */
  report: string[];
  /** Our explanation of what it means. */
  explanation: string[];
  whoIsAffected: string[];
  /** Commencement in general terms. Never an invented date. */
  effectiveFrom: string;
  businessConsiderations: string[];
  individualConsiderations: string[];
  /** Whether implementation guidance has moved, when that is known. */
  guidanceNote?: string;
  publishedAt: string;
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/** A topic a reader can follow for law-change alerts (spec section 23). */
export interface AlertTopic {
  slug: string;
  label: string;
  description: string;
  icon: string;
}

/* Business legal calendar -------------------------------------------------- */

export type CalendarCadence =
  | "annual"
  | "quarterly"
  | "monthly"
  | "ongoing"
  | "event-driven";

/**
 * A business legal calendar entry (spec section 24).
 *
 * The spec forbids hard-coding legal deadlines without a maintained source and
 * review process, so an entry carries a **cadence and a trigger**, not a date.
 * `timing` describes when the obligation typically arises in words; the UI
 * states plainly that readers must confirm actual dates with the regulator.
 */
export interface CalendarEntry {
  id: string;
  title: string;
  cadence: CalendarCadence;
  /** What starts the clock, e.g. "Your company's financial year end". */
  trigger: string;
  /** Timing in general terms. Never a specific invented deadline. */
  timing: string;
  summary: string;
  areaId: string;
  icon: string;
  whatToPrepare: string[];
  meta: EditorialMeta;
}

/* Contract Knowledge Centre ------------------------------------------------ */

/** An educational contract explainer (spec section 25). */
export interface ContractType {
  id: string;
  slug: string;
  name: string;
  family: string;
  whatItIs: string;
  whyItMatters: string;
  commonlyUsedWhen: string[];
  /** Clauses that decide how the agreement behaves under stress. */
  importantClauses: ContractClause[];
  commonMistakes: string[];
  warningSigns: string[];
  whenLegalReviewIsAppropriate: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

export interface ContractClause {
  name: string;
  purpose: string;
  /** What to look at in the wording. Never model wording of our own. */
  whatToCheck: string;
}

/* Industry hubs ------------------------------------------------------------ */

/** An industry legal hub (spec section 27). */
export interface IndustryHub {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  icon: string;
  /** Why the industry's legal profile differs from the general case. */
  overview: string[];
  /** Regulatory themes in general terms — no invented licensing regimes. */
  regulatoryThemes: string[];
  complianceTopics: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* Law for CEOs ------------------------------------------------------------- */

/** An executive briefing (spec section 26): concise, strategic, decision-led. */
export interface CeoBriefing {
  id: string;
  slug: string;
  title: string;
  /** The strategic question the briefing answers. */
  question: string;
  summary: string;
  readingMinutes: number;
  /** The three-to-five points an executive needs. */
  keyPoints: string[];
  /** What the board or exec team should be asking. */
  questionsForTheBoard: string[];
  /** Where the risk actually lands in the business. */
  whereRiskLands: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* Business profiler + health check ----------------------------------------- */

/** One question in the "What laws apply to my business?" profiler. */
export interface ProfileQuestion {
  id: string;
  label: string;
  help?: string;
  /** `single` renders as a choice row, `boolean` as a yes/no toggle. */
  kind: "single" | "boolean";
  options: ProfileOption[];
}

export interface ProfileOption {
  value: string;
  label: string;
  /** Compliance area ids this answer makes relevant. */
  areas: string[];
}

export type ReadinessBand = "strong" | "attention" | "high-attention";

/** One health-check question, scoped to a compliance area. */
export interface HealthCheckQuestion {
  id: string;
  areaId: string;
  prompt: string;
  help?: string;
}

/* -------------------------------------------------------------------------- */
/* Media — Phase 4                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Editorial genre of a media record (spec section 32).
 *
 * `MediaKind` decides which route an item lives on; `MediaFormat` describes
 * what it actually is. Keeping them apart means a documentary and a short both
 * sit under /watch without the route having to know the difference.
 */
export type MediaFormat =
  | "explainer"
  | "interview"
  | "documentary"
  | "webinar"
  | "short"
  | "broadcast"
  | "episode"
  | "audio-explainer"
  | "live-session";

/**
 * A playable file. Absent until an item is actually released, which is what
 * lets a scheduled item render an honest "not yet available" stage rather than
 * a player that does nothing.
 */
export interface MediaSource {
  url: string;
  /** e.g. "video/mp4", "audio/mpeg". */
  mimeType: string;
  /** WebVTT captions. Video without captions is not published. */
  captionsUrl?: string;
  posterUrl?: string;
}

/** A chapter marker. The timecode label is derived from `startSeconds`. */
export interface MediaChapter {
  id: string;
  /** Offset from the start, in seconds. */
  startSeconds: number;
  title: string;
  summary: string;
}

/**
 * One transcript entry.
 *
 * The platform does not publish verbatim capture it has not made: `text` is a
 * written record, in our own words, of what is covered at that point. It is
 * labelled as such wherever it is rendered - the same discipline
 * `ProvisionSplit` applies to statutory wording.
 */
export interface TranscriptCue {
  id: string;
  startSeconds: number;
  speaker: string;
  text: string;
}

export type TranscriptStatus = "published" | "in-progress" | "unavailable";

export interface MediaTranscript {
  status: TranscriptStatus;
  cues: TranscriptCue[];
}

/**
 * Someone appearing in a media item.
 *
 * `role` describes what they do in the episode. No professional credential is
 * asserted here that the editorial process has not verified - spec rule 23.
 */
export interface MediaContributor {
  id: string;
  name: string;
  role: string;
  bio: string;
}

export interface MediaSeason {
  id: string;
  number: number;
  title: string;
  summary: string;
}

/** A programme or podcast strand. Episodes point at one by slug. */
export interface MediaSeries {
  id: string;
  slug: string;
  /** Which hub the series belongs to. */
  kind: MediaKind;
  title: string;
  tagline: string;
  description: string;
  /** Lucide icon name, resolved through `lib/icons.ts`. */
  icon: string;
  /** How often it lands, in words - never a promised date. */
  cadence: string;
  host?: string;
  topics: string[];
  seasons?: MediaSeason[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/**
 * A full video or podcast page. `MediaItem` stays the card-sized projection so
 * the homepage and the CMS are untouched by anything added here.
 */
export interface MediaDetail extends MediaItem {
  format: MediaFormat;
  /** Slug of the owning `MediaSeries`, when the item belongs to one. */
  seriesSlug?: string;
  season?: number;
  episode?: number;
  topics: string[];
  /** What a viewer or listener leaves knowing. */
  takeaways: string[];
  contributors: MediaContributor[];
  chapters: MediaChapter[];
  transcript: MediaTranscript;
  source?: MediaSource;
  /** Editorially set. The platform shows no view or listen counts. */
  trending?: boolean;
  featured?: boolean;
  related?: RelatedRefs;
}

export type LiveStatus = "live" | "scheduled" | "ended";

/** One item on a live event's running order. */
export interface AgendaSlot {
  id: string;
  /** Relative label, e.g. "First 10 minutes" - never a wall-clock promise. */
  label: string;
  title: string;
  detail: string;
}

/** A live event page (spec section 33). */
export interface LiveEvent extends MediaDetail {
  liveStatus: LiveStatus;
  agenda: AgendaSlot[];
  /** How audience questions are handled. */
  questionPolicy: string;
  /** How to attend or be reminded. */
  registration: string;
  /** What happens to the stream once it ends. */
  archivePolicy: string;
}

/* -------------------------------------------------------------------------- */
/* Legal help — Phase 5                                                        */
/* -------------------------------------------------------------------------- */

/**
 * How quickly a situation usually moves. This describes the *situation*, never
 * the reader's legal position — the platform does not diagnose (spec s.35).
 */
export type ProblemUrgency = "immediate" | "time-sensitive" | "considered";

/**
 * One gating question on a problem pathway.
 *
 * A triage answer changes **which education is shown first**. It never produces
 * a determination, a prediction or an assessment of the reader's case.
 */
export interface TriageAnswer {
  value: string;
  label: string;
  /** What this answer changes about the reading order, in general terms. */
  guidance: string;
  urgency: ProblemUrgency;
}

export interface TriageQuestion {
  id: string;
  question: string;
  help?: string;
  answers: TriageAnswer[];
}

export interface ProblemStep {
  title: string;
  body: string;
}

/**
 * An "I have a legal problem" pathway (spec section 35).
 *
 * The shape follows the flow the spec sets out: situation → gating question →
 * educational information → rights → what to do → what to avoid → relevant law
 * → resources → when to seek professional help → find legal help. `related`
 * carries the law and rights references; `referralRoutes` carries the last step.
 */
export interface LegalProblem {
  id: string;
  slug: string;
  /** Grouping label used by the chooser, e.g. "Police & criminal". */
  category: string;
  /** Situation-first: "The police have arrested someone I know". */
  title: string;
  /** The moment the reader is in, in their words. */
  situation: string;
  summary: string;
  icon: string;
  urgency: ProblemUrgency;
  triage: TriageQuestion[];
  /** What the law protects in this situation. */
  rightsInThisSituation: string[];
  doNow: string[];
  avoid: string[];
  steps: ProblemStep[];
  whenToGetHelp: string[];
  /** Slugs of `ReferralRoute` — the "find legal help" step. */
  referralRoutes: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

export type ReferralKind =
  | "legal-aid"
  | "professional-body"
  | "public-institution"
  | "civil-society"
  | "law-clinic";

/**
 * A route to actual legal help (the referral architecture, spec section 35).
 *
 * These are real, well-known Nigerian institutions described in general terms.
 * No address, telephone number, fee or eligibility threshold is stated here:
 * `howToFind` tells the reader where to confirm current details instead, because
 * a contact detail that is wrong is worse than none at all.
 */
export interface ReferralRoute {
  id: string;
  slug: string;
  name: string;
  kind: ReferralKind;
  icon: string;
  whatItIs: string;
  whoItIsFor: string[];
  howItTypicallyWorks: string[];
  whatToBring: string[];
  /** What this route does not do. Every route has limits. */
  limits: string[];
  /** Where to confirm current contact details. Never an invented address. */
  howToFind: string;
  meta: EditorialMeta;
}

/**
 * Whether a directory listing has been through the verification process.
 *
 * `sample` exists because spec rule 23 forbids inventing professional
 * credentials and spec section 36 requires verification to be backed by an
 * actual administrative process. Until that process runs, the directory carries
 * structured sample listings — practice-and-location shaped, never a person —
 * so the architecture is real without anybody's credentials being fabricated.
 */
export type ListingStatus = "sample" | "pending-verification" | "verified";

export type ListingAvailability = "accepting" | "waitlist" | "not-accepting";

export type ExperienceBand = "1-5" | "6-10" | "11-20" | "20+";

/** One entry in the lawyer directory (spec section 36). */
export interface LawyerListing {
  id: string;
  slug: string;
  /** Practice-and-location descriptor while `listingStatus` is `sample`. */
  displayName: string;
  listingStatus: ListingStatus;
  focus: string;
  practiceAreas: string[];
  state: string;
  city: string;
  languages: string[];
  experienceBand: ExperienceBand;
  availability: ListingAvailability;
  /** How consultations are typically arranged. Never a fee. */
  consultation: string;
  about: string[];
  /** Empty until a named practitioner has been verified. */
  credentials: string[];
  meta: EditorialMeta;
}

/**
 * A moderated public question (spec section 37).
 *
 * A question never becomes public automatically. `askedBy` is pseudonymous by
 * design: the platform publishes a first name or "Anonymous" with a state, and
 * nothing that could identify the person or their matter.
 */
export interface PublicQuestion {
  id: string;
  slug: string;
  question: string;
  /** Pseudonymous attribution, e.g. "Anonymous · Lagos". */
  askedBy: string;
  topic: string;
  askedOn: string;
  /** General legal information, written by the editorial desk. */
  generalAnswer: string[];
  /** What the named instruments say, in general terms. */
  whatTheLawSays: string[];
  whatToDoNext: string[];
  /** Present only where a named practitioner has actually responded. */
  lawyerNote?: string;
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* -------------------------------------------------------------------------- */
/* Case law — Phase 6                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The court that decided a case, as a stable key rather than free text, so the
 * explorer can order results by authority instead of alphabetically.
 */
export type CourtLevel =
  | "supreme-court"
  | "court-of-appeal"
  | "federal-high-court"
  | "state-high-court"
  | "national-industrial-court"
  | "tribunal";

/** A court in the hierarchy, used for the explorer facet and the ladder. */
export interface CourtProfile {
  id: CourtLevel;
  name: string;
  /** Where it sits, 0 being the final court. */
  rank: number;
  jurisdiction: string;
  bindingEffect: string;
}

/**
 * Whether a decision still stands, in the terms lawyers actually use. Never
 * inferred — it is only set where the position is settled and well known.
 */
export type CaseStanding =
  | "followed"
  | "distinguished"
  | "overtaken-by-statute"
  | "position-not-stated";

/**
 * A decided case (spec section 29).
 *
 * EDITORIAL RULE, enforced by the shape of this type: there is no `citation`
 * field and no `judge` field, because a law-report volume and page, and the
 * composition of a panel, are precisely the details that cannot be reproduced
 * from memory without risking a citation that leads nowhere. `whereToFindIt`
 * says how to locate the reported decision instead, and every rendered case
 * carries a notice that the summary is editorial and must be checked against
 * the report. Nothing here states a holding that the decision did not make.
 */
export interface CaseRecord {
  id: string;
  slug: string;
  /** The case as it is universally cited, e.g. "Garba v. University of Maiduguri". */
  title: string;
  court: CourtLevel;
  /** The year the decision is known by. */
  year: number;
  /** Subject slug, matching a `LawCategory` where one exists. */
  subject: string;
  /** The question the court had to answer, in one line. */
  legalIssue: string;
  /** A short label for the issue, used as an explorer facet. */
  issueTag: string;
  /** What the dispute was about. */
  background: string[];
  /** What the court decided. */
  decision: string[];
  /** The principle the case is cited for — stated narrowly. */
  keyPrinciple: string;
  /** What it means for an ordinary reader. */
  plainLanguage: string[];
  /** What the decision does *not* settle. Required: every case has one. */
  doesNotSettle: string[];
  standing: CaseStanding;
  /** How to locate the reported judgment. Never a fabricated citation. */
  whereToFindIt: string;
  /** Instruments the decision turned on, named generally. */
  instruments: string[];
  related?: RelatedRefs;
  meta: EditorialMeta;
}

/* -------------------------------------------------------------------------- */
/* Constitution Explorer — Phase 6                                             */
/* -------------------------------------------------------------------------- */

/**
 * One section of the Constitution.
 *
 * `officialText` is deliberately absent. `heading` names the section as the
 * document names it and `plainLanguage` is our explanation, rendered in a
 * visibly separate pane — the same discipline `LawProvision` applies.
 */
export interface ConstitutionSection {
  id: string;
  /** Section number as the Constitution numbers it, e.g. "35". */
  number: string;
  /** Chapter numeral the section belongs to. */
  chapter: string;
  heading: string;
  plainLanguage: string;
  /** Qualifications the Constitution itself attaches, in general terms. */
  qualifications?: string[];
  related?: RelatedRefs;
}

/* -------------------------------------------------------------------------- */
/* Law versioning and amendment tracking — Phase 6                             */
/* -------------------------------------------------------------------------- */

/** How one version of an instrument came to replace the last. */
export type AmendmentKind =
  | "enactment"
  | "amendment"
  | "repeal-and-re-enactment"
  | "alteration"
  | "subsidiary-instrument";

/**
 * One point in an instrument's history (spec section 56).
 *
 * `effective` is expressed in the terms we can stand behind — usually a year —
 * rather than a precise commencement date, which is the kind of detail that is
 * easy to state confidently and wrong. Superseded versions are never deleted:
 * the whole point of this record is that the history survives.
 */
export interface LawVersion {
  id: string;
  /** Instrument as it was named at this point, e.g. "CAMA 1990". */
  label: string;
  kind: AmendmentKind;
  /** Commencement in general terms, e.g. "2020". Never invented. */
  effective: string;
  /** Whether this is the version currently in force. */
  current: boolean;
  /** What changed, in general terms. */
  whatChanged: string[];
  /** Why it matters to a reader today. */
  significance?: string;
}

/**
 * The version history of one instrument, keyed to the law entry that explains
 * it. Rendered as a timeline on the law page and on the amendment tracker.
 */
export interface LawHistory {
  id: string;
  /** Slug of the `LawEntry` this history belongs to. */
  lawSlug: string;
  /** Category slug of that entry, so the tracker can link without a lookup. */
  category: string;
  /** The instrument, named as it stands today. */
  instrument: string;
  /**
   * Topic slug users can follow for alerts — see `AlertTopic`. Optional: not
   * every instrument falls under one of the followable topics, and inventing a
   * topic to fill the field would put an instrument behind an alert nobody
   * would think to subscribe to.
   */
  topic?: string;
  /** Newest first. Exactly one version carries `current: true`. */
  versions: LawVersion[];
  /** Where the consolidated current text is published. */
  whereToFindIt: string;
  meta: EditorialMeta;
}
