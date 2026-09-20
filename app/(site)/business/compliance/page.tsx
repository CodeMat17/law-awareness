import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComplianceTopicCard } from "@/components/site/business";
import {
  BusinessProfiler,
  type ProfilerTopic,
} from "@/components/site/business-profiler";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Company Compliance Centre — what applies to my company?",
  description:
    "Twelve areas of ongoing business obligation explained: what each covers, when it becomes relevant, what good practice looks like, and where businesses most often have gaps.",
  alternates: { canonical: "/business/compliance" },
};

export default async function ComplianceCentrePage() {
  const content = getContent();
  const [topics, areas, questions] = await Promise.all([
    content.getComplianceTopics(),
    content.getComplianceAreas(),
    content.getProfileQuestions(),
  ]);

  const areaName = (areaId: string) =>
    areas.find((area) => area.id === areaId)?.name ?? "Compliance";

  const items: FilterItem[] = topics.map((topic) => ({
    id: topic.id,
    tag: areaName(topic.areaId),
    text: `${topic.title} ${topic.summary} ${topic.whatItCovers.join(" ")} ${topic.appliesWhen.join(" ")}`,
    node: <ComplianceTopicCard topic={topic} />,
  }));

  const profilerTopics: ProfilerTopic[] = topics.map((topic) => ({
    areaId: topic.areaId,
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
    icon: topic.icon,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Compliance Centre" },
        ]}
        eyebrow="Company Compliance Centre"
        title="Compliance is a small number of things, done continuously"
        lede="Very little of it is complicated. What makes it hard is that each area needs an owner, a record and a rhythm — and the areas without one are the areas that produce the surprise."
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="#what-applies"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            What applies to my company?
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/business/health-check"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            Run the health check
          </Link>
        </div>
      </PageHeader>

      {/* What applies to my company? --------------------------------------- */}
      <Section
        id="what-applies"
        className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] pt-12 sm:pt-14 lg:pt-16"
      >
        <Reveal>
          <SectionHeader
            eyebrow="What applies to my company?"
            title="Describe how the business runs, and we will point you at the reading"
            description="This produces a reading list, not a determination. Regulatory obligations depend on your circumstances and should be verified with the relevant authority or a qualified legal practitioner."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <BusinessProfiler questions={questions} topics={profilerTopics} />
        </Reveal>
      </Section>

      {/* All topics --------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="All areas"
            title={`${topics.length} areas of ongoing obligation`}
            description="Each topic explains what it covers, when it becomes relevant, what good practice looks like, where the common gaps are, and when to involve a lawyer."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search compliance topics"
            placeholder="Search an area — data, payroll, records, licensing…"
            filters={[{ value: "all", label: "All areas" }]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No topic matched"
            emptyBody="Try the plain word for the obligation — contracts, staff, tax, data, records, insurance."
          />
        </Reveal>

      </Section>
    </>
  );
}
