import type {
  EditorialMeta,
  LiveEvent,
  MediaContributor,
  MediaDetail,
  MediaItem,
  MediaSeries,
  SourceReference,
} from "./types";

/**
 * Media seed — Phase 4 (spec sections 32, 33 and 34).
 *
 * EDITORIAL RULES THIS FILE KEEPS
 *
 * 1. Every legal reference points at a real, well-known Nigerian instrument and
 *    is described only in general terms. No judgment, citation, deadline or
 *    threshold is invented — the rule `data.ts` and `business.ts` already keep.
 *
 * 2. No individual is invented. Spec rule 23 forbids inventing professional
 *    credentials, so contributors are the platform's own editorial desks, named
 *    by the role they play in the item. Real guests are named through the CMS
 *    once an item has actually been recorded — the same discipline that keeps
 *    `reviewedBy` empty until a named human has genuinely reviewed something.
 *
 * 3. Transcripts are not verbatim capture. `TranscriptCue.text` is a written
 *    record, in our words, of what the item covers at that point, and every
 *    surface that renders one says so.
 *
 * 4. No engagement numbers. `trending` is an editorial flag, not a view count,
 *    because a fabricated audience figure is a claim about the world.
 */

export const MEDIA_REVIEWED = "2026-09-01";

function mediaMeta(source?: SourceReference): EditorialMeta {
  return {
    status: "published",
    review: "educational",
    lastReviewed: MEDIA_REVIEWED,
    ...(source ? { source } : {}),
  };
}

/** An editorial desk credited on an item, by the role it plays in it. */
function desk(
  id: string,
  name: string,
  role: string,
  bio: string,
): MediaContributor {
  return { id, name, role, bio };
}

/* -------------------------------------------------------------------------- */
/* Series                                                                      */
/* -------------------------------------------------------------------------- */

export const mediaSeries: MediaSeries[] = [
  {
    id: "sr-1",
    slug: "the-constitution-plainly",
    kind: "video",
    title: "The Constitution, Plainly",
    tagline: "Chapter IV, one idea at a time",
    description:
      "Short films on the rights the 1999 Constitution (as amended) guarantees — what each one protects, where its limits sit, and how it is enforced in practice.",
    icon: "landmark",
    cadence: "New film every fortnight",
    topics: ["Constitution", "Human rights", "Court process"],
    seasons: [
      {
        id: "sr-1-s1",
        number: 1,
        title: "The rights themselves",
        summary:
          "Dignity, liberty, fair hearing and privacy — the guarantees in Chapter IV, taken one at a time.",
      },
      {
        id: "sr-1-s2",
        number: 2,
        title: "Enforcing them",
        summary:
          "What a fundamental rights application is, which court hears it, and what happens between filing and hearing.",
      },
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      rights: ["fair-hearing", "privacy"],
    },
    meta: mediaMeta({
      label:
        "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
    }),
  },
  {
    id: "sr-2",
    slug: "business-legal-basics",
    kind: "video",
    title: "Business Legal Basics",
    tagline: "The law a founder meets in the first two years",
    description:
      "Registration, directors' duties, employment, customer data and consumer obligations — the areas a growing Nigerian business runs into first, explained without the jargon.",
    icon: "briefcase",
    cadence: "Monthly",
    topics: ["Business", "Company law", "Employment", "Data protection"],
    related: {
      laws: ["registering-a-company", "directors-duties"],
      compliance: [
        "business-structure-and-registration",
        "employment-and-payroll",
      ],
    },
    meta: mediaMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "sr-3",
    slug: "in-the-public-interest",
    kind: "video",
    title: "In the Public Interest",
    tagline: "Longer films on how the system actually works",
    description:
      "Documentary work on the institutions most people only meet under pressure — courts, police stations, registries — and what the law says should happen inside them.",
    icon: "video",
    cadence: "Occasional",
    topics: ["Court process", "Police", "Civic life"],
    related: {
      laws: ["how-a-criminal-case-moves"],
      rights: ["police-stop", "arrest-and-detention"],
    },
    meta: mediaMeta(),
  },
  {
    id: "sr-4",
    slug: "before-you-sign",
    kind: "podcast",
    title: "Before You Sign",
    tagline: "Read it before it reads you",
    description:
      "Each episode takes one agreement people sign without reading — a tenancy, an offer letter, a partnership — and works through what is actually in it.",
    icon: "signature",
    cadence: "Weekly",
    host: "Law Awareness TV",
    topics: ["Contracts", "Tenancy", "Employment", "Money"],
    seasons: [
      {
        id: "sr-4-s1",
        number: 1,
        title: "Everyday paper",
        summary:
          "The documents almost everyone signs: tenancy agreements, offer letters and partnership terms.",
      },
    ],
    related: {
      safety: ["tenancy-agreement", "employment-offer", "borrowing"],
      contracts: ["lease-agreement", "employment-agreement"],
    },
    meta: mediaMeta(),
  },
  {
    id: "sr-5",
    slug: "everyday-law",
    kind: "podcast",
    title: "Everyday Law",
    tagline: "The law in the situations you did not plan for",
    description:
      "Consumer complaints, online scams, land purchases, workplace disputes — how the rules apply when something has already gone wrong, and what order to do things in.",
    icon: "scale",
    cadence: "Fortnightly",
    host: "Law Awareness TV",
    topics: ["Consumer", "Online safety", "Land", "Work"],
    related: {
      laws: ["consumer-protection-fccpa", "cybercrimes-act"],
      safety: ["online-scams", "buying-property"],
    },
    meta: mediaMeta({
      label: "Federal Competition and Consumer Protection Act 2018",
    }),
  },
  {
    id: "sr-6",
    slug: "know-your-rights-live",
    kind: "live",
    title: "Know Your Rights Live",
    tagline: "Open sessions with moderated questions",
    description:
      "Live legal education with an audience: a short briefing, then moderated questions. Every session becomes an on-demand page once it ends.",
    icon: "radio",
    cadence: "Most weeks, evenings",
    host: "Law Awareness TV",
    topics: ["Human rights", "Police", "Business"],
    related: { rights: ["police-stop", "arrest-and-detention"] },
    meta: mediaMeta(),
  },
];

