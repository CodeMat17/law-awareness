import type { WorkflowStatus } from "@/lib/content/types";
import type { RowColumn } from "./rows";

/**
 * Collection registry.
 *
 * The admin UI is generic: it renders lists and edit forms from these
 * definitions rather than from bespoke screens per content type. Adding a new
 * content type to the CMS means adding an entry here and a mapper in
 * `lib/cms/repository.ts` - no new pages.
 */

export type CollectionId =
  | "pages"
  | "ticker"
  | "articles"
  | "rights"
  | "laws"
  | "business-guides"
  | "compliance-topics"
  | "contracts"
  | "industries"
  | "ceo-briefings"
  | "regulatory-updates"
  | "legal-problems"
  | "referral-routes"
  | "lawyer-listings"
  | "questions"
  | "media"
  | "media-series"
  | "glossary"
  | "quizzes"
  | "checklists"
  | "cases"
  | "law-histories"
  | "law-entries"
  | "safety-guides"
  | "constitution-chapters"
  | "constitution-sections"
  | "courts"
  | "alert-topics"
  | "calendar-entries"
  | "health-check"
  | "profile-questions";

/**
 * The part of the public site a collection feeds.
 *
 * The people who run this CMS are not developers: they arrive knowing the site
 * as its visitors do - "Business", "Watch & Listen", "Legal Help" - and not as
 * a list of twenty-two content types. Sections group the admin the way the
 * site's own menu is grouped, so finding where to add something is a matter of
 * recognising the part of the site it belongs to.
 *
 * Keep the names and their order in step with `navigation` in
 * lib/content/data.ts, which is the menu readers actually see.
 */
export type SiteSection =
  | "news"
  | "know-the-law"
  | "your-rights"
  | "business"
  | "legal-help"
  | "watch-listen"
  | "learn"
  | "site";

export const siteSections: {
  id: SiteSection;
  label: string;
  description: string;
}[] = [
  {
    id: "news",
    label: "News & the front page",
    description:
      "What a reader meets first: the headlines stripe and the articles on Law & Society.",
  },
  {
    id: "know-the-law",
    label: "Know the Law",
    description: "The law itself, explained - subjects, judgments and terms.",
  },
  {
    id: "your-rights",
    label: "Your Rights",
    description: "Situation-by-situation guides for ordinary people.",
  },
  {
    id: "business",
    label: "Business",
    description: "Everything under the Business menu, for company readers.",
  },
  {
    id: "legal-help",
    label: "Legal Help",
    description: "Where a reader in trouble is pointed next.",
  },
  {
    id: "watch-listen",
    label: "Watch & Listen",
    description: "Video, podcasts and live sessions.",
  },
  {
    id: "learn",
    label: "Learn & resources",
    description: "Quizzes and the printable material in the resource centre.",
  },
  {
    id: "site",
    label: "The site itself",
    description:
      "Standing pages that are not part of a content library - About and the platform documents.",
  },
];

/**
 * `list` is a textarea holding one item per line, stored as a newline-joined
 * string so `fields` stays the flat string map convex/schema.ts commits to. It
 * exists for the short flat lists the domain types carry - a case's
 * `instruments`, its `doesNotSettle` - which are content an editor writes by
 * hand.
 *
 * `rows` is the same idea for content that has parts: a step is a title and a
 * body, a clause is a name, a purpose and what to check. The value is JSON at
 * rest and a list of labelled inputs in the admin - see ./rows.ts. Before it
 * existed, every such section was rendered from the seed files and no editor
 * could reach it, which is the single largest thing the CMS could not do.
 */
export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "date"
  | "list"
  | "rows"
  /**
   * An uploaded file. The stored value is a Cloudinary delivery URL and
   * nothing else - the bytes live in Cloudinary, never in Convex, so the
   * database stays a store of editorial state rather than a store of media.
   *
   * `image` takes photos; `video` takes video *and* audio, because Cloudinary
   * puts both through the same pipeline and an editor uploading a podcast
   * episode should not have to know that.
   */
  | "image"
  | "video";

export interface FieldDefinition {
  name: string;
  label: string;
  kind: FieldKind;
  /** Options for `select` fields. */
  options?: { value: string; label: string }[];
  /** Columns of a `rows` field, in order. Required on that kind. */
  columns?: RowColumn[];
  /** Names what one row is, e.g. "Add a step". Defaults to "Add entry". */
  addLabel?: string;
  /**
   * The section of the form this field belongs to.
   *
   * A collection can carry thirty fields, and a single column of thirty
   * controls is a form nobody reads to the bottom of. Fields are drawn in the
   * order declared, grouped under the heading named here; anything without a
   * group leads the form, which is where a record's identity belongs.
   */
  group?: string;
  help?: string;
  required?: boolean;
  /**
   * Names the field this one is slugified from, making it a derived field.
   *
   * A derived field is never rendered and never typed. The create form omits
   * it entirely and the server computes it from its source on submit, so the
   * two can never disagree - a slug that has drifted from the title it names,
   * or a `seriesSlug` that points at no series, are both mistakes that simply
   * cannot be made rather than mistakes an editor is asked not to make.
   *
   * The value is still stored as an ordinary field: only the way it is
   * obtained changes, so everything reading these records is unaffected.
   */
  derivedFrom?: string;
  /**
   * A value fixed when the record was made, shown but never edited.
   *
   * Some fields are load-bearing for the site rather than editorial: a
   * standing page's path is the web address readers and search engines already
   * hold, and retyping it silently breaks every link into it. Rendering such a
   * field as an ordinary text box invites exactly the edit that must not
   * happen, so it is shown as plain text with a note saying why.
   *
   * Locked fields are left off the form entirely. Field maps are merged rather
   * than replaced on save, so an omitted field keeps its stored value - the
   * lock is real, not a disabled input a crafted POST could step around.
   */
  locked?: boolean;
}

export interface CollectionDefinition {
  id: CollectionId;
  /** Plural label used in navigation and headings. */
  label: string;
  singular: string;
  description: string;
  icon: string;
  /**
   * Where a published record in this collection turns up on the public site,
   * named the way the site names it.
   *
   * The admin is generic, so a collection id is all it would otherwise have to
   * go on - and "media" is not a word that appears anywhere a reader looks.
   * An editor should never have to work out that a video published here comes
   * out on Watch, so the mapping is written down and shown on the screens
   * where records are made and changed.
   *
   * Keep it in step with `indexRoutesFor` in ./public-href.ts, which is the
   * same mapping expressed as routes to revalidate.
   */
  appearsOn: string;
  /** The part of the public site this feeds. Groups the admin navigation. */
  section: SiteSection;
  /**
   * Whether the set of records is fixed: they can be edited but not created or
   * deleted from the admin.
   *
   * Set on `pages`, whose records are the site's standing pages. Each one is a
   * route the application knows about, linked from the footer and the menu; a
   * seventh invented here would answer at no address, and deleting About would
   * take a page out from under the links to it. What an editor needs from
   * these is to change the words, and that is all this offers.
   */
  fixed?: boolean;
  /** Whether records carry the editorial credibility metadata. */
  hasReviewMeta: boolean;
  fields: FieldDefinition[];
  /**
   * Whether records in this collection are composed of ordered content blocks
   * in addition to their fields. Set only on `pages`: the fields carry the
   * page's identity and header, and the blocks carry the body.
   *
   * The admin editor renders the block composer for these; the site renders
   * them through components/site/page-blocks.tsx.
   */
  hasBlocks?: boolean;
}

