import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  EpisodeRow,
  FeaturedMedia,
  MediaDetailCard,
  SeriesCard,
} from "@/components/site/media";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: { absolute: "Listen — the Law Awareness TV podcast network" },
  description:
    "Podcast episodes on Nigerian law: tenancy agreements, offer letters, consumer complaints, online scams and partnerships. Every episode is chaptered and carries a written record.",
  alternates: { canonical: "/listen" },
};

export default async function ListenPage() {
  const content = getContent();
  const [episodes, series, topics] = await Promise.all([
    content.getPodcastEpisodes(),
    content.getMediaSeries("podcast"),
    content.getMediaTopics("podcast"),
  ]);

  const featured = episodes.find((item) => item.featured) ?? episodes[0];
  const rest = episodes.filter((item) => item.id !== featured?.id);
  const latest = episodes.slice(0, 4);

  const seriesCounts = await Promise.all(
    series.map(async (strand) => ({
      strand,
      count: (await content.getSeriesItems(strand.slug)).length,
    }))
  );

  const items: FilterItem[] = rest.map((item) => ({
    id: item.id,
    tag: item.topics[0] ?? "General",
    text: `${item.title} ${item.description} ${item.series ?? ""} ${item.topics.join(" ")}`,
    node: <MediaDetailCard item={item} />,
  }));

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Listen" }]}
        eyebrow="Listen"
        title="The law, in your ear, on the way to work"
        lede="A podcast network covering the agreements people sign and the situations they did not plan for. Every episode is chaptered, and every episode carries a written record of what it covers."
      />

      {featured && (
        <Section className="pt-12 sm:pt-14 lg:pt-16">
          <h2 className="sr-only">Featured episode</h2>
          <Reveal>
            <FeaturedMedia item={featured} />
          </Reveal>
        </Section>
      )}

      {series.length > 0 && (
        <Section tone="surface" className="py-14 sm:py-16 lg:py-20">
          <Reveal>
            <SectionHeader
              eyebrow="Shows"
              title={`${series.length} shows in the network`}
              description="Each show keeps its own seasons and running order."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {seriesCounts.map(({ strand, count }) => (
              <RevealItem key={strand.id} className="flex">
                <SeriesCard series={strand} itemCount={count} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <Section className="py-14 sm:py-16 lg:py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Latest episodes"
            title="Newest first"
            description="The most recently published episodes across every show."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <ul className="space-y-3">
            {latest.map((item, index) => (
              <EpisodeRow key={item.id} item={item} index={index} />
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Every episode"
            title={`${episodes.length} episodes to listen to`}
            description="Filter by topic, or search for the situation you are in."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search episodes"
            placeholder="Search — tenancy, offer letter, scam, partnership…"
            filters={[
              { value: "all", label: "All topics" },
              ...topics.map((topic) => ({ value: topic, label: topic })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No episode matched"
            emptyBody="Try the everyday name for it — rent, job, loan, refund, scam."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-h4 text-foreground">Would rather watch?</p>
              <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-muted-foreground">
                The same material runs as explainers, documentaries and recorded
                sessions.
              </p>
            </div>
            <Link
              href="/watch"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.9rem] font-bold text-foreground"
            >
              <span className="link-underline">Go to Watch</span>
              <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
