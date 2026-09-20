import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ChapterCard,
  ConstitutionNotice,
  SectionPanel,
  chapterHref,
} from "@/components/site/constitution";
import {
  FacetGrid,
  type Facet,
  type FacetItem,
} from "@/components/site/facet-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";
import { fundamentalRights } from "@/lib/content/constitution";

export const metadata: Metadata = {
  title: "Constitution Explorer — chapters, sections and plain language",
  description:
    "Search the Constitution of the Federal Republic of Nigeria 1999 (as amended) by chapter and section, with a plain-language explanation of each section shown beside — never instead of — the official text.",
  alternates: { canonical: "/constitution" },
};

export default async function ConstitutionPage() {
  const content = getContent();
  const [chapters, sections] = await Promise.all([
    content.getConstitutionChapters(),
    content.getConstitutionSections(),
  ]);

  const countFor = (numeral: string) =>
    sections.filter((section) => section.chapter === numeral).length;

  const chapterFacet: Facet[] = [
    {
      id: "chapter",
      label: "Chapter",
      options: [...new Set(sections.map((section) => section.chapter))].map(
        (numeral) => ({
          value: numeral,
          label: `Chapter ${numeral} — ${
            chapters.find((chapter) => chapter.numeral === numeral)?.title ??
            numeral
          }`,
        })
      ),
    },
  ];

  const items: FacetItem[] = sections.map((section) => ({
    id: section.id,
    tags: { chapter: [section.chapter] },
    text: `section ${section.number} s. ${section.number} ${section.heading} ${section.plainLanguage} chapter ${section.chapter}`,
    node: <SectionPanel section={section} />,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Know the Law", href: "/know-the-law" },
          { label: "The Constitution" },
        ]}
        eyebrow="Constitution Explorer"
        title="The document every other Nigerian law answers to"
        lede="The Constitution of the Federal Republic of Nigeria 1999 (as amended) is supreme: where another law is inconsistent with it, the Constitution prevails. Search it by chapter and by section — each one paired with a plain-language explanation that is labelled as ours, never presented as the text."
      />

      {/* Search ------------------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Search"
            title={`${sections.length} sections, explained section by section`}
            description="Search a section number, a phrase, or what you are actually trying to find out. This is not every section of the Constitution — it is the ones readers meet, and we would rather say so than imply completeness."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <FacetGrid
            label="Search the Constitution"
            placeholder="Try “35”, “fair hearing”, or “can the police search my phone”…"
            facets={chapterFacet}
            items={items}
            className="gap-5"
            emptyTitle="No section matched"
            emptyBody="Try a section number on its own, or the everyday words for what you are looking for — “arrest”, “privacy”, “property”."
          />
        </Reveal>
      </Section>

      {/* Chapters ----------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Structure"
            title="Eight chapters, each with its own job"
            description="Knowing which chapter a question belongs to is most of the work of finding the answer."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {chapters.map((chapter) => (
            <RevealItem key={chapter.numeral} className="flex">
              <ChapterCard
                chapter={chapter}
                sectionCount={countFor(chapter.numeral)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Chapter IV at a glance --------------------------------------------- */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Chapter IV"
            title="The rights, section by section"
            description="These are the rights a person can go to the High Court to enforce. Each is stated generally — the Constitution attaches its own qualifications to several of them."
            action={{ label: "Open Chapter IV", href: chapterHref("IV") }}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
            <ul>
              {fundamentalRights.map((right) => (
                <li
                  key={right.section}
                  className="border-b border-hairline last:border-b-0"
                >
                  <div className="flex flex-col gap-2 p-5 sm:flex-row sm:gap-6 sm:p-6">
                    <p className="text-eyebrow w-24 shrink-0 text-brand-ink">
                      Section {right.section}
                    </p>
                    <div className="min-w-0">
                      <h3 className="text-[0.98rem] font-extrabold text-foreground">
                        {right.title}
                      </h3>
                      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                        {right.summary}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                        <Link
                          href={`${chapterHref("IV")}#s-${right.section}`}
                          className="inline-flex text-[0.83rem] font-bold text-foreground link-underline"
                        >
                          Explain section {right.section}
                        </Link>
                        {right.href && (
                          <Link
                            href={right.href}
                            className="inline-flex text-[0.83rem] font-bold text-foreground link-underline"
                          >
                            Read the guide
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <ConstitutionNotice />
        </Reveal>

        <Reveal delay={0.12} className="mt-8">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/your-rights"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Your Rights
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/cases"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              Case Law Explorer
            </Link>
            <Link
              href="/know-the-law"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              The law library
            </Link>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
