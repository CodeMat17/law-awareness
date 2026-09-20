import Link from "next/link";
import { ArrowRight, Gavel, ScrollText } from "lucide-react";
import { cn } from "cn";
import { Pill } from "./primitives";
import type {
  CaseRecord,
  CaseStanding,
  CourtLevel,
  CourtProfile,
} from "@/lib/content/types";

/* -------------------------------------------------------------------------- */
/* Court and standing                                                          */
/* -------------------------------------------------------------------------- */

/** Short court labels. The full names are long enough to break a card. */
const courtShortNames: Record<CourtLevel, string> = {
  "supreme-court": "Supreme Court",
  "court-of-appeal": "Court of Appeal",
  "federal-high-court": "Federal High Court",
  "state-high-court": "High Court",
  "national-industrial-court": "National Industrial Court",
  tribunal: "Tribunal",
};

export function courtShortName(court: CourtLevel): string {
  return courtShortNames[court];
}

const standingCopy: Record<
  CaseStanding,
  { label: string; body: string; tone: "brand" | "muted" | "outline" }
> = {
  followed: {
    label: "Followed",
    body: "The decision continues to be applied and is cited as good law.",
    tone: "brand",
  },
  distinguished: {
    label: "Distinguished since",
    body: "Later decisions have narrowed or qualified this, so the principle is not applied as broadly as its wording suggests.",
    tone: "outline",
  },
  "overtaken-by-statute": {
    label: "Overtaken by statute",
    body: "The framework it construed has been replaced or amended, so read it for its reasoning rather than as current law.",
    tone: "muted",
  },
  "position-not-stated": {
    label: "Standing not stated",
    body: "We have not established how this decision stands today, and would rather say so than guess.",
    tone: "outline",
  },
};

export function StandingBadge({
  standing,
  className,
}: {
  standing: CaseStanding;
  className?: string;
}) {
  const copy = standingCopy[standing];
  return (
    <Pill tone={copy.tone} className={className}>
      {copy.label}
    </Pill>
  );
}

/** The standing badge with the sentence that explains what it means. */
export function StandingPanel({ standing }: { standing: CaseStanding }) {
  const copy = standingCopy[standing];
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
      <p className="text-eyebrow text-muted-foreground">Standing today</p>
      <div className="mt-3">
        <StandingBadge standing={standing} />
      </div>
      <p className="mt-3 text-[0.86rem] leading-relaxed text-muted-foreground">
        {copy.body}
      </p>
      <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">
        A case is good law only until it is not. Before relying on any decision,
        check whether it has since been followed, distinguished, overruled or
        overtaken by legislation.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards and lists                                                             */
/* -------------------------------------------------------------------------- */

export function CaseCard({ record }: { record: CaseRecord }) {
  return (
    <article className="group relative flex w-full flex-col rounded-2xl border border-hairline bg-card p-6 transition-colors hover:border-primary/45">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand">{courtShortName(record.court)}</Pill>
        <Pill tone="outline">{record.year}</Pill>
        <StandingBadge standing={record.standing} />
      </div>

      <h3 className="text-h4 mt-4 text-foreground">
        <Link href={`/cases/${record.slug}`} className="link-underline">
          <span className="absolute inset-0" aria-hidden />
          {record.title}
        </Link>
      </h3>

      <p className="text-eyebrow mt-3 text-brand-ink">{record.issueTag}</p>
      <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">
        {record.keyPrinciple}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-bold text-foreground">
        Read the summary
        <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

/** The hierarchy, rendered as a ladder from the final court downwards. */
export function CourtLadder({ courts }: { courts: CourtProfile[] }) {
  return (
    <ol className="overflow-hidden rounded-2xl border border-hairline bg-card">
      {courts.map((court, index) => (
        <li
          key={court.id}
          className="flex gap-4 border-b border-hairline p-5 last:border-b-0 sm:p-6"
        >
          <span
            aria-hidden
            className="text-eyebrow mt-0.5 w-6 shrink-0 text-brand-ink"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="text-[0.98rem] font-extrabold text-foreground">
              {court.name}
            </h3>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
              {court.jurisdiction}
            </p>
            <p className="mt-2 text-[0.83rem] leading-relaxed text-brand-ink">
              {court.bindingEffect}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* The notice that makes this section honest                                   */
/* -------------------------------------------------------------------------- */

/**
 * Shown on the explorer and on every case page.
 *
 * The platform stores no citation, because a plausible-looking citation that
 * leads nowhere is worse than none — and case names circulate confidently, in
 * conversation and increasingly in text produced by software, with no decision
 * behind them. This panel says exactly what the reader is looking at.
 */
export function CaseSummaryNotice({
  className,
  whereToFindIt,
}: {
  className?: string;
  whereToFindIt?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6",
        className
      )}
    >
      <p className="text-eyebrow flex items-center gap-2 text-brand-ink">
        <ScrollText className="size-3.5" />
        What you are reading
      </p>
      <h2 className="text-h4 mt-3 text-foreground">
        An editorial summary, not the judgment — and deliberately without a
        citation
      </h2>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        Every case here is a real, reported Nigerian decision. What we publish is
        our summary of it in plain language. We do not print a law-report volume
        and page, because a citation that leads nowhere is worse than no citation
        at all — and we will not have this platform be the source of one.
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {whereToFindIt ??
          "Find the decision by its case name in a law report series or through the court's own record, read the judgment, and check whether it is still good law before you rely on it."}
      </p>
    </div>
  );
}

/** A compact heading strip for the case detail page. */
export function CaseMetaRow({ record }: { record: CaseRecord }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="brand">
        <Gavel className="size-3" />
        {courtShortName(record.court)}
      </Pill>
      <Pill tone="outline">{record.year}</Pill>
      <Pill tone="muted">{record.issueTag}</Pill>
      <StandingBadge standing={record.standing} />
    </div>
  );
}
