import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CredibilityRow, PageHeader } from "@/components/site/knowledge";
import { Section } from "@/components/site/primitives";
import { QuizPlayer } from "@/components/site/quiz-player";
import { Reveal } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

/** Published quizzes are prerendered, so an unknown slug is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const quizzes = await getContent().getQuizzes();
  return quizzes.map((quiz) => ({ slug: quiz.slug }));
}

export async function generateMetadata(
  props: PageProps<"/quizzes/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const quiz = await getContent().getQuiz(slug);
  if (!quiz) return { title: "Quiz not found" };

  return {
    title: `${quiz.title} — quiz`,
    description: quiz.description,
    alternates: { canonical: `/quizzes/${quiz.slug}` },
  };
}

export default async function QuizPage(props: PageProps<"/quizzes/[slug]">) {
  const { slug } = await props.params;
  const content = getContent();
  const quiz = await content.getQuiz(slug);
  if (!quiz) notFound();

  const questions = await content.getQuizQuestions(slug);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Quizzes", href: "/quizzes" },
          { label: quiz.title },
        ]}
        eyebrow="Quiz"
        title={quiz.title}
        lede={quiz.description}
        meta={<CredibilityRow meta={quiz.meta} kind="Quiz" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-muted-foreground">
          {questions.length} questions · about {quiz.minutes} minutes · nothing
          is stored
        </p>
      </PageHeader>

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <div className="max-w-3xl">
          {questions.length > 0 ? (
            <Reveal>
              <QuizPlayer
                questions={questions}
                quizSlug={quiz.slug}
                quizTitle={quiz.title}
              />
            </Reveal>
          ) : (
            <Reveal>
              <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
                <p className="text-eyebrow text-brand-ink">In preparation</p>
                <h2 className="text-h3 mt-3 text-foreground">
                  The questions for this quiz are still being written
                </h2>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                  We would rather show you nothing than a half-written quiz on a
                  subject where being half right is worse than not knowing.
                </p>
                <Link
                  href="/quizzes"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Other quizzes
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          )}

        </div>
      </Section>
    </>
  );
}
