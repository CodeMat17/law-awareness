/**
 * Programme categories — the channel's line-up.
 *
 * Law Awareness TV is organised the way a viewer channel-surfs: by the kind of
 * programme, not by the statute behind it. Every video, podcast episode, live
 * session and series carries one of these slugs in its `programme` field, and
 * /programmes/<slug> gathers everything filed under it.
 *
 * The list is fixed in code on purpose. It is the station's structure, linked
 * from the menu and the homepage, so an editor chooses from it in the CMS
 * rather than typing a new one - a misspelt category would be a page nobody
 * can reach.
 */

export const PROGRAMME_SLUGS = [
  "courtroom-and-judicial-news",
  "law-making",
  "law-enforcement",
  "corporate-law-and-regulation",
  "rights-and-justice",
  "everyday-law",
  "crime-and-safety",
] as const;

export type ProgrammeSlug = (typeof PROGRAMME_SLUGS)[number];

export interface ProgrammeCategory {
  slug: ProgrammeSlug;
  name: string;
  /** One line for cards and menus. */
  blurb: string;
  /** A short paragraph for the programme's own page. */
  description: string;
  /** Lucide icon name, resolved through `lib/icons.ts`. */
  icon: string;
  /** Where on the site a viewer can read more about the subject. */
  readMore: { label: string; href: string };
}

export const programmeCategories: ProgrammeCategory[] = [
  {
    slug: "courtroom-and-judicial-news",
    name: "Courtroom & Judicial News",
    blurb: "What happened in court, and what it means for you",
    description:
      "Reports from Nigeria's courts: important cases, court decisions and how the justice system is being run — told in everyday words, without the legal jargon.",
    icon: "gavel",
    readMore: { label: "Court decisions explained", href: "/cases" },
  },
  {
    slug: "law-making",
    name: "Law-Making",
    blurb: "New laws and changes, from the National Assembly to your state",
    description:
      "How a law is made, what lawmakers are debating, and what new or changed laws will mean for ordinary Nigerians once they are passed.",
    icon: "landmark",
    readMore: { label: "How the laws have changed", href: "/know-the-law/amendments" },
  },
  {
    slug: "law-enforcement",
    name: "Law Enforcement",
    blurb: "Police, agencies and your rights when you meet them",
    description:
      "What the police and other enforcement agencies can and cannot do, how to stay safe during a stop or an arrest, and how officers are held to account.",
    icon: "siren",
    readMore: { label: "If the police stop you", href: "/your-rights/police-stop" },
  },
  {
    slug: "corporate-law-and-regulation",
    name: "Corporate Law & Regulation",
    blurb: "The rules for running a business in Nigeria",
    description:
      "Registering and running a company, hiring staff, handling customer data and dealing with regulators — the rules every business owner should know.",
    icon: "briefcase",
    readMore: { label: "Business guides", href: "/business" },
  },
  {
    slug: "rights-and-justice",
    name: "Rights & Justice",
    blurb: "Your rights under the Constitution, and how to defend them",
    description:
      "The rights every Nigerian has under the Constitution — liberty, a fair hearing, privacy and more — and what you can do when they are not respected.",
    icon: "scale",
    readMore: { label: "Know your rights", href: "/your-rights" },
  },
  {
    slug: "everyday-law",
    name: "Everyday Law",
    blurb: "Rent, work, shopping and the papers you sign",
    description:
      "The law in daily life: renting a home, starting a job, buying and selling, and the documents you are asked to sign along the way.",
    icon: "home",
    readMore: { label: "Before You Sign", href: "/stay-safe/before-you-sign" },
  },
  {
    slug: "crime-and-safety",
    name: "Crime & Safety",
    blurb: "Scams, fraud and how to protect yourself",
    description:
      "How common crimes and scams work, how to spot them early, and what to do — and where to report — if it happens to you.",
    icon: "shield",
    readMore: { label: "Stay safe", href: "/stay-safe" },
  },
];

export function isProgrammeSlug(value: string | undefined): value is ProgrammeSlug {
  return PROGRAMME_SLUGS.includes(value as ProgrammeSlug);
}

export function getProgramme(slug: string | undefined): ProgrammeCategory | null {
  return programmeCategories.find((item) => item.slug === slug) ?? null;
}
