"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Loader2, Plus, Users } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { cn } from "cn";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Pill } from "@/components/site/primitives";
import { Icon } from "@/lib/icons";
import type { AlertTopic } from "@/lib/content/types";

/**
 * Organization accounts (spec section 43).
 *
 * Nothing in this component reads organization data without a membership: the
 * Convex queries behind it return empty to a non-member, so a wrong id in the
 * URL reveals nothing rather than erroring in a way that confirms the
 * organization exists.
 *
 * `plan` describes capability. Nothing here takes a payment — spec section 44
 * says not to implement payments unless explicitly required.
 */

const industries = [
  "Professional services",
  "Technology",
  "Financial services",
  "Retail and commerce",
  "Manufacturing",
  "Construction and real estate",
  "Health",
  "Education",
  "Media and creative",
  "Logistics and transport",
  "Agriculture",
  "Energy",
  "Non-profit",
  "Other",
];

const sizes = [
  "Just the founders",
  "2–10 people",
  "11–50 people",
  "51–200 people",
  "Over 200 people",
];

const plans = [
  {
    value: "free" as const,
    name: "Free",
    body: "Public legal information, the law library, articles, videos, podcasts and the basic guides.",
  },
  {
    value: "business" as const,
    name: "Business",
    body: "Regulatory alerts, compliance resources, checklists, saved resources, the compliance calendar and business legal education.",
  },
  {
    value: "enterprise" as const,
    name: "Enterprise",
    body: "An organization dashboard, multiple users, topic monitoring, advanced alerts and organization learning resources.",
  },
];

export function OrganizationPanel({ topics }: { topics: AlertTopic[] }) {
  const orgs = useQuery(api.organizations.listMine);
  const [selected, setSelected] = useState<Id<"organizations"> | null>(null);

  if (orgs === undefined) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-card p-8 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-[0.9rem] font-semibold">
          Loading your organizations…
        </span>
      </div>
    );
  }

  if (orgs.length === 0) return <CreateOrganization />;

  const active = orgs.find((org) => org.id === selected) ?? orgs[0];

  return (
    <div className="space-y-8">
      {orgs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {orgs.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => setSelected(org.id)}
              aria-pressed={org.id === active.id}
              className={cn(
                "inline-flex h-10 items-center rounded-xl border px-4 text-[0.85rem] font-extrabold transition-colors",
                org.id === active.id
                  ? "border-primary/45 bg-primary/10 text-brand-ink"
                  : "border-hairline bg-card text-muted-foreground hover:border-primary/45"
              )}
            >
              {org.name}
            </button>
          ))}
        </div>
      )}

      <OrganizationDetail org={active} topics={topics} />
    </div>
  );
}

