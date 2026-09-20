import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ContentBlock,
  CredibilityRow,
  DoAndDont,
  KnowledgeLayout,
  LawyerPanel,
  Misconceptions,
  OnThisPage,
  PageHeader,
  RelatedContent,
  SourcePanel,
  StepList,
  TickList,
} from "@/components/site/knowledge";
import { SaveButton } from "@/components/account/save-button";
import { getContent } from "@/lib/content/repository";

/**
 * Every published record is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status - rather than a page that streams a 200 and then
 * renders not-found UI. Revisit when content comes from Convex at request time.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = await getContent().getRightGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/your-rights/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = await getContent().getRightGuide(slug);
  if (!guide) return { title: "Rights guide not found" };

  return {
    title: `${guide.title} — Your Rights`,
    description: guide.summary,
    alternates: { canonical: `/your-rights/${guide.slug}` },
  };
}

const sections = [
  { id: "protects", label: "What the law protects" },
  { id: "steps", label: "Working through the situation" },
  { id: "do-and-dont", label: "Do now, and avoid" },
  { id: "misconceptions", label: "Common misconceptions" },
  { id: "lawyer", label: "When to see a lawyer" },
  { id: "related", label: "Related content" },
];

export default async function RightGuidePage(
  props: PageProps<"/your-rights/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const guide = await content.getRightGuide(slug);
  if (!guide) notFound();

  const related = await content.getRelated(guide.related);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Your Rights", href: "/your-rights" },
          { label: guide.title },
        ]}
        eyebrow={guide.category}
        title={guide.title}
        lede={guide.summary}
        meta={<CredibilityRow meta={guide.meta} kind="Rights guide" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-brand-ink">
          Situation: {guide.situation}
        </p>
        <div className="mt-6">
          <SaveButton
            target={{
              kind: "right",
              title: guide.title,
              summary: guide.summary,
              group: `Your Rights · ${guide.category}`,
              href: `/your-rights/${guide.slug}`,
            }}
          />
        </div>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={guide.meta} />
          </>
        }
      >
        <ContentBlock
          id="protects"
          title="What the law protects here"
          description="Stated generally. The exact position always depends on the facts."
        >
          <TickList items={guide.protects} tone="positive" />
        </ContentBlock>

        <ContentBlock id="steps" title="Working through the situation">
          <StepList steps={guide.steps} />
        </ContentBlock>

        <ContentBlock id="do-and-dont" title="Do now, and avoid">
          <DoAndDont shouldDo={guide.doNow} shouldNotDo={guide.avoid} />
        </ContentBlock>

        <ContentBlock id="misconceptions" title="Common misconceptions">
          <Misconceptions items={guide.misconceptions} />
        </ContentBlock>

        <ContentBlock id="lawyer" title="When to contact a lawyer">
          <LawyerPanel items={guide.whenToSeeALawyer} />
        </ContentBlock>

        <RelatedContent
          items={related}
          description="The law behind this situation, and the practical guides that sit next to it."
        />
      </KnowledgeLayout>
    </>
  );
}
