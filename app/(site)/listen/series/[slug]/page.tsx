import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesView } from "@/components/site/series-view";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const series = await getContent().getMediaSeries("podcast");
  return series.map((strand) => ({ slug: strand.slug }));
}

export async function generateMetadata(
  props: PageProps<"/listen/series/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const series = await getContent().getMediaSeriesBySlug(slug);
  if (!series || series.kind !== "podcast") return { title: "Show not found" };

  return {
    title: `${series.title} — Listen`,
    description: series.description,
    alternates: { canonical: `/listen/series/${series.slug}` },
  };
}

export default async function ListenSeriesPage(
  props: PageProps<"/listen/series/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const series = await content.getMediaSeriesBySlug(slug);
  if (!series || series.kind !== "podcast") notFound();

  const [items, related] = await Promise.all([
    content.getSeriesItems(series.slug),
    content.getRelated(series.related),
  ]);

  return <SeriesView series={series} items={items} related={related} />;
}
