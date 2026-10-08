import type { Metadata } from "next";
import { PageHeader } from "@/components/site/knowledge";
import { ProgrammeCard } from "@/components/site/media";
import { Section } from "@/components/site/primitives";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import { getProgrammeLineups } from "@/lib/content/programme-lineup";

export const metadata: Metadata = {
  title: "Programmes — the Law Awareness TV line-up",
  description:
    "Courtroom and judicial news, law-making, law enforcement, corporate law and regulation, rights and justice, everyday law, and crime and safety — Nigerian law on Law Awareness TV.",
  alternates: { canonical: "/programmes" },
};

export default async function ProgrammesPage() {
  const lineups = await getProgrammeLineups();

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Programmes" }]}
        eyebrow="Programmes"
        title="The Law Awareness TV line-up"
        lede="Pick a programme and watch, listen or tune in live. Every show explains Nigerian law in everyday words."
      />
      <Section>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lineups.map(({ programme, items }) => (
            <RevealItem key={programme.slug} className="flex">
              <ProgrammeCard programme={programme} itemCount={items.length} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
