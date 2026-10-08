import type { Metadata } from "next";
import { BriefingCard } from "@/components/site/business";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Law for CEOs — strategic legal briefings",
  description:
    "Concise executive briefings on the legal risks that reach the board: data, employment process, contract exposure, governance and regulatory change.",
  alternates: { canonical: "/business/ceo" },
};

export default async function CeoPage() {
  const briefings = await getContent().getCeoBriefings();

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Law for CEOs" },
        ]}
        eyebrow="Law for CEOs"
        title="Legal risks every business leader should know"
        lede="Most legal trouble in a company starts with an ordinary duty that nobody was looking after. Each short briefing explains the risk, where it shows up in the business, and the questions leaders should ask — in a few minutes."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="All briefings"
            title={`${briefings.length} executive briefings`}
            description="Written for people who decide rather than people who implement: short, specific, and pointed at the decision."
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
    </>
  );
}
