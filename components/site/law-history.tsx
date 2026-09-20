import Link from "next/link";
import { ArrowUpRight, History } from "lucide-react";
import { cn } from "cn";
import { Pill } from "./primitives";
import type { AmendmentKind, LawHistory, LawVersion } from "@/lib/content/types";

const kindLabels: Record<AmendmentKind, string> = {
  enactment: "Enacted",
  amendment: "Amended",
  "repeal-and-re-enactment": "Repealed and replaced",
  alteration: "Altered",
  "subsidiary-instrument": "Instrument made under it",
};

export function AmendmentKindPill({ kind }: { kind: AmendmentKind }) {
  return <Pill tone="outline">{kindLabels[kind]}</Pill>;
}

/**
 * The version history of one instrument, newest first (spec section 56).
 *
 * Superseded versions are rendered, not hidden behind a toggle. A reader who
 * has an old copy of an Act in their hand needs to see where it sits in the
 * history — telling them only about the current version is how people end up
 * relying confidently on a repealed statute.
 */
export function VersionTimeline({
  versions,
  className,
}: {
  versions: LawVersion[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-4", className)}>
      {versions.map((version) => (
        <li
          key={version.id}
          className={cn(
            "relative rounded-2xl border p-5 sm:p-6",
            version.current
              ? "border-primary/35 bg-primary/8"
              : "border-hairline bg-card"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={version.current ? "brand" : "muted"}>
              {version.effective}
            </Pill>
            <AmendmentKindPill kind={version.kind} />
            {version.current && <Pill tone="brand">In force</Pill>}
          </div>

          <h3 className="text-[1rem] mt-3 leading-snug font-extrabold text-foreground">
            {version.label}
          </h3>

          <div className="mt-3">
            <p className="text-eyebrow text-muted-foreground">What changed</p>
            <ul className="mt-2 space-y-2">
              {version.whatChanged.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[0.88rem] leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {version.significance && (
            <p className="mt-3 border-t border-hairline pt-3 text-[0.86rem] leading-relaxed text-brand-ink">
              {version.significance}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * The compact form used in an aside on a law page: what is in force, how many
 * versions came before, and a link into the tracker.
 */
export function AmendmentSummary({
  history,
  className,
}: {
  history: LawHistory;
  className?: string;
}) {
  const current = history.versions.find((version) => version.current);
  const superseded = history.versions.length - (current ? 1 : 0);

  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-5 sm:p-6",
        className
      )}
    >
      <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
        <History className="size-3.5" />
        Version history
      </p>

      <dl className="mt-4 space-y-3 text-[0.85rem]">
        <div>
          <dt className="font-extrabold text-foreground">Currently in force</dt>
          <dd className="mt-0.5 text-muted-foreground">
            {current
              ? `${current.label} (${current.effective})`
              : "Not stated — we would rather leave this blank than guess."}
          </dd>
        </div>
        <div>
          <dt className="font-extrabold text-foreground">Earlier versions</dt>
          <dd className="mt-0.5 text-muted-foreground">
            {superseded > 0
              ? `${superseded} superseded version${superseded === 1 ? "" : "s"}, all kept on record.`
              : "None recorded."}
          </dd>
        </div>
        <div>
          <dt className="font-extrabold text-foreground">
            Where the current text lives
          </dt>
          <dd className="mt-0.5 text-muted-foreground">
            {history.whereToFindIt}
          </dd>
        </div>
      </dl>

      <Link
        href={`/know-the-law/amendments#${history.lawSlug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-bold text-foreground"
      >
        <span className="link-underline">See the full history</span>
        <ArrowUpRight className="size-3.5 text-brand-ink" />
      </Link>
    </div>
  );
}

/** One instrument on the amendment tracker: heading, timeline, source note. */
export function HistoryBlock({ history }: { history: LawHistory }) {
  return (
    <section
      id={history.lawSlug}
      className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] rounded-2xl border border-hairline bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-eyebrow text-brand-ink">
            {history.versions.length} recorded version
            {history.versions.length === 1 ? "" : "s"}
          </p>
          <h2 className="text-h3 mt-2 text-foreground">{history.instrument}</h2>
        </div>
        <Link
          href={`/know-the-law/${history.category}/${history.lawSlug}`}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-hairline bg-card px-4 text-[0.83rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
        >
          Read the explainer
          <ArrowUpRight className="size-3.5 text-brand-ink" />
        </Link>
      </div>

      <VersionTimeline versions={history.versions} className="mt-6" />

      <p className="mt-5 rounded-xl border border-hairline bg-card p-4 text-[0.85rem] leading-relaxed text-muted-foreground">
        <span className="font-extrabold text-foreground">
          Where to find the current text:{" "}
        </span>
        {history.whereToFindIt}
      </p>
    </section>
  );
}
