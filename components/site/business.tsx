import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  FileText,
  ListChecks,
  Newspaper,
  Scale,
} from "lucide-react";
import { cn } from "cn";
import { FollowTopicButton } from "@/components/account/follow-topic-button";
import { Icon } from "@/lib/icons";
import { IconBadge, Pill, ReviewBadge } from "./primitives";
import { TickList } from "./knowledge";
import type {
  AlertTopic,
  BusinessArea,
  CalendarEntry,
  CeoBriefing,
  ComplianceTopic,
  ContractClause,
  ContractType,
  IndustryHub,
  RegulatoryUpdate,
} from "@/lib/content/types";

/** Shared card shell, matching the elevation and hover used across the site. */
const cardBase =
  "group relative flex flex-col rounded-2xl border border-hairline bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-foreground/5";

/* -------------------------------------------------------------------------- */
/* Cards                                                                       */
/* -------------------------------------------------------------------------- */

export function BusinessAreaCard({ area }: { area: BusinessArea }) {
  return (
    <Link
      href={area.href}
      className="group flex items-start gap-4 rounded-2xl border border-hairline bg-card p-4 transition-all duration-300 hover:border-primary/45 hover:bg-surface sm:p-5"
    >
      <IconBadge name={area.icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] leading-snug font-extrabold text-foreground">
          {area.name}
        </span>
        <span className="mt-1.5 block text-[0.84rem] leading-relaxed text-muted-foreground">
          {area.blurb}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" />
    </Link>
  );
}

export function ComplianceTopicCard({ topic }: { topic: ComplianceTopic }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <IconBadge name={topic.icon} />
        <ReviewBadge meta={topic.meta} />
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/business/compliance/${topic.slug}`}
          className="after:absolute after:inset-0"
        >
          {topic.title}
        </Link>
      </h3>
      <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
        {topic.summary}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-6 text-[0.78rem] font-bold text-muted-foreground">
        <ListChecks className="size-3.5 text-brand-ink" />
        {topic.goodPractice.length} practices · {topic.commonGaps.length} common gaps
      </div>
    </article>
  );
}

export function ContractCard({ contract }: { contract: ContractType }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <Pill tone="brand">{contract.family}</Pill>
        <ReviewBadge meta={contract.meta} />
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/business/contracts/${contract.slug}`}
          className="after:absolute after:inset-0"
        >
          {contract.name}
        </Link>
      </h3>
      <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
        {contract.whatItIs}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-6 text-[0.78rem] font-bold text-muted-foreground">
        <FileText className="size-3.5 text-brand-ink" />
        {contract.importantClauses.length} clauses explained
      </div>
    </article>
  );
}

export function IndustryCard({ hub }: { hub: IndustryHub }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <IconBadge name={hub.icon} />
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/business/industries/${hub.slug}`}
          className="after:absolute after:inset-0"
        >
          {hub.name}
        </Link>
      </h3>
      <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
        {hub.blurb}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-6 text-[0.78rem] font-bold text-muted-foreground">
        <Scale className="size-3.5 text-brand-ink" />
        {hub.regulatoryThemes.length} regulatory themes
      </div>
    </article>
  );
}

export function BriefingCard({ briefing }: { briefing: CeoBriefing }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <Pill tone="brand">Executive briefing</Pill>
        <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-muted-foreground">
          <Clock className="size-3.5" />
          {briefing.readingMinutes} min
        </span>
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/business/ceo/${briefing.slug}`}
          className="after:absolute after:inset-0"
        >
          {briefing.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.8rem] font-semibold text-brand-ink">
        {briefing.question}
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {briefing.summary}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-6 text-[0.78rem] font-bold text-muted-foreground">
        <ListChecks className="size-3.5 text-brand-ink" />
        {briefing.questionsForTheBoard.length} questions for the board
      </div>
    </article>
  );
}

