import { Icon } from "@/lib/icons";
import {
  CredibilityRow,
  EmptyState,
  PageHeader,
  RelatedContent,
} from "./knowledge";
import { EpisodeRow, TopicChips } from "./media";
import { Section, SectionHeader } from "./primitives";
import { Reveal } from "./reveal";
import type {
  MediaDetail,
  MediaSeries,
  RelatedItem,
} from "@/lib/content/types";

/**
 * One programme or show.
 *
 * Watch and Listen render the same view: the split between them is the route
 * and the vocabulary, not the structure, so a single component keeps the two
 * hubs from drifting apart.
 */
export function SeriesView({
  series,
  items,
  related,
}: {
  series: MediaSeries;
  items: MediaDetail[];
  related: RelatedItem[];
}) {
  const isPodcast = series.kind === "podcast";
  const hubHref = isPodcast ? "/listen" : "/watch";
  const hubLabel = isPodcast ? "Listen" : "Watch";
  const unit = isPodcast ? "episode" : "film";

  // Seasons are only shown when the season actually has items in it, so an
  // empty season heading can never appear above nothing.
  const seasons = (series.seasons ?? [])
    .map((season) => ({
      season,
      items: items.filter((item) => item.season === season.number),
    }))
    .filter((group) => group.items.length > 0);

  const unseasoned = items.filter(
    (item) =>
      typeof item.season !== "number" ||
      !seasons.some((group) => group.season.number === item.season)
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: hubLabel, href: hubHref },
          { label: series.title },
        ]}
        eyebrow={`${hubLabel} · Series`}
        title={series.title}
        lede={series.description}
        meta={
          <CredibilityRow
            meta={series.meta}
            kind={isPodcast ? "Podcast series" : "Programme"}
          />
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2.5 text-[0.85rem] font-bold text-foreground">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/15 text-brand-ink">
              <Icon name={series.icon} className="size-4" strokeWidth={1.9} />
            </span>
            {series.tagline}
          </span>
          <span className="text-[0.82rem] font-semibold text-muted-foreground">
            {series.cadence}
          </span>
          <span className="text-[0.82rem] font-semibold text-muted-foreground">
            {items.length} {items.length === 1 ? unit : `${unit}s`} published
          </span>
        </div>
        <div className="mt-6">
          <TopicChips topics={series.topics} />
        </div>
      </PageHeader>

      <Section className="py-12 sm:py-14 lg:py-16">
        {items.length === 0 ? (
          <Reveal>
            <EmptyState
              title="In preparation"
              body={`Nothing has been published in this series yet. It appears here as soon as the first ${unit} lands.`}
              action={{ label: `Back to ${hubLabel}`, href: hubHref }}
            />
          </Reveal>
        ) : (
          <div className="space-y-12">
            {seasons.map(({ season, items: seasonItems }) => (
              <div key={season.id}>
                <Reveal>
                  <SectionHeader
                    eyebrow={`Season ${season.number}`}
                    title={season.title}
                    description={season.summary}
                  />
                </Reveal>
                <Reveal delay={0.06} className="mt-8">
                  <ul className="space-y-3">
                    {seasonItems.map((item, index) => (
                      <EpisodeRow key={item.id} item={item} index={index} />
                    ))}
                  </ul>
                </Reveal>
              </div>
            ))}

            {unseasoned.length > 0 && (
              <div>
                <Reveal>
                  <SectionHeader
                    eyebrow="All items"
                    title={seasons.length > 0 ? "Also in this series" : "Newest first"}
                    description={
                      seasons.length > 0
                        ? "Items outside the seasons above, including archived live sessions."
                        : "Everything published in this series so far."
                    }
                  />
                </Reveal>
                <Reveal delay={0.06} className="mt-8">
                  <ul className="space-y-3">
                    {unseasoned.map((item, index) => (
                      <EpisodeRow key={item.id} item={item} index={index} />
                    ))}
                  </ul>
                </Reveal>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <Reveal className="mt-14">
            <RelatedContent
              items={related}
              title="The law behind this series"
              description="Where the subjects covered here are written up in full."
            />
          </Reveal>
        )}

      </Section>
    </>
  );
}
