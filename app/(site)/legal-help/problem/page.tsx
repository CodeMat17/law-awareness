import type { Metadata } from "next";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  PathwaySpine,
  ProblemCard,
} from "@/components/site/legal-help";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "I have a legal problem — find the situation closest to yours",
  description:
    "Educational pathways through real situations: police, court, land, work, business, family, debt, consumer and online problems. General legal information, never advice on your case.",
  alternates: { canonical: "/legal-help/problem" },
};

const PATHWAY = [
  "What happened",
  "What the law says",
  "What to do",
  "What to avoid",
  "Where to get help",
];

export default async function ProblemChooserPage() {
  const content = getContent();
  const [problems, categories] = await Promise.all([
    content.getLegalProblems(),
    content.getProblemCategories(),
  ]);

  const items: FilterItem[] = problems.map((problem) => ({
    id: problem.id,
    tag: problem.category,
    text: `${problem.title} ${problem.situation} ${problem.summary} ${problem.doNow.join(" ")} ${problem.rightsInThisSituation.join(" ")}`,
    node: <ProblemCard problem={problem} />,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Legal Help", href: "/legal-help" },
          { label: "I have a legal problem" },
        ]}
        eyebrow="I have a legal problem"
        title="Find the situation closest to yours"
        lede="You do not need the right legal word to start. Describe the situation to yourself in ordinary language, then pick the pathway that sounds like it — the vocabulary comes later, and it comes from us."
      >
        <div className="mt-8">
          <PathwaySpine steps={PATHWAY} />
        </div>
      </PageHeader>

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="All situations"
            title={`${problems.length} pathways across ${categories.length} areas`}
            description="Each one sets out what the law provides, what to do now, what to avoid, and which routes to help usually apply. None of them assesses your position or tells you what will happen."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search situations"
            placeholder="Describe it plainly — arrested, sacked, landlord, land, scammed, sued…"
            filters={[
              { value: "all", label: "All areas" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No pathway matched"
            emptyBody="Try the everyday word for what happened — police, rent, sacked, land, money, online. If nothing fits, ask a question instead."
          />
        </Reveal>

      </Section>
    </>
  );
}
