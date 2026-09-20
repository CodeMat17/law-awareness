import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ConstitutionNotice,
  SectionPanel,
  chapterHref,
  parseChapterSlug,
} from "@/components/site/constitution";
import {
  EmptyState,
  OnThisPage,
  PageHeader,
  RelatedContent,
} from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const chapters = await getContent().getConstitutionChapters();
  return chapters.map((chapter) => ({
    chapter: `chapter-${chapter.numeral.toLowerCase()}`,
  }));
}

export async function generateMetadata(
  props: PageProps<"/constitution/[chapter]">
): Promise<Metadata> {
  const { chapter: slug } = await props.params;
  const numeral = parseChapterSlug(slug);
  const chapter = numeral
    ? await getContent().getConstitutionChapter(numeral)
    : null;
  if (!chapter) return { title: "Chapter not found" };

  return {
    title: `Chapter ${chapter.numeral} — ${chapter.title}`,
    description: chapter.summary,
    alternates: { canonical: chapterHref(chapter.numeral) },
  };
}

export default async function ConstitutionChapterPage(
  props: PageProps<"/constitution/[chapter]">
) {
  const { chapter: slug } = await props.params;
  const numeral = parseChapterSlug(slug);
  if (!numeral) notFound();

  const content = getContent();
  const chapter = await content.getConstitutionChapter(numeral);
  if (!chapter) notFound();

  const sections = await content.getConstitutionSections(chapter.numeral);

  // The chapter's own cross-references, gathered from its sections, so a
  // reader arriving at Chapter IV sees the cases and guides it touches without
  // opening every section.
  const related = await content.getRelated(
    sections.reduce<{
      laws: string[];
      rights: string[];
      cases: string[];
      terms: string[];
    }>(
      (acc, section) => ({
        laws: [...new Set([...acc.laws, ...(section.related?.laws ?? [])])],
        rights: [...new Set([...acc.rights, ...(section.related?.rights ?? [])])],
        cases: [...new Set([...acc.cases, ...(section.related?.cases ?? [])])],
        terms: [...new Set([...acc.terms, ...(section.related?.terms ?? [])])],
      }),
      { laws: [], rights: [], cases: [], terms: [] }
    )
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "The Constitution", href: "/constitution" },
          { label: `Chapter ${chapter.numeral}` },
        ]}
        eyebrow={`Chapter ${chapter.numeral}`}
        title={chapter.title}
        lede={chapter.summary}
      >
        <ul className="mt-7 grid max-w-3xl gap-2 sm:grid-cols-2">
          {chapter.covers.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-[0.86rem] leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
              />
              {item}
            </li>
          ))}
        </ul>

        {chapter.href && (
          <Link
            href={chapter.href}
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {chapter.hrefLabel ?? "Related section"}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </PageHeader>

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        {sections.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
            <div className="min-w-0">
              <Reveal>
                <SectionHeader
                  eyebrow="Section by section"
                  title={`${sections.length} section${sections.length === 1 ? "" : "s"} explained`}
                  description="Each section is shown twice over: what the section is and where its text lives, beside our plain-language explanation of it."
                />
              </Reveal>
              <div className="mt-10 space-y-5">
                {sections.map((section, index) => (
                  <Reveal key={section.id} delay={Math.min(index * 0.03, 0.18)}>
                    <SectionPanel section={section} />
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.08} className="mt-10">
                <ConstitutionNotice />
              </Reveal>

              <div className="mt-10">
                <RelatedContent
                  items={related}
                  title="What this chapter touches"
                  description="The statutes, rights guides, decided cases and plain-language terms the sections above connect to."
                />
              </div>

            </div>

            <aside className="lg:sticky lg:top-[calc(var(--chrome-h)+1.5rem)] lg:self-start">
              <OnThisPage
                items={sections.map((section) => ({
                  id: `s-${section.number}`,
                  label: `s. ${section.number} — ${section.heading}`,
                }))}
              />
            </aside>
          </div>
        ) : (
          <>
            <Reveal>
              <EmptyState
                title="This chapter is mapped, not yet explained section by section"
                body="The chapter's structure and subject matter are above. Plain-language explanations of its individual sections are being written, and each one will appear here beside a pointer to the official text rather than in place of it."
                action={{ label: "Search every section", href: "/constitution" }}
              />
            </Reveal>
            <Reveal delay={0.06} className="mt-8">
              <ConstitutionNotice />
            </Reveal>
          </>
        )}
      </Section>
    </>
  );
}
