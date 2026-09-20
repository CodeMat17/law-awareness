import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import {
  AlertTopicGrid,
  RegulatoryUpdateCard,
} from "@/components/site/business";
import { EmptyState, PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Regulatory Watch — what changed and what it means",
  description:
    "Changes in Nigerian law and regulation, with reporting and legal explanation kept visibly separate: what changed, who is affected, when it takes effect, and what businesses should consider.",
  alternates: { canonical: "/business/regulatory-watch" },
};

/**
 * Topic filtering is a server concern here rather than a client one: the topic
 * lives in the URL, so a filtered view is linkable and shareable. Filtering
 * happens in the repository, and only the matching cards are ever rendered.
 */
export default async function RegulatoryWatchPage(
  props: PageProps<"/business/regulatory-watch">
) {
  const content = getContent();
  const [{ topic }, topics] = await Promise.all([
    props.searchParams,
    content.getAlertTopics(),
  ]);

  const active =
    typeof topic === "string" && topics.some((item) => item.slug === topic)
      ? topic
      : undefined;

  const updates = await content.getRegulatoryUpdates(active);
  const activeLabel = topics.find((item) => item.slug === active)?.label;
  const topicLabel = (slug: string) =>
    topics.find((item) => item.slug === slug)?.label ?? "Update";

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Regulatory Watch" },
        ]}
        eyebrow="Regulatory Watch"
        title="What changed, who it affects, and what it actually means"
        lede="Every entry answers the same questions in the same order, and keeps two things visibly apart: an account of what changed, and our explanation of what it means. The first is reporting. The second is legal education — and neither is advice about your situation."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow={activeLabel ? `Topic · ${activeLabel}` : "All updates"}
            title={
              activeLabel
                ? `Regulatory Watch — ${activeLabel}`
                : "Every Regulatory Watch entry"
            }
            description="Ordered newest first. Each entry names the instrument it concerns and points at the official source."
          />
        </Reveal>

        {/* Topic filter — links, so a filtered view can be shared */}
        <Reveal delay={0.04}>
          <div
            className="no-scrollbar -mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-1"
            role="group"
            aria-label="Filter by topic"
          >
            <Link
              href="/business/regulatory-watch"
              aria-current={active ? undefined : "true"}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-[0.8rem] font-bold transition-colors",
                !active
                  ? "border-primary/50 bg-primary/15 text-brand-ink"
                  : "border-hairline bg-card text-muted-foreground hover:border-primary/35 hover:text-foreground"
              )}
            >
              All topics
            </Link>
            {topics.map((item) => (
              <Link
                key={item.slug}
                href={`/business/regulatory-watch?topic=${item.slug}`}
                aria-current={active === item.slug ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-[0.8rem] font-bold transition-colors",
                  active === item.slug
                    ? "border-primary/50 bg-primary/15 text-brand-ink"
                    : "border-hairline bg-card text-muted-foreground hover:border-primary/35 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Reveal>

        {updates.length > 0 ? (
          <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {updates.map((update) => (
              <RevealItem key={update.id} className="flex">
                <RegulatoryUpdateCard
                  update={update}
                  topicLabel={topicLabel(update.topic)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="Nothing published under this topic yet"
              body="We publish an entry when there is something settled and useful to explain, rather than filling the topic to look complete."
              action={{ label: "See all updates", href: "/business/regulatory-watch" }}
            />
          </div>
        )}
      </Section>

      {/* Law change alerts -------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Law change alerts"
            title="Follow the topics that affect your business"
            description="Follow a topic and its updates land in your alert feed. Following is in-app by default — email is a separate switch in your notification preferences, and it is off until you turn it on."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <AlertTopicGrid topics={topics} />
        </Reveal>

      </Section>
    </>
  );
}
