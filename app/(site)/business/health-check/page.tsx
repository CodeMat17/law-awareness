import type { Metadata } from "next";
import { PageHeader } from "@/components/site/knowledge";
import {
  HealthCheck,
  type HealthCheckTopicRef,
} from "@/components/site/health-check";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Business Legal Health Check",
  description:
    "An educational risk-awareness assessment across the areas of business law that most often create problems. Not a legal opinion, and nothing is stored.",
  alternates: { canonical: "/business/health-check" },
};

export default async function HealthCheckPage() {
  const content = getContent();
  const [questions, areas, topics] = await Promise.all([
    content.getHealthCheckQuestions(),
    content.getComplianceAreas(),
    content.getComplianceTopics(),
  ]);

  /**
   * The client component only needs enough of each topic to render a result
   * link, so it receives a projection rather than the full records - the
   * bodies of twelve compliance topics never reach the browser.
   */
  const topicRefs: HealthCheckTopicRef[] = topics.map((topic) => ({
    areaId: topic.areaId,
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Legal health check" },
        ]}
        eyebrow="Business legal health check"
        title={`${questions.length} questions about how your business actually runs`}
        lede="Answer honestly and you get a readiness picture across each area, the topics worth understanding, and a clear signal about where a qualified professional should be involved. It takes a few minutes, nothing is stored, and it is not a legal opinion."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal className="mx-auto max-w-3xl">
          <HealthCheck questions={questions} areas={areas} topics={topicRefs} />
        </Reveal>
      </Section>
    </>
  );
}
