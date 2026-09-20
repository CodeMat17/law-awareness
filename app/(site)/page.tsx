import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, ListChecks, Scale, Users } from "lucide-react";
import { HeroSection } from "@/components/site/hero-section";
import { IssueFinder } from "@/components/site/issue-finder";
import { HealthCheckPreview } from "@/components/site/health-check-preview";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  ArticleCard,
  BusinessGuideCard,
  ChecklistCard,
  EntryPointCard,
  GlossaryCard,
  LawCard,
  LiveCard,
  MediaCard,
  QuizCard,
  RightsCard,
} from "@/components/site/cards";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: {
    absolute: "Law Awareness TV — Know the Law. Know Your Rights.",
  },
  description:
    "Understand Nigerian law, protect yourself, protect your business, and know when professional legal help may be necessary.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const content = getContent();

  const [
    stats,
    entryPoints,
    issues,
    liveEvents,
    rights,
    lawCategories,
    guides,
    complianceAreas,
    articles,
    media,
    glossary,
    quizzes,
    checklists,
  ] = await Promise.all([
    content.getPlatformStats(),
    content.getEntryPoints(),
    content.getIssueCategories(),
    content.getLiveEvents(),
    content.getFeaturedRights(),
    content.getLawCategories(),
    content.getBusinessGuides(),
    content.getComplianceAreas(),
    content.getLatestArticles(),
    content.getMediaItems(4),
    content.getGlossaryTerms(6),
    content.getQuizzes(4),
    content.getChecklists(3),
  ]);

  // The session to put in front of a visitor: whatever is on air, otherwise the
  // next one scheduled. Nothing is invented when the schedule is empty — the
  // section simply does not render.
  const featuredSession =
    liveEvents.find((event) => event.liveStatus === "live") ??
    liveEvents.find((event) => event.liveStatus === "scheduled") ??
    null;

  const [featuredRight, ...otherRights] = rights;
  const [leadArticle, ...restArticles] = articles;

  return (
    <>
      <HeroSection
        stats={stats}
        liveTitle={featuredSession?.title}
        liveOnAir={featuredSession?.liveStatus === "live"}
      />

      {/* Why should I care? Six audience-specific entry points. */}
      <Section tone="surface" className="py-12 sm:py-14 lg:py-16">
        <Reveal>
          <p className="text-eyebrow text-muted-foreground">
            Start where you are
          </p>
        </Reveal>
        <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entryPoints.map((entry) => (
            <RevealItem key={entry.id}>
              <EntryPointCard entry={entry} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Issue finder */}
      <Section id="issue-finder">
        <Reveal>
          <SectionHeader
            eyebrow="Issue finder"
            title="What do you need to know?"
            description="Most people arrive with a situation, not a statute. Start from what happened and we will take you to the law behind it."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <IssueFinder categories={issues} />
        </Reveal>
      </Section>

      {/* Featured session */}
      {featuredSession && (
        <Section className="pt-0 sm:pt-0 lg:pt-0">
          <Reveal>
            <LiveCard event={featuredSession} />
          </Reveal>
        </Section>
      )}

      {/* Featured rights — editorial split, not a uniform grid */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Your rights"
            title="Situation first. Law second."
            description="Rights matter most in the moment they are tested. These guides start with the situation you are in."
            action={{ label: "All rights guides", href: "/your-rights" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {featuredRight && (
            <Reveal className="flex">
              <RightsCard right={featuredRight} featured />
            </Reveal>
          )}
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {otherRights.slice(0, 4).map((right) => (
              <RevealItem key={right.id} className="flex">
                <RightsCard right={right} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Know the law */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Know the law"
            title="A legal library built to be understood"
            description="Every subject area of Nigerian law, each separating where the official text lives from the plain-language explanation."
            action={{ label: "Open the library", href: "/know-the-law" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lawCategories.slice(0, 8).map((category) => (
            <RevealItem key={category.slug} className="flex">
              <LawCard category={category} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Business & Enterprise */}
      <Section tone="forest">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-eyebrow flex items-center gap-2 text-primary">
                <span
                  aria-hidden
                  className="inline-block h-px w-6 bg-primary"
                />
                Business &amp; Enterprise
              </p>
              <h2 className="text-h2 mt-3.5">
                Most business legal problems are avoidable
              </h2>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-forest-foreground/80">
                Not because the law is simple, but because the mistakes repeat.
                These guides sit at the decision points where they happen.
              </p>
            </div>
            <Link
              href="/business/guides"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.88rem] font-bold text-forest-foreground"
            >
              <span className="link-underline">All business guides</span>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {guides.map((guide) => (
            <RevealItem key={guide.id} className="flex [&_article]:bg-card">
              <BusinessGuideCard guide={guide} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Stay safe — Before You Sign */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-hairline bg-card p-6 sm:p-10 lg:p-14">
            <div
              aria-hidden
              className="absolute -top-20 -right-16 size-72 rounded-full bg-primary/12 blur-[90px]"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <p className="text-eyebrow text-brand-ink">
                  Stay safe · Before You Sign
                </p>
                <h2 className="text-h2 mt-3.5 text-foreground">
                  The document in front of you is the cheapest place to stop
                </h2>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
                  A recurring series on what to look for in everyday documents:
                  the clauses that matter, the red flags, the questions worth
                  asking, and the point at which you should stop and get
                  professional advice.
                </p>
                <Link
                  href="/stay-safe/before-you-sign"
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
                >
                  Read the series
                  <ArrowRight className="size-4 text-brand-ink" />
                </Link>
              </div>
              <ul className="space-y-3">
                {[
                  {
                    title: "What to look for",
                    body: "The clauses that decide what happens when things go wrong.",
                  },
                  {
                    title: "Red flags",
                    body: "Wording that shifts risk quietly onto the person signing.",
                  },
                  {
                    title: "Questions to ask",
                    body: "Plain questions that expose an unfair term before you commit.",
                  },
                  {
                    title: "When to stop",
                    body: "The signals that mean this needs a qualified professional.",
                  },
                ].map((item, index) => (
                  <li
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-hairline bg-surface p-4"
                  >
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-[0.75rem] font-extrabold text-brand-ink">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-[0.9rem] font-extrabold text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[0.83rem] leading-snug text-muted-foreground">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Latest legal developments — editorial lead + rail */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Law & Society"
            title="Latest legal developments"
            description="Every story is labelled — news, analysis, explainer, opinion or educational — so you always know what you are reading."
            action={{ label: "All coverage", href: "/law-and-society" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          {leadArticle && (
            <Reveal className="flex">
              <ArticleCard article={leadArticle} variant="feature" />
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-hairline bg-card px-5 sm:px-6">
              {restArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="row" />
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Case law + Constitution */}
      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="flex">
            <Link
              href="/constitution"
              className="group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-card p-6 transition-colors hover:border-primary/45 sm:p-10"
            >
              <div
                aria-hidden
                className="bg-ledger absolute inset-0 opacity-40 mask-fade-b"
              />
              <div className="relative">
                <Scale className="size-6 text-brand-ink" strokeWidth={1.8} />
                <h3 className="text-h2 mt-6 text-foreground">
                  Constitution Explorer
                </h3>
                <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                  Search the chapters and sections of the 1999 Constitution,
                  with the official text and a plain-language explanation held
                  clearly apart.
                </p>
              </div>
              <span className="relative mt-10 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground">
                <span className="link-underline">Open the Constitution</span>
                <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="flex">
            <Link
              href="/cases"
              className="group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-card p-6 transition-colors hover:border-primary/45 sm:p-10"
            >
              <div
                aria-hidden
                className="bg-ledger absolute inset-0 opacity-40 mask-fade-b"
              />
              <div className="relative">
                <Compass className="size-6 text-brand-ink" strokeWidth={1.8} />
                <h3 className="text-h2 mt-6 text-foreground">
                  Case Law Explorer
                </h3>
                <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                  Filter decisions by court, year, subject and legal issue —
                  each with the principle it settled and a plain-language
                  explanation of what it means.
                </p>
              </div>
              <span className="relative mt-10 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground">
                <span className="link-underline">Explore case law</span>
                <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Watch & Listen */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Watch & Listen"
            title="Legal education you can follow like a network"
            description="Explainers, documentaries, interviews and podcasts — the same knowledge base, in the format that suits you."
            action={{ label: "Browse all media", href: "/watch" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {media.map((item) => (
            <RevealItem key={item.id} className="flex">
              <MediaCard item={item} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Law in plain language */}
      <Section>
        <Reveal>
          <SectionHeader
            eyebrow="Law in plain language"
            title="The words that keep people out of their own case"
            description="Every term with a simple definition, a real example, and why it matters."
            action={{ label: "Full glossary", href: "/glossary" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {glossary.map((term) => (
            <RevealItem key={term.id} className="flex">
              <GlossaryCard term={term} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Business legal health check */}
      <Section tone="surface">
        <HealthCheckPreview areas={complianceAreas} />
      </Section>

      {/* Legal help */}
      <Section>
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-eyebrow text-brand-ink">Legal help</p>
              <h2 className="text-h2 mt-3.5 text-foreground">
                When you need more than information
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                We will never diagnose your legal position or present automated
                guidance as legal advice. What we can do is help you understand
                the situation and reach the right kind of help.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {[
                {
                  icon: Compass,
                  title: "I have a legal problem",
                  body: "A guided pathway: what the law says, what to do, what to avoid, and when to seek qualified help.",
                  href: "/legal-help/problem",
                },
                {
                  icon: Users,
                  title: "Lawyer directory",
                  body: "Find legal professionals by state, practice area and language, with verification handled administratively.",
                  href: "/lawyers",
                },
                {
                  icon: Scale,
                  title: "Ask a legal question",
                  body: "Submit a question. Every submission is moderated before publication, and privacy is protected.",
                  href: "/ask",
                },
                {
                  icon: ListChecks,
                  title: "Checklists and resources",
                  body: "Printable checklists for the moments that matter — hiring, signing, buying, disputing.",
                  href: "/resources",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-hairline bg-card p-5 transition-colors hover:border-primary/45 sm:p-6"
                >
                  <item.icon
                    className="size-5 text-brand-ink"
                    strokeWidth={1.9}
                  />
                  <h3 className="text-h4 mt-4 text-foreground">{item.title}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.83rem] font-bold text-foreground">
                    <span className="link-underline">Continue</span>
                    <ArrowRight className="size-3.5 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Quizzes and checklists */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="Learn"
            title="Find out what you actually know"
            description="Short, visual quizzes with an explanation and the relevant law behind every answer."
            action={{ label: "All quizzes", href: "/quizzes" }}
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quizzes.map((quiz) => (
            <RevealItem key={quiz.id} className="flex">
              <QuizCard quiz={quiz} />
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.1} className="mt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {checklists.map((checklist) => (
              <ChecklistCard key={checklist.id} checklist={checklist} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Newsletter */}
      <Section>
        <Reveal>
          <NewsletterForm />
        </Reveal>
      </Section>
    </>
  );
}
