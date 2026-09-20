import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CaseCard,
  CaseSummaryNotice,
  CourtLadder,
  courtShortName,
} from "@/components/site/case-law";
import {
  FacetGrid,
  type Facet,
  type FacetItem,
} from "@/components/site/facet-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Case Law Explorer — Nigerian judgments in plain language",
  description:
    "Search decided Nigerian cases by court, year, subject and legal issue. Every entry is a real reported decision, summarised in plain language, with what it settles and what it does not.",
  alternates: { canonical: "/cases" },
};

const reading = [
  {
    heading: "The facts",
    body: "What actually happened, as the court found it. A judgment is a decision about particular facts, and a later case with different facts may come out differently.",
  },
  {
    heading: "The issues",
    body: "The precise questions the court had to answer. A judgment settles the issues before it — not every related question a reader might have.",
  },
  {
    heading: "The ratio",
    body: "The legal reasoning necessary to the decision. This is the part that binds later courts, and it is usually narrower than the headline suggests.",
  },
  {
    heading: "Obiter remarks",
    body: "Observations the court made along the way that were not necessary to the outcome. Persuasive, sometimes quoted heavily, but not binding.",
  },
  {
    heading: "The order",
    body: "What the court actually ordered. A party can win the argument and still be disappointed by the order.",
  },
  {
    heading: "Its standing today",
    body: "Whether the decision has since been followed, distinguished, overruled or overtaken by legislation. A case is only good law until it is not.",
  },
];

export default async function CasesPage() {
  const content = getContent();
  const [cases, facets, courts] = await Promise.all([
    content.getCases(),
    content.getCaseFacets(),
    content.getCourtProfiles(),
  ]);

  const filterFacets: Facet[] = [
    {
      id: "court",
      label: "Court",
      options: facets.courts.map((court) => ({
        value: court.id,
        label: court.name,
      })),
    },
    {
      id: "subject",
      label: "Subject",
      options: facets.subjects.map((subject) => ({
        value: subject.slug,
        label: subject.name,
      })),
    },
    {
      id: "issue",
      label: "Legal issue",
      options: facets.issues.map((issue) => ({ value: issue, label: issue })),
    },
    {
      id: "year",
      label: "Year",
      options: facets.years.map((year) => ({
        value: String(year),
        label: String(year),
      })),
    },
  ];

  const items: FacetItem[] = cases.map((record) => ({
    id: record.id,
    tags: {
      court: [record.court],
      subject: [record.subject],
      issue: [record.issueTag],
      year: [String(record.year)],
    },
    text: `${record.title} ${record.legalIssue} ${record.issueTag} ${record.keyPrinciple} ${courtShortName(record.court)} ${record.year} ${record.instruments.join(" ")}`,
    node: <CaseCard record={record} />,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Know the Law", href: "/know-the-law" },
          { label: "Case law" },
        ]}
        eyebrow="Case Law Explorer"
        title="A judgment is an answer to a question somebody actually asked"
        lede="Statutes say what the rule is. Judgments say what it meant when it met a real dispute. Search decided Nigerian cases by court, subject, issue and year — each one summarised in plain language, with what it settles and, just as importantly, what it does not."
      />

      {/* What this is ------------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <CaseSummaryNotice />
        </Reveal>
      </Section>

      {/* The explorer ------------------------------------------------------- */}
      <Section tone="surface" className="pt-0 sm:pt-0 lg:pt-0">
        <Reveal>
          <SectionHeader
            eyebrow="The explorer"
            title={`${cases.length} decisions across ${facets.courts.length} levels of court`}
            description="Results are ordered by authority first and recency second, because which court said it decides how much a decision matters. The spec's judge and case-number filters are not offered: neither is stored, and neither will be reproduced from memory."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <FacetGrid
            label="Search decided cases"
            placeholder="Search a case name, an issue or an instrument…"
            facets={filterFacets}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No decision matched"
            emptyBody="Try clearing one filter at a time. The library is deliberately small — every case in it is one we can stand behind."
          />
        </Reveal>
      </Section>

      {/* The hierarchy ------------------------------------------------------ */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="The hierarchy"
            title="Which court said it decides how much it matters"
            description="Nigerian courts follow precedent: a decision of a higher court binds the courts below it. Chapter VII of the Constitution establishes the structure."
            action={{ label: "The Constitution", href: "/constitution" }}
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <CourtLadder courts={courts} />
        </Reveal>
      </Section>

      {/* How to read one ---------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="How to read one"
            title="Six things to find in any judgment"
            description="Read in this order, a judgment stops being a wall of text and becomes a decision you can actually use."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {reading.map((item) => (
            <RevealItem key={item.heading} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                <h3 className="text-h4 text-foreground">{item.heading}</h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.08} className="mt-10">
          <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">A word on citations</p>
            <h2 className="text-h3 mt-3 text-foreground">
              Never rely on a case you have not seen reported
            </h2>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted-foreground">
              A citation exists so that anyone can find the decision and read it
              for themselves — the parties, the year, the report series, the
              volume and the page. Case names circulate confidently in
              conversation, in training material and increasingly in text
              produced by software, without any decision behind them. Before you
              rely on a case, find it in a law report or the court&rsquo;s own
              record, and check whether it is still good law.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/glossary"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Plain language glossary
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/law-and-society"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Law &amp; Society
              </Link>
            </div>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
