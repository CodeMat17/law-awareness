import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Landmark } from "lucide-react";
import {
  FacetGrid,
  type Facet,
  type FacetItem,
} from "@/components/site/facet-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Pill, Section, SectionHeader } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import {
  constituteHref,
  constitutionRegions,
  worldConstitutions,
  type WorldConstitution,
} from "@/lib/content/world-constitutions";

export const metadata: Metadata = {
  title: "Constitutions of Africa and the United States",
  description:
    "The constitution of every African country and of the United States, in one place — with the year each was adopted and last revised, and a link to the full English text.",
  alternates: { canonical: "/constitutions" },
};

const regionLabel = (value: string) =>
  constitutionRegions.find((region) => region.value === value)?.label ?? value;

function ConstitutionCard({ entry }: { entry: WorldConstitution }) {
  const isNigeria = entry.country === "Nigeria";

  return (
    <article
      className={
        isNigeria
          ? "flex w-full flex-col rounded-2xl border border-primary/45 bg-primary/8 p-6"
          : "flex w-full flex-col rounded-2xl border border-hairline bg-card p-6 transition-colors hover:border-primary/45"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
          <Landmark className="size-[1.15rem]" strokeWidth={1.9} />
        </span>
        <Pill tone={isNigeria ? "brand" : "muted"}>
          {regionLabel(entry.region)}
        </Pill>
      </div>

      <h3 className="text-h4 mt-4 text-foreground">{entry.country}</h3>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.85rem]">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">Adopted</dt>
          <dd className="font-bold text-foreground">{entry.adopted}</dd>
        </div>
        {entry.revised && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Last revised</dt>
            <dd className="font-bold text-foreground">{entry.revised}</dd>
          </div>
        )}
      </dl>

      {entry.note ? (
        <p className="mt-3 flex-1 text-[0.86rem] leading-relaxed text-muted-foreground">
          {entry.note}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
        <a
          href={constituteHref(entry)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-foreground"
        >
          <span className="link-underline">Read the full text</span>
          <ArrowUpRight className="size-3.5 text-brand-ink" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        {isNigeria && (
          <Link
            href="/constitution"
            className="inline-flex text-[0.85rem] font-bold text-foreground link-underline"
          >
            Explained in plain words
          </Link>
        )}
      </div>
    </article>
  );
}

export default function ConstitutionsPage() {
  const african = worldConstitutions.filter(
    (entry) => entry.region !== "americas"
  );

  const facets: Facet[] = [
    {
      id: "region",
      label: "Region",
      options: constitutionRegions.map(({ value, label }) => ({ value, label })),
    },
  ];

  const items: FacetItem[] = worldConstitutions.map((entry) => ({
    id: entry.constitute,
    tags: { region: [entry.region] },
    text: `${entry.country} ${regionLabel(entry.region)} ${entry.adopted} ${
      entry.revised ?? ""
    } ${entry.note ?? ""}`,
    node: <ConstitutionCard entry={entry} />,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Know the Law", href: "/know-the-law" },
          { label: "Constitutions of Africa and the USA" },
        ]}
        eyebrow="Constitutions"
        title="Every African constitution, and America's, in one place"
        lede={`Nigeria's Constitution is one of ${african.length} on the continent. Here is each one, with the year it was adopted and last changed, and a link to the full text in English — useful when a news story, a court case or a debate at home compares our law with a neighbour's.`}
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Search"
            title={`${african.length} African countries, plus the United States`}
            description="Search by country or year, or pick a region. Each link opens the full text on the Constitute Project, a free, non-profit archive of the world's constitutions in English."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <FacetGrid
            label="Search the constitutions"
            placeholder="Try “Ghana”, “Kenya” or “2010”…"
            facets={facets}
            items={items}
            className="gap-5 sm:grid-cols-2 xl:grid-cols-3"
            emptyTitle="No country matched"
            emptyBody="Check the spelling, or clear the region filter — the country may sit in a different region from the one you expect."
          />
        </Reveal>
      </Section>

      <Section tone="surface">
        <Reveal>
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
            <p className="text-eyebrow text-brand-ink">Before you rely on a text</p>
            <h2 className="text-h4 mt-3 text-foreground">
              Constitutions change, and translations are not the law
            </h2>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
              The years shown are those of the text we link to. Where we know a
              country has since adopted a new constitution, or set its
              constitution aside, the card says so. For countries whose official
              language is not English, the linked text is a translation — the
              official version is the one in the country&apos;s own language.
            </p>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
              Only Nigeria&apos;s Constitution has legal force in Nigeria. The
              others are here for comparison and understanding.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/constitution"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Nigeria&apos;s Constitution, explained
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/know-the-law"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              The law library
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
