import type {
  BusinessArea,
  BusinessGuide,
  BusinessGuideDetail,
} from "./types";
import { businessMeta } from "./business-meta";

/**
 * Business & Enterprise seed content, part 1: the section taxonomy and the
 * "Before You Do This" guides (spec sections 17 and 20).
 *
 * EDITORIAL RULES, applied by hand across every Phase 3 seed file:
 *
 * 1. Every instrument named is a real, well-known Nigerian enactment - CAMA
 *    2020, the Nigeria Data Protection Act 2023, the FCCPA 2018, the Labour
 *    Act, the Pension Reform Act 2014, the Employee's Compensation Act 2010,
 *    the Copyright Act 2022, the Trade Marks Act, the Cybercrimes Act 2015,
 *    the Land Use Act 1978, the Arbitration and Mediation Act 2023, the Money
 *    Laundering (Prevention and Prohibition) Act 2022 and the Nigeria Startup
 *    Act 2022 - and is described only in general terms.
 * 2. No filing deadline, fee, threshold, penalty figure or commencement date is
 *    stated anywhere. The calendar carries a cadence and a trigger, never a
 *    date, exactly as spec section 24 requires.
 * 3. No judgment, case citation, regulator ruling or professional credential is
 *    invented.
 * 4. Everything carries `review: "educational"`. The health check and the
 *    profiler are risk-awareness tools, and every surface that renders them
 *    says so.
 */

/* -------------------------------------------------------------------------- */
/* Business areas (spec section 17)                                            */
/* -------------------------------------------------------------------------- */

export const businessAreas: BusinessArea[] = [
  {
    slug: "start-a-business",
    name: "Start a Business",
    blurb: "Structure, registration and the decisions that are expensive to reverse.",
    icon: "building-2",
    href: "/business/compliance/business-structure-and-registration",
  },
  {
    slug: "running-a-business",
    name: "Running a Business",
    blurb: "The obligations that continue long after the certificate is framed.",
    icon: "briefcase",
    href: "/business/compliance",
  },
  {
    slug: "employment-and-hr",
    name: "Employment & HR",
    blurb: "Hiring, terms, payroll, discipline and ending an employment relationship.",
    icon: "users",
    href: "/business/compliance/employment-and-payroll",
  },
  {
    slug: "contracts",
    name: "Contracts",
    blurb: "What your agreements actually do when something goes wrong.",
    icon: "signature",
    href: "/business/contracts",
  },
  {
    slug: "tax-and-regulatory",
    name: "Tax & Regulatory",
    blurb: "Registration, records and the returns a business is expected to keep.",
    icon: "receipt",
    href: "/business/compliance/tax-awareness",
  },
  {
    slug: "data-protection",
    name: "Data Protection",
    blurb: "The duties that attach the moment you hold someone's personal data.",
    icon: "database",
    href: "/business/compliance/data-protection",
  },
  {
    slug: "intellectual-property",
    name: "Intellectual Property",
    blurb: "Brand, content and invention - and who owns what your team makes.",
    icon: "lightbulb",
    href: "/business/compliance/intellectual-property",
  },
  {
    slug: "corporate-governance",
    name: "Corporate Governance",
    blurb: "Directors, decisions, records and the duties that come with control.",
    icon: "landmark",
    href: "/business/compliance/corporate-governance",
  },
  {
    slug: "consumer-protection",
    name: "Consumer Protection",
    blurb: "How you describe, price, sell and stand behind what you offer.",
    icon: "shopping-bag",
    href: "/business/compliance/consumer-protection",
  },
  {
    slug: "debt-and-recovery",
    name: "Debt & Recovery",
    blurb: "Getting paid, chasing lawfully, and lending or borrowing safely.",
    icon: "banknote",
    href: "/business/guides/before-borrowing-money",
  },
  {
    slug: "disputes-and-litigation",
    name: "Disputes & Litigation",
    blurb: "Escalation, arbitration, and what a dispute clause commits you to.",
    icon: "gavel",
    href: "/business/compliance/dispute-prevention",
  },
  {
    slug: "business-compliance",
    name: "Business Compliance",
    blurb: "The full picture, area by area, with a readiness assessment.",
    icon: "list-checks",
    href: "/business/compliance",
  },
  {
    slug: "industry-regulations",
    name: "Industry Regulations",
    blurb: "What changes about your legal profile because of the sector you are in.",
    icon: "hard-hat",
    href: "/business/industries",
  },
];

/* -------------------------------------------------------------------------- */
/* "Before You Do This" guides (spec section 20)                               */
/* -------------------------------------------------------------------------- */

