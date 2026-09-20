import type { Metadata } from "next";
import { IndustryCard } from "@/components/site/business";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Industry legal hubs — what changes because of your sector",
  description:
    "Technology, hospitality, media, real estate, financial services, healthcare, retail, construction, education, manufacturing, NGOs and agriculture: the regulatory themes specific to each.",
  alternates: { canonical: "/business/industries" },
};

export default async function IndustriesPage() {
  const hubs = await getContent().getIndustryHubs();

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Industries" },
        ]}
        eyebrow="Industry legal hubs"
        title="Most of business law is general. The part that is not is decided by your sector"
        lede="Every business faces contracts, employment, data and tax. What changes by industry is which permissions you need before you start, which obligations are heightened, and where the risk actually concentrates."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <SectionHeader
            eyebrow="All sectors"
            title={`${hubs.length} industry hubs`}
            description="Each hub sets out why the sector's legal profile differs, the regulatory themes that attach to it, and the compliance topics worth reading first."
          />
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {hubs.map((hub) => (
            <RevealItem key={hub.id} className="flex">
              <IndustryCard hub={hub} />
            </RevealItem>
          ))}
        </RevealGroup>

      </Section>
    </>
  );
}
