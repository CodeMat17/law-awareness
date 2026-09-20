import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FollowTopicButton } from "@/components/account/follow-topic-button";
import { PageHeader } from "@/components/site/knowledge";
import { HistoryBlock } from "@/components/site/law-history";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Icon } from "@/lib/icons";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Amendment tracker — how Nigerian laws have changed",
  description:
    "Version histories for the instruments this platform explains: what was enacted, what replaced it, what is in force now, and where to find the current text.",
  alternates: { canonical: "/know-the-law/amendments" },
};

export default async function AmendmentsPage() {
  const content = getContent();
  const [histories, topics] = await Promise.all([
    content.getLawHistories(),
    content.getAlertTopics(),
  ]);

  // Only the topics an instrument actually sits under — a follow control for a
  // topic with nothing behind it promises alerts that will never arrive.
  const usedTopics = topics.filter((topic) =>
    histories.some((history) => history.topic === topic.slug)
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Know the Law", href: "/know-the-law" },
          { label: "Amendment tracker" },
        ]}
        eyebrow="Law versioning"
        title="Laws change. The old version does not stop existing."
        lede="Every instrument this platform explains has a history: what was enacted, what repealed or altered it, and what is in force today. Nothing here is overwritten when a law changes — a reader holding a copy of a repealed Act needs to see where it sits, not be told it never existed."
      />

      {/* Why this exists ---------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">How to read this</p>
            <h2 className="text-h3 mt-3 text-foreground">
              Years, not commencement dates
            </h2>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted-foreground">
              Each version records the year it belongs to, not a precise date of
              commencement. A commencement date is easy to state confidently and
              easy to get wrong, and a wrong one is worse than none — it will be
              relied on. Where the exact date matters, the gazette and the
              official text are the authorities, not this page.
            </p>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted-foreground">
              Changes are described by subject matter, in general terms. We do
              not reproduce the wording of any provision, before or after an
              amendment.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Alerts ------------------------------------------------------------- */}
      {usedTopics.length > 0 && (
        <Section tone="surface" className="pt-0 sm:pt-0 lg:pt-0">
          <Reveal>
            <SectionHeader
              eyebrow="Law-change alerts"
              title="Follow a topic and we will tell you when something moves"
              description="Following is in-app by default. Email is a separate switch in your notification preferences, and it is off until you turn it on."
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {usedTopics.map((topic) => (
              <RevealItem key={topic.slug} className="flex">
                <div className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
                    <Icon
                      name={topic.icon}
                      className="size-[1.15rem]"
                      strokeWidth={1.9}
                    />
                  </span>
                  <h3 className="text-h4 mt-4 text-foreground">{topic.label}</h3>
                  <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {topic.description}
                  </p>
                  <div className="mt-5">
                    <FollowTopicButton
                      topic={topic.slug}
                      label={topic.label}
                      className="w-full justify-center"
                    />
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* The histories ------------------------------------------------------ */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="The record"
            title={`${histories.length} instruments, tracked version by version`}
            description="Newest version first. Every superseded version stays on the record."
          />
        </Reveal>

        <div className="mt-10 space-y-6">
          {histories.map((history, index) => (
            <Reveal key={history.id} delay={Math.min(index * 0.04, 0.2)}>
              <HistoryBlock history={history} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">Keep going</p>
            <h2 className="text-h3 mt-3 text-foreground">
              A change to the law is not the same as a change to your obligations
            </h2>
            <p className="mt-3 max-w-3xl text-[0.92rem] leading-relaxed text-muted-foreground">
              An amendment tells you the framework moved. What it means for you
              depends on what you do, where you do it and who regulates it.
              Regulatory Watch explains recent movements in context, and the
              Compliance Centre turns them into things a business can actually
              check.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/business/regulatory-watch"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Regulatory Watch
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/business/compliance"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Compliance Centre
              </Link>
            </div>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
