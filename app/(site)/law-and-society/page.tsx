import type { Metadata } from "next";
import { ArticleCard } from "@/components/site/cards";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Law & Society — legal news, analysis and explainers",
  description:
    "Courtroom news, law making, regulation and the everyday consequences of legal change — reported and explained for people who were never trained to read a statute.",
  alternates: { canonical: "/law-and-society" },
};

export default async function LawAndSocietyPage() {
  const articles = await getContent().getLatestArticles();
  const [lead, ...rest] = articles;

  const categories = Array.from(
    new Set(articles.map((article) => article.category))
  ).sort();

  const items: FilterItem[] = articles.map((article) => ({
    id: article.id,
    tag: article.category,
    text: `${article.title} ${article.standfirst} ${article.category} ${article.kind}`,
    node: <ArticleCard article={article} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Law & Society" }]}
        eyebrow="Law & Society"
        title="The law is a current affair"
        lede="Courtroom news, law making, enforcement and regulation, reported with the same care we give to explaining them — and always with the everyday consequence in view."
      />

      {lead && (
        <Section className="pt-12 sm:pt-14 lg:pt-16">
          <Reveal>
            <SectionHeader
              eyebrow="Latest"
              title="The piece to read first"
              description="Updated as the courts sit, the legislature moves and the regulators publish."
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <ArticleCard article={lead} variant="feature" />
          </Reveal>

          {rest.length > 0 && (
            <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {rest.slice(0, 3).map((article) => (
                <RevealItem key={article.id} className="flex">
                  <ArticleCard article={article} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Section>
      )}

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="The archive"
            title="Everything in Law & Society"
            description="Filter by subject, or search for the change you are trying to understand."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search Law & Society"
            placeholder="Search a subject — data, land, employment, cybercrime…"
            filters={[
              { value: "all", label: "All subjects" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="Nothing matched"
            emptyBody="Try the subject rather than the headline — data protection, land, employment, cybercrime."
          />
        </Reveal>

      </Section>
    </>
  );
}
