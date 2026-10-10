import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { PageHeader } from "@/components/site/knowledge";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

/**
 * Contact.
 *
 * The layout - the cards, the form and the desks beside it - is fixed here.
 * Every word comes from the "Contact page" record in the CMS.
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent().getContactPage();
  return {
    title: page?.metaTitle || page?.title || "Contact",
    description: page?.metaDescription || page?.lede || undefined,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const page = await getContent().getContactPage();
  if (!page) notFound();

  const { routes, form, desks } = page;

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: page.eyebrow || page.title }]}
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.lede || undefined}
      />

      {routes.items.length > 0 && (
        <Section className="pt-12 sm:pt-14 lg:pt-16">
          {routes.title && (
            <Reveal>
              <SectionHeader
                eyebrow={routes.eyebrow}
                title={routes.title}
                description={routes.description || undefined}
              />
            </Reveal>
          )}
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {routes.items.map((route) => (
              <RevealItem key={`${route.title}-${route.href}`} className="flex">
                <article className="flex w-full flex-col rounded-2xl border border-hairline bg-card p-6">
                  <h3 className="text-h4 text-foreground">{route.title}</h3>
                  <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {route.body}
                  </p>
                  {route.href && route.linkLabel && (
                    <Link
                      href={route.href}
                      className="group mt-5 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
                    >
                      <span className="link-underline">{route.linkLabel}</span>
                      <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <Section tone="surface">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_minmax(0,1fr)] lg:gap-16">
          <div>
            {form.title && (
              <Reveal>
                <SectionHeader
                  eyebrow={form.eyebrow}
                  title={form.title}
                  description={form.description || undefined}
                />
              </Reveal>
            )}
            <Reveal delay={0.06} className="mt-8">
              <ContactForm />
            </Reveal>
          </div>

          {desks.items.length > 0 && (
            <div>
              {desks.heading && (
                <Reveal>
                  <h2 className="text-eyebrow text-brand-ink">{desks.heading}</h2>
                </Reveal>
              )}
              <div className="mt-6 space-y-5">
                {desks.items.map((desk, index) => (
                  <Reveal key={`${desk.title}-${desk.href}`} delay={0.04 + index * 0.03}>
                    <div className="rounded-2xl border border-hairline bg-card p-5">
                      <h3 className="text-[0.95rem] font-extrabold text-foreground">
                        {desk.title}
                      </h3>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                        {desk.body}
                      </p>
                      {desk.href && desk.linkLabel && (
                        <Link
                          href={desk.href}
                          className="mt-3 inline-flex text-[0.83rem] font-bold text-foreground link-underline"
                        >
                          {desk.linkLabel}
                        </Link>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
