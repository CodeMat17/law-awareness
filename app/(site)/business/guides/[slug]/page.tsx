import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConsiderationList,
  GuideChecklist,
} from "@/components/site/business";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  LawyerPanel,
  OnThisPage,
  PageHeader,
  Prose,
  RelatedContent,
  SourcePanel,
  TickList,
} from "@/components/site/knowledge";
import { getContent } from "@/lib/content/repository";

/**
 * Every published guide is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status rather than a soft one. Same reasoning as the
 * Phase 2 detail routes.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const guides = await getContent().getBusinessGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/business/guides/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = await getContent().getBusinessGuide(slug);
  if (!guide) return { title: "Guide not found" };

  return {
    title: `${guide.title} — Business guides`,
    description: guide.summary,
    alternates: { canonical: `/business/guides/${guide.slug}` },
  };
}

const sections = [
  { id: "context", label: "The situation" },
  { id: "considerations", label: "Key legal considerations" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "red-flags", label: "Red flags" },
  { id: "checklist", label: "Checklist" },
  { id: "lawyer", label: "When to involve a lawyer" },
  { id: "related", label: "Related content" },
];

export default async function BusinessGuidePage(
  props: PageProps<"/business/guides/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const guide = await content.getBusinessGuide(slug);
  if (!guide) notFound();

  const related = await content.getRelated(guide.related);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Before You Do This", href: "/business/guides" },
          { label: guide.title },
        ]}
        eyebrow={`Before You Do This · ${guide.area}`}
        title={guide.title}
        lede={guide.summary}
        meta={<CredibilityRow meta={guide.meta} kind="Business guide" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-brand-ink">
          The situation: {guide.situation}
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
        <ContentBlock id="context" title="The situation" className="border-t-0 pt-0">
          <Prose paragraphs={guide.context} />
        </ContentBlock>

        <ContentBlock
          id="considerations"
          title="Key legal considerations"
          description="What the law is doing in this situation, and which instrument it sits under. These are general explanations, not an assessment of your circumstances."
        >
          <ConsiderationList items={guide.keyConsiderations} />
        </ContentBlock>

        <ContentBlock
          id="mistakes"
          title="Common mistakes"
          description="These are ordinary and usually well-intentioned. That is exactly why they are worth naming."
        >
          <TickList items={guide.commonMistakes} tone="negative" />
        </ContentBlock>

        <ContentBlock
          id="red-flags"
          title="Red flags"
          description="None of these is proof of bad faith on its own. Two or three together is a reason to slow down."
        >
          <TickList items={guide.redFlags} tone="negative" />
        </ContentBlock>

        <ContentBlock
          id="checklist"
          title={`Checklist — ${guide.checklist.length} points`}
          description="Work through these before you commit. They are educational prompts, not a compliance certification."
        >
          <GuideChecklist items={guide.checklist} />
        </ContentBlock>

        <ContentBlock id="lawyer" title="When to involve a lawyer">
          <LawyerPanel items={guide.whenToInvolveALawyer} />
        </ContentBlock>

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
