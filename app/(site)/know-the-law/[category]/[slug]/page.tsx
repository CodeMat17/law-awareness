import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ContentBlock,
  CredibilityRow,
  DoAndDont,
  Examples,
  KnowledgeLayout,
  LawyerPanel,
  Misconceptions,
  OnThisPage,
  PageHeader,
  Prose,
  ProvisionSplit,
  RelatedContent,
  SourcePanel,
  TickList,
} from "@/components/site/knowledge";
import { SaveButton } from "@/components/account/save-button";
import { AmendmentSummary, VersionTimeline } from "@/components/site/law-history";
import { getContent } from "@/lib/content/repository";

/**
 * Every published record is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status - rather than a page that streams a 200 and then
 * renders not-found UI. Revisit when content comes from Convex at request time.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await getContent().getLawEntries();
  return entries.map((entry) => ({
    category: entry.category,
    slug: entry.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/know-the-law/[category]/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = await getContent().getLawEntry(slug);
  if (!entry) return { title: "Explainer not found" };

  return {
    title: `${entry.title} — Know the Law`,
    description: entry.summary,
    alternates: { canonical: `/know-the-law/${entry.category}/${entry.slug}` },
  };
}

const sections = [
  { id: "covers", label: "What this law covers" },
  { id: "affects", label: "Who it affects" },
  { id: "explanation", label: "Plain-language explanation" },
  { id: "provisions", label: "Important provisions" },
  { id: "examples", label: "Real-life examples" },
  { id: "do-and-dont", label: "What to do and avoid" },
  { id: "misconceptions", label: "Common misconceptions" },
  { id: "lawyer", label: "When to see a lawyer" },
  { id: "related", label: "Related content" },
];

export default async function LawEntryPage(
  props: PageProps<"/know-the-law/[category]/[slug]">
) {
  const { category: categorySlug, slug } = await props.params;
  const content = getContent();
  const entry = await content.getLawEntry(slug);

  // The category is part of the URL: a mismatched pair is not a page, so it is
  // never rendered under a breadcrumb it contradicts.
  if (!entry || entry.category !== categorySlug) notFound();

  const [category, related, history] = await Promise.all([
    content.getLawCategory(entry.category),
    content.getRelated(entry.related),
    content.getLawHistory(entry.slug),
  ]);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Know the Law", href: "/know-the-law" },
          {
            label: category?.name ?? "Subject area",
            href: `/know-the-law/${entry.category}`,
          },
          { label: entry.title },
        ]}
        eyebrow={category?.name ?? "Know the Law"}
        title={entry.title}
        lede={entry.summary}
        meta={<CredibilityRow meta={entry.meta} kind="Legal explainer" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-brand-ink">
          {entry.instrument}
        </p>
        <div className="mt-6">
          <SaveButton
            target={{
              kind: "law",
              title: entry.title,
              summary: entry.summary,
              group: `Know the Law · ${category?.name ?? "Legal explainer"}`,
              href: `/know-the-law/${entry.category}/${entry.slug}`,
            }}
          />
        </div>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            {/* The history entry only appears when there is a history to link to. */}
            <OnThisPage
              items={
                history
                  ? sections.toSpliced(6, 0, {
                      id: "history",
                      label: "Version history",
                    })
                  : sections
              }
            />
            {history && <AmendmentSummary history={history} />}
            <SourcePanel
              meta={entry.meta}
              instrument={entry.instrument}
              amendmentNote={entry.amendmentNote}
            />
          </>
        }
      >
        <ContentBlock id="covers" title="What this law covers">
          <TickList items={entry.covers} tone="positive" />
        </ContentBlock>

        <ContentBlock id="affects" title="Who it affects">
          <TickList items={entry.affects} />
        </ContentBlock>

        <ContentBlock
          id="explanation"
          title="Plain-language explanation"
          description="Our explanation, written for a general reader. It is not the text of the law."
        >
          <Prose paragraphs={entry.explanation} />
        </ContentBlock>

        <ContentBlock
          id="provisions"
          title="Important provisions"
          description="Where the official text lives, beside what it means in ordinary language."
        >
          <ProvisionSplit
            provisions={entry.provisions}
            sourceUrl={entry.meta.source?.url}
          />
        </ContentBlock>

        <ContentBlock id="examples" title="Real-life examples">
          <Examples items={entry.examples} />
        </ContentBlock>

        <ContentBlock id="do-and-dont" title="What to do, and what to avoid">
          <DoAndDont
            shouldDo={entry.shouldDo}
            shouldNotDo={entry.shouldNotDo}
          />
        </ContentBlock>

        <ContentBlock id="misconceptions" title="Common misconceptions">
          <Misconceptions items={entry.misconceptions} />
        </ContentBlock>

        {history && (
          <ContentBlock
            id="history"
            title="Version history"
            description="What this instrument was, what changed, and what is in force now. Superseded versions are kept on the record rather than deleted."
          >
            <VersionTimeline versions={history.versions} />
          </ContentBlock>
        )}

        <ContentBlock id="lawyer" title="When to contact a lawyer">
          <LawyerPanel items={entry.whenToSeeALawyer} />
        </ContentBlock>

        <RelatedContent
          items={related}
          description="The same subject, seen from the rights, business, media and plain-language sides of the platform."
        />
      </KnowledgeLayout>
    </>
  );
}
