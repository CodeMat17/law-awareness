import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RequireAccount } from "@/components/account/account-shell";
import { OrganizationPanel } from "@/components/account/organization-panel";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Business account — one library, one watch list, one team",
  description:
    "An organization account for teams: a shared resource library, shared topic monitoring, team members, and the compliance areas that apply to the work you actually do.",
  alternates: { canonical: "/business-account" },
  robots: { index: false, follow: false },
};

/**
 * The tiers from spec section 44, described as capability rather than price.
 * No payment is taken anywhere in this codebase.
 */
const tiers = [
  {
    name: "Free",
    body: "Everything the platform publishes: the law library, articles, videos, podcasts and the basic guides. No account required to read any of it.",
    includes: [
      "Public legal information",
      "The full law library",
      "Articles, videos and podcasts",
      "Basic business guides",
    ],
  },
  {
    name: "Business",
    body: "For a small team that needs to keep track of what applies to it.",
    includes: [
      "Regulatory alerts on followed topics",
      "Compliance resources and checklists",
      "A shared resource library",
      "The compliance calendar",
      "Business legal education",
    ],
  },
  {
    name: "Enterprise",
    body: "For an organization with several people who each need a different part of the same picture.",
    includes: [
      "Organization dashboard",
      "Multiple users with roles",
      "Topic monitoring across the team",
      "Advanced alerts",
      "Organization learning resources",
    ],
  },
];

export default async function BusinessAccountPage() {
  const topics = await getContent().getAlertTopics();

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Business account" }]}
        eyebrow="Business account"
        title="One library, one watch list, one team"
        lede="An organization account keeps the legal awareness of a team in one place: what it has saved, what it is monitoring, and who is on it. Nothing recorded here is published, and nothing here is a compliance certification."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <RequireAccount
            title="Sign in to set up or open an organization"
            body="An organization account is tied to the people in it, so it needs an account before there is anywhere to put it."
          >
            <OrganizationPanel topics={topics} />
          </RequireAccount>
        </Reveal>
      </Section>

      {/* The tiers ---------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="What the tiers mean"
            title="Capability, not billing"
            description="This platform takes no payment. The tiers describe which set of tools an organization is set up to use, so a team can pick the shape that matches how it works."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <RevealItem key={tier.name} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                <p className="text-eyebrow text-brand-ink">{tier.name}</p>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {tier.body}
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[0.86rem] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Where to go next --------------------------------------------------- */}
      <Section>
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">Start with the work</p>
            <h2 className="text-h3 mt-3 text-foreground">
              An account is a place to keep things. The work is on the other
              pages.
            </h2>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted-foreground">
              The Legal Health Check tells you which areas are worth your
              attention. The Compliance Centre explains what each one involves.
              Regulatory Watch tells you when something moves, and the
              amendment tracker shows how an instrument got to where it is.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/business/health-check"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Legal Health Check
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/business/compliance"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Compliance Centre
              </Link>
              <Link
                href="/know-the-law/amendments"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Amendment tracker
              </Link>
            </div>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
