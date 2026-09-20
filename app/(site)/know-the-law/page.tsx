import type { Metadata } from "next";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { LawCard, LawEntryCard } from "@/components/site/cards";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Know the Law — the Nigerian legal library",
  description:
    "Every subject area of Nigerian law, explained in plain language with the official text held clearly apart from our explanation.",
  alternates: { canonical: "/know-the-law" },
};

export default async function KnowTheLawPage() {
  const content = getContent();
  const [categories, entries] = await Promise.all([
    content.getLawCategories(),
    content.getLawEntries(),
  ]);

  const categoryName = (slug: string) =>
    categories.find((category) => category.slug === slug)?.name ?? "Law";

  const items: FilterItem[] = categories.map((category) => ({
    id: category.slug,
    tag: category.entryCount > 0 ? "available" : "preparing",
    text: `${category.name} ${category.blurb}`,
    node: <LawCard category={category} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Know the Law" }]}
        eyebrow="Know the Law"
        title="A legal library built to be understood"
        lede="Start from the subject area, or from the explainer you need. Every page separates where the official text lives from our plain-language explanation of it, and says when it was last reviewed."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Latest explainers"
            title="Published and ready to read"
            description="Written against real, named instruments and described in general terms — never invented citations."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {entries.slice(0, 6).map((entry) => (
            <RevealItem key={entry.id} className="flex">
              <LawEntryCard
                entry={entry}
                categoryName={categoryName(entry.category)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="surface" id="subject-areas">
        <Reveal>
          <SectionHeader
            eyebrow="Subject areas"
            title="Browse the whole library"
            description="Areas without published explainers are shown as in preparation rather than hidden, so you can see what is coming."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search subject areas"
            placeholder="Search subject areas — land, employment, data protection…"
            filters={[
              { value: "all", label: "All areas" },
              { value: "available", label: "With explainers" },
              { value: "preparing", label: "In preparation" },
            ]}
            items={items}
            className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            emptyTitle="No subject area matched"
            emptyBody="Try a broader word, or describe the situation instead — the issue finder on the homepage starts from what happened."
          />
        </Reveal>
      </Section>
    </>
  );
}
