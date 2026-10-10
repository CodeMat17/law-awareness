import type {
  LawEntry,
  RightGuide,
  RightSummary,
  SafetyGuide,
  SafetySeries,
  Taxonomy,
} from "./types";

/**
 * Legal-knowledge seed: law categories, law entries, rights guides, Stay Safe
 * guides and the plain-language glossary.
 *
 * EDITORIAL RULE (same as `./data.ts`): every reference points at a real,
 * well-known Nigerian instrument and is described only in general terms. No
 * statutory wording is reproduced or invented; a `citation` names where the
 * official text lives, and the prose beside it is labelled as our explanation.
 * Section numbers are used only where they are long-settled and unambiguous —
 * otherwise the instrument and the topic are named instead. Nothing here is
 * marked `reviewed`: no human reviewer has signed it off.
 *
 * Split out of `./data.ts` in Phase 2 purely for size; `./data.ts` re-exports
 * what it exported before, so every existing importer is unaffected.
 */

const REVIEWED = "2026-08-14";

const educational = {
  status: "published",
  review: "educational",
  lastReviewed: REVIEWED,
} as const;

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The subject areas of the library. `entryCount` is not stored: the repository
 * derives it from the published entries, so a count can never overstate what
 * has actually been written.
 */
export const lawCategoryDefs: Taxonomy[] = [
  { slug: "constitution", name: "The Constitution", blurb: "The supreme law and the rights it guarantees", icon: "landmark" },
  { slug: "human-rights", name: "Human Rights", blurb: "Your basic rights, and how to defend them", icon: "scale" },
  { slug: "criminal-law", name: "Criminal Law", blurb: "Crimes, arrests and how criminal cases run", icon: "gavel" },
  { slug: "civil-law", name: "Civil Law", blurb: "Disputes between people and businesses", icon: "file-text" },
  { slug: "employment", name: "Employment & Labour", blurb: "Contracts, wages, termination, workplace duties", icon: "hard-hat" },
  { slug: "business-corporate", name: "Business & Corporate", blurb: "Registering and running a company", icon: "building-2" },
  { slug: "land-and-property", name: "Land & Property", blurb: "Owning land, renting and property papers", icon: "map" },
  { slug: "consumer-protection", name: "Consumer Protection", blurb: "Your rights when you buy things", icon: "shopping-bag" },
  { slug: "digital", name: "Cybercrime & Digital Rights", blurb: "Staying safe and within the law online", icon: "wifi" },
  { slug: "data-protection", name: "Data Protection", blurb: "How your personal information must be handled", icon: "database" },
  { slug: "family-law", name: "Family Law", blurb: "Marriage, children and inheritance", icon: "heart" },
  { slug: "court-process", name: "Court & Legal Process", blurb: "How courts work and what to expect", icon: "book-open" },
  { slug: "police-and-law-enforcement", name: "Police & Law Enforcement", blurb: "Powers, limits and everyday encounters", icon: "siren" },
  { slug: "traffic", name: "Traffic & Road Safety", blurb: "Driving, documents and road-side stops", icon: "car" },
  { slug: "immigration", name: "Immigration", blurb: "Visas, permits and travel documents", icon: "badge-check" },
  { slug: "tax", name: "Tax", blurb: "What tax you owe and how to pay it", icon: "receipt" },
  { slug: "financial", name: "Financial Law", blurb: "Banking, lending, payments and consumer finance", icon: "banknote" },
  { slug: "electoral", name: "Electoral Law", blurb: "Registration, voting and election conduct", icon: "users" },
  { slug: "environmental", name: "Environmental Law", blurb: "Pollution, land use and community impact", icon: "umbrella" },
  { slug: "education", name: "Education", blurb: "Rights and duties in schools", icon: "graduation-cap" },
  { slug: "public-health", name: "Public Health", blurb: "Health, safety and the public", icon: "shield-check" },
  { slug: "intellectual-property", name: "Intellectual Property", blurb: "Copyright Act 2022, trade marks and brands", icon: "lightbulb" },
];

/* -------------------------------------------------------------------------- */
/* Law entries                                                                 */
/* -------------------------------------------------------------------------- */

