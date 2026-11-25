import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/site/knowledge";
import { Section, SectionHeader } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  AboutTheRank,
  SanFeatureBody,
  SanFeatureCard,
  SanFeatureHeader,
} from "@/components/site/san-of-the-week";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "SAN of the Week — a moment with a Senior Advocate of Nigeria",
  description:
    "Every week on Law Awareness TV, a Senior Advocate of Nigeria sits down with us to talk about the law, their work, and what ordinary Nigerians should know.",
  alternates: { canonical: "/san-of-the-week" },
};

// Rebuilt only when Convex changes: a CMS save, or scripts/revalidate.mjs after
// an edit made outside the admin. A feature published early for a future week
// stays hidden until the next such rebuild after its week starts.
export const revalidate = false;

const TRAIL = [{ label: "Home", href: "/" }, { label: "SAN of the Week" }];

export default async function SanOfTheWeekPage() {
  const [current, ...archive] = await getContent().getSanFeatures();

  if (!current) {
    return (
      <>
        <PageHeader
          trail={TRAIL}
          eyebrow="SAN of the Week"
          title="A moment with a Senior Advocate of Nigeria"
          lede="Every week, one of Nigeria's most senior lawyers sits down with Law Awareness TV to talk about the law, their work, and what ordinary people should know."
        />
        <Section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <EmptyState
              title="The first SAN of the Week is coming soon"
              body="Our first conversation is being prepared. Until then, catch up on the channel's latest shows."
              action={{ label: "Watch Law Awareness TV", href: "/watch" }}
            />
            <AboutTheRank />
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <SanFeatureHeader feature={current} trail={TRAIL} current />
      <SanFeatureBody feature={current} />

      {archive.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <SectionHeader
              eyebrow="The archive"
              title="Previous SANs of the Week"
              description="Every conversation so far, newest first."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {archive.map((feature) => (
              <RevealItem key={feature.id} className="flex">
                <SanFeatureCard feature={feature} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
}
