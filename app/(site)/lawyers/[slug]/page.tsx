import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ContentBlock,
  KnowledgeLayout,
  OnThisPage,
  PageHeader,
  Prose,
  TickList,
} from "@/components/site/knowledge";
import {
  AvailabilityLabel,
  InlineCaution,
  ListingStatusBadge,
  VerificationPanel,
} from "@/components/site/legal-help";
import { Pill } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";
import type { ExperienceBand } from "@/lib/content/types";

export const dynamicParams = false;

export async function generateStaticParams() {
  const listings = await getContent().getLawyerListings();
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata(
  props: PageProps<"/lawyers/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = await getContent().getLawyerListing(slug);
  if (!listing) return { title: "Listing not found" };

  return {
    title: `${listing.displayName} — Lawyer directory`,
    description: listing.focus,
    alternates: { canonical: `/lawyers/${listing.slug}` },
    // A sample listing must never be indexed as though it were a practitioner.
    robots: listing.listingStatus === "verified" ? undefined : { index: false },
  };
}

const experienceLabel: Record<ExperienceBand, string> = {
  "1-5": "1–5 years in practice",
  "6-10": "6–10 years in practice",
  "11-20": "11–20 years in practice",
  "20+": "Over 20 years in practice",
};

const sections = [
  { id: "about", label: "About this listing" },
  { id: "practice", label: "Practice and languages" },
  { id: "consultation", label: "Consultation" },
  { id: "credentials", label: "Credentials" },
  { id: "verification", label: "Verification" },
];

export default async function LawyerProfilePage(
  props: PageProps<"/lawyers/[slug]">
) {
  const { slug } = await props.params;
  const listing = await getContent().getLawyerListing(slug);
  if (!listing) notFound();

  const isSample = listing.listingStatus !== "verified";

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Lawyer directory", href: "/lawyers" },
          { label: listing.displayName },
        ]}
        eyebrow={`${listing.city}, ${listing.state}`}
        title={listing.displayName}
        lede={listing.focus}
        meta={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <ListingStatusBadge status={listing.listingStatus} />
            <AvailabilityLabel availability={listing.availability} />
            <span className="text-[0.8rem] font-semibold text-muted-foreground">
              {experienceLabel[listing.experienceBand]}
            </span>
          </div>
        }
      />

      <KnowledgeLayout
        aside={
          <>
            <OnThisPage items={sections} />
            <div className="rounded-2xl border border-hairline bg-surface p-5">
              <p className="text-eyebrow text-muted-foreground">
                Before you engage anyone
              </p>
              <div className="mt-4">
                <TickList
                  items={[
                    "Confirm the practitioner's standing with the Nigerian Bar Association",
                    "Agree in writing what the work is and how it is charged",
                    "Ask who will actually handle the matter day to day",
                    "Keep your own copy of every document you hand over",
                  ]}
                />
              </div>
              <Link
                href="/legal-help/legal-aid"
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-card px-4 text-[0.85rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                If you cannot pay
                <ArrowRight className="size-4 text-brand-ink" />
              </Link>
            </div>
          </>
        }
      >
        {isSample && (
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
            <p className="text-eyebrow text-brand-ink">
              This is not a real practitioner
            </p>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
              This is a structured sample listing, shaped as a practice and a
              location rather than as a person. It exists so the directory can
              be built, filtered and reviewed before any practitioner is
              published. No name, photograph or credential here belongs to
              anyone, and nothing on this page should be used to choose a
              lawyer.
            </p>
            <Link
              href="/legal-help/legal-aid"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Routes that can help you today
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}

        <ContentBlock
          id="about"
          title="About this listing"
          description="What a practice of this shape typically does, and what to expect when approaching one."
        >
          <Prose paragraphs={listing.about} />
        </ContentBlock>

        <ContentBlock
          id="practice"
          title="Practice and languages"
          description="The two facts that most often decide whether a practitioner can help with your matter."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-caption text-foreground">Practice areas</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {listing.practiceAreas.map((area) => (
                  <Pill key={area} tone="brand">
                    {area}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <p className="text-caption text-foreground">Languages</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {listing.languages.map((language) => (
                  <Pill key={language} tone="outline">
                    {language}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
          <InlineCaution>
            A practice area tells you what a practitioner works on. It does not
            tell you whether they can take your matter, and it says nothing
            about how a matter will end.
          </InlineCaution>
        </ContentBlock>

        <ContentBlock
          id="consultation"
          title="Consultation"
          description="How an initial approach is normally handled."
        >
          <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-6">
            <p className="text-[0.93rem] leading-relaxed text-muted-foreground">
              {listing.consultation}
            </p>
            <div className="mt-5 border-t border-hairline pt-4">
              <InlineCaution>
                We publish no fees. What a practitioner charges, and how, is
                agreed between you and them — in writing, before the work
                starts.
              </InlineCaution>
            </div>
          </div>
        </ContentBlock>

        <ContentBlock
          id="credentials"
          title="Credentials"
          description="What has been confirmed about this listing by an actual process."
        >
          {listing.credentials.length > 0 ? (
            <TickList items={listing.credentials} tone="positive" />
          ) : (
            <div className="rounded-2xl border border-dashed border-hairline bg-surface p-6 sm:p-8">
              <p className="text-[0.93rem] font-extrabold text-foreground">
                Nothing has been verified for this listing
              </p>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                We publish a credential only once we have confirmed it
                ourselves. This listing has none, and an empty section is the
                accurate way to say so.
              </p>
            </div>
          )}
        </ContentBlock>

        <ContentBlock
          id="verification"
          title="Verification"
          description="The process that has to run before any listing here carries a person's name."
        >
          <VerificationPanel />
        </ContentBlock>
      </KnowledgeLayout>
    </>
  );
}
