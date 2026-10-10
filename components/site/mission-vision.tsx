import { Compass, Target } from "lucide-react";
import { Section } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

/**
 * The channel's mission and vision, worded exactly as the organisation set
 * them. Shown on the homepage directly under the hero and on /about, so the
 * statements are seen before anything else on either page.
 */
const statements = [
  {
    icon: Target,
    label: "Our mission",
    text: "To build a world of law awareness through news, films/movies & entertainment.",
  },
  {
    icon: Compass,
    label: "Our vision",
    text: "A leading Nigeria, Africa & global law television.",
  },
];

export function MissionVision({ className }: { className?: string }) {
  return (
    <Section tone="forest" className={className ?? "py-14 sm:py-16 lg:py-20"}>
      <Reveal>
        <p className="text-eyebrow flex items-center gap-2 text-primary">
          <span aria-hidden className="inline-block h-px w-6 bg-primary" />
          Who we are · Law Awareness TV
        </p>
      </Reveal>
      <RevealGroup className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {statements.map((statement) => (
          <RevealItem key={statement.label} className="flex">
            <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-forest-foreground/12 bg-forest-foreground/[0.04] p-7 sm:p-10">
              <div
                aria-hidden
                className="absolute -top-24 -right-20 size-64 rounded-full bg-primary/15 blur-[90px]"
              />
              <div className="relative flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/18 text-primary">
                  <statement.icon className="size-5" strokeWidth={1.9} />
                </span>
                <h2 className="text-eyebrow text-primary">{statement.label}</h2>
              </div>
              <p className="text-h2 relative mt-6 text-forest-foreground">
                {statement.text}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
