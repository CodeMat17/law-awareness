import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock } from "lucide-react";
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
  AgendaList,
  ChapterList,
  ContributorList,
  LiveStatusPill,
  MediaStage,
  SessionPolicies,
  TopicChips,
  Transcript,
  formatSchedule,
} from "@/components/site/media";
import { getContent } from "@/lib/content/repository";

export const dynamicParams = false;

export async function generateStaticParams() {
  const events = await getContent().getLiveEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(
  props: PageProps<"/live/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getContent().getLiveEventBySlug(slug);
  if (!event) return { title: "Session not found" };

  return {
    title: `${event.title} — Live`,
    description: event.description,
    alternates: { canonical: `/live/${event.slug}` },
  };
}

export default async function LiveEventPage(props: PageProps<"/live/[slug]">) {
  const { slug } = await props.params;
  const content = getContent();
  const event = await content.getLiveEventBySlug(slug);
  if (!event) notFound();

  const related = await content.getRelated(event.related);

  const hasRecord =
    event.chapters.length > 0 || event.transcript.cues.length > 0;

  const sections = [
    { id: "about", label: "What it covers" },
    { id: "agenda", label: "Running order" },
    { id: "taking-part", label: "Taking part" },
    ...(event.chapters.length > 0 ? [{ id: "chapters", label: "Chapters" }] : []),
    ...(hasRecord ? [{ id: "record", label: "Written record" }] : []),
    { id: "credits", label: "Who is presenting" },
    { id: "related", label: "Related content" },
  ];

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Live", href: "/live" },
          { label: event.title },
        ]}
        eyebrow={event.series ?? "Live session"}
        title={event.title}
        lede={event.description}
        meta={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <LiveStatusPill status={event.liveStatus} />
            {event.scheduledFor && (
              <span className="inline-flex items-center gap-2 text-[0.82rem] font-bold text-muted-foreground">
                <CalendarClock className="size-4 text-brand-ink" />
                {formatSchedule(event.scheduledFor)}
              </span>
            )}
            <CredibilityRow meta={event.meta} kind="Live session" />
          </div>
        }
      />

      <div className="rail pt-10 sm:pt-12">
        <MediaStage item={event} />
      </div>

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <SessionPolicies event={event} />
            <SourcePanel meta={event.meta} />
          </>
        }
      >
        <ContentBlock
          id="about"
          title="What the session covers"
          className="border-t-0 pt-0"
        >
          <TickList items={event.takeaways} tone="positive" />
          <div className="mt-6">
            <TopicChips topics={event.topics} />
          </div>
        </ContentBlock>

        <ContentBlock
          id="agenda"
          title="Running order"
          description="Relative, not to the minute — a session runs as long as the questions do."
        >
          <AgendaList agenda={event.agenda} />
        </ContentBlock>

        <ContentBlock
          id="taking-part"
          title="Taking part"
          description="What the session will and will not answer."
        >
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
            <p className="text-eyebrow text-brand-ink">Questions are moderated</p>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
              {event.questionPolicy}
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">
              {event.registration}
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">
              {event.archivePolicy}
            </p>
          </div>
        </ContentBlock>

        {event.chapters.length > 0 && (
          <ContentBlock
            id="chapters"
            title="Chapters"
            description={
              event.liveStatus === "ended"
                ? "Where each part of the recording begins."
                : "The points the session moves through."
            }
          >
            <ChapterList chapters={event.chapters} />
          </ContentBlock>
        )}

        {hasRecord && (
          <ContentBlock id="record" title="Written record">
            <Transcript transcript={event.transcript} />
          </ContentBlock>
        )}

        <ContentBlock id="credits" title="Who is presenting">
          <ContributorList contributors={event.contributors} />
        </ContentBlock>

        <RelatedContent items={related} />
      </KnowledgeLayout>
    </>
  );
}
