import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/site/cards";
import {
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  SourcePanel,
} from "@/components/site/knowledge";
import { Section, SectionHeader } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { renderRichText } from "@/lib/cms/rich-text";
import { deskLabel, isLegalStory } from "@/lib/content/news";
import { getContent } from "@/lib/content/repository";

/** Published articles are prerendered, so an unknown slug is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getContent().getLatestArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/news/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getContent().getArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: `${article.title} — News`,
    description: article.standfirst,
    alternates: { canonical: `/news/${article.slug}` },
  };
}

const kindLabel: Record<string, string> = {
  news: "News",
  analysis: "Analysis",
  explainer: "Legal explainer",
  opinion: "Opinion",
  educational: "Educational",
};

export default async function ArticlePage(
  props: PageProps<"/news/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const article = await content.getArticle(slug);
  if (!article) notFound();

  const others = (await content.getLatestArticles())
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  // Sanitised again here even though it was sanitised on save: Convex can be
  // written by more than the CMS form, and this is the last gate before the
  // reader. What comes out is the allow-listed subset only.
  const body = article.body ? renderRichText(article.body) : null;
  const sections = body?.headings ?? [];

  const legal = isLegalStory(article);
  const topic = legal
    ? article.category
    : [deskLabel(article), article.category].filter(Boolean).join(" · ");

  const published = new Date(`${article.publishedAt}T00:00:00Z`).toLocaleDateString(
    "en-NG",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: article.title },
        ]}
        eyebrow={`${kindLabel[article.kind] ?? "Article"} · ${topic}`}
        title={article.title}
        lede={article.standfirst}
        // The legal review line belongs to law stories only; a match report
        // has no reviewer and no instrument to cite.
        meta={
          legal ? (
            <CredibilityRow
              meta={article.meta}
              kind={kindLabel[article.kind] ?? "Article"}
            />
          ) : undefined
        }
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-muted-foreground">
          Published{" "}
          <time dateTime={article.publishedAt} className="text-foreground">
            {published}
          </time>{" "}
          · {article.readingMinutes} min read
        </p>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            {sections.length > 0 && <OnThisPage items={sections} />}
            {legal && <SourcePanel meta={article.meta} />}
          </>
        }
      >
        {body && (
          <div
            className="rich-text"
            // Safe only because renderRichText has rebuilt it from an
            // allow-list: no scripts, handlers, frames, styles or foreign
            // images can survive it. Never pass article.body here directly.
            dangerouslySetInnerHTML={{ __html: body.html }}
          />
        )}

      </KnowledgeLayout>

      {others.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <SectionHeader
              eyebrow="Keep reading"
              title="More news"
              action={{ label: "All news", href: "/news" }}
            />
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
