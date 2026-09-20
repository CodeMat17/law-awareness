import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ContentBlock,
  CredibilityRow,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  RelatedContent,
  SourcePanel,
  TickList,
} from "@/components/site/knowledge";
import {
  ChapterList,
  ContributorList,
  EpisodeRow,
  MediaStage,
  Transcript,
  TopicChips,
  formatLabel,
} from "@/components/site/media";
import { SaveButton } from "@/components/account/save-button";
import { getContent } from "@/lib/content/repository";

// A record created in the CMS after the last build has a slug that was not
// in `generateStaticParams`. With `dynamicParams = false` that slug 404s until
// someone redeploys, which makes publishing feel broken; `true` renders it on
// demand instead, and a slug that matches nothing still reaches notFound().
export const dynamicParams = true;

export async function generateStaticParams() {
  const videos = await getContent().getVideos();
  return videos.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(
  props: PageProps<"/watch/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getContent().getMediaDetail("video", slug);
  if (!item) return { title: "Not found" };

  return {
    title: `${item.title} — Watch`,
    description: item.description,
    alternates: { canonical: `/watch/${item.slug}` },
    openGraph: {
      type: "video.other",
      title: item.title,
      description: item.description,
    },
  };
}

export default async function WatchDetailPage(
  props: PageProps<"/watch/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const item = await content.getMediaDetail("video", slug);
  if (!item) notFound();

  const [related, seriesItems, series] = await Promise.all([
    content.getRelated(item.related),
    item.seriesSlug ? content.getSeriesItems(item.seriesSlug) : Promise.resolve([]),
    item.seriesSlug
      ? content.getMediaSeriesBySlug(item.seriesSlug)
      : Promise.resolve(null),
  ]);

  const more = seriesItems.filter((entry) => entry.id !== item.id).slice(0, 4);

  // Each entry must match a block that actually renders: an anchor pointing at
  // a section that was skipped for having no content scrolls nowhere.
  const sections = [
    ...(item.takeaways.length > 0 || item.topics.length > 0
      ? [{ id: "about", label: "What it covers" }]
      : []),
    ...(item.chapters.length > 0 ? [{ id: "chapters", label: "Chapters" }] : []),
    { id: "transcript", label: "Written record" },
    ...(item.contributors.length > 0
      ? [{ id: "credits", label: "Credits" }]
      : []),
    ...(more.length > 0 ? [{ id: "more", label: "More in this series" }] : []),
    { id: "related", label: "Related content" },
  ];

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Watch", href: "/watch" },
          ...(series
            ? [{ label: series.title, href: `/watch/series/${series.slug}` }]
            : []),
          { label: item.title },
        ]}
        eyebrow={`${formatLabel(item.format)}${item.duration ? ` · ${item.duration}` : ""}`}
        title={item.title}
        lede={item.description}
        meta={<CredibilityRow meta={item.meta} kind="Video" />}
      >
        <div className="mt-6">
          <SaveButton
            target={{
              kind: "media",
              title: item.title,
              summary: item.description,
              group: item.series ? `Watch · ${item.series}` : "Watch",
              href: `/watch/${item.slug}`,
            }}
          />
        </div>
      </PageHeader>

      <div className="rail pt-10 sm:pt-12">
        <MediaStage item={item} />
      </div>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SourcePanel meta={item.meta} />
          </>
        }
      >
        {/* Only when there is something to show: a CMS-created item has no
            takeaways or topics until those fields exist, and an empty
            "What you will take from it" is worse than no heading at all. */}
        {(item.takeaways.length > 0 || item.topics.length > 0) && (
          <ContentBlock
            id="about"
            title="What you will take from it"
            className="border-t-0 pt-0"
          >
            <TickList items={item.takeaways} tone="positive" />
            <div className="mt-6">
              <TopicChips topics={item.topics} />
            </div>
          </ContentBlock>
        )}

        {item.chapters.length > 0 && (
          <ContentBlock
            id="chapters"
            title="Chapters"
            description="Where each part of the film begins."
          >
            <ChapterList chapters={item.chapters} />
          </ContentBlock>
        )}

        <ContentBlock id="transcript" title="Written record">
          <Transcript transcript={item.transcript} />
        </ContentBlock>

        {item.contributors.length > 0 && (
          <ContentBlock id="credits" title="Credits">
            <ContributorList contributors={item.contributors} />
          </ContentBlock>
        )}

        {more.length > 0 && series && (
          <ContentBlock
            id="more"
            title={`More from ${series.title}`}
            description={series.tagline}
          >
            <ul className="space-y-3">
              {more.map((entry, index) => (
                <EpisodeRow key={entry.id} item={entry} index={index} />
              ))}
            </ul>
            <Link
              href={`/watch/series/${series.slug}`}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              The full series
            </Link>
          </ContentBlock>
        )}

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}

