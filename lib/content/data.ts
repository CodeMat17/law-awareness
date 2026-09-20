import type {
  Article,
  Checklist,
  ComplianceArea,
  EntryPoint,
  IssueCategory,

  NavGroup,
  NavLink,
  PlatformStat,
  Quiz,
  TickerItem,
} from "./types";

/**
 * Seed content.
 *
 * EDITORIAL RULE: every legal reference below points at a real, well-known
 * Nigerian instrument (the 1999 Constitution as amended, CAMA 2020, the NDP
 * Act 2023, the FCCPA 2018, the Cybercrimes Act 2015, ACJA 2015, the Labour
 * Act and the Copyright Act 2022) and is described only in general terms.
 * No judgment, citation, credential or regulatory deadline is invented here.
 * Everything carries `review: "educational"` unless a named human has
 * genuinely reviewed it - see `EditorialMeta`.
 *
 * This module is the in-memory store behind the repository. It is replaced by
 * Convex tables without any component change.
 */

/**
 * Legal-knowledge seed (categories, law entries, rights guides, Stay Safe
 * guides, glossary) lives in ./knowledge — split out in Phase 2 for size alone.
 * Re-exported here so every existing importer, the CMS included, is unaffected.
 */
export {
  BEFORE_YOU_SIGN,
  featuredRights,
  glossaryTerms,
  lawCategoryDefs,
  lawEntries,
  rightGuides,
  safetyGuides,
} from "./knowledge";

/**
 * Business & Enterprise seed (Phase 3) lives in ./business, ./compliance and
 * ./enterprise - split by subject, and for file size. Re-exported here so every
 * existing importer, the CMS included, keeps one import surface.
 */
export { businessAreas, businessGuideDetails, businessGuides } from "./business";
export {
  alertTopics,
  calendarEntries,
  complianceTopics,
  healthCheckQuestions,
  profileQuestions,
} from "./compliance";
export {
  ceoBriefings,
  contractTypes,
  industryHubs,
  regulatoryUpdates,
} from "./enterprise";

/**
 * Media seed (Phase 4) lives in ./media. `mediaItems` is the card-sized
 * projection over the same records, so the homepage and the CMS are unchanged.
 */
export {
  liveEvents,
  mediaItems,
  mediaSeries,
  podcastEpisodes,
  videos,
} from "./media";

/**
 * Legal Help seed (Phase 5) lives in ./legal-help: problem pathways, the
 * referral architecture, directory listings and the moderated public Q&A.
 */
export {
  lawyerListings,
  legalProblems,
  publicQuestions,
  referralRoutes,
} from "./legal-help";

/**
 * Professional/advanced seed (Phase 6) lives in ./case-law, ./constitution,
 * ./constitution-sections and ./versions. Re-exported here so the CMS and the
 * repository keep one import surface.
 */
export { caseRecords, courtProfiles } from "./case-law";
export { constitutionChapters, fundamentalRights } from "./constitution";
export { constitutionSections } from "./constitution-sections";
export { lawHistories } from "./versions";

