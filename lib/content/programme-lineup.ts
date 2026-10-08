import { getContent } from "./repository";
import type { ProgrammeCategory, ProgrammeSlug } from "./programmes";
import type { MediaDetail, MediaSeries } from "./types";

export interface ProgrammeLineup {
  programme: ProgrammeCategory;
  /** Videos, podcast episodes and live sessions, newest first. */
  items: MediaDetail[];
  series: MediaSeries[];
}

/**
 * Everything on the channel, grouped by programme category.
 *
 * Derived from the hubs rather than stored, so a programme page can never
 * disagree with Watch, Listen or Live about what has been published.
 */
export async function getProgrammeLineups(): Promise<ProgrammeLineup[]> {
  const content = getContent();
  const [programmes, videos, episodes, live, series] = await Promise.all([
    content.getProgrammeCategories(),
    content.getVideos(),
    content.getPodcastEpisodes(),
    content.getLiveEvents(),
    content.getMediaSeries(),
  ]);
  const items = [...videos, ...episodes, ...live].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return programmes.map((programme) => ({
    programme,
    items: items.filter((item) => item.programme === programme.slug),
    series: series.filter((strand) => strand.programme === programme.slug),
  }));
}

export async function getProgrammeLineup(
  slug: ProgrammeSlug
): Promise<ProgrammeLineup | null> {
  const lineups = await getProgrammeLineups();
  return lineups.find((lineup) => lineup.programme.slug === slug) ?? null;
}
