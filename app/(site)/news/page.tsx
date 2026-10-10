import type { Metadata } from "next";
import { ArticleCard } from "@/components/site/cards";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { deskOf, newsDesks } from "@/lib/content/news";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "News — law, sports and entertainment from across Nigeria",
  description:
    "The courts, law-making and regulation explained in everyday words, alongside the latest sports and entertainment news from Law Awareness TV.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const articles = await getContent().getLatestArticles();
  const [lead, ...rest] = articles;

  // Filter by desk, offering only the desks that have a story to show.
  const desks = newsDesks.filter((desk) =>
    articles.some((article) => deskOf(article) === desk.value)
  );

  const items: FilterItem[] = articles.map((article) => ({
    id: article.id,
    tag: deskOf(article),
    text: `${article.title} ${article.standfirst} ${article.category} ${article.kind}`,
    node: <ArticleCard article={article} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "News" }]}
        eyebrow="News"
        title="News from across Nigeria"
        lede="The courts, law-making and regulation, explained with what they mean for you — plus the latest in sports and entertainment."
      />

      {lead && (
        <Section className="pt-12 sm:pt-14 lg:pt-16">
          <Reveal>
            <SectionHeader
              eyebrow="Latest"
              title="The piece to read first"
              description="The newest story on the desk, whatever it is about."
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <ArticleCard article={lead} variant="feature" />
          </Reveal>

          {rest.length > 0 && (
            <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
            title="All the news"
            description="Filter by desk, or search for the story you are looking for."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search the news"
            placeholder="Search a subject — land, employment, football, music…"
            filters={[
              { value: "all", label: "All news" },
              ...desks.map((desk) => ({ value: desk.value, label: desk.label })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="Nothing matched"
            emptyBody="Try the subject rather than the headline — land, employment, football, music."
          />
        </Reveal>

      </Section>
    </>
  );
}
