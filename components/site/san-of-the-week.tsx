import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Quote } from "lucide-react";
import { cn } from "cn";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";
import { ContentBlock, KnowledgeLayout } from "@/components/site/knowledge";
import { initials } from "@/components/site/leadership";
import { Pill } from "@/components/site/primitives";
import { formatWeekOf, type SanFeature } from "@/lib/content/san-of-the-week";

/**
 * SAN of the Week: the feature page, its archive card and the homepage band.
 * Everything here is one record from the "SAN of the Week" CMS collection.
 */

/** The rank and titles carry no initial: "Chief Ada Obi, SAN" reads AO. */
function sanInitials(name: string): string {
  const bare = name
    .replace(/,?\s*\bSAN\b\.?/g, "")
    .replace(/\b(Chief|Prof|Professor|Dr|Mr|Mrs|Ms|Barr|Hon|Sir|Dame|Lady|Alhaji|Alhaja|Otunba)\.?\s+/gi, "");
  return initials(bare) || "SAN";
}

function Portrait({
  feature,
  sizes,
  className,
}: {
  feature: SanFeature;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-forest",
        className
      )}
    >
      {feature.photo ? (
        <Image
          src={feature.photo}
          alt={`Portrait of ${feature.name}`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div aria-hidden className="flex size-full items-center justify-center">
          <div className="absolute -top-16 -right-14 size-56 rounded-full bg-primary/20 blur-[80px]" />
          <span className="relative font-heading text-6xl font-extrabold tracking-tight text-primary">
            {sanInitials(feature.name)}
          </span>
        </div>
      )}
    </div>
  );
}

