import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Check,
  FileText,
  Scale,
  X,
} from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { Pill, ReviewBadge, SourceReference } from "./primitives";
import type {
  EditorialMeta,
  LawExample,
  LawProvision,
  Misconception,
  RelatedItem,
} from "@/lib/content/types";

/* -------------------------------------------------------------------------- */
/* Page header                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The masthead every Phase 2 page opens with: trail, eyebrow, title, lede and
 * an optional slot for credibility metadata or actions.
 */
export function PageHeader({
  trail,
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  trail: Crumb[];
  eyebrow: string;
  title: string;
  lede?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-hairline bg-surface">
      <div
        aria-hidden
        className="bg-ledger mask-fade-b pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/10 blur-[100px]"
      />
      <div className="rail relative py-10 sm:py-14 lg:py-18">
        <Breadcrumbs trail={trail} />
        <p className="text-eyebrow mt-6 flex items-center gap-2 text-brand-ink">
          <span aria-hidden className="inline-block h-px w-6 bg-primary" />
          {eyebrow}
        </p>
        <h1 className="text-h1 mt-4 max-w-4xl text-foreground">{title}</h1>
        {lede && (
          <p className="text-body-lg mt-5 max-w-3xl text-muted-foreground">
            {lede}
          </p>
        )}
        {meta && <div className="mt-7">{meta}</div>}
        {children}
      </div>
    </header>
  );
}

