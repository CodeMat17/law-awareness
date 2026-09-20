import type { Metadata } from "next";
import { RightsCard } from "@/components/site/cards";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Your Rights — situation-first legal guides",
  description:
    "Rights guides that start from the situation you are in: a police stop, an arrest, a change at work, a company holding your data.",
  alternates: { canonical: "/your-rights" },
};

export default async function YourRightsPage() {
  const guides = await getContent().getRightGuides();

  const categories = Array.from(
    new Set(guides.map((guide) => guide.category))
  ).sort();

  const items: FilterItem[] = guides.map((guide) => ({
    id: guide.id,
    tag: guide.category,
    text: `${guide.title} ${guide.situation} ${guide.summary} ${guide.category}`,
    node: <RightsCard right={guide} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Your Rights" }]}
        eyebrow="Your Rights"
        title="Situation first. Law second."
        lede="Rights matter most in the moment they are tested. Each guide starts from what is happening, sets out what the law protects, and says plainly when the situation needs a qualified lawyer."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Rights guides"
            title="Find the situation you are in"
            description="Every guide names the instrument it relies on and the date it was last reviewed."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search rights guides"
            placeholder="Search a situation — stopped, arrested, dismissed, data…"
            filters={[
              { value: "all", label: "All situations" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No rights guide matched"
            emptyBody="Try the words you would use to describe what happened, or start from the guided pathway instead."
          />
        </Reveal>
      </Section>
    </>
  );
}
