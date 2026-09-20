import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SafetyCard } from "@/components/site/cards";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  LawyerPanel,
  OnThisPage,
  PageHeader,
  RelatedContent,
  SourcePanel,
  TickList,
} from "@/components/site/knowledge";
import { SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

/**
 * Every published record is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status - rather than a page that streams a 200 and then
 * renders not-found UI. Revisit when content comes from Convex at request time.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = await getContent().getSafetyGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/stay-safe/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = await getContent().getSafetyGuide(slug);
  if (!guide) return { title: "Guide not found" };

  return {
    title: `${guide.title} — Stay Safe`,
    description: guide.summary,
    alternates: { canonical: `/stay-safe/${guide.slug}` },
  };
}

const sections = [
  { id: "look-for", label: "What to look for" },
  { id: "red-flags", label: "Red flags" },
  { id: "questions", label: "Questions to ask" },
  { id: "stop", label: "When to stop" },
  { id: "related", label: "Related content" },
];

export default async function SafetyGuidePage(
  props: PageProps<"/stay-safe/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const guide = await content.getSafetyGuide(slug);
  if (!guide) notFound();

  const [related, siblings] = await Promise.all([
    content.getRelated(guide.related),
    guide.series ? content.getSafetyGuides(guide.series) : Promise.resolve([]),
  ]);

  const restOfSeries = siblings.filter((item) => item.slug !== guide.slug);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Stay Safe", href: "/stay-safe" },
          { label: guide.title },
        ]}
        eyebrow={guide.series ? `Stay Safe · ${guide.series}` : "Stay Safe"}
        title={guide.title}
        lede={guide.summary}
        meta={<CredibilityRow meta={guide.meta} kind="Prevention guide" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-brand-ink">
          The moment: {guide.risk}
        </p>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={guide.meta} />
          </>
        }
      >
        <ContentBlock id="look-for" title="What to look for">
          <TickList items={guide.whatToLookFor} tone="positive" />
        </ContentBlock>

        <ContentBlock
          id="red-flags"
          title="Red flags"
          description="None of these is proof of bad faith on its own. Two or three together is a reason to slow down."
        >
          <TickList items={guide.redFlags} tone="negative" />
        </ContentBlock>

        <ContentBlock
          id="questions"
          title="Questions to ask"
          description="Plain questions, asked before you commit. A straight answer costs nothing to give."
        >
          <ol className="space-y-3">
            {guide.questionsToAsk.map((question, index) => (
              <li
                key={question}
                className="flex gap-4 rounded-xl border border-hairline bg-card p-4"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-[0.75rem] font-extrabold text-brand-ink">
                  {index + 1}
                </span>
                <span className="text-[0.93rem] leading-relaxed text-foreground">
                  {question}
                </span>
              </li>
            ))}
          </ol>
        </ContentBlock>

        <ContentBlock id="stop" title="Stop and get professional advice if">
          <LawyerPanel items={guide.stopAndGetHelp} />
        </ContentBlock>

        {restOfSeries.length > 0 && (
          <section className="border-t border-hairline pt-8">
            <SectionHeader
              eyebrow={`More from ${guide.series}`}
              title="The rest of the series"
              action={{ label: "All Stay Safe guides", href: "/stay-safe" }}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {restOfSeries.map((item) => (
                <div key={item.id} className="flex">
                  <SafetyCard guide={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
