import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Headphones,
  ListChecks,
  Play,
  Radio,
  ShieldAlert,
} from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { IconBadge, Pill, ReviewBadge, SourceReference } from "./primitives";
import type {
  Article,
  BusinessGuide,
  Checklist,
  EntryPoint,
  GlossaryTerm,
  LawCategory,
  LawEntry,
  LiveEvent,
  MediaItem,
  Quiz,
  RightSummary,
  SafetyGuide,
} from "@/lib/content/types";

/** Shared card shell so elevation, radius and hover read identically. */
const cardBase =
  "group relative flex flex-col rounded-2xl border border-hairline bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-foreground/5";

/* -------------------------------------------------------------------------- */

export function EntryPointCard({ entry }: { entry: EntryPoint }) {
  return (
    <Link
      href={entry.href}
      className="group flex items-center gap-4 rounded-2xl border border-hairline bg-card p-4 transition-all duration-300 hover:border-primary/45 hover:bg-surface sm:p-5"
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-brand-ink transition-colors group-hover:bg-primary/20">
        <Icon name={entry.icon} className="size-5" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-eyebrow block text-muted-foreground">
          {entry.eyebrow}
        </span>
        <span className="mt-1.5 block text-[0.95rem] leading-snug font-extrabold text-foreground">
          {entry.promise}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */

export function RightsCard({
  right,
  featured = false,
}: {
  right: RightSummary;
  featured?: boolean;
}) {
  return (
    <article className={cn(cardBase, featured ? "p-6 sm:p-8" : "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <Pill tone="outline">{right.category}</Pill>
        <ReviewBadge meta={right.meta} />
      </div>

      <p className="mt-5 text-[0.78rem] font-bold tracking-wide text-brand-ink uppercase">
        {right.situation}
      </p>
      <h3
        className={cn("mt-2 text-foreground", featured ? "text-h2" : "text-h3")}
      >
        <Link
          href={`/your-rights/${right.slug}`}
          className="after:absolute after:inset-0"
        >
          {right.title}
        </Link>
      </h3>
      <p
        className={cn(
          "mt-3 leading-relaxed text-muted-foreground",
          featured ? "text-[1rem]" : "text-[0.88rem]",
        )}
      >
        {right.summary}
      </p>

      <div className="mt-auto pt-6">
        {right.meta.source && (
          <SourceReference source={right.meta.source} className="mb-4" />
        )}
        <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-foreground">
          <span className="link-underline">Read the guide</span>
          <ArrowRight className="size-3.5 text-brand-ink transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

export function LawCard({ category }: { category: LawCategory }) {
  return (
    <article className={cn(cardBase, "p-5")}>
      <IconBadge name={category.icon} />
      <h3 className="text-h4 mt-4 text-foreground">
        <Link
          href={`/know-the-law/${category.slug}`}
          className="after:absolute after:inset-0"
        >
          {category.name}
        </Link>
      </h3>
      <p className="mt-2 text-[0.84rem] leading-snug text-muted-foreground">
        {category.blurb}
      </p>
      <p className="mt-auto pt-5 text-[0.75rem] font-bold text-muted-foreground">
        {category.entryCount === 0
          ? "In preparation"
          : `${category.entryCount} ${
              category.entryCount === 1 ? "explainer" : "explainers"
            }`}
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

export function BusinessGuideCard({ guide }: { guide: BusinessGuide }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <Pill tone="brand">{guide.area}</Pill>
        <ReviewBadge meta={guide.meta} />
      </div>
      <h3 className="text-h3 mt-5 text-foreground">
        <Link
          href={`/business/guides/${guide.slug}`}
          className="after:absolute after:inset-0"
        >
          {guide.title}
        </Link>
      </h3>
      <p className="mt-1.5 text-[0.8rem] font-semibold text-muted-foreground">
        {guide.situation}
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {guide.summary}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-6 text-[0.78rem] font-bold text-muted-foreground">
        <ListChecks className="size-3.5 text-brand-ink" />
        {guide.checklistCount}-point checklist
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

const kindLabel: Record<Article["kind"], string> = {
  news: "News",
  analysis: "Analysis",
  explainer: "Legal explainer",
  opinion: "Opinion",
  educational: "Educational",
};

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "feature" | "row";
}) {
  if (variant === "row") {
    return (
      <article className="group relative flex items-start gap-5 border-b border-hairline py-5 last:border-b-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="outline">{kindLabel[article.kind]}</Pill>
            <span className="text-[0.75rem] font-semibold text-muted-foreground">
              {article.category}
            </span>
          </div>
          <h3 className="text-h4 mt-2.5 text-foreground">
            <Link
              href={`/law-and-society/${article.slug}`}
              className="after:absolute after:inset-0"
            >
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.86rem] leading-relaxed text-muted-foreground">
            {article.standfirst}
          </p>
          <p className="mt-3 flex items-center gap-2 text-[0.75rem] font-semibold text-muted-foreground">
            <Clock className="size-3.5" />
            {article.readingMinutes} min read
          </p>
        </div>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" />
      </article>
    );
  }

  const feature = variant === "feature";

  return (
    <article className={cn(cardBase, feature ? "p-6 sm:p-9" : "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={feature ? "brand" : "outline"}>
          {kindLabel[article.kind]}
        </Pill>
        <span className="text-[0.75rem] font-semibold text-muted-foreground">
          {article.category}
        </span>
      </div>
      <h3
        className={cn("mt-5 text-foreground", feature ? "text-h1" : "text-h3")}
      >
        <Link
          href={`/law-and-society/${article.slug}`}
          className="after:absolute after:inset-0"
        >
          {article.title}
        </Link>
      </h3>
      <p
        className={cn(
          "mt-3.5 leading-relaxed text-muted-foreground",
          feature ? "text-body-lg max-w-2xl" : "text-[0.88rem]",
        )}
      >
        {article.standfirst}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-7">
        <ReviewBadge meta={article.meta} />
        <span className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-muted-foreground">
          <Clock className="size-3.5" />
          {article.readingMinutes} min read
        </span>
        <span className="text-[0.75rem] font-semibold text-muted-foreground">
          Last reviewed {article.meta.lastReviewed}
        </span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

export function MediaCard({ item }: { item: MediaItem }) {
  const isPodcast = item.kind === "podcast";
  return (
    <article className={cn(cardBase, "overflow-hidden")}>
      {/* Artwork stand-in: a themed gradient plate, never a fake photograph. */}
      <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden bg-forest">
        <div aria-hidden className="bg-ledger absolute inset-0 opacity-20" />
        <div
          aria-hidden
          className="absolute -right-10 -bottom-12 size-44 rounded-full bg-primary/25 blur-3xl"
        />
        <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
          {isPodcast ? (
            <Headphones className="size-5" />
          ) : (
            <Play className="size-5 translate-x-px" />
          )}
        </span>
        {item.duration && (
          <span className="absolute right-3 bottom-3 rounded-md bg-forest/85 px-2 py-1 text-[0.7rem] font-bold text-forest-foreground">
            {item.duration}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="outline">{isPodcast ? "Podcast" : "Video"}</Pill>
          {item.series && (
            <span className="text-[0.75rem] font-semibold text-muted-foreground">
              {item.series}
            </span>
          )}
        </div>
        <h3 className="text-h4 mt-3.5 text-foreground">
          <Link
            href={`/${isPodcast ? "listen" : "watch"}/${item.slug}`}
            className="after:absolute after:inset-0"
          >
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.85rem] leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </article>
  );
}

/**
 * The homepage session card. It never claims a broadcast is on air: the badge
 * and the call to action are both derived from `liveStatus`, so a schedule with
 * nothing live reads as an invitation rather than as a stream in progress.
 */
export function LiveCard({ event }: { event: LiveEvent }) {
  const isLive = event.liveStatus === "live";
  const badge =
    event.liveStatus === "live"
      ? "Live now"
      : event.liveStatus === "scheduled"
        ? "Next live session"
        : "Featured session";
  const cta = isLive
    ? "Watch live"
    : event.liveStatus === "scheduled"
      ? "Save your place"
      : "Watch the session";

  return (
    <article className="relative overflow-hidden rounded-3xl border border-hairline bg-forest p-6 text-forest-foreground sm:p-9 lg:p-12">
      <div aria-hidden className="bg-ledger absolute inset-0 opacity-15" />
      <div
        aria-hidden
        className="absolute -top-24 -right-16 size-80 rounded-full bg-primary/20 blur-[90px]"
      />
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="flex items-center gap-2.5">
            {isLive ? (
              <Pill tone="live">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full rounded-full bg-live-foreground opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-live-foreground" />
                </span>
                {badge}
              </Pill>
            ) : (
              <Pill className="bg-forest-foreground/12 text-forest-foreground">
                {badge}
              </Pill>
            )}
            {event.series && (
              <span className="text-eyebrow text-forest-foreground/70">
                {event.series}
              </span>
            )}
          </p>
          <h3 className="text-h1 mt-5 max-w-2xl">{event.title}</h3>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-forest-foreground/80">
            {event.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href={`/live/${event.slug}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Radio className="size-4" />
            {cta}
          </Link>
          <Link
            href="/live"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-forest-foreground/25 px-6 text-[0.92rem] font-extrabold text-forest-foreground transition-colors hover:bg-forest-foreground/10"
          >
            Full schedule
          </Link>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

export function GlossaryCard({ term }: { term: GlossaryTerm }) {
  return (
    <article className={cn(cardBase, "p-5")}>
      <h3 className="text-h4 text-foreground">
        <Link
          href={`/glossary/${term.slug}`}
          className="after:absolute after:inset-0"
        >
          {term.term}
        </Link>
      </h3>
      <p className="mt-2.5 text-[0.86rem] leading-relaxed text-muted-foreground">
        {term.definition}
      </p>
      <p className="mt-4 border-l-2 border-primary/50 pl-3 text-[0.8rem] leading-snug text-muted-foreground italic">
        {term.example}
      </p>
    </article>
  );
}

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-center justify-between gap-3">
        <Pill tone="brand">{quiz.level}</Pill>
        <span className="text-[0.75rem] font-bold text-muted-foreground">
          {quiz.questionCount} questions · {quiz.minutes} min
        </span>
      </div>
      <h3 className="text-h3 mt-5 text-foreground">
        <Link
          href={`/quizzes/${quiz.slug}`}
          className="after:absolute after:inset-0"
        >
          {quiz.title}
        </Link>
      </h3>
      <p className="mt-2.5 text-[0.87rem] leading-relaxed text-muted-foreground">
        {quiz.description}
      </p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.85rem] font-bold text-foreground">
        <span className="link-underline">Start the quiz</span>
        <ArrowRight className="size-3.5 text-brand-ink transition-transform group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

export function ChecklistCard({ checklist }: { checklist: Checklist }) {
  return (
    <article className="group relative flex items-center gap-4 rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45">
      <ListChecks className="size-5 shrink-0 text-brand-ink" />
      <div className="min-w-0 flex-1">
        <h3 className="text-[0.92rem] font-extrabold text-foreground">
          <Link
            href={`/resources/${checklist.slug}`}
            className="after:absolute after:inset-0"
          >
            {checklist.title}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-[0.8rem] text-muted-foreground">
          {checklist.description}
        </p>
      </div>
      <span className="shrink-0 text-[0.75rem] font-bold text-muted-foreground">
        {checklist.itemCount} items
      </span>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

/** A single law explainer, listed inside a category or a search result. */
export function LawEntryCard({
  entry,
  categoryName,
}: {
  entry: LawEntry;
  categoryName?: string;
}) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Pill tone="outline">{categoryName ?? "Know the Law"}</Pill>
        <ReviewBadge meta={entry.meta} />
      </div>
      <h3 className="text-h3 mt-5 text-foreground">
        <Link
          href={`/know-the-law/${entry.category}/${entry.slug}`}
          className="after:absolute after:inset-0"
        >
          {entry.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.8rem] font-semibold text-brand-ink">
        {entry.instrument}
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {entry.summary}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[0.75rem] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ListChecks className="size-3.5 text-brand-ink" />
          {entry.provisions.length} provisions explained
        </span>
        <span>Last reviewed {entry.meta.lastReviewed}</span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */

/** A Stay Safe guide: the risk moment first, then what to watch for. */
export function SafetyCard({ guide }: { guide: SafetyGuide }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <IconBadge name={guide.icon} />
        {guide.series && <Pill tone="brand">{guide.series}</Pill>}
      </div>
      <h3 className="text-h3 mt-5 text-foreground">
        <Link
          href={`/stay-safe/${guide.slug}`}
          className="after:absolute after:inset-0"
        >
          {guide.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.78rem] font-bold tracking-wide text-brand-ink uppercase">
        {guide.risk}
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {guide.summary}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[0.75rem] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="size-3.5 text-brand-ink" />
          {guide.redFlags.length} red flags
        </span>
        <span>{guide.area}</span>
      </div>
    </article>
  );
}
