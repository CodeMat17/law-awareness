import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
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
import { Pill } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const questions = await getContent().getPublicQuestions();
  return questions.map((question) => ({ slug: question.slug }));
}

export async function generateMetadata(
  props: PageProps<"/ask/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const question = await getContent().getPublicQuestion(slug);
  if (!question) return { title: "Question not found" };

  return {
    title: `${question.question} — Ask a Question`,
    description: question.generalAnswer[0],
    alternates: { canonical: `/ask/${question.slug}` },
  };
}

const sections = [
  { id: "answer", label: "The general answer" },
  { id: "law", label: "What the law says" },
  { id: "next", label: "What to do next" },
  { id: "practitioner", label: "A practitioner's note" },
  { id: "related", label: "Related content" },
];

export default async function QuestionPage(props: PageProps<"/ask/[slug]">) {
  const { slug } = await props.params;
  const content = getContent();
  const question = await content.getPublicQuestion(slug);
  if (!question) notFound();

  const related = await content.getRelated(question.related);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Ask a Question", href: "/ask" },
          { label: question.topic },
        ]}
        eyebrow={`Asked · ${question.askedOn}`}
        title={question.question}
        meta={
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone="brand">{question.topic}</Pill>
              <span className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-muted-foreground">
                <MessageSquare className="size-3.5 text-brand-ink" />
                {question.askedBy}
              </span>
            </div>
            <CredibilityRow meta={question.meta} kind="Public Q&A" />
          </div>
        }
      />

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={question.meta} />
            <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5">
              <p className="text-eyebrow text-brand-ink">Have your own?</p>
              <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                Questions are answered in public, in general terms, and never
                with anything that identifies who asked.
              </p>
              <Link
                href="/ask"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[0.85rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ask a question
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        }
      >
        <ContentBlock
          id="answer"
          title="The general answer"
          description="Written by the editorial desk as general legal information. It is not an answer about anybody's particular situation, including the asker's."
          className="border-t-0 pt-0"
        >
          <Prose paragraphs={question.generalAnswer} />
        </ContentBlock>

        <ContentBlock
          id="law"
          title="What the law says"
          description="The instruments this touches, described in general terms. We do not reproduce statutory wording — read the official text before relying on any of it."
        >
          <TickList items={question.whatTheLawSays} />
        </ContentBlock>

        <ContentBlock
          id="next"
          title="What to do next"
          description="Practical steps that apply to most versions of this question."
        >
          <TickList items={question.whatToDoNext} tone="positive" />
        </ContentBlock>

        <ContentBlock
          id="practitioner"
          title="A practitioner's note"
          description="Where a named legal practitioner has responded, their contribution appears here, attributed to them."
        >
          {question.lawyerNote ? (
            <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
              <p className="text-[0.93rem] leading-relaxed text-muted-foreground">
                {question.lawyerNote}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-hairline bg-surface p-6 sm:p-8">
              <p className="text-[0.93rem] font-extrabold text-foreground">
                No practitioner has responded to this question
              </p>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                Nothing is published under a practitioner&rsquo;s name that they
                did not write. An empty section is the accurate way to say that
                nobody has, rather than presenting the editorial answer as
                though a lawyer had given it.
              </p>
            </div>
          )}
        </ContentBlock>

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
