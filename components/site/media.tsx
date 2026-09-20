import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Headphones,
  Mic,
  Play,
  Radio,
} from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { Pill } from "./primitives";
import { MediaPlayer } from "./media-player";
import type {
  AgendaSlot,
  LiveEvent,
  LiveStatus,
  MediaChapter,
  MediaContributor,
  MediaDetail,
  MediaFormat,
  MediaItem,
  MediaSeries,
  MediaTranscript,
} from "@/lib/content/types";

/** Shared card shell, matching `cards.tsx` so media reads as the same system. */
const cardBase =
  "group relative flex flex-col rounded-2xl border border-hairline bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-foreground/5";

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Chapter and cue labels are derived from `startSeconds`, never stored, so a
 * timecode cannot drift away from the offset it seeks to.
 */
export function formatTimecode(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Sessions are scheduled in Nigeria, so the time zone is fixed rather than read
 * from the machine doing the rendering - a prerendered page must not show a
 * build server's local time.
 */
const scheduleFormatter = new Intl.DateTimeFormat("en-NG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
  timeZoneName: "short",
});

export function formatSchedule(iso: string): string {
  return scheduleFormatter.format(new Date(iso));
}

const formatLabels: Record<MediaFormat, string> = {
  explainer: "Explainer",
  interview: "Interview",
  documentary: "Documentary",
  webinar: "Webinar",
  short: "Short",
  broadcast: "Broadcast",
  episode: "Episode",
  "audio-explainer": "Audio explainer",
  "live-session": "Live session",
};

export function formatLabel(format: MediaFormat): string {
  return formatLabels[format];
}

/** The route a media record lives on, mirroring the repository's own split. */
export function mediaHref(item: MediaItem): string {
  const segment =
    item.kind === "podcast" ? "listen" : item.kind === "live" ? "live" : "watch";
  return `/${segment}/${item.slug}`;
}

/* -------------------------------------------------------------------------- */
/* Artwork                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The artwork plate.
 *
 * The platform holds no photography for this content, and spec section 68 rules
 * out generic stock imagery, so artwork is a themed plate carrying the format
 * glyph rather than a picture standing in for one.
 */
function Artwork({
  kind,
  size = "card",
  className,
}: {
  kind: MediaItem["kind"];
  size?: "card" | "stage";
  className?: string;
}) {
  const Glyph = kind === "podcast" ? Headphones : kind === "live" ? Radio : Play;
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-forest",
        className
      )}
    >
      <div aria-hidden className="bg-ledger absolute inset-0 opacity-20" />
      <div
        aria-hidden
        className="absolute -right-10 -bottom-12 size-44 rounded-full bg-primary/25 blur-3xl"
      />
      <span
        aria-hidden
        className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105",
          size === "stage" ? "size-20" : "size-14"
        )}
      >
        <Glyph className={size === "stage" ? "size-7" : "size-5"} />
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                       */
/* -------------------------------------------------------------------------- */

/** The standard media card used across the Watch and Listen hubs. */
export function MediaDetailCard({ item }: { item: MediaDetail }) {
  return (
    <article className={cn(cardBase, "overflow-hidden")}>
      <Artwork kind={item.kind} className="aspect-16/10" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="outline">{formatLabel(item.format)}</Pill>
          {item.duration && (
            <span className="text-[0.75rem] font-semibold text-muted-foreground">
              {item.duration}
            </span>
          )}
        </div>
        <h3 className="text-h4 mt-3.5 text-foreground">
          <Link href={mediaHref(item)} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.85rem] leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        {item.series && (
          <p className="mt-4 text-[0.75rem] font-bold text-muted-foreground">
            {item.series}
            {typeof item.episode === "number" && ` · Episode ${item.episode}`}
          </p>
        )}
      </div>
    </article>
  );
}

/** The lead item at the top of a hub. */
export function FeaturedMedia({ item }: { item: MediaDetail }) {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-hairline bg-card lg:grid-cols-[1.1fr_1fr]">
      <Artwork kind={item.kind} className="min-h-56 lg:min-h-full" size="stage" />
      <div className="flex flex-col justify-center p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">Featured</Pill>
          <Pill tone="outline">{formatLabel(item.format)}</Pill>
          {item.duration && (
            <span className="text-[0.78rem] font-semibold text-muted-foreground">
              {item.duration}
            </span>
          )}
        </div>
        <h3 className="text-h2 mt-5 text-foreground">
          <Link href={mediaHref(item)} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className="mt-3.5 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        {item.series && (
          <p className="mt-5 text-[0.78rem] font-bold text-muted-foreground">
            {item.series}
          </p>
        )}
      </div>
    </article>
  );
}

