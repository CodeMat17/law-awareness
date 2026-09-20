import type { Metadata } from "next";
import { ContractCard } from "@/components/site/business";
import { FilterGrid, type FilterItem } from "@/components/site/filter-grid";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Contract Knowledge Centre — what your agreements actually do",
  description:
    "Employment, NDA, service, consultancy, partnership, shareholder, supplier, lease, distribution, terms and privacy agreements explained clause by clause. Educational only — never a template.",
  alternates: { canonical: "/business/contracts" },
};

export default async function ContractsPage() {
  const contracts = await getContent().getContractTypes();
  const families = Array.from(
    new Set(contracts.map((contract) => contract.family))
  ).sort();

  const items: FilterItem[] = contracts.map((contract) => ({
    id: contract.id,
    tag: contract.family,
    text: `${contract.name} ${contract.whatItIs} ${contract.family} ${contract.commonlyUsedWhen.join(" ")}`,
    node: <ContractCard contract={contract} />,
  }));

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Contracts" },
        ]}
        eyebrow="Contract Knowledge Centre"
        title="A contract is read when something goes wrong, not when it is signed"
        lede="Each entry explains what an agreement is for, why it matters, when it is commonly used, the clauses that decide how it behaves under stress, the mistakes people make, and when legal review is appropriate."
      />

      {/* Said up front, because it is the whole editorial position here. */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">
              We explain contracts. We do not supply them.
            </p>
            <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">
              There is no model wording anywhere in this section, and there are no
              downloadable templates. A generic document is never universally
              suitable, and a template used without understanding is how businesses
              end up bound to terms nobody chose. What you get here is the
              understanding — so you can read what is in front of you, ask better
              questions, and know when to get it reviewed.
            </p>
          </div>
        </Reveal>

        <div className="mt-14">
          <Reveal>
            <SectionHeader
              eyebrow="All agreements"
              title={`${contracts.length} agreement types explained`}
              description="Filter by family, or search for the agreement you have been sent."
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <FilterGrid
              label="Search contract types"
              placeholder="Search an agreement — NDA, lease, supplier, shareholder…"
              filters={[
                { value: "all", label: "All families" },
                ...families.map((family) => ({ value: family, label: family })),
              ]}
              items={items}
              className="sm:grid-cols-2 xl:grid-cols-3"
              emptyTitle="No agreement matched"
              emptyBody="Try the everyday name for it — contract, NDA, tenancy, terms, policy."
            />
          </Reveal>
        </div>

      </Section>
    </>
  );
}
