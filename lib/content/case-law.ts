import type { CaseRecord, CourtProfile } from "./types";

/**
 * Case Law Explorer seed (Phase 6) — spec section 29.
 *
 * EDITORIAL RULES enforced in this file, so they cannot be lost in editing:
 *
 * 1. Every case below is a real, decided Nigerian case that is taught,
 *    reported and cited by name. Nothing here is invented.
 * 2. NO CITATION IS STATED. Law-report series, volumes and pages, and the
 *    composition of a panel, are exactly the details that cannot be reproduced
 *    from memory without risking a reference that leads nowhere — and a false
 *    citation is worse than no citation. `whereToFindIt` tells the reader how
 *    to locate the reported decision instead, and the type has no `citation`
 *    or `judge` field at all so one cannot be added carelessly.
 * 3. Every record states the principle NARROWLY — the proposition the case is
 *    genuinely cited for — and carries `doesNotSettle`, so a summary can never
 *    be stretched into a holding the court did not make.
 * 4. Everything is `review: "educational"`. No entry claims to have been
 *    verified against the report until a named editor has actually done it.
 *
 * The explorer's facets are derived from these records, so a court, year or
 * subject can never appear as a filter option with nothing behind it.
 */

/** The hierarchy, ranked. Rank 0 is the final court. */
export const courtProfiles: CourtProfile[] = [
  {
    id: "supreme-court",
    name: "Supreme Court of Nigeria",
    rank: 0,
    jurisdiction:
      "The final court. It hears appeals from the Court of Appeal and has original jurisdiction in disputes between the Federation and a state, or between states.",
    bindingEffect:
      "Binds every other court in Nigeria. Only the Supreme Court itself can depart from its own earlier decision.",
  },
  {
    id: "court-of-appeal",
    name: "Court of Appeal",
    rank: 1,
    jurisdiction:
      "Hears appeals from the High Courts, the National Industrial Court and various tribunals.",
    bindingEffect:
      "Binds every court below it, and is itself bound by the Supreme Court.",
  },
  {
    id: "federal-high-court",
    name: "Federal High Court",
    rank: 2,
    jurisdiction:
      "The federal subjects the Constitution assigns to it, including many revenue, admiralty, company and federal agency matters.",
    bindingEffect:
      "Its decisions do not bind other High Courts, but they are persuasive and are regularly cited.",
  },
  {
    id: "state-high-court",
    name: "State High Courts and the High Court of the FCT",
    rank: 2,
    jurisdiction:
      "General jurisdiction, and the court a person approaches to enforce a fundamental right under Chapter IV.",
    bindingEffect:
      "Binds the courts below it in the state. A decision of one High Court is persuasive, not binding, on another.",
  },
  {
    id: "national-industrial-court",
    name: "National Industrial Court",
    rank: 2,
    jurisdiction:
      "Labour, employment, trade union and workplace matters.",
    bindingEffect:
      "Binds nothing above it, and appeals from it run to the Court of Appeal on the terms the Constitution sets.",
  },
  {
    id: "tribunal",
    name: "Tribunals",
    rank: 3,
    jurisdiction:
      "Bodies established by statute for a defined subject — election petitions, tax appeals, investment and securities disputes and others.",
    bindingEffect:
      "Bound by the courts above them, and their decisions are appealable on the terms their establishing statute sets.",
  },
];

const REVIEWED = "2026-09-09";

const meta = {
  status: "published",
  review: "educational",
  lastReviewed: REVIEWED,
} as const;

/** The one sentence every case page repeats about locating the report. */
const FIND_IN_REPORTS =
  "This decision is reported in the Nigerian law reports. Locate it by its case name in a law report series or through the court's own record, and read the judgment before relying on it.";