/** Compact credibility strip: badge, review date, content type. */
export function CredibilityRow({
  meta,
  kind,
  className,
}: {
  meta: EditorialMeta;
  kind: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.78rem] font-semibold text-muted-foreground",
        className
      )}
    >
      <ReviewBadge meta={meta} />
      <Pill tone="outline">{kind}</Pill>
      <span>Last reviewed {meta.lastReviewed}</span>
      {meta.reviewedBy ? (
        <span>Reviewed by {meta.reviewedBy}</span>
      ) : (
        <span>No named reviewer yet</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Article furniture                                                           */
/* -------------------------------------------------------------------------- */

/** A titled block inside a knowledge page. Anchored so an aside can link to it. */
export function ContentBlock({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-[calc(var(--chrome-h)+1.5rem)] border-t border-hairline pt-8", className)}
    >
      <h2 className="text-h3 text-foreground">{title}</h2>
      {description && (
        <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Body prose. Paragraphs are stored as an array, never as HTML. */
export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-[1rem] leading-[1.75] text-muted-foreground"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function TickList({
  items,
  tone = "neutral",
}: {
  items: string[];
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md",
              tone === "positive" && "bg-primary/15 text-brand-ink",
              tone === "negative" && "bg-destructive/12 text-destructive",
              tone === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {tone === "negative" ? (
              <X className="size-3" strokeWidth={2.6} />
            ) : (
              <Check className="size-3" strokeWidth={2.6} />
            )}
          </span>
          <span className="text-[0.92rem] leading-relaxed text-muted-foreground">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered steps, used by the rights guides. */
export function StepList({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex gap-4 rounded-xl border border-hairline bg-card p-4 sm:p-5"
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-[0.75rem] font-extrabold text-brand-ink">
            {index + 1}
          </span>
          <span>
            <span className="block text-[0.95rem] font-extrabold text-foreground">
              {step.title}
            </span>
            <span className="mt-1 block text-[0.9rem] leading-relaxed text-muted-foreground">
              {step.body}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function DoAndDont({
  shouldDo,
  shouldNotDo,
}: {
  shouldDo: string[];
  shouldNotDo: string[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-hairline bg-card p-5">
        <p className="text-eyebrow text-brand-ink">What you should do</p>
        <div className="mt-4">
          <TickList items={shouldDo} tone="positive" />
        </div>
      </div>
      <div className="rounded-2xl border border-hairline bg-card p-5">
        <p className="text-eyebrow text-destructive">What you should not do</p>
        <div className="mt-4">
          <TickList items={shouldNotDo} tone="negative" />
        </div>
      </div>
    </div>
  );
}

export function Misconceptions({ items }: { items: Misconception[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.myth}
          className="rounded-2xl border border-hairline bg-card p-5"
        >
          <p className="flex items-start gap-2.5 text-[0.92rem] font-extrabold text-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <span>“{item.myth}”</span>
          </p>
          <p className="mt-2.5 border-l-2 border-primary/50 pl-3.5 text-[0.9rem] leading-relaxed text-muted-foreground">
            {item.reality}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Examples({ items }: { items: LawExample[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.situation}
          className="rounded-2xl border border-hairline bg-card p-5"
        >
          <p className="text-eyebrow text-muted-foreground">In real life</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed font-bold text-foreground">
            {item.situation}
          </p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
            {item.outcome}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * The official-text / plain-language split the spec requires.
 *
 * The platform does not reproduce statutory wording, so the left pane names
 * exactly where the official text lives and the right pane is labelled as our
 * explanation. A summary can never be read as the text of the law.
 */
export function ProvisionSplit({
  provisions,
  sourceUrl,
}: {
  provisions: LawProvision[];
  sourceUrl?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
        {provisions.map((provision) => (
          <div key={provision.id} className="grid bg-card sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <div className="border-b border-hairline bg-surface p-5 sm:border-r sm:border-b-0">
              <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
                <Scale className="size-3.5" />
                Official text
              </p>
              <p className="mt-3 text-[0.95rem] leading-snug font-extrabold text-foreground">
                {provision.heading}
              </p>
              <p className="mt-2 font-mono text-[0.8rem] leading-relaxed text-muted-foreground">
                {provision.citation}
              </p>
              {sourceUrl && (
                <Link
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[0.78rem] font-bold text-brand-ink link-underline"
                >
                  Read the official text
                  <ArrowUpRight className="size-3" />
                </Link>
              )}
            </div>
            <div className="p-5">
              <p className="text-eyebrow flex items-center gap-2 text-brand-ink">
                <FileText className="size-3.5" />
                Plain language — our explanation
              </p>
              <p className="mt-3 text-[0.93rem] leading-relaxed text-muted-foreground">
                {provision.plainLanguage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "When to contact a lawyer" — required on every knowledge page by the spec. */
export function LawyerPanel({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
      <p className="text-eyebrow text-brand-ink">When to speak to a lawyer</p>
      <div className="mt-4">
        <TickList items={items} tone="positive" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Link
          href="/lawyers"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Find a lawyer
        </Link>
        <Link
          href="/legal-help/problem"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
        >
          Describe your problem
        </Link>
      </div>
    </div>
  );
}

/**
 * Sources and editorial metadata, rendered together so credibility is one
 * block rather than scattered signals.
 */
export function SourcePanel({
  meta,
  instrument,
  amendmentNote,
}: {
  meta: EditorialMeta;
  instrument?: string;
  amendmentNote?: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
      <p className="text-eyebrow text-muted-foreground">Sources and review</p>
      <dl className="mt-4 space-y-3 text-[0.85rem]">
        {instrument && (
          <div>
            <dt className="font-extrabold text-foreground">Instrument</dt>
            <dd className="mt-0.5 text-muted-foreground">{instrument}</dd>
          </div>
        )}
        <div>
          <dt className="font-extrabold text-foreground">Content status</dt>
          <dd className="mt-1">
            <ReviewBadge meta={meta} />
          </dd>
        </div>
        <div>
          <dt className="font-extrabold text-foreground">Last reviewed</dt>
          <dd className="mt-0.5 text-muted-foreground">{meta.lastReviewed}</dd>
        </div>
        <div>
          <dt className="font-extrabold text-foreground">Reviewed by</dt>
          <dd className="mt-0.5 text-muted-foreground">
            {meta.reviewedBy ??
              "Not yet reviewed by a named legal practitioner"}
          </dd>
        </div>
        {amendmentNote && (
          <div>
            <dt className="font-extrabold text-foreground">Amendment status</dt>
            <dd className="mt-0.5 text-muted-foreground">{amendmentNote}</dd>
          </div>
        )}
      </dl>
      {meta.source && (
        <SourceReference source={meta.source} className="mt-5 border-t border-hairline pt-4" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Content graph                                                               */
/* -------------------------------------------------------------------------- */

/** Related content across every type — the spec's content graph, rendered. */
export function RelatedContent({
  items,
  title = "Related across the platform",
  description,
}: {
  items: RelatedItem[];
  title?: string;
  description?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      id="related"
      className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] border-t border-hairline pt-8"
      aria-label="Related content"
    >
      <h2 className="text-h3 text-foreground">{title}</h2>
      {description && (
        <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex h-full gap-4 rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-brand-ink">
                <Icon name={item.icon} className="size-4" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="text-eyebrow block text-muted-foreground">
                  {item.group}
                </span>
                <span className="mt-1.5 block text-[0.93rem] leading-snug font-extrabold text-foreground">
                  {item.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-[0.83rem] leading-relaxed text-muted-foreground">
                  {item.summary}
                </span>
              </span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Aside table of contents for long knowledge pages. */
export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-hairline bg-card p-5">
      <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
        <BookOpen className="size-3.5" />
        On this page
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[0.86rem] font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Two-column knowledge layout: article left, sticky aside right. */
export function KnowledgeLayout({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside: React.ReactNode;
}) {
  return (
    <div className="rail grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14 lg:py-16">
      <div className="min-w-0 space-y-10">{children}</div>
      <aside className="space-y-4 lg:sticky lg:top-[calc(var(--chrome-h)+1.5rem)] lg:self-start">
        {aside}
      </aside>
    </div>
  );
}

/** Shared empty state, so no hub ever renders as an unfinished blank. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline bg-surface p-8 text-center sm:p-12">
      <p className="text-h4 text-foreground">{title}</p>
      <p className="mx-auto mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
