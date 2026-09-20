import type { Metadata } from "next";
import { BusinessGuideCard } from "@/components/site/cards";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Before You Do This — business legal guides",
  description:
    "Practical guides for the decision points that create legal problems: hiring, signing, borrowing, partnering, collecting data, launching online and terminating.",
  alternates: { canonical: "/business/guides" },
};

export default async function BusinessGuidesPage() {
  const guides = await getContent().getBusinessGuides();
  const areas = Array.from(new Set(guides.map((guide) => guide.area))).sort();

  const items: FilterItem[] = guides.map((guide) => ({
    id: guide.id,
    tag: guide.area,
    text: `${guide.title} ${guide.situation} ${guide.summary} ${guide.area}`,
    node: <BusinessGuideCard guide={guide} />,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Before You Do This" },
        ]}
        eyebrow="Before You Do This"
        title="The moment before the decision is the cheapest place to get it right"
        lede="Every guide takes one decision a business actually faces and works through it: what the situation is, the legal considerations, the mistakes people make, the red flags, a full checklist, and the point at which a lawyer should be involved."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="All guides"
            title="Every Before You Do This guide"
            description="Filter by the area you are dealing with, or search the decision in your own words."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search business guides"
            placeholder="Search a decision — hiring, signing, borrowing, data…"
            filters={[
              { value: "all", label: "All areas" },
              ...areas.map((area) => ({ value: area, label: area })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No guide matched"
            emptyBody="Try the words you would use to describe the decision — hiring, signing, borrowing, collecting, launching."
          />
        </Reveal>

      </Section>
    </>
  );
}
