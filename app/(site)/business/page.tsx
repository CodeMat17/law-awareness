import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BusinessGuideCard } from "@/components/site/cards";
import {
  BriefingCard,
  BusinessAreaCard,
  ComplianceTopicCard,
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
    "A first-class business legal section: the Compliance Centre, a legal health check, Regulatory Watch, Before You Do This guides, the Contract Knowledge Centre, industry hubs and Law for CEOs.",
  alternates: { canonical: "/business" },
};

export default async function BusinessPage() {
  const content = getContent();
  const [areas, guides, topics, updates, briefings, alertTopics] =
    await Promise.all([
      content.getBusinessAreas(),
      content.getBusinessGuides(3),
      content.getComplianceTopics(),
      content.getRegulatoryUpdates(undefined, 3),
      content.getCeoBriefings(3),
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
        lede="Entrepreneurs, SMEs and corporate teams face the same body of law as everyone else — they just meet it earlier, more often, and with more at stake. This section covers structure, contracts, employment, data, tax awareness, consumer duties and industry regulation, in the order decisions actually arrive."
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/business/health-check"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start the legal health check
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/business/compliance"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            What applies to my company?
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
        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

      {/* Law for CEOs ------------------------------------------------------- */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Law for CEOs"
            title="Short, strategic briefings for people who decide"
            description="What the risk is, where it lands in the business, and the questions a board should be asking about it."
            action={{ label: "All briefings", href: "/business/ceo" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {briefings.map((briefing) => (
            <RevealItem key={briefing.id} className="flex">
              <BriefingCard briefing={briefing} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Remaining entry points --------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Also in this section"
            title="Contracts, the compliance calendar and your industry"
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/business/contracts",
              title: "Contract Knowledge Centre",
              body: "Agreement types explained clause by clause — what each does, what to check, and when legal review is appropriate.",
            },
            {
              href: "/business/legal-calendar",
              title: "Business legal calendar",
              body: "The compliance rhythm of a business year, described by cadence and trigger rather than by dates we cannot maintain.",
            },
            {
              href: "/business/industries",
              title: "Industry hubs",
              body: "What changes about your legal profile because of the sector you operate in.",
            },
          ].map((card) => (
            <RevealItem key={card.href} className="flex">
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-card p-6 transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-foreground/5"
              >
                <h3 className="text-h4 text-foreground">{card.title}</h3>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.85rem] font-extrabold text-foreground">
                  <span className="link-underline">Open</span>
                  <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

      </Section>
    </>
  );
}
