import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChecklistCard } from "@/components/site/cards";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Resource centre — checklists, glossary and where to look",
  description:
    "Practical checklists you can work through, the plain-language glossary, and the official Nigerian sources to check before you rely on anything.",
  alternates: { canonical: "/resources" },
};

/**
 * Official bodies are named, not linked. We do not publish a web address we
 * have not verified, and a wrong address on a page about where to find the real
 * law would be the worst possible error to make.
 */
const officialSources = [
  {
    label: "National Assembly",
    body: "Bills before the legislature, and Acts as passed. The starting point when you need the text of a statute rather than a description of it.",
  },
  {
    label: "Corporate Affairs Commission",
    body: "Company and business name registration, filings and beneficial ownership under CAMA 2020.",
  },
  {
    label: "Nigeria Data Protection Commission",
    body: "Guidance, registration and complaints under the Nigeria Data Protection Act 2023.",
  },
  {
    label: "Federal Competition and Consumer Protection Commission",
    body: "Consumer complaints and competition matters under the FCCPA 2018.",
  },
  {
    label: "State lands registries",
    body: "Searches, consent and registration for land transactions. The registry for the state where the land sits is the only one that matters.",
  },
  {
    label: "Legal Aid Council of Nigeria",
    body: "Free legal assistance for those who qualify, alongside university law clinics and NGO legal services.",
  },
];

export default async function ResourcesPage() {
  const content = getContent();
  const [checklists, glossary] = await Promise.all([
    content.getChecklists(),
    content.getGlossaryTerms(8),
  ]);

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Resource centre" }]}
        eyebrow="Resource centre"
        title="The things you use, rather than read"
        lede="Checklists to work through before a decision, the plain-language glossary for the words that get in the way, and the official sources to check before you rely on anything — including us."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Checklists"
            title="Work through it before, not after"
            description="Each list is a sequence of things to establish, in the order that makes the next one cheaper. Tick as you go — progress stays in your browser."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {checklists.map((checklist) => (
            <RevealItem key={checklist.id} className="flex">
              <ChecklistCard checklist={checklist} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Glossary"
            title="The words that do the gatekeeping"
            description="Legal language is the first barrier most people meet. Every term is defined in ordinary words, with an example."
            action={{ label: "Full glossary", href: "/glossary" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {glossary.map((term) => (
            <RevealItem key={term.id} className="flex">
              <Link
                href={`/glossary/${term.slug}`}
                className="group flex w-full flex-col rounded-2xl border border-hairline bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="text-[0.95rem] font-extrabold text-foreground">
                  {term.term}
                </span>
                <span className="mt-2 line-clamp-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {term.definition}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Where to look"
            title="Official sources, and why they matter"
            description="Everything on this platform is an explanation of the law. These are the bodies that hold the law itself, and the ones to check before you act."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {officialSources.map((source) => (
            <RevealItem key={source.label} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                <h3 className="text-[0.98rem] font-extrabold text-foreground">
                  {source.label}
                </h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {source.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.08} className="mt-10">
          <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">Still stuck?</p>
            <h2 className="text-h3 mt-3 text-foreground">
              A resource is not a substitute for someone reading your papers
            </h2>
            <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
              Checklists and glossaries prepare you for a conversation. They do
              not replace it where money, liberty, property or a deadline is
              involved.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/legal-help"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Legal Help
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/legal-help/legal-aid"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Free and low-cost help
              </Link>
            </div>
          </div>
        </Reveal>

      </Section>
    </>
  );
}
