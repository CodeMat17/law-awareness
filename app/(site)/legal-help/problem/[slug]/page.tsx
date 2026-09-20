import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ContentBlock,
  CredibilityRow,
  DoAndDont,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  RelatedContent,
  SourcePanel,
  StepList,
  TickList,
} from "@/components/site/knowledge";
import {
  FindHelpPanel,
  PathwaySpine,
  UrgencyPill,
} from "@/components/site/legal-help";
import { ProblemTriage } from "@/components/site/problem-triage";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const problems = await getContent().getLegalProblems();
  return problems.map((problem) => ({ slug: problem.slug }));
}

export async function generateMetadata(
  props: PageProps<"/legal-help/problem/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const problem = await getContent().getLegalProblem(slug);
  if (!problem) return { title: "Pathway not found" };

  return {
    title: `${problem.title} — Legal Help`,
    description: problem.summary,
    alternates: { canonical: `/legal-help/problem/${problem.slug}` },
  };
}

const PATHWAY = [
  "What happened",
  "What the law says",
  "What to do",
  "What to avoid",
  "Where to get help",
];

const sections = [
  { id: "start", label: "Where to start reading" },
  { id: "rights", label: "What the law protects" },
  { id: "now", label: "What to do and avoid" },
  { id: "steps", label: "Working through it" },
  { id: "help", label: "When to get a lawyer" },
  { id: "routes", label: "Where to get help" },
  { id: "related", label: "Related content" },
];

export default async function ProblemPathwayPage(
  props: PageProps<"/legal-help/problem/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const problem = await content.getLegalProblem(slug);
  if (!problem) notFound();

  const [routes, related] = await Promise.all([
    content.getReferralRoutesFor(problem.referralRoutes),
    content.getRelated(problem.related),
  ]);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Legal Help", href: "/legal-help" },
          { label: "I have a legal problem", href: "/legal-help/problem" },
          { label: problem.title },
        ]}
        eyebrow={`Legal Help · ${problem.category}`}
        title={problem.title}
        lede={problem.summary}
        meta={
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <UrgencyPill urgency={problem.urgency} />
              <p className="text-[0.85rem] font-semibold text-foreground">
                {problem.situation}
              </p>
            </div>
            <CredibilityRow meta={problem.meta} kind="Legal help pathway" />
            <PathwaySpine steps={PATHWAY} />
          </div>
        }
      />

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={problem.meta} />
          </>
        }
      >
        <ContentBlock
          id="start"
          title="Where to start reading"
          description="Two questions that change the order of this page. They produce no assessment of your situation, and everything below is here whether you answer them or not."
          className="border-t-0 pt-0"
        >
          <ProblemTriage questions={problem.triage} />
        </ContentBlock>

        <ContentBlock
          id="rights"
          title="What the law protects in this situation"
          description="In general terms, and naming the instruments. This is not a statement about your particular circumstances."
        >
          <TickList items={problem.rightsInThisSituation} />
        </ContentBlock>

        <ContentBlock
          id="now"
          title="What to do, and what to avoid"
          description="Practical, and in the order that usually matters. Doing none of this is not a legal failing — it is simply harder afterwards."
        >
          <DoAndDont shouldDo={problem.doNow} shouldNotDo={problem.avoid} />
        </ContentBlock>

        <ContentBlock
          id="steps"
          title="Working through it"
          description="The sequence most of these situations follow. Each step is educational: it describes what the stage is, not what you should decide."
        >
          <StepList steps={problem.steps} />
        </ContentBlock>

        <ContentBlock
          id="help"
          title="When to get a lawyer"
          description="The points at which reading stops being enough."
        >
          <TickList items={problem.whenToGetHelp} tone="positive" />
        </ContentBlock>

        <ContentBlock
          id="routes"
          title="Where to get help"
          description="The routes that most often apply to this situation, in the order they are usually worth trying."
        >
          <FindHelpPanel routes={routes} />
        </ContentBlock>

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
