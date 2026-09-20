import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaveButton } from "@/components/account/save-button";
import {
  CaseMetaRow,
  CaseSummaryNotice,
  StandingPanel,
  courtShortName,
} from "@/components/site/case-law";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  Prose,
  RelatedContent,
  SourcePanel,
  TickList,
} from "@/components/site/knowledge";
import { getContent } from "@/lib/content/repository";

/**
 * Every published case is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status rather than a page that streams a 200.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const cases = await getContent().getCases();
  return cases.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata(
  props: PageProps<"/cases/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const record = await getContent().getCase(slug);
  if (!record) return { title: "Case not found" };

  return {
    title: `${record.title} (${record.year}) — case summary`,
    description: record.keyPrinciple,
    alternates: { canonical: `/cases/${record.slug}` },
  };
}

const sections = [
  { id: "issue", label: "The legal issue" },
  { id: "background", label: "Background" },
  { id: "decision", label: "The decision" },
  { id: "principle", label: "The key principle" },
  { id: "plain", label: "In plain language" },
  { id: "limits", label: "What it does not settle" },
  { id: "instruments", label: "Instruments involved" },
  { id: "source", label: "Finding the judgment" },
  { id: "related", label: "Related content" },
];

export default async function CaseDetailPage(
  props: PageProps<"/cases/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const record = await content.getCase(slug);
  if (!record) notFound();

  const [category, related] = await Promise.all([
    content.getLawCategory(record.subject),
    content.getRelated(record.related),
  ]);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Case law", href: "/cases" },
          { label: record.title },
        ]}
        eyebrow={`${courtShortName(record.court)} · ${record.year}`}
        title={record.title}
        lede={record.legalIssue}
        meta={<CredibilityRow meta={record.meta} kind="Case summary" />}
      >
        <div className="mt-7">
          <CaseMetaRow record={record} />
        </div>
        <div className="mt-6">
          <SaveButton
            target={{
              kind: "case",
              title: record.title,
              summary: record.keyPrinciple,
              group: `Case law · ${courtShortName(record.court)}`,
              href: `/cases/${record.slug}`,
            }}
          />
        </div>
      </PageHeader>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <StandingPanel standing={record.standing} />
            <SourcePanel
              meta={record.meta}
              instrument={record.instruments[0]}
            />
          </>
        }
      >
        <div className="border-t border-hairline pt-8">
          <CaseSummaryNotice whereToFindIt={record.whereToFindIt} />
        </div>

        <ContentBlock
          id="issue"
          title="The legal issue"
          description="The question the court actually had to answer. Everything a judgment settles flows from this, and nothing beyond it does."
        >
          <p className="text-[0.95rem] leading-relaxed text-foreground">
            {record.legalIssue}
          </p>
        </ContentBlock>

        <ContentBlock id="background" title="Background">
          <Prose paragraphs={record.background} />
        </ContentBlock>

        <ContentBlock id="decision" title="The decision">
          <Prose paragraphs={record.decision} />
        </ContentBlock>

        <ContentBlock
          id="principle"
          title="The key principle"
          description="Stated narrowly, as the case is genuinely cited for — not stretched into the broader proposition it is often summarised as."
        >
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
            <p className="text-[1.02rem] leading-relaxed font-bold text-foreground">
              {record.keyPrinciple}
            </p>
          </div>
        </ContentBlock>

        <ContentBlock
          id="plain"
          title="In plain language"
          description="Our explanation of what the decision means for an ordinary reader. It is not the judgment."
        >
          <Prose paragraphs={record.plainLanguage} />
        </ContentBlock>

        <ContentBlock
          id="limits"
          title="What it does not settle"
          description="The part most summaries leave out, and the part that most often causes a case to be cited for something it never decided."
        >
          <TickList items={record.doesNotSettle} tone="negative" />
        </ContentBlock>

        <ContentBlock
          id="instruments"
          title="Instruments involved"
          description="Named generally. Read the official text of any instrument you intend to rely on."
        >
          <TickList items={record.instruments} />
        </ContentBlock>

        <ContentBlock id="source" title="Finding the judgment">
          <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
            <p className="text-[0.92rem] leading-relaxed text-muted-foreground">
              {record.whereToFindIt}
            </p>
            {category && (
              <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                Subject area:{" "}
                <span className="font-bold text-foreground">
                  {category.name}
                </span>
              </p>
            )}
          </div>
        </ContentBlock>

        <RelatedContent
          items={related}
          description="The statute, the right, the constitutional section and the plain-language terms this decision touches."
        />
      </KnowledgeLayout>
    </>
  );
}
