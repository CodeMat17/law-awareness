import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const topics = await getContent().getComplianceTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata(
  props: PageProps<"/business/compliance/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const topic = await getContent().getComplianceTopic(slug);
  if (!topic) return { title: "Topic not found" };

  return {
    title: `${topic.title} — Compliance Centre`,
    description: topic.summary,
    alternates: { canonical: `/business/compliance/${topic.slug}` },
  };
}

const sections = [
  { id: "covers", label: "What it covers" },
  { id: "applies", label: "When it becomes relevant" },
  { id: "practice", label: "Good practice" },
  { id: "gaps", label: "Common gaps" },
  { id: "lawyer", label: "When to involve a lawyer" },
  { id: "related", label: "Related content" },
];

export default async function ComplianceTopicPage(
  props: PageProps<"/business/compliance/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const topic = await content.getComplianceTopic(slug);
  if (!topic) notFound();

  const related = await content.getRelated(topic.related);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Compliance Centre", href: "/business/compliance" },
          { label: topic.title },
        ]}
        eyebrow="Compliance Centre"
        title={topic.title}
        lede={topic.summary}
        meta={<CredibilityRow meta={topic.meta} kind="Compliance topic" />}
      />

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={topic.meta} />
          </>
        }
      >
        <ContentBlock
          id="covers"
          title="What it covers"
          description="The scope of this area, in general terms."
          className="border-t-0 pt-0"
        >
          <TickList items={topic.whatItCovers} />
        </ContentBlock>

        <ContentBlock
          id="applies"
          title="When it becomes relevant"
          description="Circumstances in which this area usually matters. This is not a test of whether an obligation applies to you — that depends on your specific situation and should be confirmed with the relevant authority."
        >
          <TickList items={topic.appliesWhen} />
        </ContentBlock>

        <ContentBlock
          id="practice"
          title="Good practice"
          description="Practices businesses commonly put in place. Educational, not prescriptive."
        >
          <TickList items={topic.goodPractice} tone="positive" />
        </ContentBlock>

        <ContentBlock
          id="gaps"
          title="Common gaps"
          description="How this area usually goes wrong — rarely through bad faith, and almost always through nobody owning it."
        >
          <TickList items={topic.commonGaps} tone="negative" />
        </ContentBlock>

        <ContentBlock id="lawyer" title="When to involve a lawyer">
          <LawyerPanel items={topic.whenToInvolveALawyer} />
        </ContentBlock>

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