const REVIEWED = "2026-08-14";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const navigation: NavGroup[] = [
  {
    label: "Know the Law",
    href: "/know-the-law",
    links: [
      {
        label: "The Constitution",
        href: "/constitution",
        description: "Chapters, sections and plain-language explanation",
      },
      {
        label: "Criminal & Civil Law",
        href: "/know-the-law/criminal-law",
        description: "How offences, claims and procedure work",
      },
      {
        label: "Employment & Labour",
        href: "/know-the-law/employment",
        description: "Contracts, wages, termination and workplace duties",
      },
      {
        label: "Land & Property",
        href: "/know-the-law/land-and-property",
        description: "Title, tenancy and the Land Use Act",
      },
      {
        label: "Cybercrime & Digital Rights",
        href: "/know-the-law/digital",
        description: "Online conduct, data and digital safety",
      },
      {
        label: "Case law explorer",
        href: "/cases",
        description: "Judgments explained in plain language",
      },
      {
        label: "Amendment tracker",
        href: "/know-the-law/amendments",
        description: "How each instrument has changed, version by version",
      },
      {
        label: "Plain language glossary",
        href: "/glossary",
        description: "Legal terms without the Latin",
      },
      {
        label: "Full law library",
        href: "/know-the-law",
        description: "Every subject area of Nigerian law",
      },
    ],
  },
  {
    label: "Your Rights",
    href: "/your-rights",
    links: [
      {
        label: "If the police stop you",
        href: "/your-rights/police-stop",
        description: "What to say, what to carry, what to avoid",
      },
      {
        label: "Arrest and detention",
        href: "/your-rights/arrest-and-detention",
        description: "Personal liberty under section 35",
      },
      {
        label: "Bail",
        href: "/your-rights/bail",
        description: "How bail works and what it is not",
      },
      {
        label: "Privacy and your data",
        href: "/your-rights/privacy",
        description: "Section 37 and the NDP Act 2023",
      },
      {
        label: "At work",
        href: "/your-rights/at-work",
        description: "Pay, hours, dismissal and unfair treatment",
      },
      {
        label: "All rights guides",
        href: "/your-rights",
      },
    ],
  },
  {
    label: "Business",
    href: "/business",
    links: [
      {
        label: "Business Legal Health Check",
        href: "/business/health-check",
        description: "A 15-area readiness assessment",
      },
      {
        label: "Compliance Centre",
        href: "/business/compliance",
        description: "What applies to my company?",
      },
      {
        label: "Regulatory Watch",
        href: "/business/regulatory-watch",
        description: "What changed, who it affects, what it means",
      },
      {
        label: "Before You Do This",
        href: "/business/guides",
        description: "Practical guides for decision points",
      },
      {
        label: "Contract Knowledge Centre",
        href: "/business/contracts",
        description: "Clause-by-clause education",
      },
      {
        label: "Business legal calendar",
        href: "/business/legal-calendar",
        description: "The compliance rhythm of a business year",
      },
      {
        label: "Industry legal hubs",
        href: "/business/industries",
        description: "What changes because of your sector",
      },
      {
        label: "Law for CEOs",
        href: "/business/ceo",
        description: "Strategic legal risk briefings",
      },
    ],
  },
  {
    label: "Stay Safe",
    href: "/stay-safe",
    links: [
      {
        label: "Before You Sign",
        href: "/stay-safe/before-you-sign",
        description: "Red flags in everyday documents",
      },
      {
        label: "Online scams and fraud",
        href: "/stay-safe/online-scams",
      },
      {
        label: "Buying land or property",
        href: "/stay-safe/buying-property",
      },
      {
        label: "Borrowing and lending",
        href: "/stay-safe/borrowing",
      },
    ],
  },
  {
    label: "Legal Help",
    href: "/legal-help",
    links: [
      {
        label: "I have a legal problem",
        href: "/legal-help/problem",
        description: "Guided educational pathway",
      },
      {
        label: "Ask a question",
        href: "/ask",
        description: "Moderated public Q&A",
      },
      {
        label: "Lawyer directory",
        href: "/lawyers",
        description: "Find a legal professional",
      },
      {
        label: "Free and low-cost help",
        href: "/legal-help/legal-aid",
        description: "Legal aid, clinics and public offices",
      },
      {
        label: "Resource centre",
        href: "/resources",
        description: "Templates, checklists and official links",
      },
    ],
  },
  {
    label: "Watch & Listen",
    href: "/watch",
    links: [
      { label: "Watch", href: "/watch", description: "Explainers and documentaries" },
      { label: "Listen", href: "/listen", description: "The podcast network" },
      { label: "Live", href: "/live", description: "Scheduled legal education sessions" },
      {
        label: "Law & Society",
        href: "/law-and-society",
        description: "Legal news and current affairs",
      },
      { label: "Quizzes", href: "/quizzes", description: "Test what you know" },
    ],
  },
  {
    label: "About",
    href: "/about",
    links: [
      {
        label: "About Law TV",
        href: "/about",
        description: "Who we are and what we are for",
      },
      {
        label: "Donate",
        href: "/donate",
        description: "Keep legal knowledge free for everyone",
      },
      {
        label: "Editorial Policy",
        href: "/about/editorial-policy",
        description: "How we source, badge and correct",
      },
      {
        label: "Privacy",
        href: "/about/privacy",
        description: "What we collect, and what we do not",
      },
      { label: "Terms", href: "/about/terms", description: "Terms of use" },
      {
        label: "Accessibility",
        href: "/about/accessibility",
        description: "Our WCAG 2.2 AA commitment",
      },
    ],
  },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Know the Law", href: "/know-the-law" },
      { label: "Your Rights", href: "/your-rights" },
      { label: "Business & Enterprise", href: "/business" },
      { label: "Stay Safe", href: "/stay-safe" },
      { label: "Law & Society", href: "/law-and-society" },
    ],
  },
  {
    heading: "Media",
    links: [
      { label: "Watch", href: "/watch" },
      { label: "Listen", href: "/listen" },
      { label: "Live", href: "/live" },
      { label: "Podcasts", href: "/listen" },
    ],
  },
  {
    heading: "Business",
    links: [
      { label: "Legal Health Check", href: "/business/health-check" },
      { label: "Compliance Centre", href: "/business/compliance" },
      { label: "Regulatory Watch", href: "/business/regulatory-watch" },
      { label: "Contract Knowledge Centre", href: "/business/contracts" },
      { label: "Business legal calendar", href: "/business/legal-calendar" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Legal Help", href: "/legal-help" },
      { label: "Ask a Question", href: "/ask" },
      { label: "Lawyer Directory", href: "/lawyers" },
      { label: "Contact", href: "/contact" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "About", href: "/about" },
      { label: "Editorial Policy", href: "/about/editorial-policy" },
      { label: "Privacy", href: "/about/privacy" },
      { label: "Terms", href: "/about/terms" },
      { label: "Accessibility", href: "/about/accessibility" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Ticker                                                                      */
/* -------------------------------------------------------------------------- */

export const tickerItems: TickerItem[] = [
  {
    id: "tk-1",
    label: "Legal update",
    tone: "update",
    headline:
      "Chapter IV of the 1999 Constitution explained, right by right",
    href: "/constitution/chapter-iv",
    publishedAt: "2026-09-05",
    status: "published",
  },
  {
    id: "tk-2",
    label: "Business alert",
    tone: "business",
    headline:
      "Does the Nigeria Data Protection Act 2023 apply to your company?",
    href: "/business/compliance/data-protection",
    publishedAt: "2026-09-04",
    status: "published",
  },
  {
    id: "tk-3",
    label: "Live this week",
    tone: "live",
    headline: "Know Your Rights: police encounters, explained live",
    href: "/live",
    publishedAt: "2026-09-03",
    status: "published",
  },
  {
    id: "tk-4",
    label: "Public notice",
    tone: "notice",
    headline:
      "Free legal assistance: how the Legal Aid Council of Nigeria works",
    href: "/legal-help/legal-aid",
    publishedAt: "2026-09-02",
    status: "published",
  },
  {
    id: "tk-5",
    label: "New episode",
    tone: "update",
    headline: "Before You Sign: the clauses people skip in tenancy agreements",
    href: "/listen/before-you-sign-tenancy",
    publishedAt: "2026-09-01",
    status: "published",
  },
  {
    id: "tk-6",
    label: "Compliance",
    tone: "alert",
    headline:
      "CAMA 2020 basics every registered business should understand",
    href: "/business/compliance/business-structure-and-registration",
    publishedAt: "2026-08-30",
    status: "published",
  },
];

/* -------------------------------------------------------------------------- */
/* Homepage entry points                                                       */
/* -------------------------------------------------------------------------- */

export const entryPoints: EntryPoint[] = [
  {
    id: "ep-1",
    audience: "citizens",
    eyebrow: "For everyone",
    promise: "Understand your rights",
    href: "/your-rights",
    icon: "scale",
  },
  {
    id: "ep-2",
    audience: "business",
    eyebrow: "For entrepreneurs",
    promise: "Protect your business",
    href: "/business",
    icon: "briefcase",
  },
  {
    id: "ep-3",
    audience: "business",
    eyebrow: "For companies",
    promise: "Stay aware of regulatory risk",
    href: "/business/regulatory-watch",
    icon: "shield-check",
  },
  {
    id: "ep-4",
    audience: "professionals",
    eyebrow: "For professionals",
    promise: "Track legal developments",
    href: "/law-and-society",
    icon: "gavel",
  },
  {
    id: "ep-5",
    audience: "learners",
    eyebrow: "For learners",
    promise: "Learn law in plain language",
    href: "/glossary",
    icon: "book-open",
  },
  {
    id: "ep-6",
    audience: "viewers",
    eyebrow: "For viewers",
    promise: "Watch and listen",
    href: "/watch",
    icon: "play",
  },
];

export const platformStats: PlatformStat[] = [
  {
    id: "st-1",
    value: "21",
    label: "Subject areas",
    detail: "From constitutional rights to intellectual property",
  },
  {
    id: "st-2",
    value: "Ch. IV",
    label: "Fundamental rights",
    detail: "Every right in the 1999 Constitution, explained plainly",
  },
  {
    id: "st-3",
    value: "36 + FCT",
    label: "National coverage",
    detail: "Federal law with state-level context",
  },
  {
    id: "st-4",
    value: "Weekly",
    label: "Regulatory watch",
    detail: "What changed, who it affects, what it means",
  },
];

/* -------------------------------------------------------------------------- */
/* Issue finder                                                                */
/* -------------------------------------------------------------------------- */

export const issueCategories: IssueCategory[] = [
  { slug: "police", name: "Police", blurb: "Stops, questioning, station visits", icon: "siren", href: "/your-rights/police-stop" },
  { slug: "arrest-bail", name: "Arrest & Bail", blurb: "Detention, charges, release", icon: "lock", href: "/your-rights/arrest-and-detention" },
  { slug: "property", name: "Property", blurb: "Rent, landlords, possession", icon: "home", href: "/know-the-law/land-and-property" },
  { slug: "work", name: "Work", blurb: "Pay, dismissal, treatment", icon: "hard-hat", href: "/your-rights/at-work" },
  { slug: "family", name: "Family", blurb: "Marriage, children, inheritance", icon: "heart", href: "/know-the-law/family-law" },
  { slug: "business", name: "Business", blurb: "Registration, partners, disputes", icon: "briefcase", href: "/business" },
  { slug: "contracts", name: "Contracts", blurb: "Agreements and obligations", icon: "signature", href: "/business/contracts" },
  { slug: "online-safety", name: "Online Safety", blurb: "Scams, harassment, fraud", icon: "shield", href: "/stay-safe/online-scams" },
  { slug: "money-debt", name: "Money & Debt", blurb: "Loans, recovery, guarantees", icon: "banknote", href: "/stay-safe/borrowing" },
  { slug: "consumer", name: "Consumer Rights", blurb: "Faulty goods, poor service", icon: "shopping-bag", href: "/know-the-law/consumer-protection" },
  { slug: "traffic", name: "Traffic", blurb: "Road stops, fines, accidents", icon: "car", href: "/know-the-law/traffic" },
  { slug: "land", name: "Land", blurb: "Title, surveys, the Land Use Act", icon: "map", href: "/stay-safe/buying-property" },
  { slug: "court", name: "Court", blurb: "Process, hearings, what to expect", icon: "landmark", href: "/know-the-law/court-process" },
  { slug: "other", name: "Something else", blurb: "Start from a description", icon: "circle-question", href: "/legal-help/problem" },
];



/* -------------------------------------------------------------------------- */
/* Business                                                                    */
/* -------------------------------------------------------------------------- */

export const complianceAreas: ComplianceArea[] = [
  { id: "ca-1", name: "Business structure & registration", weight: 10, icon: "building-2" },
  { id: "ca-2", name: "Contracts", weight: 10, icon: "signature" },
  { id: "ca-3", name: "Employment & payroll", weight: 10, icon: "users" },
  { id: "ca-4", name: "Tax awareness", weight: 8, icon: "receipt" },
  { id: "ca-5", name: "Data protection", weight: 10, icon: "database" },
  { id: "ca-6", name: "Intellectual property", weight: 7, icon: "lightbulb" },
  { id: "ca-7", name: "Consumer protection", weight: 7, icon: "shopping-bag" },
  { id: "ca-8", name: "Licensing & industry regulation", weight: 8, icon: "badge-check" },
  { id: "ca-9", name: "Record keeping", weight: 7, icon: "folder" },
  { id: "ca-10", name: "Corporate governance", weight: 8, icon: "landmark" },
  { id: "ca-11", name: "Dispute prevention", weight: 7, icon: "shield" },
  { id: "ca-12", name: "Insurance & risk", weight: 8, icon: "umbrella" },
];

/* -------------------------------------------------------------------------- */
/* Editorial                                                                   */
/* -------------------------------------------------------------------------- */

export const latestArticles: Article[] = [
  {
    id: "ar-1",
    slug: "chapter-iv-explained",
    kind: "explainer",
    title: "Chapter IV, right by right: what the Constitution actually guarantees",
    standfirst:
      "Twelve fundamental rights sit in Chapter IV of the 1999 Constitution. We take each one in turn, in plain language, with the everyday situations where it matters most.",
    category: "Human Rights",
    readingMinutes: 11,
    publishedAt: "2026-09-05",
    body: [
      {
        heading: "Where the rights live",
        paragraphs: [
          "Chapter IV of the 1999 Constitution is the part of the document most people mean when they talk about their rights. It is short, it is written in reasonably plain language, and it is enforceable — a person who says a right in Chapter IV has been breached can go to the High Court and ask for redress.",
          "The rights below are stated generally. Each one has qualifications written into the Constitution itself, and how it applies to a particular situation is a question of fact and law.",
        ],
      },
      {
        heading: "Life, dignity and liberty",
        paragraphs: [
          "The right to life protects a person from being deprived of life intentionally, subject to the exceptions the Constitution itself sets out. The right to dignity prohibits torture and inhuman or degrading treatment, slavery and forced labour.",
          "The right to personal liberty is the one people meet most often in practice. It governs when a person may be deprived of their liberty, and it carries the requirement that a person who is arrested be told why, in a language they understand, and be brought before a court within the period the Constitution allows.",
        ],
      },
      {
        heading: "Fair hearing",
        paragraphs: [
          "The right to a fair hearing covers both criminal and civil proceedings: a hearing within a reasonable time, by a court or tribunal constituted so as to secure its independence and impartiality.",
          "In criminal proceedings it carries the presumption of innocence, the right to be informed of the charge, adequate time and facilities to prepare a defence, and the right to defend yourself in person or through a legal practitioner of your own choice.",
        ],
      },
      {
        heading: "Private life, conscience and expression",
        paragraphs: [
          "The Constitution protects the privacy of citizens, their homes, correspondence, telephone conversations and telegraphic communications — the constitutional foundation that sits underneath Nigeria's more recent data protection legislation.",
          "It also protects freedom of thought, conscience and religion; freedom of expression, including the freedom to hold opinions and to receive and impart ideas; and the freedom of the press.",
        ],
      },
      {
        heading: "Assembly, movement, discrimination and property",
        paragraphs: [
          "Chapter IV protects peaceful assembly and association, including the right to form or belong to a trade union or political party; freedom of movement throughout Nigeria and the right to reside in any part of it; and freedom from discrimination on grounds such as community, ethnic group, place of origin, sex, religion or political opinion.",
          "It also protects the right to acquire and own immovable property anywhere in Nigeria, and restricts compulsory acquisition of property except on the terms the Constitution sets out.",
        ],
      },
      {
        heading: "What limits them",
        paragraphs: [
          "None of these rights is unlimited. The Constitution allows laws that are reasonably justifiable in a democratic society in the interest of matters such as defence, public safety, public order, public morality or public health, and for protecting the rights of other people.",
          "That qualification is where most real arguments happen. Whether a particular restriction is lawful is decided case by case, on evidence, by a court.",
        ],
      },
    ],
    audiences: ["citizens", "learners"],
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label: "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
        citation: "Chapter IV",
      },
    },
  },
  {
    id: "ar-2",
    slug: "ndpa-for-small-business",
    kind: "educational",
    title: "The Data Protection Act, translated for a small Nigerian business",
    standfirst:
      "You collect phone numbers to confirm orders. Does the NDP Act 2023 apply to you? What it asks of an organisation, without the compliance jargon.",
    category: "Data Protection",
    readingMinutes: 9,
    publishedAt: "2026-09-03",
    body: [
      {
        heading: "The question is not how big you are",
        paragraphs: [
          "The Nigeria Data Protection Act 2023 is not written only for banks and telecoms. It applies to the processing of personal data, and personal data is any information relating to an identifiable individual — a customer's phone number, a delivery address, a photograph, a WhatsApp order history.",
          "If your business collects that kind of information about customers, staff or suppliers, the Act is speaking to you. Some obligations scale with the size and risk of what you do, but the basic duties do not switch off because a business is small.",
        ],
      },
      {
        heading: "Controller or processor",
        paragraphs: [
          "The Act distinguishes the party who decides why and how personal data is processed — the data controller — from the party who processes it on that party's behalf, the data processor.",
          "A shop that collects customer numbers is a controller. The delivery service or software provider it passes those numbers to is usually a processor. It matters because the duties, and the paperwork between the two, differ.",
        ],
      },
      {
        heading: "The principles, in practice",
        paragraphs: [
          "Personal data must be processed lawfully, fairly and transparently; collected for specified, legitimate purposes and not used in ways incompatible with them; adequate and limited to what is necessary; accurate and kept up to date; kept no longer than necessary; and kept secure.",
          "In a small business those principles cash out as small habits. Collect the phone number because you need to confirm the order, not because the form has a space for it. Say what you will use it for. Do not sell the list. Delete what you no longer need.",
        ],
      },
      {
        heading: "A lawful basis, not just a tick box",
        paragraphs: [
          "Every processing activity needs a lawful basis. Consent is one — and where you rely on it, it must be freely given, specific and capable of being withdrawn as easily as it was given. Performance of a contract, a legal obligation, a vital interest, a public interest task and legitimate interests are the others.",
          "Marketing is where small businesses most often go wrong: adding a customer to a broadcast list because they once bought something is not automatically covered by the consent they gave for the order.",
        ],
      },
      {
        heading: "What the individual can ask you for",
        paragraphs: [
          "Data subjects have rights: to be informed, to access their data, to have it corrected, to have it deleted in defined circumstances, to restrict or object to processing, and to portability.",
          "A business needs a route by which a person can make such a request and a habit of answering it within the time the Act allows.",
        ],
      },
      {
        heading: "Security and breaches",
        paragraphs: [
          "You must take appropriate technical and organisational measures to protect personal data. For most small organisations that means access control, staff who understand the rules, and not keeping customer records in a personal chat archive indefinitely.",
          "Where a personal data breach occurs, the Act imposes notification duties — to the Nigeria Data Protection Commission and, where the risk to individuals is high, to the individuals themselves. Decide now who would make that call, because the clock runs from discovery.",
        ],
      },
    ],
    audiences: ["business"],
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: { label: "Nigeria Data Protection Act 2023" },
    },
  },
  {
    id: "ar-3",
    slug: "employment-contract-anatomy",
    kind: "analysis",
    title: "The anatomy of a Nigerian employment contract",
    standfirst:
      "Nine clauses decide most workplace disputes. Here is what each one does, and the questions to ask before anyone signs.",
    category: "Employment & Labour",
    readingMinutes: 8,
    publishedAt: "2026-09-01",
    body: [
      {
        heading: "Why the document decides so much",
        paragraphs: [
          "Nigerian employment law draws on the Labour Act, on the general law of contract, and on the terms the parties themselves agree. For employees outside the Labour Act's definition of a worker, much of the relationship is governed by the contract itself.",
          "That is why disputes so often turn on wording that nobody read carefully at the start. The clauses below are the ones that decide most of them.",
        ],
      },
      {
        heading: "Parties, role and start date",
        paragraphs: [
          "Identify the actual employing entity, not a trading name or a group brand. Where a group has several companies, the one named in the contract is the one an employee would sue and the one that carries the obligations.",
          "The role description sets the boundary of what can reasonably be required. A clause allowing duties to be varied is normal; one allowing unlimited unilateral variation of the entire contract is worth questioning.",
        ],
      },
      {
        heading: "Pay, deductions and benefits",
        paragraphs: [
          "The contract should state gross pay, when it is paid, and what is deducted. The Labour Act restricts the deductions an employer may make from wages, and a clause permitting deductions at large does not override that.",
          "Separate what is contractual from what is discretionary. A bonus described as discretionary is generally not an entitlement; one expressed as a formula usually is.",
        ],
      },
      {
        heading: "Hours, leave and absence",
        paragraphs: [
          "Working hours, overtime treatment, annual leave, public holidays, sick pay and maternity provisions belong in the document. Where statute sets a minimum, the contract can improve on it but cannot cut below it for those the statute covers.",
        ],
      },
      {
        heading: "Confidentiality, intellectual property and restraint",
        paragraphs: [
          "Confidentiality clauses survive the end of employment. Intellectual property clauses decide who owns work created during it — an issue that matters far beyond technology businesses.",
          "Post-termination restraints are the most contested. Nigerian courts examine restraints of trade closely, and a restriction that is wider than necessary to protect a legitimate business interest — in duration, geography or scope of activity — risks being unenforceable.",
        ],
      },
      {
        heading: "Termination and what happens after",
        paragraphs: [
          "Notice periods, payment in lieu, summary dismissal for gross misconduct, and any probation terms should be explicit and reciprocal. So should the practical afterwards: return of property, final pay, references, and what happens to accrued leave.",
          "Read the termination clause before signing, not when it is being used. It is the clause whose meaning you will care about most and be least able to negotiate.",
        ],
      },
    ],
    audiences: ["citizens", "business"],
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: { label: "Labour Act, Cap L1 LFN 2004" },
    },
  },
  {
    id: "ar-4",
    slug: "land-use-act-basics",
    kind: "explainer",
    title: "Why the Land Use Act shapes every property purchase in Nigeria",
    standfirst:
      "Governors hold land in trust. That single principle explains consent requirements, certificates of occupancy and much of what buyers find confusing.",
    category: "Land & Property",
    readingMinutes: 10,
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "One principle explains most of the confusion",
        paragraphs: [
          "The Land Use Act 1978 vests all land in each state in the Governor, to be held in trust and administered for the use and common benefit of Nigerians. What a private party holds is not absolute ownership in the way buyers often imagine, but a right of occupancy.",
          "Almost everything buyers find strange about Nigerian conveyancing follows from that single principle.",
        ],
      },
      {
        heading: "Statutory and customary rights of occupancy",
        paragraphs: [
          "The Act contemplates a statutory right of occupancy, granted by the Governor and typically associated with urban land, and a customary right of occupancy associated with land in non-urban areas and with local government administration.",
          "A certificate of occupancy is the document evidencing a grant. It is evidence of the right — not, by itself, proof that everything behind it was regular.",
        ],
      },
      {
        heading: "Why consent is required",
        paragraphs: [
          "Because the holder has a right of occupancy rather than absolute ownership, a transfer, mortgage or sublease of that right generally requires the Governor's consent. A transaction completed without the required consent may be ineffective to pass what the buyer believed they were buying.",
          "This is the single most common defect in Nigerian property transactions, and it is a defect in title, not paperwork to be tidied later.",
        ],
      },
      {
        heading: "What a buyer should actually do",
        paragraphs: [
          "Search the relevant land registry rather than relying on documents handed over by the seller. Establish the root of title and how the seller came to hold it. Confirm whether consent was obtained for the transactions in that chain. Visit the land and ask who occupies it.",
          "Where family or community land is involved, establish who is entitled to deal with it. A signature from someone without authority does not become good by being notarised.",
        ],
      },
      {
        heading: "Revocation and compensation",
        paragraphs: [
          "The Act allows a right of occupancy to be revoked for overriding public interest, on the terms it sets out, with compensation provisions attached. Buyers should understand this exists rather than discover it later.",
        ],
      },
    ],
    audiences: ["citizens", "business"],
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: { label: "Land Use Act 1978" },
    },
  },
  {
    id: "ar-5",
    slug: "cybercrimes-act-everyday",
    kind: "educational",
    title: "The Cybercrimes Act 2015 and your everyday internet use",
    standfirst:
      "Impersonation, fraudulent transfers, harassment: what the Act addresses, and the practical habits that keep ordinary users out of trouble.",
    category: "Cybercrime & Digital Rights",
    readingMinutes: 7,
    publishedAt: "2026-08-27",
    body: [
      {
        heading: "Not only for hackers",
        paragraphs: [
          "The Cybercrimes (Prohibition, Prevention, etc.) Act 2015 is Nigeria's principal statute on offences committed through computers and networks. Much of it addresses conduct most people would recognise as crime: unauthorised access to systems, interfering with critical national infrastructure, and fraud carried out electronically.",
          "But parts of it reach ordinary daily internet use, and those are the parts worth understanding.",
        ],
      },
      {
        heading: "Fraud, identity and impersonation",
        paragraphs: [
          "The Act criminalises electronic fraud and computer-related forgery, and it addresses identity theft and impersonation online — including using another person's identity to obtain a benefit.",
          "Practical consequence: opening an account or a page in someone else's name, even as a joke or to make a point, is not a grey area.",
        ],
      },
      {
        heading: "Messages, harassment and the free expression question",
        paragraphs: [
          "Provisions dealing with messages sent through computer systems, including cyberstalking and threatening communications, have been the most litigated and the most criticised part of the Act, on the ground that they can reach speech protected by Chapter IV of the Constitution.",
          "This is a live and developing area. Anyone facing a charge under these provisions, or considering a complaint under them, should take advice on the current state of the law rather than rely on a general summary.",
        ],
      },
      {
        heading: "Duties that fall on organisations",
        paragraphs: [
          "The Act places obligations on service providers and on financial institutions, including record retention and cooperation with lawful investigations, and it addresses the interception of communications under judicial authorisation.",
          "Businesses handling customer data should read these alongside their data protection obligations rather than as a separate subject.",
        ],
      },
      {
        heading: "If you are a victim",
        paragraphs: [
          "Preserve evidence before doing anything else: screenshots showing the account and the timestamp, transaction references, the full message rather than a crop. Report to the police or the relevant agency, and to the platform and your bank where money moved.",
          "Acting quickly matters more than acting perfectly. Funds are easiest to trace in the first hours.",
        ],
      },
    ],
    audiences: ["citizens", "learners"],
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label: "Cybercrimes (Prohibition, Prevention, etc.) Act 2015",
      },
    },
  },
];


