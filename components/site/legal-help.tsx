import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CircleAlert,
  Clock,
  Info,
  MapPin,
  MessageSquare,
  ShieldQuestion,
} from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { IconBadge, Pill, ReviewBadge } from "./primitives";
import { TickList } from "./knowledge";
import type {
  LawyerListing,
  LegalProblem,
  ListingAvailability,
  ListingStatus,
  ProblemUrgency,
  PublicQuestion,
  ReferralRoute,
} from "@/lib/content/types";

const cardBase =
  "group relative flex flex-col rounded-2xl border border-hairline bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-foreground/5";

/* -------------------------------------------------------------------------- */
/* Urgency                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * How quickly the *situation* usually moves.
 *
 * This describes the situation, never the reader's legal position. The labels
 * are deliberately about time rather than seriousness, because the platform
 * does not rank one person's problem against another's.
 */
const urgencyCopy: Record<
  ProblemUrgency,
  { label: string; className: string }
> = {
  immediate: {
    label: "Usually moves fast",
    className: "bg-chart-4/18 text-foreground",
  },
  "time-sensitive": {
    label: "Time matters",
    className: "bg-chart-1/15 text-foreground",
  },
  considered: {
    label: "Take it in order",
    className: "bg-muted text-muted-foreground",
  },
};

export function UrgencyPill({
  urgency,
  className,
}: {
  urgency: ProblemUrgency;
  className?: string;
}) {
  const copy = urgencyCopy[urgency];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold tracking-wide uppercase",
        copy.className,
        className
      )}
    >
      <Clock className="size-3" aria-hidden />
      {copy.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Problem pathways                                                            */
/* -------------------------------------------------------------------------- */

export function ProblemCard({ problem }: { problem: LegalProblem }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <IconBadge name={problem.icon} />
        <UrgencyPill urgency={problem.urgency} />
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/legal-help/problem/${problem.slug}`}
          className="after:absolute after:inset-0"
        >
          {problem.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.8rem] font-semibold text-brand-ink">
        {problem.situation}
      </p>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {problem.summary}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[0.75rem] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ArrowRight className="size-3.5 text-brand-ink" />
          {problem.steps.length} steps
        </span>
        <span>{problem.referralRoutes.length} routes to help</span>
      </div>
    </article>
  );
}

/**
 * The pathway the spec sets out, rendered as a visible spine.
 *
 * It appears at the top of every pathway page so a reader can see where the
 * page is taking them before they start reading it.
 */
export function PathwaySpine({
  steps,
  activeIndex = 0,
}: {
  steps: string[];
  activeIndex?: number;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={cn(
              "text-[0.72rem] font-bold",
              index === activeIndex ? "text-brand-ink" : "text-muted-foreground"
            )}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <ArrowRight
              aria-hidden
              className="size-3 shrink-0 text-muted-foreground/50"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Referral architecture                                                       */
/* -------------------------------------------------------------------------- */

const referralKindLabel: Record<ReferralRoute["kind"], string> = {
  "legal-aid": "Legal aid",
  "professional-body": "Professional body",
  "public-institution": "Public institution",
  "civil-society": "Civil society",
  "law-clinic": "Law clinic",
};

/** Compact route card, used on hubs and at the end of a pathway. */
export function ReferralCard({ route }: { route: ReferralRoute }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <IconBadge name={route.icon} />
        <Pill tone="outline">{referralKindLabel[route.kind]}</Pill>
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/legal-help/legal-aid#${route.slug}`}
          className="after:absolute after:inset-0"
        >
          {route.name}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-4 text-[0.88rem] leading-relaxed text-muted-foreground">
        {route.whatItIs}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-6 text-[0.75rem] font-semibold text-muted-foreground">
        <ArrowUpRight className="size-3.5 text-brand-ink" />
        How it works, what to bring, and its limits
      </div>
    </article>
  );
}

/**
 * A route in full.
 *
 * `howToFind` is rendered as its own labelled block rather than as a contact
 * detail, because the platform publishes no address or telephone number it
 * cannot keep current — a wrong one sends a person on a wasted journey.
 */
