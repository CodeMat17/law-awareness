import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportAndExplanation } from "@/components/site/business";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  RelatedContent,
  SourcePanel,
  TickList,
} from "@/components/site/knowledge";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const updates = await getContent().getRegulatoryUpdates();
  return updates.map((update) => ({ slug: update.slug }));
}

export async function generateMetadata(
  props: PageProps<"/business/regulatory-watch/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const update = await getContent().getRegulatoryUpdate(slug);
  if (!update) return { title: "Update not found" };

  return {
    title: `${update.title} — Regulatory Watch`,
    description: update.report[0],
    alternates: { canonical: `/business/regulatory-watch/${update.slug}` },
  };
}

const sections = [
  { id: "what-changed", label: "What changed and what it means" },
  { id: "affected", label: "Who is affected" },
  { id: "effective", label: "When it takes effect" },
  { id: "business", label: "For businesses" },
  { id: "individuals", label: "For individuals" },
  { id: "related", label: "Related content" },
];

export default async function RegulatoryUpdatePage(
  props: PageProps<"/business/regulatory-watch/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const [update, topics] = await Promise.all([
    content.getRegulatoryUpdate(slug),
    content.getAlertTopics(),
  ]);
  if (!update) notFound();

  const related = await content.getRelated(update.related);
  const topicLabel =
    topics.find((topic) => topic.slug === update.topic)?.label ?? "Update";

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Regulatory Watch", href: "/business/regulatory-watch" },
          { label: update.title },
        ]}
        eyebrow={`Regulatory Watch · ${topicLabel}`}
        title={update.title}
        meta={<CredibilityRow meta={update.meta} kind="Regulatory update" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-muted-foreground">
          Published {update.publishedAt}
        </p>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={update.meta} />
          </>
        }
      >
        <ContentBlock
          id="what-changed"
          title="What changed, and what it means"
          description="Reporting and explanation are kept apart deliberately. The left pane is an account of what happened; the right is our reading of what it means."
          className="border-t-0 pt-0"
        >
          <ReportAndExplanation
            report={update.report}
            explanation={update.explanation}
          />
        </ContentBlock>

        <ContentBlock id="affected" title="Who is affected">
          <TickList items={update.whoIsAffected} />
        </ContentBlock>

        <ContentBlock id="effective" title="When it takes effect">
          <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-6">
            <p className="text-[0.93rem] leading-relaxed text-muted-foreground">
              {update.effectiveFrom}
            </p>
          </div>
          {update.guidanceNote && (
            <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/8 p-5">
              <p className="text-eyebrow text-brand-ink">
                Has implementation guidance changed?
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                {update.guidanceNote}
              </p>
            </div>
          )}
        </ContentBlock>

        <ContentBlock
          id="business"
          title="What businesses should consider"
          description="Considerations, not requirements. What actually applies depends on your circumstances."
        >
          <TickList items={update.businessConsiderations} tone="positive" />
        </ContentBlock>

        <ContentBlock id="individuals" title="What individuals should know">
          <TickList items={update.individualConsiderations} />
        </ContentBlock>


        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
