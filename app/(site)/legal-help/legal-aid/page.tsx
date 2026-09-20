import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, TickList } from "@/components/site/knowledge";
import {
  ReferralDetail,
} from "@/components/site/legal-help";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeader } from "@/components/site/primitives";
import { getContent } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Free and low-cost legal help in Nigeria",
  description:
    "The Legal Aid Council, Nigerian Bar Association branches, state Offices of the Public Defender, the National Human Rights Commission, regulators, law clinics and rights organisations — who each is for, how each works, and what each will not do.",
  alternates: { canonical: "/legal-help/legal-aid" },
};

export default async function LegalAidPage() {
  const routes = await getContent().getReferralRoutes();

  return (
    <>
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Legal Help", href: "/legal-help" },
          { label: "Free and low-cost help" },
        ]}
        eyebrow="Where help comes from"
        title="You do not have to be able to pay a lawyer to get legal help"
        lede="There are institutions in Nigeria whose job is to help people who cannot pay, and there are professional and community routes alongside them. None of them will take every matter — but a person who knows which door to knock on gets much further than one who does not."
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/legal-help/problem"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start from what happened
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/lawyers"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.9rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            Lawyer directory
          </Link>
        </div>
      </PageHeader>

      {/* How to use this ---------------------------------------------------- */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <Reveal>
            <SectionHeader
              eyebrow="Before you go anywhere"
              title="Four things that decide how far you get"
              description="These matter more than which office you choose. An enquiry that arrives complete is handled; one that arrives partial goes to the back of a queue."
            />
            <div className="mt-8">
              <TickList
                items={[
                  "Write out what happened in date order before you go — one page is enough, and it will be asked for.",
                  "Take every document, including envelopes, receipts and messages, and take copies rather than originals where you can.",
                  "Know which deadline is running. A court date or a response deadline changes which route is realistic.",
                  "Ask, at the first meeting, exactly what the office is offering: advice, mediation, or representation. They are different things.",
                ]}
                tone="positive"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
              <p className="text-eyebrow text-muted-foreground">
                Why there are no addresses on this page
              </p>
              <p className="mt-4 text-[0.88rem] leading-relaxed text-muted-foreground">
                Offices move, telephone numbers change, and intake processes are
                revised. A contact detail that is out of date sends someone on a
                journey they cannot afford to waste, so each entry below says
                where to confirm the current details instead of asserting them.
              </p>
              <p className="mt-4 text-[0.88rem] leading-relaxed text-muted-foreground">
                We also state no fee, no eligibility threshold and no processing
                time for any of these institutions. Those are theirs to set and
                theirs to publish.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* The routes --------------------------------------------------------- */}
      <Section tone="surface">
        <Reveal>
          <SectionHeader
            eyebrow="The routes"
            title={`${routes.length} places a legal problem can actually go`}
            description="Read the limits as carefully as the description. Knowing what a route does not do is what stops weeks being lost to the wrong door."
          />
        </Reveal>
        <div className="mt-10 space-y-5">
          {routes.map((route, index) => (
            <Reveal key={route.id} delay={Math.min(index * 0.04, 0.2)}>
              <ReferralDetail route={route} />
            </Reveal>
          ))}
        </div>

      </Section>
    </>
  );
}