const reviewOptions = [
  { value: "educational", label: "Educational" },
  { value: "reviewed", label: "Reviewed" },
  { value: "updated", label: "Updated" },
  { value: "archived", label: "Archived" },
];

export const workflowOptions: { value: WorkflowStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

/**
 * Form section headings.
 *
 * Named constants rather than repeated strings: a group exists exactly when
 * two fields agree on its name, so a typo would silently split one section
 * into two.
 */
const REVIEW_GROUP = "Credibility & review";
const BODY_GROUP = "What the page says";
const PLACEMENT_GROUP = "Where it belongs";
const FILE_GROUP = "The file readers play";
/**
 * Fields that wire a record to another part of the site by its internal name.
 *
 * They look like ordinary text but behave like plumbing: an `areaId` that no
 * longer matches a compliance area detaches a topic from the health check, and
 * a category slug with a typo files a case under a subject that does not
 * exist. Sinking them into a named section at the bottom of the form tells an
 * editor, without a manual, which fields are theirs and which are not.
 */
const WIRING_GROUP = "Links to other parts of the site — leave unless you know";
/** How the page is described on Google and when someone shares the link. */
const SEO_GROUP = "How it looks in Google & shared links";

/** Fields shared by every reviewable content type. */
const editorialFields: FieldDefinition[] = [
  {
    name: "review",
    label: "Credibility status",
    kind: "select",
    group: REVIEW_GROUP,
    options: reviewOptions,
    help: "Only set 'Reviewed' when a named person has actually reviewed this record.",
  },
  {
    name: "lastReviewed",
    label: "Last reviewed",
    kind: "date",
    group: REVIEW_GROUP,
  },
  {
    name: "reviewedBy",
    label: "Reviewed by",
    kind: "text",
    group: REVIEW_GROUP,
    help: "Leave empty unless a human review genuinely took place.",
  },
  { name: "sourceLabel", label: "Source", kind: "text", group: REVIEW_GROUP },
  {
    name: "sourceCitation",
    label: "Citation",
    group: REVIEW_GROUP,
    kind: "text",
    help: "e.g. Constitution 1999, s. 35. Never cite an instrument you have not verified.",
  },
];

/**
 * The cross-references a record carries to other content, as stored JSON.
 *
 * Locked, and deliberately so. `RelatedRefs` has seventeen keys, every one of
 * them a list of slugs belonging to a different collection; rendered as a form
 * it would be seventeen boxes in which the only valid input is an internal
 * identifier an editor has no way to look up. That is exactly the kind of
 * field the admin locks rather than offers - see `locked` on FieldDefinition.
 *
 * It is a field rather than nothing because the alternative is losing the
 * graph. Before this, every "Related" strip on the site was rendered from the
 * seed files, so moving a collection into the CMS silently emptied it. The
 * value round-trips untouched through seeding and editing, and
 * lib/content/convex-repository.ts reads it back into `related`.
 */
const relatedField: FieldDefinition = {
  name: "related",
  label: "Related content",
  kind: "textarea",
  group: WIRING_GROUP,
  locked: true,
  help: "Set from the editorial source. Links this record to laws, rights, cases and media elsewhere on the site.",
};

export const collections: CollectionDefinition[] = [
  {
    id: "pages",
    label: "About & policy pages",
    singular: "Page",
    description:
      "The five standing pages linked from the footer: About Us, Editorial Policy, Privacy, Terms and Accessibility. Edit their wording here. These pages are part of the site's structure, so they cannot be added to or removed.",
    icon: "file-text",
    appearsOn: "The About menu and the footer of every page — About Us, Editorial Policy, Privacy Policy, Terms of Use and Accessibility.",
    section: "site",
    fixed: true,
    hasReviewMeta: false,
    hasBlocks: true,
    fields: [
      {
        name: "path",
        label: "Web address",
        kind: "text",
        required: true,
        locked: true,
        help: "Fixed. This is the address readers, links and search engines already use for this page — changing it would break every one of them.",
      },
      { name: "title", label: "Title", kind: "text", required: true },
      {
        name: "eyebrow",
        label: "Small label above the title",
        kind: "text",
        required: true,
        help: "One or two words, e.g. 'About'. It also appears as the last step of the trail at the top of the page.",
      },
      {
        name: "lede",
        label: "Introduction under the title",
        kind: "textarea",
        help: "One or two sentences, set larger than the body text.",
      },
      {
        name: "layout",
        label: "How the page is laid out",
        kind: "select",
        locked: true,
        options: [
          { value: "standard", label: "Standard page" },
          { value: "policy", label: "Platform document" },
        ],
        help: "Fixed. Platform documents (Privacy, Terms and the rest) are drawn as numbered sections with links to their siblings; About is drawn as an ordinary page.",
      },
      {
        name: "updated",
        label: "Last revised",
        kind: "date",
        help: "Shown to readers at the top of Privacy, Terms and the other platform documents. Change it whenever you change what the document actually says.",
      },
      {
        name: "metaTitle",
        label: "Search-result title",
        kind: "text",
        group: SEO_GROUP,
        help: "Overrides the page title in search results and social cards. Leave empty to use the title.",
      },
      {
        name: "metaDescription",
        label: "Search-result description",
        kind: "textarea",
        group: SEO_GROUP,
        help: "Around 150 characters. This is what a stranger reads before deciding to click.",
      },
    ],
  },
  {
    id: "ticker",
    label: "Ticker items",
    singular: "Ticker item",
    description:
      "Headlines in the breaking-updates stripe above the navigation.",
    icon: "bell",
    appearsOn: "The updates stripe above the navigation, on every page of the site.",
    section: "news",
    hasReviewMeta: false,
    fields: [
      { name: "headline", label: "Headline", kind: "text", required: true },
      { name: "label", label: "Badge label", kind: "text", required: true },
      {
        name: "tone",
        label: "Tone",
        kind: "select",
        options: [
          { value: "update", label: "Legal update" },
          { value: "alert", label: "Alert" },
          { value: "live", label: "Live" },
          { value: "business", label: "Business" },
          { value: "notice", label: "Public notice" },
        ],
      },
      {
        name: "href",
        label: "Links to",
        kind: "text",
        required: true,
        help: "Where the headline takes a reader who clicks it, e.g. /law-and-society/cama-amendment. A ticker headline is always a link - it is a pointer to the story, not the story itself.",
      },
      // `publishedAt` was removed: the ticker renders headline, badge and tone
      // (components/site/update-ticker.tsx) and orders by position, so a date
      // entered here was never shown to anyone and never sorted anything.
    ],
  },
  {
    id: "articles",
    label: "Articles",
    singular: "Article",
    description:
      "Law & Society coverage. Every item is labelled as news, analysis, explainer, opinion or educational.",
    icon: "newspaper",
    appearsOn: "Law & Society (/law-and-society), and the latest strip on the homepage.",
    section: "news",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "standfirst", label: "Standfirst", kind: "textarea", required: true },
      {
        name: "kind",
        label: "Content type",
        kind: "select",
        options: [
          { value: "news", label: "News" },
          { value: "analysis", label: "Analysis" },
          { value: "explainer", label: "Legal explainer" },
          { value: "opinion", label: "Opinion" },
          { value: "educational", label: "Educational" },
        ],
        help: "Readers must always be able to tell reporting from explanation.",
      },
      { name: "category", label: "Category", kind: "text" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "readingMinutes", label: "Reading minutes", kind: "number" },
      { name: "publishedAt", label: "Published", kind: "date" },
      { name: "image", label: "Lead image", kind: "image" },
      { name: "audiences", label: "Audiences", kind: "list", group: BODY_GROUP, help: "One of citizens, business, professionals, learners or viewers per line." },
      {
        name: "body",
        label: "The piece",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a section",
        help: "The article itself, section by section. Leave a blank line between paragraphs. An article with no sections publishes as its standfirst alone, which is the honest state for one that has not been written out yet.",
        columns: [
          { name: "heading", label: "Section heading" },
          { name: "paragraphs", label: "Paragraphs", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "rights",
    label: "Rights guides",
    singular: "Rights guide",
    description:
      "Situation-first guides in Your Rights.",
    icon: "scale",
    appearsOn: "Your Rights (/your-rights), and the homepage.",
    section: "your-rights",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "situation", label: "Situation", kind: "text", required: true },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "category", label: "Category", kind: "text" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "protects", label: "What the law protects", kind: "list", group: BODY_GROUP, help: "What the law actually protects in this situation. One per line." },
      { name: "doNow", label: "Do now", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "avoid", label: "Avoid", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whenToSeeALawyer", label: "When to see a lawyer", kind: "list", group: BODY_GROUP, help: "One per line." },
      {
        name: "steps",
        label: "Steps through the situation",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a step",
        columns: [
          { name: "title", label: "Step" },
          { name: "body", label: "What to do", multiline: true },
        ],
      },
      {
        name: "misconceptions",
        label: "Common misconceptions",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a misconception",
        help: "State the belief plainly and then correct it. Never leave the belief standing on its own.",
        columns: [
          { name: "myth", label: "What people believe", multiline: true },
          { name: "reality", label: "What is actually so", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "laws",
    label: "Law categories",
    singular: "Law category",
    description: "Top-level subject areas in the legal library.",
    icon: "landmark",
    appearsOn: "The subject areas on Know the Law (/know-the-law).",
    section: "know-the-law",
    hasReviewMeta: false,
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "blurb", label: "Blurb", kind: "textarea", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "name" },
      { name: "icon", label: "Icon", kind: "text" },
    ],
  },
  {
    id: "cases",
    label: "Case law",
    singular: "Case",
    description:
      "Decided cases in the explorer. No citation or judge field exists by design - see lib/content/case-law.ts.",
    icon: "gavel",
    appearsOn: "The case law explorer (/cases).",
    section: "know-the-law",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Case name", kind: "text", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      {
        name: "court",
        label: "Court",
        kind: "select",
        options: [
          { value: "supreme-court", label: "Supreme Court of Nigeria" },
          { value: "court-of-appeal", label: "Court of Appeal" },
          { value: "federal-high-court", label: "Federal High Court" },
          { value: "state-high-court", label: "State / FCT High Court" },
          {
            value: "national-industrial-court",
            label: "National Industrial Court",
          },
          { value: "tribunal", label: "Tribunal" },
        ],
        required: true,
      },
      { name: "year", label: "Year", kind: "number", required: true },
      { name: "subject", label: "Law subject it belongs to", kind: "text", group: WIRING_GROUP, help: "The internal name of a subject area on Know the Law, e.g. 'criminal-law'. It files the case under that subject." },
      { name: "issueTag", label: "Legal issue filter", kind: "text", group: WIRING_GROUP, help: "The wording of one of the filter buttons on the case explorer. Type it exactly as it appears there, or the case will not show under any filter." },
      { name: "legalIssue", label: "The question decided", kind: "textarea" },
      { name: "keyPrinciple", label: "Key principle", kind: "textarea" },
      {
        name: "standing",
        label: "Standing today",
        kind: "select",
        options: [
          { value: "followed", label: "Followed" },
          { value: "distinguished", label: "Distinguished since" },
          { value: "overtaken-by-statute", label: "Overtaken by statute" },
          { value: "position-not-stated", label: "Not stated" },
        ],
      },
      {
        name: "whereToFindIt",
        label: "Where to find the judgment",
        kind: "textarea",
        help: "How to locate the reported decision. Never a citation reproduced from memory.",
      },
      {
        name: "background",
        label: "Background",
        kind: "list",
        group: BODY_GROUP,
        required: true,
        help: "What the dispute was about. One paragraph per line.",
      },
      {
        name: "decision",
        label: "Decision",
        kind: "list",
        group: BODY_GROUP,
        required: true,
        help: "What the court decided. One paragraph per line.",
      },
      {
        name: "plainLanguage",
        label: "In plain language",
        kind: "list",
        group: BODY_GROUP,
        required: true,
        help: "What it means for an ordinary reader. One paragraph per line.",
      },
      {
        name: "doesNotSettle",
        label: "What this does not settle",
        kind: "list",
        group: BODY_GROUP,
        required: true,
        help: "Required on every case: the limits of the holding, one per line. A case read as deciding more than it did is how bad advice starts.",
      },
      {
        name: "instruments",
        label: "Instruments relied on",
        kind: "list",
        group: BODY_GROUP,
        help: "Named generally, one per line. Never a citation reproduced from memory.",
      },
      ...editorialFields,
    ],
  },
  {
    id: "law-histories",
    label: "Law versions",
    singular: "Version history",
    description:
      "Amendment tracking. Effective dates are years, never commencement dates.",
    icon: "clock",
    appearsOn: "The amendment tracker (/know-the-law/amendments).",
    section: "know-the-law",
    hasReviewMeta: true,
    fields: [
      { name: "instrument", label: "Instrument", kind: "text", required: true },
      { name: "lawSlug", label: "Law entry it tracks", kind: "text", required: true, group: WIRING_GROUP, help: "The internal name of the law this history belongs to." },
      { name: "category", label: "Law subject it sits under", kind: "text", required: true, group: WIRING_GROUP, help: "The internal name of a subject area on Know the Law." },
      { name: "topic", label: "Alert topic", kind: "text", group: WIRING_GROUP, help: "The internal name of the alert topic readers subscribe to for this instrument. Leave empty if there is none." },
      { name: "versionCount", label: "Versions on record", kind: "number" },
      { name: "current", label: "Currently in force", kind: "text" },
      {
        name: "whereToFindIt",
        label: "Where the current text lives",
        kind: "textarea",
      },
      ...editorialFields,
    ],
  },
  {
    id: "business-guides",
    label: "Business guides",
    singular: "Business guide",
    description: "Before You Do This guides for business decision points.",
    icon: "briefcase",
    appearsOn: "Before You Do This (/business/guides).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "situation", label: "Situation", kind: "text", required: true },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "area", label: "Area", kind: "text" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "checklistCount", label: "Checklist items", kind: "number" },
      { name: "context", label: "Context", kind: "list", group: BODY_GROUP, help: "Paragraphs framing the decision. One paragraph per line." },
      { name: "commonMistakes", label: "Common mistakes", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "redFlags", label: "Red flags", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whenToInvolveALawyer", label: "When to involve a lawyer", kind: "list", group: BODY_GROUP, help: "One per line." },
      {
        name: "keyConsiderations",
        label: "Key considerations",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a consideration",
        columns: [
          { name: "heading", label: "Consideration" },
          { name: "body", label: "Why it matters", multiline: true },
          { name: "instrument", label: "Instrument it sits under" },
        ],
      },
      {
        name: "checklist",
        label: "Checklist",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a checklist step",
        columns: [
          { name: "label", label: "Step" },
          { name: "detail", label: "Detail", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "media",
    label: "Watch, Listen & Live",
    singular: "Media item",
    description: "Videos, podcast episodes and live events.",
    icon: "video",
    appearsOn: "Watch (/watch), Listen (/listen) or Live (/live) — the Format field below decides which of the three it appears on.",
    section: "watch-listen",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea", required: true },
      {
        name: "kind",
        label: "Format",
        kind: "select",
        options: [
          { value: "video", label: "Video" },
          { value: "podcast", label: "Podcast" },
          { value: "live", label: "Live event" },
        ],
      },
      {
        name: "format",
        label: "Editorial format",
        kind: "select",
        help: "What the item is. The format decides how it is labelled; the format above decides which hub it lives on.",
        options: [
          { value: "explainer", label: "Explainer" },
          { value: "interview", label: "Interview" },
          { value: "documentary", label: "Documentary" },
          { value: "webinar", label: "Webinar" },
          { value: "short", label: "Short" },
          { value: "broadcast", label: "Broadcast" },
          { value: "episode", label: "Episode" },
          { value: "audio-explainer", label: "Audio explainer" },
          { value: "live-session", label: "Live session" },
        ],
      },
      {
        name: "series",
        label: "Series",
        kind: "text",
        group: PLACEMENT_GROUP,
        help: "The series title, exactly as it is spelt on the series record. Leave empty for a one-off - items with no series still publish, they simply have no strand page above them.",
      },
      {
        name: "seriesSlug",
        label: "Series slug",
        kind: "text",
        derivedFrom: "series",
      },
      { name: "host", label: "Host", kind: "text", group: PLACEMENT_GROUP },
      { name: "duration", label: "Duration", kind: "text", group: PLACEMENT_GROUP },
      { name: "season", label: "Season", kind: "number", group: PLACEMENT_GROUP, help: "Leave empty for a one-off, or for a series that does not run in seasons." },
      { name: "episode", label: "Episode", kind: "number", group: PLACEMENT_GROUP, help: "Position within the season. It orders the season on the series page." },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "publishedAt", label: "Published", kind: "date" },
      {
        name: "fileUrl",
        label: "Video or audio file",
        kind: "video",
        group: FILE_GROUP,
        help: "Uploaded to Cloudinary and streamed from there. Leave empty for an item that has not been released yet — the page renders an honest 'not yet available' stage rather than a player that does nothing.",
      },
      {
        name: "posterUrl",
        label: "Poster image",
        kind: "image",
        group: FILE_GROUP,
        help: "Optional. Without one, the poster is taken from the first frame of the video.",
      },
      {
        name: "captionsUrl",
        label: "Captions (WebVTT)",
        kind: "text",
        group: FILE_GROUP,
        help: "Editorial policy: video is not published without captions.",
      },
      { name: "topics", label: "Topics", kind: "list", group: BODY_GROUP, help: "One per line. These are the topic filters on Watch and Listen." },
      { name: "takeaways", label: "Takeaways", kind: "list", group: BODY_GROUP, help: "What a viewer or listener leaves knowing. One per line." },
      {
        name: "contributors",
        label: "Contributors",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a contributor",
        help: "Never credit a practitioner who did not take part, and never write a biography you cannot support.",
        columns: [
          { name: "name", label: "Name" },
          { name: "role", label: "Role" },
          { name: "bio", label: "Biography", multiline: true },
        ],
      },
      {
        name: "chapters",
        label: "Chapters",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a chapter",
        help: "Lets a reader jump into the middle of a long item. Start times are in seconds from the beginning.",
        columns: [
          { name: "startSeconds", label: "Starts at (seconds)" },
          { name: "title", label: "Title" },
          { name: "summary", label: "Summary", multiline: true },
        ],
      },
      {
        name: "transcriptStatus",
        label: "Transcript",
        kind: "select",
        group: BODY_GROUP,
        options: [
          { value: "published", label: "Published" },
          { value: "in-progress", label: "Being written" },
          { value: "unavailable", label: "Not available" },
        ],
        help: "Set this to Published only when the cues below are actually complete - the page tells readers which of the three is true.",
      },
      {
        name: "transcriptCues",
        label: "Transcript cues",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a cue",
        columns: [
          { name: "startSeconds", label: "Starts at (seconds)" },
          { name: "speaker", label: "Speaker" },
          { name: "text", label: "What was said", multiline: true },
        ],
      },
      {
        name: "liveStatus",
        label: "Live status",
        kind: "select",
        group: PLACEMENT_GROUP,
        options: [
          { value: "scheduled", label: "Upcoming" },
          { value: "live", label: "On air now" },
          { value: "ended", label: "Ended" },
        ],
        help: "Only meaningful on a live session. It orders the schedule: on air first, then upcoming, then the archive.",
      },
      { name: "scheduledFor", label: "Scheduled for", kind: "text", group: PLACEMENT_GROUP, help: "When an upcoming live session starts. Upcoming sessions are listed soonest first." },
      {
        name: "agenda",
        label: "Running order",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a slot",
        help: "Label each slot relative to the start - First 10 minutes - rather than by clock time, which the platform cannot promise.",
        columns: [
          { name: "label", label: "When" },
          { name: "title", label: "Title" },
          { name: "detail", label: "Detail", multiline: true },
        ],
      },
      { name: "questionPolicy", label: "How questions are handled", kind: "textarea", group: BODY_GROUP },
      { name: "registration", label: "How to attend", kind: "textarea", group: BODY_GROUP },
      { name: "archivePolicy", label: "What happens after", kind: "textarea", group: BODY_GROUP, help: "What becomes of the stream once it ends." },
      { name: "trending", label: "Show as trending", kind: "select", group: PLACEMENT_GROUP, options: [{ value: "", label: "No" }, { value: "yes", label: "Yes" }], help: "Editorial, not measured - the platform shows no view or listen counts." },
      { name: "featured", label: "Feature on the hub", kind: "select", group: PLACEMENT_GROUP, options: [{ value: "", label: "No" }, { value: "yes", label: "Yes" }] },
      relatedField,
      ...editorialFields,
    ],
  },
  {
    id: "media-series",
    label: "Series",
    singular: "Series",
    description: "Programmes and podcast shows that episodes belong to.",
    icon: "folder",
    appearsOn: "The series strip on Watch or Listen, plus a page of its own. A live strand is listed on the schedule at /live instead.",
    section: "watch-listen",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "tagline", label: "Tagline", kind: "text", required: true },
      {
        name: "description",
        label: "Description",
        kind: "textarea",
        required: true,
      },
      {
        name: "kind",
        label: "Hub",
        kind: "select",
        help: "Which hub the series is listed under. Live strands have no series page of their own — the schedule at /live is their index.",
        options: [
          { value: "video", label: "Watch" },
          { value: "podcast", label: "Listen" },
          { value: "live", label: "Live" },
        ],
      },
      {
        name: "cadence",
        label: "Cadence",
        kind: "text",
        help: "How often it lands, in words. Do not promise a publication date the desk cannot keep.",
      },
      { name: "host", label: "Host", kind: "text" },
      { name: "icon", label: "Icon", kind: "text" },
      {
        name: "artwork",
        label: "Series artwork",
        kind: "image",
        help: "Optional. The icon above is the fallback, so a strand without artwork still renders.",
      },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      {
        name: "seasons",
        label: "Seasons",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a season",
        help: "Only for a series that actually runs in seasons. Items are grouped under these by their own season number; anything outside a season listed here still appears, under 'Also in this series'.",
        columns: [
          { name: "number", label: "Season number" },
          { name: "title", label: "Title" },
          { name: "summary", label: "Summary", multiline: true },
        ],
      },
      relatedField,
      ...editorialFields,
    ],
  },
  {
    id: "glossary",
    label: "Glossary",
    singular: "Glossary term",
    description: "Law in Plain Language entries.",
    icon: "book-open",
    appearsOn: "The plain language glossary (/glossary).",
    section: "know-the-law",
    hasReviewMeta: true,
    fields: [
      { name: "term", label: "Term", kind: "text", required: true },
      { name: "definition", label: "Definition", kind: "textarea", required: true },
      { name: "example", label: "Example", kind: "textarea" },
      { name: "whyItMatters", label: "Why it matters", kind: "textarea" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "term" },
      { name: "alsoKnownAs", label: "Also known as", kind: "list", group: BODY_GROUP, help: "Other wording a reader may meet for the same idea. One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "quizzes",
    label: "Quizzes",
    singular: "Quiz",
    description: "Interactive learning assessments.",
    icon: "graduation-cap",
    appearsOn: "Quizzes (/quizzes).",
    section: "learn",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea", required: true },
      {
        name: "level",
        label: "Level",
        kind: "select",
        options: [
          { value: "starter", label: "Starter" },
          { value: "core", label: "Core" },
          { value: "advanced", label: "Advanced" },
        ],
      },
      { name: "questionCount", label: "Questions", kind: "number", locked: true, help: "Counted from the questions below, never typed." },
      { name: "minutes", label: "Minutes", kind: "number" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      {
        name: "questions",
        label: "The questions",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a question",
        help: "Number the right answer from 1, counting down the options as you have written them. Always explain why it is right - a quiz that only marks an answer wrong teaches nothing.",
        columns: [
          { name: "prompt", label: "Question", multiline: true },
          { name: "options", label: "Options", multiline: true, help: "One per line." },
          { name: "answer", label: "Right answer", help: "1 for the first option, 2 for the second, and so on." },
          { name: "explanation", label: "Why", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "checklists",
    label: "Checklists",
    singular: "Checklist",
    description: "Printable checklists in the resource centre.",
    icon: "list-checks",
    appearsOn: "The resource centre (/resources).",
    section: "learn",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea", required: true },
      { name: "itemCount", label: "Items", kind: "number" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      {
        name: "audience",
        label: "Audience",
        kind: "select",
        options: [
          { value: "citizens", label: "Citizens" },
          { value: "business", label: "Business" },
          { value: "professionals", label: "Professionals" },
          { value: "learners", label: "Learners" },
          { value: "viewers", label: "Viewers" },
        ],
        help: "Who the checklist is written for. Drives the audience filter in the resource centre.",
      },
      {
        name: "items",
        label: "The checklist",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a line",
        help: "Lines sharing a stage are grouped under it on the page, in the order below.",
        columns: [
          { name: "group", label: "Stage" },
          { name: "label", label: "Line" },
          { name: "detail", label: "Detail", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "compliance-topics",
    label: "Compliance topics",
    singular: "Compliance topic",
    description: "Company Compliance Centre areas of ongoing obligation.",
    icon: "list-checks",
    appearsOn: "The Company Compliance Centre (/business/compliance).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "areaId", label: "Compliance area", kind: "text", required: true, group: WIRING_GROUP, help: "The internal name of the compliance area this topic covers. The same name ties it to the Business Legal Health Check and the compliance calendar, so a typo here quietly detaches all three." },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "whatItCovers", label: "What it covers", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "appliesWhen", label: "Applies when", kind: "list", group: BODY_GROUP, help: "Circumstances that make the topic relevant - never a definitive test. One per line." },
      { name: "goodPractice", label: "Good practice", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "commonGaps", label: "Common gaps", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whenToInvolveALawyer", label: "When to involve a lawyer", kind: "list", group: BODY_GROUP, help: "One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "contracts",
    label: "Contract types",
    singular: "Contract type",
    description: "Contract Knowledge Centre explainers. Educational only - never templates.",
    icon: "signature",
    appearsOn: "The Contract Knowledge Centre (/business/contracts).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "family", label: "Family", kind: "text", required: true },
      { name: "whatItIs", label: "What it is", kind: "textarea", required: true },
      { name: "whyItMatters", label: "Why it matters", kind: "textarea", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "name" },
      { name: "commonlyUsedWhen", label: "Commonly used when", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "commonMistakes", label: "Common mistakes", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "warningSigns", label: "Warning signs", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whenLegalReviewIsAppropriate", label: "When legal review is appropriate", kind: "list", group: BODY_GROUP, help: "One per line." },
      {
        name: "importantClauses",
        label: "Clauses that decide how it behaves",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a clause",
        help: "What to look at in the wording. Never model wording of our own.",
        columns: [
          { name: "name", label: "Clause" },
          { name: "purpose", label: "What it is for", multiline: true },
          { name: "whatToCheck", label: "What to check in the wording", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "industries",
    label: "Industry hubs",
    singular: "Industry hub",
    description: "Sector hubs and the regulatory themes attached to each.",
    icon: "hard-hat",
    appearsOn: "Industry hubs (/business/industries).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "blurb", label: "Blurb", kind: "textarea", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "name" },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "overview", label: "Overview", kind: "list", group: BODY_GROUP, help: "Why the industry's legal profile differs from the general case. One paragraph per line." },
      { name: "regulatoryThemes", label: "Regulatory themes", kind: "list", group: BODY_GROUP, help: "In general terms. Never an invented licensing regime. One per line." },
      { name: "complianceTopics", label: "Compliance topic slugs", kind: "list", group: BODY_GROUP, help: "Slugs of compliance topics that apply to the sector. One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "ceo-briefings",
    label: "CEO briefings",
    singular: "CEO briefing",
    description: "Law for CEOs - short strategic briefings for decision-makers.",
    icon: "trending-up",
    appearsOn: "Law for CEOs (/business/ceo).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "question", label: "Strategic question", kind: "text", required: true },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "readingMinutes", label: "Reading minutes", kind: "number" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "keyPoints", label: "Key points", kind: "list", group: BODY_GROUP, help: "The three to five points an executive needs. One per line." },
      { name: "questionsForTheBoard", label: "Questions for the board", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whereRiskLands", label: "Where risk lands", kind: "list", group: BODY_GROUP, help: "One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "regulatory-updates",
    label: "Regulatory Watch",
    singular: "Regulatory update",
    description: "Law and regulation changes. Reporting and explanation are stored separately and must stay separate.",
    icon: "bell",
    appearsOn: "Regulatory Watch (/business/regulatory-watch).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "topic", label: "Alert topic", kind: "text", required: true, help: "Must match an AlertTopic slug so readers can follow it." },
      { name: "effectiveFrom", label: "When it takes effect", kind: "textarea", required: true, help: "Describe the position in words. Never state a commencement date that has not been verified against the instrument." },
      { name: "guidanceNote", label: "Guidance note", kind: "textarea" },
      { name: "publishedAt", label: "Published", kind: "date" },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "report", label: "What changed", kind: "list", group: BODY_GROUP, help: "Neutral reporting only. Explanation goes in the field below. One paragraph per line." },
      { name: "explanation", label: "What it means", kind: "list", group: BODY_GROUP, help: "Our explanation, kept visibly separate from the reporting above. One paragraph per line." },
      { name: "whoIsAffected", label: "Who is affected", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "businessConsiderations", label: "Business considerations", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "individualConsiderations", label: "Individual considerations", kind: "list", group: BODY_GROUP, help: "One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "legal-problems",
    label: "Problem pathways",
    singular: "Problem pathway",
    description:
      "I have a legal problem. Each pathway explains a situation - it must never assess a reader's legal position or predict an outcome.",
    icon: "list-checks",
    appearsOn: "I have a legal problem (/legal-help/problem).",
    section: "legal-help",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true, help: "Situation-first, in the reader's words: 'The police have stopped or are questioning you'." },
      { name: "situation", label: "The moment", kind: "text", required: true },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "category", label: "Category", kind: "text", required: true, help: "Groups the pathway in the chooser. Reuse an existing category rather than inventing one." },
      {
        name: "urgency",
        label: "How fast the situation moves",
        kind: "select",
        options: [
          { value: "immediate", label: "Usually moves fast" },
          { value: "time-sensitive", label: "Time matters" },
          { value: "considered", label: "Take it in order" },
        ],
        help: "This describes the situation, never the seriousness of anyone's legal position.",
      },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "rightsInThisSituation", label: "Rights in this situation", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "doNow", label: "Do now", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "avoid", label: "Avoid", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whenToGetHelp", label: "When to get help", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "referralRoutes", label: "Referral route slugs", kind: "list", group: BODY_GROUP, help: "Slugs of the referral routes this pathway points to. One per line." },
      {
        name: "steps",
        label: "Steps through the pathway",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a step",
        columns: [
          { name: "title", label: "Step" },
          { name: "body", label: "What happens", multiline: true },
        ],
      },
      ...editorialFields,
    ],
  },
  {
    id: "referral-routes",
    label: "Referral routes",
    singular: "Referral route",
    description:
      "Where a legal problem can actually go. Real institutions only, described generally - no addresses, telephone numbers, fees or eligibility thresholds.",
    icon: "scale",
    appearsOn: "Where to get help (/legal-help/legal-aid).",
    section: "legal-help",
    hasReviewMeta: true,
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      {
        name: "kind",
        label: "Kind",
        kind: "select",
        options: [
          { value: "legal-aid", label: "Legal aid" },
          { value: "professional-body", label: "Professional body" },
          { value: "public-institution", label: "Public institution" },
          { value: "civil-society", label: "Civil society" },
          { value: "law-clinic", label: "Law clinic" },
        ],
      },
      { name: "whatItIs", label: "What it is", kind: "textarea", required: true },
      { name: "howToFind", label: "How to find it", kind: "textarea", required: true, help: "Where the reader confirms current details. Never publish an address or telephone number we cannot keep current." },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "name" },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "whoItIsFor", label: "Who it is for", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "howItTypicallyWorks", label: "How it typically works", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "whatToBring", label: "What to bring", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "limits", label: "Limits", kind: "list", group: BODY_GROUP, help: "What this route does not do. Every route has limits. One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "lawyer-listings",
    label: "Directory listings",
    singular: "Directory listing",
    description:
      "The lawyer directory. A listing may only leave 'Sample' once verification has actually confirmed the practitioner - never on the strength of what they told us.",
    icon: "users",
    appearsOn: "The lawyer directory (/lawyers).",
    section: "legal-help",
    hasReviewMeta: true,
    fields: [
      { name: "displayName", label: "Display name", kind: "text", required: true, help: "While the listing is a sample this is a practice and a location, never a person's name." },
      {
        name: "listingStatus",
        label: "Verification status",
        kind: "select",
        options: [
          { value: "sample", label: "Sample listing" },
          { value: "pending-verification", label: "Pending verification" },
          { value: "verified", label: "Verified" },
        ],
        help: "Set 'Verified' only after enrolment and current standing have been confirmed through the administrative process.",
      },
      { name: "focus", label: "Focus", kind: "text", required: true },
      { name: "state", label: "State", kind: "text", required: true },
      { name: "city", label: "City", kind: "text", required: true },
      {
        name: "availability",
        label: "Availability",
        kind: "select",
        options: [
          { value: "accepting", label: "Accepting enquiries" },
          { value: "waitlist", label: "Waiting list" },
          { value: "not-accepting", label: "Not accepting" },
        ],
      },
      {
        name: "experienceBand",
        label: "Experience",
        kind: "select",
        options: [
          { value: "1-5", label: "1-5 years" },
          { value: "6-10", label: "6-10 years" },
          { value: "11-20", label: "11-20 years" },
          { value: "20+", label: "Over 20 years" },
        ],
      },
      { name: "consultation", label: "Consultation", kind: "textarea", help: "How an approach is handled. Never a fee." },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "displayName" },
      { name: "practiceAreas", label: "Practice areas", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "languages", label: "Languages", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "about", label: "About", kind: "list", group: BODY_GROUP, help: "One paragraph per line. Never a claim we have not verified." },
      { name: "credentials", label: "Credentials", kind: "list", group: BODY_GROUP, help: "Leave empty until a named practitioner has been verified. One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "questions",
    label: "Public questions",
    singular: "Public question",
    description:
      "Ask a Question. Publishing is an editorial act: strip anything identifying, answer as general information, and never attribute anything to a practitioner who did not write it.",
    icon: "circle-question",
    appearsOn: "Ask a Question (/ask).",
    section: "legal-help",
    hasReviewMeta: true,
    fields: [
      { name: "question", label: "Question", kind: "textarea", required: true, help: "Rewrite for privacy before publishing. No names, locations below state level, case numbers or identifying detail." },
      { name: "askedBy", label: "Attribution", kind: "text", required: true, help: "Pseudonymous, e.g. 'Anonymous · Lagos'. Never a real name." },
      { name: "topic", label: "Topic", kind: "text", required: true },
      { name: "askedOn", label: "Asked", kind: "date" },
      { name: "lawyerNote", label: "Practitioner's note", kind: "textarea", help: "Leave empty unless a named legal practitioner actually wrote it." },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "question" },
      { name: "generalAnswer", label: "General answer", kind: "list", group: BODY_GROUP, help: "General legal information, written by the editorial desk. One paragraph per line." },
      { name: "whatTheLawSays", label: "What the law says", kind: "list", group: BODY_GROUP, help: "What the named instruments say, in general terms. One paragraph per line." },
      { name: "whatToDoNext", label: "What to do next", kind: "list", group: BODY_GROUP, help: "One per line." },
      ...editorialFields,
    ],
  },
  {
    id: "law-entries",
    label: "Law entries",
    singular: "Law entry",
    description:
      "The explainers themselves - one per instrument, filed under a law category. This is the body of Know the Law; the Law categories collection holds only the subject headings above these.",
    icon: "book-open",
    appearsOn: "Know the Law (/know-the-law/<category>/<slug>).",
    section: "know-the-law",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "instrument", label: "Instrument", kind: "text", required: true, help: "The Act, regulation or section this explains, named exactly as it is cited. Never paraphrase the name." },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "covers", label: "What it covers", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "affects", label: "Who it affects", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "explanation", label: "In plain language", kind: "list", group: BODY_GROUP, help: "One paragraph per line." },
      {
        name: "provisions",
        label: "Key provisions",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a provision",
        help: "Never cite a section you have not read. An unverified citation is worse than no citation.",
        columns: [
          { name: "heading", label: "Heading" },
          { name: "citation", label: "Citation", help: "e.g. Constitution 1999, s. 35." },
          { name: "plainLanguage", label: "What it means", multiline: true },
        ],
      },
      {
        name: "examples",
        label: "Worked examples",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add an example",
        columns: [
          { name: "situation", label: "Situation", multiline: true },
          { name: "outcome", label: "What the law means for it", multiline: true },
        ],
      },
      { name: "shouldDo", label: "What you should do", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "shouldNotDo", label: "What you should not do", kind: "list", group: BODY_GROUP, help: "One per line." },
      {
        name: "misconceptions",
        label: "Common misconceptions",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add a misconception",
        help: "State the belief plainly and then correct it. Never leave the belief standing on its own.",
        columns: [
          { name: "myth", label: "What people believe", multiline: true },
          { name: "reality", label: "What is actually so", multiline: true },
        ],
      },
      { name: "whenToSeeALawyer", label: "When to see a lawyer", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "amendmentNote", label: "Amendment note", kind: "textarea", group: BODY_GROUP, help: "Whether the instrument has been amended or consolidated, in general terms. Leave empty unless it is known." },
      { name: "category", label: "Law category", kind: "text", required: true, group: WIRING_GROUP, help: "The slug of the law category this is filed under. It must match one in Law categories, or the entry appears under no subject." },
      relatedField,
      ...editorialFields,
    ],
  },
  {
    id: "safety-guides",
    label: "Stay Safe guides",
    singular: "Stay Safe guide",
    description:
      "Guides that catch a reader at the moment of exposure - the contract in front of them, the call they have just taken.",
    icon: "shield-check",
    appearsOn: "Stay Safe (/stay-safe).",
    section: "your-rights",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "risk", label: "The moment", kind: "text", required: true, help: "The moment of exposure, written as the reader is living it: You are handed a tenancy agreement." },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      { name: "area", label: "Area", kind: "text", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true, derivedFrom: "title" },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "whatToLookFor", label: "What to look for", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "redFlags", label: "Red flags", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "questionsToAsk", label: "Questions to ask", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "stopAndGetHelp", label: "Stop and get help", kind: "list", group: BODY_GROUP, help: "The points at which a reader should stop and get a lawyer. One per line." },
      { name: "series", label: "Series", kind: "text", group: PLACEMENT_GROUP, help: "Groups this guide with others on the Stay Safe index. Leave empty if it stands alone." },
      relatedField,
      ...editorialFields,
    ],
  },
  {
    id: "constitution-chapters",
    label: "Constitution chapters",
    singular: "Constitution chapter",
    description:
      "The chapters of the 1999 Constitution, as the Constitution itself numbers them. These are the map above the sections.",
    icon: "landmark",
    appearsOn: "The Constitution explorer (/constitution).",
    section: "know-the-law",
    hasReviewMeta: false,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "numeral", label: "Chapter number", kind: "text", required: true, locked: true, help: "The Roman numeral the Constitution uses, e.g. IV. It is also this chapter's web address, so it is not a free choice." },
      { name: "summary", label: "Summary", kind: "textarea", required: true, help: "What the chapter is for, in a sentence." },
      { name: "covers", label: "What it deals with", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "href", label: "Where to go next", kind: "text", group: PLACEMENT_GROUP, help: "A route on this platform a reader can follow from this chapter, e.g. /your-rights. Leave empty if there is nowhere to send them." },
      { name: "hrefLabel", label: "Link label", kind: "text", group: PLACEMENT_GROUP },
    ],
  },
  {
    id: "constitution-sections",
    label: "Constitution sections",
    singular: "Constitution section",
    description:
      "Individual sections, restated in plain language. The restatement is ours; the section is not - never reword what the Constitution actually says into something it does not say.",
    icon: "scroll-text",
    appearsOn: "The Constitution explorer (/constitution/<chapter>).",
    section: "know-the-law",
    hasReviewMeta: false,
    fields: [
      { name: "heading", label: "Heading", kind: "text", required: true },
      { name: "number", label: "Section number", kind: "text", required: true, locked: true, help: "As the Constitution numbers it, e.g. 35. Other records cross-reference sections by this number." },
      { name: "plainLanguage", label: "In plain language", kind: "textarea", required: true },
      { name: "qualifications", label: "Qualifications", kind: "list", group: BODY_GROUP, help: "The limits and exceptions the Constitution itself attaches, in general terms. One per line. Omitting these makes a right look wider than it is." },
      { name: "chapter", label: "Chapter", kind: "text", required: true, group: WIRING_GROUP, help: "The Roman numeral of the chapter this section sits in. It must match a Constitution chapter." },
      relatedField,
    ],
  },
  {
    id: "courts",
    label: "Courts",
    singular: "Court",
    description:
      "The court hierarchy. It drives the ladder on a case page and the court filter in the explorer, so a court removed here disappears from both.",
    icon: "gavel",
    appearsOn: "The Case Law Explorer (/cases) and every case page.",
    section: "know-the-law",
    hasReviewMeta: false,
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "courtId", label: "Internal id", kind: "text", required: true, locked: true, help: "The identity cases refer to this court by. Changing it would detach every case filed under it." },
      { name: "rank", label: "Rank", kind: "number", required: true, help: "Where it sits in the hierarchy. 0 is the final court, and the numbers order the ladder." },
      { name: "jurisdiction", label: "Jurisdiction", kind: "textarea", required: true, help: "What this court decides." },
      { name: "bindingEffect", label: "Binding effect", kind: "textarea", required: true, help: "Whose decisions this court binds." },
    ],
  },
  {
    id: "alert-topics",
    label: "Alert topics",
    singular: "Alert topic",
    description:
      "The subjects a reader can follow to be told when the law changes. A follow is stored against the topic slug, so changing a slug detaches everyone already following it.",
    icon: "bell",
    appearsOn: "Topic following, and the notification preferences in an account.",
    section: "business",
    hasReviewMeta: false,
    fields: [
      { name: "label", label: "Label", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea", required: true },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "slug", label: "Slug", kind: "text", required: true, locked: true, help: "What existing follows are recorded against. It cannot change once readers are following the topic." },
    ],
  },
  {
    id: "calendar-entries",
    label: "Legal calendar",
    singular: "Calendar entry",
    description:
      "Recurring legal obligations, described by what starts the clock rather than by a date. Never write a specific deadline here: the platform maintains no deadline source, and an out-of-date date is worse than none.",
    icon: "calendar-days",
    appearsOn: "The business legal calendar (/business/legal-calendar).",
    section: "business",
    hasReviewMeta: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "trigger", label: "What starts the clock", kind: "text", required: true, help: "e.g. Your company's financial year end." },
      { name: "timing", label: "Timing", kind: "text", required: true, help: "In general terms, e.g. within 42 days of the year end. Never an invented calendar date." },
      { name: "summary", label: "Summary", kind: "textarea", required: true },
      {
        name: "cadence",
        label: "Cadence",
        kind: "select",
        options: [
          { value: "annual", label: "Annual" },
          { value: "quarterly", label: "Quarterly" },
          { value: "monthly", label: "Monthly" },
          { value: "ongoing", label: "Ongoing" },
          { value: "event-driven", label: "Event-driven" },
        ],
      },
      { name: "icon", label: "Icon", kind: "text" },
      { name: "whatToPrepare", label: "What to prepare", kind: "list", group: BODY_GROUP, help: "One per line." },
      { name: "areaId", label: "Compliance area", kind: "text", required: true, group: WIRING_GROUP, help: "The id of the compliance area this belongs to. A value matching no area detaches the entry from the health check." },
      ...editorialFields,
    ],
  },
  {
    id: "health-check",
    label: "Health check questions",
    singular: "Health check question",
    description:
      "The questions in the business legal health check. Each one belongs to a compliance area, and the answers are scored by area.",
    icon: "stethoscope",
    appearsOn: "The legal health check (/business/health-check).",
    section: "business",
    hasReviewMeta: false,
    fields: [
      { name: "prompt", label: "Question", kind: "textarea", required: true, help: "Write it so that yes always means the business is in the better position. A question that scores the other way inverts the result." },
      { name: "help", label: "Help text", kind: "textarea", help: "Shown under the question, for a reader who is not sure what it is asking." },
      { name: "areaId", label: "Compliance area", kind: "text", required: true, group: WIRING_GROUP, help: "The id of the compliance area this question scores. A value matching no area means the answer is scored against nothing." },
    ],
  },
  {
    id: "profile-questions",
    label: "Business profile questions",
    singular: "Profile question",
    description:
      "The questions that build a business profile. Each answer switches on the compliance areas it makes relevant, which is what tailors the rest of the Business section.",
    icon: "clipboard-list",
    appearsOn: "The business profile (/business-account) and the compliance centre.",
    section: "business",
    hasReviewMeta: false,
    fields: [
      { name: "label", label: "Question", kind: "text", required: true },
      { name: "help", label: "Help text", kind: "textarea" },
      {
        name: "kind",
        label: "Answer style",
        kind: "select",
        options: [
          { value: "single", label: "Choose one" },
          { value: "boolean", label: "Yes or no" },
        ],
      },
      {
        name: "options",
        label: "Answers",
        kind: "rows",
        group: BODY_GROUP,
        addLabel: "Add an answer",
        help: "Each answer turns on the compliance areas listed against it. Leave the areas empty for an answer that makes nothing extra relevant.",
        columns: [
          { name: "label", label: "Answer" },
          { name: "value", label: "Stored value", help: "Lower-case, no spaces. What the answer is saved as." },
          { name: "areas", label: "Compliance areas", help: "Area ids this answer makes relevant, separated by commas." },
        ],
      },
    ],
  },
];

/**
 * The field that carries each collection's display title.
 *
 * Kept here rather than in the repository because it is a property of the
 * content model, and both the in-memory and Convex adapters need it to keep a
 * record's list label in step with the field an editor actually edits.
 */
const titleField: Record<CollectionId, string> = {
  pages: "title",
  ticker: "headline",
  articles: "title",
  rights: "title",
  laws: "name",
  "business-guides": "title",
  media: "title",
  "media-series": "title",
  glossary: "term",
  quizzes: "title",
  checklists: "title",
  "compliance-topics": "title",
  contracts: "name",
  industries: "name",
  "ceo-briefings": "title",
  "regulatory-updates": "title",
  "legal-problems": "title",
  "referral-routes": "name",
  "lawyer-listings": "displayName",
  questions: "question",
  cases: "title",
  "law-histories": "instrument",
  "law-entries": "title",
  "safety-guides": "title",
  "constitution-chapters": "title",
  "constitution-sections": "heading",
  courts: "name",
  "alert-topics": "label",
  "calendar-entries": "title",
  "health-check": "prompt",
  "profile-questions": "label",
};

export function titleFieldFor(collection: CollectionId): string {
  return titleField[collection];
}

export function getCollection(id: string): CollectionDefinition | undefined {
  return collections.find((collection) => collection.id === id);
}

/**
 * The two halves of the `list` encoding, kept together so the write path and
 * the read path cannot drift apart.
 *
 * Blank lines are dropped rather than preserved as empty items: a trailing
 * newline in a textarea is a typing artefact, not an empty bullet the reader
 * should see.
 */
export function encodeList(items: readonly string[]): string {
  return items.join("\n");
}

export function decodeList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
