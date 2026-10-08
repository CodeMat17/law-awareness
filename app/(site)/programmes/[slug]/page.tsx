import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/site/knowledge";
import {
  MediaDetailCard,
  ProgrammeCard,
  SeriesCard,
} from "@/components/site/media";
import { Section, SectionHeader } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";
import { getProgrammeLineup } from "@/lib/content/programme-lineup";
import { isProgrammeSlug, PROGRAMME_SLUGS } from "@/lib/content/programmes";

export const dynamicParams = false;

/**
 * The set of programmes is fixed in code; what each is called comes from the
 * CMS. An unpublished programme still has a prerendered route, and 404s from
 * `getProgrammeLineup` returning nothing for it.
 */
export function generateStaticParams() {
  return PROGRAMME_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/programmes/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const programme = await getContent().getProgramme(slug);
  if (!programme) return { title: "Programme not found" };
  return {
    title: `${programme.name} — Programmes`,
    description: programme.description,
    alternates: { canonical: `/programmes/${programme.slug}` },
  };
}

export default async function ProgrammePage(
  props: PageProps<"/programmes/[slug]">
) {
  const { slug } = await props.params;
  if (!isProgrammeSlug(slug)) notFound();
  const lineup = await getProgrammeLineup(slug);
  if (!lineup) notFound();

  const { programme, items } = lineup;
  // A live strand has no series page of its own - its sessions are listed
  // below with the rest, and the schedule at /live is its index.
  const series = lineup.series.filter((strand) => strand.kind !== "live");
  const content = getContent();
  const seriesCounts = await Promise.all(
    series.map(async (strand) => ({
      strand,
      count: (await content.getSeriesItems(strand.slug)).length,
    }))
  );
  const others = (await content.getProgrammeCategories()).filter(
    (item) => item.slug !== slug
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Programmes", href: "/programmes" },
          { label: programme.name },
        ]}
        eyebrow="Programme"
        title={programme.name}
        lede={programme.description}
      >
        {programme.readMore.href && programme.readMore.label && (
          <Link
            href={programme.readMore.href}
            className="group mt-7 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-foreground"
          >
            <span className="link-underline">{programme.readMore.label}</span>
            <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </PageHeader>

      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Episodes"
            title={
              items.length > 0
                ? `Latest from ${programme.name}`
                : "New episodes coming soon"
            }
          />
        </Reveal>
        {items.length > 0 ? (
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <RevealItem key={item.id} className="flex">
                <MediaDetailCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mt-10">
            <EmptyState
              title="Nothing on air here yet"
              body="This programme is being produced. In the meantime, catch up on the rest of the channel."
              action={{ label: "Watch now", href: "/watch" }}
            />
          </Reveal>
        )}
      </Section>

      {seriesCounts.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <SectionHeader eyebrow="Shows" title="Shows in this programme" />
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

      <Section tone={seriesCounts.length > 0 ? "default" : "surface"}>
        <Reveal>
          <SectionHeader eyebrow="Also on Law Awareness TV" title="More programmes" />
        </Reveal>
        <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item) => (
            <RevealItem key={item.slug} className="flex">
              <ProgrammeCard programme={item} variant="tile" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