export const caseRecords: CaseRecord[] = [
  {
    id: "case-1",
    slug: "aoko-v-fagbemi",
    title: "Aoko v. Fagbemi",
    court: "state-high-court",
    year: 1961,
    subject: "criminal-law",
    legalIssue:
      "Can a person be convicted of conduct that no written law defines as an offence?",
    issueTag: "Legality of offences",
    background: [
      "A woman was convicted by a customary court of adultery, which was treated as an offence in the local customary setting.",
      "The conviction was challenged on the ground that adultery was not an offence under any written law applying to her.",
    ],
    decision: [
      "The conviction was set aside.",
      "The court held that a person cannot be convicted of an offence unless that offence is defined, and its penalty prescribed, in a written law.",
    ],
    keyPrinciple:
      "There is no criminal offence in Nigeria except one created by a written law that also prescribes its punishment.",
    plainLanguage: [
      "You cannot be punished for breaking a rule that was never written down as a crime. Somebody's disapproval — even a whole community's — is not a criminal offence.",
      "This is the reason a police officer, a landlord, an employer or a neighbour cannot invent an offence and have you punished for it. If nobody can point at the written law and the punishment it sets, there is no crime.",
    ],
    doesNotSettle: [
      "It does not mean conduct is lawful merely because you have not personally read the law that prohibits it.",
      "It does not decide anything about civil liability — conduct that is not a crime can still be actionable between private parties.",
      "It does not affect the operation of customary or Islamic personal law in matters that are not criminal.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution's guarantee that offences must be defined in written law",
      "The Criminal Code",
    ],
    related: {
      laws: ["how-a-criminal-case-moves", "fundamental-rights-chapter-iv"],
      rights: ["fair-hearing", "arrest-and-detention"],
      sections: ["36"],
      cases: ["garba-v-university-of-maiduguri"],
      terms: ["bail"],
    },
    meta,
  },
  {
    id: "case-2",
    slug: "awolowo-v-shagari",
    title: "Awolowo v. Shagari",
    court: "supreme-court",
    year: 1979,
    subject: "electoral",
    legalIssue:
      "How is a constitutional requirement expressed as a fraction of a number of states to be calculated?",
    issueTag: "Constitutional interpretation",
    background: [
      "The 1979 presidential election required the leading candidate to obtain a stated share of the votes in a fraction of the states of the Federation.",
      "The result turned on how that fraction was to be computed where the number of states did not divide evenly.",
    ],
    decision: [
      "The Supreme Court upheld the declaration of the result.",
      "It construed the constitutional requirement as the electoral body had applied it, and the petition failed.",
    ],
    keyPrinciple:
      "A constitutional formula is applied as the Constitution's own words require, and an election result is not disturbed on a construction the text does not bear.",
    plainLanguage: [
      "Nigeria's first presidential election under the 1979 Constitution came down to arithmetic — how to treat a fraction of a number of states that does not divide cleanly.",
      "The case is remembered less for the arithmetic than for what it showed: a presidential result was contested in court, argued, and decided by judges rather than in the street.",
    ],
    doesNotSettle: [
      "It construes a provision of the 1979 Constitution. The current requirements for a presidential result are those set out in the 1999 Constitution as amended.",
      "It decides nothing about how election petitions are conducted today, which is governed by current electoral legislation and the practice directions of the election tribunals.",
    ],
    standing: "overtaken-by-statute",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution of 1979"],
    related: {
      sections: ["1"],
      cases: ["nafiu-rabiu-v-state", "inakoju-v-adeleke"],
    },
    meta,
  },
  {
    id: "case-3",
    slug: "nafiu-rabiu-v-state",
    title: "Nafiu Rabiu v. The State",
    court: "supreme-court",
    year: 1981,
    subject: "constitution",
    legalIssue:
      "What approach should a court take when construing a provision of the Constitution?",
    issueTag: "Constitutional interpretation",
    background: [
      "A criminal appeal raised a question about the jurisdiction conferred by the Constitution, and so required the Supreme Court to decide how constitutional provisions are to be read.",
    ],
    decision: [
      "The Court held that the Constitution should be given a broad and generous construction that serves its purpose.",
      "A narrow or technical reading should not be preferred where it would defeat what the provision was plainly intended to achieve.",
    ],
    keyPrinciple:
      "The Constitution is interpreted broadly and purposively, not with the narrow technicality applied to ordinary statutes.",
    plainLanguage: [
      "Judges read the Constitution differently from the way they read an ordinary Act. It is the founding document, meant to last, so it is read for its purpose rather than picked apart word by word to reach a cramped result.",
      "This is the case lawyers cite whenever the other side's reading of a constitutional provision is technically available but obviously defeats the point of the provision.",
    ],
    doesNotSettle: [
      "A generous construction is not a licence to read into the Constitution something it does not say.",
      "It does not decide any particular constitutional question — it states the approach, not the answer.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution"],
    related: {
      laws: ["fundamental-rights-chapter-iv"],
      sections: ["1"],
      cases: ["adesanya-v-president", "abacha-v-fawehinmi"],
    },
    meta,
  },
  {
    id: "case-4",
    slug: "adesanya-v-president",
    title: "Senator Abraham Adesanya v. President of the Federal Republic of Nigeria",
    court: "supreme-court",
    year: 1981,
    subject: "constitution",
    legalIssue:
      "Who may bring an action to challenge the constitutionality of an act of government?",
    issueTag: "Standing to sue",
    background: [
      "A senator challenged an appointment made by the President, having taken part in the proceedings of the Senate that considered it.",
      "The question was whether he had sufficient interest to bring the challenge to court at all.",
    ],
    decision: [
      "The Supreme Court held that the action failed for want of standing on the facts before it.",
      "A plaintiff must show a sufficient interest in the matter — a civil right or obligation of their own that is in issue — before a court will entertain the claim.",
    ],
    keyPrinciple:
      "A person challenging governmental action must show sufficient interest of their own; a general interest shared with every citizen is not by itself enough.",
    plainLanguage: [
      "Before a court will hear you, it asks what this has to do with you. Being a concerned citizen has, historically, not been enough on its own to challenge a government decision that does not touch your own rights.",
      "This rule has been softened in the years since, particularly in fundamental rights and public-interest matters, and modern rules of court on rights enforcement are far more generous. But standing is still the first question, and it is still where public-interest cases die.",
    ],
    doesNotSettle: [
      "It does not close the door on public-interest litigation, and later authority and the rules governing fundamental rights enforcement have widened access considerably.",
      "It says nothing about the merits of the underlying challenge — the case failed at the threshold.",
    ],
    standing: "distinguished",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution of 1979"],
    related: {
      laws: ["enforcing-fundamental-rights"],
      sections: ["6", "46"],
      cases: ["ransome-kuti-v-attorney-general", "nafiu-rabiu-v-state"],
      terms: ["fundamental-rights"],
    },
    meta,
  },
  {
    id: "case-5",
    slug: "ariori-v-elemo",
    title: "Ariori v. Elemo",
    court: "supreme-court",
    year: 1983,
    subject: "court-process",
    legalIssue:
      "What does the constitutional right to a fair hearing within a reasonable time require, and can it be waived?",
    issueTag: "Fair hearing",
    background: [
      "Proceedings had taken an extraordinary length of time to be concluded, and the delay was said to have deprived a party of a fair hearing.",
    ],
    decision: [
      "The Supreme Court treated the right to a hearing within a reasonable time as an integral part of the right to a fair hearing, not an optional extra.",
      "It considered how far a party can be taken to have given up such a right, and held that the fullest protection belongs to a party who has not knowingly and deliberately relinquished it.",
    ],
    keyPrinciple:
      "A hearing that is not concluded within a reasonable time is not a fair hearing, and the right is not lightly treated as waived.",
    plainLanguage: [
      "Justice arriving eventually is not the same as justice. The Constitution's promise of a fair hearing includes a hearing that actually finishes within a reasonable time.",
      "What counts as reasonable depends on the case — its complexity, what each side did, and what was at stake. Delay you caused yourself is a different thing from delay imposed on you.",
    ],
    doesNotSettle: [
      "It fixes no time limit. There is no number of months after which a case is automatically unfair.",
      "It does not mean every delayed case is decided in favour of the party complaining of delay.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution — the fair hearing guarantee"],
    related: {
      laws: ["fundamental-rights-chapter-iv"],
      rights: ["fair-hearing"],
      sections: ["36"],
      cases: ["garba-v-university-of-maiduguri"],
      terms: ["limitation-period"],
    },
    meta,
  },
  {
    id: "case-6",
    slug: "ransome-kuti-v-attorney-general",
    title: "Ransome-Kuti v. Attorney-General of the Federation",
    court: "supreme-court",
    year: 1985,
    subject: "human-rights",
    legalIssue:
      "Can the State be held answerable for a breach of fundamental rights committed by its agents?",
    issueTag: "Enforcing rights against the State",
    background: [
      "Proceedings were brought following the destruction of property and injury arising from the conduct of soldiers.",
      "The claim raised whether the fundamental rights guaranteed by the Constitution could be enforced against the State in respect of that conduct.",
    ],
    decision: [
      "The Supreme Court affirmed that fundamental rights are enforceable, and addressed the State's answerability for the acts of its agents.",
      "It discussed the nature of a fundamental right as one that stands above ordinary legislation.",
    ],
    keyPrinciple:
      "Fundamental rights are enforceable against the State, and are of a different order from rights conferred by ordinary legislation.",
    plainLanguage: [
      "The Constitution's rights are not promises the government makes to itself. They can be enforced in court against the government and the people acting for it.",
      "That is the foundation the whole fundamental rights enforcement procedure rests on — without it, Chapter IV would be a list of good intentions.",
    ],
    doesNotSettle: [
      "It does not make every wrong committed by a public officer a breach of fundamental rights — many are ordinary civil claims.",
      "It does not decide what remedy follows in any particular case.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution — Chapter IV"],
    related: {
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      rights: ["arrest-and-detention", "privacy"],
      sections: ["33", "34", "46"],
      cases: ["governor-of-lagos-state-v-ojukwu", "abacha-v-fawehinmi"],
      terms: ["fundamental-rights", "habeas-corpus"],
    },
    meta,
  },
  {
    id: "case-7",
    slug: "governor-of-lagos-state-v-ojukwu",
    title: "Military Governor of Lagos State v. Ojukwu",
    court: "supreme-court",
    year: 1986,
    subject: "constitution",
    legalIssue:
      "May the executive take matters into its own hands while the courts are seised of the dispute?",
    issueTag: "Rule of law",
    background: [
      "A dispute over possession of premises was before the court when the executive acted to take possession itself.",
      "The question was what the courts should do when the executive presents them with a fait accompli.",
    ],
    decision: [
      "The Supreme Court condemned executive self-help and ordered that the position be restored.",
      "It held that the executive is bound by the law and by the orders of the courts, and cannot resort to force while a matter is pending.",
    ],
    keyPrinciple:
      "The rule of law binds the executive: government may not use its power to pre-empt a court, and must obey court orders.",
    plainLanguage: [
      "This is the case Nigerian lawyers reach for when a government body ignores a court. The Supreme Court said plainly that the executive is under the law, not above it, and that self-help is not available to it.",
      "It matters far beyond its own facts: it is the reason a court order against a government agency is a legal obligation and not a suggestion.",
    ],
    doesNotSettle: [
      "It provides no mechanism for enforcing an order against a government that simply refuses — that remains one of the hardest practical problems in Nigerian public law.",
      "It does not decide who was entitled to the premises as a matter of property law.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution"],
    related: {
      laws: ["fundamental-rights-chapter-iv"],
      sections: ["1", "6"],
      cases: ["ransome-kuti-v-attorney-general", "attorney-general-lagos-v-attorney-general-federation"],
      terms: ["injunction"],
    },
    meta,
  },
  {
    id: "case-8",
    slug: "garba-v-university-of-maiduguri",
    title: "Garba v. University of Maiduguri",
    court: "supreme-court",
    year: 1986,
    subject: "education",
    legalIssue:
      "Can a domestic disciplinary body determine allegations that amount to criminal conduct?",
    issueTag: "Fair hearing",
    background: [
      "Students were expelled by their university following disturbances, on allegations that amounted to criminal conduct.",
      "The disciplinary process was carried out by the institution's own panel rather than by a court.",
    ],
    decision: [
      "The Supreme Court set the expulsions aside.",
      "It held that where allegations against a person amount to a crime, it is for a court — not a domestic tribunal — to determine guilt, and that the right to a fair hearing applies to the process.",
    ],
    keyPrinciple:
      "A domestic disciplinary panel cannot determine allegations of criminal conduct; that is the function of a court, and fair hearing applies throughout.",
    plainLanguage: [
      "If your school, employer or association accuses you of something that is actually a crime, it cannot sit as a court and find you guilty of it. That is a job for the courts.",
      "The institution may still have its own disciplinary rules for conduct short of crime — but the more the allegation looks like a criminal charge, the less a private panel can do about it.",
    ],
    doesNotSettle: [
      "It does not prevent an institution from disciplining conduct that is a breach of its rules but not a crime.",
      "It does not decide what happens to a person's status while a criminal matter is pending.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution — the fair hearing guarantee"],
    related: {
      laws: ["fundamental-rights-chapter-iv", "how-a-criminal-case-moves"],
      rights: ["fair-hearing", "at-work"],
      sections: ["36"],
      cases: ["ariori-v-elemo", "aoko-v-fagbemi"],
    },
    meta,
  },
  {
    id: "case-9",
    slug: "savannah-bank-v-ajilo",
    title: "Savannah Bank of Nigeria Ltd v. Ajilo",
    court: "supreme-court",
    year: 1989,
    subject: "land-and-property",
    legalIssue:
      "Is the Governor's consent required before a holder of a deemed right of occupancy may alienate an interest in land?",
    issueTag: "Land Use Act consent",
    background: [
      "Land was mortgaged to secure a facility. The mortgage was later attacked on the ground that the Governor's consent required by the Land Use Act 1978 had not been obtained.",
    ],
    decision: [
      "The Supreme Court held that the consent requirement applies to holders of deemed rights of occupancy as well as to statutory grants.",
      "A transaction caught by the requirement and carried out without consent is exposed to challenge.",
    ],
    keyPrinciple:
      "The Land Use Act's consent requirement extends to deemed rights of occupancy, and alienation without the required consent is not safe.",
    plainLanguage: [
      "In Nigeria, land you hold is held under the Land Use Act, and transferring, mortgaging or otherwise dealing with your interest generally needs the Governor's consent.",
      "This decision is why every careful land transaction asks about consent early. A deal that skips it can be unwound long after the money has changed hands — and the person who paid is usually the one who suffers.",
    ],
    doesNotSettle: [
      "It does not decide the consequence of a want of consent in every transaction — the effect has been examined in later cases and depends on the facts.",
      "It does not tell you whether consent is required for your particular transaction. That needs advice on the actual documents.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["Land Use Act 1978"],
    related: {
      laws: ["land-use-act-and-title"],
      safety: ["buying-property"],
      terms: ["power-of-attorney"],
      cases: ["attorney-general-lagos-v-attorney-general-federation"],
    },
    meta,
  },
  {
    id: "case-10",
    slug: "uzoukwu-v-ezeonu",
    title: "Uzoukwu v. Ezeonu II",
    court: "court-of-appeal",
    year: 1991,
    subject: "human-rights",
    legalIssue:
      "What is the difference between a human right and a fundamental right as the Constitution uses the term?",
    issueTag: "Nature of rights",
    background: [
      "The proceedings raised whether a complaint fell within the fundamental rights the Constitution makes specially enforceable, or was an ordinary claim.",
    ],
    decision: [
      "The Court of Appeal drew the distinction: human rights belong to a person by virtue of being human, while fundamental rights are those the Constitution has entrenched and made enforceable by a special procedure.",
    ],
    keyPrinciple:
      "Not every human right is a fundamental right; the special enforcement procedure is available only for rights the Constitution has entrenched.",
    plainLanguage: [
      "This distinction decides which door you go through. A Chapter IV right gets the fast, special enforcement procedure in the High Court. A wrong that is not one of those rights is an ordinary claim, brought the ordinary way.",
      "People often file a fundamental rights application for a complaint that is really a contract or property dispute, and it is struck out — not because the complaint is worthless, but because it was brought through the wrong door.",
    ],
    doesNotSettle: [
      "It does not decide the boundaries of any particular right.",
      "It does not mean a claim outside Chapter IV has no remedy — it means the remedy is sought differently.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution — Chapter IV"],
    related: {
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      sections: ["46"],
      cases: ["ransome-kuti-v-attorney-general", "abacha-v-fawehinmi"],
      terms: ["fundamental-rights"],
    },
    meta,
  },
  {
    id: "case-11",
    slug: "abacha-v-fawehinmi",
    title: "Abacha v. Fawehinmi",
    court: "supreme-court",
    year: 2000,
    subject: "human-rights",
    legalIssue:
      "What is the status in Nigerian law of the African Charter on Human and Peoples' Rights, as domesticated by statute?",
    issueTag: "International instruments in domestic law",
    background: [
      "A challenge to a detention relied on the African Charter, which had been domesticated in Nigeria by an Act of the National Assembly.",
      "The question was what force that instrument has in Nigerian courts, and how it stands against the Constitution and other legislation.",
    ],
    decision: [
      "The Supreme Court held that the domesticated Charter is part of Nigerian law and its provisions are enforceable in Nigerian courts.",
      "It is, however, an Act of the National Assembly, and the Constitution remains supreme over it.",
    ],
    keyPrinciple:
      "A treaty domesticated by statute is enforceable in Nigerian courts as part of Nigerian law, but it does not displace the Constitution.",
    plainLanguage: [
      "A treaty Nigeria signs does not become Nigerian law by itself — the National Assembly has to enact it. Once it does, courts here will apply it.",
      "The African Charter has been enacted here, so you can rely on it in a Nigerian court. But if it ever conflicts with the Constitution, the Constitution wins.",
    ],
    doesNotSettle: [
      "It does not give effect to treaties that have not been domesticated by legislation.",
      "It does not decide the content of any particular Charter right.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution",
      "The African Charter on Human and Peoples' Rights (Ratification and Enforcement) Act",
    ],
    related: {
      laws: ["fundamental-rights-chapter-iv", "enforcing-fundamental-rights"],
      rights: ["arrest-and-detention"],
      sections: ["1", "12", "46"],
      cases: ["ransome-kuti-v-attorney-general", "uzoukwu-v-ezeonu"],
    },
    meta,
  },
  {
    id: "case-12",
    slug: "attorney-general-ondo-v-attorney-general-federation",
    title: "Attorney-General of Ondo State v. Attorney-General of the Federation",
    court: "supreme-court",
    year: 2002,
    subject: "constitution",
    legalIssue:
      "May the National Assembly enact anti-corruption legislation that operates throughout the Federation, including within the states?",
    issueTag: "Federal legislative competence",
    background: [
      "A state challenged the validity of federal anti-corruption legislation and its application within the states, as a matter said to belong to the states.",
      "The action was brought in the Supreme Court's original jurisdiction over disputes between a state and the Federation.",
    ],
    decision: [
      "The Supreme Court upheld the legislation and its application throughout the Federation.",
      "It reasoned from the Constitution's own provisions on the abolition of corrupt practices and the legislative powers the Constitution confers.",
    ],
    keyPrinciple:
      "Federal anti-corruption legislation validly operates throughout the Federation, states included, where the Constitution supports the competence.",
    plainLanguage: [
      "Nigeria is a federation, so who can make a law about what is a live and recurring question. Here the Supreme Court confirmed that federal anti-corruption law reaches into the states.",
      "The wider lesson is the method: you answer a question about legislative power by going to the legislative lists and the specific provisions of the Constitution, not by intuition about what feels state or federal.",
    ],
    doesNotSettle: [
      "It does not decide the validity of every federal statute that operates in the states — each one turns on its own constitutional footing.",
      "It says nothing about how any anti-corruption agency should conduct a particular investigation.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution — the legislative lists and the provisions on corrupt practices",
    ],
    related: {
      sections: ["1", "4", "15"],
      cases: [
        "attorney-general-lagos-v-attorney-general-federation",
        "nafiu-rabiu-v-state",
      ],
    },
    meta,
  },
  {
    id: "case-13",
    slug: "attorney-general-lagos-v-attorney-general-federation",
    title: "Attorney-General of Lagos State v. Attorney-General of the Federation",
    court: "supreme-court",
    year: 2004,
    subject: "constitution",
    legalIssue:
      "May the Federal Government withhold statutory allocations due to a state's local government councils?",
    issueTag: "Federalism and allocations",
    background: [
      "A dispute arose over the creation of additional local government areas by a state and the Federal Government's response of withholding funds due to the state's local government councils.",
      "The state invoked the Supreme Court's original jurisdiction.",
    ],
    decision: [
      "The Supreme Court held that the Federal Government was not entitled to withhold the statutory allocations.",
      "It addressed the constitutional process for local government creation and the distinct question of entitlement to funds.",
    ],
    keyPrinciple:
      "Constitutional entitlement to statutory allocations is not a lever the Federal Government may pull to enforce its view of a separate constitutional question.",
    plainLanguage: [
      "Federal and state governments disagree, and when they do the Constitution provides a court, not a contest of leverage. Money constitutionally due cannot be held back to win a different argument.",
      "It is also a good illustration of the Supreme Court's original jurisdiction: certain disputes between the Federation and a state start at the top rather than working their way up.",
    ],
    doesNotSettle: [
      "It does not settle every aspect of local government creation, which the Constitution governs by its own procedure.",
      "It does not decide the fiscal relationship between the tiers of government generally.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution — the provisions on local government and on public revenue",
    ],
    related: {
      sections: ["1", "7", "162"],
      cases: [
        "attorney-general-ondo-v-attorney-general-federation",
        "governor-of-lagos-state-v-ojukwu",
      ],
    },
    meta,
  },
  {
    id: "case-14",
    slug: "dokubo-asari-v-federal-republic-of-nigeria",
    title: "Dokubo-Asari v. Federal Republic of Nigeria",
    court: "supreme-court",
    year: 2007,
    subject: "criminal-law",
    legalIssue:
      "How is the right to personal liberty weighed against national security when bail is sought?",
    issueTag: "Bail and personal liberty",
    background: [
      "Bail was sought pending trial on charges said to engage national security.",
      "The application had been refused below, and the refusal was appealed.",
    ],
    decision: [
      "The Supreme Court declined to grant bail on the material before it.",
      "It held that individual liberty, while constitutionally protected, is exercised in a society whose security the Constitution also protects, and that the balance is struck on the facts of the case.",
    ],
    keyPrinciple:
      "Personal liberty is a constitutional right but not an absolute one; national security is a legitimate consideration in a bail decision.",
    plainLanguage: [
      "Bail is not automatic and it is not a formality. A court weighs the accused person's liberty against other interests, and where the state raises national security that weighs in the balance.",
      "Read this alongside the presumption of innocence and the constitutional limits on how long a person may be held: the point is that these considerations are weighed, not that one of them disappears.",
    ],
    doesNotSettle: [
      "It does not mean bail may be refused whenever the word 'security' is used — the court still assesses the material actually put before it.",
      "It does not displace the presumption of innocence or the constitutional limits on detention.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution — the right to personal liberty",
      "Administration of Criminal Justice Act 2015 (for the current bail framework)",
    ],
    related: {
      laws: ["how-a-criminal-case-moves", "fundamental-rights-chapter-iv"],
      rights: ["bail", "arrest-and-detention"],
      sections: ["35", "36"],
      terms: ["bail", "habeas-corpus"],
    },
    meta,
  },
  {
    id: "case-15",
    slug: "inakoju-v-adeleke",
    title: "Inakoju v. Adeleke",
    court: "supreme-court",
    year: 2007,
    subject: "constitution",
    legalIssue:
      "Must the constitutional procedure for removing a Governor be followed exactly, and can a court review whether it was?",
    issueTag: "Impeachment procedure",
    background: [
      "A purported removal of a state Governor was carried out by a group of members of the state House of Assembly.",
      "The process departed from the procedure and the numbers the Constitution prescribes.",
    ],
    decision: [
      "The Supreme Court held the purported removal invalid.",
      "The constitutional procedure — including the required proportions and the steps the Constitution sets out — is mandatory, and a court may determine whether it was complied with.",
    ],
    keyPrinciple:
      "Removal of a Governor is valid only where the Constitution's procedure is strictly followed, and compliance is justiciable.",
    plainLanguage: [
      "Impeachment is not a political free-for-all. The Constitution sets out the steps and the numbers, and skipping them does not produce a removal — it produces nothing.",
      "The decision also confirms that courts will look at whether the process was followed, even though the merits of the political judgment are for the legislature.",
    ],
    doesNotSettle: [
      "Courts examine compliance with the procedure, not whether the allegations of misconduct were justified.",
      "It concerns a Governor and a state House of Assembly; the federal process has its own provisions.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: ["The Constitution — the provisions on removal from office"],
    related: {
      sections: ["1", "4", "6"],
      cases: ["elelu-habeeb-v-attorney-general", "governor-of-lagos-state-v-ojukwu"],
    },
    meta,
  },
  {
    id: "case-16",
    slug: "amaechi-v-inec",
    title: "Amaechi v. Independent National Electoral Commission",
    court: "supreme-court",
    year: 2008,
    subject: "electoral",
    legalIssue:
      "Who is the candidate at an election — the political party or the individual on the ballot?",
    issueTag: "Party primaries and candidacy",
    background: [
      "A person who had won his party's primary was substituted before the election, and another candidate was returned.",
      "The substitution was challenged as having been made without the justification the law required.",
    ],
    decision: [
      "The Supreme Court held the substitution invalid and treated the winner of the primary as the party's candidate.",
      "It reasoned that at an election it is the political party that contests, with the candidate standing in its name.",
    ],
    keyPrinciple:
      "It is the party that contests an election; a candidate validly nominated cannot be substituted except as the law permits.",
    plainLanguage: [
      "The decision is famous for a result that surprised people — a man who was not on the ballot was declared entitled to the office, because in law the party contested the election and he was the party's candidate.",
      "The practical lesson is that what happens inside a party's primary has legal consequences outside it, and the courts will look at whether the party followed its own and the law's requirements.",
    ],
    doesNotSettle: [
      "The rules on nomination, substitution and pre-election matters have been amended since; current electoral legislation governs today's process.",
      "It does not make every internal party dispute justiciable — much of what a party does internally remains its own affair.",
    ],
    standing: "overtaken-by-statute",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution",
      "The electoral legislation in force at the time",
    ],
    related: {
      sections: ["1"],
      cases: ["awolowo-v-shagari", "inakoju-v-adeleke"],
    },
    meta,
  },
  {
    id: "case-17",
    slug: "elelu-habeeb-v-attorney-general",
    title: "Elelu-Habeeb v. Attorney-General of the Federation",
    court: "supreme-court",
    year: 2012,
    subject: "court-process",
    legalIssue:
      "May a state remove its Chief Judge without the involvement of the National Judicial Council?",
    issueTag: "Judicial independence",
    background: [
      "A state Chief Judge was removed by the state's executive and legislature without recourse to the National Judicial Council.",
    ],
    decision: [
      "The Supreme Court held the removal invalid.",
      "The Constitution's scheme requires the National Judicial Council's involvement in the discipline and removal of judicial officers, and the state organs could not act alone.",
    ],
    keyPrinciple:
      "The removal of a judicial officer requires the constitutional role of the National Judicial Council to be respected.",
    plainLanguage: [
      "Judges are meant to decide cases without worrying about who they upset. That only works if they cannot be removed at the pleasure of the politicians whose actions they review.",
      "The Constitution puts a national body in the path of any removal, and this decision confirms that the step cannot be skipped.",
    ],
    doesNotSettle: [
      "It does not make a judicial officer unremovable — it decides how removal must be done.",
      "It does not address the merits of any complaint made against a judicial officer.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution — the provisions on judicial officers and the National Judicial Council",
    ],
    related: {
      laws: ["how-a-criminal-case-moves"],
      rights: ["fair-hearing"],
      sections: ["6", "36", "153"],
      cases: ["inakoju-v-adeleke", "governor-of-lagos-state-v-ojukwu"],
    },
    meta,
  },
  {
    id: "case-18",
    slug: "skye-bank-v-iwu",
    title: "Skye Bank Plc v. Iwu",
    court: "supreme-court",
    year: 2017,
    subject: "employment",
    legalIssue:
      "From which decisions of the National Industrial Court does an appeal lie to the Court of Appeal?",
    issueTag: "Appeals in labour matters",
    background: [
      "An employment dispute decided by the National Industrial Court raised whether, and on what grounds, its decisions could be appealed.",
      "The constitutional amendments establishing the court had left the scope of appeals contested.",
    ],
    decision: [
      "The Supreme Court resolved the question in favour of a right of appeal to the Court of Appeal from decisions of the National Industrial Court, on the terms it set out.",
    ],
    keyPrinciple:
      "Decisions of the National Industrial Court are appealable to the Court of Appeal, and the court is not a jurisdictional island.",
    plainLanguage: [
      "Employment cases in Nigeria go to a specialist court. For years it was unclear how far a losing party could appeal, which is an uncomfortable thing not to know before you start.",
      "This decision settled the route. If you are in an employment dispute, whether a decision can be appealed is a question to raise with a lawyer early rather than after judgment.",
    ],
    doesNotSettle: [
      "It does not decide the merits of any employment claim.",
      "The procedural detail of an appeal is governed by the rules of court, which change.",
    ],
    standing: "followed",
    whereToFindIt: FIND_IN_REPORTS,
    instruments: [
      "The Constitution as altered — the provisions establishing the National Industrial Court",
    ],
    related: {
      laws: ["employment-contracts-and-termination"],
      rights: ["at-work"],
      sections: ["6", "36"],
      cases: ["ariori-v-elemo"],
    },
    meta,
  },
];