function CreateOrganization() {
  const create = useMutation(api.organizations.create);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState(industries[0]);
  const [size, setSize] = useState(sizes[1]);
  const [plan, setPlan] = useState<"free" | "business" | "enterprise">(
    "business"
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
        <Building2 className="size-[1.15rem]" strokeWidth={1.9} />
      </span>
      <h2 className="text-h3 mt-5 text-foreground">
        Set up an organization account
      </h2>
      <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
        An organization account gives a team one shared library, one set of
        followed topics, and a place to see the compliance areas that apply to
        the work it actually does. Nothing you record here is published.
      </p>

      <form
        className="mt-7 max-w-2xl space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setPending(true);
          try {
            await create({ name, industry, size, plan });
          } catch (cause) {
            setError(
              cause instanceof Error ? cause.message : "Could not create it"
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <Field label="Organization name">
          <input
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="The name your team would recognise"
            className="h-12 w-full rounded-xl border border-hairline bg-surface px-4 text-[0.92rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Industry">
            <select
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="h-12 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.9rem] font-semibold text-foreground outline-none transition-colors focus-visible:border-primary/60"
            >
              {industries.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="h-12 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.9rem] font-semibold text-foreground outline-none transition-colors focus-visible:border-primary/60"
            >
              {sizes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset>
          <legend className="text-eyebrow text-muted-foreground">Plan</legend>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted-foreground">
            This records which set of capabilities the organization is set up
            for. No payment is taken anywhere on this platform.
          </p>
          <div className="mt-3 grid gap-3">
            {plans.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-colors",
                  plan === option.value
                    ? "border-primary/45 bg-primary/8"
                    : "border-hairline bg-surface hover:border-primary/40"
                )}
              >
                <input
                  type="radio"
                  name="plan"
                  value={option.value}
                  checked={plan === option.value}
                  onChange={() => setPlan(option.value)}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
                />
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-extrabold text-foreground">
                    {option.name}
                  </span>
                  <span className="mt-0.5 block text-[0.83rem] leading-relaxed text-muted-foreground">
                    {option.body}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-[0.85rem] font-semibold text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Create the organization
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-eyebrow block text-muted-foreground">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

interface OrgSummary {
  id: Id<"organizations">;
  name: string;
  slug: string;
  industry: string;
  size: string;
  plan: "free" | "business" | "enterprise";
  role: "owner" | "admin" | "member";
  createdAt: number;
}

function OrganizationDetail({
  org,
  topics,
}: {
  org: OrgSummary;
  topics: AlertTopic[];
}) {
  const members = useQuery(api.organizations.listMembers, { orgId: org.id });
  const shared = useQuery(api.library.listOrgBookmarks, { orgId: org.id });
  const orgTopics = useQuery(api.library.listOrgTopics, { orgId: org.id });
  const toggleFollow = useMutation(api.library.toggleTopicFollow);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);

  const canAdminister = org.role === "owner" || org.role === "admin";

  return (
    <div className="space-y-8">
      {/* Profile ------------------------------------------------------------ */}
      <section className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="brand">{plans.find((p) => p.value === org.plan)?.name}</Pill>
              <Pill tone="outline">Your role: {org.role}</Pill>
            </div>
            <h2 className="text-h3 mt-3 text-foreground">{org.name}</h2>
            <p className="mt-2 text-[0.9rem] text-muted-foreground">
              {org.industry} · {org.size}
            </p>
          </div>
          <Link
            href="/business/health-check"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Run the legal health check
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <p className="mt-5 rounded-xl border border-hairline bg-surface p-4 text-[0.85rem] leading-relaxed text-muted-foreground">
          Nothing recorded on this page is published or shown to anyone outside
          the organization.
        </p>
      </section>

      {/* Team --------------------------------------------------------------- */}
      <section className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
            <Users className="size-[1.15rem]" strokeWidth={1.9} />
          </span>
          <h2 className="text-h4 text-foreground">Team members</h2>
        </div>

        {members === undefined ? (
          <p className="mt-4 text-[0.88rem] text-muted-foreground">Loading…</p>
        ) : (
          <ul className="mt-5 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4"
              >
                <div className="min-w-0">
                  <p className="text-[0.92rem] font-extrabold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-[0.82rem] text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <Pill tone={member.role === "owner" ? "brand" : "outline"}>
                  {member.role}
                </Pill>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-[0.84rem] leading-relaxed text-muted-foreground">
          {canAdminister
            ? "Membership is recorded against a person's account once they have signed in, so a member is always a real account rather than an address that may never be claimed. Invitations by email are not implemented."
            : "Only an owner or an admin can change who is in the team."}
        </p>
      </section>

      {/* Followed topics ---------------------------------------------------- */}
      <section className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
        <h2 className="text-h4 text-foreground">Topics this organization monitors</h2>
        <p className="mt-2 max-w-3xl text-[0.88rem] leading-relaxed text-muted-foreground">
          Topic monitoring for the team. Following here records the topic
          against the organization as well as against you, so a shared watch
          list survives one person leaving.
        </p>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => {
            const following = orgTopics?.includes(topic.slug) ?? false;
            const busy = pendingTopic === topic.slug;
            return (
              <li key={topic.slug}>
                <button
                  type="button"
                  disabled={busy || !canAdminister}
                  aria-pressed={following}
                  onClick={async () => {
                    setPendingTopic(topic.slug);
                    try {
                      await toggleFollow({ topic: topic.slug, orgId: org.id });
                    } finally {
                      setPendingTopic(null);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    following
                      ? "border-primary/45 bg-primary/8"
                      : "border-hairline bg-surface",
                    canAdminister
                      ? "hover:border-primary/45"
                      : "cursor-not-allowed opacity-70"
                  )}
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-brand-ink">
                    {busy ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Icon
                        name={topic.icon}
                        className="size-3.5"
                        strokeWidth={1.9}
                      />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.88rem] font-extrabold text-foreground">
                      {topic.label}
                    </span>
                    <span className="text-eyebrow mt-0.5 block text-muted-foreground">
                      {following ? "Monitored" : "Not monitored"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Shared resources --------------------------------------------------- */}
      <section className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
        <h2 className="text-h4 text-foreground">Shared resources</h2>
        <p className="mt-2 max-w-3xl text-[0.88rem] leading-relaxed text-muted-foreground">
          What members have saved to the organization rather than to
          themselves.
        </p>

        {shared === undefined ? (
          <p className="mt-4 text-[0.88rem] text-muted-foreground">Loading…</p>
        ) : shared.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-hairline bg-surface p-6 text-center">
            <p className="text-[0.92rem] font-extrabold text-foreground">
              Nothing shared yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-[0.85rem] leading-relaxed text-muted-foreground">
              Saved items are private by default. Anything saved to the
              organization appears here for every member.
            </p>
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {shared.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-hairline bg-surface p-4"
              >
                <p className="text-eyebrow text-muted-foreground">
                  {item.group}
                </p>
                <p className="mt-1.5 text-[0.92rem] leading-snug font-extrabold text-foreground">
                  <Link href={item.href} className="link-underline">
                    {item.title}
                  </Link>
                </p>
                <p className="mt-1 line-clamp-2 text-[0.83rem] leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