/* -------------------------------------------------------------------------- */
/* Learning                                                                    */
/* -------------------------------------------------------------------------- */



export const quizzes: Quiz[] = [
  {
    id: "qz-1",
    slug: "know-your-rights",
    title: "Know Your Rights",
    description: "Ten situations, ten rights. How much of Chapter IV do you already know?",
    questionCount: 10,
    minutes: 6,
    level: "starter",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
  {
    id: "qz-2",
    slug: "contract-basics",
    title: "Contract Basics",
    description: "Offer, acceptance, consideration - and the traps in everyday agreements.",
    questionCount: 12,
    minutes: 8,
    level: "core",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
  {
    id: "qz-3",
    slug: "business-law",
    title: "Business Law",
    description: "Registration, duties and governance under CAMA 2020.",
    questionCount: 12,
    minutes: 9,
    level: "core",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
  {
    id: "qz-4",
    slug: "online-safety",
    title: "Online Safety",
    description: "Scams, impersonation and staying on the right side of the Cybercrimes Act.",
    questionCount: 10,
    minutes: 6,
    level: "starter",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
];

export const checklists: Checklist[] = [
  {
    id: "cl-1",
    slug: "starting-a-business",
    title: "Starting a business",
    description: "Structure, registration, records and the first commercial agreements.",
    itemCount: 16,
    audience: "business",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
  {
    id: "cl-2",
    slug: "signing-a-contract",
    title: "Signing any contract",
    description: "The read-through that catches most of what people later regret.",
    itemCount: 14,
    audience: "citizens",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
  {
    id: "cl-3",
    slug: "buying-property",
    title: "Buying property",
    description: "Title, searches, consent and the paperwork trail.",
    itemCount: 18,
    audience: "citizens",
    meta: { status: "published", review: "educational", lastReviewed: REVIEWED },
  },
];
