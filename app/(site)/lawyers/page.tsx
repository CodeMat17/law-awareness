import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FacetGrid, type Facet, type FacetItem } from "@/components/site/facet-grid";
import { PageHeader } from "@/components/site/knowledge";
import {
  ListingCard,
  ReferralCard,
  VerificationPanel,
} from "@/components/site/legal-help";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";
import type { ListingAvailability } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Lawyer directory — find a practitioner by area, state and language",
  description:
    "A structured directory of legal practice, filterable by practice area, state, city, language, experience and availability. Listings are labelled sample until verification is complete.",
  alternates: { canonical: "/lawyers" },
};

const availabilityLabel: Record<ListingAvailability, string> = {
  accepting: "Accepting enquiries",
  waitlist: "Waiting list",
  "not-accepting": "Not accepting",
};

const experienceLabel: Record<string, string> = {
  "1-5": "1–5 years",
  "6-10": "6–10 years",
  "11-20": "11–20 years",
  "20+": "Over 20 years",
};

export default async function LawyerDirectoryPage() {
  const content = getContent();
  const [listings, facets, routes] = await Promise.all([
    content.getLawyerListings(),
    content.getDirectoryFacets(),
    content.getReferralRoutes(),
  ]);

  const filterFacets: Facet[] = [
    {
      id: "practiceAreas",
      label: "Practice area",
      options: facets.practiceAreas.map((value) => ({ value, label: value })),
    },
    {
      id: "state",
      label: "State",
      options: facets.states.map((value) => ({ value, label: value })),
    },
    {
      id: "city",
      label: "City",
      options: facets.cities.map((value) => ({ value, label: value })),
    },
    {
      id: "languages",
      label: "Language",
      options: facets.languages.map((value) => ({ value, label: value })),
    },
    {
      id: "experienceBand",
      label: "Experience",
      options: facets.experienceBands.map((value) => ({
        value,
        label: experienceLabel[value] ?? value,
      })),
    },
    {
      id: "availability",
      label: "Availability",
      options: facets.availability.map((value) => ({
        value,
        label: availabilityLabel[value as ListingAvailability] ?? value,
      })),
    },
  ];

  const items: FacetItem[] = listings.map((listing) => ({
    id: listing.id,
    tags: {
      practiceAreas: listing.practiceAreas,
      state: [listing.state],
      city: [listing.city],
      languages: listing.languages,
      experienceBand: [listing.experienceBand],
      availability: [listing.availability],
    },
    text: `${listing.displayName} ${listing.focus} ${listing.practiceAreas.join(" ")} ${listing.city} ${listing.state} ${listing.languages.join(" ")}`,
    node: <ListingCard listing={listing} />,
  }));

  // The free and low-cost routes lead the page for anyone who cannot pay, and
  // they are shown before the directory rather than under it.
  const freeRoutes = routes.filter(
    (route) => route.kind === "legal-aid" || route.kind === "law-clinic"
  );

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Lawyer directory" }]}
        eyebrow="Lawyer directory"
        title="Find a legal practitioner by what you need, where you are, and the language you speak"
        lede="The directory is built around the six things that actually decide whether a practitioner can help you. It does not rank anyone, and it will never tell you who is best — that is not a thing a directory can honestly know."
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/legal-help/legal-aid"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            I cannot afford a lawyer
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/legal-help/problem"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            I am not sure what I need
          </Link>
        </div>
      </PageHeader>

      {/* Verification ------------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <VerificationPanel />
        </Reveal>
      </Section>

      {/* The directory ------------------------------------------------------ */}
      <Section tone="surface" className="pt-0 sm:pt-0 lg:pt-0">
        <Reveal>
          <SectionHeader
            eyebrow="The directory"
            title={`${listings.length} listings across ${facets.states.length} states`}
            description="Filter on any combination. Every listing shows its availability honestly, including the ones not taking new matters — hiding those would waste the enquiry of whoever filtered them in."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <FacetGrid
            label="Search the directory"
            placeholder="Search a practice area, a city or a language…"
            facets={filterFacets}
            items={items}
            className="sm:grid-cols-2 xl:grid-cols-3"
          />
        </Reveal>
      </Section>

      {/* Free routes -------------------------------------------------------- */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="If cost is the obstacle"
            title="These routes exist for people who cannot pay"
            description="They have their own criteria and their own capacity, and neither is decided by us — but neither charges for the assistance it gives."
            action={{ label: "All routes to help", href: "/legal-help/legal-aid" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
          {freeRoutes.map((route) => (
            <RevealItem key={route.id} className="flex">
              <ReferralCard route={route} />
            </RevealItem>
          ))}
        </RevealGroup>

      </Section>
    </>
  );
}
