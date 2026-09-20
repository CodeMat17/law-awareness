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
        title="The legal risks that reach a board are rarely the exotic ones"
        lede="They are ordinary obligations that nobody owned until they crystallised. Each briefing sets out what the risk is, where it actually lands in the business, and the questions a board should be asking about it — in a few minutes, not a few hours."
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
