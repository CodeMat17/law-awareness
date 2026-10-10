import Image from "next/image";
import { Section, SectionHeader } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import {
  leadershipGroups,
  type LeadershipMember,
} from "@/lib/content/leadership";

/**
 * The Board of Directors, the Management team and the Advisory Board, on
 * /about. Everyone here comes from the "Leadership & boards" collection in the
 * CMS; a group with nobody published in it is left out, and with nobody at all
 * the whole section is.
 */
export function Leadership({ members }: { members: LeadershipMember[] }) {
  const groups = leadershipGroups
    .map((group) => ({
      ...group,
      members: members.filter((member) => member.group === group.id),
    }))
    .filter((group) => group.members.length > 0);

  if (groups.length === 0) return null;

  return (
    <Section id="leadership" tone="surface">
      <Reveal>
        <SectionHeader
          eyebrow="Our people"
          title="The people behind Law Awareness TV"
          description="Who governs the channel, who runs it, and who advises it."
        />
      </Reveal>
      <div className="mt-12 flex flex-col gap-14 sm:mt-14 sm:gap-16">
        {groups.map((group) => (
          <div key={group.id} id={group.id}>
            <Reveal>
              <div className="flex flex-col gap-1.5 border-b border-hairline pb-4">
                <h3 className="text-h3 text-foreground">{group.label}</h3>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              </div>
            </Reveal>
            <RevealGroup className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.members.map((member) => (
                <RevealItem key={member.id} className="flex">
                  <PersonCard member={member} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function initials(name: string): string {
  // Honorifics are skipped so "Barr. Ngozi Okafor" reads NO, not BN.
  const words = name
    .split(/\s+/)
    .filter((word) => word && !word.endsWith("."));
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return picked.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

function PersonCard({ member }: { member: LeadershipMember }) {
  return (
    <article className="flex w-full min-w-0 flex-col rounded-3xl border border-hairline bg-card p-4 sm:p-5">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-forest">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.name}, ${member.role}`}
            fill
            sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex size-full items-center justify-center"
          >
            <div className="absolute -top-16 -right-14 size-48 rounded-full bg-primary/20 blur-[70px]" />
            <span className="relative font-heading text-5xl font-extrabold tracking-tight text-primary">
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>
      <h4 className="text-h4 mt-5 text-foreground">{member.name}</h4>
      {member.role && (
        <p className="mt-1.5 text-[0.78rem] font-bold tracking-wide text-brand-ink uppercase">
          {member.role}
        </p>
      )}
      {member.bio && (
        <p className="mt-3 text-[0.88rem] leading-relaxed whitespace-pre-line text-muted-foreground">
          {member.bio}
        </p>
      )}
    </article>
  );
}
