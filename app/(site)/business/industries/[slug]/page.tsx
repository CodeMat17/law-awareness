import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComplianceTopicCard, ThemeList } from "@/components/site/business";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  Prose,
  RelatedContent,
  SourcePanel,
} from "@/components/site/knowledge";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const hubs = await getContent().getIndustryHubs();
  return hubs.map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata(
  props: PageProps<"/business/industries/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const hub = await getContent().getIndustryHub(slug);
  if (!hub) return { title: "Industry not found" };

  return {
    title: `${hub.name} — industry legal hub`,
    description: hub.blurb,
    alternates: { canonical: `/business/industries/${hub.slug}` },
  };
}

const sections = [
  { id: "overview", label: "Why this sector differs" },
  { id: "themes", label: "Regulatory themes" },
  { id: "topics", label: "Compliance topics" },
  { id: "related", label: "Related content" },
];

export default async function IndustryHubPage(
  props: PageProps<"/business/industries/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const hub = await content.getIndustryHub(slug);
  if (!hub) notFound();

  const [related, allTopics] = await Promise.all([
    content.getRelated(hub.related),
    content.getComplianceTopics(),
  ]);

  /**
   * Topics are resolved from slugs and unresolved ones dropped, the same rule
   * the content graph uses - a hub can never render a dead link to a topic that
   * is unpublished or has been renamed.
   */
  const topics = hub.complianceTopics
    .map((topicSlug) => allTopics.find((topic) => topic.slug === topicSlug))
    .filter((topic) => topic !== undefined);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Industries", href: "/business/industries" },
          { label: hub.name },
        ]}
        eyebrow="Industry legal hub"
        title={hub.name}
        lede={hub.blurb}
        meta={<CredibilityRow meta={hub.meta} kind="Industry hub" />}
      />

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={hub.meta} />
          </>
        }
      >
        <ContentBlock
          id="overview"
          title="Why this sector differs"
          className="border-t-0 pt-0"
        >
          <Prose paragraphs={hub.overview} />
        </ContentBlock>

        <ContentBlock
          id="themes"
          title="Regulatory themes"
          description="Described in general terms. This is not a list of the authorisations your business needs — confirm those with the relevant regulator."
        >
          <ThemeList items={hub.regulatoryThemes} />
        </ContentBlock>

        {topics.length > 0 && (
          <ContentBlock
            id="topics"
            title="Compliance topics to read first"
            description="The areas of the Compliance Centre that matter most in this sector."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {topics.map((topic) => (
                <ComplianceTopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </ContentBlock>
        )}


        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
