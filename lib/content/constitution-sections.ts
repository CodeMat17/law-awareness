import type { ConstitutionSection } from "./types";

/**
 * Sections of the Constitution, searchable and cross-referenced — the data
 * behind the Constitution Explorer (spec section 30).
 *
 * EDITORIAL RULE: `heading` names the section as the document names it and
 * `plainLanguage` is our explanation of it. There is no `officialText` field —
 * we do not reproduce the words, and every rendered section is paired with a
 * pane telling the reader where the official text lives. The distinction
 * between the document and our explanation of it is structural here, not a
 * matter of remembering to add a disclaimer.
 *
 * This is not every section of the Constitution. It is the sections readers
 * actually meet, and the explorer says so rather than implying completeness.
 */
export const constitutionSections: ConstitutionSection[] = [
  /* Chapter I — General Provisions ---------------------------------------- */
  {
    id: "cs-1",
    number: "1",
    chapter: "I",
    heading: "Supremacy of the Constitution",
    plainLanguage:
      "The Constitution binds every authority and person in Nigeria, and where another law is inconsistent with it the Constitution prevails and that other law is void to the extent of the inconsistency. It also provides that no person may take control of government except as the Constitution allows.",
    qualifications: [
      "Inconsistency voids the other law only to the extent of the inconsistency — not the whole statute.",
    ],
    related: {
      cases: ["governor-of-lagos-state-v-ojukwu", "abacha-v-fawehinmi"],
    },
  },
  {
    id: "cs-2",
    number: "2",
    chapter: "I",
    heading: "The Federal Republic of Nigeria",
    plainLanguage:
      "Declares Nigeria one indivisible, indissoluble sovereign state, and a federation consisting of states and a Federal Capital Territory.",
  },
  {
    id: "cs-3",
    number: "4",
    chapter: "I",
    heading: "Legislative powers",
    plainLanguage:
      "Divides the power to make law. The National Assembly legislates on the Exclusive Legislative List; both it and the State Houses of Assembly may legislate on the Concurrent List; the states cover what remains. Where a federal and a state law on a concurrent matter conflict, the federal law prevails.",
    qualifications: [
      "A law made outside the legislature's competence is void, and the courts will say so.",
    ],
    related: {
      cases: [
        "attorney-general-ondo-v-attorney-general-federation",
        "attorney-general-lagos-v-attorney-general-federation",
      ],
    },
  },
  {
    id: "cs-4",
    number: "5",
    chapter: "I",
    heading: "Executive powers",
    plainLanguage:
      "Vests the executive power of the Federation in the President and of a state in its Governor, exercisable directly or through officers subordinate to them, and marks out the limits of that power.",
  },
  {
    id: "cs-5",
    number: "6",
    chapter: "I",
    heading: "Judicial powers",
    plainLanguage:
      "Vests judicial power in the courts the Constitution establishes, and extends it to all matters between persons, or between government and any person, that concern the determination of civil rights and obligations.",
    qualifications: [
      "The same section limits how far the courts will examine the Chapter II objectives.",
    ],
    related: {
      cases: ["adesanya-v-president", "elelu-habeeb-v-attorney-general"],
    },
  },
  {
    id: "cs-6",
    number: "7",
    chapter: "I",
    heading: "Local government system",
    plainLanguage:
      "Guarantees a system of democratically elected local government councils, and places duties on the states in relation to their establishment, structure, finance and functions.",
    related: {
      cases: ["attorney-general-lagos-v-attorney-general-federation"],
    },
  },
  {
    id: "cs-7",
    number: "12",
    chapter: "I",
    heading: "Implementation of treaties",
    plainLanguage:
      "A treaty between Nigeria and another country has no force of law here until the National Assembly enacts it. That is why an international convention can be argued in a Nigerian court only once it has been domesticated.",
    related: { cases: ["abacha-v-fawehinmi"] },
  },

  /* Chapter II — Fundamental Objectives ------------------------------------ */
  {
    id: "cs-8",
    number: "13",
    chapter: "II",
    heading: "Fundamental obligations of the Government",
    plainLanguage:
      "Directs every organ of government, and every person exercising legislative, executive or judicial power, to conform to and apply the provisions of Chapter II.",
    qualifications: [
      "Chapter II is framed as objectives of state policy, and is expressed differently from the enforceable rights in Chapter IV.",
    ],
  },
  {
    id: "cs-9",
    number: "14",
    chapter: "II",
    heading: "The Government and the people",
    plainLanguage:
      "States that Nigeria is a state based on democracy and social justice, that sovereignty belongs to the people, and that the security and welfare of the people is the primary purpose of government.",
  },
  {
    id: "cs-10",
    number: "15",
    chapter: "II",
    heading: "Political objectives",
    plainLanguage:
      "Sets political objectives including national integration and the prohibition of discrimination, and directs the State to abolish corrupt practices and abuse of power.",
    related: {
      cases: ["attorney-general-ondo-v-attorney-general-federation"],
    },
  },
  {
    id: "cs-11",
    number: "17",
    chapter: "II",
    heading: "Social objectives",
    plainLanguage:
      "Directs the social order towards freedom, equality and justice, with objectives covering equality before the law, humane conditions of work, and the protection of children and the vulnerable.",
    related: { rights: ["at-work"] },
  },
  {
    id: "cs-12",
    number: "20",
    chapter: "II",
    heading: "Environmental objectives",
    plainLanguage:
      "Directs the State to protect and improve the environment and to safeguard the water, air, land, forest and wildlife of Nigeria.",
  },
  {
    id: "cs-13",
    number: "24",
    chapter: "II",
    heading: "Duties of the citizen",
    plainLanguage:
      "Sets out what citizens owe in return — obedience to the Constitution and to lawful authority, respect for the dignity and rights of others, and the honest declaration of income and payment of tax.",
  },

  /* Chapter III — Citizenship ---------------------------------------------- */
  {
    id: "cs-14",
    number: "25",
    chapter: "III",
    heading: "Citizenship by birth",
    plainLanguage:
      "Defines who is a Nigerian citizen by birth, by reference to birth in Nigeria and to parentage or grandparentage belonging to a community indigenous to Nigeria.",
  },
  {
    id: "cs-15",
    number: "26",
    chapter: "III",
    heading: "Citizenship by registration",
    plainLanguage:
      "Provides for citizenship by registration in the circumstances the section defines, on application to the President and subject to the conditions it states.",
  },
  {
    id: "cs-16",
    number: "27",
    chapter: "III",
    heading: "Citizenship by naturalisation",
    plainLanguage:
      "Provides for the grant of a certificate of naturalisation where an applicant satisfies the requirements the section sets out, including residence and good character.",
  },

  /* Chapter IV — Fundamental Rights ---------------------------------------- */
  {
    id: "cs-17",
    number: "33",
    chapter: "IV",
    heading: "Right to life",
    plainLanguage:
      "No one may be intentionally deprived of life, save in execution of the sentence of a court for a criminal offence of which they have been found guilty, and in the narrow circumstances the section itself sets out.",
    qualifications: [
      "The section states its own exceptions, including the use of force reasonably necessary in defined situations.",
    ],
    related: {
      rights: ["arrest-and-detention"],
      cases: ["ransome-kuti-v-attorney-general"],
    },
  },
  {
    id: "cs-18",
    number: "34",
    chapter: "IV",
    heading: "Right to dignity of the human person",
    plainLanguage:
      "Prohibits torture and inhuman or degrading treatment, slavery and servitude, and forced or compulsory labour. This is the right most often engaged by how a person is treated in custody.",
    related: {
      laws: ["fundamental-rights-chapter-iv"],
      rights: ["arrest-and-detention", "police-stop"],
      cases: ["ransome-kuti-v-attorney-general"],
    },
  },
  {
    id: "cs-19",
    number: "35",
    chapter: "IV",
    heading: "Right to personal liberty",
    plainLanguage:
      "Sets out when a person may lawfully be deprived of liberty, requires that an arrested person be informed in writing of the reason within the period stated, and requires that they be brought before a court within the periods the section prescribes.",
    qualifications: [
      "The section lists the situations in which deprivation of liberty is permitted.",
      "It also provides for compensation and a public apology where the deprivation was unlawful.",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves"],
      rights: ["arrest-and-detention", "bail", "police-stop"],
      cases: ["dokubo-asari-v-federal-republic-of-nigeria"],
      terms: ["bail", "habeas-corpus"],
    },
  },
  {
    id: "cs-20",
    number: "36",
    chapter: "IV",
    heading: "Right to fair hearing",
    plainLanguage:
      "Guarantees a fair hearing within a reasonable time by a court or tribunal that is independent and impartial, with the presumption of innocence and the protections that attach to a criminal charge — being informed of the charge, having time to prepare a defence, and having a legal practitioner of your own choice.",
    qualifications: [
      "It also provides that no person may be convicted of an offence that is not defined, with its penalty prescribed, in a written law.",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv"],
      rights: ["fair-hearing"],
      cases: [
        "garba-v-university-of-maiduguri",
        "ariori-v-elemo",
        "aoko-v-fagbemi",
      ],
    },
  },
  {
    id: "cs-21",
    number: "37",
    chapter: "IV",
    heading: "Right to private and family life",
    plainLanguage:
      "Protects the privacy of citizens, their homes, correspondence, telephone conversations and telegraphic communications. It is the constitutional footing beneath Nigeria's data protection regime.",
    related: {
      laws: ["nigeria-data-protection-act"],
      rights: ["privacy"],
    },
  },
  {
    id: "cs-22",
    number: "38",
    chapter: "IV",
    heading: "Right to freedom of thought, conscience and religion",
    plainLanguage:
      "Includes the freedom to change religion or belief, and to manifest and propagate it in worship, teaching, practice and observance, alone or with others.",
  },
  {
    id: "cs-23",
    number: "39",
    chapter: "IV",
    heading: "Right to freedom of expression and the press",
    plainLanguage:
      "Freedom to hold opinions and to receive and impart ideas and information without interference, and to own or operate a medium for disseminating information, subject to the conditions the section states.",
    related: { terms: ["defamation"] },
  },
  {
    id: "cs-24",
    number: "40",
    chapter: "IV",
    heading: "Right to peaceful assembly and association",
    plainLanguage:
      "The freedom to assemble peacefully and to associate with others, including to form or belong to a trade union or a political party.",
    related: { rights: ["at-work"] },
  },
  {
    id: "cs-25",
    number: "41",
    chapter: "IV",
    heading: "Right to freedom of movement",
    plainLanguage:
      "Freedom to move throughout Nigeria and to reside in any part of it, and freedom from being expelled from Nigeria or refused entry to it, with the qualifications the section states.",
  },
  {
    id: "cs-26",
    number: "42",
    chapter: "IV",
    heading: "Right to freedom from discrimination",
    plainLanguage:
      "Protects a citizen from being subjected to disabilities or restrictions, or given privileges, by reason only of community, ethnic group, place of origin, sex, religion or political opinion.",
  },
  {
    id: "cs-27",
    number: "43",
    chapter: "IV",
    heading: "Right to acquire and own immovable property",
    plainLanguage:
      "Every citizen has the right to acquire and own immovable property anywhere in Nigeria — a right that operates alongside, and is shaped by, the Land Use Act.",
    related: {
      laws: ["land-use-act-and-title"],
      cases: ["savannah-bank-v-ajilo"],
    },
  },
  {
    id: "cs-28",
    number: "44",
    chapter: "IV",
    heading: "Compulsory acquisition of property",
    plainLanguage:
      "Movable property and interests in immovable property may not be compulsorily taken except in the manner, and for the purposes, prescribed by a law that requires prompt payment of compensation and gives access to a court.",
    qualifications: [
      "The section carries its own list of situations to which the protection does not apply.",
    ],
  },
  {
    id: "cs-29",
    number: "45",
    chapter: "IV",
    heading: "Restriction on and derogation from fundamental rights",
    plainLanguage:
      "Permits laws that are reasonably justifiable in a democratic society in the interest of defence, public safety, public order, public morality or public health, or to protect the rights of others — and addresses derogation during a period of emergency. Most real arguments about rights are fought here rather than over the right itself.",
    related: {
      cases: ["dokubo-asari-v-federal-republic-of-nigeria"],
    },
  },
  {
    id: "cs-30",
    number: "46",
    chapter: "IV",
    heading: "Special jurisdiction of the High Court",
    plainLanguage:
      "A person who alleges that a Chapter IV right has been, is being, or is likely to be contravened may apply to the High Court of the state where it occurred. This is the door to the fundamental rights enforcement procedure.",
    related: {
      laws: ["enforcing-fundamental-rights"],
      cases: ["uzoukwu-v-ezeonu", "adesanya-v-president"],
      terms: ["fundamental-rights"],
    },
  },

  /* Chapters VI–VIII — institutions ---------------------------------------- */
  {
    id: "cs-31",
    number: "153",
    chapter: "VI",
    heading: "Federal executive bodies",
    plainLanguage:
      "Establishes a set of federal bodies in the Constitution itself rather than by ordinary legislation — among them the National Judicial Council, the Independent National Electoral Commission and the Federal Character Commission — which is why their functions cannot simply be legislated away.",
    related: { cases: ["elelu-habeeb-v-attorney-general"] },
  },
  {
    id: "cs-32",
    number: "162",
    chapter: "VI",
    heading: "The Federation Account",
    plainLanguage:
      "Establishes the Federation Account and provides for the distribution of revenue among the Federal Government, the states and the local government councils.",
    related: {
      cases: ["attorney-general-lagos-v-attorney-general-federation"],
    },
  },
  {
    id: "cs-33",
    number: "214",
    chapter: "VII",
    heading: "The Nigeria Police Force",
    plainLanguage:
      "Establishes the Nigeria Police Force as the police force for Nigeria, and provides that no other police force shall be established for the Federation or any part of it except as the section allows.",
    related: {
      rights: ["police-stop", "arrest-and-detention"],
    },
  },
  {
    id: "cs-34",
    number: "232",
    chapter: "VII",
    heading: "Original jurisdiction of the Supreme Court",
    plainLanguage:
      "Gives the Supreme Court original jurisdiction in disputes between the Federation and a state, or between states, where the dispute involves a question of law or fact on which the existence of a legal right depends. It is why some constitutional disputes begin at the top instead of working their way up.",
    related: {
      cases: [
        "attorney-general-lagos-v-attorney-general-federation",
        "attorney-general-ondo-v-attorney-general-federation",
      ],
    },
  },
  {
    id: "cs-35",
    number: "251",
    chapter: "VII",
    heading: "Jurisdiction of the Federal High Court",
    plainLanguage:
      "Lists the matters over which the Federal High Court has exclusive jurisdiction, including much of revenue, company, admiralty, banking and federal agency litigation. Filing in the wrong court is one of the most common and most expensive procedural mistakes.",
    related: { laws: ["registering-a-company"] },
  },
  {
    id: "cs-36",
    number: "285",
    chapter: "VII",
    heading: "Election tribunals",
    plainLanguage:
      "Establishes election petition tribunals and sets strict limits on the time within which petitions must be filed and determined. Those limits are constitutional, and a court has no power to extend them.",
    related: { cases: ["amaechi-v-inec", "awolowo-v-shagari"] },
  },
  {
    id: "cs-37",
    number: "305",
    chapter: "VIII",
    heading: "Proclamation of a state of emergency",
    plainLanguage:
      "Sets out the procedure by which the President may proclaim a state of emergency, the conditions for doing so, and the requirement of approval by the National Assembly.",
    related: { cases: ["governor-of-lagos-state-v-ojukwu"] },
  },
  {
    id: "cs-38",
    number: "308",
    chapter: "VIII",
    heading: "Restriction on legal proceedings",
    plainLanguage:
      "While in office, the President, Vice-President, Governors and Deputy Governors are protected from civil and criminal proceedings against them in their personal capacity, on the terms the section sets. The protection ends when the office does.",
  },
  {
    id: "cs-39",
    number: "315",
    chapter: "VIII",
    heading: "Existing law",
    plainLanguage:
      "Provides how laws already in force when the Constitution came into effect continue to operate, and how they are to be read so as to bring them into conformity with it.",
  },
];
