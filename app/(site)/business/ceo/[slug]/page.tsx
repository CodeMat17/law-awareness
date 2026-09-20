import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
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
  const briefings = await getContent().getCeoBriefings();
  return briefings.map((briefing) => ({ slug: briefing.slug }));
}

export async function generateMetadata(
  props: PageProps<"/business/ceo/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const briefing = await getContent().getCeoBriefing(slug);
  if (!briefing) return { title: "Briefing not found" };

  return {
    title: `${briefing.title} — Law for CEOs`,
    description: briefing.summary,
    alternates: { canonical: `/business/ceo/${briefing.slug}` },
  };
}

const sections = [
  { id: "key-points", label: "Key points" },
  { id: "risk-lands", label: "Where the risk lands" },
  { id: "board", label: "Questions for the board" },
  { id: "related", label: "Related content" },
];

export default async function CeoBriefingPage(
  props: PageProps<"/business/ceo/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const briefing = await content.getCeoBriefing(slug);
  if (!briefing) notFound();

  const related = await content.getRelated(briefing.related);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Law for CEOs", href: "/business/ceo" },
          { label: briefing.title },
        ]}
        eyebrow="Law for CEOs"
        title={briefing.title}
        lede={briefing.summary}
        meta={<CredibilityRow meta={briefing.meta} kind="Executive briefing" />}
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] font-semibold text-brand-ink">
          <span>{briefing.question}</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5" />
            {briefing.readingMinutes} min read
          </span>
        </p>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={briefing.meta} />
          </>
        }
      >
        <ContentBlock
          id="key-points"
          title="Key points"
          className="border-t-0 pt-0"
        >
          <TickList items={briefing.keyPoints} tone="positive" />
        </ContentBlock>

        <ContentBlock
          id="risk-lands"
          title="Where the risk actually lands"
          description="Exposure rarely sits where the accountability does. This is where it tends to surface first."
        >
          <TickList items={briefing.whereRiskLands} />
        </ContentBlock>

        <ContentBlock
          id="board"
          title="Questions for the board"
          description="Take these into the meeting. The value is usually in how long the answers take."
        >
          <ol className="space-y-3">
            {briefing.questionsForTheBoard.map((question, index) => (
              <li
                key={question}
                className="flex gap-4 rounded-xl border border-hairline bg-card p-4"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-[0.75rem] font-extrabold text-brand-ink">
                  {index + 1}
                </span>
                <span className="text-[0.93rem] leading-relaxed text-foreground">
                  {question}
                </span>
              </li>
            ))}
          </ol>
        </ContentBlock>


        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
