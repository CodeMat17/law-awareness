import type { LawHistory } from "./types";

/**
 * Law versioning and amendment tracking (Phase 6) — spec section 56.
 *
 * EDITORIAL RULES enforced in this file:
 *
 * 1. `effective` is a YEAR, not a commencement date. A precise date of
 *    commencement is exactly the sort of detail that is easy to state
 *    confidently and get wrong, and a wrong commencement date is worse than no
 *    date at all. Where the year itself is contested the field says so.
 * 2. Every instrument named below is real and well known. No repeal,
 *    alteration or subsidiary instrument is invented.
 * 3. `whatChanged` describes the change in general terms — the subject matter
 *    it addressed — never the wording of a provision.
 * 4. Superseded versions are never removed. That is the whole point of this
 *    record: a reader who finds an old copy of an Act needs to be able to see
 *    where it sits in the history, not be told it does not exist.
 *
 * Exactly one version per history carries `current: true`, and the repository
 * asserts nothing about that — it is a discipline of this file, checked by
 * `getCurrentVersion()` returning `null` rather than guessing.
 */

const REVIEWED = "2026-09-09";

const meta = {
  status: "published",
  review: "educational",
  lastReviewed: REVIEWED,
} as const;

export const lawHistories: LawHistory[] = [
  {
    id: "lh-1",
    lawSlug: "fundamental-rights-chapter-iv",
    category: "constitution",
    instrument: "Constitution of the Federal Republic of Nigeria 1999",
    whereToFindIt:
      "The consolidated Constitution as altered is published by the National Assembly and by the Federal Government. Read the official text, and check whether a later Alteration Act touches the provision you are relying on.",
    versions: [
      {
        id: "lh-1-v5",
        label: "1999 Constitution as altered by the Fifth Alteration Acts",
        kind: "alteration",
        effective: "2023",
        current: true,
        whatChanged: [
          "A series of Alteration Acts addressing, among other matters, the devolution of certain items between the legislative lists, judicial and legislative administration, and the timing of transitional arrangements.",
          "The Fifth Alteration was enacted as a set of separate Acts rather than a single instrument, which is why the alterations are cited individually.",
        ],
        significance:
          "If you are relying on a constitutional provision, the alterations are where you check that the version in your hand is still the operative one.",
      },
      {
        id: "lh-1-v4",
        label: "1999 Constitution as altered by the Fourth Alteration Acts",
        kind: "alteration",
        effective: "2017",
        current: false,
        whatChanged: [
          "Alterations addressing, among other things, timelines in election petitions, and aspects of legislative and judicial administration.",
        ],
      },
      {
        id: "lh-1-v3",
        label: "1999 Constitution as altered by the Third Alteration Act",
        kind: "alteration",
        effective: "2010",
        current: false,
        whatChanged: [
          "Established the National Industrial Court as a superior court of record within the constitutional structure and dealt with its jurisdiction.",
        ],
        significance:
          "This is the alteration behind the modern position of the National Industrial Court, and behind the long argument about appeals from it.",
      },
      {
        id: "lh-1-v2",
        label:
          "1999 Constitution as altered by the First and Second Alteration Acts",
        kind: "alteration",
        effective: "2010",
        current: false,
        whatChanged: [
          "Alterations addressing electoral timelines and related institutional provisions.",
        ],
      },
      {
        id: "lh-1-v1",
        label: "Constitution of the Federal Republic of Nigeria 1999",
        kind: "enactment",
        effective: "1999",
        current: false,
        whatChanged: [
          "Returned Nigeria to constitutional civilian rule, establishing the current structure of the Federation, the fundamental rights in Chapter IV, and the court system in Chapter VII.",
        ],
        significance:
          "Everything the platform explains about rights, courts and legislative competence begins here.",
      },
    ],
    meta,
  },
  {
    id: "lh-2",
    lawSlug: "registering-a-company",
    category: "business-corporate",
    instrument: "Companies and Allied Matters Act 2020",
    topic: "corporate-law",
    whereToFindIt:
      "The Act is published by the Federal Government, and the Corporate Affairs Commission publishes the regulations made under it. Check the Commission's own material for current filing practice.",
    versions: [
      {
        id: "lh-2-v3",
        label: "Companies and Allied Matters Act 2020 (with regulations made under it)",
        kind: "subsidiary-instrument",
        effective: "2021",
        current: true,
        whatChanged: [
          "Companies Regulations made by the Corporate Affairs Commission under the Act deal with the practical machinery — forms, filings and procedure.",
          "Regulations change more often than the Act, so the Act alone will not tell you what a filing requires today.",
        ],
        significance:
          "The commonest mistake is reading the Act and assuming that is the whole obligation. The procedure lives in the regulations.",
      },
      {
        id: "lh-2-v2",
        label: "Companies and Allied Matters Act 2020",
        kind: "repeal-and-re-enactment",
        effective: "2020",
        current: false,
        whatChanged: [
          "Repealed and replaced the 1990 Act in its entirety.",
          "Introduced, among other things, provision for a single-member private company, a statutory framework for limited partnerships and limited liability partnerships, and changes to company secretary requirements for small companies.",
          "Reworked provisions on company registers, beneficial interest disclosure and insolvency.",
        ],
        significance:
          "Anything written about Nigerian company law before 2020 has to be read with care — the governing Act changed completely.",
      },
      {
        id: "lh-2-v1",
        label: "Companies and Allied Matters Act 1990",
        kind: "enactment",
        effective: "1990",
        current: false,
        whatChanged: [
          "The previous companies statute, consolidated as Cap C20 of the Laws of the Federation 2004, and the framework under which most older Nigerian companies were incorporated.",
        ],
      },
    ],
    meta,
  },
  {
    id: "lh-3",
    lawSlug: "nigeria-data-protection-act",
    category: "data-protection",
    instrument: "Nigeria Data Protection Act 2023",
    topic: "data-protection",
    whereToFindIt:
      "The Act is published by the Federal Government, and the Nigeria Data Protection Commission publishes guidance and instruments made under it. The Commission's own material is the place to check current obligations.",
    versions: [
      {
        id: "lh-3-v3",
        label: "Nigeria Data Protection Act 2023",
        kind: "enactment",
        effective: "2023",
        current: true,
        whatChanged: [
          "Put data protection in Nigeria on a statutory footing for the first time, replacing a regime that had rested on a regulation issued by an agency.",
          "Established the Nigeria Data Protection Commission and set out the duties of data controllers and processors, the lawful bases for processing, and the rights of data subjects.",
        ],
        significance:
          "The change from a regulation to an Act matters: obligations now sit in primary legislation, with a dedicated regulator behind them.",
      },
      {
        id: "lh-3-v2",
        label: "Nigeria Data Protection Regulation 2019 (NDPR)",
        kind: "subsidiary-instrument",
        effective: "2019",
        current: false,
        whatChanged: [
          "Issued by the National Information Technology Development Agency, this was the instrument that introduced most Nigerian organisations to data protection compliance.",
          "Much of the practice built around it — audits, filings and data protection officers — carried into the current regime.",
        ],
      },
      {
        id: "lh-3-v1",
        label: "The constitutional privacy guarantee",
        kind: "enactment",
        effective: "1999",
        current: false,
        whatChanged: [
          "Before either instrument, privacy in Nigeria rested on the constitutional guarantee of the privacy of citizens, their homes, correspondence and communications.",
          "That guarantee has not gone anywhere — it sits beneath the statutory regime rather than being replaced by it.",
        ],
      },
    ],
    meta,
  },
  {
    id: "lh-4",
    lawSlug: "copyright-act-2022",
    category: "intellectual-property",
    instrument: "Copyright Act 2022",
    topic: "intellectual-property",
    whereToFindIt:
      "The Act is published by the Federal Government, and the Nigerian Copyright Commission publishes material on its administration.",
    versions: [
      {
        id: "lh-4-v2",
        label: "Copyright Act 2022",
        kind: "repeal-and-re-enactment",
        effective: "2023",
        current: true,
        whatChanged: [
          "Repealed and replaced the previous Copyright Act.",
          "Modernised the framework for the digital environment, including provisions addressing online infringement and the responsibilities of intermediaries, and reworked provisions on exceptions and on collective management.",
        ],
        significance:
          "Advice on Nigerian copyright written before this Act may describe a framework that no longer applies, particularly online.",
      },
      {
        id: "lh-4-v1",
        label: "Copyright Act 1988 (Cap C28 LFN 2004)",
        kind: "enactment",
        effective: "1988",
        current: false,
        whatChanged: [
          "The previous copyright statute, consolidated in the 2004 Laws of the Federation, which governed Nigerian copyright for over three decades.",
        ],
      },
    ],
    meta,
  },
  {
    id: "lh-5",
    lawSlug: "how-a-criminal-case-moves",
    category: "criminal-law",
    instrument: "Administration of Criminal Justice Act 2015",
    whereToFindIt:
      "The Act is published by the Federal Government. Many states have enacted their own Administration of Criminal Justice Laws, and which one applies depends on the court your matter is in.",
    versions: [
      {
        id: "lh-5-v3",
        label: "State Administration of Criminal Justice Laws",
        kind: "enactment",
        effective: "2015 onwards",
        current: true,
        whatChanged: [
          "States have progressively enacted their own criminal justice administration laws modelled on the federal Act.",
          "Which law governs your matter depends on the court — the federal Act does not automatically apply in a state court.",
        ],
        significance:
          "This is why a general statement about criminal procedure in Nigeria can be right in one state and wrong in another.",
      },
      {
        id: "lh-5-v2",
        label: "Administration of Criminal Justice Act 2015",
        kind: "repeal-and-re-enactment",
        effective: "2015",
        current: false,
        whatChanged: [
          "Replaced the older Criminal Procedure Act and Criminal Procedure Code framework for federal courts with a single administration of criminal justice statute.",
          "Introduced measures aimed at reducing delay and at regulating arrest and custody practice, including provisions on the recording of confessional statements and on reporting persons held in custody.",
        ],
        significance:
          "Most of what is modern in Nigerian criminal procedure — and most of what a person in custody can point to — comes from this Act.",
      },
      {
        id: "lh-5-v1",
        label: "Criminal Procedure Act and Criminal Procedure Code",
        kind: "enactment",
        effective: "Colonial era, consolidated 2004",
        current: false,
        whatChanged: [
          "The two older procedural codes, applying in the southern and northern parts of the country respectively, which governed criminal procedure before the 2015 Act.",
        ],
      },
    ],
    meta,
  },
  {
    id: "lh-6",
    lawSlug: "land-use-act-and-title",
    category: "land-and-property",
    instrument: "Land Use Act 1978",
    topic: "real-estate",
    whereToFindIt:
      "The Act is consolidated in the Laws of the Federation, and it is also entrenched in the Constitution. State governments publish their own procedures for consent and for certificates of occupancy.",
    versions: [
      {
        id: "lh-6-v2",
        label: "Land Use Act 1978, entrenched by the Constitution",
        kind: "enactment",
        effective: "1999",
        current: true,
        whatChanged: [
          "The 1999 Constitution carries the Land Use Act within its provisions, which is why the Act is not amended the way an ordinary statute is.",
          "Practice around it — consent applications, certificates of occupancy, governor's consent for alienation — is administered at state level and changes without the Act changing.",
        ],
        significance:
          "The Act is stable; the state-level procedure under it is not. Confirm current practice with the relevant state land authority.",
      },
      {
        id: "lh-6-v1",
        label: "Land Use Act 1978",
        kind: "enactment",
        effective: "1978",
        current: false,
        whatChanged: [
          "Vested land in each state in the Governor to hold in trust, and converted existing freehold interests into rights of occupancy.",
          "Introduced the requirement of the Governor's consent for the alienation of an interest in land.",
        ],
        significance:
          "Every Nigerian land transaction since is conducted in the shadow of this Act.",
      },
    ],
    meta,
  },
  {
    id: "lh-7",
    lawSlug: "consumer-protection-fccpa",
    category: "consumer-protection",
    instrument: "Federal Competition and Consumer Protection Act 2018",
    topic: "consumer-protection",
    whereToFindIt:
      "The Act is published by the Federal Government, and the Federal Competition and Consumer Protection Commission publishes its own regulations, orders and guidance.",
    versions: [
      {
        id: "lh-7-v2",
        label: "Federal Competition and Consumer Protection Act 2018",
        kind: "repeal-and-re-enactment",
        effective: "2018",
        current: true,
        whatChanged: [
          "Repealed and replaced the previous consumer protection statute and established the Federal Competition and Consumer Protection Commission.",
          "Brought competition law and consumer protection into a single framework, with provisions on restrictive agreements, abuse of dominance, merger review and consumer rights.",
        ],
        significance:
          "Nigeria acquired a general competition regime with this Act. Before it, there was consumer protection but no across-the-board competition law.",
      },
      {
        id: "lh-7-v1",
        label: "Consumer Protection Council Act",
        kind: "enactment",
        effective: "1992",
        current: false,
        whatChanged: [
          "Established the Consumer Protection Council, the body whose functions the 2018 Act reorganised into the current Commission.",
        ],
      },
    ],
    meta,
  },
  {
    id: "lh-8",
    lawSlug: "employment-contracts-and-termination",
    category: "employment",
    instrument: "Labour Act (Cap L1 LFN 2004)",
    topic: "employment",
    whereToFindIt:
      "The Labour Act is consolidated in the Laws of the Federation. Employment questions in Nigeria are also shaped by the decisions of the National Industrial Court, which applies international best practice in the way the Constitution permits.",
    versions: [
      {
        id: "lh-8-v3",
        label: "The Labour Act as applied by the National Industrial Court",
        kind: "enactment",
        effective: "2010 onwards",
        current: true,
        whatChanged: [
          "The constitutional alteration that established the National Industrial Court gave employment matters a specialist court that applies international labour standards and best practice.",
          "Much of what is current in Nigerian employment law is found in that court's decisions rather than in an amendment to the Act.",
        ],
        significance:
          "Reading the Labour Act alone gives an incomplete picture of what an employer can and cannot do today.",
      },
      {
        id: "lh-8-v2",
        label: "Labour Act, consolidated as Cap L1 LFN 2004",
        kind: "enactment",
        effective: "2004",
        current: false,
        whatChanged: [
          "The consolidation in which the Act is normally cited. It applies principally to workers doing manual labour or clerical work, which is a limitation many readers do not expect.",
        ],
      },
      {
        id: "lh-8-v1",
        label: "Labour Act 1974",
        kind: "enactment",
        effective: "1974",
        current: false,
        whatChanged: [
          "The original statute governing contracts of employment, wages, hours and terms for the workers it covers.",
        ],
      },
    ],
    meta,
  },
  {
    id: "lh-9",
    lawSlug: "cybercrimes-act",
    category: "digital",
    instrument:
      "Cybercrimes (Prohibition, Prevention etc.) Act 2015",
    topic: "technology-law",
    whereToFindIt:
      "The Act and its amendment are published by the Federal Government. Where a provision of the Act is being applied to you, read the current text — this is an area where the wording has been changed.",
    versions: [
      {
        id: "lh-9-v2",
        label: "Cybercrimes Act 2015 as amended",
        kind: "amendment",
        effective: "2024",
        current: true,
        whatChanged: [
          "An amendment Act addressed provisions of the 2015 Act, including the much-litigated provision on cyberstalking, which had been the subject of sustained criticism and of litigation over its effect on expression.",
        ],
        significance:
          "If you have read about this Act and free expression, check which version the discussion is about — the provision at the centre of that argument has been amended.",
      },
      {
        id: "lh-9-v1",
        label: "Cybercrimes (Prohibition, Prevention etc.) Act 2015",
        kind: "enactment",
        effective: "2015",
        current: false,
        whatChanged: [
          "Nigeria's principal statute on offences committed with computers and networks, covering unauthorised access, computer-related fraud, identity theft and related conduct, together with duties placed on service providers.",
        ],
      },
    ],
    meta,
  },
];
