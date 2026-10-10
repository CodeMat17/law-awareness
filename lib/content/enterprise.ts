import type {
  ContractType,
  RegulatoryUpdate,
} from "./types";
import { businessMeta } from "./business-meta";

/**
 * Business & Enterprise seed content, part 3: Regulatory Watch and the Contract
 * Knowledge Centre (spec sections 22 and 25).
 *
 * Two editorial points specific to this file:
 *
 * 1. Regulatory Watch entries cover *settled, well-known* Nigerian enactments
 *    described in general terms. `effectiveFrom` never states an invented
 *    commencement date - it describes the position in words. `report` is
 *    neutral reporting and `explanation` is our reading of it; spec section 22
 *    requires the two to be visibly separate, and the page renders them so.
 * 2. The Contract Knowledge Centre is educational only. It explains what an
 *    agreement does and what to look at - it never supplies model wording, and
 *    the pages say plainly that no generic template is universally suitable.
 */

/* -------------------------------------------------------------------------- */
/* Regulatory Watch (spec section 22)                                          */
/* -------------------------------------------------------------------------- */

export const regulatoryUpdates: RegulatoryUpdate[] = [
  {
    id: "ru-1",
    slug: "nigeria-data-protection-act-2023",
    title: "Nigeria's data protection framework moved onto a statutory footing",
    topic: "data-protection",
    report: [
      "The Nigeria Data Protection Act 2023 established a statutory framework for the processing of personal data in Nigeria, and created the Nigeria Data Protection Commission as the regulator responsible for it.",
      "The Act sets out principles for processing, lawful bases, obligations on organisations that determine why and how data is processed, and rights for the individuals the data is about.",
    ],
    explanation: [
      "The practical shift is from guidance-led compliance to a statutory regime with a named regulator. Duties that many organisations treated as good practice now sit on a legislative footing.",
      "For most businesses the work is not sophisticated. It is knowing what personal data you hold and why, holding less of it, securing it, being able to answer the person it belongs to, and having written arrangements with the third parties that process it for you.",
      "The organisations most exposed are not necessarily the largest. They are the ones that cannot say where their data is, because they cannot demonstrate anything at all.",
    ],
    whoIsAffected: [
      "Any organisation that decides why and how personal data is processed, including small businesses.",
      "Organisations that use third-party tools which store or analyse customer or staff data.",
      "Businesses that transfer personal data outside Nigeria as part of ordinary operations.",
      "Employers, because employee and applicant records are personal data too.",
    ],
    effectiveFrom:
      "The Act is in force. Confirm the current position on registration, filing and any implementation guidance directly with the Nigeria Data Protection Commission.",
    businessConsiderations: [
      "Build a data inventory before writing any policy - you cannot describe what you have not mapped.",
      "Choose a lawful basis per purpose, and prefer a durable basis over consent where it genuinely fits.",
      "Put written terms in place with every processor that touches your data.",
      "Know where your data physically sits, and under what arrangement it leaves the country.",
      "Have a written breach procedure before an incident, not during one.",
    ],
    individualConsiderations: [
      "You can ask an organisation what personal data it holds about you.",
      "You can ask for inaccurate data to be corrected.",
      "Consent you gave can generally be withdrawn, though other lawful bases may still apply.",
      "A complaint route exists through the Commission where an organisation will not engage.",
    ],
    guidanceNote:
      "Regulators issue implementation guidance and directives over time. Check the Commission's own publications for the current position rather than relying on secondary summaries, including this one.",
    publishedAt: "2026-07-22",
    related: {
      compliance: ["data-protection"],
      guides: ["before-collecting-customer-data"],
      rights: ["privacy"],
    },
    meta: businessMeta({ label: "Nigeria Data Protection Act 2023" }),
  },
  {
    id: "ru-2",
    slug: "cama-2020-company-law-reform",
    title: "CAMA 2020 reshaped how Nigerian companies are formed and run",
    topic: "corporate-law",
    report: [
      "The Companies and Allied Matters Act 2020 replaced the previous companies legislation, restating the law on company formation, administration and winding up.",
      "Among its changes, the Act made provision for single-member private companies, introduced the limited liability partnership and the limited partnership as available structures, and addressed disclosure of persons with significant control.",
    ],
    explanation: [
      "For a small business the most consequential parts are structural: the range of forms available, and how straightforward each is to run once registered.",
      "The Act also sharpened the administrative spine of a company - registers, filings and disclosure. These are the obligations most often left until an investor, a bank or a regulator asks to see them, at which point they are far more expensive to remediate.",
      "Choosing a structure is a liability decision first. Whether the business is a separate legal person from its owners is what determines whether its debts can reach their personal assets.",
    ],
    whoIsAffected: [
      "Anyone incorporating, or currently trading through a registered entity.",
      "Businesses considering a limited liability partnership rather than a company.",
      "Companies whose registered particulars have not been updated as things changed.",
      "Founders holding shares or control through arrangements that have never been disclosed.",
    ],
    effectiveFrom:
      "The Act is in force and applies to companies and registered entities in Nigeria. Confirm filing requirements and any transitional questions with the Corporate Affairs Commission.",
    businessConsiderations: [
      "Revisit whether your current structure still fits the size and risk of the business.",
      "Bring registered particulars up to date rather than leaving them for the annual return.",
      "Open and maintain the statutory registers, including significant control, from the start.",
      "Where several people are involved, put shareholder or partnership arrangements in writing.",
    ],
    individualConsiderations: [
      "The register is public, which is how anyone can verify who they are dealing with.",
      "Directors take on duties personally when they accept the role.",
      "A registered business name is not a company, and does not shield personal assets.",
    ],
    publishedAt: "2026-06-30",
    related: {
      compliance: ["business-structure-and-registration", "corporate-governance"],
      guides: ["before-entering-a-partnership"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "ru-3",
    slug: "copyright-act-2022",
    title: "The Copyright Act 2022 replaced Nigeria's previous copyright law",
    topic: "intellectual-property",
    report: [
      "The Copyright Act 2022 replaced the earlier copyright legislation, restating the law on protected works, ownership, exceptions and enforcement.",
      "The Act addresses the digital environment more directly than its predecessor, including provisions relevant to online infringement and to the role of intermediaries.",
    ],
    explanation: [
      "For businesses the practical significance is ownership and evidence. Copyright arises in ordinary business material - website copy, photographs, designs, software, training materials - and the question of who owns it is usually decided by whether anyone wrote it down.",
      "The most common exposure is unglamorous: assets in use whose provenance nobody can establish, and commissioned work that was never assigned to the business that paid for it.",
      "Attribution remains irrelevant to permission. Crediting a creator is good practice; it is not a licence.",
    ],
    whoIsAffected: [
      "Any business publishing content, running a website, or using images, fonts, music or code.",
      "Businesses that commission work from freelancers and agencies.",
      "Creators whose work is used commercially by others.",
      "Platforms and intermediaries hosting material uploaded by users.",
    ],
    effectiveFrom:
      "The Act is in force. Consult the Nigerian Copyright Commission for current guidance on registration and enforcement procedures.",
    businessConsiderations: [
      "Take written assignments from every contractor who produces work for you.",
      "Keep licences and proof of purchase alongside the assets they cover.",
      "Audit your published material for assets you cannot trace.",
      "Where IP is a material asset, deal with it expressly in shareholder and investment documents.",
    ],
    individualConsiderations: [
      "Your work is protected without any need to register it, though records help you prove it.",
      "Commissioning does not automatically transfer ownership - the agreement decides.",
      "Sharing something publicly is not the same as licensing it for commercial use.",
    ],
    publishedAt: "2026-05-18",
    related: {
      compliance: ["intellectual-property"],
      guides: ["before-using-another-brand-or-content"],
    },
    meta: businessMeta({ label: "Copyright Act 2022" }),
  },
  {
    id: "ru-4",
    slug: "arbitration-and-mediation-act-2023",
    title: "Nigeria's arbitration framework was modernised in 2023",
    topic: "corporate-law",
    report: [
      "The Arbitration and Mediation Act 2023 replaced the previous arbitration and conciliation legislation, providing an updated framework for arbitration and for mediation in Nigeria.",
      "The Act addresses the conduct of arbitral proceedings, the recognition and enforcement of awards, and mediation as a distinct process.",
    ],
    explanation: [
      "This matters at the moment a contract is signed, not at the moment a dispute begins. A dispute-resolution clause commits the parties to a forum, a set of rules and a cost profile years before anyone falls out.",
      "Arbitration can offer privacy and finality. It can also be expensive, and agreeing to arbitrate in a foreign seat may put resolution beyond the practical reach of a smaller party. That is a commercial decision, and it should be taken deliberately.",
      "Mediation is frequently the better first step, and escalation clauses that require it can resolve matters before positions harden.",
    ],
    whoIsAffected: [
      "Any business signing commercial agreements containing dispute-resolution clauses.",
      "Parties to existing agreements that provide for arbitration.",
      "Businesses contracting with counterparties outside Nigeria.",
    ],
    effectiveFrom:
      "The Act is in force. The clause in your own contract governs your position - read it before assuming which route applies.",
    businessConsiderations: [
      "Read the dispute clause before signing, and price what it would cost to use.",
      "Consider whether a foreign seat is realistic for a dispute of the size you might face.",
      "Build escalation and mediation steps into agreements, and follow them.",
      "Keep the evidence a dispute would turn on as it is created.",
    ],
    individualConsiderations: [
      "An arbitration clause in a consumer or employment context is not automatically the end of every other route.",
      "Mediation is voluntary in outcome - you are not agreeing to a result by agreeing to talk.",
    ],
    publishedAt: "2026-04-11",
    related: {
      compliance: ["dispute-prevention", "contracts"],
      guides: ["before-signing-a-supplier-contract"],
    },
    meta: businessMeta({ label: "Arbitration and Mediation Act 2023" }),
  },
  {
    id: "ru-5",
    slug: "nigeria-startup-act-2022",
    title: "The Nigeria Startup Act 2022 created a framework for labelled startups",
    topic: "technology-law",
    report: [
      "The Nigeria Startup Act 2022 established a framework intended to support technology-enabled startups, including a labelling process and governance arrangements for the sector.",
      "The Act contemplates a set of criteria that a business must satisfy to be recognised under the framework.",
    ],
    explanation: [
      "The Act is best understood as a framework rather than an exemption. It does not remove the ordinary obligations that apply to any business - registration, employment duties, data protection, tax and sector authorisation all continue to apply.",
      "For founders the practical question is whether recognition under the framework is worth the administrative work for their particular business, and what the current criteria and process actually require.",
      "Because the details of eligibility and process are administered rather than fixed in general knowledge, this is an area to verify at source rather than from summaries.",
    ],
    whoIsAffected: [
      "Technology-enabled startups considering recognition under the framework.",
      "Founders weighing structure and incorporation choices at an early stage.",
      "Investors assessing portfolio companies against the framework.",
    ],
    effectiveFrom:
      "The Act is in force. Eligibility criteria and the labelling process are administered - confirm the current requirements with the responsible authority before relying on them.",
    businessConsiderations: [
      "Do not treat the framework as a substitute for ordinary compliance.",
      "Get incorporation, IP assignment and founder arrangements right first.",
      "Verify current criteria and process at source before building plans around them.",
    ],
    individualConsiderations: [
      "Recognition under a framework is not an assurance about a company's finances or conduct.",
      "The ordinary consumer and data protections apply to startups as they do to any business.",
    ],
    guidanceNote:
      "Implementation of this framework is administered and evolves. Treat any summary, this one included, as a starting point rather than a current statement of the requirements.",
    publishedAt: "2026-03-05",
    related: {
      compliance: ["business-structure-and-registration", "intellectual-property"],
    },
    meta: businessMeta({ label: "Nigeria Startup Act 2022" }),
  },
  {
    id: "ru-6",
    slug: "fccpa-2018-consumer-framework",
    title: "The FCCPA 2018 consolidated competition and consumer protection",
    topic: "consumer-protection",
    report: [
      "The Federal Competition and Consumer Protection Act 2018 established a consolidated framework for competition and consumer protection in Nigeria, and created the Federal Competition and Consumer Protection Commission.",
      "The Act addresses misleading representations, unfair terms and practices, and anti-competitive conduct.",
    ],
    explanation: [
      "For most businesses this lands in marketing and in standard terms, not in competition law. What you claim, how you display price, and what your terms try to exclude are the everyday touchpoints.",
      "Terms drafted to exclude every possible liability are not made effective by being written confidently. Unfair terms sit within the Act's scope, and a term presented after the customer has already committed is weaker still.",
      "Complaint handling is the quiet risk area. A complaint that is recorded and answered rarely escalates; one that is ignored is the one that reaches a regulator or a public forum.",
    ],
    whoIsAffected: [
      "Any business selling goods or services to consumers.",
      "Businesses advertising, running promotions, or making performance claims.",
      "Businesses operating subscriptions, guarantees or returns policies.",
      "Larger businesses whose conduct may raise competition questions.",
    ],
    effectiveFrom:
      "The Act is in force. Confirm current guidance and sector-specific requirements with the Federal Competition and Consumer Protection Commission.",
    businessConsiderations: [
      "Substantiate claims before publishing them, and keep the evidence.",
      "Show the price the customer will actually pay, including unavoidable charges.",
      "Present terms before purchase, in language a customer can follow.",
      "Log complaints, respond to a standard you can meet, and look for patterns.",
    ],
    individualConsiderations: [
      "Misleading claims and unfair terms sit within the Act's scope.",
      "A term does not become enforceable merely because it appears in standard terms.",
      "A complaint route exists through the Commission where a business will not engage.",
    ],
    publishedAt: "2026-02-14",
    related: {
      compliance: ["consumer-protection"],
      guides: ["before-launching-an-online-business"],
      contracts: ["terms-and-conditions"],
    },
    meta: businessMeta({
      label: "Federal Competition and Consumer Protection Act 2018",
    }),
  },
];

/* -------------------------------------------------------------------------- */
/* Contract Knowledge Centre (spec section 25)                                 */
/* -------------------------------------------------------------------------- */

export const contractTypes: ContractType[] = [
  {
    id: "cn-1",
    slug: "employment-agreement",
    name: "Employment agreement",
    family: "People",
    whatItIs:
      "The written terms on which someone is employed: the role, the pay, the hours, the place of work, and how the relationship can be brought to an end.",
    whyItMatters:
      "It is the document both sides rely on when there is a dispute. Where terms are unwritten, the gap gets filled by what the parties actually did and by the general law - not by what the employer intended.",
    commonlyUsedWhen: [
      "Anyone joins the business as an employee, including the first hire.",
      "An existing arrangement needs to be documented properly.",
      "A role changes enough that the original terms no longer describe it.",
    ],
    importantClauses: [
      {
        name: "Role and duties",
        purpose: "Defines what the person is employed to do.",
        whatToCheck:
          "That it describes the actual job, with enough flexibility to be workable but not so much as to be meaningless.",
      },
      {
        name: "Remuneration and deductions",
        purpose: "Sets pay, frequency, and what is deducted.",
        whatToCheck:
          "That statutory deductions are addressed, and that any variable pay is defined rather than discretionary in a way nobody can measure.",
      },
      {
        name: "Probation",
        purpose: "Provides a defined period to assess fit.",
        whatToCheck: "The length, the review process, and what notice applies during it.",
      },
      {
        name: "Notice and termination",
        purpose: "Sets how the relationship can be ended by either side.",
        whatToCheck:
          "That notice runs both ways, and that any payment in lieu is expressly permitted rather than assumed.",
      },
      {
        name: "Confidentiality and intellectual property",
        purpose: "Protects information and assigns work created for the business.",
        whatToCheck:
          "That assignment is express, and that confidentiality is scoped to real business information.",
      },
      {
        name: "Post-employment restrictions",
        purpose: "Limits what the employee may do after leaving.",
        whatToCheck:
          "Scope, duration and geography. Restrictions drafted too widely tend to be read narrowly or not upheld.",
      },
    ],
    commonMistakes: [
      "Using a template drafted for another country's employment law.",
      "Setting notice for the employee but not for the employer.",
      "Leaving intellectual property to be assumed rather than assigned.",
      "Referring to a handbook or policy that does not exist.",
      "Never having the agreement signed and returned.",
    ],
    warningSigns: [
      "Terms that can be varied unilaterally by the employer at any time.",
      "Restrictions that would prevent the person working in their field at all.",
      "Deductions from pay described in open-ended terms.",
      "A start date that has already passed with nothing signed.",
    ],
    whenLegalReviewIsAppropriate: [
      "The role is senior, regulated, or holds significant client relationships.",
      "You want post-employment restrictions that will actually hold.",
      "Equity, commission or bonus arrangements form part of the package.",
      "You are documenting a relationship that has run for years without terms.",
    ],
    related: {
      guides: ["before-hiring-an-employee", "before-terminating-an-employee"],
      compliance: ["employment-and-payroll"],
    },
    meta: businessMeta({ label: "Labour Act, Cap L1 LFN 2004" }),
  },
  {
    id: "cn-2",
    slug: "nda",
    name: "Non-disclosure agreement",
    family: "Protective",
    whatItIs:
      "An agreement restricting what one or both parties may do with confidential information disclosed to them.",
    whyItMatters:
      "It is often the first document signed in a commercial conversation, and the one people read least. A one-way NDA in the other party's favour is a common and avoidable outcome.",
    commonlyUsedWhen: [
      "Exploring a partnership, an investment or an acquisition.",
      "Sharing a product, a process or customer information with a prospective supplier.",
      "Engaging a contractor who will see how the business works.",
    ],
    importantClauses: [
      {
        name: "Definition of confidential information",
        purpose: "Sets what is actually protected.",
        whatToCheck:
          "Whether it is broad enough to cover what you will share, and whether it captures information you would rather not be restricted about.",
      },
      {
        name: "Mutual or one-way",
        purpose: "Determines who carries the obligation.",
        whatToCheck: "That it is mutual where both parties will disclose anything of substance.",
      },
      {
        name: "Permitted disclosures",
        purpose: "Allows disclosure to advisers, staff and where legally required.",
        whatToCheck:
          "That your normal working arrangements - advisers, team, cloud tools - are not accidentally breaches.",
      },
      {
        name: "Duration",
        purpose: "Sets how long the obligation lasts.",
        whatToCheck:
          "Whether a perpetual obligation is realistic for the information involved.",
      },
      {
        name: "Return or destruction",
        purpose: "Deals with information at the end of the discussion.",
        whatToCheck: "Whether it is practically possible given backups and archived systems.",
      },
    ],
    commonMistakes: [
      "Signing a one-way NDA when both sides will be disclosing.",
      "Defining confidential information so broadly that ordinary work becomes a breach.",
      "Treating an NDA as protection for an idea, which it is not on its own.",
      "Signing it and then disclosing outside its terms anyway.",
    ],
    warningSigns: [
      "The NDA contains non-compete or exclusivity terms unrelated to confidentiality.",
      "It assigns intellectual property, which is a different agreement entirely.",
      "Obligations run one way while disclosure runs both.",
      "It has no end date and no realistic return mechanism.",
    ],
    whenLegalReviewIsAppropriate: [
      "The information is genuinely the value of the business.",
      "The NDA contains restrictive covenants or IP terms.",
      "It is being signed ahead of an investment or a sale.",
      "The counterparty is a competitor.",
    ],
    related: {
      compliance: ["intellectual-property"],
      guides: ["before-using-another-brand-or-content"],
    },
    meta: businessMeta(),
  },
  {
    id: "cn-3",
    slug: "service-agreement",
    name: "Service agreement",
    family: "Commercial",
    whatItIs:
      "An agreement under which one party provides services to another: what is delivered, to what standard, for what price, and what happens when performance falls short.",
    whyItMatters:
      "Services disputes are almost always about scope. An agreement with a precise specification and a defined acceptance process resolves them; one without turns every disagreement into a matter of opinion.",
    commonlyUsedWhen: [
      "Engaging an agency, a professional firm or an ongoing service provider.",
      "Providing services to a customer on an ongoing basis.",
      "Any arrangement where work is performed over time rather than delivered once.",
    ],
    importantClauses: [
      {
        name: "Scope and specification",
        purpose: "Defines what is being provided.",
        whatToCheck:
          "Whether the described work could be delivered badly and still satisfy the words.",
      },
      {
        name: "Service levels",
        purpose: "Sets measurable standards for performance.",
        whatToCheck: "That the measures are objective, and that failure has a defined consequence.",
      },
      {
        name: "Change control",
        purpose: "Governs how scope is varied.",
        whatToCheck:
          "That variations must be recorded - most disputes about unpaid extras start here.",
      },
      {
        name: "Payment and acceptance",
        purpose: "Ties payment to delivery.",
        whatToCheck: "What must happen before each payment, and what is retained until acceptance.",
      },
      {
        name: "Liability",
        purpose: "Allocates risk when things go wrong.",
        whatToCheck: "The cap, the exclusions, and how they compare with the cost of failure.",
      },
      {
        name: "Termination and exit",
        purpose: "Ends the relationship in an orderly way.",
        whatToCheck:
          "Notice, grounds, and what happens to data, materials and prepayments on exit.",
      },
    ],
    commonMistakes: [
      "Agreeing scope in a proposal and never carrying it into the contract.",
      "Varying work verbally, then disputing the invoice.",
      "Paying entirely in advance for work delivered over months.",
      "No exit provisions, so ending the relationship becomes its own negotiation.",
    ],
    warningSigns: [
      "The specification exists only in an email chain.",
      "Service levels with no consequence attached.",
      "A cap far below the cost of the failure you actually fear.",
      "Automatic renewal with a notice window nobody has diarised.",
    ],
    whenLegalReviewIsAppropriate: [
      "The service is material to your operations.",
      "Personal data or intellectual property is involved.",
      "The agreement is long-term or hard to exit.",
      "Cross-border performance or foreign governing law applies.",
    ],
    related: {
      guides: ["before-signing-a-supplier-contract"],
      compliance: ["contracts", "dispute-prevention"],
    },
    meta: businessMeta(),
  },
  {
    id: "cn-4",
    slug: "consultancy-agreement",
    name: "Consultancy agreement",
    family: "People",
    whatItIs:
      "An agreement engaging an independent consultant or contractor, rather than employing them.",
    whyItMatters:
      "The label on the document does not settle the relationship. If the arrangement functions as employment, it may be treated as employment regardless of what the agreement says.",
    commonlyUsedWhen: [
      "Engaging specialist expertise for a defined piece of work.",
      "Bringing in a freelancer for design, development or advisory work.",
      "Filling a need that is genuinely temporary or project-based.",
    ],
    importantClauses: [
      {
        name: "Status and independence",
        purpose: "Records that the consultant is not an employee.",
        whatToCheck:
          "That the working arrangements actually match - control, substitution, tools and commercial risk.",
      },
      {
        name: "Deliverables and timeline",
        purpose: "Defines the work.",
        whatToCheck: "That it is project-shaped rather than an open-ended engagement to be available.",
      },
      {
        name: "Intellectual property assignment",
        purpose: "Transfers ownership of what is created.",
        whatToCheck:
          "That assignment is express. Absent it, the creator may retain rights in work you paid for.",
      },
      {
        name: "Fees and expenses",
        purpose: "Sets what is payable and when.",
        whatToCheck: "Whether any deductions are required at source on payments to the consultant.",
      },
      {
        name: "Confidentiality and data",
        purpose: "Protects information the consultant will see.",
        whatToCheck: "Whether the consultant will handle personal data, and on what terms.",
      },
    ],
    commonMistakes: [
      "Engaging a full-time, closely supervised, long-term worker as a consultant.",
      "Omitting IP assignment, then discovering the agency owns the logo.",
      "Rolling a three-month engagement on for years with no review.",
      "No terms at all with the freelancer who built the product.",
    ],
    warningSigns: [
      "The consultant works your hours, at your premises, under your direction, exclusively.",
      "The agreement is silent on who owns the work produced.",
      "The consultant will hold customer personal data with no terms addressing it.",
    ],
    whenLegalReviewIsAppropriate: [
      "The engagement is long-term, full-time or exclusive.",
      "The consultant will create core intellectual property.",
      "You are converting an employee into a consultant, or the reverse.",
      "The classification has been challenged.",
    ],
    related: {
      guides: ["before-hiring-an-employee"],
      compliance: ["employment-and-payroll", "intellectual-property"],
    },
    meta: businessMeta({ label: "Labour Act, Cap L1 LFN 2004" }),
  },
  {
    id: "cn-5",
    slug: "partnership-agreement",
    name: "Partnership agreement",
    family: "Ownership",
    whatItIs:
      "The agreement between people going into business together: contributions, decision-making, money out, and what happens when someone leaves.",
    whyItMatters:
      "Partnerships fail on the questions nobody wanted to raise at the start. An agreement is the record of those answers made while everyone was still reasonable.",
    commonlyUsedWhen: [
      "Two or more people start a venture together.",
      "An existing informal arrangement needs to be documented.",
      "A new partner is joining, or an existing one is leaving.",
    ],
    importantClauses: [
      {
        name: "Contributions",
        purpose: "Records what each partner brings.",
        whatToCheck: "Cash, assets, time, IP and relationships - valued where possible.",
      },
      {
        name: "Decision rights",
        purpose: "Sets who decides what.",
        whatToCheck:
          "Which decisions need unanimity, and whether there is a way to break a deadlock.",
      },
      {
        name: "Profit and drawings",
        purpose: "Governs money out.",
        whatToCheck: "That salaries, drawings, expenses and reinvestment are all addressed.",
      },
      {
        name: "Vesting and leavers",
        purpose: "Protects those who stay.",
        whatToCheck: "Vesting schedule, cliff, and good and bad leaver treatment.",
      },
      {
        name: "Transfer and valuation",
        purpose: "Controls who can end up as your partner.",
        whatToCheck: "Pre-emption rights, and an agreed method for valuing a departing stake.",
      },
      {
        name: "Death, incapacity and competition",
        purpose: "Covers the events nobody plans for.",
        whatToCheck: "What happens to the stake, and what a leaver may do next.",
      },
    ],
    commonMistakes: [
      "Operating on a handshake and formalising later.",
      "Equal shares with no deadlock mechanism.",
      "Founder equity with no vesting.",
      "IP left in a founder's personal name.",
    ],
    warningSigns: [
      "A partner who will not put agreed terms in writing.",
      "One partner holding the bank mandate, the records and the customer relationships.",
      "No agreed way for anyone to exit.",
    ],
    whenLegalReviewIsAppropriate: [
      "Almost always, where the venture has real assets or several owners.",
      "Investment, options or convertible instruments are contemplated.",
      "A partner is leaving, or the relationship has broken down.",
    ],
    related: {
      guides: ["before-entering-a-partnership"],
      compliance: ["corporate-governance"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "cn-6",
    slug: "shareholder-agreement",
    name: "Shareholder agreement",
    family: "Ownership",
    whatItIs:
      "An agreement between a company's shareholders governing control, share transfers, information rights and exit, alongside the company's constitution.",
    whyItMatters:
      "Shareholding alone answers very few of the questions that arise between owners. Control, reserved matters and transfer restrictions are what actually determine how a company is run and how anyone gets out.",
    commonlyUsedWhen: [
      "A company has more than one shareholder.",
      "External investment is being taken.",
      "Founders want protections that the constitution alone does not provide.",
    ],
    importantClauses: [
      {
        name: "Reserved matters",
        purpose: "Lists decisions requiring shareholder consent.",
        whatToCheck: "That the list is workable, and does not paralyse ordinary operations.",
      },
      {
        name: "Board composition",
        purpose: "Sets who appoints directors.",
        whatToCheck: "Whether control of the board matches the intended balance of power.",
      },
      {
        name: "Pre-emption on transfer and issue",
        purpose: "Controls dilution and who may become a shareholder.",
        whatToCheck: "The process, timing and valuation mechanism.",
      },
      {
        name: "Drag and tag rights",
        purpose: "Governs what happens on a sale of the company.",
        whatToCheck:
          "Whether a minority can be dragged along, and whether they can require inclusion in a sale.",
      },
      {
        name: "Information rights",
        purpose: "Ensures shareholders can see how the company is performing.",
        whatToCheck: "What is provided, how often, and to whom.",
      },
      {
        name: "Deadlock and exit",
        purpose: "Provides a route out of an impasse.",
        whatToCheck: "That a mechanism exists at all - many agreements simply have none.",
      },
    ],
    commonMistakes: [
      "Relying on the constitution alone for a multi-owner company.",
      "Reserved-matter lists so long the company cannot operate.",
      "No valuation method, so every exit becomes a negotiation.",
      "Agreements that conflict with the company's own constitution.",
    ],
    warningSigns: [
      "Investor consent required for routine operational decisions.",
      "Drag rights with no corresponding tag protection.",
      "No mechanism for resolving a deadlock.",
    ],
    whenLegalReviewIsAppropriate: [
      "Always, in practice. This document allocates control of the company.",
      "Particularly where investment, options or several classes of share are involved.",
    ],
    related: {
      guides: ["before-entering-a-partnership"],
      compliance: ["corporate-governance"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "cn-7",
    slug: "supplier-agreement",
    name: "Supplier agreement",
    family: "Commercial",
    whatItIs:
      "An agreement for the supply of goods or materials: what is supplied, to what standard, on what delivery and payment terms, and what happens on failure.",
    whyItMatters:
      "Supply failures are operational before they are legal. The agreement decides whether you have a remedy, a substitute, or only a complaint.",
    commonlyUsedWhen: [
      "Buying stock, materials or equipment on an ongoing basis.",
      "Relying on a single supplier for something the business cannot trade without.",
      "Formalising a relationship that has been running on purchase orders.",
    ],
    importantClauses: [
      {
        name: "Specification and quality",
        purpose: "Defines what must be supplied.",
        whatToCheck: "Objective standards, and how goods are inspected and accepted.",
      },
      {
        name: "Delivery and risk",
        purpose: "Sets when delivery occurs and when risk passes.",
        whatToCheck:
          "Where risk and title transfer, and what happens if delivery is late or partial.",
      },
      {
        name: "Price and payment",
        purpose: "Fixes commercial terms.",
        whatToCheck: "Whether prices can be varied unilaterally, and on what notice.",
      },
      {
        name: "Warranties and remedies",
        purpose: "States what the supplier promises and what you get if it fails.",
        whatToCheck: "Whether the remedy is replacement, refund, or a credit you cannot use.",
      },
      {
        name: "Continuity and substitution",
        purpose: "Addresses supply failure.",
        whatToCheck: "Whether you can source elsewhere without breaching exclusivity.",
      },
      {
        name: "Termination",
        purpose: "Ends the relationship.",
        whatToCheck: "Notice, minimum commitments, and treatment of outstanding orders.",
      },
    ],
    commonMistakes: [
      "Relying on purchase orders that conflict with the master agreement.",
      "Accepting exclusivity without a corresponding supply commitment.",
      "No remedy for late or defective delivery beyond replacement.",
      "Not knowing where risk passes, so a loss in transit is unallocated.",
    ],
    warningSigns: [
      "Unilateral price variation with little or no notice.",
      "Exclusivity with no volume or continuity commitment in return.",
      "The supplier's identity or registration cannot be verified.",
    ],
    whenLegalReviewIsAppropriate: [
      "The supplier is critical to operations.",
      "Exclusivity, minimum commitments or long terms are involved.",
      "Cross-border supply, import or foreign law applies.",
    ],
    related: {
      guides: ["before-signing-a-supplier-contract"],
      compliance: ["contracts"],
    },
    meta: businessMeta(),
  },
  {
    id: "cn-8",
    slug: "lease-agreement",
    name: "Lease or tenancy agreement",
    family: "Property",
    whatItIs:
      "An agreement granting the use of premises for a term, on stated rent and conditions.",
    whyItMatters:
      "Premises costs are usually fixed for years, and the obligations attached to them - repair, use, assignment - can be more expensive than the rent.",
    commonlyUsedWhen: [
      "Taking business premises: office, retail, warehouse or workshop.",
      "Renewing or assigning an existing lease.",
      "Subletting part of a space you occupy.",
    ],
    importantClauses: [
      {
        name: "Term and renewal",
        purpose: "Sets how long you are committed.",
        whatToCheck: "Any break right, and what notice is needed to exercise it.",
      },
      {
        name: "Rent and review",
        purpose: "Fixes cost over the term.",
        whatToCheck: "How and when rent can be increased, and by what mechanism.",
      },
      {
        name: "Permitted use",
        purpose: "Limits what the premises may be used for.",
        whatToCheck: "That it covers what your business actually does, and plans to do.",
      },
      {
        name: "Repair and condition",
        purpose: "Allocates responsibility for the state of the premises.",
        whatToCheck:
          "What condition you must return them in - this is where unexpected cost concentrates.",
      },
      {
        name: "Assignment and subletting",
        purpose: "Governs whether you can exit by transferring.",
        whatToCheck: "Whether transfer is permitted at all, and on what conditions.",
      },
      {
        name: "Title and authority to let",
        purpose: "Confirms the landlord can grant what they are granting.",
        whatToCheck:
          "Evidence of title or authority. In Nigeria, land interests sit under the Land Use Act 1978 framework.",
      },
    ],
    commonMistakes: [
      "Paying a full term in advance before verifying the landlord's authority to let.",
      "Accepting full repairing obligations on premises already in poor condition.",
      "A permitted use narrower than the business actually needs.",
      "No break right on a long term.",
    ],
    warningSigns: [
      "The landlord cannot evidence title or authority.",
      "You are asked to pay before seeing the full agreement.",
      "Rent review is at the landlord's discretion.",
      "No record of the condition of the premises at the start.",
    ],
    whenLegalReviewIsAppropriate: [
      "Any commercial lease of meaningful length or value.",
      "Where title or the landlord's authority is unclear.",
      "Where you are taking on repair obligations.",
      "Assignment, surrender or a dispute with the landlord.",
    ],
    related: {
      safety: ["buying-property"],
      compliance: ["contracts"],
    },
    meta: businessMeta({ label: "Land Use Act 1978" }),
  },
  {
    id: "cn-9",
    slug: "distribution-agreement",
    name: "Distribution agreement",
    family: "Commercial",
    whatItIs:
      "An agreement appointing someone to sell or distribute your products, or appointing you to distribute another party's.",
    whyItMatters:
      "Distribution arrangements allocate a market. Territory, exclusivity and termination decide what happens to the customer base you build.",
    commonlyUsedWhen: [
      "Appointing a distributor in a region or channel.",
      "Taking on distribution rights for another party's products.",
      "Formalising a reseller relationship that grew informally.",
    ],
    importantClauses: [
      {
        name: "Territory and exclusivity",
        purpose: "Defines the market allocated.",
        whatToCheck: "Whether exclusivity is matched by minimum performance commitments.",
      },
      {
        name: "Minimum purchase or performance",
        purpose: "Keeps exclusivity earned.",
        whatToCheck: "That targets are achievable, and what happens if they are missed.",
      },
      {
        name: "Pricing and margin",
        purpose: "Sets the commercial terms.",
        whatToCheck: "Whether the supplier can change prices unilaterally.",
      },
      {
        name: "Brand and trade mark use",
        purpose: "Licenses use of the brand.",
        whatToCheck: "Scope of the licence, and what happens to it on termination.",
      },
      {
        name: "Termination and post-term",
        purpose: "Ends the arrangement.",
        whatToCheck:
          "Treatment of stock, outstanding orders and the customer relationships built up.",
      },
      {
        name: "Competition and restrictions",
        purpose: "Limits dealing with competing products.",
        whatToCheck: "Whether restrictions are proportionate and lawful.",
      },
    ],
    commonMistakes: [
      "Exclusivity granted with no minimum commitment.",
      "No provision for stock on hand at termination.",
      "Brand licence that survives, or dies, unclearly at the end.",
      "Ignoring who owns the customer relationships.",
    ],
    warningSigns: [
      "Termination on short notice after you have built the market.",
      "Restrictions that prevent you trading at all if the arrangement ends.",
      "No clarity on liability for product defects.",
    ],
    whenLegalReviewIsAppropriate: [
      "Exclusivity or a defined territory is involved.",
      "Cross-border distribution or import is involved.",
      "Product liability or regulated goods are involved.",
      "You are investing significantly to build the market.",
    ],
    related: {
      compliance: ["contracts", "consumer-protection"],
    },
    meta: businessMeta(),
  },
  {
    id: "cn-10",
    slug: "terms-and-conditions",
    name: "Terms and conditions",
    family: "Customer-facing",
    whatItIs:
      "The standard terms on which you sell to customers: what is being sold, on what basis, with what delivery, returns and complaint arrangements.",
    whyItMatters:
      "They form the contract with every customer, at scale. Terms that do not describe how the business actually operates create disputes rather than preventing them.",
    commonlyUsedWhen: [
      "Selling goods or services to the public.",
      "Operating a website, app, marketplace or subscription.",
      "Standardising a relationship you have with many customers.",
    ],
    importantClauses: [
      {
        name: "Formation of the contract",
        purpose: "Sets when a binding order exists.",
        whatToCheck: "Whether an order is accepted on placement, on payment, or on dispatch.",
      },
      {
        name: "Price and charges",
        purpose: "States what the customer pays.",
        whatToCheck: "That unavoidable charges are disclosed before the customer commits.",
      },
      {
        name: "Delivery and performance",
        purpose: "Sets what you promise.",
        whatToCheck: "That the promise matches what the operation can actually deliver.",
      },
      {
        name: "Cancellation, returns and refunds",
        purpose: "Governs the most common dispute.",
        whatToCheck: "That the policy is workable, written down, and applied consistently.",
      },
      {
        name: "Liability",
        purpose: "Limits exposure.",
        whatToCheck:
          "That exclusions are proportionate. Terms that attempt to exclude everything invite scrutiny under the FCCPA 2018.",
      },
      {
        name: "Complaints and dispute resolution",
        purpose: "Provides a route before escalation.",
        whatToCheck: "That the route is real, staffed, and reachable.",
      },
    ],
    commonMistakes: [
      "Copying terms from another business, including its trading model.",
      "Presenting terms only after payment.",
      "Promising delivery times the business cannot meet.",
      "A refund position that changes depending on who answers.",
    ],
    warningSigns: [
      "Terms excluding all liability in every circumstance.",
      "Charges that appear only at the final step of checkout.",
      "Terms referring to policies that do not exist.",
      "Subscription terms with no clear way to cancel.",
    ],
    whenLegalReviewIsAppropriate: [
      "You are selling to consumers at scale.",
      "You operate subscriptions, a marketplace, or hold customer funds.",
      "You sell regulated goods or services.",
      "A regulator or a group of customers has raised a complaint.",
    ],
    related: {
      guides: ["before-launching-an-online-business"],
      compliance: ["consumer-protection"],
    },
    meta: businessMeta({
      label: "Federal Competition and Consumer Protection Act 2018",
    }),
  },
  {
    id: "cn-11",
    slug: "privacy-policy",
    name: "Privacy policy",
    family: "Customer-facing",
    whatItIs:
      "A notice telling people what personal data you collect, why, what you do with it, how long you keep it, and what rights they have.",
    whyItMatters:
      "It is the most public statement a business makes about its data practices - and the easiest one to contradict. A policy describing a business other than yours is worse than none, because it is evidence.",
    commonlyUsedWhen: [
      "You collect personal data in any form, online or offline.",
      "You run a website, an app, a loyalty scheme or CCTV.",
      "You employ people, whose data you also hold.",
    ],
    importantClauses: [
      {
        name: "What data is collected",
        purpose: "Tells people what you hold.",
        whatToCheck: "That it matches your actual data inventory, field for field.",
      },
      {
        name: "Purpose and lawful basis",
        purpose: "Explains why you process it.",
        whatToCheck: "A basis stated per purpose, not one basis asserted for everything.",
      },
      {
        name: "Sharing and processors",
        purpose: "Discloses who else touches the data.",
        whatToCheck: "That every tool and partner actually in use is covered.",
      },
      {
        name: "Retention",
        purpose: "States how long you keep it.",
        whatToCheck: "That a period is actually stated, and actually observed.",
      },
      {
        name: "Rights and how to exercise them",
        purpose: "Tells people how to reach you.",
        whatToCheck: "That the contact route works and someone is responsible for it.",
      },
      {
        name: "International transfers",
        purpose: "Discloses data leaving Nigeria.",
        whatToCheck: "That it reflects where your tooling actually stores data.",
      },
    ],
    commonMistakes: [
      "Publishing a template describing systems you do not use.",
      "Listing a lawful basis of consent for processing you would do anyway.",
      "Never updating it after adding new tools.",
      "Providing a contact route nobody monitors.",
    ],
    warningSigns: [
      "The policy names a jurisdiction or regulator unrelated to your business.",
      "It promises deletion on a schedule nobody operates.",
      "Nobody in the business can confirm it is accurate.",
    ],
    whenLegalReviewIsAppropriate: [
      "You process sensitive data or data at scale.",
      "You transfer data outside Nigeria routinely.",
      "You use profiling or automated decision-making.",
      "A regulator or a data subject has raised a question.",
    ],
    related: {
      guides: ["before-collecting-customer-data"],
      compliance: ["data-protection"],
      rights: ["privacy"],
    },
    meta: businessMeta({ label: "Nigeria Data Protection Act 2023" }),
  },
];
