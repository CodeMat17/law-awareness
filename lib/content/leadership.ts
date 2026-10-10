/**
 * The people behind the channel: the management team, the advisory board and
 * the board of directors, shown on /about.
 *
 * All three are one CMS collection ("Leadership & boards") with a `group`
 * select, so an editor adds a person in one place and chooses where they sit.
 * The groups themselves are the organisation's structure and are fixed here.
 */

export const LEADERSHIP_GROUPS = ["board", "management", "advisory"] as const;

export type LeadershipGroup = (typeof LEADERSHIP_GROUPS)[number];

/** In the order /about shows them. */
export const leadershipGroups: {
  id: LeadershipGroup;
  label: string;
  description: string;
}[] = [
  {
    id: "board",
    label: "Board of Directors",
    description: "Responsible for the channel's governance and direction.",
  },
  {
    id: "management",
    label: "Management team",
    description: "The people who run Law Awareness TV day to day.",
  },
  {
    id: "advisory",
    label: "Advisory Board",
    description: "Experienced voices who advise the channel on law, media and public education.",
  },
];

export interface LeadershipMember {
  id: string;
  name: string;
  /** Their title, e.g. Chairman or Executive Producer. */
  role: string;
  group: LeadershipGroup;
  /** Cloudinary delivery URL. Without one the card shows their initials. */
  photo?: string;
  bio: string;
  /** Lower numbers show first within the group. */
  position: number;
}

/**
 * Seed for the "Leadership & boards" collection.
 *
 * Deliberately empty: these are real people, and the content policy forbids
 * inventing profiles. Editors add them in the CMS, and /about shows a group
 * only once it has someone in it.
 */
export const leadershipMembers: LeadershipMember[] = [];
