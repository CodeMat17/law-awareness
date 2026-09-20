import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryCard } from "@/components/site/cards";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  RelatedContent,
  SourcePanel,
} from "@/components/site/knowledge";
import { Pill, SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

/**
 * Every published record is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status - rather than a page that streams a 200 and then
 * renders not-found UI. Revisit when content comes from Convex at request time.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const terms = await getContent().getGlossaryTerms();
  return terms.map((term) => ({ term: term.slug }));
}

export async function generateMetadata(
  props: PageProps<"/glossary/[term]">
): Promise<Metadata> {
  const { term: slug } = await props.params;
  const term = await getContent().getGlossaryTerm(slug);
  if (!term) return { title: "Term not found" };

  return {
    title: `${term.term} — Law in Plain Language`,
    description: term.definition,
    alternates: { canonical: `/glossary/${term.slug}` },
  };
}

const sections = [
  { id: "example", label: "Example" },
  { id: "why", label: "Why it matters" },
  { id: "related", label: "Related content" },
];

export default async function GlossaryTermPage(
  props: PageProps<"/glossary/[term]">
) {
  const { term: slug } = await props.params;
  const content = getContent();
  const term = await content.getGlossaryTerm(slug);
  if (!term) notFound();

  const [related, allTerms] = await Promise.all([
    content.getRelated(term.related),
    content.getGlossaryTerms(),
  ]);

  const others = allTerms.filter((item) => item.slug !== term.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Glossary", href: "/glossary" },
          { label: term.term },
        ]}
        eyebrow="Law in plain language"
        title={term.term}
        lede={term.definition}
        meta={<CredibilityRow meta={term.meta} kind="Glossary entry" />}
      >
        {term.alsoKnownAs && term.alsoKnownAs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[0.78rem] font-semibold text-muted-foreground">
              Also called
            </span>
            {term.alsoKnownAs.map((alias) => (
              <Pill key={alias} tone="outline">
                {alias}
              </Pill>
            ))}
          </div>
        )}
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={term.meta} />
          </>
        }
      >
        <ContentBlock id="example" title="An example from ordinary life">
          <p className="border-l-2 border-primary/50 pl-4 text-[1rem] leading-[1.75] text-muted-foreground italic">
            {term.example}
          </p>
        </ContentBlock>

        <ContentBlock id="why" title="Why it matters">
          <p className="text-[1rem] leading-[1.75] text-muted-foreground">
            {term.whyItMatters}
          </p>
        </ContentBlock>

        <RelatedContent items={related} />

        <section className="border-t border-hairline pt-8">
          <SectionHeader
            eyebrow="Keep reading"
            title="More plain-language entries"
            action={{ label: "Full glossary", href: "/glossary" }}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <div key={item.id} className="flex">
                <GlossaryCard term={item} />
              </div>
            ))}
          </div>
        </section>
      </KnowledgeLayout>
    </>
  );
}