/* -------------------------------------------------------------------------- */
/* Video                                                                       */
/* -------------------------------------------------------------------------- */

export const videos: MediaDetail[] = [
  {
    id: "md-2",
    slug: "what-cama-changed",
    kind: "video",
    format: "explainer",
    title: "What CAMA 2020 changed for small companies",
    description:
      "A short explainer on single-member companies, filings and the duties that come with registration.",
    duration: "14 min",
    series: "Business Legal Basics",
    seriesSlug: "business-legal-basics",
    publishedAt: "2026-09-04",
    topics: ["Business", "Company law"],
    featured: true,
    trending: true,
    takeaways: [
      "Why registering changes who is liable for what.",
      "What a single-member company is, and who it suits.",
      "The filing habit that keeps a company in good standing.",
      "Where a director's duties begin — including on day one.",
    ],
    contributors: [
      desk(
        "md-2-c1",
        "Law Awareness TV — business desk",
        "Presenter",
        "The desk that maintains the Business & Enterprise section and its compliance material.",
      ),
    ],
    chapters: [
      {
        id: "md-2-ch1",
        startSeconds: 0,
        title: "Why the form of your business matters",
        summary:
          "Sole trader, partnership or company — the practical difference is who answers when something goes wrong.",
      },
      {
        id: "md-2-ch2",
        startSeconds: 190,
        title: "Single-member companies",
        summary:
          "CAMA 2020 allows a private company with one member. What that means for founders working alone.",
      },
      {
        id: "md-2-ch3",
        startSeconds: 445,
        title: "The filings that follow registration",
        summary:
          "Registration is the start of an ongoing obligation, not a one-off event.",
      },
      {
        id: "md-2-ch4",
        startSeconds: 690,
        title: "Duties you take on as a director",
        summary:
          "Acting in the company's interest, avoiding conflicts, and keeping the company's affairs separate from your own.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-2-t1",
          startSeconds: 0,
          speaker: "Presenter",
          text: "The film opens on the question founders ask last and should ask first: what is the business, legally? It sets out that the choice of form decides who carries the risk.",
        },
        {
          id: "md-2-t2",
          startSeconds: 190,
          speaker: "Presenter",
          text: "It explains that the Companies and Allied Matters Act 2020 permits a private company to have a single member, and why that mattered for people who previously had to find a second name.",
        },
        {
          id: "md-2-t3",
          startSeconds: 445,
          speaker: "Presenter",
          text: "It covers the ongoing filing obligations that registration creates, and why the platform does not publish specific due dates — they change, and a wrong date is worse than none.",
        },
        {
          id: "md-2-t4",
          startSeconds: 690,
          speaker: "Presenter",
          text: "It closes on directors' duties: acting in the company's interest, disclosing conflicts, and keeping company money and personal money apart from the first day.",
        },
      ],
    },
    related: {
      laws: ["registering-a-company", "directors-duties"],
      guides: ["start-a-business"],
      compliance: [
        "business-structure-and-registration",
        "corporate-governance",
      ],
      updates: ["cama-2020-company-law-reform"],
    },
    meta: mediaMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "md-3",
    slug: "fair-hearing-explained",
    kind: "video",
    format: "explainer",
    title: "Section 36: what a fair hearing really means",
    description:
      "Notice, an opportunity to respond, an impartial decision-maker — the principles behind the phrase.",
    duration: "9 min",
    series: "The Constitution, Plainly",
    seriesSlug: "the-constitution-plainly",
    season: 1,
    episode: 4,
    publishedAt: "2026-09-02",
    topics: ["Constitution", "Court process", "Human rights"],
    trending: true,
    takeaways: [
      "Fair hearing is a process guarantee, not a promise of an outcome.",
      "Notice and a real chance to respond sit at its centre.",
      "It reaches beyond courts into tribunals and disciplinary panels.",
    ],
    contributors: [
      desk(
        "md-3-c1",
        "Law Awareness TV — constitutional desk",
        "Presenter",
        "The desk responsible for the platform's Chapter IV material.",
      ),
    ],
    chapters: [
      {
        id: "md-3-ch1",
        startSeconds: 0,
        title: "Where the guarantee comes from",
        summary:
          "Section 36 of the 1999 Constitution (as amended), and what it is protecting against.",
      },
      {
        id: "md-3-ch2",
        startSeconds: 155,
        title: "Notice and the chance to respond",
        summary:
          "Knowing the case against you, in time to answer it, is most of what fair hearing means.",
      },
      {
        id: "md-3-ch3",
        startSeconds: 340,
        title: "An impartial decision-maker",
        summary:
          "Why nobody decides their own case, and what that looks like outside a courtroom.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-3-t1",
          startSeconds: 0,
          speaker: "Presenter",
          text: "The film introduces fair hearing as a guarantee about how a decision is reached, and locates it in section 36 of the Constitution.",
        },
        {
          id: "md-3-t2",
          startSeconds: 155,
          speaker: "Presenter",
          text: "It works through notice: being told what is alleged, with enough time to prepare an answer, is the part most often missing in practice.",
        },
        {
          id: "md-3-t3",
          startSeconds: 340,
          speaker: "Presenter",
          text: "It explains impartiality — that nobody sits in judgment on their own case — and gives everyday settings where the principle applies, including disciplinary panels.",
        },
        {
          id: "md-3-t4",
          startSeconds: 480,
          speaker: "Presenter",
          text: "It closes by saying plainly that a fair process does not guarantee the result you want, and points viewers to the enforcement route.",
        },
      ],
    },
    related: {
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      rights: ["fair-hearing"],
      terms: ["fundamental-rights", "habeas-corpus"],
      articles: ["chapter-iv-explained"],
    },
    meta: mediaMeta({
      label:
        "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
      citation: "Constitution of Nigeria 1999, s. 36",
    }),
  },
  {
    id: "md-5",
    slug: "police-stop-what-to-do",
    kind: "video",
    format: "short",
    title: "Stopped on the road: the first two minutes",
    description:
      "A short film on what the law protects during a roadside stop, and how to stay both safe and within your rights.",
    duration: "4 min",
    series: "The Constitution, Plainly",
    seriesSlug: "the-constitution-plainly",
    season: 1,
    episode: 5,
    publishedAt: "2026-08-29",
    topics: ["Police", "Human rights", "Traffic"],
    trending: true,
    takeaways: [
      "You may ask, calmly, why you have been stopped.",
      "Cooperation and rights are not opposites.",
      "What to note down, and when to note it.",
    ],
    contributors: [
      desk(
        "md-5-c1",
        "Law Awareness TV — rights desk",
        "Presenter",
        "The desk behind the platform's Your Rights guides.",
      ),
    ],
    chapters: [
      {
        id: "md-5-ch1",
        startSeconds: 0,
        title: "Staying safe first",
        summary: "Why de-escalation comes before every other consideration.",
      },
      {
        id: "md-5-ch2",
        startSeconds: 75,
        title: "What you can ask",
        summary: "Asking the reason for a stop, and how to ask it.",
      },
      {
        id: "md-5-ch3",
        startSeconds: 160,
        title: "Afterwards",
        summary:
          "What to write down while it is fresh, and where a complaint goes.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-5-t1",
          startSeconds: 0,
          speaker: "Presenter",
          text: "The film opens on safety: the first goal in any encounter is that it ends without harm, and tone does most of that work.",
        },
        {
          id: "md-5-t2",
          startSeconds: 75,
          speaker: "Presenter",
          text: "It covers the questions a person may reasonably ask, and frames rights as something you exercise calmly rather than announce.",
        },
        {
          id: "md-5-t3",
          startSeconds: 160,
          speaker: "Presenter",
          text: "It ends on the record: time, place, and what was said, written down while it is still fresh, and the routes a complaint can take.",
        },
      ],
    },
    related: {
      rights: ["police-stop", "arrest-and-detention"],
      laws: ["fundamental-rights-chapter-iv"],
      media: ["know-your-rights-police-encounters"],
    },
    meta: mediaMeta({
      label:
        "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
    }),
  },
  {
    id: "md-6",
    slug: "customer-data-webinar",
    kind: "video",
    format: "webinar",
    title: "The data you collect without noticing",
    description:
      "A recorded session for small teams on what counts as personal data, and the habits that keep a business on the right side of the NDP Act 2023.",
    duration: "48 min",
    series: "Business Legal Basics",
    seriesSlug: "business-legal-basics",
    publishedAt: "2026-08-24",
    topics: ["Data protection", "Business", "Technology"],
    takeaways: [
      "A customer list is personal data, and a spreadsheet is a system.",
      "Why you collect it matters as much as what you collect.",
      "Deleting what you no longer need is a control, not housekeeping.",
    ],
    contributors: [
      desk(
        "md-6-c1",
        "Law Awareness TV — business desk",
        "Presenter",
        "The desk that maintains the Compliance Centre.",
      ),
      desk(
        "md-6-c2",
        "Law Awareness TV — production",
        "Producer",
        "Session production and moderation of written questions.",
      ),
    ],
    chapters: [
      {
        id: "md-6-ch1",
        startSeconds: 0,
        title: "What personal data actually covers",
        summary:
          "The everyday records a business already holds, seen through the Nigeria Data Protection Act 2023.",
      },
      {
        id: "md-6-ch2",
        startSeconds: 620,
        title: "Having a reason",
        summary:
          "Why the purpose you collect for shapes everything that follows.",
      },
      {
        id: "md-6-ch3",
        startSeconds: 1480,
        title: "Keeping it, and letting it go",
        summary: "Storage, access and disposal as ordinary operating habits.",
      },
      {
        id: "md-6-ch4",
        startSeconds: 2210,
        title: "Questions from the session",
        summary:
          "Moderated questions on vendors, staff records and messaging apps.",
      },
    ],
    transcript: {
      status: "in-progress",
      cues: [
        {
          id: "md-6-t1",
          startSeconds: 0,
          speaker: "Presenter",
          text: "The session opens by listing the records a small business already holds — customers, staff, suppliers — and treating each as personal data.",
        },
        {
          id: "md-6-t2",
          startSeconds: 620,
          speaker: "Presenter",
          text: "It explains that having a clear reason for collecting something is the foundation the rest of the NDP Act 2023 rests on.",
        },
        {
          id: "md-6-t3",
          startSeconds: 1480,
          speaker: "Presenter",
          text: "It turns to storage and disposal, and to who inside a business can reach which records.",
        },
      ],
    },
    related: {
      laws: ["nigeria-data-protection-act"],
      guides: ["before-collecting-customer-data"],
      compliance: ["data-protection"],
      contracts: ["privacy-policy"],
      updates: ["nigeria-data-protection-act-2023"],
    },
    meta: mediaMeta({ label: "Nigeria Data Protection Act 2023" }),
  },
  {
    id: "md-7",
    slug: "inside-the-court-process",
    kind: "video",
    format: "documentary",
    title: "Inside the process: what a case looks like from the door",
    description:
      "A longer film following the shape of a criminal matter — from first report to first appearance — and the points where people most often get lost.",
    duration: "37 min",
    series: "In the Public Interest",
    seriesSlug: "in-the-public-interest",
    publishedAt: "2026-08-18",
    topics: ["Court process", "Criminal law", "Police"],
    takeaways: [
      "The order of events, and who is responsible at each stage.",
      "Where bail sits in the sequence, and where it does not.",
      "Why adjournments happen, and what to do about them.",
    ],
    contributors: [
      desk(
        "md-7-c1",
        "Law Awareness TV — documentary unit",
        "Director",
        "Long-form editorial work on legal institutions.",
      ),
      desk(
        "md-7-c2",
        "Law Awareness TV — rights desk",
        "Narration",
        "The desk behind the platform's criminal-procedure explainers.",
      ),
    ],
    chapters: [
      {
        id: "md-7-ch1",
        startSeconds: 0,
        title: "The report",
        summary: "How a matter starts, and what a complainant is asked for.",
      },
      {
        id: "md-7-ch2",
        startSeconds: 520,
        title: "Investigation and detention",
        summary:
          "What the Administration of Criminal Justice Act 2015 frames around this stage.",
      },
      {
        id: "md-7-ch3",
        startSeconds: 1240,
        title: "First appearance",
        summary:
          "Arraignment, plea, and the questions people wish they had asked.",
      },
      {
        id: "md-7-ch4",
        startSeconds: 1830,
        title: "The long middle",
        summary:
          "Adjournments, timelines and keeping your own record of a case.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-7-t1",
          startSeconds: 0,
          speaker: "Narration",
          text: "The film opens at the point of report and follows the paperwork rather than any individual case.",
        },
        {
          id: "md-7-t2",
          startSeconds: 520,
          speaker: "Narration",
          text: "It describes the investigation stage in general terms and the protections the Administration of Criminal Justice Act 2015 frames around detention.",
        },
        {
          id: "md-7-t3",
          startSeconds: 1240,
          speaker: "Narration",
          text: "It reaches first appearance, explains arraignment and plea, and separates what a court decides from what it does not.",
        },
        {
          id: "md-7-t4",
          startSeconds: 1830,
          speaker: "Narration",
          text: "It closes on the long middle of a case, and on keeping your own dated record of every appearance.",
        },
      ],
    },
    related: {
      laws: ["how-a-criminal-case-moves"],
      rights: ["arrest-and-detention", "bail"],
      terms: ["bail", "subpoena"],
    },
    meta: mediaMeta({ label: "Administration of Criminal Justice Act 2015" }),
  },
  {
    id: "md-8",
    slug: "creators-and-copyright",
    kind: "video",
    format: "interview",
    title: "Creators and the Copyright Act 2022",
    description:
      "A conversation about what protection creators already have, what a licence really transfers, and the paperwork worth keeping.",
    duration: "22 min",
    series: "In the Public Interest",
    seriesSlug: "in-the-public-interest",
    publishedAt: "2026-08-11",
    topics: ["Intellectual property", "Media", "Business"],
    takeaways: [
      "Protection generally arises on creation, not on registration.",
      "A licence and an assignment are not the same transaction.",
      "Keeping drafts and dates is cheap; proving authorship later is not.",
    ],
    contributors: [
      desk(
        "md-8-c1",
        "Law Awareness TV — culture desk",
        "Interviewer",
        "Editorial coverage of media, publishing and the creative sector.",
      ),
    ],
    chapters: [
      {
        id: "md-8-ch1",
        startSeconds: 0,
        title: "What you have already",
        summary: "Where protection comes from under the Copyright Act 2022.",
      },
      {
        id: "md-8-ch2",
        startSeconds: 410,
        title: "Licence or assignment",
        summary:
          "Lending a right versus parting with it, and how contracts blur the two.",
      },
      {
        id: "md-8-ch3",
        startSeconds: 900,
        title: "Records",
        summary:
          "The drafts, dates and messages that matter if authorship is questioned.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-8-t1",
          startSeconds: 0,
          speaker: "Interviewer",
          text: "The conversation opens on a common belief — that nothing is protected until it is registered — and sets out the general position under the Copyright Act 2022.",
        },
        {
          id: "md-8-t2",
          startSeconds: 410,
          speaker: "Interviewer",
          text: "It separates a licence from an assignment, and looks at the contract wording where creators most often give away more than they intended.",
        },
        {
          id: "md-8-t3",
          startSeconds: 900,
          speaker: "Interviewer",
          text: "It closes on record-keeping: drafts, dates and correspondence, kept as a matter of routine rather than in response to a dispute.",
        },
      ],
    },
    related: {
      laws: ["copyright-act-2022"],
      compliance: ["intellectual-property"],
      contracts: ["service-agreement"],
      updates: ["copyright-act-2022"],
      industries: ["media"],
    },
    meta: mediaMeta({ label: "Copyright Act 2022" }),
  },
];