export function ReferralDetail({ route }: { route: ReferralRoute }) {
  return (
    <article
      id={route.slug}
      className="scroll-mt-[calc(var(--chrome-h)+1.5rem)] rounded-2xl border border-hairline bg-card p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge name={route.icon} />
          <div>
            <p className="text-eyebrow text-muted-foreground">
              {referralKindLabel[route.kind]}
            </p>
            <h3 className="text-h4 mt-1 text-foreground">{route.name}</h3>
          </div>
        </div>
        <ReviewBadge meta={route.meta} />
      </div>

      <p className="mt-5 text-[0.93rem] leading-relaxed text-muted-foreground">
        {route.whatItIs}
      </p>

      <div className="mt-7 grid gap-7 sm:grid-cols-2">
        <div>
          <p className="text-caption text-foreground">Who it is for</p>
          <div className="mt-3">
            <TickList items={route.whoItIsFor} />
          </div>
        </div>
        <div>
          <p className="text-caption text-foreground">How it typically works</p>
          <div className="mt-3">
            <TickList items={route.howItTypicallyWorks} />
          </div>
        </div>
        <div>
          <p className="text-caption text-foreground">What to take with you</p>
          <div className="mt-3">
            <TickList items={route.whatToBring} tone="positive" />
          </div>
        </div>
        <div>
          <p className="text-caption text-foreground">What it does not do</p>
          <div className="mt-3">
            <TickList items={route.limits} tone="negative" />
          </div>
        </div>
      </div>

      <div className="mt-7 flex gap-3.5 rounded-xl border border-primary/25 bg-primary/8 p-4 sm:p-5">
        <MapPin className="mt-0.5 size-4 shrink-0 text-brand-ink" />
        <div>
          <p className="text-caption text-brand-ink">How to find it</p>
          <p className="mt-1 text-[0.85rem] leading-relaxed text-muted-foreground">
            {route.howToFind}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * The "find legal help" step at the end of a pathway.
 *
 * The routes come first and the directory second, deliberately: for most people
 * reading a pathway, an institution that has to take the enquiry is a more
 * realistic next step than finding and paying a practitioner.
 */
export function FindHelpPanel({ routes }: { routes: ReferralRoute[] }) {
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
      <p className="text-eyebrow text-brand-ink">Where to get actual help</p>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
        These are the routes that most often apply to this situation. Each one
        has its own criteria and its own limits, and none of them is guaranteed
        to take your matter.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {routes.map((route) => (
          <li key={route.id}>
            <Link
              href={`/legal-help/legal-aid#${route.slug}`}
              className="group flex h-full gap-3 rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-brand-ink">
                <Icon name={route.icon} className="size-4" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.9rem] leading-snug font-extrabold text-foreground">
                  {route.name}
                </span>
                <span className="text-eyebrow mt-1 block text-muted-foreground">
                  {referralKindLabel[route.kind]}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link
          href="/legal-help/legal-aid"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Free and low-cost legal help
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/lawyers"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
        >
          Open the directory
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lawyer directory                                                            */
/* -------------------------------------------------------------------------- */

const listingStatusCopy: Record<
  ListingStatus,
  { label: string; className: string }
> = {
  sample: {
    label: "Sample listing",
    className: "bg-muted text-muted-foreground",
  },
  "pending-verification": {
    label: "Pending verification",
    className: "bg-chart-1/15 text-foreground",
  },
  verified: { label: "Verified", className: "bg-primary/18 text-brand-ink" },
};

const availabilityCopy: Record<
  ListingAvailability,
  { label: string; dot: string }
> = {
  accepting: { label: "Accepting enquiries", dot: "bg-chart-2" },
  waitlist: { label: "Waiting list", dot: "bg-chart-1" },
  "not-accepting": { label: "Not accepting", dot: "bg-muted-foreground" },
};

/**
 * Whether a listing has been through the verification process.
 *
 * Rendered on every card and on every profile, never only once on the page.
 * A reader who arrives at a profile from search has not seen the hub's notice.
 */
export function ListingStatusBadge({
  status,
  className,
}: {
  status: ListingStatus;
  className?: string;
}) {
  const copy = listingStatusCopy[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold tracking-wide uppercase",
        copy.className,
        className
      )}
    >
      {status === "verified" && <BadgeCheck className="size-3" aria-hidden />}
      {copy.label}
    </span>
  );
}

export function AvailabilityLabel({
  availability,
}: {
  availability: ListingAvailability;
}) {
  const copy = availabilityCopy[availability];
  return (
    <span className="flex items-center gap-2 text-[0.78rem] font-semibold text-muted-foreground">
      <span
        aria-hidden
        className={cn("inline-block size-2 rounded-full", copy.dot)}
      />
      {copy.label}
    </span>
  );
}

export function ListingCard({ listing }: { listing: LawyerListing }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Pill tone="outline">
          {listing.city}, {listing.state}
        </Pill>
        <ListingStatusBadge status={listing.listingStatus} />
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/lawyers/${listing.slug}`}
          className="after:absolute after:inset-0"
        >
          {listing.displayName}
        </Link>
      </h3>
      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {listing.focus}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {listing.practiceAreas.map((area) => (
          <span
            key={area}
            className="rounded-full border border-hairline px-2.5 py-1 text-[0.7rem] font-bold text-muted-foreground"
          >
            {area}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[0.75rem] font-semibold text-muted-foreground">
        <AvailabilityLabel availability={listing.availability} />
        <span>{listing.languages.join(" · ")}</span>
      </div>
    </article>
  );
}

/**
 * Why the directory carries no practitioners yet.
 *
 * Spec section 36 requires verification to be backed by an actual
 * administrative process; spec rule 23 forbids inventing credentials. Saying so
 * plainly is the only honest way to ship the directory before that process
 * exists — and it is more useful to a reader than a page of invented names.
 */
export function VerificationPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-5 sm:p-7",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <ShieldQuestion className="size-5 shrink-0 text-brand-ink" />
        <p className="text-caption text-foreground">
          How verification will work
        </p>
      </div>
      <p className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
        No listing here is a real practitioner. We will not publish a person, a
        photograph or a credential until an administrative process has actually
        confirmed it — and until that process runs, the honest thing is to say
        so rather than to fill the page.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-eyebrow text-muted-foreground">
            What a verified listing will require
          </p>
          <div className="mt-3">
            <TickList
              items={[
                "Confirmation of enrolment and current standing as a legal practitioner",
                "Confirmation of the practice location and how enquiries reach it",
                "A named person accountable for what the listing says",
                "Re-confirmation on a defined cycle, not once at sign-up",
              ]}
            />
          </div>
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground">
            What the directory will never do
          </p>
          <div className="mt-3">
            <TickList
              items={[
                "Rank practitioners, or suggest one is better than another",
                "Predict what any practitioner will achieve for you",
                "Publish a credential we have not confirmed ourselves",
                "Charge a practitioner for a verified badge",
              ]}
              tone="negative"
            />
          </div>
        </div>
      </div>
      <p className="mt-6 text-[0.83rem] leading-relaxed text-muted-foreground">
        In the meantime, verify anyone you engage through the Nigerian Bar
        Association rather than through any listing — including ours.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ask a Question                                                              */
/* -------------------------------------------------------------------------- */

export function QuestionCard({ question }: { question: PublicQuestion }) {
  return (
    <article className={cn(cardBase, "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Pill tone="brand">{question.topic}</Pill>
        <ReviewBadge meta={question.meta} />
      </div>
      <h3 className="text-h4 mt-5 text-foreground">
        <Link
          href={`/ask/${question.slug}`}
          className="after:absolute after:inset-0"
        >
          {question.question}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-[0.88rem] leading-relaxed text-muted-foreground">
        {question.generalAnswer[0]}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-[0.75rem] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MessageSquare className="size-3.5 text-brand-ink" />
          {question.askedBy}
        </span>
        <span>Answered {question.askedOn}</span>
      </div>
    </article>
  );
}

/**
 * The moderation flow, rendered rather than described.
 *
 * Spec section 37 requires that questions do not become public automatically.
 * Showing the stages makes the guarantee legible to the person about to submit
 * one, which is the point at which it matters to them.
 */
const moderationStages = [
  {
    title: "You submit",
    body: "Written in your own words. Do not include names, addresses, case numbers or anything that identifies you or anyone else.",
  },
  {
    title: "We moderate",
    body: "Every question is read before anything happens to it. Questions that identify people, seek advice on a live case, or cannot be answered as general information are not published.",
  },
  {
    title: "We answer generally",
    body: "The answer is general legal information written by the editorial desk: what the law provides, in general terms, with the instruments named.",
  },
  {
    title: "We point at the law",
    body: "Every answer links to the relevant explainer, rights guide or pathway, so the answer is a doorway rather than the end of it.",
  },
  {
    title: "A practitioner may add to it",
    body: "Where a named legal practitioner responds, their contribution is attributed to them. Nothing is published under a practitioner's name that they did not write.",
  },
];

export function ModerationFlow() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {moderationStages.map((stage, index) => (
        <li
          key={stage.title}
          className="flex flex-col rounded-2xl border border-hairline bg-card p-5"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/12 text-[0.8rem] font-extrabold text-brand-ink">
            {index + 1}
          </span>
          <p className="mt-4 text-[0.93rem] font-extrabold text-foreground">
            {stage.title}
          </p>
          <p className="mt-2 text-[0.83rem] leading-relaxed text-muted-foreground">
            {stage.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * The privacy rules that govern a submitted question, stated where the person
 * is about to submit one rather than buried in a policy page.
 */
export function PrivacyNotice() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <Info className="size-4 shrink-0 text-brand-ink" />
        <p className="text-caption text-foreground">
          What happens to what you write
        </p>
      </div>
      <div className="mt-4">
        <TickList
          items={[
            "Nothing is published automatically — a person reads every question first",
            "Published questions carry a pseudonymous attribution and a state, never a name",
            "We remove anything that identifies you, another person, or a specific matter",
            "If a question cannot be answered as general information, it is not published",
          ]}
        />
      </div>
      <div className="mt-5 border-t border-hairline pt-4">
        <p className="text-[0.83rem] leading-relaxed text-muted-foreground">
          <span className="font-extrabold text-foreground">
            Do not send us details of a live case.
          </span>{" "}
          A public question is not a confidential channel and no lawyer-client
          relationship is created by asking one. If your matter is before a
          court or the police, speak to a practitioner directly.
        </p>
      </div>
    </div>
  );
}

/** Shown where a route or listing needs a caution beside it, not under it. */
export function InlineCaution({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted-foreground">
      <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-brand-ink" />
      <span>{children}</span>
    </p>
  );
}
