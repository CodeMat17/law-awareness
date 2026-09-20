import type {
  LawyerListing,
  LegalProblem,
  PublicQuestion,
  ReferralRoute,
} from "./types";

/**
 * Legal Help seed (Phase 5) — spec sections 35, 36 and 37.
 *
 * EDITORIAL RULES enforced in this file, so they cannot be lost in editing:
 *
 * 1. Nothing here diagnoses. A pathway explains a *situation*; it never tells a
 *    reader what their legal position is, what will happen, or what a court
 *    would decide.
 * 2. Every institution named below is real and well known — the Legal Aid
 *    Council of Nigeria, the Nigerian Bar Association, state Offices of the
 *    Public Defender and Citizens' Rights, the National Human Rights
 *    Commission, the FCCPC, university law clinics and FIDA Nigeria. No
 *    address, telephone number, fee, eligibility threshold or processing time
 *    is stated for any of them: `howToFind` says where to confirm instead.
 * 3. No practitioner is invented. Directory listings are practice-and-location
 *    shaped and carry `listingStatus: "sample"` until the verification process
 *    required by spec section 36 actually runs.
 * 4. A question is published only with an editorial answer attached, and the
 *    attribution is pseudonymous.
 * 5. Instruments named are real: the 1999 Constitution (as amended), the
 *    Administration of Criminal Justice Act 2015, the Legal Aid Act, the
 *    Labour Act, the Land Use Act 1978, the Evidence Act 2011, the FCCPA 2018,
 *    the Cybercrimes Act 2015, the NDP Act 2023, CAMA 2020, the Child's Rights
 *    Act 2003 and the Violence Against Persons (Prohibition) Act 2015 — each
 *    described only in general terms.
 */

const REVIEWED = "2026-09-05";

const meta = {
  status: "published",
  review: "educational",
  lastReviewed: REVIEWED,
} as const;

/* -------------------------------------------------------------------------- */
/* Referral architecture                                                       */
/* -------------------------------------------------------------------------- */

export const referralRoutes: ReferralRoute[] = [
  {
    id: "rr-1",
    slug: "legal-aid-council",
    name: "Legal Aid Council of Nigeria",
    kind: "legal-aid",
    icon: "scale",
    whatItIs:
      "A federal body established by statute to provide legal aid, advice and access to justice for people who cannot afford a lawyer. It maintains offices across the states and works on criminal defence, defined categories of civil matter, and advice.",
    whoItIsFor: [
      "People facing criminal charges who cannot pay for a defence lawyer",
      "People held in custody who have had no legal representation",
      "People with a civil matter falling inside the categories the Council handles",
      "Anyone who needs legal advice and cannot afford private fees",
    ],
    howItTypicallyWorks: [
      "You approach a state office, or the Council reaches people in custody through its own outreach",
      "The office assesses whether the matter is within its remit and whether you meet its means criteria",
      "Where the matter is accepted, a Council lawyer takes it on",
      "Where it is not, the office can usually point you at another route",
    ],
    whatToBring: [
      "Any charge sheet, summons, court paper or letter you have received",
      "The name of any police station, court or office already involved",
      "A written timeline of what happened and when",
      "Identification, and any document that relates to the matter",
    ],
    limits: [
      "It has finite capacity and cannot take every matter it is asked to take",
      "Its remit is set by statute — not every kind of civil dispute falls inside it",
      "Means criteria apply, and the office assesses them, not this platform",
    ],
    howToFind:
      "Confirm the current address and intake process for your state office through the Council's own official channels or your state Ministry of Justice. We do not publish contact details we cannot keep current.",
    meta,
  },
  {
    id: "rr-2",
    slug: "nigerian-bar-association",
    name: "Nigerian Bar Association branches",
    kind: "professional-body",
    icon: "landmark",
    whatItIs:
      "The professional association for legal practitioners in Nigeria. Branches sit across the judicial divisions, and many run pro bono committees, human rights committees and referral arrangements that put people in touch with practitioners.",
    whoItIsFor: [
      "Anyone trying to find a practising lawyer in a particular location",
      "People whose matter needs a lawyer working in a specific practice area",
      "People seeking pro bono assistance where a branch scheme exists",
      "Anyone who needs to confirm that a person is genuinely a legal practitioner",
    ],
    howItTypicallyWorks: [
      "You contact the branch covering the location where the matter sits",
      "The secretariat or the relevant committee directs the enquiry",
      "Where a pro bono or human rights committee exists, it decides how the request is handled",
      "Referral is to a practitioner, not to an outcome — the practitioner then advises you directly",
    ],
    whatToBring: [
      "A short, plain description of the matter",
      "The location where it arose, which decides the branch",
      "Any deadline you are already facing",
    ],
    limits: [
      "A branch refers; it does not itself represent you",
      "Pro bono capacity varies enormously between branches",
      "A referral is not a prediction about how the matter will end",
    ],
    howToFind:
      "Identify the branch covering your judicial division and approach its secretariat directly. Verify a practitioner's standing through the Association rather than through any listing — including ours.",
    meta,
  },
  {
    id: "rr-3",
    slug: "public-defender-and-citizens-rights",
    name: "Offices of the Public Defender and Citizens' Rights",
    kind: "public-institution",
    icon: "shield-check",
    whatItIs:
      "Offices established inside several state Ministries of Justice to give residents free legal assistance, mediation and advice. Names differ by state — Office of the Public Defender, Citizens' Rights Department, Directorate of Citizens' Rights — and so does the scope.",
    whoItIsFor: [
      "Residents of a state that operates one of these offices",
      "People with employment, tenancy, family or debt matters that mediation may resolve",
      "People who have been unable to get a complaint taken seriously elsewhere",
      "People who cannot afford private representation",
    ],
    howItTypicallyWorks: [
      "You file a complaint at the office covering your state",
      "The office assesses it and commonly invites the other side to a mediation session",
      "Many matters end there, with a written settlement",
      "Where mediation fails and the matter is within remit, the office may take it further",
    ],
    whatToBring: [
      "Any agreement, letter, receipt or message showing what was agreed",
      "The other party's name and a way of reaching them",
      "A written account of what happened, in order",
    ],
    limits: [
      "Not every state operates one, and remits differ substantially between those that do",
      "Mediation depends on the other side attending",
      "It is not a court and cannot make binding orders of its own",
    ],
    howToFind:
      "Ask your state Ministry of Justice which office handles citizens' complaints, and confirm its current location and intake process with the Ministry directly.",
    meta,
  },
  {
    id: "rr-4",
    slug: "national-human-rights-commission",
    name: "National Human Rights Commission",
    kind: "public-institution",
    icon: "shield",
    whatItIs:
      "A statutory commission with a mandate over human rights complaints, including complaints about the conduct of public authorities. It receives complaints, investigates them, and can hold hearings.",
    whoItIsFor: [
      "People alleging ill-treatment, unlawful detention or abuse by an authority",
      "People whose complaint concerns the conduct of a public institution",
      "People who need a complaint recorded formally by an independent body",
    ],
    howItTypicallyWorks: [
      "A complaint is lodged in writing at a state office or through the Commission's own channels",
      "The Commission decides whether it falls within its mandate",
      "Where it does, it investigates and may invite both sides to respond",
      "Outcomes range from recommendations to referral onward",
    ],
    whatToBring: [
      "Dates, locations, and the names or numbers of any officials involved",
      "Any medical, photographic or documentary record you already have",
      "Names of witnesses and how they can be reached",
    ],
    limits: [
      "Its mandate is human rights — an ordinary commercial dispute falls outside it",
      "Investigation takes time and is not a substitute for urgent court action",
      "It does not act as your lawyer in a criminal case",
    ],
    howToFind:
      "Confirm the current address of the state office through the Commission's official channels before travelling to it.",
    meta,
  },
  {
    id: "rr-5",
    slug: "consumer-and-sector-regulators",
    name: "Consumer protection and sector regulators",
    kind: "public-institution",
    icon: "shopping-bag",
    whatItIs:
      "The Federal Competition and Consumer Protection Commission has a statutory role in consumer complaints under the FCCPA 2018, and individual sectors — banking, telecommunications, insurance, aviation, power — have their own regulators with their own complaint procedures.",
    whoItIsFor: [
      "People who bought goods or services that failed and got nowhere with the seller",
      "People with a complaint against a regulated provider in a specific sector",
      "People who want a complaint on record before considering court",
    ],
    howItTypicallyWorks: [
      "Most regulators require you to complain to the provider first and give it a chance to respond",
      "If that fails, the complaint moves to the regulator with the paper trail attached",
      "The regulator engages the provider and, in many sectors, can direct a resolution",
    ],
    whatToBring: [
      "The receipt, invoice, contract or transaction reference",
      "Every message exchanged with the provider, in date order",
      "The reference number of the complaint you already made to the provider",
    ],
    limits: [
      "A regulator enforces the rules of its sector — it is not there to award you damages",
      "Complaining to the wrong regulator costs weeks, so identify the right one first",
      "Regulatory processes run on their own timetable, not yours",
    ],
    howToFind:
      "Identify the regulator for the sector the provider operates in, and use that regulator's own published complaint procedure.",
    meta,
  },
  {
    id: "rr-6",
    slug: "university-law-clinics",
    name: "University law clinics",
    kind: "law-clinic",
    icon: "graduation-cap",
    whatItIs:
      "Clinics attached to faculties of law where supervised students give free legal advice, help with documents, and run community legal education. Many Nigerian law faculties operate one.",
    whoItIsFor: [
      "People who need advice and cannot pay for it",
      "People near a university that runs a clinic",
      "People whose matter is at the advice or paperwork stage rather than in court",
    ],
    howItTypicallyWorks: [
      "You attend during advice hours, which follow the academic calendar",
      "A student takes your account under the supervision of a qualified practitioner",
      "The clinic advises, helps with documents, or refers the matter onward",
    ],
    whatToBring: [
      "Every document connected to the matter, including envelopes and dates",
      "A written timeline of what happened",
      "Any deadline that is already running",
    ],
    limits: [
      "Clinics close between academic sessions",
      "Most do not conduct litigation on your behalf",
      "Capacity is small relative to demand",
    ],
    howToFind:
      "Contact the faculty of law at the nearest university and ask whether it operates a legal clinic and when it next takes new enquiries.",
    meta,
  },
  {
    id: "rr-7",
    slug: "rights-organisations",
    name: "Rights and community organisations",
    kind: "civil-society",
    icon: "users",
    whatItIs:
      "Non-governmental organisations providing legal assistance in defined areas — FIDA Nigeria in matters affecting women and children, and a range of organisations working on detention, gender-based violence, disability rights and access to justice.",
    whoItIsFor: [
      "People whose matter falls within an organisation's specific area of work",
      "Survivors of violence who need support alongside legal assistance",
      "People who need someone to accompany them through a process",
    ],
    howItTypicallyWorks: [
      "Each organisation has its own intake process and its own criteria",
      "Where the matter fits, assistance may include advice, representation or accompaniment",
      "Where it does not, most will refer the matter to a route that does",
    ],
    whatToBring: [
      "A safe way for the organisation to contact you back",
      "Any record of what happened, kept somewhere the other party cannot reach",
      "The name of any authority already involved",
    ],
    limits: [
      "Each organisation covers a defined area of work and cannot go outside it",
      "Funding decides capacity, and capacity changes",
      "Support is not the same as representation — confirm which is being offered",
    ],
    howToFind:
      "Identify an organisation working in the specific area your matter falls into, and confirm its current intake process through its own official channels.",
    meta,
  },
];

