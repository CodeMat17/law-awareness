import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesView } from "@/components/site/series-view";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const series = await getContent().getMediaSeries("video");
  return series.map((strand) => ({ slug: strand.slug }));
}

export async function generateMetadata(
  props: PageProps<"/watch/series/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const series = await getContent().getMediaSeriesBySlug(slug);
  if (!series || series.kind !== "video") return { title: "Series not found" };

  return {
    title: `${series.title} — Watch`,
    description: series.description,
    alternates: { canonical: `/watch/series/${series.slug}` },
  };
}

export default async function WatchSeriesPage(
  props: PageProps<"/watch/series/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const series = await content.getMediaSeriesBySlug(slug);
  // A podcast strand reached through the video route would contradict its own
  // breadcrumb, so it is a 404 rather than a page that lies about itself.
  if (!series || series.kind !== "video") notFound();

  const [items, related] = await Promise.all([
    content.getSeriesItems(series.slug),
    content.getRelated(series.related),
  ]);

  return <SeriesView series={series} items={items} related={related} />;
}
