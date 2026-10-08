import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafetyCard } from "@/components/site/cards";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Stay Safe — practical legal-risk prevention",
  description:
    "Before You Sign, online scams, buying land, borrowing and partnerships: what to look for, the red flags, the questions to ask, and when to stop.",
  alternates: { canonical: "/stay-safe" },
};

export default async function StaySafePage() {
  const content = getContent();
  const [guides, allSeries] = await Promise.all([
    content.getSafetyGuides(),
    content.getSafetySeries(),
  ]);

  // Each series from the CMS, with the guides that name it. A series nobody
  // has filed a guide under yet has nothing to show, so it is left out rather
  // than drawn as a heading over an empty grid.
  const featured = allSeries
    .map((series) => ({
      series,
      guides: guides.filter((guide) => guide.series === series.name),
    }))
    .filter((entry) => entry.guides.length > 0);

  const areas = Array.from(new Set(guides.map((guide) => guide.area))).sort();

  const items: FilterItem[] = guides.map((guide) => ({
    id: guide.id,
    tag: guide.area,
    text: `${guide.title} ${guide.risk} ${guide.summary} ${guide.area}`,
    node: <SafetyCard guide={guide} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Stay Safe" }]}
        eyebrow="Stay Safe"
        title="Avoid legal trouble before it starts"
        lede="Practical tips for the moments when people most often lose money: signing, buying, borrowing, hiring and going online. What to look for, the warning signs, the questions to ask, and when to stop and get a lawyer."
      />

      {featured.length > 0 && (
        <Section className="pt-12 sm:pt-14 lg:pt-16">
          <div className="space-y-16">
            {featured.map(({ series, guides: inSeries }) => (
              <div key={series.id}>
                <Reveal>
                  <SectionHeader
                    eyebrow={`Series · ${series.name}`}
                    title={series.headline}
                    description={series.description || undefined}
                    action={{
                      label: "Start the series",
                      href: `/stay-safe/${inSeries[0].slug}`,
                    }}
                  />
                </Reveal>
                <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {inSeries.map((guide) => (
                    <RevealItem key={guide.id} className="flex">
                      <SafetyCard guide={guide} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="All guides"
            title="Every Stay Safe guide"
            description="Filter by the area you are dealing with, or search the situation in your own words."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search Stay Safe guides"
            placeholder="Search a situation — tenancy, scam, land, guarantor…"
            filters={[
              { value: "all", label: "All areas" },
              ...areas.map((area) => ({ value: area, label: area })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No guide matched"
            emptyBody="Try the words you would use to describe the moment — signing, paying, guaranteeing, transferring."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">Already in it?</p>
            <h2 className="text-h3 mt-3 text-foreground">
              Prevention is not the only thing we do
            </h2>
            <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
              If the document is already signed or the money has already moved,
              start from the rights guides or the guided pathway instead.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/your-rights"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Your Rights
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/legal-help/problem"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Describe your problem
              </Link>
            </div>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
