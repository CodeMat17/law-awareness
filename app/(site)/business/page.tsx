import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BusinessGuideCard } from "@/components/site/cards";
import {
  BusinessAreaCard,
  ComplianceTopicCard,
  ContractCard,
  RegulatoryUpdateCard,
} from "@/components/site/business";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Business & Enterprise — legal knowledge for Nigerian businesses",
  description:
    "Legal knowledge for Nigerian businesses: the Compliance Centre, Regulatory Watch, Before You Do This guides and the Contract Knowledge Centre.",
  alternates: { canonical: "/business" },
};

export default async function BusinessPage() {
  const content = getContent();
  const [areas, guides, topics, updates, contracts, alertTopics] =
    await Promise.all([
      content.getBusinessAreas(),
      content.getBusinessGuides(3),
      content.getComplianceTopics(),
      content.getRegulatoryUpdates(undefined, 3),
      content.getContractTypes(),
      content.getAlertTopics(),
    ]);

  const topicLabel = (slug: string) =>
    alertTopics.find((topic) => topic.slug === slug)?.label ?? "Update";

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Business" }]}
        eyebrow="Business & Enterprise"
        title="The legal side of running a business, explained before it costs you"
        lede="Business owners and company teams deal with the same law as everyone else — just earlier, more often and with more at stake. This section covers setting up, contracts, staff, customer data, tax, customers' rights and industry rules, in the order you are likely to need them."
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/business/compliance"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            What applies to my company?
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/business/regulatory-watch"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            What changed this week
          </Link>
        </div>
      </PageHeader>

      {/* Subsections ------------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Every area"
            title={`${areas.length} areas where law meets the running of a business`}
            description="Each one leads into the explanation, the practical guide, or the compliance topic that covers it."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <RevealItem key={area.slug} className="flex">
              <BusinessAreaCard area={area} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Compliance Centre -------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Compliance Centre"
            title="What applies to my company?"
            description={`${topics.length} areas of ongoing obligation, each explaining what it covers, when it becomes relevant, what good practice looks like and where businesses most often have gaps.`}
            action={{ label: "Open the Compliance Centre", href: "/business/compliance" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {topics.slice(0, 6).map((topic) => (
            <RevealItem key={topic.id} className="flex">
              <ComplianceTopicCard topic={topic} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Before You Do This ------------------------------------------------- */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Before You Do This"
            title="The decision points where legal problems are actually made"
            description="Hiring, signing, borrowing, partnering, collecting data, launching and terminating. Each guide covers the considerations, the common mistakes, the red flags and a full checklist."
            action={{ label: "All business guides", href: "/business/guides" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <RevealItem key={guide.id} className="flex">
              <BusinessGuideCard guide={guide} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Regulatory Watch --------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Regulatory Watch"
            title="What changed, who it affects, and what it means"
            description="Reporting and explanation kept visibly separate, so an account of what happened is never mistaken for advice about what to do."
            action={{ label: "All updates", href: "/business/regulatory-watch" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {updates.map((update) => (
            <RevealItem key={update.id} className="flex">
              <RegulatoryUpdateCard
                update={update}
                topicLabel={topicLabel(update.topic)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Contract Knowledge Centre ------------------------------------------ */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Contract Knowledge Centre"
            title="What common contracts mean, term by term"
            description="Agreement types explained clause by clause — what each does, what to check, and when legal review is appropriate."
            action={{ label: "All contract types", href: "/business/contracts" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {contracts.slice(0, 3).map((contract) => (
            <RevealItem key={contract.id} className="flex">
              <ContractCard contract={contract} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
