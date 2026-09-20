import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  FeaturedMedia,
  LiveStatusPill,
  MediaDetailCard,
  SeriesCard,
  formatSchedule,
} from "@/components/site/media";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Watch — legal explainers, documentaries and interviews",
  description:
    "Films on Nigerian law: constitutional explainers, business briefings, documentaries and interviews. Every item carries chapters, a written record and the law it relates to.",
  alternates: { canonical: "/watch" },
};

export default async function WatchPage() {
  const content = getContent();
  const [videos, series, topics, liveEvents] = await Promise.all([
    content.getVideos(),
    content.getMediaSeries("video"),
    content.getMediaTopics("video"),
    content.getLiveEvents(),
  ]);

  // Derived rather than stored, so the lead item cannot go stale against the
  // grid below it.
  const featured = videos.find((item) => item.featured) ?? videos[0];
  const rest = videos.filter((item) => item.id !== featured?.id);
  const trending = videos.filter((item) => item.trending);
  const onAir = liveEvents.find((event) => event.liveStatus === "live");
  const nextUp = liveEvents.find((event) => event.liveStatus === "scheduled");

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
        trail={[{ label: "Home", href: "/" }, { label: "Watch" }]}
        eyebrow="Watch"
        title="Legal education you can sit down with"
        lede="Explainers, documentaries, interviews and recorded sessions. Each one is chaptered, carries a written record of what it covers, and links to the law behind it."
      />

      {/* On air, or what is next — the live hub's own state, surfaced here. */}
      {(onAir ?? nextUp) && (
        <Section className="pt-12 sm:pt-14 lg:pt-16">
          <Reveal>
            <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <LiveStatusPill status={onAir ? "live" : "scheduled"} />
                <p className="text-[0.92rem] font-extrabold text-foreground">
                  {(onAir ?? nextUp)?.title}
                </p>
                {!onAir && nextUp?.scheduledFor && (
                  <span className="text-[0.8rem] font-semibold text-muted-foreground">
                    {formatSchedule(nextUp.scheduledFor)}
                  </span>
                )}
              </div>
              <Link
                href={`/live/${(onAir ?? nextUp)?.slug}`}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Radio className="size-4" />
                {onAir ? "Watch live" : "See the session"}
              </Link>
            </div>
          </Reveal>
        </Section>
      )}

      {featured && (
        <Section className={onAir || nextUp ? "pt-0" : "pt-12 sm:pt-14 lg:pt-16"}>
          <h2 className="sr-only">Featured video</h2>
          <Reveal>
            <FeaturedMedia item={featured} />
          </Reveal>
        </Section>
      )}

      {series.length > 0 && (
        <Section tone="surface" className="py-14 sm:py-16 lg:py-20">
          <Reveal>
            <SectionHeader
              eyebrow="Programmes"
              title={`${series.length} strands to follow`}
              description="Each series keeps its own running order, so a film sits in a sequence rather than on its own."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seriesCounts.map(({ strand, count }) => (
              <RevealItem key={strand.id} className="flex">
                <SeriesCard series={strand} itemCount={count} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {trending.length > 0 && (
        <Section className="py-14 sm:py-16 lg:py-20">
          <Reveal>
            <SectionHeader
              eyebrow="Trending this month"
              title="What people are being pointed to"
              description="Chosen by the editorial desks. The platform publishes no view counts — a number we cannot stand behind is not a recommendation."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {trending.map((item) => (
              <RevealItem key={item.id} className="flex">
                <MediaDetailCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Everything to watch"
            title={`${videos.length} films and sessions`}
            description="Filter by topic, or search for the subject you are trying to understand."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <FilterGrid
            label="Search films"
            placeholder="Search — rights, company, data, court, copyright…"
            filters={[
              { value: "all", label: "All topics" },
              ...topics.map((topic) => ({ value: topic, label: topic })),
            ]}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="Nothing matched"
            emptyBody="Try a broader word, or browse the programmes above."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-h4 text-foreground">Prefer to listen?</p>
              <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-muted-foreground">
                The same knowledge base runs as a podcast network — episodes,
                chapters and written records included.
              </p>
            </div>
            <Link
              href="/listen"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.9rem] font-bold text-foreground"
            >
              <span className="link-underline">Go to Listen</span>
              <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
