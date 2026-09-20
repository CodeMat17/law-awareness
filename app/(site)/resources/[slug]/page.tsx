import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ChecklistView } from "@/components/site/checklist-view";
import { CredibilityRow, PageHeader } from "@/components/site/knowledge";
import { Section } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";
import { getContent } from "@/lib/content/repository";

/** Published checklists are prerendered, so an unknown slug is a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const checklists = await getContent().getChecklists();
  return checklists.map((checklist) => ({ slug: checklist.slug }));
}

export async function generateMetadata(
  props: PageProps<"/resources/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const checklist = await getContent().getChecklist(slug);
  if (!checklist) return { title: "Checklist not found" };

  return {
    title: `${checklist.title} — checklist`,
    description: checklist.description,
    alternates: { canonical: `/resources/${checklist.slug}` },
  };
}

export default async function ChecklistPage(
  props: PageProps<"/resources/[slug]">
) {
  const { slug } = await props.params;
  const content = getContent();
  const checklist = await content.getChecklist(slug);
  if (!checklist) notFound();

  const items = await content.getChecklistItems(slug);

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Resource centre", href: "/resources" },
          { label: checklist.title },
        ]}
        eyebrow="Checklist"
        title={checklist.title}
        lede={checklist.description}
        meta={<CredibilityRow meta={checklist.meta} kind="Checklist" />}
      >
        <p className="mt-6 text-[0.85rem] font-semibold text-muted-foreground">
          {items.length} things to establish, in order
        </p>
      </PageHeader>

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <div className="max-w-3xl">
          {items.length > 0 ? (
            <Reveal>
              <ChecklistView slug={checklist.slug} items={items} />
            </Reveal>
          ) : (
            <Reveal>
              <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
                <p className="text-eyebrow text-brand-ink">In preparation</p>
                <h2 className="text-h3 mt-3 text-foreground">
                  This checklist is still being written
                </h2>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                  A half-finished checklist is worse than none, because it looks
                  complete.
                </p>
                <Link
                  href="/resources"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Other resources
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          )}

        </div>
      </Section>
    </>
  );
}