/* -------------------------------------------------------------------------- */
/* Podcast                                                                     */
/* -------------------------------------------------------------------------- */

export const podcastEpisodes: MediaDetail[] = [
  {
    id: "md-1",
    slug: "before-you-sign-tenancy",
    kind: "podcast",
    format: "episode",
    title: "Before You Sign: tenancy agreements",
    description:
      "The clauses tenants skip, the ones landlords rely on, and the questions worth asking before you pay anything.",
    duration: "31 min",
    series: "Before You Sign",
    seriesSlug: "before-you-sign",
    season: 1,
    episode: 1,
    host: "Law Awareness TV",
    publishedAt: "2026-09-06",
    topics: ["Tenancy", "Contracts", "Land"],
    featured: true,
    trending: true,
    takeaways: [
      "What the agreement says about repairs is usually the clause that bites.",
      "Payment terms and renewal terms are separate questions.",
      "Ask who you are actually dealing with before money moves.",
    ],
    contributors: [
      desk(
        "md-1-c1",
        "Law Awareness TV — property desk",
        "Host",
        "The desk behind the platform's land, title and tenancy material.",
      ),
    ],
    chapters: [
      {
        id: "md-1-ch1",
        startSeconds: 0,
        title: "Who is the other side",
        summary:
          "Establishing whether the person collecting rent has the standing to let the property at all.",
      },
      {
        id: "md-1-ch2",
        startSeconds: 480,
        title: "What you are paying for",
        summary: "Rent, and the other sums that appear alongside it.",
      },
      {
        id: "md-1-ch3",
        startSeconds: 1010,
        title: "Repairs and condition",
        summary:
          "Who fixes what, and why the agreement should say so before you move in.",
      },
      {
        id: "md-1-ch4",
        startSeconds: 1520,
        title: "Ending and renewing",
        summary: "Notice, renewal, and the difference between the two.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-1-t1",
          startSeconds: 0,
          speaker: "Host",
          text: "The episode starts with identity and standing: who is letting the property, and on what basis, before any money changes hands.",
        },
        {
          id: "md-1-t2",
          startSeconds: 480,
          speaker: "Host",
          text: "It goes through the sums that appear beside rent in a typical agreement, and why each should be written down rather than agreed verbally.",
        },
        {
          id: "md-1-t3",
          startSeconds: 1010,
          speaker: "Host",
          text: "It covers repairs and condition, and recommends a dated record of the state of the property at the point of entry.",
        },
        {
          id: "md-1-t4",
          startSeconds: 1520,
          speaker: "Host",
          text: "It closes on notice and renewal, and on the Land Use Act 1978 as the background against which title questions are answered.",
        },
      ],
    },
    related: {
      safety: ["tenancy-agreement", "buying-property"],
      laws: ["land-use-act-and-title"],
      contracts: ["lease-agreement"],
      terms: ["trespass"],
      articles: ["land-use-act-basics"],
    },
    meta: mediaMeta({ label: "Land Use Act 1978" }),
  },
  {
    id: "md-4",
    slug: "consumer-complaint-route",
    kind: "podcast",
    format: "episode",
    title: "When the seller says no: consumer complaints in practice",
    description:
      "How the FCCPA 2018 frames consumer protection, and the practical order of escalation.",
    duration: "26 min",
    series: "Everyday Law",
    seriesSlug: "everyday-law",
    host: "Law Awareness TV",
    publishedAt: "2026-08-31",
    topics: ["Consumer", "Money"],
    trending: true,
    takeaways: [
      "Complain in writing, early, and keep the copy.",
      "Escalation has an order — skipping steps usually costs time.",
      "What a receipt is really for.",
    ],
    contributors: [
      desk(
        "md-4-c1",
        "Law Awareness TV — consumer desk",
        "Host",
        "The desk behind the platform's consumer-protection guides.",
      ),
    ],
    chapters: [
      {
        id: "md-4-ch1",
        startSeconds: 0,
        title: "What the framework protects",
        summary:
          "The Federal Competition and Consumer Protection Act 2018, described in general terms.",
      },
      {
        id: "md-4-ch2",
        startSeconds: 430,
        title: "The first letter",
        summary: "Putting a complaint in writing, and what to include in it.",
      },
      {
        id: "md-4-ch3",
        startSeconds: 980,
        title: "Escalating",
        summary:
          "Seller, then platform, then regulator — and why that order matters.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-4-t1",
          startSeconds: 0,
          speaker: "Host",
          text: "The episode introduces the consumer framework created by the FCCPA 2018 and what kinds of problems it is aimed at.",
        },
        {
          id: "md-4-t2",
          startSeconds: 430,
          speaker: "Host",
          text: "It works through a first written complaint: what happened, what was promised, what is being asked for, and by when.",
        },
        {
          id: "md-4-t3",
          startSeconds: 980,
          speaker: "Host",
          text: "It sets out the order of escalation and notes that keeping every reply is what makes the next step possible.",
        },
      ],
    },
    related: {
      laws: ["consumer-protection-fccpa"],
      compliance: ["consumer-protection"],
      rights: ["consumer"],
      updates: ["fccpa-2018-consumer-framework"],
    },
    meta: mediaMeta({
      label: "Federal Competition and Consumer Protection Act 2018",
    }),
  },
  {
    id: "md-9",
    slug: "before-you-sign-offer-letter",
    kind: "podcast",
    format: "episode",
    title: "Before You Sign: the offer letter",
    description:
      "Probation, notice, deductions and the clauses that decide what happens if the job ends badly.",
    duration: "29 min",
    series: "Before You Sign",
    seriesSlug: "before-you-sign",
    season: 1,
    episode: 2,
    host: "Law Awareness TV",
    publishedAt: "2026-08-27",
    topics: ["Employment", "Contracts"],
    takeaways: [
      "The notice clause is the one you will read last and need most.",
      "What probation does and does not change.",
      "Anything promised verbally belongs in the letter.",
    ],
    contributors: [
      desk(
        "md-9-c1",
        "Law Awareness TV — employment desk",
        "Host",
        "The desk behind the platform's employment and workplace material.",
      ),
    ],
    chapters: [
      {
        id: "md-9-ch1",
        startSeconds: 0,
        title: "What the letter is",
        summary:
          "An offer letter as the contract's opening terms, not a formality.",
      },
      {
        id: "md-9-ch2",
        startSeconds: 520,
        title: "Probation and notice",
        summary:
          "How the two interact, and where the Labour Act sits in the background.",
      },
      {
        id: "md-9-ch3",
        startSeconds: 1180,
        title: "Pay, deductions and benefits",
        summary: "Reading the money clauses as carefully as the job title.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-9-t1",
          startSeconds: 0,
          speaker: "Host",
          text: "The episode treats the offer letter as the contract it is, and encourages reading it before the excitement of the offer wears off.",
        },
        {
          id: "md-9-t2",
          startSeconds: 520,
          speaker: "Host",
          text: "It covers probation and notice, describing the Labour Act in general terms as the background framework.",
        },
        {
          id: "md-9-t3",
          startSeconds: 1180,
          speaker: "Host",
          text: "It works through pay, deductions and benefits, and recommends that every verbal promise be written into the letter before signing.",
        },
      ],
    },
    related: {
      safety: ["employment-offer"],
      laws: ["employment-contracts-and-termination"],
      rights: ["at-work"],
      contracts: ["employment-agreement"],
      articles: ["employment-contract-anatomy"],
    },
    meta: mediaMeta({ label: "Labour Act" }),
  },
  {
    id: "md-10",
    slug: "scams-that-look-official",
    kind: "podcast",
    format: "audio-explainer",
    title: "Scams that look official",
    description:
      "How impersonation works online, what the Cybercrimes Act 2015 is aimed at, and the pause that stops most of it.",
    duration: "18 min",
    series: "Everyday Law",
    seriesSlug: "everyday-law",
    host: "Law Awareness TV",
    publishedAt: "2026-08-20",
    topics: ["Online safety", "Technology", "Money"],
    trending: true,
    takeaways: [
      "Urgency is the tell — almost every time.",
      "Verify through a channel you found yourself.",
      "Report early; screenshots age badly.",
    ],
    contributors: [
      desk(
        "md-10-c1",
        "Law Awareness TV — digital desk",
        "Host",
        "The desk behind the platform's online-safety and digital-rights material.",
      ),
    ],
    chapters: [
      {
        id: "md-10-ch1",
        startSeconds: 0,
        title: "The shape of the approach",
        summary:
          "Authority, urgency, and a payment route that cannot be reversed.",
      },
      {
        id: "md-10-ch2",
        startSeconds: 390,
        title: "Verifying independently",
        summary: "Why you never use the number in the message.",
      },
      {
        id: "md-10-ch3",
        startSeconds: 760,
        title: "If it has already happened",
        summary: "What to preserve, and where a report goes.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-10-t1",
          startSeconds: 0,
          speaker: "Host",
          text: "The episode describes the common structure of an impersonation approach and why it works on careful people.",
        },
        {
          id: "md-10-t2",
          startSeconds: 390,
          speaker: "Host",
          text: "It sets out independent verification as the single habit that defeats most of it, and refers to the Cybercrimes Act 2015 in general terms.",
        },
        {
          id: "md-10-t3",
          startSeconds: 760,
          speaker: "Host",
          text: "It covers what to preserve after the fact — messages, account details, timestamps — and encourages reporting early.",
        },
      ],
    },
    related: {
      safety: ["online-scams"],
      laws: ["cybercrimes-act"],
      articles: ["cybercrimes-act-everyday"],
      terms: ["negligence"],
    },
    meta: mediaMeta({
      label: "Cybercrimes (Prohibition, Prevention etc.) Act 2015",
    }),
  },
  {
    id: "md-11",
    slug: "before-you-sign-partnership",
    kind: "podcast",
    format: "episode",
    title: "Before You Sign: going into business with a friend",
    description:
      "Who decides, who owns what, and how either of you leaves — written down while everyone still likes each other.",
    duration: "34 min",
    series: "Before You Sign",
    seriesSlug: "before-you-sign",
    season: 1,
    episode: 3,
    host: "Law Awareness TV",
    publishedAt: "2026-08-13",
    topics: ["Business", "Contracts"],
    takeaways: [
      "The exit clause is written for the version of you who wants to leave.",
      "Contribution and ownership are different questions.",
      "Deadlock has to be planned for before it happens.",
    ],
    contributors: [
      desk(
        "md-11-c1",
        "Law Awareness TV — business desk",
        "Host",
        "The desk that maintains the Business & Enterprise section.",
      ),
    ],
    chapters: [
      {
        id: "md-11-ch1",
        startSeconds: 0,
        title: "The conversation nobody has",
        summary:
          "Why partnerships fail on unwritten assumptions rather than bad faith.",
      },
      {
        id: "md-11-ch2",
        startSeconds: 640,
        title: "Ownership and contribution",
        summary:
          "Money, time and ideas — and why they are not automatically equal.",
      },
      {
        id: "md-11-ch3",
        startSeconds: 1390,
        title: "Deadlock and exit",
        summary:
          "Deciding in advance what happens when the two of you disagree.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-11-t1",
          startSeconds: 0,
          speaker: "Host",
          text: "The episode opens on the assumptions partners carry into a business without saying them aloud.",
        },
        {
          id: "md-11-t2",
          startSeconds: 640,
          speaker: "Host",
          text: "It separates what each person contributes from what each person owns, and works through why the two are decided separately.",
        },
        {
          id: "md-11-t3",
          startSeconds: 1390,
          speaker: "Host",
          text: "It closes on deadlock and exit, and on writing both into the agreement at the point when nobody needs them.",
        },
      ],
    },
    related: {
      safety: ["business-partnership"],
      guides: ["before-entering-a-partnership"],
      contracts: ["partnership-agreement", "shareholder-agreement"],
      compliance: ["corporate-governance"],
    },
    meta: mediaMeta(),
  },
];