export const lawEntries: LawEntry[] = [
  {
    id: "lw-1",
    slug: "fundamental-rights-chapter-iv",
    category: "constitution",
    title: "Fundamental rights under Chapter IV",
    instrument:
      "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
    summary:
      "Chapter IV sets out the rights every person in Nigeria holds — life, dignity, liberty, fair hearing, privacy, expression, assembly, movement, freedom from discrimination and property — together with the route to enforce them.",
    covers: [
      "The rights guaranteed to every person in Nigeria",
      "The limits the Constitution itself places on those rights",
      "Who the rights are held against, and how a court is asked to protect them",
    ],
    affects: [
      "Every person in Nigeria, citizen or not",
      "Government bodies, security agencies and public officers",
      "Private organisations, in the ways the courts have recognised",
    ],
    explanation: [
      "The Constitution is the supreme law: where any other law is inconsistent with it, the Constitution prevails. Chapter IV is the part that speaks directly to individuals, listing the rights the state must respect and that a court can be asked to protect.",
      "These rights are not absolute. The Constitution qualifies several of them in their own wording — permitting, for example, deprivation of liberty in defined circumstances such as a lawful arrest. The qualification is part of the right, not an exception invented afterwards.",
      "Chapter IV also creates the route to enforcement. A person who says a right has been, is being, or is likely to be contravened may apply to a High Court in the state where it happened. The Fundamental Rights (Enforcement Procedure) Rules govern how that application is made, and are designed to be faster and less formal than an ordinary civil claim.",
    ],
    provisions: [
      {
        id: "pv-1a",
        heading: "Right to dignity of the human person",
        citation: "Constitution 1999 (as amended), s. 34",
        plainLanguage:
          "No one may be subjected to torture or to inhuman or degrading treatment, held in slavery or servitude, or required to perform forced labour. It is the provision most often relied on where a person is beaten, humiliated or coerced in custody.",
      },
      {
        id: "pv-1b",
        heading: "Right to personal liberty",
        citation: "Constitution 1999 (as amended), s. 35",
        plainLanguage:
          "Personal liberty may only be taken away in the circumstances the section itself lists and by a procedure the law permits. It also requires that a person be told the reason for their arrest and be brought before a court within the time the section allows.",
      },
      {
        id: "pv-1c",
        heading: "Right to fair hearing",
        citation: "Constitution 1999 (as amended), s. 36",
        plainLanguage:
          "A person facing a criminal charge, or a determination of their civil rights and obligations, is entitled to a fair hearing within a reasonable time by an independent and impartial court or tribunal — including the presumption of innocence in a criminal case.",
      },
      {
        id: "pv-1d",
        heading: "Enforcement",
        citation: "Constitution 1999 (as amended), s. 46",
        plainLanguage:
          "A person who says a Chapter IV right has been or is likely to be breached may apply to a High Court in the state where the breach occurred or is threatened. This is the doorway to the fundamental rights procedure.",
      },
    ],
    examples: [
      {
        situation:
          "A person is held at a station for days without being told why, and without being taken before a court.",
        outcome:
          "The complaint engages the liberty provision directly: being told the reason for an arrest, and the time limits for producing a person before a court, are part of the right itself, not a courtesy.",
      },
      {
        situation:
          "A state agency demands a person hand over their phone and unlock it, with no warrant and no explanation.",
        outcome:
          "Privacy under the Constitution is engaged, and duties under the Nigeria Data Protection Act 2023 may be too. The lawful basis for the demand is the question a lawyer will start from.",
      },
    ],
    shouldDo: [
      "Read the section that actually covers your situation rather than a summary of it",
      "Record dates, times, names and locations while the details are fresh",
      "Keep every document you are given — a bail form, a charge sheet, a receipt for seized property",
      "Ask a qualified lawyer about the fundamental rights procedure if you believe a right has been breached",
    ],
    shouldNotDo: [
      "Assume a right is absolute; several are qualified in their own wording",
      "Rely on a summary — including this one — as the text of the Constitution",
      "Sign a statement you have not read or do not understand",
      "Delay: time makes evidence harder to gather and can affect what a court can do",
    ],
    misconceptions: [
      {
        myth: "Fundamental rights only protect Nigerian citizens.",
        reality:
          "Chapter IV speaks of every person in Nigeria for most of the rights it guarantees. A few provisions elsewhere in the Constitution are expressly limited to citizens.",
      },
      {
        myth: "If a right is breached, the system corrects it automatically.",
        reality:
          "Enforcement is something a person or their lawyer starts in court. The Constitution provides the right and the route; it does not act on its own.",
      },
    ],
    whenToSeeALawyer: [
      "Someone is in custody now, or the reason for their detention is unclear",
      "You are considering a fundamental rights application",
      "A public body refuses to reverse a decision affecting your liberty, property or livelihood",
    ],
    amendmentNote:
      "The 1999 Constitution has been amended several times. Read the consolidated text as amended, and check the amendment status of any section you rely on.",
    related: {
      rights: ["arrest-and-detention", "fair-hearing", "privacy"],
      laws: ["enforcing-fundamental-rights", "how-a-criminal-case-moves"],
      media: ["fair-hearing-explained", "police-stop-what-to-do"],
      problems: ["police-stopped-or-questioned-me"],
      referrals: ["national-human-rights-commission"],
    },
    meta: {
      ...educational,
      source: {
        label:
          "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
        citation: "Chapter IV, sections 33 to 46",
      },
    },
  },
  {
    id: "lw-2",
    slug: "enforcing-fundamental-rights",
    category: "human-rights",
    title: "How fundamental rights are enforced",
    instrument: "Fundamental Rights (Enforcement Procedure) Rules",
    summary:
      "Chapter IV rights have their own court procedure, deliberately simpler than an ordinary civil claim. Understanding its shape tells you what a lawyer will need from you, and how quickly.",
    covers: [
      "The application a person makes when a Chapter IV right is in issue",
      "Which court hears it and where it is filed",
      "What the court can be asked to order",
    ],
    affects: [
      "Anyone whose liberty, dignity, privacy or other Chapter IV right is in issue",
      "Relatives acting for a person who is in custody",
      "Public bodies and officers named as respondents",
    ],
    explanation: [
      "Ordinary civil litigation is deliberate and slow: pleadings, discovery, trial. Rights cases often cannot wait, so the Constitution and the Rules made under it provide a separate, streamlined route to a High Court.",
      "In practice the application is built on written evidence — a statement of the facts supported by affidavit, the grounds relied on, and the specific orders sought. That is why contemporaneous notes, names, dates and documents matter so much: the case is largely made on paper.",
      "The Rules are protective of access. They encourage courts to hear rights cases without undue technicality, and they contemplate an application brought on behalf of someone who cannot come to court themselves — which is what makes them usable when a person is detained.",
    ],
    provisions: [
      {
        id: "pv-2a",
        heading: "Where the application goes",
        citation: "Constitution 1999 (as amended), s. 46",
        plainLanguage:
          "A High Court in the state where the breach happened, or is threatened, has jurisdiction to hear the application.",
      },
      {
        id: "pv-2b",
        heading: "How the case is presented",
        citation:
          "Fundamental Rights (Enforcement Procedure) Rules — form of application",
        plainLanguage:
          "The application sets out the facts on affidavit, the grounds relied on, and the orders asked for, with written argument alongside.",
      },
      {
        id: "pv-2c",
        heading: "Who may apply",
        citation: "Fundamental Rights (Enforcement Procedure) Rules — standing",
        plainLanguage:
          "The Rules take a broad view of who may bring an application, including a person acting on behalf of someone unable to act for themselves.",
      },
    ],
    examples: [
      {
        situation:
          "A family cannot get information about a relative taken into custody two days ago.",
        outcome:
          "This is the classic setting for an urgent application about liberty, brought by the family rather than by the detained person.",
      },
      {
        situation:
          "An organisation publishes a person's personal information with no lawful basis.",
        outcome:
          "Constitutional privacy and duties under the Nigeria Data Protection Act 2023 may both be engaged; a lawyer will advise which route fits the facts.",
      },
    ],
    shouldDo: [
      "Write down what happened as soon as possible, with times and names",
      "Gather documents: any charge sheet, receipt, letter, medical report or photograph",
      "Identify witnesses while they can still be found",
      "Speak to a qualified lawyer early — urgency is the point of this procedure",
    ],
    shouldNotDo: [
      "Wait to see whether the situation resolves itself before recording the facts",
      "Publish details of a live matter without advice",
      "Assume a complaint to the same body that acted replaces court process",
    ],
    misconceptions: [
      {
        myth: "A rights case is just a claim for damages.",
        reality:
          "It is its own procedure with its own rules. Compensation may be sought within it, but the route and the emphasis are different.",
      },
      {
        myth: "Only the person affected can apply.",
        reality:
          "The Rules contemplate applications made on behalf of someone who cannot come to court — which matters when a person is detained.",
      },
    ],
    whenToSeeALawyer: [
      "Immediately, where anyone is currently detained",
      "Before filing anything, so the right respondents and orders are identified",
      "Where a public body has answered a complaint and you disagree with the answer",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves"],
      rights: ["arrest-and-detention", "bail"],
      problems: ["someone-is-being-held-at-a-station"],
      referrals: ["national-human-rights-commission"],
    },
    meta: {
      ...educational,
      source: {
        label: "Fundamental Rights (Enforcement Procedure) Rules",
        citation: "Made under the Constitution 1999 (as amended), s. 46",
      },
    },
  },
  {
    id: "lw-3",
    slug: "how-a-criminal-case-moves",
    category: "criminal-law",
    title: "How a criminal case moves",
    instrument: "Administration of Criminal Justice Act 2015",
    summary:
      "From arrest to arraignment to trial, the ACJA 2015 sets out the procedure federal criminal cases follow — and many states have enacted administration of criminal justice laws along the same lines.",
    covers: [
      "Arrest, and the record-keeping that must accompany it",
      "Arraignment, plea and the shape of a trial",
      "Bail as part of procedure rather than as a favour",
    ],
    affects: [
      "Anyone arrested, charged or standing trial",
      "Families and employers of a person in the system",
      "Police, prosecutors and courts",
    ],
    explanation: [
      "The ACJA 2015 was enacted to make criminal procedure faster, more humane and more accountable. Its themes recur throughout: an arrest should be recorded, a suspect should know why they are held, and a case should not drift indefinitely.",
      "A criminal case moves in recognisable stages. A person is arrested and a record is made. A charge is filed. The person is arraigned and takes a plea. If the plea is not guilty the matter goes to trial, evidence is called, and the court decides. Bail questions arise early and can be revisited.",
      "States legislate their own criminal procedure for state offences, and many have adopted administration of criminal justice laws modelled on the federal Act. Which law governs your matter depends on the offence and the court — exactly the sort of question to put to a lawyer.",
    ],
    provisions: [
      {
        id: "pv-3a",
        heading: "Humane treatment on arrest",
        citation:
          "Administration of Criminal Justice Act 2015 — arrest provisions",
        plainLanguage:
          "The Act carries the constitutional standard into everyday procedure: a person under arrest is to be treated humanely and not subjected to torture or degrading treatment.",
      },
      {
        id: "pv-3b",
        heading: "Recording of arrests",
        citation:
          "Administration of Criminal Justice Act 2015 — records of arrest",
        plainLanguage:
          "Arrests are to be recorded. That record is what later makes it possible to establish when a person was taken and where they were held.",
      },
      {
        id: "pv-3c",
        heading: "Day-to-day trial",
        citation:
          "Administration of Criminal Justice Act 2015 — conduct of trial",
        plainLanguage:
          "The Act pushes towards continuous hearing of cases and limits the pattern of repeated adjournments that once allowed trials to run for years.",
      },
    ],
    examples: [
      {
        situation: "A person is arrested on a Friday evening.",
        outcome:
          "The constitutional time limits for producing a person before a court, and the Act's provisions on records and treatment, are the framework a lawyer works within from that hour.",
      },
      {
        situation: "A trial has been adjourned repeatedly over two years.",
        outcome:
          "Delay is what the Act sets out to reduce, and the fair-hearing guarantee speaks of a hearing within a reasonable time.",
      },
    ],
    shouldDo: [
      "Ask for the reason for the arrest, and note the station and the officers involved",
      "Tell a family member or lawyer where you are being held",
      "Read anything before signing it, and keep a copy of what you sign",
      "Attend every court date; absence creates problems of its own",
    ],
    shouldNotDo: [
      "Treat a police station as the place to argue the merits of the allegation",
      "Pay anyone informally to make a case disappear",
      "Assume bail is a purchase rather than a conditional release",
      "Discuss a live case publicly",
    ],
    misconceptions: [
      {
        myth: "Being charged means being guilty.",
        reality:
          "The Constitution guarantees the presumption of innocence until guilt is proved. A charge is an allegation to be tried.",
      },
      {
        myth: "Bail always has to be paid for.",
        reality:
          "Bail is a conditional release ordered by an authorised officer or a court. Conditions vary; treating it as a purchase misunderstands it.",
      },
    ],
    whenToSeeALawyer: [
      "As soon as an arrest happens — not after a statement has been written",
      "Before entering a plea",
      "Whenever a trial is stalling, or bail conditions are unworkable",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      rights: ["arrest-and-detention", "bail", "fair-hearing", "police-stop"],
      media: ["inside-the-court-process"],
      problems: ["i-have-been-charged-with-an-offence", "i-have-been-served-with-court-papers"],
      referrals: ["legal-aid-council"],
    },
    meta: {
      ...educational,
      source: {
        label: "Administration of Criminal Justice Act 2015",
        citation: "Read alongside Constitution 1999 (as amended), ss. 35 and 36",
      },
    },
  },
  {
    id: "lw-4",
    slug: "employment-contracts-and-termination",
    category: "employment",
    title: "Employment contracts and termination",
    instrument: "Labour Act, Cap L1 LFN 2004",
    summary:
      "Three documents usually govern a working relationship: the written contract, the Labour Act where it applies, and the employer's policies. Knowing which answers which question prevents most workplace disputes.",
    covers: [
      "What a written statement of employment terms is for",
      "Notice, wages and the ending of a contract",
      "Which workers the Labour Act itself covers",
    ],
    affects: [
      "Employees and workers across sectors",
      "Employers of any size, including small businesses",
      "HR and operations teams writing contracts and handbooks",
    ],
    explanation: [
      "The Labour Act is directed principally at workers engaged in manual labour or clerical work. Employees outside that description are largely governed by their contract, by any applicable sectoral rules, and by the decisions of the National Industrial Court. This is why two people in the same office can have quite different legal positions.",
      "Whatever the category, the contract is the centre of gravity. It should record the parties, the role, remuneration, working hours, leave, notice and the grounds on which the relationship can end. Where the contract is silent, the surrounding law and practice fill the gap — and that is where disputes begin.",
      "Termination and dismissal are not the same conversation. Termination follows the contract's own notice machinery; dismissal for misconduct raises questions of process and fairness, and the National Industrial Court has developed the standards that apply. Getting the process right matters as much as having a reason.",
    ],
    provisions: [
      {
        id: "pv-4a",
        heading: "Written statement of terms",
        citation: "Labour Act, Cap L1 LFN 2004 — contract of employment",
        plainLanguage:
          "The Act requires that a worker be given a written statement of the particulars of their employment within the period it specifies.",
      },
      {
        id: "pv-4b",
        heading: "Notice on termination",
        citation: "Labour Act, Cap L1 LFN 2004 — termination provisions",
        plainLanguage:
          "The Act sets minimum notice periods that scale with length of service, and contemplates payment in lieu of notice.",
      },
      {
        id: "pv-4c",
        heading: "Wages",
        citation: "Labour Act, Cap L1 LFN 2004 — payment of wages",
        plainLanguage:
          "Wages are to be paid in legal tender, and the Act restricts the deductions an employer may make.",
      },
      {
        id: "pv-4d",
        heading: "Where disputes are heard",
        citation:
          "Constitution 1999 (as amended), s. 254C — National Industrial Court jurisdiction",
        plainLanguage:
          "Employment and labour disputes fall within the jurisdiction of the National Industrial Court, which is why its decisions shape this area so strongly.",
      },
    ],
    examples: [
      {
        situation:
          "An employee is told not to return, with no letter and no notice.",
        outcome:
          "The first questions are what the contract says about notice, what actually happened, and whether the ending is characterised as termination or dismissal.",
      },
      {
        situation:
          "A company deducts the cost of damaged equipment from a salary without agreement.",
        outcome:
          "Restrictions on deductions and the terms of the contract both come into play before anything is taken from a wage.",
      },
    ],
    shouldDo: [
      "Get the terms in writing before starting work, and keep your copy",
      "Read the notice clause before you need it",
      "Keep payslips, letters and appraisals in one place",
      "Follow the internal process fully, in writing, before escalating",
    ],
    shouldNotDo: [
      "Rely on a verbal promise that is not reflected in the contract",
      "Sign a resignation or settlement under pressure without advice",
      "Assume every employee is covered by the Labour Act in the same way",
      "Let a grievance sit unrecorded for months",
    ],
    misconceptions: [
      {
        myth: "A probation period means no rights at all.",
        reality:
          "The contract still governs the relationship during probation, including whatever notice it provides for.",
      },
      {
        myth: "An employer can dismiss for misconduct without any process.",
        reality:
          "Where misconduct is alleged, the fairness of the process is itself part of the question the National Industrial Court examines.",
      },
    ],
    whenToSeeALawyer: [
      "Before signing a settlement, release or resignation drafted by the employer",
      "Where a dismissal is alleged to be for misconduct",
      "When drafting or reviewing contracts and handbooks for a growing team",
    ],
    related: {
      rights: ["at-work"],
      laws: ["registering-a-company"],
      safety: ["employment-offer"],
      guides: ["before-hiring-an-employee"],
    },
    meta: {
      ...educational,
      source: {
        label: "Labour Act, Cap L1 LFN 2004",
        citation:
          "Read alongside Constitution 1999 (as amended), s. 254C and National Industrial Court practice",
      },
    },
  },
  {
    id: "lw-5",
    slug: "registering-a-company",
    category: "business-corporate",
    title: "Registering a business under CAMA 2020",
    instrument: "Companies and Allied Matters Act 2020",
    summary:
      "CAMA 2020 is the framework for business names, private and public companies, limited partnerships and incorporated trustees — and for the filings that keep a registered entity in good standing.",
    covers: [
      "The vehicles available: business name, company, partnership, incorporated trustees",
      "Registration with the Corporate Affairs Commission",
      "The ongoing filing obligations that follow registration",
    ],
    affects: [
      "Founders and sole traders choosing a structure",
      "Directors, shareholders and company secretaries",
      "Not-for-profits registering as incorporated trustees",
    ],
    explanation: [
      "CAMA 2020 replaced the previous companies legislation and modernised several things founders feel immediately: a private company may be formed with a single member, small companies are relieved of some obligations that once applied to everyone, and electronic filing and meetings are recognised.",
      "Choosing a structure is a legal decision with commercial consequences. A business name is simple to register but is not a separate legal person; a limited company is separate from its owners, which is what makes limited liability meaningful. That separation is also what imposes duties on directors.",
      "Registration is the beginning, not the end. Annual returns, register maintenance, filings on changes of directors or address, and — since the Act's beneficial ownership provisions — disclosure of persons with significant control are continuing obligations of the entity.",
    ],
    provisions: [
      {
        id: "pv-5a",
        heading: "The Corporate Affairs Commission",
        citation:
          "Companies and Allied Matters Act 2020 — establishment and functions of the Commission",
        plainLanguage:
          "The Act continues the Commission as the body that registers and regulates companies, business names and incorporated trustees.",
      },
      {
        id: "pv-5b",
        heading: "One-member private company",
        citation:
          "Companies and Allied Matters Act 2020 — formation of a private company",
        plainLanguage:
          "A private company may be formed by a single person, which removed the old need to find a second name for a solo business.",
      },
      {
        id: "pv-5c",
        heading: "Beneficial ownership",
        citation:
          "Companies and Allied Matters Act 2020 — persons with significant control",
        plainLanguage:
          "Companies are required to disclose the people who ultimately own or control them, and to keep that information current.",
      },
      {
        id: "pv-5d",
        heading: "Annual returns",
        citation: "Companies and Allied Matters Act 2020 — annual returns",
        plainLanguage:
          "A registered entity files annual returns. Persistent failure to file is what leads to a company being treated as inactive.",
      },
    ],
    examples: [
      {
        situation:
          "Two founders trade for a year under a business name and then take on an investor.",
        outcome:
          "The investment usually forces the structure question, because a business name has no shares to issue and no separate legal personality.",
      },
      {
        situation:
          "A company has not filed returns for several years and now needs a bank facility.",
        outcome:
          "Standing at the Commission becomes a live commercial problem well before anyone sues about it.",
      },
    ],
    shouldDo: [
      "Choose the structure against your three-year plan, not just today's cost",
      "Keep the statutory registers and records from day one",
      "Diarise annual filings and treat them as operational, not optional",
      "Put shareholder arrangements in writing before there is money to argue about",
    ],
    shouldNotDo: [
      "Mix personal and company money and expect the separation to hold",
      "Leave beneficial ownership details out of date",
      "Assume registration alone creates a licence to operate in a regulated sector",
      "Use a template constitution without reading what it does",
    ],
    misconceptions: [
      {
        myth: "A registered business name gives limited liability.",
        reality:
          "A business name is a registration, not a separate legal person. The owner remains personally exposed.",
      },
      {
        myth: "A company only needs to deal with the Commission once.",
        reality:
          "Filings continue for the life of the entity, and lapses are visible to banks, partners and counterparties.",
      },
    ],
    whenToSeeALawyer: [
      "Before bringing in a co-founder, investor or silent partner",
      "When operating in a licensed or regulated sector",
      "When restructuring, converting or winding down an entity",
    ],
    related: {
      laws: ["directors-duties", "employment-contracts-and-termination"],
      guides: ["before-entering-a-partnership", "before-hiring-an-employee"],
      safety: ["business-partnership"],
      media: ["what-cama-changed", "cama-2020-what-changed"],
    },
    meta: {
      ...educational,
      source: {
        label: "Companies and Allied Matters Act 2020",
        citation: "Administered by the Corporate Affairs Commission",
      },
    },
  },
  {
    id: "lw-6",
    slug: "directors-duties",
    category: "business-corporate",
    title: "What the law expects of a director",
    instrument: "Companies and Allied Matters Act 2020",
    summary:
      "A directorship is a legal office, not a title. CAMA 2020 attaches duties of good faith, care and skill to it, and those duties are owed to the company itself.",
    covers: [
      "Who counts as a director, including in substance rather than name",
      "The duties attached to the office",
      "Conflicts of interest and personal exposure",
    ],
    affects: [
      "Executive and non-executive directors",
      "Founders who never think of themselves as officers",
      "Shareholders relying on the board",
    ],
    explanation: [
      "Directors act for the company. The duties CAMA 2020 imposes — to act in good faith in what they believe to be the best interests of the company, to exercise reasonable care, skill and diligence, and to avoid improper personal benefit — are owed to the company as a legal person, not to any one shareholder.",
      "Duties can attach by conduct. A person who is not formally appointed but who in substance directs the company may still be treated as a director, and someone on whose instructions the board acts may fall within the Act's definitions. Titles do not settle the question.",
      "Conflicts are managed by disclosure, not silence. Where a director has an interest in a transaction the company is considering, the Act's machinery is declaration and proper authorisation — and companies that document this well are the ones that survive a fallout intact.",
    ],
    provisions: [
      {
        id: "pv-6a",
        heading: "Duties of directors",
        citation:
          "Companies and Allied Matters Act 2020 — general duties of directors",
        plainLanguage:
          "Directors must act in good faith in the company's best interests, and exercise the care, skill and diligence expected of a person in that position.",
      },
      {
        id: "pv-6b",
        heading: "Conflicts of interest",
        citation:
          "Companies and Allied Matters Act 2020 — disclosure of interest in contracts",
        plainLanguage:
          "A director with an interest in a transaction involving the company is required to declare it, and the company deals with it through its proper processes.",
      },
      {
        id: "pv-6c",
        heading: "Who is a director",
        citation: "Companies and Allied Matters Act 2020 — meaning of director",
        plainLanguage:
          "The Act looks at substance. People who act as directors, or on whose directions a board acts, can be treated as directors even without a formal appointment.",
      },
    ],
    examples: [
      {
        situation:
          "A director awards a supply contract to a company owned by a family member without telling the board.",
        outcome:
          "The failure to disclose is the problem before the price is even examined; disclosure and authorisation exist precisely for this.",
      },
      {
        situation:
          "A founder resigns as director but continues to instruct the team and set strategy.",
        outcome:
          "Duties can follow the conduct. Stepping back on paper is not the same as stepping back in fact.",
      },
    ],
    shouldDo: [
      "Minute decisions properly, including who declared what interest",
      "Read board papers before the meeting rather than during it",
      "Keep company money, assets and opportunities separate from personal ones",
      "Ask for information when a decision does not make sense",
    ],
    shouldNotDo: [
      "Sign resolutions you have not read",
      "Take a corporate opportunity personally without authorisation",
      "Treat a non-executive seat as ceremonial",
      "Assume insurance removes personal responsibility",
    ],
    misconceptions: [
      {
        myth: "Only the managing director carries duties.",
        reality:
          "The duties attach to the office of director. Non-executive and part-time directors are within them.",
      },
      {
        myth: "A company owning everything means directors face nothing personally.",
        reality:
          "Limited liability protects shareholders' investment; it does not neutralise duties owed by directors to the company.",
      },
    ],
    whenToSeeALawyer: [
      "Before approving a related-party transaction",
      "Where the company is approaching insolvency",
      "When a shareholder or regulator has raised a question about board conduct",
    ],
    related: {
      laws: ["registering-a-company"],
      guides: ["before-entering-a-partnership"],
      safety: ["business-partnership"],
    },
    meta: {
      ...educational,
      source: {
        label: "Companies and Allied Matters Act 2020",
        citation: "Duties of directors",
      },
    },
  },
  {
    id: "lw-7",
    slug: "land-use-act-and-title",
    category: "land-and-property",
    title: "Land, title and the Land Use Act",
    instrument: "Land Use Act 1978",
    summary:
      "The Land Use Act reshaped how land is held in Nigeria. What a buyer acquires is a right of occupancy, and the Governor's consent sits at the centre of most transfers.",
    covers: [
      "How land is held, and what a right of occupancy means",
      "Certificates of occupancy and the documents that support title",
      "Consent to transfer, and why transactions fail without it",
    ],
    affects: [
      "Anyone buying, selling, leasing or inheriting land",
      "Developers and businesses acquiring sites",
      "Families dealing with community or family land",
    ],
    explanation: [
      "The Act vests land in each state in the Governor, to be held in trust and administered for the use and common benefit of all Nigerians. What an individual holds is a right of occupancy rather than absolute ownership in the older sense.",
      "Title is proved by a chain of documents, not by a single certificate. A certificate of occupancy is important evidence, but a search at the appropriate registry, a survey plan, the history of previous transfers and the physical position on the ground all matter. Two documents can look equally impressive and only one can be good.",
      "Alienation — selling, transferring, mortgaging or otherwise dealing with a right of occupancy — generally requires the Governor's consent. Transactions completed without it are a recurring source of loss, and the problem usually surfaces years later when the buyer tries to sell or to raise finance.",
    ],
    provisions: [
      {
        id: "pv-7a",
        heading: "Land vested in the Governor",
        citation: "Land Use Act 1978, s. 1",
        plainLanguage:
          "Land in each state is vested in the Governor, held in trust and administered for the use and common benefit of Nigerians.",
      },
      {
        id: "pv-7b",
        heading: "Consent to alienate",
        citation: "Land Use Act 1978, s. 22",
        plainLanguage:
          "A holder of a statutory right of occupancy generally needs the Governor's consent before transferring, mortgaging or otherwise alienating it.",
      },
      {
        id: "pv-7c",
        heading: "Rights of occupancy",
        citation: "Land Use Act 1978 — statutory and customary rights of occupancy",
        plainLanguage:
          "The Act distinguishes statutory rights of occupancy granted by the Governor from customary rights, and sets out how each is granted and evidenced.",
      },
    ],
    examples: [
      {
        situation:
          "A buyer pays for land on the strength of a photocopied certificate and a receipt.",
        outcome:
          "Neither document establishes a chain of title. A registry search and a proper survey are what test whether the seller can actually convey anything.",
      },
      {
        situation:
          "Family land is sold by one member without the agreement of the wider family.",
        outcome:
          "Who had authority to sell becomes the whole case, and it is a question that has to be answered before money moves.",
      },
    ],
    shouldDo: [
      "Search the appropriate land registry before paying anything",
      "Commission an independent survey and confirm the physical location",
      "Establish who has authority to sell, in writing",
      "Budget for consent and registration, and complete them",
    ],
    shouldNotDo: [
      "Pay cash without a receipt and a written agreement",
      "Accept a photocopy as proof of title",
      "Skip consent because the seller says it is not needed",
      "Start building before title and consent are settled",
    ],
    misconceptions: [
      {
        myth: "A certificate of occupancy alone proves good title.",
        reality:
          "It is significant evidence, not conclusive proof. The history behind it, and any competing claim, still matter.",
      },
      {
        myth: "Consent is a formality that can be sorted out later.",
        reality:
          "It is a statutory requirement for alienation, and 'later' is usually the moment a sale or a mortgage collapses.",
      },
    ],
    whenToSeeALawyer: [
      "Before paying any deposit on land",
      "Where land is family, community or inherited land",
      "Where an existing transaction was completed without consent or registration",
    ],
    related: {
      safety: ["buying-property"],
      articles: ["land-use-act-basics"],
      rights: ["fair-hearing"],
    },
    meta: {
      ...educational,
      source: {
        label: "Land Use Act 1978",
        citation: "Sections 1 and 22",
      },
    },
  },
  {
    id: "lw-8",
    slug: "cybercrimes-act",
    category: "digital",
    title: "The Cybercrimes Act and life online",
    instrument:
      "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 (as amended)",
    summary:
      "The Cybercrimes Act is the principal law for offences committed with computers and networks in Nigeria, from fraud and identity theft to unlawful access to systems.",
    covers: [
      "Offences involving computer systems, networks and electronic fraud",
      "Duties placed on service providers and financial institutions",
      "Investigation and prosecution of computer-related offences",
    ],
    affects: [
      "Anyone who uses email, messaging, social media or online banking",
      "Businesses holding customer accounts and payment systems",
      "Service providers and platforms operating in Nigeria",
    ],
    explanation: [
      "The Act creates a framework for offences that older criminal law handled awkwardly: unauthorised access to computer systems, electronic fraud, identity theft, and interference with critical information infrastructure. It also places obligations on institutions to protect systems and to cooperate with lawful investigations.",
      "Everyday exposure is usually on the victim side. Account takeovers, impersonation, payment redirection and phishing are ordinary cybercrime patterns, and the practical response — preserve evidence, report quickly, notify the institution — comes from the way these cases are actually investigated.",
      "The Act has been amended, and some of its provisions touching online speech have been the subject of sustained public debate and litigation. Where speech is involved, this is an area to take advice on rather than to reason about from a summary.",
    ],
    provisions: [
      {
        id: "pv-8a",
        heading: "Unlawful access to a computer system",
        citation:
          "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 — offences against computer systems",
        plainLanguage:
          "Accessing a computer system without authorisation is an offence, and the Act treats access aimed at obtaining data more seriously.",
      },
      {
        id: "pv-8b",
        heading: "Electronic fraud and identity theft",
        citation:
          "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 — fraud and identity offences",
        plainLanguage:
          "Using electronic means to defraud, or assuming another person's identity online, are offences under the Act.",
      },
      {
        id: "pv-8c",
        heading: "Duties of institutions",
        citation:
          "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 — duties of service providers and financial institutions",
        plainLanguage:
          "Institutions carry obligations around securing systems, retaining certain records and assisting lawful investigations.",
      },
    ],
    examples: [
      {
        situation:
          "A supplier's email is compromised and a customer pays an invoice into a substituted account.",
        outcome:
          "This is a recognised electronic-fraud pattern. Speed matters: the bank and the police both need to be told immediately, with the original messages preserved.",
      },
      {
        situation:
          "Someone creates a profile in another person's name to solicit money from their contacts.",
        outcome:
          "Impersonation online is squarely within the Act's identity provisions, and screenshots with URLs and timestamps are the evidence that carries it.",
      },
    ],
    shouldDo: [
      "Preserve original messages, headers, URLs and timestamps before anything is deleted",
      "Report to the institution and the police as early as possible",
      "Verify payment details by a second channel before transferring money",
      "Use strong, unique passwords and two-factor authentication on financial accounts",
    ],
    shouldNotDo: [
      "Confront a suspected fraudster and warn them to clear their tracks",
      "Delete the account or thread that holds your evidence",
      "Send money on the strength of an email alone",
      "Assume a small loss is not worth reporting; patterns are built from reports",
    ],
    misconceptions: [
      {
        myth: "Online fraud is not real theft.",
        reality:
          "The Act treats computer-related fraud as criminal conduct in its own right, with its own offences and penalties.",
      },
      {
        myth: "Nothing can be done once money has left the account.",
        reality:
          "Outcomes vary, but speed of reporting materially affects what the institution and investigators can attempt.",
      },
    ],
    whenToSeeALawyer: [
      "Where you are accused of an offence under the Act",
      "Where a business has suffered a payment-diversion loss",
      "Where the matter involves online speech or publication",
    ],
    amendmentNote:
      "The Act has been amended since 2015. Check the current consolidated text before relying on any specific provision.",
    related: {
      laws: ["nigeria-data-protection-act"],
      safety: ["online-scams"],
      articles: ["cybercrimes-act-everyday"],
      rights: ["privacy"],
    },
    meta: {
      ...educational,
      source: {
        label: "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 (as amended)",
      },
    },
  },
  {
    id: "lw-9",
    slug: "nigeria-data-protection-act",
    category: "data-protection",
    title: "The Nigeria Data Protection Act 2023",
    instrument: "Nigeria Data Protection Act 2023",
    summary:
      "The NDP Act 2023 governs the processing of personal data in Nigeria, establishes the Nigeria Data Protection Commission, and gives people rights over information held about them.",
    covers: [
      "The principles that govern any processing of personal data",
      "Lawful bases for processing, including consent",
      "The rights of data subjects, and the duties of controllers and processors",
    ],
    affects: [
      "Any organisation that collects customer, staff or user data",
      "Individuals whose data is processed",
      "Data controllers and processors of major importance under the Act",
    ],
    explanation: [
      "The Act put data protection on a statutory footing and created the Nigeria Data Protection Commission as regulator. It applies to processing carried out in Nigeria and, in defined circumstances, to processing of data of people in Nigeria from outside it.",
      "Its architecture is principled rather than mechanical. Personal data must be processed lawfully, fairly and transparently, collected for specified purposes, limited to what is necessary, kept accurate, retained no longer than needed, and secured. A business that can answer 'why do we hold this, and for how long' is most of the way there.",
      "Consent is one lawful basis among several — contract, legal obligation, vital interests, public interest and legitimate interests also appear. Choosing the right basis up front is what keeps a privacy notice honest, and the Act gives individuals rights of access, rectification, erasure and objection that a business must be able to service.",
    ],
    provisions: [
      {
        id: "pv-9a",
        heading: "The Commission",
        citation:
          "Nigeria Data Protection Act 2023 — establishment of the Nigeria Data Protection Commission",
        plainLanguage:
          "The Act establishes the Commission as the regulator responsible for data protection in Nigeria.",
      },
      {
        id: "pv-9b",
        heading: "Principles of processing",
        citation: "Nigeria Data Protection Act 2023 — principles",
        plainLanguage:
          "Processing must be lawful, fair and transparent, purpose-limited, adequate and not excessive, accurate, retained only as long as necessary, and appropriately secured.",
      },
      {
        id: "pv-9c",
        heading: "Lawful basis",
        citation: "Nigeria Data Protection Act 2023 — lawful basis for processing",
        plainLanguage:
          "Every act of processing needs a basis in the Act. Consent must be freely given and capable of being withdrawn; it is not the only route, and not always the best one.",
      },
      {
        id: "pv-9d",
        heading: "Rights of data subjects",
        citation: "Nigeria Data Protection Act 2023 — rights of data subjects",
        plainLanguage:
          "People have rights over data about them, including access, correction, deletion in defined circumstances, and objection to certain processing.",
      },
    ],
    examples: [
      {
        situation:
          "A shop collects customers' phone numbers for delivery and later uses them for marketing blasts.",
        outcome:
          "The purpose has changed. Purpose limitation and the basis for the new use are the questions, and a privacy notice written at collection is what answers them.",
      },
      {
        situation:
          "A former customer asks a company to delete everything it holds about them.",
        outcome:
          "The company needs a process: identify what it holds, apply the Act's rights and exceptions, and respond. 'We do not know what we hold' is not an answer.",
      },
    ],
    shouldDo: [
      "Map what personal data you hold, why, and for how long",
      "Publish a privacy notice that matches what you actually do",
      "Choose and record a lawful basis for each processing activity",
      "Have a written route for handling data-subject requests and breaches",
    ],
    shouldNotDo: [
      "Treat consent as a catch-all that fixes every use",
      "Keep data indefinitely because storage is cheap",
      "Share data with a vendor without a written processing arrangement",
      "Ignore a request from a data subject because it is inconvenient",
    ],
    misconceptions: [
      {
        myth: "Data protection only applies to big technology companies.",
        reality:
          "The Act is about processing personal data, not company size. A small business with a customer list is processing personal data.",
      },
      {
        myth: "A privacy policy on the website is compliance.",
        reality:
          "A notice describes the practice. If the practice does not match the notice, the notice is the evidence against you.",
      },
    ],
    whenToSeeALawyer: [
      "Before launching a product that processes sensitive personal data",
      "After a data breach, or where one is suspected",
      "When transferring personal data outside Nigeria",
    ],
    related: {
      laws: ["cybercrimes-act"],
      rights: ["privacy"],
      guides: ["before-collecting-customer-data"],
      articles: ["ndpa-for-small-business"],
      media: ["customer-data-webinar"],
    },
    meta: {
      ...educational,
      source: {
        label: "Nigeria Data Protection Act 2023",
        citation: "Read alongside Constitution 1999 (as amended), s. 37",
      },
    },
  },
  {
    id: "lw-10",
    slug: "consumer-protection-fccpa",
    category: "consumer-protection",
    title: "Consumer protection under the FCCPA 2018",
    instrument: "Federal Competition and Consumer Protection Act 2018",
    summary:
      "The FCCPA 2018 sets out consumer rights, regulates competition, and establishes the Federal Competition and Consumer Protection Commission and a dedicated tribunal.",
    covers: [
      "Consumer rights in ordinary transactions",
      "Unfair, misleading and unconscionable business conduct",
      "The complaint route: supplier, Commission, tribunal",
    ],
    affects: [
      "Every consumer of goods and services in Nigeria",
      "Suppliers, retailers, manufacturers and service providers",
      "Regulated sectors, alongside their own regulators",
    ],
    explanation: [
      "The Act replaced the previous consumer protection framework and widened it considerably. It brings competition regulation and consumer protection into one statute, and creates the Commission as regulator with the Competition and Consumer Protection Tribunal to hear matters arising under it.",
      "For consumers, the Act recognises rights that are easy to state and often ignored in practice: information in plain and understandable language, goods of the quality a reasonable person would expect, and remedies where goods are unsafe or defective. Complaints usually start with the supplier and escalate to the Commission.",
      "For businesses, the exposure is not only in the sale. Misleading representations, unfair terms and conduct the Act treats as unconscionable can attract regulatory attention regardless of what a signed document says.",
    ],
    provisions: [
      {
        id: "pv-10a",
        heading: "The Commission and the Tribunal",
        citation:
          "Federal Competition and Consumer Protection Act 2018 — establishment provisions",
        plainLanguage:
          "The Act establishes the Federal Competition and Consumer Protection Commission and the Competition and Consumer Protection Tribunal.",
      },
      {
        id: "pv-10b",
        heading: "Right to information in plain language",
        citation:
          "Federal Competition and Consumer Protection Act 2018 — consumer rights",
        plainLanguage:
          "Consumers are entitled to information about goods and services in plain and understandable language.",
      },
      {
        id: "pv-10c",
        heading: "Unsafe and defective goods",
        citation:
          "Federal Competition and Consumer Protection Act 2018 — quality and safety of goods",
        plainLanguage:
          "The Act addresses goods that are unsafe or defective and the remedies available where they are supplied.",
      },
    ],
    examples: [
      {
        situation:
          "An appliance fails within days and the seller points to a 'no refund' sign.",
        outcome:
          "A notice on a wall does not settle the question. The Act's provisions on quality and remedies are the framework, and the complaint route runs through the supplier and then the Commission.",
      },
      {
        situation:
          "A service is advertised with terms that only appear after payment.",
        outcome:
          "Disclosure and the plain-language requirement are engaged; representations made before purchase matter.",
      },
    ],
    shouldDo: [
      "Keep receipts, order confirmations and the advertisement you relied on",
      "Complain to the supplier in writing first, and keep a copy",
      "Give a clear description of the defect and the remedy you want",
      "Escalate to the Commission if the supplier will not engage",
    ],
    shouldNotDo: [
      "Accept 'no refund' as the final word without checking the position",
      "Throw away the packaging, receipt or faulty item",
      "Rely on a verbal promise from a salesperson",
      "Let months pass; delay weakens every consumer complaint",
    ],
    misconceptions: [
      {
        myth: "A sign saying goods are sold as seen removes all rights.",
        reality:
          "A supplier's notice cannot simply displace the protections the Act provides.",
      },
      {
        myth: "Consumer complaints have to start in court.",
        reality:
          "The ordinary route is supplier first, then the Commission, with the Tribunal as the specialist forum.",
      },
    ],
    whenToSeeALawyer: [
      "Where the loss is significant or personal injury is involved",
      "Where a business faces a Commission inquiry",
      "Where a contract term is said to exclude protections",
    ],
    related: {
      rights: ["consumer"],
      media: ["consumer-complaint-route"],
    },
    meta: {
      ...educational,
      source: {
        label: "Federal Competition and Consumer Protection Act 2018",
      },
    },
  },
  {
    id: "lw-11",
    slug: "copyright-act-2022",
    category: "intellectual-property",
    title: "Copyright under the Copyright Act 2022",
    instrument: "Copyright Act 2022",
    summary:
      "The Copyright Act 2022 modernised Nigerian copyright law for digital distribution, restating what is protected, who owns it, how long it lasts and what fair dealing allows.",
    covers: [
      "The works copyright protects, and what it does not",
      "Ownership, assignment and licensing",
      "Online infringement and the response the Act provides",
    ],
    affects: [
      "Creators: writers, musicians, film-makers, photographers, developers",
      "Businesses commissioning creative work",
      "Platforms and distributors operating in Nigeria",
    ],
    explanation: [
      "Copyright protects the expression of an idea fixed in a work — literary, musical, artistic, audiovisual, sound recordings and broadcasts — not the idea itself. Protection arises on creation; registration is not what brings the right into existence, though records help enormously in proving it.",
      "Ownership does not always follow the person who made the work. Employment and commissioning arrangements, and any written assignment or licence, decide who holds what. This is why the paperwork on a commissioned logo, photograph or piece of software matters far more than clients expect.",
      "The 2022 Act reworked the framework for the digital environment, including provisions addressing online infringement and the role of platforms, and it continues the Nigerian Copyright Commission's administration of the system. Fair dealing exceptions exist but are narrower than 'I credited the author'.",
    ],
    provisions: [
      {
        id: "pv-11a",
        heading: "Works eligible for copyright",
        citation: "Copyright Act 2022 — eligible works",
        plainLanguage:
          "The Act lists the categories of work that copyright protects and the conditions of eligibility, including fixation.",
      },
      {
        id: "pv-11b",
        heading: "Assignment and licensing",
        citation: "Copyright Act 2022 — transfer of copyright",
        plainLanguage:
          "Copyright can be assigned or licensed, and the Act sets requirements — including writing — for transfers to be effective.",
      },
      {
        id: "pv-11c",
        heading: "Online infringement",
        citation: "Copyright Act 2022 — provisions addressing digital infringement",
        plainLanguage:
          "The Act provides a route for rights owners to act against infringing material online, with obligations attaching to service providers.",
      },
      {
        id: "pv-11d",
        heading: "The Commission",
        citation: "Copyright Act 2022 — Nigerian Copyright Commission",
        plainLanguage:
          "The Nigerian Copyright Commission administers the copyright system, including the notification scheme creators use to record works.",
      },
    ],
    examples: [
      {
        situation:
          "A designer is paid for a logo, and the client later finds they cannot register it as a trade mark.",
        outcome:
          "Payment alone may not have transferred copyright. A written assignment is what moves ownership.",
      },
      {
        situation: "A brand uses a photographer's image in a campaign with credit.",
        outcome:
          "Attribution is not a licence. Permission for the specific use is the question the Act asks.",
      },
    ],
    shouldDo: [
      "Get assignments and licences in writing, specifying scope, territory and duration",
      "Keep dated records of creation: drafts, files, project histories",
      "Clear rights before publication, not after a complaint",
      "Consider recording works through the Commission's notification scheme",
    ],
    shouldNotDo: [
      "Assume paying for creative work transfers ownership automatically",
      "Treat crediting the creator as equivalent to permission",
      "Use material found online because no licence terms were visible",
      "Rely on fair dealing for a commercial use without advice",
    ],
    misconceptions: [
      {
        myth: "If it is not registered, it is not protected.",
        reality:
          "Copyright arises on creation of an eligible work. Records assist proof; they are not the source of the right.",
      },
      {
        myth: "Short extracts are always fair dealing.",
        reality:
          "Fair dealing is defined and limited. Length is one factor among several, and commercial use weighs heavily.",
      },
    ],
    whenToSeeALawyer: [
      "Before signing a publishing, distribution or commissioning agreement",
      "Where a work is being exploited without permission",
      "Where ownership of software or brand assets is unclear",
    ],
    related: {
      laws: ["registering-a-company", "cybercrimes-act"],
      guides: ["before-signing-a-supplier-contract"],
      media: ["creators-and-copyright"],
    },
    meta: {
      ...educational,
      source: {
        label: "Copyright Act 2022",
        citation: "Administered by the Nigerian Copyright Commission",
      },
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Rights guides                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Situation-first, per the spec: the title names the moment, not the statute.
 * `featuredRights` is derived from these below, so a card and its page can
 * never drift apart.
 */
export const rightGuides: RightGuide[] = [
  {
    id: "rt-1",
    slug: "police-stop",
    title: "If the police stop you",
    situation: "You are stopped on the road or in a public place",
    summary:
      "The Constitution protects your dignity and your freedom whenever you deal with the police. Learn what you can ask, what to carry, and how to keep an ordinary stop calm.",
    category: "Police & Law Enforcement",
    protects: [
      "Your dignity: you may not be treated inhumanely or degradingly",
      "Your freedom: you can only be held in situations the Constitution allows",
      "Your privacy, which is why you may fairly ask why you are being searched",
    ],
    steps: [
      {
        title: "Stop safely and stay visible",
        body: "Pull over where it is safe, keep your hands where they can be seen, and stay calm. Most stops go wrong because tempers rise, not because of the law.",
      },
      {
        title: "Ask, politely, what the stop is about",
        body: "You are entitled to know why you are being stopped. Ask once, clearly, and note the answer.",
      },
      {
        title: "Identify the officers and the location",
        body: "Note their names, numbers and unit, plus the place and time. If you are recording on your phone, say so openly rather than hiding it.",
      },
      {
        title: "Comply now, contest later",
        body: "The roadside is not the place to argue. Obeying a lawful instruction does not mean you give up any of your rights — you can still complain or go to court afterwards.",
      },
      {
        title: "Tell someone where you are",
        body: "If you are asked to go to a station, call a family member or lawyer and say where you are going and with whom.",
      },
    ],
    doNow: [
      "Keep your vehicle documents and identification accessible",
      "Note the time, place, unit and officers involved",
      "Ask for the reason for the stop and for any search",
      "Call someone before going anywhere with anyone",
    ],
    avoid: [
      "Arguing the law at the roadside",
      "Offering or agreeing to pay anything informally",
      "Handing over your unlocked phone without asking why",
      "Signing a statement you have not read",
    ],
    misconceptions: [
      {
        myth: "Refusing to answer questions is automatically an offence.",
        reality:
          "It depends on what you are being asked and why. Calmly asking why you have been stopped is not the same as getting in the way of the police.",
      },
      {
        myth: "Recording an encounter is illegal.",
        reality:
          "There is no general ban, although where you are and what is happening can matter. Being open about recording helps keep things calm.",
      },
    ],
    whenToSeeALawyer: [
      "You are asked to go to a station and stay there",
      "Property or a phone has been taken from you",
      "You were hurt, threatened or held for a long time",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves"],
      rights: ["arrest-and-detention", "bail"],
      media: ["know-your-rights-police-encounters"],
      problems: ["police-stopped-or-questioned-me"],
      questions: ["can-the-police-hold-someone-without-charge"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label:
          "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
        citation: "Chapter IV, sections 34 and 35",
      },
    },
  },
  {
    id: "rt-2",
    slug: "arrest-and-detention",
    title: "If you or someone you know is arrested",
    situation: "A person has been taken into custody",
    summary:
      "Section 35 of the Constitution protects your freedom and says how soon an arrested person must be taken to court. The Administration of Criminal Justice Act 2015 adds more protections that are worth knowing before you ever need them.",
    category: "Criminal Law",
    protects: [
      "Being told, promptly, why you are being held",
      "Being brought before a court within the time the Constitution allows",
      "Being treated humanely, and being able to see a lawyer",
    ],
    steps: [
      {
        title: "Establish where the person is",
        body: "Find out the police station, the unit and the officer in charge. Everything else depends on knowing this.",
      },
      {
        title: "Find out the stated reason",
        body: "Ask what the person is accused of and whether they have been formally charged. Write down the answer and who gave it.",
      },
      {
        title: "Get a lawyer involved early",
        body: "Do this before any statement is written, not after. Once a statement is signed, it is very hard to take back.",
      },
      {
        title: "Track the clock",
        body: "The Constitution sets time limits for taking an arrested person to court. Write down the exact time of the arrest.",
      },
      {
        title: "Keep every document",
        body: "Keep bail forms, receipts for anything taken, and charge sheets. Your lawyer will need them later.",
      },
    ],
    doNow: [
      "Write down the time and place of arrest and the officers involved",
      "Ask whether the person needs medication or medical attention",
      "Get a lawyer, and give them the facts in writing",
      "Keep receipts for anything seized",
    ],
    avoid: [
      "Paying anyone informally to secure a release",
      "Letting a statement be written without a lawyer present",
      "Losing the paperwork you are given",
      "Posting about the accusation publicly while the case is still going on",
    ],
    misconceptions: [
      {
        myth: "A person can be held indefinitely while the police investigate.",
        reality:
          "The Constitution says when a person must be taken to court. Holding someone for longer than the law allows is exactly what you can go to court to challenge.",
      },
      {
        myth: "Family cannot do anything until charges are filed.",
        reality:
          "Family or a lawyer can go to court on behalf of someone who is being held and cannot go themselves.",
      },
    ],
    whenToSeeALawyer: [
      "Immediately — this is the clearest case for urgent advice",
      "Before any statement is signed",
      "When someone has been held for longer than the Constitution allows",
    ],
    related: {
      laws: [
        "fundamental-rights-chapter-iv",
        "how-a-criminal-case-moves",
        "enforcing-fundamental-rights",
      ],
      rights: ["bail", "fair-hearing", "police-stop"],
      problems: ["someone-is-being-held-at-a-station"],
      referrals: ["legal-aid-council"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label: "Administration of Criminal Justice Act 2015",
        citation: "Read alongside Constitution 1999 (as amended), s. 35",
      },
    },
  },
  {
    id: "rt-7",
    slug: "bail",
    title: "How bail actually works",
    situation: "A person is in custody and release is being discussed",
    summary:
      "Bail means being let out, on conditions, while your case goes on. It is decided by the police or a court. It is not a price for your freedom, and it does not mean you are guilty or innocent.",
    category: "Criminal Law",
    protects: [
      "Your freedom while the case goes on, as long as you keep to the conditions",
      "The rule that you are innocent until proven guilty",
      "The chance to ask a court for bail, and to ask again if things change",
    ],
    steps: [
      {
        title: "Establish who decides",
        body: "Depending on the offence and how far the case has gone, bail is decided either by the police or by a court. That tells you who to ask.",
      },
      {
        title: "Understand the conditions",
        body: "Bail comes with conditions — for example a surety (someone who promises the person will come back), a fixed address, or reporting to the police. Read them before agreeing.",
      },
      {
        title: "Check that a surety can actually comply",
        body: "A surety makes a real promise and can be held to it. Do not agree to be one without understanding what you are taking on.",
      },
      {
        title: "Keep the paperwork",
        body: "The bail form records the conditions. It is the document everyone will refer to later.",
      },
      {
        title: "Return to court every time",
        body: "Missing a date is the fastest way to lose bail and to create fresh difficulties.",
      },
    ],
    doNow: [
      "Ask what the conditions are, in writing",
      "Confirm the next court date and write it down",
      "Keep the bail form and any receipt",
      "Tell your lawyer immediately if a condition becomes impossible to meet",
    ],
    avoid: [
      "Paying money to anyone outside a formal, receipted process",
      "Agreeing to conditions you know you cannot meet",
      "Assuming bail ends the case",
      "Travelling without checking whether a condition prevents it",
    ],
    misconceptions: [
      {
        myth: "Bail is a fee you pay to be released.",
        reality:
          "Bail is release on conditions. If money is involved, it is a formal guarantee with a receipt — never a payment to someone on the side.",
      },
      {
        myth: "Getting bail means the case is over.",
        reality:
          "The case goes on. Bail only decides whether you are free while it does.",
      },
    ],
    whenToSeeALawyer: [
      "Where bail has been refused or delayed",
      "When the conditions are impossible to keep in real life",
      "Before standing as a surety for someone else",
    ],
    related: {
      laws: ["how-a-criminal-case-moves", "fundamental-rights-chapter-iv"],
      rights: ["arrest-and-detention", "fair-hearing"],
      problems: ["i-have-been-charged-with-an-offence"],
      referrals: ["legal-aid-council"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label: "Administration of Criminal Justice Act 2015",
        citation: "Read alongside Constitution 1999 (as amended), s. 35",
      },
    },
  },
  {
    id: "rt-3",
    slug: "privacy",
    title: "Your privacy and your personal data",
    situation: "An organisation is collecting information about you",
    summary:
      "Section 37 of the Constitution protects your privacy, your home and your messages. The Nigeria Data Protection Act 2023 adds rules for anyone who collects or uses information about you.",
    category: "Data Protection",
    protects: [
      "The privacy of your home, correspondence and communications",
      "A say in how organisations use information about you",
      "The right to see, correct and — in some cases — delete that information",
    ],
    steps: [
      {
        title: "Ask what is being collected and why",
        body: "A privacy notice should tell you why your information is needed, what gives them the right to collect it, and how long they will keep it. If it does not, that tells you something.",
      },
      {
        title: "Do not just tick the consent box",
        body: "Your consent is only one of the reasons the law accepts for collecting your information. Where they rely on it, you must give it freely — and you can take it back.",
      },
      {
        title: "Make your request in writing",
        body: "To see, correct or delete your information, or to object to how it is used, you simply ask. Put it in writing and keep a copy.",
      },
      {
        title: "Escalate if you are ignored",
        body: "The Nigeria Data Protection Commission oversees this. Proof that you asked and got no answer makes your complaint much stronger.",
      },
    ],
    doNow: [
      "Read the privacy notice before handing over documents",
      "Ask how long data will be kept and who it is shared with",
      "Keep a copy of any request you make",
      "Report suspected breaches to the organisation promptly",
    ],
    avoid: [
      "Sending copies of identity documents over informal channels",
      "Agreeing to blanket permissions you do not understand",
      "Assuming a company cannot be asked what it holds",
      "Waiting months before raising an unanswered request",
    ],
    misconceptions: [
      {
        myth: "Privacy law only restricts the government.",
        reality:
          "The Constitution protects you from the government, and the Data Protection Act 2023 also sets rules for private companies that use your information.",
      },
      {
        myth: "If you consented once, the organisation can do anything with the data.",
        reality:
          "They can only use it for the reason they gave you, and you can withdraw your consent.",
      },
    ],
    whenToSeeALawyer: [
      "Where personal data has been exposed or misused",
      "Where a request has been refused without explanation",
      "Where your business is the one that suffered a breach",
    ],
    related: {
      laws: ["nigeria-data-protection-act", "cybercrimes-act"],
      guides: ["before-collecting-customer-data"],
      articles: ["ndpa-for-small-business"],
      safety: ["online-scams"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label: "Nigeria Data Protection Act 2023",
        citation: "Read alongside Constitution 1999 (as amended), s. 37",
      },
    },
  },
  {
    id: "rt-4",
    slug: "at-work",
    title: "Your rights at work",
    situation: "Something has changed about your job or your pay",
    summary:
      "Your written contract, the Labour Act and your workplace rules together decide what your employer can and cannot do. Know which one answers which question.",
    category: "Employment & Labour",
    protects: [
      "The terms actually agreed in your contract",
      "Basic minimum standards, where the Labour Act covers your kind of job",
      "A fair process if you are accused of wrongdoing",
    ],
    steps: [
      {
        title: "Find the contract",
        body: "Start with what you signed, including any staff handbook it mentions. Most answers are there.",
      },
      {
        title: "Identify the actual change",
        body: "Pay, hours, role, location or the ending of employment — each raises different questions.",
      },
      {
        title: "Use the internal process first",
        body: "Raise it in writing through your workplace complaints process. A written record helps if the problem goes further.",
      },
      {
        title: "Keep the record",
        body: "Keep payslips, letters, appraisals and messages. Work disputes are usually won on documents, not memory.",
      },
    ],
    doNow: [
      "Request a copy of your contract and any policy referred to in it",
      "Put your concern in writing, dated",
      "Keep payslips and correspondence in one place",
      "Ask for reasons in writing where a decision affects you",
    ],
    avoid: [
      "Resigning in the moment without advice",
      "Signing a settlement you have not had explained",
      "Relying on a verbal assurance from a manager",
      "Letting a serious grievance go unrecorded",
    ],
    misconceptions: [
      {
        myth: "Everyone in Nigeria is covered by the Labour Act in the same way.",
        reality:
          "The Labour Act mainly covers manual and clerical workers. Other employees rely mostly on their contract and on decisions of the National Industrial Court.",
      },
      {
        myth: "An employer can change terms at will.",
        reality:
          "Your contract decides. An employer cannot simply change the terms on its own because it wants to.",
      },
    ],
    whenToSeeALawyer: [
      "Before signing any settlement or release",
      "When you are dismissed for alleged wrongdoing",
      "Where pay or benefits have been withheld",
    ],
    related: {
      laws: ["employment-contracts-and-termination"],
      guides: ["before-hiring-an-employee"],
      articles: ["employment-contract-anatomy"],
      safety: ["employment-offer"],
      problems: ["i-lost-my-job-or-was-not-paid"],
      questions: ["dismissed-without-notice"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: { label: "Labour Act, Cap L1 LFN 2004" },
    },
  },
  {
    id: "rt-5",
    slug: "fair-hearing",
    title: "Your right to a fair hearing",
    situation: "You are facing a charge, a claim or a disciplinary process",
    summary:
      "Section 36 of the Constitution gives you the right to a fair hearing within a reasonable time. It applies in court, and the same ideas of fairness apply in tribunals and workplace disciplinary meetings too.",
    category: "Human Rights",
    protects: [
      "A hearing before a court or panel that is independent and does not take sides",
      "Knowing the case against you, and having the chance to answer it",
      "Being treated as innocent until proven guilty",
    ],
    steps: [
      {
        title: "Get the allegation in writing",
        body: "You cannot answer what you have not been told. Ask for the case against you in specific terms.",
      },
      {
        title: "Ask for time to prepare",
        body: "A hearing called for the same afternoon rarely gives you a real chance to answer. Ask for reasonable time, in writing.",
      },
      {
        title: "Attend and answer",
        body: "Staying away is usually worse than a difficult hearing. Go, stick to the facts, and take notes.",
      },
      {
        title: "Ask who is deciding",
        body: "If the person who investigated you is also the one deciding, that may not be fair. Point it out, in writing, at the time.",
      },
    ],
    doNow: [
      "Request the allegations and evidence in writing",
      "Take notes during every meeting, with dates",
      "Ask what procedure is being followed",
      "Seek advice before a decision is made, not after",
    ],
    avoid: [
      "Ignoring a court summons, notice or invitation to a hearing",
      "Answering off the record",
      "Assuming an internal process cannot affect later legal rights",
      "Waiting for the outcome before recording your objections",
    ],
    misconceptions: [
      {
        myth: "Fair hearing only applies in criminal courts.",
        reality:
          "Section 36 also covers non-criminal cases, and the same ideas of fairness apply to tribunals and workplace processes.",
      },
      {
        myth: "A fair hearing means the outcome must go your way.",
        reality:
          "It is about a fair process: being told the case against you, getting a chance to answer, and a decision-maker who does not take sides.",
      },
    ],
    whenToSeeALawyer: [
      "Where the outcome could affect your livelihood or liberty",
      "Where you have been refused the case against you",
      "When the person deciding also did the investigating",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves"],
      rights: ["arrest-and-detention", "at-work"],
      articles: ["fair-hearing-explained"],
      problems: ["i-have-been-served-with-court-papers"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label:
          "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
        citation: "Chapter IV, section 36",
      },
    },
  },
  {
    id: "rt-6",
    slug: "consumer",
    title: "When something you bought is faulty",
    situation: "A product failed or a service was not delivered",
    summary:
      "The Federal Competition and Consumer Protection Act 2018 protects buyers and set up the Federal Competition and Consumer Protection Commission (FCCPC). Knowing how to complain matters as much as knowing your rights.",
    category: "Consumer Protection",
    protects: [
      "Information about goods and services in plain, understandable language",
      "Goods of the quality a reasonable person would expect",
      "A complaint route that does not begin in court",
    ],
    steps: [
      {
        title: "Gather the evidence",
        body: "Receipt, order confirmation, packaging, the advertisement you relied on, and photographs of the defect.",
      },
      {
        title: "Complain to the supplier in writing",
        body: "Say what is wrong, when it happened, and what you want — a repair, a replacement or a refund. Keep a copy.",
      },
      {
        title: "Give a reasonable deadline",
        body: "A short, clear deadline shows you are serious and gives you proof of when you asked.",
      },
      {
        title: "Escalate to the Commission",
        body: "If the supplier will not engage, the Federal Competition and Consumer Protection Commission is the next step.",
      },
    ],
    doNow: [
      "Keep the item, the packaging and the receipt",
      "Photograph the defect with a date",
      "Put the complaint in writing",
      "Record every response you receive",
    ],
    avoid: [
      "Accepting a 'no refund' notice as the final position",
      "Discarding evidence before the complaint is resolved",
      "Relying on verbal promises from staff",
      "Letting the matter drift for months",
    ],
    misconceptions: [
      {
        myth: "Sold as seen removes every protection.",
        reality:
          "A shop's notice cannot simply take away the protections the law gives you.",
      },
      {
        myth: "You must sue to get anywhere.",
        reality:
          "Usually you go to the seller first, then the Commission. There is also a special tribunal if it goes further.",
      },
    ],
    whenToSeeALawyer: [
      "Where a defect caused injury or significant loss",
      "When the seller says the contract takes away your protections",
      "Where a business is responding to a Commission complaint",
    ],
    related: {
      laws: ["consumer-protection-fccpa"],
      articles: ["consumer-complaint-route"],
      problems: ["i-paid-for-something-that-failed"],
      referrals: ["consumer-and-sector-regulators"],
    },
    meta: {
      status: "published",
      review: "educational",
      lastReviewed: REVIEWED,
      source: {
        label: "Federal Competition and Consumer Protection Act 2018",
      },
    },
  },
];

/** Card-level view of the rights guides, derived so the two cannot diverge. */
export const featuredRights: RightSummary[] = rightGuides.map(
  ({ id, slug, title, situation, summary, category, meta }) => ({
    id,
    slug,
    title,
    situation,
    summary,
    category,
    meta,
  })
);

/* -------------------------------------------------------------------------- */
/* Stay Safe                                                                   */
/* -------------------------------------------------------------------------- */

export const BEFORE_YOU_SIGN = "Before You Sign";

/**
 * The series featured on /know-the-law/stay-safe, each as a section of its own. Seed for the
 * "Stay Safe series" collection in the CMS.
 */
export const safetySeries: SafetySeries[] = [
  {
    id: "safety-series-before-you-sign",
    name: BEFORE_YOU_SIGN,
    headline: "The document in front of you is the cheapest place to stop",
    description:
      "A recurring series on everyday documents: the clauses that matter, the wording that shifts risk quietly, and the questions that expose an unfair term before you commit.",
  },
];

export const safetyGuides: SafetyGuide[] = [
  {
    id: "ss-1",
    slug: "before-you-sign",
    title: "Before you sign anything",
    series: BEFORE_YOU_SIGN,
    risk: "A document is in front of you and someone is waiting",
    summary:
      "The four questions that apply to every document you are ever asked to sign, and the point at which you should stop and get professional advice.",
    area: "Contracts",
    icon: "signature",
    whatToLookFor: [
      "Who is really signing — their full legal names, not just a business name",
      "What each side must do, by when, and what counts as done",
      "What happens if something goes wrong: how either side can end it, the notice needed, and what you can claim",
      "Money: the full amount, the timing, and every charge that can be added",
      "How the agreement ends, and which promises still apply after it ends",
    ],
    redFlags: [
      "Blank spaces to be filled in after signature",
      "A document referring to schedules or policies you have not been shown",
      "Pressure to sign today for a price that expires tonight",
      "One-sided exit rules: they can walk away freely, you cannot",
      "A clause you are told to ignore because 'nobody enforces it'",
    ],
    questionsToAsk: [
      "May I take this away and read it properly?",
      "If this document disagrees with another one, which one wins?",
      "What exactly happens if I need to end this early?",
      "Can you show me every fee that can be charged under this agreement?",
      "Who signs for your side, and are they allowed to?",
    ],
    stopAndGetHelp: [
      "The document hands over land, company shares, or rights to creative work or a brand",
      "You are being asked to promise to pay if someone else does not",
      "The amounts involved would seriously hurt if the deal failed",
      "You do not understand a clause after reading it twice",
    ],
    related: {
      safety: ["tenancy-agreement", "employment-offer", "business-partnership"],
      guides: ["before-signing-a-supplier-contract"],
    },
    meta: { ...educational },
  },
  {
    id: "ss-2",
    slug: "tenancy-agreement",
    title: "Before you sign a tenancy agreement",
    series: BEFORE_YOU_SIGN,
    risk: "You are about to commit to a home and a year of rent",
    summary:
      "Renting is covered by your state's law and by the agreement itself. The agreement decides most of what happens — and you sign it when you have the least bargaining power.",
    area: "Land & Property",
    icon: "home",
    whatToLookFor: [
      "Whether the person renting it to you actually has the right to",
      "The exact term, the rent, and what the rent does and does not include",
      "Who repairs what, and how a repair is requested",
      "Deposit: how much, held by whom, and the conditions for its return",
      "Renewal, how much notice each side must give, and how the tenancy ends",
    ],
    redFlags: [
      "Cash demanded with no receipt in the landlord's name",
      "No written agreement, or an unsigned photocopy",
      "An agent who will not let you meet the landlord or see proof of ownership",
      "Charges appearing only after you have paid a 'reservation' fee",
      "A clause that lets the landlord enter or throw you out without any notice",
    ],
    questionsToAsk: [
      "Can I see proof that you own this property or are allowed to rent it out?",
      "Which state's tenancy law applies, and how much notice does the agreement require?",
      "What is the deposit for, and what deductions can be made from it?",
      "Are service charges fixed, and what do they cover?",
      "What is the procedure for repairs and emergencies?",
    ],
    stopAndGetHelp: [
      "You are asked to pay before seeing any documentation of ownership",
      "The agreement takes away your right to notice, or lets the landlord evict you without going to court",
      "The property is subject to an ongoing dispute",
      "You are signing on behalf of a business rather than yourself",
    ],
    related: {
      laws: ["land-use-act-and-title"],
      safety: ["before-you-sign", "buying-property"],
      media: ["before-you-sign-tenancy"],
      problems: ["my-landlord-wants-me-out"],
      questions: ["landlord-changed-the-locks"],
    },
    meta: { ...educational },
  },
  {
    id: "ss-3",
    slug: "employment-offer",
    title: "Before you sign an employment offer",
    series: BEFORE_YOU_SIGN,
    risk: "An offer letter has arrived and you want to accept",
    summary:
      "The offer letter and the contract behind it decide your pay, notice, restrictions and what happens if the job ends. Everything is easier to negotiate before you accept.",
    area: "Employment",
    icon: "hard-hat",
    whatToLookFor: [
      "Job title, reporting line and the actual scope of the role",
      "Gross pay, deductions, allowances and when they are reviewed",
      "Probation terms and the notice that applies during and after it",
      "Restrictions: keeping secrets, who owns what you create, and not poaching clients or staff after you leave",
      "Any staff handbook or policy the letter says you must follow",
    ],
    redFlags: [
      "A letter that refers to a contract you have not been given",
      "You must give long notice, but the employer only gives you short notice",
      "Ownership of anything you create, including outside work hours",
      "Deductions from salary described in open-ended terms",
      "Pressure to resign from your current role before terms are final",
    ],
    questionsToAsk: [
      "May I see the full contract and any handbook it refers to?",
      "What notice applies on each side, during and after probation?",
      "How is my pay structured, and what can be deducted?",
      "What restrictions apply after I leave, and for how long?",
      "Who owns work I create outside the scope of my role?",
    ],
    stopAndGetHelp: [
      "You are asked to agree not to work in your field across a wide area or for a long time",
      "The contract gives the employer ownership of your personal projects",
      "You are being moved from employee to contractor status",
      "You are signing a settlement of any kind alongside the offer",
    ],
    related: {
      laws: ["employment-contracts-and-termination"],
      rights: ["at-work"],
      guides: ["before-hiring-an-employee"],
      articles: ["employment-contract-anatomy"],
      media: ["before-you-sign-offer-letter"],
    },
    meta: { ...educational },
  },
  {
    id: "ss-4",
    slug: "online-scams",
    title: "Online scams, fraud and account takeovers",
    risk: "A message, invoice or offer arrives and it looks legitimate",
    summary:
      "Most online fraud in Nigeria follows a small number of repeated patterns. Recognising the pattern is more useful than recognising the sender.",
    area: "Digital",
    icon: "shield",
    whatToLookFor: [
      "Account details that changed at the last minute on a familiar invoice",
      "Urgency: a deadline that leaves no time to verify",
      "A login page reached from a link rather than typed by you",
      "Requests for one-time codes, PINs or full card details",
      "Offers promising returns that are too good to be true",
    ],
    redFlags: [
      "A supplier email with new bank details and a plausible explanation",
      "A caller who already knows some of your details and asks for the rest",
      "Payment demanded through channels that leave no record",
      "An investment that pays early members using money from new members (a Ponzi scheme)",
      "A profile impersonating someone you know, asking your contacts for money",
    ],
    questionsToAsk: [
      "Have I verified this by a channel I chose, not one they gave me?",
      "Would this request survive a phone call to a number I already had?",
      "Why is there urgency, and who benefits from it?",
      "Am I being asked for something no legitimate institution asks for?",
    ],
    stopAndGetHelp: [
      "Money has already left an account — report to the bank and police immediately",
      "A business email account has been compromised",
      "You are being extorted or threatened online",
      "Personal data of customers may have been exposed",
    ],
    related: {
      laws: ["cybercrimes-act", "nigeria-data-protection-act"],
      rights: ["privacy"],
      articles: ["cybercrimes-act-everyday"],
      media: ["scams-that-look-official"],
      problems: ["something-happened-to-me-online"],
      questions: ["someone-is-impersonating-me-online"],
    },
    meta: {
      ...educational,
      source: {
        label:
          "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 (as amended)",
      },
    },
  },
  {
    id: "ss-5",
    slug: "buying-property",
    title: "Buying land or property",
    risk: "A deposit is being requested and the seller is in a hurry",
    summary:
      "Most people who lose money on land in Nigeria were not tricked in clever ways. They paid before checking — who has the right to sell, the history of the papers, and the land itself.",
    area: "Land & Property",
    icon: "map",
    whatToLookFor: [
      "Who has the right to sell: one person, a family, a community or a company",
      "The full history of ownership papers, not just one certificate",
      "A survey plan that matches the land you were shown",
      "Whether the Governor's consent will be obtained when the land changes hands",
      "Any loan secured on the land, dispute, government takeover or other claim against it",
    ],
    redFlags: [
      "Only photocopies are ever produced",
      "A price far below the area's ordinary range",
      "A seller who does not want you to check the land registry or bring your own surveyor",
      "Different documents naming different owners",
      "Pressure to pay cash today to 'hold' the land",
    ],
    questionsToAsk: [
      "Can my lawyer check the land registry before I pay anything?",
      "Who exactly is selling, and can they show authority to do so?",
      "Was the Governor's consent obtained each time the land was sold before?",
      "Can we appoint an independent surveyor to confirm the location?",
      "Is any part of this land in dispute, or being taken over by government?",
    ],
    stopAndGetHelp: [
      "Before any deposit — this is the single most valuable moment for advice",
      "Where the land is family, community or inherited land",
      "When consent or registration was skipped on an earlier sale",
      "Where you are buying to develop or to secure finance",
    ],
    related: {
      laws: ["land-use-act-and-title"],
      articles: ["land-use-act-basics"],
      safety: ["before-you-sign"],
      problems: ["someone-is-claiming-my-land"],
      questions: ["do-i-need-a-lawyer-to-buy-land"],
    },
    meta: {
      ...educational,
      source: { label: "Land Use Act 1978", citation: "Sections 1 and 22" },
    },
  },
  {
    id: "ss-6",
    slug: "borrowing",
    title: "Borrowing, lending and standing as guarantor",
    risk: "Money is about to move between people who trust each other",
    summary:
      "Loans between friends, family and small businesses fail on the same points: no written terms, no record of repayment, and guarantors who did not understand what they signed.",
    area: "Money & Debt",
    icon: "banknote",
    whatToLookFor: [
      "The amount, the schedule, and the total cost including every charge",
      "What property, if any, is being pledged, and what happens to it if the loan is not repaid",
      "What counts as failing to repay, and what the lender can do then",
      "Whether anyone is guaranteeing the debt, and to what extent",
      "How repayments will be recorded and acknowledged",
    ],
    redFlags: [
      "Interest quoted per week or per month with no annual figure",
      "A lender demanding access to your phone contacts or gallery",
      "A blank guarantee, or one with no financial cap",
      "Documents signed but never given back to you",
      "Repayment demanded in cash with no receipt",
    ],
    questionsToAsk: [
      "What is the total I will repay, including all charges?",
      "Exactly when will I be treated as failing to repay, and what happens then?",
      "If I guarantee this, what is the most I could have to pay?",
      "How will each repayment be acknowledged in writing?",
    ],
    stopAndGetHelp: [
      "You are being asked to guarantee a business debt personally",
      "Property or a vehicle is being pledged to secure the loan",
      "A lender is threatening or harassing you or your contacts",
      "The sums are large enough to affect your household if things go wrong",
    ],
    related: {
      safety: ["before-you-sign"],
      laws: ["consumer-protection-fccpa"],
      problems: ["i-am-owed-money-or-being-pursued-for-it"],
      questions: ["can-i-be-arrested-over-a-debt"],
    },
    meta: { ...educational },
  },
  {
    id: "ss-7",
    slug: "business-partnership",
    title: "Before you go into business with someone",
    series: BEFORE_YOU_SIGN,
    risk: "A partnership is forming on trust and a handshake",
    summary:
      "Business partners rarely fall out over how things started. They fall out over what nobody wrote down: who put in what, who decides, how someone leaves, and who keeps the customers.",
    area: "Business",
    icon: "briefcase",
    whatToLookFor: [
      "Who contributes what — money, assets, time, relationships",
      "Ownership percentages, and how they change if contributions change",
      "Who decides what, and what needs unanimous agreement",
      "How profits are taken, and when",
      "Exit: how someone leaves, how they are valued, and who keeps what",
    ],
    redFlags: [
      "'We will sort out the paperwork later'",
      "One partner holding all bank access, registrations and accounts",
      "The brand, name or designs registered in one partner's personal name",
      "No agreement about what happens if a partner stops contributing",
      "Customer relationships held informally by one person",
    ],
    questionsToAsk: [
      "What structure are we actually using, and is it registered?",
      "What is each person's contribution, in writing?",
      "How do we decide, and how do we break a deadlock?",
      "How does someone leave, and how is their share valued?",
      "Who owns the brand, the code, the accounts and the data?",
    ],
    stopAndGetHelp: [
      "Before money or assets move between the partners",
      "Where one party is investing and the other is contributing work",
      "Where the brand, designs, software or creative work is central to the business",
      "Where a partnership is already breaking down",
    ],
    related: {
      laws: ["registering-a-company", "directors-duties"],
      guides: ["before-entering-a-partnership"],
      media: ["what-cama-changed", "before-you-sign-partnership"],
    },
    meta: {
      ...educational,
      source: { label: "Companies and Allied Matters Act 2020" },
    },
  },
];
