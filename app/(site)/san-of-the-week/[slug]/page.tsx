import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeader } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  SanFeatureBody,
  SanFeatureCard,
  SanFeatureHeader,
} from "@/components/site/san-of-the-week";
import { getContent } from "@/lib/content/repository";
import { ogImages } from "@/lib/seo";

// A feature published after the last build has a slug that was not in
// `generateStaticParams`; `true` renders it on demand rather than 404ing until
// a redeploy, and a slug that matches nothing still reaches notFound().
export const dynamicParams = true;

// A feature dated for a future week answers 404 until its week starts.
export const revalidate = 3600;

export async function generateStaticParams() {
  const features = await getContent().getSanFeatures();
  return features.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata(
  props: PageProps<"/san-of-the-week/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const feature = await getContent().getSanFeature(slug);
  if (!feature) return { title: "Not found" };

  const title = `${feature.name} — SAN of the Week`;
  const description = feature.intro || feature.quote;
  return {
    title,
    description,
    alternates: { canonical: `/san-of-the-week/${feature.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/san-of-the-week/${feature.slug}`,
      // Declaring openGraph replaces the root block, so the image is restated.
      images: ogImages(feature.photo, feature.name),
    },
  };
}

export default async function SanFeaturePage(
  props: PageProps<"/san-of-the-week/[slug]">
) {
  const { slug } = await props.params;
  const features = await getContent().getSanFeatures();
  const feature = features.find((item) => item.slug === slug);
  if (!feature) notFound();

  const current = features[0]?.slug === feature.slug;
  const others = features.filter((item) => item.slug !== feature.slug).slice(0, 4);

  return (
    <>
      <SanFeatureHeader
        feature={feature}
        current={current}
        trail={[
          { label: "Home", href: "/" },
          { label: "SAN of the Week", href: "/san-of-the-week" },
          { label: feature.name },
        ]}
      />
      <SanFeatureBody feature={feature} />

      {others.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <SectionHeader
              eyebrow="SAN of the Week"
              title="More conversations"
              action={{ label: "All SANs of the Week", href: "/san-of-the-week" }}
            />
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {others.map((item) => (
              <RevealItem key={item.id} className="flex">
                <SanFeatureCard feature={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
}