/* -------------------------------------------------------------------------- */
/* I have a legal problem                                                      */
/* -------------------------------------------------------------------------- */

export const legalProblems: LegalProblem[] = [
  {
    id: "lp-1",
    slug: "police-stopped-or-questioned-me",
    category: "Police & criminal",
    title: "The police have stopped or are questioning you",
    situation: "You are at a checkpoint, in the street, or at a station being asked questions.",
    summary:
      "What the Constitution and the Administration of Criminal Justice Act 2015 say about stops, questioning and how an encounter is supposed to run — and how to keep the encounter from getting worse.",
    icon: "siren",
    urgency: "immediate",
    triage: [
      {
        id: "lp-1-q1",
        question: "Are you free to leave right now?",
        help: "This changes what is happening, not what your rights are.",
        answers: [
          {
            value: "yes",
            label: "Yes — I have not been stopped from leaving",
            guidance:
              "Read the everyday-encounter material first. Nothing here requires you to answer questions beyond identifying yourself, and the encounter usually ends fastest when it is kept short and calm.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "No — I am being held",
            guidance:
              "Start with the detention material. Being held changes which parts of the law are engaged, including the constitutional provisions on liberty and on being informed of the reason.",
            urgency: "immediate",
          },
          {
            value: "unsure",
            label: "I do not know",
            guidance:
              "Asking plainly whether you are free to leave is a normal question, and the answer decides which part of this page matters most to you.",
            urgency: "immediate",
          },
        ],
      },
      {
        id: "lp-1-q2",
        question: "Has anyone been told where you are?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Good. Someone knowing your location and the station name is the single most useful fact in almost every route below.",
            urgency: "time-sensitive",
          },
          {
            value: "no",
            label: "Not yet",
            guidance:
              "Getting word to one person — a relative, a friend, a lawyer — is what most of the routes below depend on. Read the immediate steps first.",
            urgency: "immediate",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "Chapter IV of the Constitution protects personal liberty and dignity, and those protections do not switch off during a stop",
      "A person taken into custody is entitled to be informed of the reason, in a language they understand",
      "The Constitution protects the right to remain silent and the right not to be compelled to make a statement",
      "The Administration of Criminal Justice Act 2015 sets out how arrests, custody records and statements are to be handled",
    ],
    doNow: [
      "Stay where you are visible to other people if you can",
      "Ask, plainly and once, whether you are free to leave",
      "Note the station name, the time, and any name or number you are given",
      "Tell one person where you are and what is happening",
      "Keep your answers short and factual, and say if you do not know something",
    ],
    avoid: [
      "Running, pulling away, or reaching suddenly into a bag or pocket",
      "Arguing about the law at the roadside — that argument is for later, in the right forum",
      "Signing any statement you have not read or do not understand",
      "Offering money to end the encounter",
      "Deleting messages or photographs from your phone while being watched",
    ],
    steps: [
      {
        title: "Establish what is happening",
        body: "There is a real difference between a conversation you may walk away from and being held. Ask once, calmly, and note the answer you are given along with the time.",
      },
      {
        title: "Fix the facts while they are fresh",
        body: "Location, time, the station, and any names or numbers. Memory degrades fast and every route afterwards runs on these details.",
      },
      {
        title: "Get word out",
        body: "One person knowing where you are changes what can be done for you. Say the station name explicitly rather than a landmark near it.",
      },
      {
        title: "Read before you sign",
        body: "A statement is a document that follows the matter. If you have not read it, or it does not say what you said, do not sign it.",
      },
      {
        title: "Write it down afterwards",
        body: "As soon as the encounter ends, write out everything in order while you still remember it. That written account is the basis of any complaint or claim later.",
      },
    ],
    whenToGetHelp: [
      "You are being held and have not been told why",
      "You are being asked to sign a statement you disagree with",
      "You have been injured, or property has been taken from you",
      "The encounter has lasted beyond a few hours",
      "Money is being demanded from you or your family",
    ],
    referralRoutes: [
      "legal-aid-council",
      "nigerian-bar-association",
      "national-human-rights-commission",
    ],
    related: {
      rights: ["police-stop", "arrest-and-detention", "fair-hearing"],
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves"],
      terms: ["fundamental-rights", "habeas-corpus"],
      media: ["know-your-rights-police-encounters"],
      problems: ["someone-is-being-held-at-a-station"],
    },
    meta,
  },
  {
    id: "lp-2",
    slug: "someone-is-being-held-at-a-station",
    category: "Police & criminal",
    title: "Someone you know is being held at a station",
    situation: "You have heard that a relative, friend or employee is in custody.",
    summary:
      "The practical order of things when someone is in custody: confirming where they are, what the law says about custody and bail, and which routes actually reach a person inside a station.",
    icon: "lock",
    urgency: "immediate",
    triage: [
      {
        id: "lp-2-q1",
        question: "Do you know which station they are at?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Start with what to take there and what to ask for. Knowing the station is most of the problem solved.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Locating the person comes before everything else. The steps below start there, and the human rights and legal aid routes both exist partly for this.",
            urgency: "immediate",
          },
        ],
      },
      {
        id: "lp-2-q2",
        question: "Has the person been taken before a court yet?",
        help: "Being charged in court is a different stage from being held at a station.",
        answers: [
          {
            value: "no",
            label: "Not yet",
            guidance:
              "The constitutional provisions on how long a person may be held before being brought before a court are the ones to read.",
            urgency: "immediate",
          },
          {
            value: "yes",
            label: "Yes",
            guidance:
              "The matter has moved into the court process, and bail is decided there. Read the criminal-process material and get representation in place.",
            urgency: "time-sensitive",
          },
          {
            value: "unsure",
            label: "I do not know",
            guidance:
              "Establishing which stage the matter is at decides everything else — the steps below open with how to find out.",
            urgency: "immediate",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The Constitution protects personal liberty and sets limits on how long a person may be held before being brought before a court",
      "A person in custody is entitled to be told the reason for it",
      "The Constitution provides that a person charged with an offence is presumed innocent until proved guilty",
      "The Administration of Criminal Justice Act 2015 requires records of arrest and custody to be kept",
      "Bail is a legal process, not a payment for release, and it is applied for rather than bought",
    ],
    doNow: [
      "Confirm the exact station and the name under which the person was booked",
      "Write down the date and time you were told they were taken",
      "Take identification for yourself and, if you have it, for them",
      "Take any medication the person needs, and say so on arrival",
      "Ask for the officer handling the matter by name",
    ],
    avoid: [
      "Paying anyone for a release that is supposed to be a legal process",
      "Arguing loudly at the counter — it moves nothing and it can cost access",
      "Making promises or admissions on the person's behalf",
      "Waiting overnight for someone else to sort it out",
    ],
    steps: [
      {
        title: "Locate them",
        body: "Start with the nearest station to where they were taken from, then work outward. Ask specifically whether the person is in that station's custody record.",
      },
      {
        title: "Establish the stage",
        body: "Held pending investigation, or charged and before a court? The answer decides whether you are dealing with a station or a courtroom.",
      },
      {
        title: "Get a lawyer engaged",
        body: "This is the point where the Legal Aid Council and the Bar Association branch routes matter. A practitioner reaches places a relative cannot.",
      },
      {
        title: "Deal with bail properly",
        body: "Understand what bail is before agreeing to anything: it is a legal application with conditions, and understanding the conditions matters as much as the release.",
      },
      {
        title: "Keep a written record",
        body: "Every visit, every name, every time. If anything went wrong, that record is the whole of any later complaint.",
      },
    ],
    whenToGetHelp: [
      "The person has been held for an extended period without being taken to court",
      "Nobody will confirm where the person is",
      "The person has been hurt, or is unwell and not being treated",
      "Money is being asked for at any stage",
      "You are told a charge exists but nobody will say what it is",
    ],
    referralRoutes: [
      "legal-aid-council",
      "nigerian-bar-association",
      "national-human-rights-commission",
      "rights-organisations",
    ],
    related: {
      rights: ["arrest-and-detention", "bail", "fair-hearing"],
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves", "enforcing-fundamental-rights"],
      terms: ["bail", "habeas-corpus", "fundamental-rights"],
      problems: ["police-stopped-or-questioned-me", "i-have-been-charged-with-an-offence"],
    },
    meta,
  },
  {
    id: "lp-3",
    slug: "i-have-been-charged-with-an-offence",
    category: "Police & criminal",
    title: "You have been charged with an offence",
    situation: "A charge has been brought and the matter is going before a court.",
    summary:
      "How a criminal case moves under the Administration of Criminal Justice Act 2015, what the fair-hearing provisions of the Constitution guarantee, and why representation stops being optional at this point.",
    icon: "gavel",
    urgency: "time-sensitive",
    triage: [
      {
        id: "lp-3-q1",
        question: "Do you have a lawyer representing you?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Use this page to understand the process your lawyer is taking you through, and to prepare properly for each appearance.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Getting representation is the first step, and the Legal Aid Council route below exists precisely for people who cannot pay for it.",
            urgency: "immediate",
          },
        ],
      },
      {
        id: "lp-3-q2",
        question: "Do you have a date for your next appearance?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance: "Treat that date as fixed and build everything backwards from it.",
            urgency: "time-sensitive",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Finding out the next date is urgent — missing an appearance has consequences of its own, independent of the charge.",
            urgency: "immediate",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The Constitution guarantees a fair hearing within a reasonable time by an independent and impartial court",
      "A person charged is entitled to be informed promptly of the nature of the offence in a language they understand",
      "The Constitution provides for adequate time and facilities to prepare a defence, and for legal representation of your own choosing",
      "The presumption of innocence applies throughout",
      "The Administration of Criminal Justice Act 2015 governs how the case is to be conducted",
    ],
    doNow: [
      "Get a copy of the charge and read exactly what is alleged",
      "Write down the court, the case number and every date you are given",
      "Arrange representation before your next appearance",
      "Collect anything that fixes where you were and what you were doing",
      "Attend every date, without exception",
    ],
    avoid: [
      "Missing an appearance for any reason short of hospital",
      "Discussing the case publicly or on social media",
      "Approaching the complainant or witnesses directly",
      "Assuming that a matter has gone away because nothing has happened for months",
      "Relying on informal assurances from anyone about how it will end",
    ],
    steps: [
      {
        title: "Read the charge",
        body: "The precise wording decides what has to be proved and what your defence has to answer. Get a copy, not a summary.",
      },
      {
        title: "Secure representation",
        body: "Through your own means, the Legal Aid Council, or a Bar Association branch. Do this before the next date rather than on the day.",
      },
      {
        title: "Understand bail conditions",
        body: "If you are on bail, the conditions are obligations. Breaking one creates a second problem on top of the first.",
      },
      {
        title: "Prepare with your lawyer",
        body: "Documents, witnesses, and a written timeline. Adjournments are common; preparation that has been done stays done.",
      },
      {
        title: "Keep attending",
        body: "Criminal matters move slowly and appearances continue. Attendance is the one part that is entirely within your control.",
      },
    ],
    whenToGetHelp: [
      "Immediately — a charge is the point at which self-representation stops being sensible",
      "You do not understand what the charge actually alleges",
      "You cannot afford a lawyer",
      "You are on bail and cannot meet a condition",
      "The matter has run for a long time without progress",
    ],
    referralRoutes: [
      "legal-aid-council",
      "nigerian-bar-association",
      "university-law-clinics",
    ],
    related: {
      rights: ["fair-hearing", "bail", "arrest-and-detention"],
      laws: ["how-a-criminal-case-moves", "fundamental-rights-chapter-iv"],
      terms: ["bail", "subpoena", "affidavit"],
      problems: ["i-have-been-served-with-court-papers"],
    },
    meta,
  },
  {
    id: "lp-4",
    slug: "i-have-been-served-with-court-papers",
    category: "Court",
    title: "You have been served with court papers or a summons",
    situation: "Somebody has brought a claim against you, or you have been summoned to attend.",
    summary:
      "What a court document actually requires of you, why the date on it is the most important thing on the page, and what happens if it is ignored.",
    icon: "landmark",
    urgency: "time-sensitive",
    triage: [
      {
        id: "lp-4-q1",
        question: "Is there a date or a deadline on the document?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "That date governs everything. Read the steps in order and work backwards from it.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "I cannot find one",
            guidance:
              "Take the document to someone who can read it properly before assuming there is no deadline. Registry staff can identify a document type even when they cannot advise you.",
            urgency: "time-sensitive",
          },
        ],
      },
      {
        id: "lp-4-q2",
        question: "Is the claim against you personally, or against a business?",
        answers: [
          {
            value: "personal",
            label: "Against me personally",
            guidance:
              "Read this pathway as it stands, and get advice on responding in time.",
            urgency: "time-sensitive",
          },
          {
            value: "business",
            label: "Against a business",
            guidance:
              "The business dispute material and the Business & Enterprise section will be more directly useful alongside this page.",
            urgency: "time-sensitive",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The Constitution guarantees a fair hearing, which includes being heard before a decision is made against you",
      "You are entitled to know the case being made against you",
      "You may be represented by a legal practitioner of your own choosing",
      "Court rules provide time limits for responding — they exist to be used, not merely to be obeyed",
    ],
    doNow: [
      "Note the date on the document and the date you received it",
      "Photograph every page, including the envelope",
      "Identify which court it is and what type of document you have",
      "Get advice before the response deadline, not after it",
      "Gather every document connected with the underlying dispute",
    ],
    avoid: [
      "Ignoring it — a matter can proceed without you and end with an order against you",
      "Responding informally to the other side instead of responding to the court",
      "Destroying or hiding documents that relate to the dispute",
      "Assuming service was invalid because it felt irregular",
    ],
    steps: [
      {
        title: "Identify the document",
        body: "A summons, a writ, an originating process and a hearing notice all require different things. Identify what you actually have before deciding anything.",
      },
      {
        title: "Diary the deadline",
        body: "Court timetables are not flexible in the way commercial ones are. Put the date somewhere you cannot miss it.",
      },
      {
        title: "Assemble the paper trail",
        body: "Contracts, receipts, messages, and anything showing what was agreed and what was done. Order it by date.",
      },
      {
        title: "Get advice on the response",
        body: "How you respond, and whether you file anything, is a decision for a practitioner who has read the actual document.",
      },
      {
        title: "Attend",
        body: "Turning up matters. Matters are frequently lost by absence rather than on the merits.",
      },
    ],
    whenToGetHelp: [
      "As soon as you receive anything from a court",
      "You do not understand what is being claimed",
      "The response deadline is close",
      "The claim concerns land, a business, or a substantial amount",
      "You believe the claim is against the wrong person",
    ],
    referralRoutes: [
      "nigerian-bar-association",
      "legal-aid-council",
      "public-defender-and-citizens-rights",
      "university-law-clinics",
    ],
    related: {
      rights: ["fair-hearing"],
      laws: ["enforcing-fundamental-rights", "how-a-criminal-case-moves"],
      terms: ["affidavit", "subpoena", "injunction", "limitation-period"],
      problems: ["a-business-relationship-has-broken-down"],
    },
    meta,
  },
  {
    id: "lp-5",
    slug: "my-landlord-wants-me-out",
    category: "Home & land",
    title: "Your landlord wants you out, or the rent is in dispute",
    situation: "You have been asked to leave, given a notice, or told the rent has changed.",
    summary:
      "Tenancy is governed largely by state law and by the agreement you signed. What the process is supposed to look like, what a notice is, and why self-help eviction is not lawful.",
    icon: "home",
    urgency: "time-sensitive",
    triage: [
      {
        id: "lp-5-q1",
        question: "Have you been given anything in writing?",
        answers: [
          {
            value: "yes",
            label: "Yes — a notice or a letter",
            guidance:
              "Keep it, and note the date you received it. Notice periods and their form are set by state tenancy law and by your agreement.",
            urgency: "time-sensitive",
          },
          {
            value: "no",
            label: "No — I was told verbally",
            guidance:
              "Write down what was said, by whom and when. The written record you make now is what the process will later run on.",
            urgency: "time-sensitive",
          },
        ],
      },
      {
        id: "lp-5-q2",
        question: "Have your locks, power or water been interfered with?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Read the immediate steps first. Removing a tenant without going through the proper process is not lawful, whatever is owed.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Then the matter is still a process question, and the steps below are in the right order.",
            urgency: "time-sensitive",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "Tenancy relationships are governed by state tenancy laws and by the agreement between the parties",
      "Recovery of premises follows a legal process — a landlord who wants possession is expected to use it",
      "Locking out, removing a roof, or cutting off services to force a tenant out is not a lawful substitute for that process",
      "The Constitution protects the dignity of the person and the peaceful enjoyment of property rights",
    ],
    doNow: [
      "Find and read your tenancy agreement, especially the term and notice clauses",
      "Keep every notice, receipt and message, and note the date each was received",
      "Photograph the property's condition and anything that has been interfered with",
      "Keep paying what you can and get receipts for every payment",
      "Write down the exact words used, and by whom",
    ],
    avoid: [
      "Stopping payment as a negotiating tactic without advice",
      "Removing or damaging fittings on the way out",
      "Agreeing verbally to leave by a date you cannot meet",
      "Confronting the landlord physically over locks or property",
    ],
    steps: [
      {
        title: "Read the agreement",
        body: "The term, the notice provisions and the rent-review clause decide most of what follows. What is written is where the process starts.",
      },
      {
        title: "Establish what has been served",
        body: "A notice to quit, a notice of intention to recover possession and a court process are different stages with different consequences.",
      },
      {
        title: "Keep the payment record clean",
        body: "Receipts, transfers and dates. Very few tenancy disputes are won by the party with the weaker payment record.",
      },
      {
        title: "Get advice on the state law",
        body: "Tenancy law is state law, and it differs. Advice needs to be from someone who knows the rules where the property is.",
      },
      {
        title: "Use mediation before litigation where you can",
        body: "State citizens' rights offices handle a large volume of tenancy matters and resolve many without a hearing.",
      },
    ],
    whenToGetHelp: [
      "Your locks have been changed or services cut off",
      "You have received a court process",
      "You are being asked to leave with less notice than the agreement provides",
      "A rent increase is being applied outside anything the agreement contemplates",
      "Your property has been removed from the premises",
    ],
    referralRoutes: [
      "public-defender-and-citizens-rights",
      "legal-aid-council",
      "nigerian-bar-association",
    ],
    related: {
      safety: ["tenancy-agreement", "before-you-sign"],
      laws: ["land-use-act-and-title"],
      contracts: ["lease-agreement"],
      terms: ["trespass", "injunction"],
      problems: ["someone-is-claiming-my-land"],
    },
    meta,
  },
  {
    id: "lp-6",
    slug: "someone-is-claiming-my-land",
    category: "Home & land",
    title: "Someone is claiming your land",
    situation: "A competing claim, a survey dispute, or people on the land who should not be there.",
    summary:
      "How land holding works under the Land Use Act 1978, what documents actually establish a claim, and why land matters are the ones to take to a lawyer earliest.",
    icon: "map",
    urgency: "time-sensitive",
    triage: [
      {
        id: "lp-6-q1",
        question: "Is anyone physically on the land now?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Read the immediate steps. Physical occupation changes the urgency, and confrontation is where land disputes turn dangerous.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "No — it is a paper dispute",
            guidance:
              "Then documents decide it, and assembling them properly is the first task.",
            urgency: "time-sensitive",
          },
        ],
      },
      {
        id: "lp-6-q2",
        question: "Do you hold documents for the land?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Bring all of them, including receipts and survey plans, to advice. What matters is the chain, not any single page.",
            urgency: "time-sensitive",
          },
          {
            value: "some",
            label: "Some of them",
            guidance:
              "Gaps in the chain are common and are exactly what advice is for. List what you have and what is missing.",
            urgency: "time-sensitive",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Start with the land-and-title material, then get advice early. Land matters with no documentation need professional handling from the outset.",
            urgency: "immediate",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The Land Use Act 1978 vests land in each state in the Governor, held in trust, and what a holder has is a right of occupancy",
      "Certain transactions require the consent of the Governor, and the absence of consent affects them",
      "A registered instrument and a documented chain of transactions are what an interest is proved with",
      "Self-help — entering, fencing or building on disputed land — creates its own legal exposure",
    ],
    doNow: [
      "Gather every document: agreements, receipts, survey plans, consent and registration papers",
      "Photograph the land and anything built on it, with dates",
      "Write down who is claiming, on what basis, and when they first said so",
      "Speak to a lawyer before responding to the claim",
      "Report to the police only if there is a real risk to people",
    ],
    avoid: [
      "Confronting occupiers directly",
      "Paying anyone to remove people from the land",
      "Building or fencing while ownership is disputed",
      "Handing your original documents to anyone",
      "Signing a settlement you have not had read to you properly",
    ],
    steps: [
      {
        title: "Assemble the chain",
        body: "Land claims are decided on documents and on the chain of transactions behind them. Put yours in date order before doing anything else.",
      },
      {
        title: "Confirm the physical position",
        body: "A survey plan and photographs establish what is actually where. Boundary disputes are frequently a survey question rather than a title question.",
      },
      {
        title: "Understand the other claim",
        body: "Whether the other side claims through family land, a prior sale, or an allocation, the basis changes everything about how the matter runs.",
      },
      {
        title: "Get advice early",
        body: "This is the category where early advice most often changes the outcome, and where delay most often destroys it.",
      },
      {
        title: "Preserve the position",
        body: "Your lawyer may advise steps to hold the position while the dispute is resolved. Those are legal steps, not physical ones.",
      },
    ],
    whenToGetHelp: [
      "Immediately — land disputes are not a category to handle alone",
      "Anyone has entered or begun building on the land",
      "You have been served with a court process",
      "Two documents covering the same land are in circulation",
      "A family or community claim has been raised",
    ],
    referralRoutes: [
      "nigerian-bar-association",
      "legal-aid-council",
      "public-defender-and-citizens-rights",
    ],
    related: {
      laws: ["land-use-act-and-title"],
      safety: ["buying-property"],
      terms: ["trespass", "injunction", "limitation-period"],
      industries: ["real-estate"],
      problems: ["my-landlord-wants-me-out"],
    },
    meta,
  },
  {
    id: "lp-7",
    slug: "i-lost-my-job-or-was-not-paid",
    category: "Work",
    title: "You were dismissed, not paid, or badly treated at work",
    situation: "Your employment has ended, wages are outstanding, or the workplace has become untenable.",
    summary:
      "What the Labour Act and your contract of employment govern, what the National Industrial Court exists for, and how to build the record an employment claim actually runs on.",
    icon: "hard-hat",
    urgency: "time-sensitive",
    triage: [
      {
        id: "lp-7-q1",
        question: "Do you have a written contract or offer letter?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "It is the starting point for nearly everything here — notice, termination and entitlements are usually decided by its terms first.",
            urgency: "time-sensitive",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "An employment relationship can exist without a signed contract. Payslips, rosters, messages and transfers all evidence it — start collecting them.",
            urgency: "time-sensitive",
          },
        ],
      },
      {
        id: "lp-7-q2",
        question: "What is the main problem?",
        answers: [
          {
            value: "pay",
            label: "Wages or entitlements are unpaid",
            guidance:
              "The record of what was earned and what was paid is the whole matter. Build it before you complain.",
            urgency: "time-sensitive",
          },
          {
            value: "dismissal",
            label: "I was dismissed",
            guidance:
              "How the termination was carried out, and what the contract said about it, is where this begins.",
            urgency: "time-sensitive",
          },
          {
            value: "treatment",
            label: "Harassment or unsafe conditions",
            guidance:
              "Contemporaneous records matter more here than anywhere else. Read the immediate steps, and consider the rights organisations route.",
            urgency: "immediate",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The Labour Act governs wages, working conditions and termination for the categories of worker it covers",
      "Your contract of employment governs the relationship alongside it, and its terms matter",
      "The National Industrial Court has jurisdiction over labour and employment matters",
      "The Employee's Compensation Act 2010 deals with injury arising in the course of employment",
      "The Constitution's protections against discrimination apply in the workplace as elsewhere",
    ],
    doNow: [
      "Collect your contract, payslips, bank records and any staff handbook",
      "Save every relevant message and email to somewhere outside company systems",
      "Write a dated timeline of what happened",
      "Put your complaint to the employer in writing, and keep the copy",
      "Note the exact date employment ended and what you were told",
    ],
    avoid: [
      "Signing a settlement or a release before you understand what it gives up",
      "Removing confidential company material — that creates a separate problem",
      "Resigning in the heat of the moment before taking advice",
      "Letting months pass — employment claims have time limits",
      "Discussing the dispute publicly while it is live",
    ],
    steps: [
      {
        title: "Establish the terms",
        body: "Contract, handbook, and what was actually done in practice. Practice can matter as much as paper.",
      },
      {
        title: "Build the payment record",
        body: "What was earned, what was paid, and the gap between them. Bank statements do most of this work.",
      },
      {
        title: "Complain internally, in writing",
        body: "It creates a record and it is what most external routes expect to see before they engage.",
      },
      {
        title: "Get advice on the forum",
        body: "Employment matters have their own court and their own procedure. Advice on where a claim belongs saves months.",
      },
      {
        title: "Consider mediation",
        body: "State citizens' rights offices deal with a substantial volume of unpaid-wage matters and often resolve them faster than litigation.",
      },
    ],
    whenToGetHelp: [
      "You are being asked to sign a settlement or waiver",
      "A substantial sum is outstanding",
      "The dismissal followed a complaint you made",
      "The treatment involved harassment, violence or discrimination",
      "You were injured at work",
    ],
    referralRoutes: [
      "public-defender-and-citizens-rights",
      "nigerian-bar-association",
      "legal-aid-council",
      "rights-organisations",
    ],
    related: {
      rights: ["at-work"],
      laws: ["employment-contracts-and-termination"],
      safety: ["employment-offer"],
      guides: ["before-terminating-an-employee"],
      contracts: ["employment-agreement"],
      compliance: ["employment-and-payroll"],
      terms: ["limitation-period"],
    },
    meta,
  },
  {
    id: "lp-8",
    slug: "a-business-relationship-has-broken-down",
    category: "Business & contracts",
    title: "A business relationship has broken down",
    situation: "A partner, co-director, supplier or customer relationship has stopped working.",
    summary:
      "Where the governing documents sit, what CAMA 2020 provides for companies, and why the choice between negotiation, mediation, arbitration and court is made early rather than late.",
    icon: "briefcase",
    urgency: "considered",
    triage: [
      {
        id: "lp-8-q1",
        question: "Is there a written agreement between you?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Find its dispute resolution clause first. It may decide where this has to go, whatever either side would prefer.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Then conduct, correspondence and payment records define the arrangement. Assemble them in date order.",
            urgency: "considered",
          },
        ],
      },
      {
        id: "lp-8-q2",
        question: "Is a registered company involved?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "CAMA 2020, the constitutional documents and any shareholder agreement come into play alongside the commercial dispute.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "No — it is between individuals",
            guidance:
              "The contract and partnership material is where to start.",
            urgency: "considered",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The agreement between the parties governs first, including any dispute resolution clause in it",
      "CAMA 2020 sets out how companies are constituted and how directors and shareholders relate to one another",
      "The Arbitration and Mediation Act 2023 provides the framework where a contract points disputes to arbitration or mediation",
      "Where nothing is written, the arrangement is evidenced by conduct, correspondence and payment records",
    ],
    doNow: [
      "Locate every governing document: agreement, articles, resolutions, minutes",
      "Assemble the correspondence and payment history in date order",
      "Secure your access to company records and accounts",
      "Stop informal side arrangements and put communication in writing",
      "Get advice before serving anything on the other side",
    ],
    avoid: [
      "Removing money or assets while the dispute is unresolved",
      "Locking the other side out of records they are entitled to see",
      "Making public statements about the other party",
      "Letting the operating business fail while the dispute runs",
      "Signing an exit agreement without advice",
    ],
    steps: [
      {
        title: "Read the dispute resolution clause",
        body: "It commonly dictates the forum, and sometimes a mandatory step before it. Ignoring it wastes the first round.",
      },
      {
        title: "Separate the commercial from the legal",
        body: "Much of what looks legal is commercial and settles. Identify which parts genuinely need a legal answer.",
      },
      {
        title: "Protect the operating business",
        body: "Customers, staff and suppliers are damaged by a dispute they are not party to. Keep the business running while it resolves.",
      },
      {
        title: "Choose the route deliberately",
        body: "Negotiation, mediation, arbitration and litigation differ in cost, speed, privacy and finality. Choose with advice.",
      },
      {
        title: "Document the settlement properly",
        body: "A settlement that is not documented properly produces the same dispute again in a year.",
      },
    ],
    whenToGetHelp: [
      "The agreement points to arbitration and you do not know what that requires",
      "Company assets or accounts are being moved",
      "A shareholder or director dispute is affecting the company's operation",
      "The other side has instructed lawyers",
      "You are being asked to sign an exit or settlement",
    ],
    referralRoutes: ["nigerian-bar-association", "consumer-and-sector-regulators"],
    related: {
      laws: ["registering-a-company", "directors-duties"],
      guides: ["before-entering-a-partnership"],
      contracts: ["partnership-agreement", "shareholder-agreement"],
      safety: ["business-partnership"],
      updates: ["arbitration-and-mediation-act-2023"],
      briefings: ["contract-risks-executives-overlook"],
    },
    meta,
  },
  {
    id: "lp-9",
    slug: "the-other-side-is-not-honouring-the-agreement",
    category: "Business & contracts",
    title: "The other side is not doing what the agreement says",
    situation: "Work was not delivered, payment did not arrive, or terms are being ignored.",
    summary:
      "What a contract obliges, what the agreement itself says about failure, and the sequence that gets most contract problems resolved before anyone goes near a court.",
    icon: "signature",
    urgency: "considered",
    triage: [
      {
        id: "lp-9-q1",
        question: "Is the agreement in writing?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Read the clauses on performance, termination and dispute resolution before you do anything else.",
            urgency: "considered",
          },
          {
            value: "partly",
            label: "Partly — messages and invoices",
            guidance:
              "That is still a record. Put every message, invoice and transfer in date order; together they usually establish the terms.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "Nothing written at all",
            guidance:
              "Conduct and payment can still evidence an agreement, but proving the terms is harder. Advice matters earlier here.",
            urgency: "considered",
          },
        ],
      },
      {
        id: "lp-9-q2",
        question: "Have you raised it with them formally?",
        answers: [
          {
            value: "yes",
            label: "Yes, in writing",
            guidance: "Good. That record is the foundation of every step that follows.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "Only verbally",
            guidance:
              "Putting it in writing is the next step, and it is the step most external routes will expect to see.",
            urgency: "considered",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "A contract binds both sides to what it provides, and its own terms usually say what happens when one side fails",
      "The Evidence Act 2011 governs how agreements and their terms are proved",
      "Where a contract provides for arbitration or mediation, the Arbitration and Mediation Act 2023 provides the framework",
      "Claims are subject to limitation periods, so delay can extinguish an entitlement entirely",
    ],
    doNow: [
      "Read the agreement end to end, including the parts nobody reads",
      "Assemble invoices, delivery records, messages and transfers in date order",
      "Write to the other side setting out precisely what is outstanding",
      "Keep performing your own obligations unless advised otherwise",
      "Note when the problem first arose — limitation runs from somewhere",
    ],
    avoid: [
      "Stopping your own performance in retaliation without advice",
      "Threatening criminal proceedings over a commercial debt",
      "Letting the matter drift while a limitation period runs",
      "Accepting part payment on terms you have not read",
      "Agreeing variations verbally",
    ],
    steps: [
      {
        title: "Establish what was agreed",
        body: "The document, and where there is none, the conduct. This is the whole foundation.",
      },
      {
        title: "Identify the actual failure",
        body: "Late, defective, or not at all — the remedy in the agreement usually differs by category.",
      },
      {
        title: "Put it in writing",
        body: "A clear letter setting out what is outstanding and what you require resolves a surprising proportion of these matters.",
      },
      {
        title: "Follow the agreed route",
        body: "If the contract names a forum or a pre-action step, use it. Skipping it costs time later.",
      },
      {
        title: "Weigh cost against value",
        body: "Recovery has a cost. Advice on whether pursuing it makes commercial sense is part of what a lawyer is for.",
      },
    ],
    whenToGetHelp: [
      "The amount is material to you or the business",
      "The contract points to arbitration",
      "The other side disputes that any agreement exists",
      "Time may be running out on the claim",
      "You are considering stopping your own performance",
    ],
    referralRoutes: [
      "nigerian-bar-association",
      "public-defender-and-citizens-rights",
      "consumer-and-sector-regulators",
    ],
    related: {
      guides: ["before-signing-a-supplier-contract"],
      contracts: ["service-agreement", "supplier-agreement"],
      safety: ["before-you-sign"],
      compliance: ["contracts"],
      terms: ["limitation-period", "negligence"],
      problems: ["i-am-owed-money-or-being-pursued-for-it"],
    },
    meta,
  },
  {
    id: "lp-10",
    slug: "i-am-owed-money-or-being-pursued-for-it",
    category: "Money & debt",
    title: "You are owed money, or being pursued for it",
    situation: "A debt is unpaid, or a lender or recovery agent is pursuing you.",
    summary:
      "How debt is recovered lawfully, what recovery agents may and may not do, and what to check before agreeing to any restructuring.",
    icon: "banknote",
    urgency: "time-sensitive",
    triage: [
      {
        id: "lp-10-q1",
        question: "Which side of it are you on?",
        answers: [
          {
            value: "owed",
            label: "I am owed money",
            guidance:
              "Focus on the record of the debt and the written demand. Both are what any route afterwards depends on.",
            urgency: "considered",
          },
          {
            value: "pursued",
            label: "I am being pursued",
            guidance:
              "Focus on what is actually owed, what the agreement provides, and what conduct is lawful in recovering it.",
            urgency: "time-sensitive",
          },
        ],
      },
      {
        id: "lp-10-q2",
        question: "Has anyone threatened you, or contacted people about your debt?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Read the immediate steps. Threats, and disclosing a person's debt to their contacts, raise issues beyond the debt itself — including under data protection law.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "No",
            guidance: "Then this is a recovery question and the steps below are in order.",
            urgency: "time-sensitive",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "A debt is a civil obligation — non-payment of an ordinary debt is not itself a criminal offence",
      "Recovery is pursued through the agreement and, where necessary, the courts",
      "The Nigeria Data Protection Act 2023 governs how personal data is used, including by lenders and recovery agents",
      "Threats, intimidation and harassment are not lawful recovery methods",
      "Claims are subject to limitation periods",
    ],
    doNow: [
      "Establish exactly what is owed, on what terms, and what has already been paid",
      "Collect the loan agreement, statements and every transfer record",
      "Put any dispute about the amount in writing",
      "Record the date, time and content of any threatening contact",
      "Get advice before agreeing to any restructuring",
    ],
    avoid: [
      "Ignoring correspondence — silence usually accelerates matters",
      "Borrowing again to cover the same debt",
      "Agreeing to terms you have not read because of pressure",
      "Handing over identity documents or granting access to your contacts",
      "Threatening criminal proceedings to recover a debt",
    ],
    steps: [
      {
        title: "Fix the number",
        body: "Principal, interest, charges and payments made. A surprising share of debt disputes are arithmetic disputes.",
      },
      {
        title: "Read the agreement",
        body: "Interest, default provisions and any security given. Security is what turns a debt into a threat to an asset.",
      },
      {
        title: "Make a written demand or a written dispute",
        body: "Whichever side you are on, the written record is what every route afterwards runs on.",
      },
      {
        title: "Deal with unlawful conduct separately",
        body: "Harassment and misuse of personal data are separate matters from the debt, and there are routes for them.",
      },
      {
        title: "Get advice before settling",
        body: "A restructuring is a new agreement. It should be read as carefully as the first one.",
      },
    ],
    whenToGetHelp: [
      "Property or an asset has been given as security",
      "You are being threatened, or your contacts are being messaged",
      "You have been told you will be arrested over a debt",
      "The sum is material to you",
      "You are being asked to sign new terms",
    ],
    referralRoutes: [
      "public-defender-and-citizens-rights",
      "consumer-and-sector-regulators",
      "nigerian-bar-association",
      "legal-aid-council",
    ],
    related: {
      safety: ["borrowing"],
      laws: ["nigeria-data-protection-act", "consumer-protection-fccpa"],
      guides: ["before-borrowing-money"],
      terms: ["limitation-period", "power-of-attorney"],
      problems: ["the-other-side-is-not-honouring-the-agreement"],
    },
    meta,
  },
  {
    id: "lp-11",
    slug: "i-paid-for-something-that-failed",
    category: "Consumer",
    title: "You paid for something that failed",
    situation: "Goods are defective, a service was not delivered, or a provider will not resolve it.",
    summary:
      "What the FCCPA 2018 provides for consumers, the order regulators expect complaints to follow, and how to make a complaint that actually gets somewhere.",
    icon: "shopping-bag",
    urgency: "considered",
    triage: [
      {
        id: "lp-11-q1",
        question: "Have you complained to the provider itself?",
        answers: [
          {
            value: "yes",
            label: "Yes, and it went nowhere",
            guidance:
              "You are ready for the regulator route. Take the reference number and the full correspondence with you.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "Not yet",
            guidance:
              "Start there. Most regulators expect the provider to have had a chance to respond before they will take the complaint.",
            urgency: "considered",
          },
        ],
      },
      {
        id: "lp-11-q2",
        question: "Is the provider in a regulated sector?",
        help: "Banking, telecoms, insurance, aviation and power each have their own regulator.",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "The sector regulator is usually the faster route, and it has powers a general complaint does not.",
            urgency: "considered",
          },
          {
            value: "no",
            label: "No, or I am not sure",
            guidance:
              "The consumer protection route under the FCCPA 2018 is the general one to read first.",
            urgency: "considered",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The FCCPA 2018 establishes consumer protections and a Commission with a statutory role in enforcing them",
      "Consumers are generally entitled to goods that are fit for purpose and to information that is not misleading",
      "Sector regulators operate their own complaint procedures alongside the general framework",
      "A written complaint trail is what every one of these routes runs on",
    ],
    doNow: [
      "Find the receipt, invoice or transaction reference",
      "Photograph the defect or record what was not delivered",
      "Complain to the provider in writing and get a reference number",
      "Keep every message in date order",
      "Note the date of purchase and the date the problem appeared",
    ],
    avoid: [
      "Complaining only by phone, with no record of it",
      "Discarding the product, the packaging or the receipt",
      "Accepting a partial resolution before understanding what it settles",
      "Waiting months before raising it",
      "Escalating publicly before the complaint has been made properly",
    ],
    steps: [
      {
        title: "Complain to the provider, in writing",
        body: "Say what you bought, what went wrong, and what you want done. Keep the reference number.",
      },
      {
        title: "Escalate inside the provider",
        body: "Most have a formal complaints stage above the front line. Use it, and record the dates.",
      },
      {
        title: "Identify the right regulator",
        body: "Sector first, general consumer protection otherwise. The wrong regulator costs weeks.",
      },
      {
        title: "Submit the complete file",
        body: "Chronology, correspondence, receipts, reference numbers. Regulators progress complete complaints and park incomplete ones.",
      },
      {
        title: "Consider whether court is proportionate",
        body: "For a small sum it usually is not. Advice on that is worth having before spending anything on it.",
      },
    ],
    whenToGetHelp: [
      "The sum is substantial",
      "Someone was injured by the product",
      "The provider disputes that you are its customer",
      "The regulator route has been exhausted",
      "You are being asked to sign a release",
    ],
    referralRoutes: [
      "consumer-and-sector-regulators",
      "public-defender-and-citizens-rights",
      "university-law-clinics",
    ],
    related: {
      rights: ["consumer"],
      laws: ["consumer-protection-fccpa"],
      compliance: ["consumer-protection"],
      updates: ["fccpa-2018-consumer-framework"],
      terms: ["negligence"],
    },
    meta,
  },
  {
    id: "lp-12",
    slug: "something-happened-to-me-online",
    category: "Online",
    title: "Something has happened to you online",
    situation: "A scam, impersonation, harassment, leaked images, or misuse of your personal data.",
    summary:
      "What the Cybercrimes Act 2015 and the Nigeria Data Protection Act 2023 cover, why the first hour is mostly about preserving evidence, and where these complaints actually go.",
    icon: "wifi",
    urgency: "immediate",
    triage: [
      {
        id: "lp-12-q1",
        question: "What has happened?",
        answers: [
          {
            value: "money",
            label: "Money left an account",
            guidance:
              "Contact the bank immediately — speed matters more than anything else on this page. Then work through the evidence steps.",
            urgency: "immediate",
          },
          {
            value: "harassment",
            label: "Harassment, threats or impersonation",
            guidance:
              "Preserve everything before blocking anyone, and read the rights-organisations route if the conduct is targeted at you personally.",
            urgency: "immediate",
          },
          {
            value: "data",
            label: "My personal data was misused",
            guidance:
              "The Nigeria Data Protection Act 2023 material is the place to start, alongside a complaint to the organisation holding the data.",
            urgency: "time-sensitive",
          },
        ],
      },
      {
        id: "lp-12-q2",
        question: "Do you still have access to the account or device involved?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Preserve the evidence first, then secure the account. Doing it the other way round frequently destroys the record.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Recovery through the platform's own process comes first, and everything you can screenshot from elsewhere still counts.",
            urgency: "immediate",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "The Cybercrimes Act 2015 creates offences covering computer-related fraud, identity theft and related conduct",
      "The Nigeria Data Protection Act 2023 governs how personal data is processed, and gives data subjects rights over it",
      "The Constitution protects the privacy of citizens, their homes and their correspondence",
      "The Violence Against Persons (Prohibition) Act 2015 covers conduct including stalking and intimidation",
    ],
    doNow: [
      "Screenshot everything, including profiles, URLs, timestamps and transaction references",
      "Contact your bank immediately if money is involved",
      "Report to the platform through its own reporting process",
      "Secure your accounts and change reused passwords",
      "Write a dated account of what happened while it is fresh",
    ],
    avoid: [
      "Deleting messages or blocking before you have preserved them",
      "Paying anyone who promises to recover funds or take content down",
      "Responding to threats or engaging with the account",
      "Sending more money, documents or images",
      "Posting the other person's details publicly",
    ],
    steps: [
      {
        title: "Preserve first",
        body: "Screenshots, URLs, times, account handles, transaction references. Everything afterwards runs on this.",
      },
      {
        title: "Stop the loss",
        body: "Bank first if money moved; account security next. Speed genuinely affects what can be recovered.",
      },
      {
        title: "Report through the proper channels",
        body: "The platform, the bank, and the police where an offence is alleged. Keep every reference number.",
      },
      {
        title: "Deal with the data side separately",
        body: "Where an organisation mishandled your personal data, that is a data protection complaint in its own right.",
      },
      {
        title: "Get support where it is personal",
        body: "Where the conduct is targeted at you, the rights-organisations route offers support alongside legal assistance.",
      },
    ],
    whenToGetHelp: [
      "Intimate images or private material are being circulated",
      "You are being threatened or blackmailed",
      "A significant sum has been taken",
      "Your identity has been used to open accounts",
      "An organisation has lost or misused your personal data",
    ],
    referralRoutes: [
      "rights-organisations",
      "consumer-and-sector-regulators",
      "national-human-rights-commission",
      "nigerian-bar-association",
    ],
    related: {
      safety: ["online-scams"],
      laws: ["cybercrimes-act", "nigeria-data-protection-act"],
      rights: ["privacy"],
      compliance: ["data-protection"],
      terms: ["defamation"],
    },
    meta,
  },
  {
    id: "lp-13",
    slug: "a-family-marriage-or-inheritance-question",
    category: "Family",
    title: "A family, marriage or inheritance question",
    situation: "A separation, a question about children, or a dispute over what someone left behind.",
    summary:
      "Which system of law applies to a family matter, what the Child's Rights Act 2003 puts at the centre of decisions about children, and why these matters are handled earliest and most privately.",
    icon: "heart",
    urgency: "considered",
    triage: [
      {
        id: "lp-13-q1",
        question: "Is anyone at risk of harm right now?",
        answers: [
          {
            value: "yes",
            label: "Yes",
            guidance:
              "Safety comes before every legal question on this page. The rights-organisations route below includes organisations that provide support alongside legal assistance.",
            urgency: "immediate",
          },
          {
            value: "no",
            label: "No",
            guidance:
              "Then the matter can be approached in the order set out below, and early advice is worth more than early action.",
            urgency: "considered",
          },
        ],
      },
      {
        id: "lp-13-q2",
        question: "What is the matter about?",
        answers: [
          {
            value: "marriage",
            label: "A marriage or separation",
            guidance:
              "Which system of law governs the marriage decides much of the process. Establish that first.",
            urgency: "considered",
          },
          {
            value: "children",
            label: "Children",
            guidance:
              "The Child's Rights Act 2003 places the best interests of the child at the centre of decisions. Read that material first.",
            urgency: "time-sensitive",
          },
          {
            value: "inheritance",
            label: "Inheritance or an estate",
            guidance:
              "Whether there is a will, and which system of law applies, decides the route. The probate material is the starting point.",
            urgency: "considered",
          },
        ],
      },
    ],
    rightsInThisSituation: [
      "Family matters may be governed by statutory, customary or Islamic law, and which applies depends on the circumstances",
      "The Child's Rights Act 2003, as adopted in a state, places the best interests of the child at the centre of decisions affecting them",
      "The Violence Against Persons (Prohibition) Act 2015 covers domestic violence and related conduct",
      "The Constitution protects the dignity of the person and family life",
      "Succession is dealt with through the appropriate court process, and a valid will governs where one exists",
    ],
    doNow: [
      "Establish which system of law governed the marriage or the estate",
      "Collect certificates, agreements, wills and property documents",
      "Write down the arrangements currently in place for any children",
      "Keep records somewhere the other party cannot access",
      "Get advice before agreeing to anything about children or property",
    ],
    avoid: [
      "Removing children from their established arrangements without advice",
      "Distributing or selling estate property before the process is complete",
      "Signing a customary settlement you have not had explained to you",
      "Using children as leverage in a property or money dispute",
      "Assuming a verbal family agreement will be honoured later",
    ],
    steps: [
      {
        title: "Establish the governing system",
        body: "Statutory, customary or Islamic law — it decides the court, the process and much of the substance.",
      },
      {
        title: "Deal with safety first",
        body: "Where anyone is at risk, that is addressed before any other part of the matter.",
      },
      {
        title: "Put children first, explicitly",
        body: "Decisions about children are made on their best interests. Approaching it that way also produces better outcomes for the adults.",
      },
      {
        title: "Assemble the documents",
        body: "Certificates, wills, titles, and any written agreement. Family matters stall on missing documents more than on disagreement.",
      },
      {
        title: "Use mediation where it is safe to",
        body: "Family matters resolved by agreement generally cost less, last longer and hurt less. Where there is violence, mediation is not appropriate.",
      },
    ],
    whenToGetHelp: [
      "Anyone is at risk of harm",
      "Children's arrangements are in dispute",
      "An estate is being distributed and you are not sure the process is proper",
      "You are asked to sign a settlement or renunciation",
      "You do not know which system of law applies",
    ],
    referralRoutes: [
      "rights-organisations",
      "public-defender-and-citizens-rights",
      "legal-aid-council",
      "nigerian-bar-association",
    ],
    related: {
      terms: ["probate", "power-of-attorney", "affidavit"],
      laws: ["fundamental-rights-chapter-iv"],
      rights: ["fair-hearing"],
    },
    meta,
  },
];

/* -------------------------------------------------------------------------- */
/* Lawyer directory                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Directory listings.
 *
 * Spec section 36 requires verification to be backed by an actual
 * administrative process, and spec rule 23 forbids inventing professional
 * credentials. Until that process runs there are no verified practitioners to
 * publish, so every listing below is `listingStatus: "sample"` and is shaped as
 * a practice and a location rather than as a person. The filters, the facets
 * and the profile structure are real; the entries are structured sample data
 * (spec rule 29) and are labelled as such everywhere they appear.
 */
export const lawyerListings: LawyerListing[] = [
  {
    id: "ll-1",
    slug: "criminal-defence-lagos",
    displayName: "Criminal defence — Lagos",
    listingStatus: "sample",
    focus: "Police station attendance, bail applications and criminal trials.",
    practiceAreas: ["Criminal defence", "Human rights"],
    state: "Lagos",
    city: "Lagos Island",
    languages: ["English", "Yoruba", "Pidgin"],
    experienceBand: "11-20",
    availability: "accepting",
    consultation: "Initial consultation by appointment, in person or by telephone.",
    about: [
      "A practice of this shape handles matters from the station stage through to trial, and is the kind of listing someone dealing with an arrest is usually looking for.",
      "Practices in this area are often reachable at short notice, because station work does not keep office hours.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-2",
    slug: "employment-and-labour-lagos",
    displayName: "Employment and labour — Lagos",
    listingStatus: "sample",
    focus: "Termination, unpaid entitlements and National Industrial Court matters.",
    practiceAreas: ["Employment & labour", "Dispute resolution"],
    state: "Lagos",
    city: "Ikeja",
    languages: ["English", "Yoruba"],
    experienceBand: "6-10",
    availability: "accepting",
    consultation: "Written summary requested before the first consultation.",
    about: [
      "Employment practices work on both sides of the relationship, and the first question is usually which side a listing acts for.",
      "Matters in this area are frequently resolved before a hearing, so early advice tends to change the outcome.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-3",
    slug: "land-and-property-lagos",
    displayName: "Land and property — Lagos",
    listingStatus: "sample",
    focus: "Title investigation, Governor's consent, and land dispute litigation.",
    practiceAreas: ["Land & property", "Dispute resolution"],
    state: "Lagos",
    city: "Lekki",
    languages: ["English", "Yoruba", "Igbo"],
    experienceBand: "20+",
    availability: "waitlist",
    consultation: "Documents reviewed before a consultation is scheduled.",
    about: [
      "Land practices spend most of their time on documents, which is why a listing of this kind will normally ask for the chain of title before meeting.",
      "Work under the Land Use Act 1978 is state-specific, so location matters more here than in most other areas.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-4",
    slug: "corporate-and-commercial-lagos",
    displayName: "Corporate and commercial — Lagos",
    listingStatus: "sample",
    focus: "Company formation, shareholder arrangements and commercial agreements.",
    practiceAreas: ["Corporate & commercial", "Contracts"],
    state: "Lagos",
    city: "Victoria Island",
    languages: ["English", "French"],
    experienceBand: "11-20",
    availability: "accepting",
    consultation: "Scoped engagement, usually after an initial written brief.",
    about: [
      "Corporate practices work to CAMA 2020 and to the constitutional documents of the company, and generally take instructions from the company rather than from an individual.",
      "Where a dispute is between shareholders, a listing of this kind will usually say at the outset whom it can act for.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-5",
    slug: "family-law-abuja",
    displayName: "Family law — Abuja",
    listingStatus: "sample",
    focus: "Separation, arrangements for children, and estate administration.",
    practiceAreas: ["Family", "Succession"],
    state: "FCT",
    city: "Abuja",
    languages: ["English", "Hausa"],
    experienceBand: "6-10",
    availability: "accepting",
    consultation: "Private consultation, with a written summary provided afterwards.",
    about: [
      "Family practices work across statutory, customary and Islamic law, and establishing which applies is normally the first conversation.",
      "Matters involving children are approached on the child's best interests, which is the standard the Child's Rights Act 2003 sets.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-6",
    slug: "human-rights-abuja",
    displayName: "Human rights and public law — Abuja",
    listingStatus: "sample",
    focus: "Fundamental rights enforcement and complaints against public authorities.",
    practiceAreas: ["Human rights", "Criminal defence"],
    state: "FCT",
    city: "Abuja",
    languages: ["English", "Hausa", "Pidgin"],
    experienceBand: "11-20",
    availability: "accepting",
    consultation: "Urgent matters triaged ahead of scheduled consultations.",
    about: [
      "Practices in this area bring proceedings under the fundamental rights provisions of Chapter IV of the Constitution.",
      "Because these matters are often urgent, a listing of this kind will usually have a route for same-day contact.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-7",
    slug: "technology-and-data-lagos",
    displayName: "Technology and data protection — Lagos",
    listingStatus: "sample",
    focus: "NDP Act 2023 compliance, platform terms and data incidents.",
    practiceAreas: ["Technology & data", "Contracts"],
    state: "Lagos",
    city: "Yaba",
    languages: ["English"],
    experienceBand: "1-5",
    availability: "accepting",
    consultation: "Remote consultations by arrangement.",
    about: [
      "Data practices work to the Nigeria Data Protection Act 2023 and to sector rules that sit alongside it.",
      "Incident work is time-sensitive, so a listing in this area will usually distinguish between advisory work and incident response.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-8",
    slug: "debt-recovery-rivers",
    displayName: "Debt recovery and credit — Rivers",
    listingStatus: "sample",
    focus: "Recovery actions, security enforcement and restructuring agreements.",
    practiceAreas: ["Debt & recovery", "Dispute resolution"],
    state: "Rivers",
    city: "Port Harcourt",
    languages: ["English", "Pidgin", "Igbo"],
    experienceBand: "6-10",
    availability: "accepting",
    consultation: "Statement of account requested before first meeting.",
    about: [
      "Recovery practices act for creditors and for debtors, and which side a listing acts for is the first thing to establish.",
      "Most of the work is documentary, so the statement of account and the agreement decide the shape of the matter.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-9",
    slug: "consumer-and-regulatory-rivers",
    displayName: "Consumer and regulatory complaints — Rivers",
    listingStatus: "sample",
    focus: "FCCPA 2018 complaints and disputes with regulated providers.",
    practiceAreas: ["Consumer", "Regulatory"],
    state: "Rivers",
    city: "Port Harcourt",
    languages: ["English", "Pidgin"],
    experienceBand: "1-5",
    availability: "waitlist",
    consultation: "Complaint file reviewed before advice is given.",
    about: [
      "Consumer practices spend much of their time getting a complaint into the form the right regulator will act on.",
      "Where a sector regulator exists, a listing of this kind will normally take that route before considering court.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-10",
    slug: "criminal-defence-kano",
    displayName: "Criminal defence — Kano",
    listingStatus: "sample",
    focus: "Bail applications, criminal trials and appeals.",
    practiceAreas: ["Criminal defence", "Human rights"],
    state: "Kano",
    city: "Kano",
    languages: ["English", "Hausa"],
    experienceBand: "11-20",
    availability: "accepting",
    consultation: "Family members may attend the first consultation.",
    about: [
      "Defence practices work to the Administration of Criminal Justice Act 2015 and to the criminal procedure rules of the state.",
      "A listing of this kind is generally contacted by a relative rather than by the person in custody.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-11",
    slug: "land-and-property-kaduna",
    displayName: "Land and property — Kaduna",
    listingStatus: "sample",
    focus: "Title, family land disputes and boundary matters.",
    practiceAreas: ["Land & property", "Family"],
    state: "Kaduna",
    city: "Kaduna",
    languages: ["English", "Hausa"],
    experienceBand: "20+",
    availability: "not-accepting",
    consultation: "Not taking new matters at present.",
    about: [
      "Family land matters sit across land law and succession, and a listing of this shape will usually deal with both.",
      "A listing that is not accepting new matters still appears in the directory, because availability changes and hiding it would mislead.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-12",
    slug: "employment-and-labour-oyo",
    displayName: "Employment and labour — Oyo",
    listingStatus: "sample",
    focus: "Workplace disputes, disciplinary processes and settlement agreements.",
    practiceAreas: ["Employment & labour"],
    state: "Oyo",
    city: "Ibadan",
    languages: ["English", "Yoruba"],
    experienceBand: "6-10",
    availability: "accepting",
    consultation: "Initial consultation by appointment.",
    about: [
      "Employment practices outside the commercial centres handle a high proportion of unpaid-wage and process matters.",
      "Where mediation through a state citizens' rights office is available, a listing of this kind will often use it first.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-13",
    slug: "commercial-disputes-enugu",
    displayName: "Commercial disputes — Enugu",
    listingStatus: "sample",
    focus: "Contract disputes, arbitration and business relationship breakdowns.",
    practiceAreas: ["Dispute resolution", "Contracts", "Corporate & commercial"],
    state: "Enugu",
    city: "Enugu",
    languages: ["English", "Igbo"],
    experienceBand: "11-20",
    availability: "accepting",
    consultation: "Contract and correspondence reviewed before advice.",
    about: [
      "Dispute practices read the dispute resolution clause first, because it frequently decides the forum before anyone chooses one.",
      "The Arbitration and Mediation Act 2023 is the framework where a contract points a dispute away from the courts.",
    ],
    credentials: [],
    meta,
  },
  {
    id: "ll-14",
    slug: "intellectual-property-edo",
    displayName: "Intellectual property — Edo",
    listingStatus: "sample",
    focus: "Copyright, trade marks and creator agreements.",
    practiceAreas: ["Intellectual property", "Contracts"],
    state: "Edo",
    city: "Benin City",
    languages: ["English", "Pidgin"],
    experienceBand: "1-5",
    availability: "accepting",
    consultation: "Remote consultations available.",
    about: [
      "Intellectual property practices work to the Copyright Act 2022 and the trade mark framework, and much of the work is registration and licensing.",
      "Creator work is increasingly contractual, so a listing of this kind normally reads the agreement before anything else.",
    ],
    credentials: [],
    meta,
  },
];

/* -------------------------------------------------------------------------- */
/* Ask a Question — moderated public Q&A                                       */
/* -------------------------------------------------------------------------- */

/**
 * Published questions.
 *
 * Spec section 37: a question does not become public automatically. Everything
 * here has been through moderation and carries an editorial answer written as
 * general legal information. Attribution is pseudonymous, and no question
 * retains a detail that could identify the person or their matter.
 *
 * `lawyerNote` is absent throughout: no practitioner response is published
 * until a named practitioner has actually given one.
 */
export const publicQuestions: PublicQuestion[] = [
  {
    id: "pq-1",
    slug: "can-the-police-hold-someone-without-charge",
    question: "How long can someone be held at a police station without being taken to court?",
    askedBy: "Anonymous · Lagos",
    topic: "Police & criminal",
    askedOn: "2026-08-22",
    generalAnswer: [
      "This is one of the most common questions we receive, and the short answer is that the Constitution does not leave it open-ended. Chapter IV protects personal liberty, and it provides that a person taken into custody must be brought before a court within a period the Constitution itself sets out — with the length depending on the circumstances, including how far the nearest court is.",
      "In practice, the more useful question for a family is usually a different one: which station is the person at, has the reason for the detention been given, and has a lawyer been able to see them. Those three facts determine what can actually be done next.",
    ],
    whatTheLawSays: [
      "Chapter IV of the 1999 Constitution (as amended) protects personal liberty and requires that a person deprived of liberty be informed of the reason",
      "The Constitution provides for a person in custody to be brought before a court within a defined period",
      "The Administration of Criminal Justice Act 2015 governs arrest, custody records and the treatment of people in custody",
    ],
    whatToDoNext: [
      "Confirm the exact station and the name the person was booked under",
      "Get a lawyer engaged — the Legal Aid Council route exists for people who cannot pay",
      "Keep a written record of every visit, name and time",
      "Where the detention appears to be outside what the law allows, raise it with a lawyer immediately rather than at the station counter",
    ],
    related: {
      problems: ["someone-is-being-held-at-a-station"],
      rights: ["arrest-and-detention", "bail"],
      laws: ["fundamental-rights-chapter-iv"],
      terms: ["habeas-corpus"],
    },
    meta,
  },
  {
    id: "pq-2",
    slug: "is-a-verbal-agreement-binding",
    question: "Is a verbal agreement binding, or does everything have to be in writing?",
    askedBy: "Anonymous · Abuja",
    topic: "Contracts",
    askedOn: "2026-08-19",
    generalAnswer: [
      "Many agreements can be made without writing. The difficulty is almost never whether an agreement exists — it is proving what its terms were when the two sides remember them differently.",
      "Some categories of transaction do attract formal requirements, and land is the obvious example, where documentation and registration matter enormously. But for ordinary commercial arrangements the practical answer is that a verbal agreement can bind you and can also leave you with nothing you can demonstrate.",
    ],
    whatTheLawSays: [
      "The Evidence Act 2011 governs how the terms of an agreement are proved",
      "Certain transactions, particularly those involving land, carry documentation and registration requirements",
      "Conduct, correspondence and payment records can evidence an agreement where no single document sets it out",
    ],
    whatToDoNext: [
      "Confirm any verbal arrangement by message or email the same day",
      "Keep invoices, transfers and delivery records together and in date order",
      "For anything material, put the terms in a short written document both sides sign",
      "Read the Contract Knowledge Centre entry for the type of agreement you are making",
    ],
    related: {
      problems: ["the-other-side-is-not-honouring-the-agreement"],
      safety: ["before-you-sign"],
      contracts: ["service-agreement"],
      compliance: ["contracts"],
    },
    meta,
  },
  {
    id: "pq-3",
    slug: "landlord-changed-the-locks",
    question: "My landlord changed the locks while I was out. Is that allowed?",
    askedBy: "Anonymous · Ogun",
    topic: "Home & land",
    askedOn: "2026-08-15",
    generalAnswer: [
      "Recovery of premises is a legal process. A landlord who wants possession is expected to use that process rather than to take steps that put a tenant out of the property directly — and that is the case whatever is owed in rent.",
      "The detail of the process is state law, and it differs, so advice from someone who knows the rules where the property is will be more useful than a general answer. What is consistent is that the existence of arrears does not convert self-help into a lawful route.",
    ],
    whatTheLawSays: [
      "Tenancy and the recovery of premises are governed largely by state tenancy laws and by the agreement between the parties",
      "Those laws set out the notices required and the process for recovering possession",
      "The Constitution protects the dignity of the person and the peaceful enjoyment of property rights",
    ],
    whatToDoNext: [
      "Photograph the property and the changed locks, with the date",
      "Write to the landlord recording what happened, and keep the copy",
      "Take the tenancy agreement and the record to a state citizens' rights office or a lawyer",
      "Keep paying what you can, and keep every receipt",
    ],
    related: {
      problems: ["my-landlord-wants-me-out"],
      safety: ["tenancy-agreement"],
      contracts: ["lease-agreement"],
      terms: ["trespass"],
    },
    meta,
  },
  {
    id: "pq-4",
    slug: "can-i-be-arrested-over-a-debt",
    question: "A lender says I will be arrested if I do not pay. Can that happen?",
    askedBy: "Anonymous · Rivers",
    topic: "Money & debt",
    askedOn: "2026-08-11",
    generalAnswer: [
      "An ordinary debt is a civil obligation. Failing to pay a debt is not, by itself, a criminal offence, and a lender's remedy for non-payment is a civil one — the agreement, and where necessary the courts.",
      "That is a different question from whether an allegation of fraud has been made, which is a criminal allegation and is treated as one. If you are being told that non-payment alone will result in arrest, that is worth taking to a lawyer rather than acting on.",
      "Separately, threats and contacting a borrower's friends or family about their debt raise issues of their own, including under data protection law.",
    ],
    whatTheLawSays: [
      "A debt arising from a loan or a contract is a civil obligation enforced through civil process",
      "The Nigeria Data Protection Act 2023 governs how personal data is processed, including by lenders and recovery agents",
      "Threats and harassment are not lawful methods of recovery",
    ],
    whatToDoNext: [
      "Record the date, time and content of any threatening contact",
      "Establish exactly what is owed and on what terms",
      "Put any dispute about the amount in writing",
      "Take persistent harassment or misuse of your contacts to advice — it is a separate matter from the debt",
    ],
    related: {
      problems: ["i-am-owed-money-or-being-pursued-for-it"],
      safety: ["borrowing"],
      laws: ["nigeria-data-protection-act"],
    },
    meta,
  },
  {
    id: "pq-5",
    slug: "dismissed-without-notice",
    question: "I was dismissed without notice and without being paid. Where do I start?",
    askedBy: "Anonymous · Lagos",
    topic: "Work",
    askedOn: "2026-08-06",
    generalAnswer: [
      "Start with two things: what the contract said about termination, and what the payment record shows. Almost every employment matter turns on those two, and both can be assembled before you take advice.",
      "The Labour Act governs wages, conditions and termination for the categories of worker it covers, and the contract governs alongside it. The National Industrial Court has jurisdiction over employment matters, but many are resolved by written complaint or mediation long before a claim is filed.",
    ],
    whatTheLawSays: [
      "The Labour Act governs wages, working conditions and termination for the categories of worker it covers",
      "The contract of employment governs the relationship alongside the Act",
      "The National Industrial Court has jurisdiction over labour and employment matters",
      "Claims are subject to time limits, so delay carries a real cost",
    ],
    whatToDoNext: [
      "Collect the contract, payslips, bank records and any handbook",
      "Write a dated timeline of what happened",
      "Put the complaint to the employer in writing",
      "Consider a state citizens' rights office for mediation before litigation",
    ],
    related: {
      problems: ["i-lost-my-job-or-was-not-paid"],
      rights: ["at-work"],
      laws: ["employment-contracts-and-termination"],
      safety: ["employment-offer"],
    },
    meta,
  },
  {
    id: "pq-6",
    slug: "someone-is-impersonating-me-online",
    question: "Someone created an account pretending to be me. What can I actually do?",
    askedBy: "Anonymous · FCT",
    topic: "Online",
    askedOn: "2026-07-30",
    generalAnswer: [
      "Preserve first. The most common mistake is to report and block immediately, which frequently removes your own access to the evidence. Screenshot the profile, the posts, the URL and the timestamps before you do anything else.",
      "The Cybercrimes Act 2015 creates offences covering identity-related conduct online, and the platform's own reporting process usually acts faster than any other route. Where the impersonation has been used to obtain money from people who know you, that is worth reporting formally as well.",
    ],
    whatTheLawSays: [
      "The Cybercrimes Act 2015 creates offences covering computer-related fraud and identity theft",
      "The Constitution protects the privacy of citizens and their correspondence",
      "The Nigeria Data Protection Act 2023 governs the processing of personal data",
    ],
    whatToDoNext: [
      "Screenshot everything, including URLs and timestamps, before reporting",
      "Use the platform's impersonation reporting process",
      "Warn your own contacts directly so they do not respond to the account",
      "Where money has been taken from anyone, keep the transaction references",
    ],
    related: {
      problems: ["something-happened-to-me-online"],
      safety: ["online-scams"],
      laws: ["cybercrimes-act"],
      rights: ["privacy"],
    },
    meta,
  },
  {
    id: "pq-7",
    slug: "do-i-need-a-lawyer-to-buy-land",
    question: "Do I really need a lawyer to buy land, or can I do the checks myself?",
    askedBy: "Anonymous · Oyo",
    topic: "Home & land",
    askedOn: "2026-07-24",
    generalAnswer: [
      "You can do some of it yourself, and you should — reading the documents, visiting the land, and asking who else claims an interest in it are all things a buyer can do. What is hard to do without a practitioner is the search, the chain of title and the question of whether the required consents exist.",
      "Land is the category where the cost of getting it wrong is highest and where problems surface years later, when the people involved are no longer reachable. It is the transaction we would least recommend anyone complete on their own.",
    ],
    whatTheLawSays: [
      "The Land Use Act 1978 vests land in each state in the Governor, held in trust, and what a holder has is a right of occupancy",
      "Certain transactions require the consent of the Governor",
      "Registration and the documented chain of transactions are what an interest is proved with",
    ],
    whatToDoNext: [
      "Read the Stay Safe guide on buying property before you pay anything",
      "Have a search conducted by someone qualified to conduct it",
      "Confirm what consents the transaction requires",
      "Keep every receipt, and never pay for land in a way that leaves no record",
    ],
    related: {
      problems: ["someone-is-claiming-my-land"],
      safety: ["buying-property"],
      laws: ["land-use-act-and-title"],
      industries: ["real-estate"],
    },
    meta,
  },
];