export function RegulatoryUpdateCard({
  update,
  topicLabel,
}: {
  update: RegulatoryUpdate;
  topicLabel: string;
}) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <Pill tone="brand">{topicLabel}</Pill>
        <ReviewBadge meta={update.meta} />
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/business/regulatory-watch/${update.slug}`}
          className="after:absolute after:inset-0"
        >
          {update.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {update.report[0]}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-6 text-[0.78rem] font-bold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Newspaper className="size-3.5 text-brand-ink" />
          Published {update.publishedAt}
        </span>
        <span>{update.whoIsAffected.length} groups affected</span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Regulatory Watch: reporting vs explanation                                  */
/* -------------------------------------------------------------------------- */

/**
 * The separation spec section 22 requires.
 *
 * News reporting and legal explanation are stored as separate fields and
 * rendered as two visibly distinct panes, each labelled. A reader can always
 * tell which part is an account of what happened and which is our reading of
 * what it means.
 */
export function ReportAndExplanation({
  report,
  explanation,
}: {
  report: string[];
  explanation: string[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline lg:grid-cols-2">
      <div className="bg-surface p-5 sm:p-6">
        <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
          <Newspaper className="size-3.5" />
          What changed — reporting
        </p>
        <div className="mt-4 space-y-3">
          {report.map((paragraph, index) => (
            <p
              key={index}
              className="text-[0.92rem] leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="bg-card p-5 sm:p-6">
        <p className="text-eyebrow flex items-center gap-2 text-brand-ink">
          <FileText className="size-3.5" />
          What it means — our explanation
        </p>
        <div className="mt-4 space-y-3">
          {explanation.map((paragraph, index) => (
            <p
              key={index}
              className="text-[0.92rem] leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Contract clauses                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Clause-by-clause education. Each clause states what it is for and what to
 * look at - never model wording. The platform does not supply templates.
 */
export function ClauseTable({ clauses }: { clauses: ContractClause[] }) {
  return (
    <div className="space-y-4">
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
        {clauses.map((clause) => (
          <li key={clause.name} className="bg-card p-5">
            <p className="text-[0.95rem] leading-snug font-extrabold text-foreground">
              {clause.name}
            </p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
              {clause.purpose}
            </p>
            <p className="mt-3 border-l-2 border-primary/50 pl-3.5 text-[0.88rem] leading-relaxed text-muted-foreground">
              <span className="font-bold text-brand-ink">What to check: </span>
              {clause.whatToCheck}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Business legal calendar                                                     */
/* -------------------------------------------------------------------------- */

const cadenceLabel: Record<CalendarEntry["cadence"], string> = {
  annual: "Annual",
  quarterly: "Quarterly",
  monthly: "Each pay run",
  ongoing: "Ongoing",
  "event-driven": "Event-driven",
};

/**
 * Calendar entries carry a cadence and a trigger, never a date.
 *
 * Spec section 24 forbids hard-coding legal deadlines without a maintained
 * source and review process, so each card names what starts the clock and the
 * page tells readers to confirm actual dates with the relevant authority.
 */
export function CalendarCard({
  entry,
  areaName,
}: {
  entry: CalendarEntry;
  areaName: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-hairline bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <IconBadge name={entry.icon} />
        <Pill tone="outline">{cadenceLabel[entry.cadence]}</Pill>
      </div>
      <h3 className="text-h4 mt-5 text-foreground">{entry.title}</h3>
      <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
        {entry.summary}
      </p>

      <dl className="mt-5 space-y-3 border-t border-hairline pt-4 text-[0.84rem]">
        <div>
          <dt className="text-eyebrow text-brand-ink">What starts the clock</dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">
            {entry.trigger}
          </dd>
        </div>
        <div>
          <dt className="text-eyebrow text-muted-foreground">Timing</dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">
            {entry.timing}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-eyebrow text-muted-foreground">What to prepare</p>
        <div className="mt-3">
          <TickList items={entry.whatToPrepare} tone="positive" />
        </div>
      </div>

      <p className="mt-auto pt-5 text-[0.75rem] font-bold text-muted-foreground">
        {areaName}
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Law change alerts                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Topic list for law-change alerts (spec section 23).
 *
 * Following a topic requires an account, which arrives in Phase 6. Until then
 * each topic links to the Regulatory Watch entries already published under it,
 * so the section is useful rather than a disabled control.
 */
/**
 * The followable topics (spec section 23).
 *
 * The card is not one big link: it carries both a link into the topic and a
 * follow control, and a button nested inside an anchor is neither valid nor
 * operable with a keyboard.
 */
export function AlertTopicGrid({ topics }: { topics: AlertTopic[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <li key={topic.slug} className="flex">
          <div className="flex w-full flex-col rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45">
            <div className="flex items-start gap-3.5">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-brand-ink">
                <Icon name={topic.icon} className="size-4" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <Link
                  href={`/business/regulatory-watch?topic=${topic.slug}`}
                  className="block text-[0.9rem] font-extrabold text-foreground link-underline"
                >
                  {topic.label}
                </Link>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <FollowTopicButton
                topic={topic.slug}
                label={topic.label}
                className="w-full justify-center"
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Small shared parts                                                          */
/* -------------------------------------------------------------------------- */

/** Key considerations on a guide page: heading, body and the instrument. */
export function ConsiderationList({
  items,
}: {
  items: { heading: string; body: string; instrument?: string }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.heading}
          className="rounded-2xl border border-hairline bg-card p-5"
        >
          <p className="text-[0.95rem] leading-snug font-extrabold text-foreground">
            {item.heading}
          </p>
          <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
            {item.body}
          </p>
          {item.instrument && (
            <p className="mt-3 flex items-start gap-2 font-mono text-[0.78rem] leading-relaxed text-muted-foreground">
              <Scale className="mt-0.5 size-3.5 shrink-0 text-brand-ink" />
              {item.instrument}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * A guide's checklist, rendered statically on the server.
 *
 * It is deliberately not interactive: ticking boxes implies a record the
 * platform does not keep, and saved progress belongs with accounts in Phase 6.
 */
export function GuideChecklist({
  items,
}: {
  items: { id: string; label: string; detail: string }[];
}) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex gap-3.5 rounded-xl border border-hairline bg-card p-4"
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-[0.75rem] font-extrabold text-brand-ink">
            {index + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-[0.92rem] leading-snug font-extrabold text-foreground">
              {item.label}
            </span>
            <span className="mt-1 block text-[0.85rem] leading-relaxed text-muted-foreground">
              {item.detail}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Compact "what applies here" strip used on industry and compliance pages. */
export function ThemeList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-hairline bg-card p-4"
        >
          <Scale aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-ink" />
          <span className="text-[0.88rem] leading-relaxed text-muted-foreground">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
