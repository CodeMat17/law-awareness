/**
 * The structure of the Constitution of the Federal Republic of Nigeria 1999
 * (as amended).
 *
 * EDITORIAL RULE: this file records the document's own structure — chapter
 * titles and the subject each chapter deals with — and describes them in
 * general terms. It does not reproduce the text, and it invents nothing. Where
 * a reader needs the words, they should read the official text.
 */

export interface ConstitutionChapter {
  /** Roman numeral as the Constitution itself numbers it. */
  numeral: string;
  title: string;
  /** What the chapter is for, in a sentence. */
  summary: string;
  /** The matters it deals with. */
  covers: string[];
  /** Where a reader can go next on this platform, if anywhere. */
  href?: string;
  hrefLabel?: string;
}

export const constitutionChapters: ConstitutionChapter[] = [
  {
    numeral: "I",
    title: "General Provisions",
    summary:
      "Establishes the Constitution's supremacy and the basic architecture of the Federation.",
    covers: [
      "Supremacy of the Constitution over other laws",
      "The Federation and its territorial structure",
      "Federal, state and local government powers",
      "The legislative lists that divide law-making authority",
    ],
  },
  {
    numeral: "II",
    title: "Fundamental Objectives and Directive Principles of State Policy",
    summary:
      "Sets out the goals the State is directed to pursue — political, economic, social, educational, environmental and foreign policy objectives.",
    covers: [
      "Political, economic and social objectives",
      "Educational and environmental objectives",
      "Directive principles addressed to the organs of government",
      "Framed as objectives of state policy, and expressed differently from the enforceable rights in Chapter IV",
    ],
  },
  {
    numeral: "III",
    title: "Citizenship",
    summary:
      "Defines who is a Nigerian citizen and how citizenship is acquired, renounced or lost.",
    covers: [
      "Citizenship by birth",
      "Citizenship by registration and by naturalisation",
      "Dual citizenship",
      "Renunciation and deprivation of citizenship",
    ],
  },
  {
    numeral: "IV",
    title: "Fundamental Rights",
    summary:
      "The rights an individual holds against the State and can enforce in court — the chapter most people mean when they talk about their rights.",
    covers: [
      "The individual rights listed below, section by section",
      "The circumstances in which those rights may lawfully be restricted",
      "Derogation during a period of emergency",
      "Special jurisdiction of the High Court to hear enforcement claims",
    ],
    href: "/your-rights",
    hrefLabel: "Rights guides",
  },
  {
    numeral: "V",
    title: "The Legislature",
    summary:
      "Establishes the National Assembly and the Houses of Assembly of the States, and how law is made.",
    covers: [
      "Composition of the Senate and House of Representatives",
      "State Houses of Assembly",
      "The procedure for making law",
      "Powers, privileges and control of public funds",
    ],
  },
  {
    numeral: "VI",
    title: "The Executive",
    summary:
      "Establishes the Presidency and the office of Governor, and the executive machinery of the Federation and the States.",
    covers: [
      "The President, Vice-President and Ministers",
      "Governors, Deputy Governors and Commissioners",
      "Executive powers and their limits",
      "Federal and state executive bodies established by the Constitution",
    ],
  },
  {
    numeral: "VII",
    title: "The Judicature",
    summary:
      "Establishes the courts, their composition and their jurisdiction — the structure a case moves through.",
    covers: [
      "The Supreme Court and the Court of Appeal",
      "The Federal High Court and the High Courts",
      "The National Industrial Court",
      "Sharia and Customary Courts of Appeal",
      "Appointment and tenure of judicial officers",
    ],
    href: "/cases",
    hrefLabel: "How judgments work",
  },
  {
    numeral: "VIII",
    title:
      "Federal Capital Territory, Abuja and General Supplementary Provisions",
    summary:
      "Deals with the Federal Capital Territory and carries the general and supplementary provisions, including transitional matters and interpretation.",
    covers: [
      "Administration of the Federal Capital Territory, Abuja",
      "Emergency powers",
      "Interpretation, citation and transitional provisions",
    ],
  },
];

/**
 * The rights in Chapter IV, in the order the Constitution lists them.
 *
 * Section numbers are stated because they are part of the document's own
 * structure and are used constantly in practice. Nothing here reproduces or
 * paraphrases the operative text as though it were the text.
 */
export interface FundamentalRight {
  section: string;
  title: string;
  summary: string;
  href?: string;
}

export const fundamentalRights: FundamentalRight[] = [
  {
    section: "33",
    title: "Right to life",
    summary:
      "Protects a person from being intentionally deprived of life, subject to the exceptions the section itself sets out.",
  },
  {
    section: "34",
    title: "Right to dignity of the human person",
    summary:
      "Prohibits torture and inhuman or degrading treatment, slavery, servitude and forced labour.",
  },
  {
    section: "35",
    title: "Right to personal liberty",
    summary:
      "Governs when a person may lawfully be deprived of liberty, and carries the requirements around being informed of the reason for an arrest and being brought before a court.",
    href: "/your-rights/arrest-and-detention",
  },
  {
    section: "36",
    title: "Right to fair hearing",
    summary:
      "A hearing within a reasonable time by an independent and impartial court or tribunal, with the presumption of innocence and the protections that go with a criminal charge.",
  },
  {
    section: "37",
    title: "Right to private and family life",
    summary:
      "Protects the privacy of citizens, their homes, correspondence and communications — the constitutional footing beneath Nigeria's data protection regime.",
    href: "/your-rights/privacy",
  },
  {
    section: "38",
    title: "Right to freedom of thought, conscience and religion",
    summary:
      "Includes freedom to change religion or belief and to manifest it in worship, teaching, practice and observance.",
  },
  {
    section: "39",
    title: "Right to freedom of expression and the press",
    summary:
      "Freedom to hold opinions and to receive and impart ideas and information without interference, including press freedom.",
  },
  {
    section: "40",
    title: "Right to peaceful assembly and association",
    summary:
      "Includes the freedom to form or belong to a trade union or a political party.",
  },
  {
    section: "41",
    title: "Right to freedom of movement",
    summary:
      "Freedom to move throughout Nigeria and to reside in any part of it, with the qualifications the section states.",
  },
  {
    section: "42",
    title: "Right to freedom from discrimination",
    summary:
      "Protects against discrimination on grounds including community, ethnic group, place of origin, sex, religion and political opinion.",
  },
  {
    section: "43",
    title: "Right to acquire and own immovable property",
    summary:
      "Every citizen may acquire and own immovable property anywhere in Nigeria.",
    href: "/know-the-law/land-and-property",
  },
  {
    section: "44",
    title: "Compulsory acquisition of property",
    summary:
      "Restricts the compulsory taking of property and addresses compensation, on the terms the section sets out.",
  },
  {
    section: "45",
    title: "Restriction on and derogation from fundamental rights",
    summary:
      "Permits laws reasonably justifiable in a democratic society for defined purposes, and addresses derogation during a period of emergency. This is where most real arguments about rights are fought.",
  },
  {
    section: "46",
    title: "Special jurisdiction of the High Court",
    summary:
      "Gives a person who alleges a breach a route to the High Court in the state where it occurred, and provides for legal aid arrangements.",
  },
];