export const businessGuideDetails: BusinessGuideDetail[] = [
  {
    id: "bg-1",
    slug: "before-hiring-an-employee",
    title: "Before you hire your first employee",
    situation: "You are about to bring someone onto the payroll",
    summary:
      "Written terms, statutory deductions, record keeping and the difference between an employee and a contractor - settled before the first payday, not after a dispute.",
    area: "Employment & HR",
    checklistCount: 0,
    context: [
      "The first hire is the point at which a business stops being only a commercial arrangement and becomes an employer. A set of duties attaches on that day - about written terms, about deductions, about records - and almost none of them are easier to satisfy later.",
      "Most first-hire disputes are not about the law being unclear. They are about nothing having been written down: what the job was, what the pay was, how notice worked, and whether the person was an employee at all.",
    ],
    keyConsiderations: [
      {
        heading: "Employee or contractor is not a label you choose",
        body: "The classification follows the substance of the relationship - control over how the work is done, integration into the business, who supplies the tools, whether the person can send a substitute, and whether they carry their own commercial risk. Calling someone a consultant in the paperwork does not settle the question if the arrangement functions as employment.",
        instrument: "Labour Act, Cap L1 LFN 2004",
      },
      {
        heading: "Written terms protect the employer too",
        body: "A written statement of terms is what an employer relies on when a dispute arrives: the role, the pay, the hours, the place of work, the notice period, and what happens on termination. Where terms are unwritten, the gap is generally filled by what the parties actually did and by the general law - not by what the employer intended.",
        instrument: "Labour Act, Cap L1 LFN 2004",
      },
      {
        heading: "Payroll carries statutory deductions",
        body: "Employers are expected to deduct and remit tax under the pay-as-you-earn system, and contributory pension and employee-compensation schemes apply to employers meeting the criteria set out in their governing Acts. These are obligations of the business, not of the employee, and they begin with the employment - not at year end.",
        instrument:
          "Personal Income Tax Act · Pension Reform Act 2014 · Employee's Compensation Act 2010",
      },
      {
        heading: "Records are the evidence",
        body: "Contracts, payslips, leave records, disciplinary notes and remittance receipts are what an employer produces when a claim is made. A business that cannot show what it paid, when, and under what terms is arguing from memory against a documented account.",
      },
      {
        heading: "You need a disciplinary process before you need one",
        body: "A written disciplinary and grievance procedure, applied consistently, is what separates a defensible dismissal from a contested one. The time to write it is before the first performance problem, while nobody's conduct is in question.",
      },
    ],
    commonMistakes: [
      "Treating a long-term, full-time, closely supervised worker as a contractor to avoid payroll obligations.",
      "Starting someone on a verbal agreement and promising to do the contract later.",
      "Copying an employment contract from another country without checking it against Nigerian employment law.",
      "Deducting tax or pension from salary but not remitting it.",
      "Setting no probation terms, then discovering there is no clean way to end a bad fit.",
      "Keeping no written record of warnings, then dismissing for a pattern nobody documented.",
    ],
    redFlags: [
      "The candidate asks to be paid gross, with no deductions and no documentation.",
      "You are told the role does not need a contract because it is only for a few months.",
      "Your template contract sets a notice period for the employee but none for the employer.",
      "Nobody in the business can say who is responsible for remitting statutory deductions.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Decide the classification honestly",
        detail:
          "Test the arrangement against control, integration, substitution and commercial risk - not against which label is cheaper.",
      },
      {
        id: "c2",
        label: "Issue written terms before the start date",
        detail:
          "Role, duties, pay, hours, place of work, leave, notice and termination - given to the employee and signed.",
      },
      {
        id: "c3",
        label: "Set a probation period and say what it means",
        detail: "State the length, the review, and the notice that applies during it.",
      },
      {
        id: "c4",
        label: "Register the business for its payroll obligations",
        detail:
          "Confirm your position on pay-as-you-earn, pension and employee compensation with the relevant authority before the first payday.",
      },
      {
        id: "c5",
        label: "Issue payslips from month one",
        detail: "Gross pay, each deduction and net pay - issued every pay period and retained.",
      },
      {
        id: "c6",
        label: "Write down the leave position",
        detail:
          "Annual, sick and public holiday entitlement, and how leave is requested and recorded.",
      },
      {
        id: "c7",
        label: "Put confidentiality and IP assignment in the contract",
        detail:
          "Work the employee creates for the business should be dealt with expressly rather than assumed.",
      },
      {
        id: "c8",
        label: "Adopt a disciplinary and grievance procedure",
        detail: "A short written process, applied to everyone, before you need it.",
      },
      {
        id: "c9",
        label: "Agree who keeps the employment records",
        detail: "One named owner, one place, and a retention period.",
      },
      {
        id: "c10",
        label: "Check what employee personal data you now hold",
        detail: "Payroll and HR files are personal data and attract data-protection duties.",
      },
      {
        id: "c11",
        label: "Confirm your insurance position",
        detail: "Check whether your cover responds to employees and to the work they actually do.",
      },
      {
        id: "c12",
        label: "Diarise the first review",
        detail: "A scheduled review is the cheapest way to fix a mis-hire early and lawfully.",
      },
    ],
    whenToInvolveALawyer: [
      "You are hiring into a regulated role, or one requiring professional licensing.",
      "The person will hold significant confidential information, client relationships or intellectual property.",
      "You want post-employment restrictions - these are read narrowly, and drafted carefully or not at all.",
      "You are inheriting staff as part of buying a business.",
      "A dismissal is contested, or a claim has been threatened.",
    ],
    related: {
      rights: ["at-work"],
      compliance: ["employment-and-payroll", "data-protection"],
      contracts: ["employment-agreement"],
    },
    meta: businessMeta({ label: "Labour Act, Cap L1 LFN 2004" }),
  },
  {
    id: "bg-2",
    slug: "before-collecting-customer-data",
    title: "Before you collect customer data",
    situation: "Your product or shop is about to store personal information",
    summary:
      "What counts as personal data, why you are processing it, how long you keep it, and the duties the Nigeria Data Protection Act 2023 places on the organisation holding it.",
    area: "Data Protection",
    checklistCount: 0,
    context: [
      "A business becomes a data controller the moment it decides why and how personal information is processed - not when it reaches a particular size, and not only when it runs a website.",
      "The Nigeria Data Protection Act 2023 establishes the framework and the Nigeria Data Protection Commission as the regulator. The practical work it asks for is unglamorous: know what you hold, know why, hold less, keep it safe, and be able to answer the person it belongs to.",
    ],
    keyConsiderations: [
      {
        heading: "Personal data is broader than people expect",
        body: "It is information relating to an identifiable person - not only names and identification numbers, but phone numbers, delivery addresses, photographs, device identifiers and records that identify someone when combined. Customer lists, CCTV footage and staff files all sit inside it.",
        instrument: "Nigeria Data Protection Act 2023",
      },
      {
        heading: "You need a reason before you need consent",
        body: "Processing has to rest on a lawful basis. Consent is one basis among several, and it is often the weakest for a business, because it can be withdrawn. Performing a contract, meeting a legal obligation and legitimate interests are the bases most ordinary trading actually runs on.",
        instrument: "Nigeria Data Protection Act 2023",
      },
      {
        heading: "Collect less, and keep it for less time",
        body: "Data minimisation and storage limitation do more for a small business than any policy document. Data you never collected cannot leak, cannot be misused, and does not have to be produced when someone asks what you hold.",
      },
      {
        heading: "Data subjects have rights you must be able to service",
        body: "People can ask what you hold about them, ask for corrections, and object to certain processing. A business that cannot find its own records cannot answer - and being unable to answer is itself the problem.",
        instrument: "Nigeria Data Protection Act 2023",
      },
      {
        heading: "Your processors are still your responsibility",
        body: "Payment providers, cloud hosts, marketing tools and delivery partners process data on your behalf. The relationship should be written down, and the fact that a supplier handles the data does not move the duty off the business that decided to collect it.",
      },
      {
        heading: "Cross-border transfers need thought",
        body: "Most ordinary tooling stores data outside Nigeria. The Act addresses transfers out of the country, and a business should at minimum know where its data physically sits and under what arrangement.",
        instrument: "Nigeria Data Protection Act 2023",
      },
    ],
    commonMistakes: [
      "Publishing a privacy policy that describes a business other than yours.",
      "Collecting a field in case it is useful later, with no purpose for it.",
      "Storing customer records in personal phones, personal email and shared spreadsheets.",
      "Treating consent as a formality - a pre-ticked box, or acceptance bundled into something else.",
      "Having no idea which third-party tools receive customer data.",
      "Keeping every record forever because nobody set a retention period.",
    ],
    redFlags: [
      "Nobody in the business can list where customer data is stored.",
      "A supplier will not say where they host data or who can access it.",
      "Staff share one login to the system holding customer records.",
      "Your marketing list was bought, inherited or scraped, and nobody knows its origin.",
      "A breach has happened before and no record was made of what was affected.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Write down what you actually collect",
        detail: "Every field, every form, every system - a simple inventory beats a policy.",
      },
      {
        id: "c2",
        label: "State the purpose for each item",
        detail: "If you cannot state why you hold a field, stop collecting it.",
      },
      {
        id: "c3",
        label: "Identify your lawful basis",
        detail:
          "Per purpose, not per business. Contract, legal obligation and legitimate interests are usually more durable than consent.",
      },
      {
        id: "c4",
        label: "Set a retention period",
        detail: "Decide how long, write it down, and delete on schedule.",
      },
      {
        id: "c5",
        label: "Publish a privacy notice that is true",
        detail: "It should describe what you do, not what a template says a company does.",
      },
      {
        id: "c6",
        label: "List your processors",
        detail: "Every third party that touches the data, and the written terms you have with them.",
      },
      {
        id: "c7",
        label: "Lock down access",
        detail:
          "Individual accounts, least privilege, no shared logins, and removal when someone leaves.",
      },
      {
        id: "c8",
        label: "Have a breach procedure",
        detail: "Who is told, how it is recorded and how it is assessed - written before an incident.",
      },
      {
        id: "c9",
        label: "Be able to answer a data subject request",
        detail: "Know how you would find everything about one person if you were asked.",
      },
      {
        id: "c10",
        label: "Check your obligations with the Commission",
        detail:
          "Confirm what filing, audit or officer requirements apply to an organisation of your size and activity.",
      },
    ],
    whenToInvolveALawyer: [
      "You process data at scale, or handle sensitive categories such as health or biometric information.",
      "You transfer personal data outside Nigeria as a routine part of the product.",
      "You are building profiling, automated decision-making or targeted advertising.",
      "A breach has occurred, or a regulator or data subject has contacted you.",
      "You are acquiring a customer database as part of a transaction.",
    ],
    related: {
      rights: ["privacy"],
      compliance: ["data-protection"],
      contracts: ["privacy-policy", "nda"],
    },
    meta: businessMeta({ label: "Nigeria Data Protection Act 2023" }),
  },
  {
    id: "bg-3",
    slug: "before-signing-a-supplier-contract",
    title: "Before you sign a supplier contract",
    situation: "A commercial agreement is in front of you",
    summary:
      "Payment terms, liability, termination, dispute resolution and the quiet clauses that decide what happens when a supplier fails to deliver.",
    area: "Contracts",
    checklistCount: 0,
    context: [
      "A supplier contract is not read when it is signed. It is read when delivery is late, quality is wrong, or an invoice is disputed - and at that point the wording is the whole of the argument.",
      "The clauses that matter most are rarely the ones negotiated hardest. Price gets attention; liability, termination and the definition of acceptance usually decide the outcome.",
    ],
    keyConsiderations: [
      {
        heading: "The specification is the contract",
        body: "What is being supplied, to what standard, by when, and how acceptance is judged. A vague specification means every quality dispute becomes a matter of opinion - and opinion favours whoever is holding the money or the goods.",
      },
      {
        heading: "Payment terms cut both ways",
        body: "When payment falls due, what triggers it, whether any part is retained until acceptance, and what happens on late payment. Paying entirely in advance removes the only practical leverage a buyer has.",
      },
      {
        heading: "Limitation of liability is where risk is allocated",
        body: "Caps, exclusions of consequential loss and carve-outs decide what you can actually recover when things go wrong. A cap set at one month's fees, on a contract whose failure would halt your operations, is a commercial decision - not a formality.",
      },
      {
        heading: "Termination should not be one-sided",
        body: "Look at who can end the agreement, on what notice, for what reasons, and what happens to prepayments, data, tooling and goods on exit. An agreement only the supplier can exit cleanly is a lock-in.",
      },
      {
        heading: "Dispute resolution commits you before there is a dispute",
        body: "Whether disputes go to court or to arbitration, where, and under what rules. The Arbitration and Mediation Act 2023 governs arbitration in Nigeria; agreeing to arbitrate in a foreign seat is a real cost decision, not boilerplate.",
        instrument: "Arbitration and Mediation Act 2023",
      },
      {
        heading: "Look for what is missing",
        body: "No confidentiality clause, no data-protection terms where personal data is handled, no intellectual property position on deliverables, no service levels. Absences shape outcomes as much as the wording that is present.",
      },
    ],
    commonMistakes: [
      "Signing the supplier's standard terms without reading past the commercial schedule.",
      "Accepting an agreement subject to standard terms that were never provided.",
      "Letting the purchase order and the contract say different things.",
      "Agreeing to automatic renewal with a notice window nobody diarised.",
      "Ignoring the governing law and forum because a dispute will not happen.",
      "Allowing free subcontracting, with no approval and no responsibility for the subcontractor.",
    ],
    redFlags: [
      "You are pressed to sign today, for a price that expires tonight.",
      "The liability cap is trivial relative to what failure would cost you.",
      "Termination rights, notice periods or remedies run one way only.",
      "Key terms are to be agreed later, or sit in a document you have not seen.",
      "The counterparty's legal identity is unclear, or differs from the name on the invoice.",
      "The agreement covers personal data but says nothing about data protection.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Confirm who you are contracting with",
        detail: "The exact registered entity, checked against the register - not a trading name.",
      },
      {
        id: "c2",
        label: "Read the specification as a stranger would",
        detail: "If it could be delivered badly and still satisfy the words, tighten it.",
      },
      {
        id: "c3",
        label: "Map the payment triggers",
        detail: "What must happen before each payment, and what you retain until acceptance.",
      },
      {
        id: "c4",
        label: "Find the liability cap and the exclusions",
        detail: "Compare the cap against the cost of the failure you actually fear.",
      },
      {
        id: "c5",
        label: "Check both parties' termination rights",
        detail: "Grounds, notice and consequences - including refunds and return of assets.",
      },
      {
        id: "c6",
        label: "Check renewal and notice windows",
        detail: "Diarise any notice deadline the day you sign.",
      },
      {
        id: "c7",
        label: "Confirm the IP position on deliverables",
        detail: "Who owns what is produced, and what licence you get if you do not own it.",
      },
      {
        id: "c8",
        label: "Add data-protection terms where personal data is involved",
        detail: "Purpose, security, subcontracting and deletion on exit.",
      },
      {
        id: "c9",
        label: "Read the dispute clause and cost it",
        detail: "Court or arbitration, where, and what enforcement would actually involve.",
      },
      {
        id: "c10",
        label: "Check the entire-agreement clause",
        detail: "Any promise made in the pitch that matters to you should be in the document.",
      },
      {
        id: "c11",
        label: "Confirm insurance and indemnities",
        detail: "What the supplier carries, and what they indemnify you for.",
      },
      {
        id: "c12",
        label: "Check subcontracting and assignment",
        detail: "Whether they can hand the work on, and whether they remain responsible.",
      },
      {
        id: "c13",
        label: "Ensure signature authority on both sides",
        detail: "The signatory should have authority to bind the entity.",
      },
      {
        id: "c14",
        label: "Keep a countersigned copy with every annex",
        detail: "Including each schedule the contract incorporates by reference.",
      },
    ],
    whenToInvolveALawyer: [
      "The contract value, or your dependency on it, is material to the business.",
      "You are asked to accept unlimited liability, or an indemnity you cannot scope.",
      "Foreign governing law, a foreign seat of arbitration, or cross-border delivery is involved.",
      "The agreement touches personal data, intellectual property or exclusivity.",
      "You are being asked to sign a guarantee, or to secure the obligation against assets.",
    ],
    related: {
      safety: ["before-you-sign"],
      compliance: ["contracts", "dispute-prevention"],
      contracts: ["supplier-agreement", "service-agreement"],
    },
    meta: businessMeta({ label: "Arbitration and Mediation Act 2023" }),
  },
  {
    id: "bg-4",
    slug: "before-entering-a-partnership",
    title: "Before you enter a business partnership",
    situation: "You are going into business with someone",
    summary:
      "Ownership, decision rights, money in and money out, and what happens if one of you wants to leave. CAMA 2020 shapes the structures available to you.",
    area: "Corporate Governance",
    checklistCount: 0,
    context: [
      "Business partnerships rarely fail over the thing the parties negotiated. They fail over what nobody wanted to raise while everyone was optimistic: what happens if one founder stops working, wants out, dies, or wants to sell to someone the others cannot work with.",
      "CAMA 2020 provides the structures - companies, limited liability partnerships, limited partnerships and business names - and each carries a different answer on liability, ownership and exit.",
    ],
    keyConsiderations: [
      {
        heading: "The structure decides who is exposed",
        body: "A registered business name does not create a separate legal person; the individuals carry the liability. A company or a limited liability partnership does, and that separation is the main reason to incorporate rather than trade jointly under a name.",
        instrument: "Companies and Allied Matters Act 2020",
      },
      {
        heading: "Equity is not the same as control",
        body: "Shareholding, board composition and reserved matters are three separate questions. Equal shares with no deadlock mechanism is one of the most common ways for a working business to become unmanageable.",
      },
      {
        heading: "Contribution should be defined and vested",
        body: "Money, time, assets, customers and intellectual property are all contributions, and they are rarely made at the same pace. Vesting over time protects the partner who stays from the partner who leaves in month four holding a founding stake.",
      },
      {
        heading: "Put the intellectual property in the business",
        body: "Where founders build before incorporating, the intellectual property often sits personally. It should be assigned to the entity expressly and in writing, along with anything contractors produced.",
        instrument: "Copyright Act 2022",
      },
      {
        heading: "Agree the exit before you need it",
        body: "Transfer restrictions, pre-emption, buy-out mechanics, valuation method, and what happens on death, incapacity or a partner competing. A valuation formula agreed in advance is worth more than a fair one argued later.",
      },
      {
        heading: "Money out needs its own rules",
        body: "Salaries, drawings, dividends, expense policy and reinvestment. Most founder conflict about money is about the absence of a rule, not about the amount.",
      },
    ],
    commonMistakes: [
      "Operating for a year on a handshake, and formalising once there is revenue.",
      "Splitting equity equally with no mechanism to break a deadlock.",
      "Granting founding equity with no vesting and no leaver provisions.",
      "Leaving the product, brand or code owned personally by one founder.",
      "Registering a business name and assuming it limits personal liability.",
      "Never writing down who decides what, then discovering the answer during a crisis.",
    ],
    redFlags: [
      "A partner will not put agreed terms in writing.",
      "You cannot get a straight answer about existing debts, obligations or other ventures.",
      "One partner controls the bank mandate, the entity records and the customer relationships.",
      "You are asked to guarantee business borrowing personally, early, and without discussion.",
      "The proposed structure was chosen because it is fastest to register, not because it fits.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Choose the structure deliberately",
        detail: "Compare liability, ownership, tax treatment and exit before registering anything.",
      },
      {
        id: "c2",
        label: "Do basic diligence on your partner",
        detail: "Identity, existing directorships, other commitments and any known disputes.",
      },
      {
        id: "c3",
        label: "Write down each contribution",
        detail: "Cash, assets, time, IP and relationships - with values where possible.",
      },
      {
        id: "c4",
        label: "Separate equity from control",
        detail: "Set out board seats, voting, and the decisions that need everyone's agreement.",
      },
      {
        id: "c5",
        label: "Add a deadlock mechanism",
        detail: "Decide now how an unresolvable disagreement gets broken.",
      },
      {
        id: "c6",
        label: "Vest founder equity",
        detail: "Over time, with a cliff, and with defined good and bad leaver treatment.",
      },
      {
        id: "c7",
        label: "Assign all IP to the entity",
        detail: "In writing, covering founders, employees and past contractors.",
      },
      {
        id: "c8",
        label: "Agree the money rules",
        detail: "Salaries, drawings, expenses, reinvestment and dividend policy.",
      },
      {
        id: "c9",
        label: "Agree transfer restrictions and valuation",
        detail: "Pre-emption rights, and an agreed method for pricing a departing stake.",
      },
      {
        id: "c10",
        label: "Cover death, incapacity and competition",
        detail: "What happens to the stake, and what a leaver may and may not do next.",
      },
      {
        id: "c11",
        label: "Set up governance you will actually follow",
        detail: "Meetings, records, bank mandate, and who signs what.",
      },
    ],
    whenToInvolveALawyer: [
      "You are choosing between a company, an LLP and a business name for a venture with real assets.",
      "External investment, convertible instruments or an option pool is contemplated.",
      "IP was created before the entity existed, or by contractors.",
      "You are drafting shareholder or partnership agreements, or leaver provisions.",
      "A partner is exiting, or a relationship has already broken down.",
    ],
    related: {
      compliance: ["corporate-governance", "business-structure-and-registration"],
      contracts: ["partnership-agreement", "shareholder-agreement"],
      briefings: ["governance-essentials"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "bg-5",
    slug: "before-borrowing-money",
    title: "Before your business borrows money",
    situation: "A facility, an investor advance or a supplier credit line is on the table",
    summary:
      "What is actually secured, who is personally on the hook, what the covenants require of you, and what the lender can do on default.",
    area: "Debt & Recovery",
    checklistCount: 0,
    context: [
      "Borrowing decisions are usually made on the headline rate. The terms that matter when trading gets difficult are the security, the personal guarantee, the covenants and the events of default.",
      "A personal guarantee converts a company debt into a personal one. It is the single term most often signed quickly and regretted slowly.",
    ],
    keyConsiderations: [
      {
        heading: "Know the true cost, not the headline rate",
        body: "Interest basis, fees, insurance requirements, default interest and any early-repayment charge together make up the cost. Ask for the total amount repayable under the schedule as offered.",
      },
      {
        heading: "Security is what the lender takes if you fail",
        body: "A charge over assets, a debenture over the business, or a mortgage over property each has different consequences. Know exactly what is being given, and what remains free for other financing.",
        instrument: "Companies and Allied Matters Act 2020",
      },
      {
        heading: "A personal guarantee is personal",
        body: "It survives the company. Check whether it is capped, whether it is joint and several with co-founders, whether it covers future facilities, and what has to happen before the lender can call on it.",
      },
      {
        heading: "Covenants restrict how you run the business",
        body: "Reporting, financial ratios, restrictions on further borrowing, on distributions and on disposals. A covenant breach can be an event of default even when every payment has been made on time.",
      },
      {
        heading: "Events of default can be broad",
        body: "Cross-default, material adverse change and breach of any obligation are common. Understand what gives the lender the right to accelerate and enforce.",
      },
      {
        heading: "Registration of charges matters",
        body: "Security over company assets is generally required to be registered, and registration affects priority between creditors. This is a point of substance, not administration.",
        instrument: "Companies and Allied Matters Act 2020",
      },
    ],
    commonMistakes: [
      "Comparing offers on the interest rate alone.",
      "Signing a personal guarantee with no cap and no release trigger.",
      "Giving security over an asset the business needs in order to keep trading.",
      "Missing that the facility is repayable on demand.",
      "Ignoring reporting covenants until the first breach notice arrives.",
      "Borrowing to cover a structural loss rather than a timing gap.",
    ],
    redFlags: [
      "The lender will not provide the full terms in writing before you commit.",
      "You are asked to sign blank or incomplete documents.",
      "Security is demanded over personal or family property for a modest facility.",
      "Fees are payable upfront, before any facility is confirmed.",
      "The lender's identity, registration or licensing status cannot be verified.",
      "The repayment schedule assumes a revenue level the business has never reached.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Get every term in writing",
        detail: "Offer letter, facility agreement, security documents and all schedules.",
      },
      {
        id: "c2",
        label: "Calculate the total repayable",
        detail: "Interest, fees, insurance and charges - as a single number.",
      },
      {
        id: "c3",
        label: "List exactly what is being secured",
        detail: "Each asset, and what it would mean to lose it.",
      },
      {
        id: "c4",
        label: "Read every guarantee before signing",
        detail: "Cap, duration, joint liability, and how it is released.",
      },
      {
        id: "c5",
        label: "Map the covenants to your reporting",
        detail: "Confirm you can actually produce what is required, when it is required.",
      },
      {
        id: "c6",
        label: "Find the events of default",
        detail: "Including cross-default and material adverse change.",
      },
      {
        id: "c7",
        label: "Check demand and acceleration rights",
        detail: "Whether the facility can be pulled without any payment failure.",
      },
      {
        id: "c8",
        label: "Confirm charge registration",
        detail: "Ensure security is registered as required, and know the priority position.",
      },
      {
        id: "c9",
        label: "Stress-test the schedule",
        detail: "Model repayment against a bad quarter, not against the plan.",
      },
      {
        id: "c10",
        label: "Verify the lender",
        detail: "Confirm registration and, where relevant, licensing before paying anything.",
      },
    ],
    whenToInvolveALawyer: [
      "A personal guarantee, or security over personal property, is requested.",
      "The facility is secured by a debenture or floating charge over the business.",
      "Covenants restrict how you run, distribute from, or dispose of the business.",
      "The facility is convertible into equity.",
      "You are already in default, or a demand has been made.",
    ],
    related: {
      safety: ["borrowing"],
      compliance: ["record-keeping", "corporate-governance"],
    },
    meta: businessMeta({ label: "Companies and Allied Matters Act 2020" }),
  },
  {
    id: "bg-6",
    slug: "before-terminating-an-employee",
    title: "Before you terminate an employee",
    situation: "You have decided an employment relationship has to end",
    summary:
      "Grounds, process, notice, final entitlements and records - the four things that decide whether a termination is defensible or becomes a claim.",
    area: "Employment & HR",
    checklistCount: 0,
    context: [
      "Terminations are rarely challenged on whether the employer was entitled to act. They are challenged on how the employer acted: what process was followed, what was documented, and what was paid on exit.",
      "The National Industrial Court has developed a body of employment jurisprudence in Nigeria that takes fairness of process seriously. A decision that is substantively reasonable but procedurally careless is the common failure mode.",
    ],
    keyConsiderations: [
      {
        heading: "Identify the real ground",
        body: "Performance, misconduct, redundancy and the end of a fixed term are different routes with different requirements. Choosing the label that is administratively easiest, rather than the one that fits, is where most exposure begins.",
      },
      {
        heading: "Follow the contract and your own procedure",
        body: "Whatever your disciplinary procedure says will be measured against what you actually did. Skipping your own written steps is difficult to defend, because you wrote them.",
      },
      {
        heading: "Notice and final pay are contractual duties",
        body: "Notice, or payment in lieu where the contract allows it, accrued but untaken leave, and any outstanding statutory deductions all fall due. Withholding final pay as leverage in a dispute creates a second problem.",
        instrument: "Labour Act, Cap L1 LFN 2004",
      },
      {
        heading: "Redundancy is a distinct process",
        body: "Where a role genuinely ceases, the questions are selection, consultation and treatment on exit - not conduct. Dressing a performance dismissal as redundancy tends to unravel in evidence.",
      },
      {
        heading: "Document as it happens",
        body: "Notes made at the time carry weight; reconstructions made after a claim do not. Warnings, meetings, responses and the decision itself should be recorded contemporaneously.",
      },
      {
        heading: "Handle the exit practically",
        body: "Access revocation, return of property, handover, confidentiality reminders and what will be said in a reference. These reduce the second-order risks - data, IP and reputation.",
      },
    ],
    commonMistakes: [
      "Dismissing in the moment, then constructing the file afterwards.",
      "Never having raised the performance issue the dismissal relies on.",
      "Announcing the outcome before the employee has responded to the allegation.",
      "Withholding final salary or leave pay to force a settlement.",
      "Using redundancy language for what is a conduct or capability dismissal.",
      "Leaving system access live for weeks after the exit.",
    ],
    redFlags: [
      "The reason you would put in writing differs from the real reason.",
      "The employee recently raised a grievance, a safety concern or a statutory entitlement.",
      "Your file contains no warnings, notes or reviews.",
      "The decision-maker is the person the complaint was about.",
      "You are relying on a contract term nobody can produce a signed copy of.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Name the ground accurately",
        detail: "Performance, misconduct, redundancy or expiry - and be able to evidence it.",
      },
      {
        id: "c2",
        label: "Pull the contract and the procedure",
        detail: "Confirm notice, process and any contractual entitlements.",
      },
      {
        id: "c3",
        label: "Review the file before deciding",
        detail: "Warnings, reviews, prior grievances and any protected complaints.",
      },
      {
        id: "c4",
        label: "Put the concern to the employee",
        detail: "In writing, with the evidence, and with a real chance to respond.",
      },
      {
        id: "c5",
        label: "Hold a meeting and record it",
        detail: "Allow the employee to be accompanied where your procedure provides for it.",
      },
      {
        id: "c6",
        label: "Have an uninvolved person decide where possible",
        detail: "Separating investigation from decision strengthens the outcome.",
      },
      {
        id: "c7",
        label: "Give the decision in writing",
        detail: "Reason, effective date, notice treatment and any appeal right.",
      },
      {
        id: "c8",
        label: "Calculate final entitlements",
        detail: "Notice, accrued leave, outstanding pay and statutory deductions.",
      },
      {
        id: "c9",
        label: "Complete the exit steps",
        detail: "Access, property, handover, and confirmation of continuing obligations.",
      },
      {
        id: "c10",
        label: "Retain the file",
        detail: "Keep the complete record for your retention period - it is the defence.",
      },
    ],
    whenToInvolveALawyer: [
      "The employee has raised a grievance, a discrimination allegation or a whistleblowing concern.",
      "You are contemplating summary dismissal for gross misconduct.",
      "A redundancy affects several roles, or a whole function.",
      "You want to agree a settlement or a mutual separation.",
      "A claim has been threatened, or proceedings have started.",
    ],
    related: {
      rights: ["at-work"],
      compliance: ["employment-and-payroll"],
      contracts: ["employment-agreement"],
      guides: ["before-hiring-an-employee"],
    },
    meta: businessMeta({ label: "Labour Act, Cap L1 LFN 2004" }),
  },
  {
    id: "bg-7",
    slug: "before-launching-an-online-business",
    title: "Before you launch an online business",
    situation: "You are about to start selling to the public over the internet",
    summary:
      "Entity and terms, consumer duties, payments, personal data and the online-conduct rules that apply the moment you trade at a distance.",
    area: "Consumer Protection",
    checklistCount: 0,
    context: [
      "Selling online collapses several bodies of law into one launch: how you are constituted, what you promise, how you take money, what you do with data, and how you behave on a network.",
      "None of it is exotic. What catches new online businesses is that all of it applies at once, from the first order.",
    ],
    keyConsiderations: [
      {
        heading: "Trade through a registered entity",
        body: "Trading personally exposes personal assets, complicates payment processing and makes it harder to contract. Registration under CAMA 2020 is the baseline step.",
        instrument: "Companies and Allied Matters Act 2020",
      },
      {
        heading: "Your terms are the contract with every customer",
        body: "Website terms, delivery terms, returns and refunds, and any subscription mechanics form the agreement. They should describe how your business actually operates, and be presented before purchase rather than buried after it.",
      },
      {
        heading: "Consumer protection governs how you describe and sell",
        body: "The Federal Competition and Consumer Protection Act 2018 addresses misleading representations, unfair terms and the treatment of consumers, and the FCCPC is the regulator. Marketing claims, pricing displays and complaint handling all sit within it.",
        instrument: "Federal Competition and Consumer Protection Act 2018",
      },
      {
        heading: "You become a data controller on the first order",
        body: "Names, addresses, phone numbers and payment identifiers are personal data. A privacy notice, a lawful basis, a retention period and control over your tooling are needed from launch, not after growth.",
        instrument: "Nigeria Data Protection Act 2023",
      },
      {
        heading: "Payments bring their own obligations",
        body: "Use licensed payment providers, understand their terms on chargebacks and settlement holds, and never store card data yourself. Your provider's rules will shape refunds and disputes.",
      },
      {
        heading: "Online conduct is regulated",
        body: "The Cybercrimes Act 2015 addresses unauthorised access, interception and misuse of computer systems, and applies both to how you protect your systems and to how your business behaves online.",
        instrument: "Cybercrimes (Prohibition, Prevention, etc.) Act 2015",
      },
      {
        heading: "Do not build on someone else's rights",
        body: "Brand name, product photography, site copy, fonts and code all carry ownership. Clear the brand before you print it, and license what you did not create.",
        instrument: "Trade Marks Act · Copyright Act 2022",
      },
    ],
    commonMistakes: [
      "Copying terms and a privacy policy from another site.",
      "Advertising a delivery time or guarantee the operation cannot meet.",
      "Displaying prices that exclude charges the customer cannot avoid.",
      "Choosing a brand name with no availability check.",
      "Storing customer data in personal accounts and spreadsheets.",
      "Having no written refund position, and improvising per complaint.",
      "Ignoring an unresolved customer complaint until it becomes a public one.",
    ],
    redFlags: [
      "Your payment provider is unlicensed, or cannot be verified.",
      "A supplier offers branded goods with no evidence of authorisation.",
      "Your marketing depends on claims nobody can substantiate.",
      "Your site collects data fields nobody in the business can account for.",
      "You have no way to trace or evidence an individual order.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Register the entity",
        detail: "Trade through a registered business rather than personally.",
      },
      {
        id: "c2",
        label: "Check and secure the brand",
        detail: "Availability check before launch, and registration where the name matters.",
      },
      {
        id: "c3",
        label: "Write terms that match operations",
        detail: "Delivery, returns, refunds, cancellation and subscriptions as you truly run them.",
      },
      {
        id: "c4",
        label: "Present terms before purchase",
        detail: "Visible, accessible and acknowledged at checkout.",
      },
      {
        id: "c5",
        label: "Audit your marketing claims",
        detail: "Every claim should be substantiable before it is published.",
      },
      {
        id: "c6",
        label: "Show prices honestly",
        detail: "Make unavoidable charges clear before the customer commits.",
      },
      {
        id: "c7",
        label: "Publish a truthful privacy notice",
        detail: "Describe your actual collection, purposes, tools and retention.",
      },
      {
        id: "c8",
        label: "Use licensed payment providers",
        detail: "Read their terms on chargebacks, holds and refunds.",
      },
      {
        id: "c9",
        label: "Secure the platform",
        detail: "Individual accounts, multi-factor authentication, patched systems and backups.",
      },
      {
        id: "c10",
        label: "License your content",
        detail: "Images, fonts, copy and code - owned outright or properly licensed.",
      },
      {
        id: "c11",
        label: "Set up complaint handling",
        detail: "A route in, a record, and a response standard you can actually meet.",
      },
      {
        id: "c12",
        label: "Check sector rules before selling",
        detail: "Some goods and services carry approval or licensing requirements.",
      },
    ],
    whenToInvolveALawyer: [
      "You are selling regulated goods - food, health products, or financial or medical services.",
      "You are building a marketplace, or holding money on behalf of others.",
      "You are trading across borders, or shipping internationally as standard.",
      "A regulator, a rights holder or a group of consumers has contacted you.",
      "You are raising investment on the strength of the platform.",
    ],
    related: {
      compliance: ["consumer-protection", "data-protection"],
      contracts: ["terms-and-conditions", "privacy-policy"],
      industries: ["technology", "retail"],
    },
    meta: businessMeta({
      label: "Federal Competition and Consumer Protection Act 2018",
    }),
  },
  {
    id: "bg-8",
    slug: "before-using-another-brand-or-content",
    title: "Before you use another person's brand or content",
    situation:
      "You want to use a name, logo, image, track, font or piece of writing you did not create",
    summary:
      "Who owns it, what permission you actually need, what a licence really allows, and why attribution is not a substitute for a right.",
    area: "Intellectual Property",
    checklistCount: 0,
    context: [
      "Most intellectual property problems in small businesses are not deliberate. They come from a genuine belief that crediting the source, or paying nothing, or using only a little, makes the use lawful.",
      "The Copyright Act 2022 governs copyright in Nigeria, and trade mark rights are governed by the Trade Marks Act. Both operate on permission, not on attribution.",
    ],
    keyConsiderations: [
      {
        heading: "Attribution is not permission",
        body: "Naming the creator does not create a licence. Use requires a right - ownership, a licence, or a legally recognised exception - and credit is a separate question from that.",
        instrument: "Copyright Act 2022",
      },
      {
        heading: "Brand use is about confusion",
        body: "Trade mark concerns arise where use suggests a connection, endorsement or origin that does not exist. Using a competitor's mark to describe your own offering is where risk concentrates.",
        instrument: "Trade Marks Act",
      },
      {
        heading: "Read the licence you actually have",
        body: "Stock, font and music licences are scoped: commercial or not, digital or print, modified or unmodified, and for how long. Exceeding the scope is a breach even though you paid.",
      },
      {
        heading: "Freelancers may own what you commissioned",
        body: "Absent a written assignment, the creator may retain rights in commissioned work. Logos, photography, code and copy should be assigned to the business in writing.",
        instrument: "Copyright Act 2022",
      },
      {
        heading: "Found online means nothing about rights",
        body: "Public availability is not permission. Search results, social platforms and image sites carry work under many different terms, and often none that permit commercial use.",
      },
      {
        heading: "Clear the brand before you build on it",
        body: "A name that turns out to be unusable is far more expensive after signage, packaging and a customer base than before.",
      },
    ],
    commonMistakes: [
      "Assuming credit, a link, or the absence of monetisation makes use lawful.",
      "Using a personal or free-tier licence for commercial work.",
      "Taking a logo, photo or track from a search engine.",
      "Commissioning a logo with no written assignment of rights.",
      "Using a well-known brand's name or look to signal compatibility.",
      "Building a brand identity with no availability check.",
    ],
    redFlags: [
      "You cannot identify where an asset in your materials came from.",
      "A supplier cannot evidence the rights they claim to be granting.",
      "Your designer will not confirm assets are licensed for commercial use.",
      "Your brand is deliberately close to an established one.",
      "You have received a complaint and your instinct is to continue quietly.",
    ],
    checklist: [
      {
        id: "c1",
        label: "Inventory every third-party asset",
        detail: "Images, fonts, music, code and copy - and where each came from.",
      },
      {
        id: "c2",
        label: "Find the licence for each",
        detail: "Keep the licence terms and proof of purchase alongside the asset.",
      },
      {
        id: "c3",
        label: "Check the scope against your use",
        detail: "Commercial use, media, territory, duration and modification rights.",
      },
      {
        id: "c4",
        label: "Get written assignments from creators",
        detail: "Every freelancer and contractor who produced anything for the business.",
      },
      {
        id: "c5",
        label: "Run a brand availability check",
        detail: "Before printing, packaging, signage or launch.",
      },
      {
        id: "c6",
        label: "Register what matters",
        detail: "Protect the marks the business genuinely trades under.",
      },
      {
        id: "c7",
        label: "Set an internal rule for staff",
        detail: "A simple approval step for any externally sourced asset.",
      },
      {
        id: "c8",
        label: "Replace anything you cannot evidence",
        detail: "An unverifiable asset is cheaper to replace than to defend.",
      },
    ],
    whenToInvolveALawyer: [
      "You have received a cease-and-desist letter or an infringement claim.",
      "You want to register or oppose a trade mark.",
      "You are licensing your own IP to others, or taking an exclusive licence.",
      "IP is a material asset in a sale, an investment or a partnership.",
      "You are building on open-source components with obligations you are unsure of.",
    ],
    related: {
      compliance: ["intellectual-property"],
      contracts: ["nda", "consultancy-agreement"],
      industries: ["media", "technology"],
    },
    meta: businessMeta({ label: "Copyright Act 2022" }),
  },
];

/**
 * Card-level view of the guides.
 *
 * `checklistCount` is derived from the checklist itself, so a card can never
 * promise a different number of steps than the page delivers.
 */
export const businessGuides: BusinessGuide[] = businessGuideDetails.map(
  (guide) => ({
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    situation: guide.situation,
    summary: guide.summary,
    area: guide.area,
    checklistCount: guide.checklist.length,
    meta: guide.meta,
  })
);
