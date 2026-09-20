import type { Metadata } from "next";
import Link from "next/link";
import { Radio } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/site/knowledge";
import {
  LiveEventCard,
  LiveStatusPill,
  formatSchedule,
} from "@/components/site/media";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Live — open legal education sessions",
  description:
    "Live sessions on Nigerian law with moderated audience questions. See what is on air, what is scheduled, and the archive of past sessions.",
  alternates: { canonical: "/live" },
};

export default async function LivePage() {
  const events = await getContent().getLiveEvents();

  const onAir = events.filter((event) => event.liveStatus === "live");
  const upcoming = events.filter((event) => event.liveStatus === "scheduled");
  const archive = events.filter((event) => event.liveStatus === "ended");

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Live" }]}
        eyebrow="Live"
        title="Open sessions, with the questions asked out loud"
        lede="A short briefing, then moderated questions from the audience. Sessions are general legal education — they never advise on anyone's individual case — and every one becomes an on-demand page when it ends."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        {onAir.length > 0 ? (
          <Reveal>
            <article className="relative overflow-hidden rounded-3xl border border-hairline bg-forest p-6 text-forest-foreground sm:p-9 lg:p-12">
              <div aria-hidden className="bg-ledger absolute inset-0 opacity-15" />
              <div
                aria-hidden
                className="absolute -top-24 -right-16 size-80 rounded-full bg-primary/20 blur-[90px]"
              />
              <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <LiveStatusPill status="live" />
                    {onAir[0].series && (
                      <span className="text-eyebrow text-forest-foreground/70">
                        {onAir[0].series}
                      </span>
                    )}
                  </div>
                  <h2 className="text-h1 mt-5 max-w-2xl">{onAir[0].title}</h2>
                  <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-forest-foreground/80">
                    {onAir[0].description}
                  </p>
                </div>
                <Link
                  href={`/live/${onAir[0].slug}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Radio className="size-4" />
                  Join the session
                </Link>
              </div>
            </article>
          </Reveal>
        ) : (
          <Reveal>
            <EmptyState
              title="Nothing is on air right now"
              body={
                upcoming.length > 0 && upcoming[0].scheduledFor
                  ? `The next session is ${formatSchedule(upcoming[0].scheduledFor)}. It opens on this page when it begins.`
                  : "Sessions are announced here and in the update stripe at the top of every page."
              }
              action={
                upcoming.length > 0
                  ? { label: "See what is next", href: `/live/${upcoming[0].slug}` }
                  : { label: "Browse the archive", href: "/watch" }
              }
            />
          </Reveal>
        )}
      </Section>

      {upcoming.length > 0 && (
        <Section tone="surface" className="py-14 sm:py-16 lg:py-20">
          <Reveal>
            <SectionHeader
              eyebrow="Scheduled"
              title={`${upcoming.length} session${upcoming.length === 1 ? "" : "s"} coming up`}
              description="Free and open. No registration is required to watch."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <RevealItem key={event.id} className="flex">
                <LiveEventCard event={event} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <Section className="py-14 sm:py-16 lg:py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Archive"
            title={
              archive.length > 0
                ? `${archive.length} past session${archive.length === 1 ? "" : "s"}`
                : "Past sessions"
            }
            description="Every session that has ended keeps its page, its chapters and its written record."
          />
        </Reveal>
        {archive.length > 0 ? (
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((event) => (
              <RevealItem key={event.id} className="flex">
                <LiveEventCard event={event} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mt-10">
            <EmptyState
              title="No archived sessions yet"
              body="Once a session ends, its recording, chapters and written record stay at the same address."
            />
          </Reveal>
        )}

      </Section>
    </>
  );
}
