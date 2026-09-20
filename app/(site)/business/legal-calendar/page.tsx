import type { Metadata } from "next";
import { CalendarCard } from "@/components/site/business";
import { PageHeader } from "@/components/site/knowledge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  Section,
  SectionHeader,
} from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Business legal calendar — the compliance rhythm of a business year",
  description:
    "The recurring compliance obligations of a Nigerian business, described by cadence and trigger. Confirm actual dates with the relevant authority — we do not publish deadlines we cannot maintain.",
  alternates: { canonical: "/business/legal-calendar" },
};

const cadenceOrder = [
  "monthly",
  "quarterly",
  "annual",
  "event-driven",
  "ongoing",
] as const;

const cadenceHeading: Record<(typeof cadenceOrder)[number], string> = {
  monthly: "Every pay run",
  quarterly: "Quarterly",
  annual: "Annually",
  "event-driven": "When the event happens",
  ongoing: "Continuous",
};

export default async function LegalCalendarPage() {
  const content = getContent();
  const [entries, areas] = await Promise.all([
    content.getCalendarEntries(),
    content.getComplianceAreas(),
  ]);

  const areaName = (areaId: string) =>
    areas.find((area) => area.id === areaId)?.name ?? "Compliance";

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Business", href: "/business" },
          { label: "Legal calendar" },
        ]}
        eyebrow="Business legal calendar"
        title="A compliance rhythm, not a list of dates"
        lede="Most compliance failures are timing failures: an obligation that had no owner and no cadence. This calendar names what recurs, what starts the clock and what to have ready — so you can build it into your own year."
      />

      {/* The reason there are no dates. Stated first, not buried. */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Reveal>
          <div className="rounded-2xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
            <p className="text-eyebrow text-brand-ink">Why there are no dates here</p>
            <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">
              Filing dates, thresholds and fees change, and they differ by entity,
              activity and location. Publishing them without a maintained source
              and a review process would be worse than publishing nothing — a
              date that is wrong is more dangerous than a date you knew you had
              to check. So each entry names its <strong className="font-extrabold text-foreground">cadence</strong> and
              the <strong className="font-extrabold text-foreground">event that starts the clock</strong>, and you
              confirm the actual date with the relevant authority.
            </p>
          </div>
        </Reveal>

        {cadenceOrder.map((cadence, index) => {
          const group = entries.filter((entry) => entry.cadence === cadence);
          if (group.length === 0) return null;

          return (
            <div key={cadence} className={index === 0 ? "mt-14" : "mt-16"}>
              <Reveal>
                <SectionHeader
                  eyebrow={cadenceHeading[cadence]}
                  title={`${group.length} recurring ${group.length === 1 ? "obligation" : "obligations"}`}
                />
              </Reveal>
              <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {group.map((entry) => (
                  <RevealItem key={entry.id} className="flex">
                    <CalendarCard entry={entry} areaName={areaName(entry.areaId)} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          );
        })}

      </Section>
    </>
  );
}
