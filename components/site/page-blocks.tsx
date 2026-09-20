import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { paragraphs, parseItems, type PageBlock } from "@/lib/cms/blocks";

/**
 * Renders the blocks of a CMS-composed page.
 *
 * Each block maps onto components that already exist in components/site, so a
 * page assembled by an editor is indistinguishable from one that was written
 * by hand - same type scale, same rhythm, same reveal animations.
 *
 * An unrecognised block type renders nothing. Blocks outlive the code that
 * introduced them: a page composed before a block type was retired must still
 * render its remaining sections rather than crashing the route.
 */

type Tone = "default" | "surface" | "forest";

function tone(block: PageBlock): Tone {
  const value = block.data.tone;
  return value === "surface" || value === "forest" ? value : "default";
}

/** Paragraph stack shared by the prose and statement blocks. */
function Paragraphs({
  value,
  className,
}: {
  value: string | undefined;
  className?: string;
}) {
  const parts = paragraphs(value);
  if (parts.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {parts.map((paragraph, index) => (
        <p
          key={index}
          className="text-body-lg leading-relaxed text-muted-foreground"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/**
 * A block's heading trio. Rendered only when there is a heading - a block that
 * is purely body copy should not leave an empty header eating vertical space.
 */
function Heading({ block }: { block: PageBlock }) {
  if (!block.data.heading) return null;

  return (
    <Reveal>
      <SectionHeader
        eyebrow={block.data.eyebrow ?? ""}
        title={block.data.heading}
        description={block.data.description || undefined}
      />
    </Reveal>
  );
}

function ProseBlock({ block }: { block: PageBlock }) {
  const hasSecondColumn = paragraphs(block.data.bodyRight).length > 0;

  return (
    <Section tone={tone(block)}>
      <Heading block={block} />
      <Reveal delay={0.06} className={block.data.heading ? "mt-10" : undefined}>
        <div
          className={cn("grid gap-6", hasSecondColumn && "lg:grid-cols-2")}
        >
          <Paragraphs value={block.data.bodyLeft} />
          {hasSecondColumn && <Paragraphs value={block.data.bodyRight} />}
        </div>
      </Reveal>
    </Section>
  );
}

function CardsBlock({ block }: { block: PageBlock }) {
  const items = parseItems(block.data.items);
  const columns = block.data.columns === "2" ? 2 : 3;

  return (
    <Section tone={tone(block)}>
      <Heading block={block} />
      <RevealGroup
        className={cn(
          "mt-10 grid gap-5 sm:grid-cols-2",
          columns === 3 && "xl:grid-cols-3"
        )}
      >
        {items.map((item, index) => (
          <RevealItem key={index} className="flex">
            <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
              <h3 className="text-h4 text-foreground">{item.title}</h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function LabelsBlock({ block }: { block: PageBlock }) {
  const items = parseItems(block.data.items);

  return (
    <Section tone={tone(block)}>
      <Heading block={block} />
      <RevealGroup
        className={cn(
          "mt-10 grid gap-5",
          items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        )}
      >
        {items.map((item, index) => (
          <RevealItem key={index} className="flex">
            <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
              <p className="text-eyebrow text-brand-ink">{item.title}</p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function CtaBlock({ block }: { block: PageBlock }) {
  const { eyebrow, heading, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref } =
    block.data;

  return (
    <Section tone={tone(block)}>
      <Reveal>
        <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
          {eyebrow && <p className="text-eyebrow text-brand-ink">{eyebrow}</p>}
          <h2 className={cn("text-h3 text-foreground", eyebrow && "mt-3")}>
            {heading}
          </h2>
          {body && (
            <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
              {body}
            </p>
          )}
          {(primaryLabel || secondaryLabel) && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {primaryLabel && primaryHref && (
                <Link
                  href={primaryHref}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </Link>
              )}
              {secondaryLabel && secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

function StatementBlock({ block }: { block: PageBlock }) {
  return (
    <Section tone={tone(block)}>
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          {block.data.eyebrow && (
            <p className="text-eyebrow text-brand-ink">{block.data.eyebrow}</p>
          )}
          <Paragraphs value={block.data.body} className="mt-4" />
          {block.data.attribution && (
            <p className="mt-6 text-[0.85rem] font-bold text-muted-foreground">
              {block.data.attribution}
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case "prose":
            return <ProseBlock key={block.key} block={block} />;
          case "cards":
            return <CardsBlock key={block.key} block={block} />;
          case "labels":
            return <LabelsBlock key={block.key} block={block} />;
          case "cta":
            return <CtaBlock key={block.key} block={block} />;
          case "statement":
            return <StatementBlock key={block.key} block={block} />;
          // `policySection` is not rendered here: platform documents use the
          // dedicated reading layout in components/site/policy.tsx, which
          // numbers its sections and carries the sibling-document strip.
          default:
            return null;
        }
      })}
    </>
  );
}
