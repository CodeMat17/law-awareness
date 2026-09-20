import Link from "next/link";
import { PageHeader } from "@/components/site/knowledge";
import { Section } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { cn } from "cn";

export interface PolicySection {
  heading: string;
  /** Body paragraphs, rendered before any list. */
  paragraphs?: string[];
  /** Bulleted points. Each entry may lead with a bolded `term — ` prefix. */
  list?: { term?: string; body: string }[];
}

export interface PolicyPageProps {
  eyebrow: string;
  title: string;
  lede: string;
  /** ISO date the document was last revised. */
  updated: string;
  sections: PolicySection[];
  /** Slug of the current page, so it is marked as current in the strip. */
  current: string;
}

/**
 * The Platform documents (editorial policy, privacy, terms,
 * accessibility) share one reading layout: a header, a sibling strip so a
 * reader can move between them, and numbered prose sections.
 */
const policyLinks = [
  { label: "Editorial Policy", href: "/about/editorial-policy" },
  { label: "Privacy", href: "/about/privacy" },
  { label: "Terms", href: "/about/terms" },
  { label: "Accessibility", href: "/about/accessibility" },
];

export function PolicyPage({
  eyebrow,
  title,
  lede,
  updated,
  sections,
  current,
}: PolicyPageProps) {
  const formatted = new Date(`${updated}T00:00:00Z`).toLocaleDateString(
    "en-NG",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: eyebrow },
        ]}
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        meta={
          <p className="text-[0.82rem] font-semibold text-muted-foreground">
            Last updated{" "}
            <time dateTime={updated} className="text-foreground">
              {formatted}
            </time>
          </p>
        }
      />

      <Section className="pt-10 sm:pt-12 lg:pt-14">
        <Reveal>
          <nav aria-label="Platform documents">
            <ul className="flex flex-wrap gap-2">
              {policyLinks.map((link) => {
                const isCurrent = link.href === current;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "inline-flex h-9 items-center rounded-full border px-4 text-[0.8rem] font-bold transition-colors",
                        isCurrent
                          ? "border-primary/45 bg-primary/12 text-brand-ink"
                          : "border-hairline bg-background text-muted-foreground hover:border-primary/45 hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={0.04}>
              <section
                className={cn(
                  index > 0 && "mt-12 border-t border-hairline pt-12"
                )}
              >
                <h2 className="text-h3 flex items-baseline gap-3 text-foreground">
                  <span
                    aria-hidden
                    className="text-eyebrow shrink-0 text-brand-ink"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-5 space-y-3">
                    {section.list.map((item) => (
                      <li
                        key={item.body.slice(0, 48)}
                        className="flex gap-3 text-[0.95rem] leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span>
                          {item.term && (
                            <strong className="font-bold text-foreground">
                              {item.term} —{" "}
                            </strong>
                          )}
                          {item.body}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>

      </Section>
    </>
  );
}
