/**
 * SAN of the Week: each week, a moment with a Senior Advocate of Nigeria.
 *
 * One record per week in the "SAN of the Week" CMS collection. The newest
 * feature whose week has started is the one /san-of-the-week leads with; the
 * rest form the archive, each at /san-of-the-week/<slug>.
 */

export interface SanConversationTurn {
  question: string;
  /** Paragraphs, already split on blank lines. */
  answer: string[];
}

export interface SanFeature {
  id: string;
  slug: string;
  /** As they would like it printed, e.g. "Chief Ada Obi, SAN". */
  name: string;
  /** Their chambers or office, e.g. "Principal Partner, Obi & Co." */
  role: string;
  /** The year they were conferred with the rank. 0 when not given. */
  yearConferred: number;
  /** The Monday the feature runs from, as YYYY-MM-DD. */
  weekOf: string;
  /** Cloudinary delivery URL. Without one the page shows their initials. */
  photo?: string;
  /** The line the page is headlined with - usually something they said. */
  quote: string;
  /** One or two sentences introducing them. */
  intro: string;
  practiceAreas: string[];
  /** Paragraphs. */
  bio: string[];
  conversation: SanConversationTurn[];
  /** Their word to ordinary Nigerians. Paragraphs. */
  advice: string[];
  /** Where the full broadcast is, e.g. /watch/<slug>. Empty when there is none. */
  watchHref: string;
}

/**
 * Seed for the "SAN of the Week" collection.
 *
 * Deliberately empty: these are real people, and the content policy forbids
 * inventing profiles or putting words in their mouths. Editors add each week's
 * feature in the CMS, and the page shows an honest "coming soon" until then.
 */
export const sanFeatures: SanFeature[] = [];

/** Today in Lagos as YYYY-MM-DD, which is the calendar the weeks run on. */
function todayInLagos(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Newest first, leaving out any week that has not started yet - so an editor
 * can publish next week's feature early without it going out early.
 */
export function runningSanFeatures(features: SanFeature[]): SanFeature[] {
  const today = todayInLagos();
  return features
    .filter((feature) => !feature.weekOf || feature.weekOf <= today)
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf));
}

/** "Week of 12 October 2026", or an empty string for an undated feature. */
export function formatWeekOf(weekOf: string): string {
  if (!weekOf) return "";
  const date = new Date(`${weekOf}T00:00:00Z`);
  if (!Number.isFinite(date.getTime())) return "";
  return `Week of ${date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })}`;
}
