import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/knowledge";
import {
  IconBadge,
  Pill,
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

/**
 * Donate.
 *
 * The layout is fixed here; every word, and the link the Donate button goes
 * to, comes from the "Donate page" record in the CMS.
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent().getDonatePage();
  const title = page?.metaTitle || page?.title || "Donate";
  return {
    // A title that already names the channel is used as it stands, rather than
    // having the site-wide "| Law Awareness TV" suffix added a second time.
    title: title.includes("Law Awareness TV") ? { absolute: title } : title,
    description: page?.metaDescription || page?.lede || undefined,
    alternates: { canonical: "/donate" },
  };
}

export default async function DonatePage() {
  const page = await getContent().getDonatePage();
  if (!page) notFound();

  const { why, give, funds, boundaries, otherWays } = page;
  // The giving route is configured, never invented: a payment link is shown
  // only when one is set, because a donation destination that is wrong or
  // stale is worse than none at all. The CMS field wins; the environment
  // variable is what deployments used before the field existed.
  // Only a web address is accepted, so a mistyped value cannot become a
  // button that runs something instead of opening a payment page.
  const candidate = give.url || process.env.NEXT_PUBLIC_DONATE_URL || "";
  const donateUrl = /^https?:\/\//i.test(candidate) ? candidate : undefined;

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: page.eyebrow || page.title }]}
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.lede || undefined}
        meta={
          page.badges.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2.5">
              {page.badges.map((badge, index) => (
                <Pill key={badge} tone={index === 0 ? "brand" : "outline"}>
                  {badge}
                </Pill>
              ))}
            </div>
          ) : undefined
        }
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_minmax(0,1fr)] lg:gap-16">
          <div>
            {why.title && (
              <Reveal>
                <SectionHeader
                  eyebrow={why.eyebrow}
                  title={why.title}
                  description={why.description || undefined}
                />
              </Reveal>
            )}
            {why.paragraphs.length > 0 && (
              <Reveal delay={0.06}>
                <div className="mt-7 space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {why.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-7">
              {give.heading && (
                <h2 className="text-h4 text-foreground">{give.heading}</h2>
              )}
              {give.body && (
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {give.body}
                </p>
              )}

              {donateUrl ? (
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {give.buttonLabel}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <div className="mt-6 rounded-xl border border-hairline bg-surface p-5">
                  {give.pendingHeading && (
                    <p className="text-caption text-brand-ink">
                      {give.pendingHeading}
                    </p>
                  )}
                  {give.pendingBody && (
                    <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {give.pendingBody}
                    </p>
                  )}
                  <Link
                    href="/contact"
                    className="group mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
                  >
                    <span className="link-underline">{give.pendingLinkLabel}</span>
                    <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}

              {give.note && (
                <p className="mt-5 text-[0.78rem] leading-relaxed text-muted-foreground">
                  {give.note}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {funds.items.length > 0 && (
        <Section tone="surface">
          {funds.title && (
            <Reveal>
              <SectionHeader
                eyebrow={funds.eyebrow}
                title={funds.title}
                description={funds.description || undefined}
              />
            </Reveal>
          )}
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {funds.items.map((item) => (
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
      )}

      {boundaries.items.length > 0 && (
        <Section>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:gap-16">
            <div>
              {boundaries.title && (
                <Reveal>
                  <SectionHeader
                    eyebrow={boundaries.eyebrow}
                    title={boundaries.title}
                  />
                </Reveal>
              )}
              {boundaries.intro && (
                <Reveal delay={0.06}>
                  <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {boundaries.intro}
                  </p>
                </Reveal>
              )}
            </div>

            <div className="space-y-5">
              {boundaries.items.map((item, index) => (
                <Reveal key={item.title} delay={0.04 + index * 0.04}>
                  <div className="rounded-2xl border border-hairline bg-card p-6">
                    <h3 className="text-[0.98rem] font-extrabold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                    {item.href && item.linkLabel && (
                      <Link
                        href={item.href}
                        className="mt-3.5 inline-flex text-[0.83rem] font-bold text-foreground link-underline"
                      >
                        {item.linkLabel}
                      </Link>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {otherWays.items.length > 0 && (
        <Section tone="surface">
          {otherWays.title && (
            <Reveal>
              <SectionHeader
                eyebrow={otherWays.eyebrow}
                title={otherWays.title}
                description={otherWays.description || undefined}
              />
            </Reveal>
          )}
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {otherWays.items.map((item) => (
              <RevealItem key={item.title} className="flex">
                <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                  <h3 className="text-h4 text-foreground">{item.title}</h3>
                  <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  {item.href && item.linkLabel && (
                    <Link
                      href={item.href}
                      className="group mt-5 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
                    >
                      <span className="link-underline">{item.linkLabel}</span>
                      <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
}
