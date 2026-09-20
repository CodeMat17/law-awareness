import type {
  AlertTopic,
  CalendarEntry,
  ComplianceTopic,
  HealthCheckQuestion,
  ProfileQuestion,
} from "./types";
import { businessMeta } from "./business-meta";

/**
 * Business & Enterprise seed content, part 2: the Compliance Centre, the health
 * check, the profiler, alert topics and the business legal calendar
 * (spec sections 18, 19, 21, 23 and 24).
 *
 * `areaId` on a topic, a question and a calendar entry all point at the same
 * `ComplianceArea` ids in `./data`, so the Compliance Centre, the health check
 * and the calendar are three views of one spine rather than three lists that
 * can drift apart.
 *
 * See `./business.ts` for the editorial rules this file also follows. The point
 * that matters most here: NO calendar entry carries a date. Spec section 24
 * forbids hard-coding legal deadlines without a maintained source and review
 * process, so an entry describes a cadence and the trigger that starts the
 * clock, and the UI tells readers to confirm actual dates with the regulator.
 */

/* -------------------------------------------------------------------------- */
/* Compliance Centre topics (spec section 21)                                  */
/* -------------------------------------------------------------------------- */

export const complianceTopics: ComplianceTopic[] = [
  {
    id: "ct-1",
    slug: "business-structure-and-registration",
    title: "Business structure and registration",
    areaId: "ca-1",
    summary:
      "Which legal form you trade through decides who carries the liability, how ownership moves, and what the business is able to do.",
    icon: "building-2",
    whatItCovers: [
      "The forms available under CAMA 2020 - private and public companies, limited liability partnerships, limited partnerships, business names and incorporated trustees.",
      "Whether the business is a separate legal person, and therefore whether its debts are its own.",
      "Registration with the Corporate Affairs Commission, and keeping the register accurate as the business changes.",
      "Company particulars that must be kept current: registered address, directors, secretary, shareholding and persons with significant control.",
    ],
    appliesWhen: [
      "You are trading, or about to trade, in any form.",
      "Ownership, directors, address or share capital have changed since registration.",
      "You are adding partners, investors or a new line of business.",
      "You are contracting with counterparties who will verify your legal identity.",
    ],
    goodPractice: [
      "Choose the structure for liability and ownership, not for speed of registration.",
      "Keep the entity's registered particulars accurate as things change, rather than at year end.",
      "Contract in the exact registered name, and use it on invoices and agreements.",
      "Keep the certificate, constitutional documents and statutory registers in one known place.",
      "Separate business and personal bank accounts from the first day of trading.",
    ],
    commonGaps: [
      "Trading under a registered business name in the belief that it limits personal liability.",
      "Directors, addresses and shareholdings on the register that no longer reflect reality.",
      "Contracts signed in a trading name that is not a legal entity.",
      "Statutory registers that were never opened after incorporation.",
    ],
    whenToInvolveALawyer: [
      "You are choosing a structure for a venture with material assets or several owners.",
      "You are restructuring, converting, or bringing in an investor.",
      "Ownership or control is disputed.",
      "You are registering a structure with charitable or trustee elements.",
    ],
    related: {
      guides: ["before-entering-a-partnership"],
      compliance: ["corporate-governance", "record-keeping"],
      briefings: ["governance-essentials"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "ct-2",
    slug: "contracts",
    title: "Contracts",
    areaId: "ca-2",
    summary:
      "Every commercial relationship is governed by something. The only question is whether it is a document you chose or a set of assumptions you did not.",
    icon: "signature",
    whatItCovers: [
      "Customer, supplier, employment, contractor, partnership and financing agreements.",
      "How agreements are formed, varied and brought to an end.",
      "Allocation of risk: liability caps, indemnities, warranties and insurance requirements.",
      "Dispute resolution, governing law and forum - including arbitration under the Arbitration and Mediation Act 2023.",
    ],
    appliesWhen: [
      "You buy from, sell to, hire, or partner with anyone.",
      "You trade on standard terms - your own or someone else's.",
      "You are relying on a course of dealing rather than a signed document.",
      "You are about to renew, vary or exit an existing agreement.",
    ],
    goodPractice: [
      "Keep one signed, complete copy of every agreement, including annexes incorporated by reference.",
      "Diarise renewal and notice windows on the day of signature.",
      "Set an internal rule about who may sign and up to what value.",
      "Have a standard set of terms for the things you do repeatedly.",
      "Read the liability, termination and dispute clauses before the commercial schedule.",
    ],
    commonGaps: [
      "Agreements that were negotiated but never signed by both parties.",
      "Purchase orders and master agreements that contradict each other.",
      "Automatic renewals nobody tracked.",
      "No written terms at all with the largest customer or supplier.",
      "No data-protection terms in agreements that plainly involve personal data.",
    ],
    whenToInvolveALawyer: [
      "The agreement is material to the business, or hard to exit.",
      "Unlimited liability, an uncapped indemnity or a personal guarantee is proposed.",
      "Foreign law, a foreign forum or cross-border performance is involved.",
      "You are drafting the standard terms the business will use everywhere.",
    ],
    related: {
      guides: ["before-signing-a-supplier-contract"],
      safety: ["before-you-sign"],
      contracts: ["service-agreement", "supplier-agreement"],
    },
    meta: businessMeta({ label: "Arbitration and Mediation Act 2023" }),
  },
  {
    id: "ct-3",
    slug: "employment-and-payroll",
    title: "Employment and payroll",
    areaId: "ca-3",
    summary:
      "Written terms, correct classification, statutory deductions and records - the four things every employment claim tends to turn on.",
    icon: "users",
    whatItCovers: [
      "Written statements of terms, and the difference between employees and contractors.",
      "Working time, leave and the general conditions addressed by the Labour Act.",
      "Pay-as-you-earn deductions, and contributory pension and employee-compensation schemes where they apply.",
      "Discipline, grievance, redundancy and termination, and the records that evidence them.",
      "Employee personal data, which is subject to the same data-protection duties as customer data.",
    ],
    appliesWhen: [
      "Anyone works in your business other than the owners.",
      "You engage contractors who work like employees.",
      "You are changing terms, restructuring or making a role redundant.",
      "You are growing past the point where the owner knows everyone's terms by memory.",
    ],
    goodPractice: [
      "Issue written terms before the start date, every time.",
      "Classify by the substance of the arrangement, not by which label is cheaper.",
      "Run payroll on a schedule, issue payslips, and retain remittance evidence.",
      "Keep a written disciplinary and grievance procedure and apply it consistently.",
      "Hold one HR file per person, with access limited to those who need it.",
    ],
    commonGaps: [
      "Long-serving staff with no signed contract.",
      "Contractors who are managed, scheduled and equipped exactly like employees.",
      "Deductions made but not remitted.",
      "Dismissals with no documented warnings or process.",
      "HR records held in personal email and shared drives.",
    ],
    whenToInvolveALawyer: [
      "A dismissal is contested, or a claim has been threatened.",
      "You are making several roles redundant, or restructuring a function.",
      "You want enforceable post-employment restrictions.",
      "You are transferring staff as part of a transaction.",
    ],
    related: {
      guides: ["before-hiring-an-employee", "before-terminating-an-employee"],
      rights: ["at-work"],
      contracts: ["employment-agreement"],
    },
    meta: businessMeta({
      label: "Labour Act, Cap L1 LFN 2004 · Pension Reform Act 2014",
    }),
  },
  {
    id: "ct-4",
    slug: "tax-awareness",
    title: "Tax awareness",
    areaId: "ca-4",
    summary:
      "Registration, records and returns. This is awareness of the framework a business sits in - it is not tax advice, and rates and deadlines change.",
    icon: "receipt",
    whatItCovers: [
      "Registering the business with the relevant tax authority and obtaining a taxpayer identification.",
      "Understanding which taxes attach to your activity - company income tax, value added tax and personal income tax on employment income among them.",
      "Withholding and remittance duties that fall on the business as a payer.",
      "Keeping books and supporting records adequate to prepare and evidence a return.",
    ],
    appliesWhen: [
      "The business is registered and trading in any form.",
      "You employ people, or pay contractors from whom deductions may be required.",
      "You sell goods or services that may attract value added tax.",
      "You are expanding into new states, new activities or across borders.",
    ],
    goodPractice: [
      "Register when you start trading rather than when you are first asked.",
      "Keep bookkeeping current monthly - a return is only as good as the records behind it.",
      "Separate business and personal spending completely.",
      "Retain invoices, receipts and remittance evidence for your retention period.",
      "Use a qualified tax professional for filings, and confirm current rates and dates with the tax authority directly.",
    ],
    commonGaps: [
      "Trading for a period before registering at all.",
      "Deducting withholding tax or pay-as-you-earn and not remitting it.",
      "Books reconstructed once a year from a bank statement.",
      "Personal expenses run through the business with no records.",
      "Relying on a rate or deadline someone remembered rather than confirming it.",
    ],
    whenToInvolveALawyer: [
      "You have received an assessment, an audit notice or a demand you dispute.",
      "You are restructuring, selling the business, or moving assets between entities.",
      "You are operating across borders and unsure where profits are taxable.",
      "Historic filings are incomplete and you need to regularise them.",
    ],
    related: {
      compliance: ["record-keeping"],
      briefings: ["five-risks-to-monitor"],
    },
    meta: businessMeta(),
  },
  {
    id: "ct-5",
    slug: "data-protection",
    title: "Data protection",
    areaId: "ca-5",
    summary:
      "The duties that attach the moment your business decides why and how personal information is processed.",
    icon: "database",
    whatItCovers: [
      "The framework established by the Nigeria Data Protection Act 2023 and the role of the Nigeria Data Protection Commission.",
      "Lawful bases for processing, and the principles of minimisation, purpose limitation and storage limitation.",
      "The rights of data subjects, and being able to answer them.",
      "Security of processing, breach handling, and the use of processors and cross-border transfers.",
    ],
    appliesWhen: [
      "You hold customer, employee, supplier or applicant information.",
      "You run a website, an app, a loyalty scheme, CCTV, or a marketing list.",
      "You use third-party tools that store or analyse personal data.",
      "You transfer data outside Nigeria as part of ordinary operations.",
    ],
    goodPractice: [
      "Maintain an inventory of what you hold, why, where it sits and how long you keep it.",
      "Choose a lawful basis per purpose, and prefer a durable one over consent where appropriate.",
      "Publish a privacy notice that describes what your business actually does.",
      "Give individual accounts with least-privilege access, and remove them on exit.",
      "Write a breach procedure before you need one, and record every incident.",
    ],
    commonGaps: [
      "A template privacy policy describing a different business.",
      "Nobody able to say which tools hold customer data.",
      "Shared logins to the systems holding personal records.",
      "No retention period, so nothing is ever deleted.",
      "No route to find everything held about one person.",
    ],
    whenToInvolveALawyer: [
      "You process sensitive categories, or personal data at significant scale.",
      "You are building profiling or automated decision-making.",
      "A breach has occurred, or the Commission or a data subject has contacted you.",
      "You are acquiring or transferring a database.",
    ],
    related: {
      guides: ["before-collecting-customer-data"],
      rights: ["privacy"],
      contracts: ["privacy-policy"],
      briefings: ["what-a-data-regulation-means"],
    },
    meta: businessMeta({ label: "Nigeria Data Protection Act 2023" }),
  },
  {
    id: "ct-6",
    slug: "intellectual-property",
    title: "Intellectual property",
    areaId: "ca-6",
    summary:
      "Brand, content, software and invention - what the business owns, what it merely licenses, and what it never secured at all.",
    icon: "lightbulb",
    whatItCovers: [
      "Copyright in written work, images, software and audiovisual material under the Copyright Act 2022.",
      "Trade marks: the names and marks the business trades under, and registration under the Trade Marks Act.",
      "Patents and designs, where the business creates technical or visual innovation.",
      "Ownership of work created by employees and contractors, and confidentiality of trade secrets.",
    ],
    appliesWhen: [
      "The business has a name, a logo, a website or any published content.",
      "Freelancers or agencies have produced anything for you.",
      "You use stock images, fonts, music, code libraries or templates.",
      "Your product, method or brand is a material part of the value of the business.",
    ],
    goodPractice: [
      "Run an availability check before committing to a brand.",
      "Register the marks the business genuinely trades under.",
      "Take written assignments from every contractor and freelancer.",
      "Keep licences and proof of purchase with the assets they cover.",
      "Treat confidential information as a managed asset, with access limits and written terms.",
    ],
    commonGaps: [
      "A logo commissioned with no assignment, still owned by the designer.",
      "Assets in use whose source nobody can identify.",
      "Free-tier or personal licences used commercially.",
      "A brand built for years with no registration.",
      "Source code owned personally by a founder rather than by the company.",
    ],
    whenToInvolveALawyer: [
      "You have received, or wish to make, an infringement claim.",
      "You are registering, opposing or licensing a mark.",
      "IP is material to a sale, an investment or a partnership.",
      "You are relying on open-source components with obligations you are unsure of.",
    ],
    related: {
      guides: ["before-using-another-brand-or-content"],
      contracts: ["nda", "consultancy-agreement"],
    },
    meta: businessMeta({ label: "Copyright Act 2022 · Trade Marks Act" }),
  },
  {
    id: "ct-7",
    slug: "consumer-protection",
    title: "Consumer protection",
    areaId: "ca-7",
    summary:
      "How you describe, price, sell and stand behind what you offer - and how you handle it when a customer says you got it wrong.",
    icon: "shopping-bag",
    whatItCovers: [
      "The framework set by the Federal Competition and Consumer Protection Act 2018 and the role of the FCCPC.",
      "Misleading representations, and claims made in advertising and at the point of sale.",
      "Unfair terms, and terms presented after the customer has already committed.",
      "Complaint handling, remedies, and how disputes with consumers are resolved.",
    ],
    appliesWhen: [
      "You sell goods or services to the public.",
      "You advertise, run promotions, or make performance claims.",
      "You operate returns, refunds, guarantees or subscriptions.",
      "You use standard terms drafted entirely in your own favour.",
    ],
    goodPractice: [
      "Be able to substantiate every claim before it is published.",
      "Show the price the customer will actually pay, including unavoidable charges.",
      "Present terms before purchase, in language a customer can follow.",
      "Log complaints, respond within a standard you can meet, and look for patterns.",
      "Train anyone who sells on what may and may not be promised.",
    ],
    commonGaps: [
      "Marketing claims nobody in the business can evidence.",
      "Charges that only appear at the last step of checkout.",
      "A refund position that changes depending on who answers.",
      "Terms that exclude everything, including things that cannot be excluded.",
      "Complaints handled informally and never recorded.",
    ],
    whenToInvolveALawyer: [
      "A regulator has contacted you, or a complaint has escalated.",
      "You are drafting consumer terms, guarantees or subscription mechanics.",
      "You face a group of consumers with a common complaint.",
      "You sell in a sector with additional consumer or safety requirements.",
    ],
    related: {
      guides: ["before-launching-an-online-business"],
      contracts: ["terms-and-conditions"],
      industries: ["retail", "hospitality"],
    },
    meta: businessMeta({
      label: "Federal Competition and Consumer Protection Act 2018",
    }),
  },
  {
    id: "ct-8",
    slug: "licensing-and-industry-regulation",
    title: "Licensing and industry regulation",
    areaId: "ca-8",
    summary:
      "Some activities need permission before they begin. Which permissions depend entirely on what you do and where you do it.",
    icon: "badge-check",
    whatItCovers: [
      "Sector-specific approvals, permits and registrations that attach to an activity rather than to a business size.",
      "Sector regulators, and the difference between registering a company and being authorised to carry on an activity.",
      "Premises, safety, environmental and professional requirements that can apply alongside sector rules.",
      "Anti-money-laundering obligations, which attach to certain businesses and professions under the Money Laundering (Prevention and Prohibition) Act 2022.",
    ],
    appliesWhen: [
      "You handle client money, or provide financial, insurance or investment services.",
      "You produce, import or sell food, drugs, cosmetics or regulated products.",
      "You provide healthcare, education, security, telecommunications or transport services.",
      "You are entering a new sector, a new state, or a new activity within your sector.",
    ],
    goodPractice: [
      "Confirm what authorisation your specific activity needs before you start it.",
      "Verify requirements with the regulator directly rather than from secondary sources.",
      "Keep permits, approvals and renewals in one register with owners named.",
      "Re-check the position whenever the business adds an activity or a location.",
      "Where anti-money-laundering duties apply, put identification and record-keeping procedures in place.",
    ],
    commonGaps: [
      "Assuming company registration is the same as sector authorisation.",
      "Operating a regulated activity as a small side line of an unregulated business.",
      "Permits that lapsed because no one owned the renewal.",
      "Expanding into a new state without re-checking local requirements.",
    ],
    whenToInvolveALawyer: [
      "You are unsure whether your activity is regulated.",
      "You are applying for, or have been refused, an authorisation.",
      "A regulator has raised a concern or begun an inquiry.",
      "You are entering a regulated sector by acquisition or partnership.",
    ],
    related: {
      industries: ["financial-services", "healthcare", "hospitality"],
      compliance: ["record-keeping"],
    },
    meta: businessMeta({
      label: "Money Laundering (Prevention and Prohibition) Act 2022",
    }),
  },
  {
    id: "ct-9",
    slug: "record-keeping",
    title: "Record keeping",
    areaId: "ca-9",
    summary:
      "Records are how a business proves what happened. Almost every other area on this page is evidenced by something in this one.",
    icon: "folder",
    whatItCovers: [
      "Statutory registers and company records required under CAMA 2020.",
      "Accounting records adequate to show the position of the business and support its filings.",
      "Employment records: contracts, payslips, leave, discipline and remittances.",
      "Contracts, permits, insurance policies, and evidence of consents and licences.",
      "Retention periods, and secure disposal when a period ends.",
    ],
    appliesWhen: [
      "Always. Record keeping is the one area with no threshold.",
      "Especially where a dispute, audit, inspection or claim is foreseeable.",
      "Where more than one person can create or change records.",
    ],
    goodPractice: [
      "Decide where each category of record lives, and who owns it.",
      "Keep records as events happen rather than reconstructing them later.",
      "Set retention periods, and delete on schedule - particularly for personal data.",
      "Back records up, and test that a restore actually works.",
      "Ensure the business, not an individual, controls the accounts holding its records.",
    ],
    commonGaps: [
      "Company statutory registers never opened.",
      "Records held in a founder's personal email or phone.",
      "No backup, or a backup nobody has ever restored from.",
      "Everything kept forever, including personal data with no purpose.",
      "Access lost when a staff member leaves.",
    ],
    whenToInvolveALawyer: [
      "You have received a demand, an inspection notice or a disclosure request.",
      "Records that should exist cannot be found and a claim is likely.",
      "You are setting retention policy for sensitive or regulated records.",
      "A dispute over control of company records has arisen.",
    ],
    related: {
      compliance: ["corporate-governance", "tax-awareness", "data-protection"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "ct-10",
    slug: "corporate-governance",
    title: "Corporate governance",
    areaId: "ca-10",
    summary:
      "Who decides, how decisions are recorded, and the duties that attach to the people holding control.",
    icon: "landmark",
    whatItCovers: [
      "Directors' duties, and the standard expected of a person exercising control of a company.",
      "Board and shareholder decision-making, meetings, resolutions and minutes.",
      "Conflicts of interest, related-party transactions and authority to bind the company.",
      "Statutory filings and company officers, including company secretary requirements where they apply.",
    ],
    appliesWhen: [
      "The business is incorporated, however small.",
      "There is more than one owner, or any external investor.",
      "Directors also transact with the company personally or through other entities.",
      "You are preparing for investment, a sale, or external scrutiny.",
    ],
    goodPractice: [
      "Hold decisions as decisions - minuted, dated and retained.",
      "Declare conflicts, and record how a conflicted decision was handled.",
      "Set out who may commit the company, and to what value.",
      "Keep statutory filings and registers current as changes occur.",
      "Separate the company's money and assets from the owners' absolutely.",
    ],
    commonGaps: [
      "Decisions made in conversation and never recorded.",
      "One director acting on matters that require the board or the shareholders.",
      "Related-party dealings with no declaration and no record.",
      "Registers and filings that stopped being updated after year one.",
    ],
    whenToInvolveALawyer: [
      "A director's conduct, or a conflict, is in question.",
      "Shareholders disagree, or a deadlock has formed.",
      "You are preparing for investment or a sale.",
      "The company is in financial difficulty and directors' duties are engaged.",
    ],
    related: {
      guides: ["before-entering-a-partnership"],
      contracts: ["shareholder-agreement"],
      briefings: ["governance-essentials"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "ct-11",
    slug: "dispute-prevention",
    title: "Dispute prevention",
    areaId: "ca-11",
    summary:
      "Most commercial disputes are decided by what was agreed and recorded long before anyone was angry.",
    icon: "shield",
    whatItCovers: [
      "Clear written terms, and the escalation and dispute clauses inside them.",
      "Arbitration and mediation under the Arbitration and Mediation Act 2023, and what a dispute clause commits you to.",
      "Evidence: correspondence, delivery records, approvals and change requests.",
      "Debt recovery conducted lawfully, and the limits on how a debt may be pursued.",
    ],
    appliesWhen: [
      "You have customers, suppliers, staff, landlords or lenders.",
      "Work is varied mid-delivery, or scope changes informally.",
      "Payment is late, or quality has been challenged.",
      "You are considering pursuing or defending a claim.",
    ],
    goodPractice: [
      "Confirm important conversations in writing the same day.",
      "Record variations and approvals as they happen, not at the end.",
      "Use escalation steps before formal proceedings, and follow them.",
      "Pursue debts through lawful channels only - never through threats, intimidation or public shaming.",
      "Assess cost, time and recoverability before starting a claim.",
    ],
    commonGaps: [
      "Scope changed verbally, then disputed as unpaid extras.",
      "No written record of the approval everything depends on.",
      "Dispute clauses agreed without any thought about cost or forum.",
      "Debt chased in ways that create liability for the creditor.",
    ],
    whenToInvolveALawyer: [
      "A claim has been threatened, made, or served.",
      "The amount or the relationship at stake is material.",
      "You are considering arbitration, or are bound to it.",
      "You need to preserve a position quickly, or a limitation period may be running.",
    ],
    related: {
      guides: ["before-signing-a-supplier-contract"],
      compliance: ["contracts", "record-keeping"],
    },
    meta: businessMeta({ label: "Arbitration and Mediation Act 2023" }),
  },
  {
    id: "ct-12",
    slug: "insurance-and-risk",
    title: "Insurance and risk",
    areaId: "ca-12",
    summary:
      "Insurance does not remove a legal obligation. It decides whether the business survives one that crystallises.",
    icon: "umbrella",
    whatItCovers: [
      "Cover matched to what the business actually does, including its people, premises and liabilities.",
      "Employee-related cover, including the scheme established by the Employee's Compensation Act 2010 where it applies.",
      "Contractual insurance requirements, which frequently oblige a business to hold specific cover.",
      "Business continuity: what happens if a key system, site or person is unavailable.",
    ],
    appliesWhen: [
      "You employ anyone, or bring the public onto premises.",
      "Your contracts require you to carry specified cover.",
      "You hold stock, equipment, data or client property.",
      "A single failure could stop the business trading.",
    ],
    goodPractice: [
      "Match the cover to the actual operation, not to a generic policy description.",
      "Read the exclusions before relying on a policy.",
      "Check contractual insurance obligations when you sign, not when you claim.",
      "Review cover whenever the business changes what it does.",
      "Keep a short continuity plan for the failures that would hurt most.",
    ],
    commonGaps: [
      "Cover bought once and never revisited as the business changed.",
      "Policies that exclude the activity the business mainly performs.",
      "Contractual insurance requirements accepted and never met.",
      "No continuity plan for the loss of a key system or person.",
    ],
    whenToInvolveALawyer: [
      "A claim has been declined, or cover is disputed.",
      "A contract requires cover you are unsure you hold.",
      "An incident has occurred that may give rise to liability.",
      "You are assessing risk for an investment or a sale.",
    ],
    related: {
      compliance: ["employment-and-payroll", "dispute-prevention"],
      briefings: ["five-risks-to-monitor"],
    },
    meta: businessMeta({ label: "Employee's Compensation Act 2010" }),
  },
];

/* -------------------------------------------------------------------------- */
/* Health check (spec section 19)                                              */
/* -------------------------------------------------------------------------- */

/**
 * One question per compliance area, phrased so that a confident yes is a
 * genuine signal. Questions ask about evidence a business either has or does
 * not - never about a legal conclusion the reader is not equipped to draw.
 */
export const healthCheckQuestions: HealthCheckQuestion[] = [
  {
    id: "hq-1",
    areaId: "ca-1",
    prompt:
      "Is the business registered in the form you intended, with its particulars currently accurate?",
    help: "Directors, address, shareholding and ownership as recorded should match reality today.",
  },
  {
    id: "hq-2",
    areaId: "ca-2",
    prompt:
      "Do you have a signed written agreement with every significant customer and supplier?",
    help: "Signed by both sides, complete with annexes, and findable within a few minutes.",
  },
  {
    id: "hq-3",
    areaId: "ca-3",
    prompt:
      "Does everyone who works in the business have written terms matching how they are actually engaged?",
    help: "Including whether people treated as contractors are managed as employees in practice.",
  },
  {
    id: "hq-4",
    areaId: "ca-4",
    prompt:
      "Is the business registered with the relevant tax authority, with bookkeeping kept current?",
    help: "Current means monthly, not reconstructed once a year.",
  },
  {
    id: "hq-5",
    areaId: "ca-5",
    prompt:
      "Can you list every place personal data is stored, why you hold it, and how long you keep it?",
    help: "Customer, employee and supplier data, including third-party tools.",
  },
  {
    id: "hq-6",
    areaId: "ca-6",
    prompt:
      "Does the business own, or properly license, its brand, content, code and designs?",
    help: "Including written assignments from every freelancer and agency.",
  },
  {
    id: "hq-7",
    areaId: "ca-7",
    prompt:
      "Can you substantiate every claim you publish, and is your refund position written down?",
    help: "Including prices displayed with all unavoidable charges.",
  },
  {
    id: "hq-8",
    areaId: "ca-8",
    prompt:
      "Have you confirmed with the regulator what authorisation your specific activity requires?",
    help: "Company registration is not the same as authorisation to carry on an activity.",
  },
  {
    id: "hq-9",
    areaId: "ca-9",
    prompt:
      "Are your company, financial and employment records complete, backed up and controlled by the business?",
    help: "Controlled by the business means not sitting in an individual's personal account.",
  },
  {
    id: "hq-10",
    areaId: "ca-10",
    prompt:
      "Are significant decisions recorded, with conflicts declared and authority to sign defined?",
    help: "Minutes, resolutions, and a written rule about who may commit the business.",
  },
  {
    id: "hq-11",
    areaId: "ca-11",
    prompt:
      "Are variations, approvals and important conversations confirmed in writing as they happen?",
    help: "This is the evidence a dispute is decided on.",
  },
  {
    id: "hq-12",
    areaId: "ca-12",
    prompt:
      "Does your insurance match what the business actually does, and any cover your contracts require?",
    help: "Check the exclusions, not only the policy title.",
  },
];

/* -------------------------------------------------------------------------- */
/* "What laws apply to my business?" profiler (spec section 18)                */
/* -------------------------------------------------------------------------- */

/**
 * The profiler surfaces educational topics, never obligations. Each option maps
 * to compliance area ids; the repository turns those into `ComplianceTopic`s.
 * The UI states plainly that this is not a determination of what applies.
 */
export const profileQuestions: ProfileQuestion[] = [
  {
    id: "pq-1",
    label: "How is the business set up?",
    kind: "single",
    help: "The structure decides who carries liability when something goes wrong.",
    options: [
      { value: "unregistered", label: "Not registered yet", areas: ["ca-1", "ca-9"] },
      { value: "business-name", label: "Registered business name", areas: ["ca-1", "ca-9"] },
      { value: "company", label: "Limited company", areas: ["ca-1", "ca-10", "ca-9"] },
      { value: "partnership", label: "Partnership or LLP", areas: ["ca-1", "ca-10", "ca-2"] },
    ],
  },
  {
    id: "pq-2",
    label: "How many people work in the business?",
    kind: "single",
    options: [
      { value: "owner-only", label: "Just the owners", areas: ["ca-2"] },
      { value: "small", label: "A small team", areas: ["ca-3", "ca-9"] },
      { value: "growing", label: "A growing workforce", areas: ["ca-3", "ca-9", "ca-12"] },
      { value: "large", label: "A large workforce", areas: ["ca-3", "ca-9", "ca-12", "ca-10"] },
    ],
  },
  {
    id: "pq-3",
    label: "Where do you sell?",
    kind: "single",
    options: [
      { value: "offline", label: "In person only", areas: ["ca-7", "ca-12"] },
      { value: "online", label: "Online only", areas: ["ca-7", "ca-5", "ca-6"] },
      { value: "both", label: "Both", areas: ["ca-7", "ca-5", "ca-12"] },
    ],
  },
  {
    id: "pq-4",
    label: "Do you collect customer personal data?",
    kind: "boolean",
    help: "Names, phone numbers, addresses, photographs and payment identifiers all count.",
    options: [
      { value: "yes", label: "Yes", areas: ["ca-5", "ca-9"] },
      { value: "no", label: "No", areas: [] },
    ],
  },
  {
    id: "pq-5",
    label: "Do you employ staff?",
    kind: "boolean",
    options: [
      { value: "yes", label: "Yes", areas: ["ca-3", "ca-4", "ca-12", "ca-9"] },
      { value: "no", label: "No", areas: [] },
    ],
  },
  {
    id: "pq-6",
    label: "Do you use contractors or freelancers?",
    kind: "boolean",
    help: "Including designers, developers and anyone producing work for the business.",
    options: [
      { value: "yes", label: "Yes", areas: ["ca-2", "ca-6", "ca-3"] },
      { value: "no", label: "No", areas: [] },
    ],
  },
  {
    id: "pq-7",
    label: "Do you sell products or services to consumers?",
    kind: "boolean",
    options: [
      { value: "yes", label: "Yes", areas: ["ca-7", "ca-2"] },
      { value: "no", label: "No", areas: ["ca-2"] },
    ],
  },
  {
    id: "pq-8",
    label: "Do you operate in a regulated activity?",
    kind: "boolean",
    help: "Financial services, healthcare, food and drugs, education, security, telecoms and transport are common examples.",
    options: [
      { value: "yes", label: "Yes, or I am not sure", areas: ["ca-8", "ca-9", "ca-10"] },
      { value: "no", label: "No", areas: [] },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Law change alert topics (spec section 23)                                   */
/* -------------------------------------------------------------------------- */

export const alertTopics: AlertTopic[] = [
  {
    slug: "employment",
    label: "Employment",
    description: "Terms, payroll, workplace duties and termination.",
    icon: "users",
  },
  {
    slug: "tax",
    label: "Tax",
    description: "Registration, filing frameworks and administration.",
    icon: "receipt",
  },
  {
    slug: "data-protection",
    label: "Data Protection",
    description: "Processing duties, transfers and enforcement.",
    icon: "database",
  },
  {
    slug: "corporate-law",
    label: "Corporate Law",
    description: "Companies, directors, filings and structures.",
    icon: "landmark",
  },
  {
    slug: "consumer-protection",
    label: "Consumer Protection",
    description: "Selling, advertising, unfair terms and competition.",
    icon: "shopping-bag",
  },
  {
    slug: "technology-law",
    label: "Technology Law",
    description: "Online conduct, cybersecurity and digital services.",
    icon: "wifi",
  },
  {
    slug: "intellectual-property",
    label: "Intellectual Property",
    description: "Copyright, trade marks, designs and licensing.",
    icon: "lightbulb",
  },
  {
    slug: "financial-regulation",
    label: "Financial Regulation",
    description: "Banking, payments, investment and anti-money-laundering.",
    icon: "banknote",
  },
  {
    slug: "labour",
    label: "Labour",
    description: "Collective relations, minimum standards and industrial law.",
    icon: "hard-hat",
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    description: "Land, title, tenancy and property transactions.",
    icon: "home",
  },
];

/* -------------------------------------------------------------------------- */
/* Business legal calendar (spec section 24)                                   */
/* -------------------------------------------------------------------------- */

/**
 * NO ENTRY CARRIES A DATE.
 *
 * Spec section 24 forbids hard-coding legal deadlines without a maintained
 * source and review process. Each entry therefore states the cadence and the
 * event that starts the clock, and the calendar page tells readers in terms to
 * confirm actual dates with the relevant authority.
 */
export const calendarEntries: CalendarEntry[] = [
  {
    id: "cal-1",
    title: "Annual returns and company filings",
    cadence: "annual",
    trigger: "Your company's annual return cycle under CAMA 2020",
    timing:
      "Once a year, on the cycle that applies to your entity. Confirm your own due date with the Corporate Affairs Commission.",
    summary:
      "Companies and registered entities are expected to file annual returns and keep registered particulars current.",
    areaId: "ca-1",
    icon: "building-2",
    whatToPrepare: [
      "Current details of directors, shareholders and the registered address.",
      "Any changes made during the year that were not filed at the time.",
      "The statutory registers, updated to match.",
    ],
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "cal-2",
    title: "Payroll deductions and remittances",
    cadence: "monthly",
    trigger: "Each pay run",
    timing:
      "Every pay period, on the schedule set by the relevant authority. Confirm current dates with the tax authority and scheme administrators.",
    summary:
      "Pay-as-you-earn deductions, and pension and employee-compensation contributions where they apply, follow each pay run.",
    areaId: "ca-3",
    icon: "users",
    whatToPrepare: [
      "Payroll register for the period, with each deduction shown.",
      "Payslips issued to every employee.",
      "Evidence of remittance, filed with the payroll records.",
    ],
    meta: businessMeta({ label: "Pension Reform Act 2014" }),
  },
  {
    id: "cal-3",
    title: "Tax returns and bookkeeping close",
    cadence: "annual",
    trigger: "Your accounting year end",
    timing:
      "Annually, following your financial year end, with periodic filings in between. Confirm the filing calendar that applies to you with the tax authority.",
    summary:
      "Preparing a return is straightforward when the books were kept as the year went along, and painful when they were not.",
    areaId: "ca-4",
    icon: "receipt",
    whatToPrepare: [
      "Complete books for the period, reconciled to the bank.",
      "Invoices, receipts and remittance evidence.",
      "A qualified tax professional engaged before, not after, the deadline.",
    ],
    meta: businessMeta(),
  },
  {
    id: "cal-4",
    title: "Data protection review",
    cadence: "annual",
    trigger: "A fixed month you choose and keep",
    timing:
      "At least annually, and whenever you add a system, a tool or a new kind of data. Confirm any filing or audit duty with the Nigeria Data Protection Commission.",
    summary:
      "Re-walk your data inventory: what you hold, why, where it sits, who can reach it, and what should now be deleted.",
    areaId: "ca-5",
    icon: "database",
    whatToPrepare: [
      "The current data inventory and retention schedule.",
      "A list of processors and the terms you hold with them.",
      "Access lists, with leavers removed.",
    ],
    meta: businessMeta({ label: "Nigeria Data Protection Act 2023" }),
  },
  {
    id: "cal-5",
    title: "Contract renewal and notice review",
    cadence: "quarterly",
    trigger: "Renewal and notice windows in your agreements",
    timing:
      "Quarterly, against the dates in your own contracts. The only reliable source for these is the agreements themselves.",
    summary:
      "Auto-renewals and notice windows are missed because nobody owns them, not because they are hard to meet.",
    areaId: "ca-2",
    icon: "signature",
    whatToPrepare: [
      "A register of agreements with their renewal and notice dates.",
      "The decision on each: renew, renegotiate or exit.",
      "Notice served in the form the contract requires.",
    ],
    meta: businessMeta(),
  },
  {
    id: "cal-6",
    title: "Licence and permit renewals",
    cadence: "event-driven",
    trigger: "The expiry date on each permit you hold",
    timing:
      "As each authorisation falls due. Dates vary by regulator and by activity - confirm each one with the issuing body.",
    summary:
      "A lapsed permit can stop an activity entirely, and is usually harder to restore than to renew.",
    areaId: "ca-8",
    icon: "badge-check",
    whatToPrepare: [
      "A register of every permit, its expiry and a named owner.",
      "Renewal requirements checked with the regulator ahead of time.",
      "Evidence of continuing conditions, where the authorisation imposes them.",
    ],
    meta: businessMeta(),
  },
  {
    id: "cal-7",
    title: "Insurance review",
    cadence: "annual",
    trigger: "Your policy renewal",
    timing:
      "At each renewal, and whenever the business changes what it does.",
    summary:
      "Cover bought for the business you were is rarely right for the business you have become.",
    areaId: "ca-12",
    icon: "umbrella",
    whatToPrepare: [
      "A current description of activities, premises, people and assets.",
      "Insurance requirements from your contracts.",
      "The exclusions on your existing policies, read properly.",
    ],
    meta: businessMeta({ label: "Employee's Compensation Act 2010" }),
  },
  {
    id: "cal-8",
    title: "Board and governance cycle",
    cadence: "quarterly",
    trigger: "Your governance calendar",
    timing:
      "Quarterly for most companies, alongside any meeting your constitution requires.",
    summary:
      "Decisions taken as decisions, minuted and retained, are what make governance evidenceable later.",
    areaId: "ca-10",
    icon: "landmark",
    whatToPrepare: [
      "An agenda, and papers circulated in advance.",
      "Declarations of interest for anything conflicted.",
      "Minutes written up and retained with the company records.",
    ],
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "cal-9",
    title: "Records and retention housekeeping",
    cadence: "ongoing",
    trigger: "Your retention schedule",
    timing:
      "Continuous, with a scheduled review at least once a year.",
    summary:
      "Delete what has reached the end of its retention period, and confirm the records you must keep are actually recoverable.",
    areaId: "ca-9",
    icon: "folder",
    whatToPrepare: [
      "The retention schedule, and what has now aged out.",
      "A restore test from backup - not just a backup report.",
      "Confirmation that the business, not an individual, controls each account.",
    ],
    meta: businessMeta(),
  },
  {
    id: "cal-10",
    title: "Employment policy and terms review",
    cadence: "annual",
    trigger: "A fixed month you choose and keep",
    timing:
      "Annually, and whenever you change how people are engaged or paid.",
    summary:
      "Check that written terms, the disciplinary procedure and the handbook still describe how the business actually runs.",
    areaId: "ca-3",
    icon: "users",
    whatToPrepare: [
      "Signed terms on file for everyone currently working in the business.",
      "The disciplinary and grievance procedure as last applied.",
      "Any role that has changed enough to need new terms.",
    ],
    meta: businessMeta({ label: "Labour Act, Cap L1 LFN 2004" }),
  },
];
