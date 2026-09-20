import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LawEntryCard } from "@/components/site/cards";
import { EmptyState, PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

/**
 * Every published record is prerendered, so an unknown slug is a routing-level
 * 404 with a real 404 status - rather than a page that streams a 200 and then
 * renders not-found UI. Revisit when content comes from Convex at request time.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getContent().getLawCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/know-the-law/[category]">
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = await getContent().getLawCategory(slug);
  if (!category) return { title: "Subject area not found" };

  return {
    title: `${category.name} — Know the Law`,
    description: category.blurb,
    alternates: { canonical: `/know-the-law/${category.slug}` },
  };
}

export default async function LawCategoryPage(
  props: PageProps<"/know-the-law/[category]">
) {
  const { category: slug } = await props.params;
  const content = getContent();
  const category = await content.getLawCategory(slug);
  if (!category) notFound();

  const [entries, categories] = await Promise.all([
    content.getLawEntries(category.slug),
    content.getLawCategories(),
  ]);

  const siblings = categories
    .filter((item) => item.slug !== category.slug && item.entryCount > 0)
    .slice(0, 6);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Know the Law", href: "/know-the-law" },
          { label: category.name },
        ]}
        eyebrow="Know the Law"
        title={category.name}
        lede={category.blurb}
        meta={
          <p className="text-[0.8rem] font-semibold text-muted-foreground">
            {entries.length === 0
              ? "No explainers published in this area yet"
              : `${entries.length} published ${
                  entries.length === 1 ? "explainer" : "explainers"
                }`}
          </p>
        }
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <h2 className="sr-only">{category.name} explainers</h2>
        {entries.length > 0 ? (
          <RevealGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <RevealItem key={entry.id} className="flex">
                <LawEntryCard entry={entry} categoryName={category.name} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <Reveal>
            <EmptyState
              title="Explainers for this area are in preparation"
              body="We publish an area only once it can be written against real, named instruments and described accurately. In the meantime, the areas already published cover a great deal of the same ground."
              action={{ label: "Browse published areas", href: "/know-the-law" }}
            />
          </Reveal>
        )}

      </Section>

      {siblings.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <SectionHeader
              eyebrow="Keep going"
              title="Other areas with published explainers"
              action={{ label: "Full library", href: "/know-the-law" }}
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <div className="flex flex-wrap gap-2.5">
              {siblings.map((item) => (
                <Link
                  key={item.slug}
                  href={`/know-the-law/${item.slug}`}
                  className="rounded-full border border-hairline bg-card px-4 py-2.5 text-[0.85rem] font-bold text-foreground transition-colors hover:border-primary/45"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </Section>
      )}
    </>
  );
}