/** Compact row used in series listings and "more from this strand" rails. */
export function EpisodeRow({
  item,
  index,
}: {
  item: MediaDetail;
  index?: number;
}) {
  return (
    <li className="group relative flex gap-4 rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45">
      {/* An episode number where the item has one, otherwise its position. */}
      <span
        aria-hidden
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-[0.8rem] font-extrabold text-brand-ink"
      >
        {item.episode ?? (typeof index === "number" ? index + 1 : <Mic className="size-4" />)}
      </span>
      <div className="min-w-0">
        <h3 className="text-[0.95rem] leading-snug font-extrabold text-foreground">
          <Link href={mediaHref(item)} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.84rem] leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] font-semibold text-muted-foreground">
          <span>{formatLabel(item.format)}</span>
          {item.duration && <span>{item.duration}</span>}
          <span>{item.publishedAt}</span>
        </p>
      </div>
      <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" />
    </li>
  );
}

export function SeriesCard({
  series,
  itemCount,
}: {
  series: MediaSeries;
  itemCount: number;
}) {
  const href = `/${series.kind === "podcast" ? "listen" : "watch"}/series/${series.slug}`;
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
        <Icon name={series.icon} className="size-5" strokeWidth={1.9} />
      </span>
      <h3 className="text-h4 mt-4 text-foreground">
        <Link href={href} className="after:absolute after:inset-0">
          {series.title}
        </Link>
      </h3>
      <p className="text-eyebrow mt-2 text-brand-ink">{series.tagline}</p>
      <p className="mt-3 line-clamp-3 text-[0.87rem] leading-relaxed text-muted-foreground">
        {series.description}
      </p>
      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] font-semibold text-muted-foreground">
        <span>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span aria-hidden>·</span>
        <span>{series.cadence}</span>
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Live                                                                        */
/* -------------------------------------------------------------------------- */

const liveCopy: Record<LiveStatus, string> = {
  live: "Live now",
  scheduled: "Upcoming",
  ended: "Archived",
};

export function LiveStatusPill({ status }: { status: LiveStatus }) {
  if (status === "live") {
    return (
      <Pill tone="live">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full rounded-full bg-live-foreground opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-live-foreground" />
        </span>
        {liveCopy.live}
      </Pill>
    );
  }
  return (
    <Pill tone={status === "scheduled" ? "brand" : "outline"}>
      {liveCopy[status]}
    </Pill>
  );
}

