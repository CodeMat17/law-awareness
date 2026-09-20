import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Law Awareness TV — corrections, accessibility problems, press and partnership enquiries, and general questions about the platform.",
  alternates: { canonical: "/contact" },
};

/** Routes that answer faster than a message would. */
const routes = [
  {
    title: "A question about the law",
    body: "General legal questions go through the moderated public Q&A, where the answer helps everyone who has the same question. It is the fastest route, and the only one that produces a published answer.",
    href: "/ask",
    action: "Ask a question",
  },
  {
    title: "A legal problem happening now",
    body: "If something is already under way — a deadline, a demand, a court date — start with the guided pathway. It points at the area of law and the kind of help the situation calls for.",
    href: "/legal-help/problem",
    action: "Describe the problem",
  },
  {
    title: "You need a practitioner",
    body: "We do not take instructions and we do not represent anyone. The directory and the legal-aid routes are where to look for someone who can.",
    href: "/legal-help/legal-aid",
    action: "Find help",
  },
];

const desks = [
  {
    label: "Corrections",
    body: "Something we published is wrong, out of date or unclear. Point us at the page and the provision you are reading — corrections are treated as defects, not opinions.",
    href: "/about/editorial-policy",
    linkLabel: "Editorial policy",
  },
  {
    label: "Accessibility",
    body: "Any barrier that stopped you getting to something. Tell us the page, what you were doing, and the browser or assistive technology you were using.",
    href: "/about/accessibility",
    linkLabel: "Accessibility commitment",
  },
  {
    label: "Privacy and data",
    body: "Access, correction, deletion or any other request about personal data we hold about you.",
    href: "/about/privacy",
    linkLabel: "Privacy policy",
  },
  {
    label: "Press, partnerships and contributors",
    body: "Media enquiries, distribution and sponsorship conversations, and practitioners who would like to write, review or appear.",
    href: "/about",
    linkLabel: "About Law TV",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Talk to us"
        lede="A person reads every message. Before you write, check whether one of the routes below answers your question faster — most do."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="Faster than a message"
            title="Three things we are asked most"
            description="These have dedicated routes because a contact form is the slowest way to get any of them answered."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <RevealItem key={route.href} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                <h3 className="text-h4 text-foreground">{route.title}</h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {route.body}
                </p>
                <Link
                  href={route.href}
                  className="group mt-5 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
                >
                  <span className="link-underline">{route.action}</span>
                  <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeader
                eyebrow="Send a message"
                title="Everything else"
                description="Corrections, accessibility, press, partnerships and general enquiries about the platform."
              />
            </Reveal>
            <Reveal delay={0.06} className="mt-8">
              <ContactForm />
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h2 className="text-eyebrow text-brand-ink">Who picks it up</h2>
            </Reveal>
            <div className="mt-6 space-y-5">
              {desks.map((desk, index) => (
                <Reveal key={desk.label} delay={0.04 + index * 0.03}>
                  <div className="rounded-2xl border border-hairline bg-card p-5">
                    <h3 className="text-[0.95rem] font-extrabold text-foreground">
                      {desk.label}
                    </h3>
                    <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {desk.body}
                    </p>
                    <Link
                      href={desk.href}
                      className="mt-3 inline-flex text-[0.83rem] font-bold text-foreground link-underline"
                    >
                      {desk.linkLabel}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
