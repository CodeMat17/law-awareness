import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/site/cards";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  SourcePanel,
} from "@/components/site/knowledge";
import { Section, SectionHeader } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { SaveButton } from "@/components/account/save-button";
import { getContent } from "@/lib/content/repository";

/** Published articles are prerendered, so an unknown slug is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getContent().getLatestArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/law-and-society/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getContent().getArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: `${article.title} — Law & Society`,
    description: article.standfirst,
    alternates: { canonical: `/law-and-society/${article.slug}` },
  };
}

const kindLabel: Record<string, string> = {
  news: "News",
  analysis: "Analysis",
  explainer: "Legal explainer",
  opinion: "Opinion",
  educational: "Educational",
};

/** Stable anchor for a body heading, so "On this page" and the blocks agree. */
function anchor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function ArticlePage(
  props: PageProps<"/law-and-society/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const article = await content.getArticle(slug);
  if (!article) notFound();

  const others = (await content.getLatestArticles())
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const sections = (article.body ?? []).map((section) => ({
    id: anchor(section.heading),
    label: section.heading,
  }));

  const published = new Date(`${article.publishedAt}T00:00:00Z`).toLocaleDateString(
    "en-NG",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Law & Society", href: "/law-and-society" },
          { label: article.title },
        ]}
        eyebrow={`${kindLabel[article.kind] ?? "Article"} · ${article.category}`}
        title={article.title}
        lede={article.standfirst}
        meta={
          <CredibilityRow
            meta={article.meta}
            kind={kindLabel[article.kind] ?? "Article"}
          />
        }
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-muted-foreground">
          Published{" "}
          <time dateTime={article.publishedAt} className="text-foreground">
            {published}
          </time>{" "}
          · {article.readingMinutes} min read
        </p>
        <div className="mt-6">
          <SaveButton
            target={{
              kind: "article",
              title: article.title,
              summary: article.standfirst,
              group: `Law & Society · ${article.category}`,
              href: `/law-and-society/${article.slug}`,
            }}
          />
        </div>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            {sections.length > 0 && <OnThisPage items={sections} />}
            <SourcePanel meta={article.meta} />
          </>
        }
      >
        {article.body?.map((section) => (
          <ContentBlock
            key={section.heading}
            id={anchor(section.heading)}
            title={section.heading}
          >
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-[0.95rem] leading-relaxed text-muted-foreground not-first:mt-4"
              >
                {paragraph}
              </p>
            ))}
          </ContentBlock>
        ))}

      </KnowledgeLayout>

      {others.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <SectionHeader
              eyebrow="Keep reading"
              title="More from Law & Society"
              action={{ label: "All of Law & Society", href: "/law-and-society" }}
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {others.map((item) => (
              <RevealItem key={item.id} className="flex">
                <ArticleCard article={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
}
