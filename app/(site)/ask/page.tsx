import type { Metadata } from "next";
import { AskForm } from "@/components/site/ask-form";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  ModerationFlow,
  PrivacyNotice,
  QuestionCard,
} from "@/components/site/legal-help";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Ask a Question — moderated public legal Q&A",
  description:
    "Ask a general question about Nigerian law. Every question is read by a person, published without anything that identifies the asker, and answered as general legal information.",
  alternates: { canonical: "/ask" },
};

export default async function AskPage() {
  const content = getContent();
  const [questions, topics] = await Promise.all([
    content.getPublicQuestions(),
    content.getQuestionTopics(),
  ]);

  const items: FilterItem[] = questions.map((question) => ({
    id: question.id,
    tag: question.topic,
    text: `${question.question} ${question.generalAnswer.join(" ")} ${question.whatTheLawSays.join(" ")}`,
    node: <QuestionCard question={question} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Ask a Question" }]}
        eyebrow="Ask a Question"
        title="Ask about the law, and get an answer everyone can read"
        lede="Questions here are answered as general legal information, in public, with the instruments named. That is a genuine limit rather than a caution: it means we can answer what the law provides, and it means we cannot tell you what to do about your own case."
      />

      {/* Ask ---------------------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <Reveal>
            <SectionHeader
              eyebrow="Your question"
              title="Write it generally, and leave yourself out of it"
              description="The best questions here are the ones many people share. The more a question is about one person's particular matter, the less it can be answered in public — and the more it needs a practitioner."
            />
            <div className="mt-8">
              <AskForm />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <PrivacyNotice />
          </Reveal>
        </div>
      </Section>

      {/* How it works ------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="How it works"
            title="Nothing is published automatically"
            description="A question goes through five stages, and a person is involved at every one of them."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <ModerationFlow />
        </Reveal>
      </Section>

      {/* Answered ----------------------------------------------------------- */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Answered"
            title={`${questions.length} questions, answered generally`}
            description="Each answer sets out what the law provides in general terms, names the instruments, and points at what to do next."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search answered questions"
            placeholder="Search a question — police, rent, wages, debt, land, online…"
            filters={[
              { value: "all", label: "All topics" },
              ...topics.map((topic) => ({ value: topic, label: topic })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No question matched"
            emptyBody="Nobody has asked that yet, or it is filed under a different topic. Ask it above and it goes into moderation."
          />
        </Reveal>

      </Section>
    </>
  );
}
