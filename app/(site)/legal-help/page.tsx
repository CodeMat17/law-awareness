import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/knowledge";
import {
  PathwaySpine,
  ProblemCard,
  QuestionCard,
  ReferralCard,
} from "@/components/site/legal-help";
import { EntryPointCard } from "@/components/site/cards";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";
import type { EntryPoint } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Legal Help — start from what happened, not from the law",
  description:
    "Guided educational pathways for real situations, a moderated public Q&A, a lawyer directory, and the routes to free and low-cost legal assistance in Nigeria.",
  alternates: { canonical: "/legal-help" },
};

/** The flow the spec sets out, shown before the reader commits to a pathway. */
const PATHWAY = [
  "What happened",
  "What the law says",
  "What to do",
  "What to avoid",
  "Where to get help",
];

const services: EntryPoint[] = [
  {
    id: "svc-1",
    audience: "citizens",
    eyebrow: "I have a legal problem",
    promise: "Work through a situation step by step",
    href: "/legal-help/problem",
    icon: "list-checks",
  },
  {
    id: "svc-2",
    audience: "citizens",
    eyebrow: "Ask a question",
    promise: "Moderated public answers, in general terms",
    href: "/ask",
    icon: "circle-question",
  },
  {
    id: "svc-3",
    audience: "citizens",
    eyebrow: "Lawyer directory",
    promise: "Find a practitioner by area, state and language",
    href: "/lawyers",
    icon: "users",
  },
  {
    id: "svc-4",
    audience: "citizens",
    eyebrow: "Free and low-cost help",
    promise: "The institutions that must consider your enquiry",
    href: "/legal-help/legal-aid",
    icon: "scale",
  },
];

export default async function LegalHelpPage() {
  const content = getContent();
  const [problems, routes, questions] = await Promise.all([
    content.getLegalProblems(),
    content.getReferralRoutes(),
    content.getPublicQuestions(3),
  ]);

  // The hub leads with the situations that move fastest; the chooser has all
  // of them. Ordering is derived from the pathways, not maintained here.
  const urgent = problems
    .filter((problem) => problem.urgency === "immediate")
    .concat(problems.filter((problem) => problem.urgency === "time-sensitive"))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Legal Help" }]}
        eyebrow="Legal Help"
        title="Start from what happened, not from the law"
        lede="Most people meet the law in the middle of a situation, without the vocabulary for it. These pathways begin where you actually are — and they are honest about the point at which reading stops being enough and you need a lawyer."
      >
        <div className="mt-8">
          <PathwaySpine steps={PATHWAY} />
        </div>
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/legal-help/problem"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            I have a legal problem
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/legal-help/legal-aid"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            I cannot afford a lawyer
          </Link>
        </div>
      </PageHeader>

      {/* What this section is ---------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Four ways in"
            title="Whatever you need, one of these is the door"
            description="Each does a different job, and none of them is legal advice on your situation."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <RevealItem key={service.id}>
              <EntryPointCard entry={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Situations --------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Situations that move fast"
            title="The pathways people reach for first"
            description="Every pathway follows the same shape: what is happening, what the law provides, what to do now, what to avoid, and where to get help."
            action={{ label: `All ${problems.length} situations`, href: "/legal-help/problem" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {urgent.map((problem) => (
            <RevealItem key={problem.id} className="flex">
              <ProblemCard problem={problem} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Referral routes ---------------------------------------------------- */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Where help actually comes from"
            title={`${routes.length} routes to legal assistance`}
            description="Legal aid, professional bodies, state offices, regulators, law clinics and rights organisations. Each entry explains who it is for, how it works, what to take, and what it will not do."
            action={{ label: "Open the guide", href: "/legal-help/legal-aid" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <RevealItem key={route.id} className="flex">
              <ReferralCard route={route} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Questions ---------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Ask a question"
            title="Questions people asked, answered generally"
            description="Every question is read by a person before anything happens to it, published without anything that identifies the asker, and answered as general legal information."
            action={{ label: "Ask your own", href: "/ask" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {questions.map((question) => (
            <RevealItem key={question.id} className="flex">
              <QuestionCard question={question} />
            </RevealItem>
          ))}
        </RevealGroup>

      </Section>
    </>
  );
}