function rankLine(feature: SanFeature): string {
  return [
    feature.role,
    feature.yearConferred ? `Senior Advocate since ${feature.yearConferred}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

/** The masthead: name, rank, their quote and the portrait. */
export function SanFeatureHeader({
  feature,
  trail,
  current,
}: {
  feature: SanFeature;
  trail: Crumb[];
  /** Whether this is this week's feature, which changes the eyebrow. */
  current: boolean;
}) {
  const week = formatWeekOf(feature.weekOf);
  return (
    <header className="relative overflow-hidden border-b border-hairline bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/10 blur-[100px]"
      />
      <div className="rail relative grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-16 lg:py-18">
        <div className="min-w-0">
          <Breadcrumbs trail={trail} />
          <p className="text-eyebrow mt-6 flex flex-wrap items-center gap-2 text-brand-ink">
            <span aria-hidden className="inline-block h-px w-6 bg-primary" />
            {current ? "SAN of the Week" : "From the archive"}
            {week && (
              <span className="text-muted-foreground">· {week}</span>
            )}
          </p>
          <h1 className="text-h1 mt-4 max-w-4xl text-foreground">
            {feature.name}
          </h1>
          {rankLine(feature) && (
            <p className="mt-3 text-[0.8rem] font-bold tracking-wide text-brand-ink uppercase">
              {rankLine(feature)}
            </p>
          )}
          {feature.quote && (
            <blockquote className="relative mt-8 max-w-3xl border-l-2 border-primary pl-5 sm:pl-7">
              <Quote
                aria-hidden
                className="absolute -top-1 -left-3 size-6 bg-surface py-0.5 text-primary"
              />
              <p className="font-heading text-[1.35rem] leading-snug font-bold text-foreground sm:text-[1.6rem]">
                {feature.quote}
              </p>
            </blockquote>
          )}
          {feature.watchHref && (
            <Link
              href={feature.watchHref}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-4" />
              Watch the full conversation
            </Link>
          )}
        </div>
        <Portrait
          feature={feature}
          sizes="(min-width: 1024px) 22rem, 90vw"
          className="aspect-4/5 max-w-sm justify-self-start lg:max-w-none"
        />
      </div>
    </header>
  );
}

/** The body: who they are, the conversation, and their word to Nigerians. */
export function SanFeatureBody({ feature }: { feature: SanFeature }) {
  return (
    <KnowledgeLayout aside={<SanAside feature={feature} />}>
      {(feature.intro || feature.bio.length > 0) && (
        <ContentBlock id="who" title="Who they are">
          {feature.intro && (
            <p className="text-body-lg text-foreground">{feature.intro}</p>
          )}
          {feature.bio.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </ContentBlock>
      )}

      {feature.conversation.length > 0 && (
        <ContentBlock
          id="conversation"
          title="The conversation"
          description="What we asked, and what they said."
        >
          <ol className="space-y-8">
            {feature.conversation.map((turn, index) => (
              <li key={`${index}-${turn.question.slice(0, 24)}`}>
                <p className="flex gap-3 text-[1.02rem] leading-snug font-extrabold text-foreground">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/18 text-[0.7rem] text-brand-ink"
                  >
                    Q
                  </span>
                  <span className="min-w-0">{turn.question}</span>
                </p>
                <div className="mt-3 border-l border-hairline pl-9">
                  {turn.answer.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-[0.95rem] leading-relaxed text-muted-foreground not-first:mt-3"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </ContentBlock>
      )}

      {feature.advice.length > 0 && (
        <section
          id="advice"
          className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] rounded-3xl bg-forest p-6 text-forest-foreground sm:p-8"
        >
          <p className="text-eyebrow text-primary">Their word to Nigerians</p>
          {feature.advice.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="mt-4 font-heading text-[1.15rem] leading-relaxed font-semibold"
            >
              {paragraph}
            </p>
          ))}
        </section>
      )}
    </KnowledgeLayout>
  );
}

function SanAside({ feature }: { feature: SanFeature }) {
  return (
    <>
      {feature.practiceAreas.length > 0 && (
        <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-6">
          <p className="text-eyebrow text-muted-foreground">Areas of practice</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {feature.practiceAreas.map((area) => (
              <li key={area}>
                <Pill tone="brand">{area}</Pill>
              </li>
            ))}
          </ul>
        </div>
      )}
      <AboutTheRank />
    </>
  );
}

/** What the rank is, for a reader who has never heard of it. */
export function AboutTheRank({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-5 sm:p-6",
        className
      )}
    >
      <p className="text-eyebrow text-muted-foreground">What is a SAN?</p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        Senior Advocate of Nigeria is the highest rank a lawyer in Nigeria can
        be given. It is awarded each year by the Legal Practitioners&apos;
        Privileges Committee to a small number of lawyers and law teachers for
        distinction in the profession.
      </p>
      <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">
        The views in each feature are the guest&apos;s own. They explain the
        law in general terms and are not legal advice on your situation.
      </p>
    </div>
  );
}

/** One past feature, in the archive grid. */
export function SanFeatureCard({ feature }: { feature: SanFeature }) {
  const week = formatWeekOf(feature.weekOf);
  return (
    <Link
      href={`/san-of-the-week/${feature.slug}`}
      className="group flex w-full min-w-0 flex-col rounded-3xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45 sm:p-5"
    >
      <Portrait
        feature={feature}
        sizes="(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 90vw"
        className="aspect-square rounded-2xl"
      />
      {week && (
        <p className="mt-5 text-[0.72rem] font-bold tracking-wide text-muted-foreground uppercase">
          {week}
        </p>
      )}
      <h3 className="text-h4 mt-1.5 text-foreground">{feature.name}</h3>
      {feature.quote && (
        <p className="mt-3 line-clamp-3 text-[0.88rem] leading-relaxed text-muted-foreground">
          &ldquo;{feature.quote}&rdquo;
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.85rem] font-bold text-foreground">
        <span className="link-underline">Read the conversation</span>
        <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/** This week's SAN on the homepage. */
export function SanHomeBand({ feature }: { feature: SanFeature }) {
  return (
    <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-3xl bg-forest p-5 text-forest-foreground sm:p-8 md:grid-cols-[14rem_minmax(0,1fr)] md:items-center lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12 lg:p-10">
      <Portrait
        feature={feature}
        sizes="(min-width: 1024px) 18rem, (min-width: 768px) 14rem, 90vw"
        className="aspect-square max-w-xs rounded-2xl"
      />
      <div className="min-w-0">
        <p className="text-eyebrow text-primary">
          SAN of the Week
          {formatWeekOf(feature.weekOf) && (
            <span className="opacity-70"> · {formatWeekOf(feature.weekOf)}</span>
          )}
        </p>
        <h2 className="text-h2 mt-3">{feature.name}</h2>
        {rankLine(feature) && (
          <p className="mt-2 text-[0.78rem] font-bold tracking-wide uppercase opacity-75">
            {rankLine(feature)}
          </p>
        )}
        {feature.quote && (
          <p className="mt-6 max-w-2xl border-l-2 border-primary pl-5 font-heading text-[1.2rem] leading-snug font-bold sm:text-[1.4rem]">
            &ldquo;{feature.quote}&rdquo;
          </p>
        )}
        <Link
          href="/san-of-the-week"
          className="group mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Read this week&apos;s conversation
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