/** One session in the schedule on /live. */
export function LiveEventCard({ event }: { event: LiveEvent }) {
  return (
    <article
      className={cn(
        cardBase,
        "p-5 sm:p-6",
        event.liveStatus === "live" && "border-primary/45"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <LiveStatusPill status={event.liveStatus} />
        {event.series && (
          <span className="text-[0.75rem] font-semibold text-muted-foreground">
            {event.series}
          </span>
        )}
      </div>
      <h3 className="text-h4 mt-4 text-foreground">
        <Link href={`/live/${event.slug}`} className="after:absolute after:inset-0">
          {event.title}
        </Link>
      </h3>
      <p className="mt-2.5 line-clamp-3 text-[0.87rem] leading-relaxed text-muted-foreground">
        {event.description}
      </p>
      {event.scheduledFor && (
        <p className="mt-5 flex items-center gap-2 text-[0.78rem] font-bold text-muted-foreground">
          <CalendarClock className="size-4 text-brand-ink" />
          {formatSchedule(event.scheduledFor)}
        </p>
      )}
    </article>
  );
}

export function AgendaList({ agenda }: { agenda: AgendaSlot[] }) {
  return (
    <ol className="space-y-3">
      {agenda.map((slot) => (
        <li
          key={slot.id}
          className="rounded-xl border border-hairline bg-card p-4 sm:p-5"
        >
          <p className="text-eyebrow text-brand-ink">{slot.label}</p>
          <p className="mt-2 text-[0.95rem] font-extrabold text-foreground">
            {slot.title}
          </p>
          <p className="mt-1.5 text-[0.87rem] leading-relaxed text-muted-foreground">
            {slot.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * How audience questions are handled, and what happens to the recording.
 *
 * Both are rendered on the page rather than left to the footer, because a
 * session that takes questions has to say what it will and will not answer.
 */
export function SessionPolicies({ event }: { event: LiveEvent }) {
  const rows = [
    { label: "Questions", body: event.questionPolicy },
    { label: "Attending", body: event.registration },
    { label: "After the session", body: event.archivePolicy },
  ];
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-eyebrow text-muted-foreground">{row.label}</dt>
            <dd className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
              {row.body}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail furniture                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The stage at the top of a media page.
 *
 * When a record carries a `source` the real player is mounted. Until then the
 * stage states plainly when the item becomes playable - an honest availability
 * state rather than a play button that does nothing.
 */
export function MediaStage({ item }: { item: MediaDetail }) {
  if (item.source) {
    return (
      <div className="mx-auto w-full lg:max-w-3xl">
        <MediaPlayer item={item} />
      </div>
    );
  }

  const liveStatus = "liveStatus" in item ? (item as LiveEvent).liveStatus : null;
  const availability =
    liveStatus === "live"
      ? "This session is on air. The stream appears here once the broadcast connection is attached to this page."
      : liveStatus === "scheduled" && item.scheduledFor
        ? `Streaming begins ${formatSchedule(item.scheduledFor)}. Nothing plays here before then.`
        : liveStatus === "ended"
          ? "The recording of this session is being prepared for on-demand playback. The chapters and written record below are already complete."
          : `Playback for this ${item.kind === "podcast" ? "episode" : "film"} is not yet attached to the platform. Everything below - chapters, transcript and related law - is published and readable now.`;

  return (
    <div className="mx-auto w-full overflow-hidden rounded-3xl border border-hairline lg:max-w-3xl">
      <Artwork
        kind={item.kind}
        size="stage"
        className="aspect-video lg:aspect-2/1"
      />
      <div className="border-t border-hairline bg-surface p-5 sm:p-6">
        <p className="text-eyebrow text-muted-foreground">
          {liveStatus === "live" ? "On air" : "Availability"}
        </p>
        <p className="mt-2 max-w-3xl text-[0.88rem] leading-relaxed text-muted-foreground">
          {availability}
        </p>
      </div>
    </div>
  );
}

export function ChapterList({ chapters }: { chapters: MediaChapter[] }) {
  return (
    <ol className="space-y-2.5">
      {chapters.map((chapter) => (
        <li
          key={chapter.id}
          className="flex gap-4 rounded-xl border border-hairline bg-card p-4"
        >
          <span className="font-mono text-[0.78rem] font-bold text-brand-ink tabular-nums">
            {formatTimecode(chapter.startSeconds)}
          </span>
          <span className="min-w-0">
            <span className="block text-[0.92rem] font-extrabold text-foreground">
              {chapter.title}
            </span>
            <span className="mt-1 block text-[0.85rem] leading-relaxed text-muted-foreground">
              {chapter.summary}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ContributorList({
  contributors,
}: {
  contributors: MediaContributor[];
}) {
  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {contributors.map((person) => (
          <li
            key={person.id}
            className="rounded-xl border border-hairline bg-card p-4"
          >
            <p className="text-eyebrow text-brand-ink">{person.role}</p>
            <p className="mt-2 text-[0.92rem] font-extrabold text-foreground">
              {person.name}
            </p>
            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted-foreground">
              {person.bio}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
        Contributors are credited by the editorial desk responsible for the item.
        Individual presenters and guests are named here once an item has been
        recorded and the credit confirmed — the platform does not attribute
        legal expertise to anyone it has not verified.
      </p>
    </>
  );
}

/**
 * The transcript.
 *
 * `TranscriptCue.text` is our written record of what an item covers, not a
 * verbatim capture, and the panel says so at the point of use rather than only
 * in the footer - the same discipline `ProvisionSplit` applies to statutory
 * wording.
 */
export function Transcript({ transcript }: { transcript: MediaTranscript }) {
  if (transcript.status === "unavailable" || transcript.cues.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-surface p-6 sm:p-8">
        <p className="text-[0.95rem] font-extrabold text-foreground">
          {transcript.status === "in-progress"
            ? "The written record is being prepared"
            : "No written record yet"}
        </p>
        <p className="mt-2 max-w-2xl text-[0.87rem] leading-relaxed text-muted-foreground">
          {transcript.status === "in-progress"
            ? "A section-by-section written record is compiled after an item is published, and appears here when it is complete."
            : "This item has not been recorded yet. A written record is published alongside the recording."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5">
        <p className="text-eyebrow text-brand-ink">What this is</p>
        <p className="mt-2 text-[0.87rem] leading-relaxed text-muted-foreground">
          A written record of what this item covers at each point, in our own
          words. It is not a word-for-word capture of what was said, and it is
          not the text of any law — always read the official text of an
          instrument before relying on it.
          {transcript.status === "in-progress" &&
            " This record is still being completed."}
        </p>
      </div>
      <ol className="mt-5 space-y-4">
        {transcript.cues.map((cue) => (
          <li key={cue.id} className="flex gap-4 border-t border-hairline pt-4">
            <span className="font-mono text-[0.78rem] font-bold text-brand-ink tabular-nums">
              {formatTimecode(cue.startSeconds)}
            </span>
            <span className="min-w-0">
              <span className="text-eyebrow block text-muted-foreground">
                {cue.speaker}
              </span>
              <span className="mt-1.5 block text-[0.92rem] leading-[1.7] text-muted-foreground">
                {cue.text}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TopicChips({ topics }: { topics: string[] }) {
  if (topics.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <li key={topic}>
          <Pill tone="outline">{topic}</Pill>
        </li>
      ))}
    </ul>
  );
}
