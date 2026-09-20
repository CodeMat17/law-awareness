import type { Metadata } from "next";
import { QuizCard } from "@/components/site/cards";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Quizzes — check what you actually know",
  description:
    "Short multiple-choice quizzes on rights, contracts, business law and online safety, with an explanation behind every answer.",
  alternates: { canonical: "/quizzes" },
};

const levels = [
  {
    value: "starter",
    label: "Starter",
    description: "No legal background assumed.",
  },
  {
    value: "core",
    label: "Core",
    description: "For readers who have worked through the guides.",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Closer detail, and the distinctions that catch people out.",
  },
] as const;

export default async function QuizzesPage() {
  const quizzes = await getContent().getQuizzes();

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Quizzes" }]}
        eyebrow="Quizzes"
        title="Recognising the law is not the same as knowing it"
        lede="Short quizzes with an explanation behind every answer — including the ones you get right. Nothing is stored, nothing is scored against you, and no answer here is advice about your own situation."
      />

      {levels.map((level, index) => {
        const group = quizzes.filter((quiz) => quiz.level === level.value);
        if (group.length === 0) return null;

        return (
          <Section
            key={level.value}
            tone={index % 2 === 1 ? "surface" : "default"}
            className={index === 0 ? "pt-12 sm:pt-14 lg:pt-16" : undefined}
          >
            <Reveal>
              <SectionHeader
                eyebrow={level.label}
                title={
                  level.value === "starter"
                    ? "Start here"
                    : level.value === "core"
                      ? "Core knowledge"
                      : "Going deeper"
                }
                description={level.description}
              />
            </Reveal>
            <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {group.map((quiz) => (
                <RevealItem key={quiz.id} className="flex">
                  <QuizCard quiz={quiz} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Section>
        );
      })}
    </>
  );
}
