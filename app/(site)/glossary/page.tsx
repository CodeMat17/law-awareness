import type { Metadata } from "next";
import { GlossaryCard } from "@/components/site/cards";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Law in Plain Language — glossary",
  description:
    "Legal terms with a simple definition, a real example and why they matter — the words that keep people out of their own case.",
  alternates: { canonical: "/glossary" },
};

export default async function GlossaryPage() {
  const terms = await getContent().getGlossaryTerms();

  const letters = Array.from(
    new Set(terms.map((term) => term.term[0].toUpperCase()))
  ).sort();

  const items: FilterItem[] = terms.map((term) => ({
    id: term.id,
    tag: term.term[0].toUpperCase(),
    text: [term.term, term.definition, ...(term.alsoKnownAs ?? [])].join(" "),
    node: <GlossaryCard term={term} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
        eyebrow="Law in plain language"
        title="The words that keep people out of their own case"
        lede="Every entry gives a simple definition, an example from ordinary life, and why the term matters — with links to the law and the guides where it appears."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <h2 className="sr-only">Glossary terms</h2>
        <Reveal>
          <FilterGrid
            label="Search the glossary"
            placeholder="Search a term — bail, affidavit, limitation period…"
            filters={[
              { value: "all", label: "All terms" },
              ...letters.map((letter) => ({ value: letter, label: letter })),
            ]}
            items={items}
            className="sm:grid-cols-2 lg:grid-cols-3"
            emptyTitle="No term matched"
            emptyBody="Try the word as you heard it — many legal terms have an everyday alias listed on the entry."
          />
        </Reveal>
      </Section>
    </>
  );
}