/* -------------------------------------------------------------------------- */
/* Live                                                                        */
/* -------------------------------------------------------------------------- */

export const liveEvents: LiveEvent[] = [
  {
    id: "md-live",
    slug: "know-your-rights-police-encounters",
    kind: "live",
    format: "live-session",
    title: "Know Your Rights: police encounters, explained",
    description:
      "An open session on what the Constitution protects during a stop, a search or an arrest — with moderated questions from the audience.",
    series: "Know Your Rights Live",
    seriesSlug: "know-your-rights-live",
    host: "Law Awareness TV",
    publishedAt: "2026-09-08",
    liveStatus: "ended",
    scheduledFor: "2026-09-08T18:00:00+01:00",
    topics: ["Human rights", "Police", "Court process"],
    featured: true,
    takeaways: [
      "What Chapter IV protects during a stop, a search and an arrest.",
      "The difference between cooperating and consenting.",
      "Where a complaint goes afterwards.",
    ],
    contributors: [
      desk(
        "md-live-c1",
        "Law Awareness TV — rights desk",
        "Presenter",
        "The desk behind the platform's Your Rights guides.",
      ),
      desk(
        "md-live-c2",
        "Law Awareness TV — production",
        "Moderator",
        "Reads and orders audience questions during the session.",
      ),
    ],
    agenda: [
      {
        id: "md-live-a1",
        label: "Opening",
        title: "What the Constitution guarantees",
        detail:
          "A short briefing on the Chapter IV rights engaged in an encounter with law enforcement.",
      },
      {
        id: "md-live-a2",
        label: "Main session",
        title: "Stops, searches and arrest",
        detail:
          "Each situation taken in turn, with what the law protects and what it does not.",
      },
      {
        id: "md-live-a3",
        label: "Questions",
        title: "Moderated audience questions",
        detail:
          "Questions are read out and answered in general terms. No individual case is advised on.",
      },
      {
        id: "md-live-a4",
        label: "Close",
        title: "Where to go next",
        detail:
          "The written guides, and the routes to a lawyer or to legal aid.",
      },
    ],
    questionPolicy:
      "Questions are submitted in writing and read by a moderator. They are answered as general legal education — the session cannot advise on anyone's individual case, and personal details should not be sent in.",
    registration:
      "Free and open. No registration is required to watch; a reminder can be set from this page once accounts arrive.",
    archivePolicy:
      "The recording becomes an on-demand page at this same address when the session ends, with chapters and a written record of what was covered.",
    chapters: [
      {
        id: "md-live-ch1",
        startSeconds: 0,
        title: "Opening briefing",
        summary: "The rights engaged in an encounter with law enforcement.",
      },
      {
        id: "md-live-ch2",
        startSeconds: 900,
        title: "Stops and searches",
        summary: "What is protected, and what cooperation does not give away.",
      },
      {
        id: "md-live-ch3",
        startSeconds: 2400,
        title: "Arrest and detention",
        summary: "The protections that attach once someone is detained.",
      },
      {
        id: "md-live-ch4",
        startSeconds: 3600,
        title: "Moderated questions",
        summary: "Audience questions, answered in general terms.",
      },
    ],
    transcript: { status: "in-progress", cues: [] },
    related: {
      rights: ["police-stop", "arrest-and-detention", "bail"],
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      media: ["police-stop-what-to-do"],
    },
    meta: mediaMeta({
      label:
        "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
    }),
  },
  {
    id: "md-live-2",
    slug: "hiring-your-first-employee",
    kind: "live",
    format: "live-session",
    title: "Hiring your first employee: an open clinic",
    description:
      "A session for founders on what changes the moment someone works for you — contracts, records, and the obligations that arrive with the first hire.",
    series: "Know Your Rights Live",
    seriesSlug: "know-your-rights-live",
    host: "Law Awareness TV",
    publishedAt: "2026-09-05",
    liveStatus: "scheduled",
    scheduledFor: "2026-09-15T18:00:00+01:00",
    topics: ["Employment", "Business"],
    takeaways: [
      "What a written contract has to settle before day one.",
      "The records an employer is expected to keep.",
      "Where the Labour Act sits alongside what you agree.",
    ],
    contributors: [
      desk(
        "md-live-2-c1",
        "Law Awareness TV — employment desk",
        "Presenter",
        "The desk behind the platform's employment material.",
      ),
    ],
    agenda: [
      {
        id: "md-live-2-a1",
        label: "Opening",
        title: "What changes with the first hire",
        detail: "The obligations that begin when someone starts work.",
      },
      {
        id: "md-live-2-a2",
        label: "Main session",
        title: "Contract, records and payroll habits",
        detail:
          "What goes in writing, what gets kept, and what tends to be forgotten.",
      },
      {
        id: "md-live-2-a3",
        label: "Questions",
        title: "Moderated audience questions",
        detail:
          "General answers only; no individual employment matter is advised on.",
      },
    ],
    questionPolicy:
      "Questions are submitted in writing and moderated. Answers are general legal education and never advice on a specific dispute.",
    registration:
      "Free and open. The session appears on this page when it begins — no registration is required to watch.",
    archivePolicy:
      "This page becomes the on-demand recording after the session, with chapters and a written record of what was covered.",
    chapters: [],
    transcript: { status: "unavailable", cues: [] },
    related: {
      guides: ["before-hiring-an-employee"],
      laws: ["employment-contracts-and-termination"],
      compliance: ["employment-and-payroll"],
      contracts: ["employment-agreement"],
    },
    meta: mediaMeta({ label: "Labour Act" }),
  },
  {
    id: "md-live-3",
    slug: "cama-2020-what-changed",
    kind: "live",
    format: "live-session",
    title: "CAMA 2020: what actually changed for small companies",
    description:
      "The archived session on company law reform — single-member companies, filing habits, and the duties that come with registration.",
    duration: "1 hr 12 min",
    series: "Know Your Rights Live",
    seriesSlug: "know-your-rights-live",
    host: "Law Awareness TV",
    publishedAt: "2026-08-25",
    liveStatus: "ended",
    scheduledFor: "2026-08-25T18:00:00+01:00",
    topics: ["Business", "Company law"],
    takeaways: [
      "What the reform changed for a founder working alone.",
      "Why the platform publishes no filing dates.",
      "The duties that attach to a director from day one.",
    ],
    contributors: [
      desk(
        "md-live-3-c1",
        "Law Awareness TV — business desk",
        "Presenter",
        "The desk that maintains the Business & Enterprise section.",
      ),
    ],
    agenda: [
      {
        id: "md-live-3-a1",
        label: "Opening",
        title: "The shape of the reform",
        detail:
          "What the Companies and Allied Matters Act 2020 set out to change.",
      },
      {
        id: "md-live-3-a2",
        label: "Main session",
        title: "Registration, filings and duties",
        detail: "The obligations a company carries once it exists.",
      },
      {
        id: "md-live-3-a3",
        label: "Questions",
        title: "Moderated audience questions",
        detail: "Questions on structure, ownership and record-keeping.",
      },
    ],
    questionPolicy:
      "Questions were submitted in writing and moderated. Answers were general legal education, not advice on any individual company.",
    registration:
      "This session has ended. The recording is available on this page.",
    archivePolicy:
      "Archived. The chapters and written record below are the permanent version of the session.",
    chapters: [
      {
        id: "md-live-3-ch1",
        startSeconds: 0,
        title: "The shape of the reform",
        summary: "What CAMA 2020 set out to change, in general terms.",
      },
      {
        id: "md-live-3-ch2",
        startSeconds: 1100,
        title: "Registration and what follows it",
        summary: "The ongoing obligations that begin at registration.",
      },
      {
        id: "md-live-3-ch3",
        startSeconds: 2900,
        title: "Directors' duties",
        summary:
          "Acting in the company's interest, and keeping affairs separate.",
      },
      {
        id: "md-live-3-ch4",
        startSeconds: 3800,
        title: "Moderated questions",
        summary: "Audience questions on structure, ownership and records.",
      },
    ],
    transcript: {
      status: "published",
      cues: [
        {
          id: "md-live-3-t1",
          startSeconds: 0,
          speaker: "Presenter",
          text: "The session opened on what the Companies and Allied Matters Act 2020 was aimed at, described in general terms.",
        },
        {
          id: "md-live-3-t2",
          startSeconds: 1100,
          speaker: "Presenter",
          text: "It covered registration as the beginning of an ongoing obligation, and explained why no filing dates are published here.",
        },
        {
          id: "md-live-3-t3",
          startSeconds: 2900,
          speaker: "Presenter",
          text: "It set out directors' duties and the separation of company and personal affairs.",
        },
        {
          id: "md-live-3-t4",
          startSeconds: 3800,
          speaker: "Moderator",
          text: "Audience questions were read and answered generally, covering structure, ownership and record-keeping.",
        },
      ],
    },
    related: {
      laws: ["registering-a-company", "directors-duties"],
      media: ["what-cama-changed"],
      compliance: ["business-structure-and-registration"],
      updates: ["cama-2020-company-law-reform"],
    },
    meta: mediaMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
];

/* -------------------------------------------------------------------------- */
/* Back-compatible projection                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The card-sized view every pre-Phase-4 importer already reads, including the
 * homepage and the CMS. `MediaDetail` extends `MediaItem`, so this is a
 * widening of the same records rather than a second copy of the data.
 */
export const mediaItems: MediaItem[] = [...videos, ...podcastEpisodes];
