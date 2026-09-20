import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/knowledge";
import {
  IconBadge,
  Pill,
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: { absolute: "Donate to Law Awareness TV" },
  description:
    "Law Awareness TV is free to read and has no paywall. Donations pay for the research, legal review and production behind every explanation — and never buy influence over one.",
  alternates: { canonical: "/donate" },
};

/**
 * The giving route is configured, never invented: a payment link is published
 * only when one is set, because a donation destination that is wrong or stale
 * is worse than none at all. Until it is set, the page routes through /contact.
 */
const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;

/** Where the money goes. Kept concrete — no "general operations". */
const funds = [
  {
    icon: "scale",
    title: "Legal review",
    body: "Every explanation is checked against the provision it describes before it publishes, and checked again when the law moves. Review is the largest cost on the platform and the one that cannot be automated away.",
  },
  {
    icon: "video",
    title: "Video and audio production",
    body: "Law explained in the formats people actually use — shot, edited, subtitled and captioned. Reaching people who will not read long English text costs more per person, not less.",
  },
  {
    icon: "circle-question",
    title: "The public Q&A",
    body: "Questions arrive faster than they can be answered well. Funding here is what turns a backlog into published answers that help everyone who had the same question.",
  },
  {
    icon: "shield",
    title: "Keeping it free and open",
    body: "No paywall, no registration wall, no selling reader data. Hosting, accessibility work and keeping the archive online are paid for by the people who give, not the people who read.",
  },
];

/** What a gift does not buy. Stated before anyone gives, not after. */
const boundaries = [
  {
    title: "Donations do not influence what we publish",
    body: "Editorial decisions are made by the editorial team alone. No donor sees a piece before publication, reviews a draft, or gets a subject covered or dropped because they gave.",
    href: "/about/editorial-policy",
    linkLabel: "Editorial policy",
  },
  {
    title: "We publish who funds us",
    body: "Institutional grants and sponsorships are disclosed alongside the work they support, and sponsored material is labelled as such. Individual gifts stay private unless you ask to be named.",
    href: "/about",
    linkLabel: "About Law TV",
  },
];

/** Support that is not money — genuinely useful, so listed as an equal. */
const otherWays = [
  {
    title: "Tell us what is wrong",
    body: "A correction is worth more than a small donation. If a page is out of date, unclear or simply wrong, point us at it and at the provision you are reading.",
    href: "/contact",
    action: "Report a correction",
  },
  {
    title: "Lend your expertise",
    body: "Practitioners who can write, review or appear on camera close the gap between what the law says and what people understand it to say.",
    href: "/contact",
    action: "Offer to contribute",
  },
  {
    title: "Pass it on",
    body: "Send the page that answered your question to the person who needs it next. Most people arrive here because someone they trust shared something.",
    href: "/know-the-law",
    action: "Find something to share",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Donate" }]}
        eyebrow="Donate"
        title="Keep legal knowledge free for everyone"
        lede="Not knowing the law is expensive, and it costs most the people least able to pay for an answer. Law Awareness TV has no paywall and never will. Donations are what make that sustainable."
        meta={
          <div className="flex flex-wrap items-center gap-2.5">
            <Pill tone="brand">No paywall</Pill>
            <Pill tone="outline">No reader data sold</Pill>
            <Pill tone="outline">Editorially independent</Pill>
          </div>
        }
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeader
                eyebrow="Why it needs funding"
                title="Free to read is not free to make"
                description="Every explanation here is researched against the primary source, reviewed by someone qualified to catch an error, and kept current as the law changes."
              />
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mt-7 space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                <p>
                  The work that makes a legal explanation trustworthy is the
                  work nobody sees: checking a section number, confirming an
                  amendment is in force, deciding a guide is now wrong enough to
                  take down. It is slow, it is skilled, and it is the reason
                  this platform is worth reading rather than being one more
                  summary of a summary.
                </p>
                <p>
                  We could pay for it with a paywall, and the people who most
                  need to know their rights would be the first ones locked out.
                  We could pay for it by selling attention, and the incentive
                  would quietly bend towards whatever gets clicked rather than
                  whatever is accurate. Reader donations are the funding model
                  that does not pull against the mission.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-7">
              <h2 className="text-h4 text-foreground">Give to Law Aware</h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                Any amount helps, and a small monthly gift helps most — it is
                what lets us commit to review work months ahead instead of
                reacting to whatever arrives.
              </p>

              {donateUrl ? (
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Donate now
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <div className="mt-6 rounded-xl border border-hairline bg-surface p-5">
                  <p className="text-caption text-brand-ink">
                    Online giving is being set up
                  </p>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                    We would rather publish no payment details than details we
                    cannot stand behind. Message us and we will send the current
                    giving route directly.
                  </p>
                  <Link
                    href="/contact"
                    className="group mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
                  >
                    <span className="link-underline">Get in touch to give</span>
                    <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}

              <p className="mt-5 text-[0.78rem] leading-relaxed text-muted-foreground">
                Donations are not tax-deductible and are not a fee for any
                service. If you need a receipt for a gift, ask and we will issue
                one.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Where it goes"
            title="What your donation pays for"
            description="Four costs, in the order they consume the budget."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
          {funds.map((item) => (
            <RevealItem key={item.title} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                <IconBadge name={item.icon} />
                <h3 className="text-h4 mt-4 text-foreground">{item.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeader
                eyebrow="What it does not buy"
                title="The line donations never cross"
              />
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                A platform that explains the law is only useful if readers can
                trust that the explanation was not bought. These limits apply to
                every donor, at every amount, without exception.
              </p>
            </Reveal>
          </div>

          <div className="space-y-5">
            {boundaries.map((item, index) => (
              <Reveal key={item.title} delay={0.04 + index * 0.04}>
                <div className="rounded-2xl border border-hairline bg-card p-6">
                  <h3 className="text-[0.98rem] font-extrabold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-3.5 inline-flex text-[0.83rem] font-bold text-foreground link-underline"
                  >
                    {item.linkLabel}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Other ways to help"
            title="If you cannot give money"
            description="These are not consolation prizes. A correction from a reader who knows the area has kept more people right than most donations."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {otherWays.map((item) => (
            <RevealItem key={item.title} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                <h3 className="text-h4 text-foreground">{item.title}</h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
                <Link
                  href={item.href}
                  className="group mt-5 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
                >
                  <span className="link-underline">{item.action}</span>
                  <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
