import Link from "next/link";
import { ArrowUpRight, FileText, Landmark, Scale } from "lucide-react";
import { cn } from "cn";
import type { ConstitutionSection } from "@/lib/content/types";
import type { ConstitutionChapter } from "@/lib/content/constitution";

/** The chapter a section belongs to, as a URL segment. */
export function chapterHref(numeral: string): string {
  return `/constitution/chapter-${numeral.toLowerCase()}`;
}

/** "chapter-iv" -> "IV". Returns null for anything that is not a chapter. */
export function parseChapterSlug(slug: string): string | null {
  const match = /^chapter-([ivx]+)$/i.exec(slug);
  return match ? match[1].toUpperCase() : null;
}

/**
 * One section, rendered as the official-text / plain-language split the spec
 * requires (section 30: "the distinction between official text and educational
 * interpretation must remain obvious").
 *
 * The left pane never contains the words of the Constitution. It names the
 * section and says where the text lives; the right pane is labelled as our
 * explanation. The distinction is structural — two panes, two labels — rather
 * than a disclaimer somebody has to remember to add.
 */
export function SectionPanel({
  section,
  className,
}: {
  section: ConstitutionSection;
  className?: string;
}) {
  return (
    <article
      id={`s-${section.number}`}
      className={cn(
        "scroll-mt-[calc(var(--chrome-h)+1.5rem)] grid w-full gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]",
        className
      )}
    >
      <div className="bg-surface p-5">
        <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
          <Scale className="size-3.5" />
          Official text
        </p>
        <p className="mt-3 font-mono text-[0.8rem] text-muted-foreground">
          Section {section.number} · Chapter {section.chapter}
        </p>
        <h3 className="mt-2 text-[0.98rem] leading-snug font-extrabold text-foreground">
          {section.heading}
        </h3>
        <p className="mt-3 text-[0.78rem] leading-relaxed text-muted-foreground">
          We do not reproduce the wording. Read section {section.number} in the
          official text of the Constitution as amended.
        </p>
      </div>

      <div className="bg-card p-5">
        <p className="text-eyebrow flex items-center gap-2 text-brand-ink">
          <FileText className="size-3.5" />
          Plain language — our explanation
        </p>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
          {section.plainLanguage}
        </p>

        {section.qualifications && section.qualifications.length > 0 && (
          <div className="mt-4 rounded-xl border border-hairline bg-surface p-4">
            <p className="text-eyebrow text-muted-foreground">
              The section&rsquo;s own qualifications
            </p>
            <ul className="mt-2.5 space-y-2">
              {section.qualifications.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[0.84rem] leading-relaxed text-muted-foreground"
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
        )}
      </div>
    </article>
  );
}

/** A chapter, as a card on the explorer index. */
export function ChapterCard({
  chapter,
  sectionCount,
}: {
  chapter: ConstitutionChapter;
  sectionCount: number;
}) {
  return (
    <article className="group relative flex w-full flex-col rounded-2xl border border-hairline bg-card p-6 transition-colors hover:border-primary/45">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
          <Landmark className="size-[1.15rem]" strokeWidth={1.9} />
        </span>
        <span className="text-eyebrow text-brand-ink">
          Chapter {chapter.numeral}
        </span>
      </div>

      <h3 className="text-h4 mt-4 text-foreground">
        <Link href={chapterHref(chapter.numeral)} className="link-underline">
          <span className="absolute inset-0" aria-hidden />
          {chapter.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">
        {chapter.summary}
      </p>

      <p className="mt-5 text-[0.82rem] font-bold text-muted-foreground">
        {sectionCount > 0
          ? `${sectionCount} section${sectionCount === 1 ? "" : "s"} explained`
          : "Structure only — no sections explained yet"}
      </p>
    </article>
  );
}

/**
 * The notice that keeps the explorer honest. Shown on the index and on every
 * chapter page.
 */
export function ConstitutionNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6",
        className
      )}
    >
      <p className="text-eyebrow text-brand-ink">Read the words</p>
      <h2 className="text-h4 mt-3 text-foreground">
        This explorer maps the Constitution. It is not the Constitution.
      </h2>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        Nothing here reproduces the operative text. Every section is shown as two
        panes — what the section is, and our plain-language explanation of it —
        so the two can never be mistaken for each other. The Constitution has
        also been altered several times since 1999.
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        Where the precise wording matters — and in a constitutional argument it
        always does — read the official text of the Constitution as amended, and
        take advice on how the courts have interpreted the provision you are
        relying on.
      </p>
      <Link
        href="/know-the-law/amendments"
        className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-foreground"
      >
        <span className="link-underline">
          Track the alterations and amendments
        </span>
        <ArrowUpRight className="size-3.5 text-brand-ink" />
      </Link>
    </div>
  );
}
