import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, Shield, ShieldCheck } from "lucide-react";
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
    "Every subject area of Nigerian law, your rights in everyday situations, and how to stay safe — explained in plain language with the official text held clearly apart from our explanation.",
  alternates: { canonical: "/know-the-law" },
};

/** The three everyday ways in, ahead of the full subject library. */
const startHere = [
  {
    href: "/constitution",
    icon: Landmark,
    title: "The Constitution",
    body: "Nigeria's highest law, chapter by chapter, explained simply.",
  },
  {
    href: "/know-the-law/your-rights",
    icon: ShieldCheck,
    title: "Your Rights",
    body: "What the law protects when the police stop you, when you are arrested, and at work.",
  },
  {
    href: "/know-the-law/stay-safe",
    icon: Shield,
    title: "Stay Safe",
    body: "Scams, papers you are asked to sign, buying land and borrowing money.",
  },
];

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
        lede="Pick a subject, or go straight to the explainer you need. Every page keeps the official law and our everyday explanation clearly apart, and shows when it was last checked."
      />

      {/* Start here ------------------------------------------------------------ */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {startHere.map((card) => (
            <RevealItem key={card.href} className="flex min-w-0">
              <Link
                href={card.href}
                className="group flex h-full w-full min-w-0 flex-col rounded-2xl border border-hairline bg-card p-6 transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-foreground/5"
              >
                <card.icon className="size-5 text-brand-ink" strokeWidth={1.9} />
                <h2 className="text-h4 mt-4 text-foreground">{card.title}</h2>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.85rem] font-extrabold text-foreground">
                  <span className="link-underline">Open</span>
                  <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Latest explainers"
            title="Published and ready to read"
            description="Written against real, named instruments and described in general terms — never invented citations."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

      <Section id="subject-areas">
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
