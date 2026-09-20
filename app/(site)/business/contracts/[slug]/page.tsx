import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClauseTable } from "@/components/site/business";
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
  const contracts = await getContent().getContractTypes();
  return contracts.map((contract) => ({ slug: contract.slug }));
}

export async function generateMetadata(
  props: PageProps<"/business/contracts/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const contract = await getContent().getContractType(slug);
  if (!contract) return { title: "Contract not found" };

  return {
    title: `${contract.name} — Contract Knowledge Centre`,
    description: contract.whatItIs,
    alternates: { canonical: `/business/contracts/${contract.slug}` },
  };
}

const sections = [
  { id: "what-it-is", label: "What it is" },
  { id: "used-when", label: "When it is used" },
  { id: "clauses", label: "Important clauses" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "warnings", label: "Warning signs" },
  { id: "review", label: "When to get legal review" },
  { id: "related", label: "Related content" },
];

export default async function ContractTypePage(
  props: PageProps<"/business/contracts/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const contract = await content.getContractType(slug);
  if (!contract) notFound();

  const related = await content.getRelated(contract.related);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Contracts", href: "/business/contracts" },
          { label: contract.name },
        ]}
        eyebrow={`Contract Knowledge Centre · ${contract.family}`}
        title={contract.name}
        lede={contract.whatItIs}
        meta={<CredibilityRow meta={contract.meta} kind="Contract explainer" />}
      />

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={contract.meta} />
          </>
        }
      >
        <ContentBlock
          id="what-it-is"
          title="Why it matters"
          className="border-t-0 pt-0"
        >
          <p className="text-[1rem] leading-[1.75] text-muted-foreground">
            {contract.whyItMatters}
          </p>
        </ContentBlock>

        <ContentBlock id="used-when" title="When it is commonly used">
          <TickList items={contract.commonlyUsedWhen} />
        </ContentBlock>

        <ContentBlock
          id="clauses"
          title="Important clauses"
          description="What each clause is for, and what to look at in the wording you have been given."
        >
          <ClauseTable clauses={contract.importantClauses} />
        </ContentBlock>

        <ContentBlock id="mistakes" title="Common mistakes">
          <TickList items={contract.commonMistakes} tone="negative" />
        </ContentBlock>

        <ContentBlock
          id="warnings"
          title="Warning signs"
          description="Any one of these can have an innocent explanation. Ask for it before you sign."
        >
          <TickList items={contract.warningSigns} tone="negative" />
        </ContentBlock>

        <ContentBlock id="review" title="When legal review is appropriate">
          <LawyerPanel items={contract.whenLegalReviewIsAppropriate} />
        </ContentBlock>

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
