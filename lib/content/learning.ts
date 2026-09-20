import type { ChecklistItem, QuizQuestion } from "./types";

/**
 * Quiz questions and checklist lines.
 *
 * EDITORIAL RULE, as everywhere in the seed: every legal reference points at a
 * real, well-known Nigerian instrument and is described only in general terms.
 * No judgment, citation, credential or regulatory deadline is invented here.
 *
 * Keyed by the slug of the `Quiz` / `Checklist` record in ./data, and kept in a
 * separate module because the bodies are long. The declared `questionCount` and
 * `itemCount` on those records are asserted against these lists in the
 * repository, so a count can never drift away from the content behind it.
 */

export const quizQuestions: Record<string, QuizQuestion[]> = {
  "know-your-rights": [
    {
      id: "kyr-1",
      prompt:
        "Which part of the 1999 Constitution contains the fundamental rights a person can enforce in court?",
      options: ["Chapter II", "Chapter IV", "Chapter VII", "The Preamble"],
      answer: 1,
      explanation:
        "Chapter IV holds the fundamental rights, and they are enforceable — a person alleging a breach can approach the High Court for redress. Chapter II sets out fundamental objectives and directive principles, which are framed differently.",
    },
    {
      id: "kyr-2",
      prompt: "On arrest, what must a person be told?",
      options: [
        "Nothing until they reach the station",
        "The reason for the arrest, in a language they understand",
        "Only the name of the arresting officer",
        "The likely sentence",
      ],
      answer: 1,
      explanation:
        "The Constitution requires that a person who is arrested or detained be informed in writing, within a stated period and in a language they understand, of the facts and grounds for the arrest.",
    },
    {
      id: "kyr-3",
      prompt: "Which of these is protected as a right in Chapter IV?",
      options: [
        "A guaranteed job",
        "Free university education",
        "Freedom from discrimination on grounds such as sex, religion or ethnic group",
        "A minimum wage set by the Constitution",
      ],
      answer: 2,
      explanation:
        "Freedom from discrimination is a Chapter IV right. Employment and education aspirations appear in Chapter II as objectives and directive principles rather than as enforceable individual rights.",
    },
    {
      id: "kyr-4",
      prompt: "What does the presumption of innocence mean in practice?",
      options: [
        "The accused must prove they did not do it",
        "The prosecution must prove the charge; the accused is treated as innocent until then",
        "Nobody may be arrested until a trial ends",
        "A confession ends the matter",
      ],
      answer: 1,
      explanation:
        "The burden sits on the prosecution. The presumption is part of the right to a fair hearing, alongside being informed of the charge and having adequate time and facilities to prepare a defence.",
    },
    {
      id: "kyr-5",
      prompt:
        "A person is stopped and asked to unlock their phone at a roadside check. What is the accurate general position?",
      options: [
        "Privacy of correspondence is constitutionally protected, and a demand to search must have a lawful basis",
        "Anyone in uniform may search a phone at any time",
        "Phones are never protected",
        "Only lawyers may refuse",
      ],
      answer: 0,
      explanation:
        "The Constitution protects the privacy of citizens, their homes, correspondence and communications. That protection is not absolute, but a search needs a lawful basis rather than a mere request.",
    },
    {
      id: "kyr-6",
      prompt: "Which right covers peaceful protest?",
      options: [
        "Freedom of movement only",
        "Peaceful assembly and association",
        "Right to personal liberty only",
        "None — protest is outside the Constitution",
      ],
      answer: 1,
      explanation:
        "Peaceful assembly and association is a Chapter IV right, and it works alongside freedom of expression. Like other rights it is subject to laws reasonably justifiable in a democratic society.",
    },
    {
      id: "kyr-7",
      prompt: "What is the right to a fair hearing mainly concerned with?",
      options: [
        "Guaranteeing a favourable outcome",
        "A hearing within a reasonable time by an independent and impartial court or tribunal",
        "Free legal representation in every case",
        "Preventing appeals",
      ],
      answer: 1,
      explanation:
        "Fair hearing is about the process: a hearing within a reasonable time, before a body constituted so as to secure its independence and impartiality, with the chance to be heard.",
    },
    {
      id: "kyr-8",
      prompt: "Can a Chapter IV right ever be restricted?",
      options: [
        "Never, under any circumstances",
        "Yes, by any policy an agency adopts",
        "Yes, by a law reasonably justifiable in a democratic society for defined purposes such as public safety or the rights of others",
        "Only during an election",
      ],
      answer: 2,
      explanation:
        "The Constitution itself allows qualifications. Whether a particular restriction meets that standard is decided by a court on the facts, which is where most real arguments happen.",
    },
    {
      id: "kyr-9",
      prompt: "Which court does a person approach to enforce a fundamental right?",
      options: [
        "The High Court with jurisdiction in the state where the breach occurred",
        "Only the Supreme Court",
        "Any police station",
        "The National Assembly",
      ],
      answer: 0,
      explanation:
        "Enforcement begins at the High Court. Appeals follow the ordinary hierarchy from there; the Supreme Court is not a court of first instance for these claims.",
    },
    {
      id: "kyr-10",
      prompt: "What does the right to dignity of the human person prohibit?",
      options: [
        "Only physical assault by private individuals",
        "Torture, inhuman or degrading treatment, slavery and forced labour",
        "Criticism of public officials",
        "Detention of any kind",
      ],
      answer: 1,
      explanation:
        "The right to dignity is expressed in those terms. It is one of the rights most often raised in complaints about treatment in custody.",
    },
  ],
  "contract-basics": [
    {
      id: "cb-1",
      prompt: "Which elements are generally required to form a binding contract?",
      options: [
        "Offer, acceptance, consideration and an intention to create legal relations",
        "A written document and a stamp",
        "A lawyer on each side",
        "Registration with a government agency",
      ],
      answer: 0,
      explanation:
        "Those are the classic elements, along with capacity and legality of purpose. Writing is required for certain kinds of transaction, but it is not the general test of whether a contract exists.",
    },
    {
      id: "cb-2",
      prompt: "Is an oral agreement ever binding?",
      options: [
        "No, never",
        "Yes — many oral agreements are binding, though some transactions must be in writing and all are harder to prove",
        "Only between family members",
        "Only under ₦100,000",
      ],
      answer: 1,
      explanation:
        "The practical problem with an oral agreement is evidence, not validity. Certain dealings — land being the common example — attract formality requirements.",
    },
    {
      id: "cb-3",
      prompt: "What is consideration?",
      options: [
        "Politeness during negotiation",
        "Something of value each side gives or promises in exchange",
        "The time taken to think before signing",
        "A deposit held by a lawyer",
      ],
      answer: 1,
      explanation:
        "Each side must give something — money, goods, services, or a promise to do or not do something. A bare promise to make a gift is generally not enforceable as a contract.",
    },
    {
      id: "cb-4",
      prompt: "A signature appears above wording nobody read. What is the general position?",
      options: [
        "Unread terms never bind",
        "A person is generally bound by a document they signed, which is why reading before signing matters so much",
        "Only the first page binds",
        "Terms bind only if read aloud",
      ],
      answer: 1,
      explanation:
        "Signing is treated as assent to the document. There are exceptions in narrow circumstances, but none of them is a substitute for reading the document first.",
    },
    {
      id: "cb-5",
      prompt: "What does an entire agreement clause typically do?",
      options: [
        "Makes the contract last forever",
        "Confines the agreement to what is written in the document, excluding earlier assurances",
        "Entitles either side to cancel at will",
        "Transfers ownership of everything",
      ],
      answer: 1,
      explanation:
        "It is why promises made in negotiation should be written into the contract. If the assurance that persuaded you is not in the document, an entire agreement clause is designed to keep it out.",
    },
    {
      id: "cb-6",
      prompt: "What is an indemnity clause?",
      options: [
        "A promise to reimburse the other side for defined losses",
        "A limit on working hours",
        "A confidentiality promise",
        "A clause fixing the price",
      ],
      answer: 0,
      explanation:
        "An indemnity shifts a defined risk to the party giving it. Read what triggers it and whether it is capped — an uncapped indemnity can exceed the value of the whole contract.",
    },
    {
      id: "cb-7",
      prompt: "What does a liquidated damages clause do?",
      options: [
        "Converts the contract to cash",
        "Fixes in advance the sum payable if a defined breach happens",
        "Waives all damages",
        "Requires payment in foreign currency",
      ],
      answer: 1,
      explanation:
        "It is meant to be a genuine pre-estimate of loss rather than a penalty. Both sides gain certainty about the consequence of that particular breach.",
    },
    {
      id: "cb-8",
      prompt: "What is a force majeure clause for?",
      options: [
        "Allowing either side to change price at will",
        "Addressing what happens when defined events beyond a party's control prevent performance",
        "Ending confidentiality",
        "Choosing a court",
      ],
      answer: 1,
      explanation:
        "It works only for the events the clause actually lists, and only on the consequences it sets out — suspension, extension or termination. A generic assumption that 'something unexpected' excuses performance is not the law.",
    },
    {
      id: "cb-9",
      prompt: "Why does a governing law and dispute resolution clause matter?",
      options: [
        "It decides which law applies and where a dispute is resolved, including whether by arbitration",
        "It sets the price",
        "It is decorative",
        "It waives the right to sue entirely",
      ],
      answer: 0,
      explanation:
        "It decides the forum and the rules. A clause sending a dispute to arbitration in a distant seat can make enforcement of a modest claim uneconomic — worth noticing before signing.",
    },
    {
      id: "cb-10",
      prompt: "A supplier's standard terms conflict with the buyer's purchase order. What is the practical lesson?",
      options: [
        "The longer document wins",
        "Which set of terms applies depends on what was exchanged and accepted — so agree one set expressly",
        "Neither applies",
        "The buyer always wins",
      ],
      answer: 1,
      explanation:
        "Battle-of-forms disputes turn on the sequence of communications. The cheap fix is to state, in one document both sides sign, which terms govern.",
    },
    {
      id: "cb-11",
      prompt: "What is the effect of a clause requiring variations to be in writing and signed?",
      options: [
        "It prevents any change ever",
        "It makes informal changes — a call, a chat message — unreliable as amendments",
        "It voids the contract",
        "It applies only to price",
      ],
      answer: 1,
      explanation:
        "Parties routinely vary contracts informally and then argue about it. If the contract requires signed written variations, get the variation signed.",
    },
    {
      id: "cb-12",
      prompt: "A consumer contract contains a term that is unfair to the consumer. What is the general position in Nigeria?",
      options: [
        "Consumer protection law addresses unfair terms and practices, and a term is not automatically valid merely because it was signed",
        "Signed terms are always valid",
        "The consumer must sue abroad",
        "Only banks are regulated",
      ],
      answer: 0,
      explanation:
        "The Federal Competition and Consumer Protection Act 2018 addresses unfair, unreasonable or unjust terms in consumer transactions and establishes a regulator to enforce that regime.",
    },
  ],
  "business-law": [
    {
      id: "bl-1",
      prompt: "Which statute is the principal law governing company formation and administration in Nigeria?",
      options: [
        "The Companies and Allied Matters Act 2020",
        "The Labour Act",
        "The Land Use Act 1978",
        "The Cybercrimes Act 2015",
      ],
      answer: 0,
      explanation:
        "CAMA 2020 is the principal statute, administered by the Corporate Affairs Commission. It replaced the earlier CAMA regime and introduced a number of structural changes.",
    },
    {
      id: "bl-2",
      prompt: "What did CAMA 2020 introduce for smaller businesses in terms of company membership?",
      options: [
        "A minimum of five members",
        "The possibility of a single-member private company",
        "Compulsory foreign ownership",
        "A ban on private companies",
      ],
      answer: 1,
      explanation:
        "A private company may be formed with one member, which removed the practice of adding a nominal second shareholder purely to satisfy a numerical requirement.",
    },
    {
      id: "bl-3",
      prompt: "What is the practical meaning of separate legal personality?",
      options: [
        "The company and its owners are the same person in law",
        "The company is a legal person distinct from its shareholders, with its own assets and liabilities",
        "Directors cannot be sued for anything",
        "The company cannot own property",
      ],
      answer: 1,
      explanation:
        "It is the foundation of limited liability. It also means company money is not the director's money — a distinction small businesses most often blur, and later regret.",
    },
    {
      id: "bl-4",
      prompt: "Business name registration and company incorporation are:",
      options: [
        "The same thing",
        "Different — a registered business name does not create a separate legal entity in the way incorporation does",
        "Both optional in all cases",
        "Handled by different countries",
      ],
      answer: 1,
      explanation:
        "Registering a business name records the name under which a person or firm trades. Incorporation creates a company with its own legal personality.",
    },
    {
      id: "bl-5",
      prompt: "To whom do directors' duties primarily run?",
      options: [
        "To the company",
        "To the largest customer",
        "To the bank",
        "To themselves",
      ],
      answer: 0,
      explanation:
        "Directors owe fiduciary duties to the company, including acting in good faith in its best interests, exercising care and skill, and avoiding conflicts of interest.",
    },
    {
      id: "bl-6",
      prompt: "What is a persons-with-significant-control style disclosure obligation about?",
      options: [
        "Disclosing who ultimately owns or controls the company",
        "Publishing staff salaries",
        "Registering trademarks",
        "Filing tax returns",
      ],
      answer: 0,
      explanation:
        "CAMA 2020 introduced beneficial ownership disclosure obligations, aimed at recording who actually controls a company rather than only who appears on its face.",
    },
    {
      id: "bl-7",
      prompt: "A company keeps no minutes and no register of members. What is the risk?",
      options: [
        "None, records are optional",
        "Statutory record-keeping obligations are breached, and the company's own decisions become hard to prove",
        "Only tax is affected",
        "The company is automatically dissolved",
      ],
      answer: 1,
      explanation:
        "Statutory registers and minutes are obligations, and they are also the evidence of who agreed what. Their absence surfaces painfully during a dispute, a sale or due diligence.",
    },
    {
      id: "bl-8",
      prompt: "Which regulator administers competition and consumer protection in Nigeria?",
      options: [
        "The Federal Competition and Consumer Protection Commission",
        "The Corporate Affairs Commission",
        "The Nigeria Data Protection Commission",
        "The Central Bank",
      ],
      answer: 0,
      explanation:
        "The FCCPC was established under the Federal Competition and Consumer Protection Act 2018, which addresses both competition and consumer protection.",
    },
    {
      id: "bl-9",
      prompt: "A business collects customer phone numbers. Which regime is most directly engaged?",
      options: [
        "The Nigeria Data Protection Act 2023",
        "The Land Use Act 1978",
        "The Copyright Act 2022",
        "None",
      ],
      answer: 0,
      explanation:
        "A phone number relating to an identifiable individual is personal data, and the NDP Act applies to its processing regardless of the size of the business.",
    },
    {
      id: "bl-10",
      prompt: "What is the significance of a shareholders' agreement alongside the articles?",
      options: [
        "It replaces the need to incorporate",
        "It records how the owners will run and exit the business, covering matters the articles may not",
        "It is only for foreign investors",
        "It removes directors' duties",
      ],
      answer: 1,
      explanation:
        "Deadlock, transfer restrictions, funding obligations and exit are the questions that break partnerships. They are far cheaper to settle at the start than during the fallout.",
    },
    {
      id: "bl-11",
      prompt: "Who owns work created by an employee in the course of employment?",
      options: [
        "Always the employee",
        "It depends on the contract and the applicable intellectual property rules — which is why the contract should say",
        "Always the customer",
        "Nobody",
      ],
      answer: 1,
      explanation:
        "Ownership of copyright and other IP created during employment is governed by the Copyright Act 2022 and the terms of the contract. Silence in the contract is where disputes start.",
    },
    {
      id: "bl-12",
      prompt: "What is the safest general statement about mixing personal and company bank accounts?",
      options: [
        "It is efficient and recommended",
        "It undermines the separation the company structure exists to create, and complicates records, tax and any later dispute",
        "It is illegal in every case",
        "It only matters for large companies",
      ],
      answer: 1,
      explanation:
        "The structure only protects what it can distinguish. Separate accounts are the cheapest governance measure a small company can adopt.",
    },
  ],
  "online-safety": [
    {
      id: "os-1",
      prompt: "Which statute is Nigeria's principal law on offences committed through computers and networks?",
      options: [
        "The Cybercrimes (Prohibition, Prevention, etc.) Act 2015",
        "The Copyright Act 2022",
        "CAMA 2020",
        "The Labour Act",
      ],
      answer: 0,
      explanation:
        "The Cybercrimes Act 2015 covers matters including unauthorised access, electronic fraud, identity theft and offences relating to critical national information infrastructure.",
    },
    {
      id: "os-2",
      prompt: "Opening a social media account in someone else's name is best described as:",
      options: [
        "Harmless if no money is involved",
        "Potentially online impersonation, which the Cybercrimes Act addresses",
        "A civil matter only",
        "Legal if the account is private",
      ],
      answer: 1,
      explanation:
        "The Act addresses identity theft and impersonation carried out through computer systems. Intent and circumstances matter, but 'it was a joke' is not a category the statute recognises.",
    },
    {
      id: "os-3",
      prompt: "You are asked to confirm your bank details through a link in an unexpected message. What is the safest response?",
      options: [
        "Confirm quickly to avoid account closure",
        "Do not use the link; contact the institution through a channel you already know to be genuine",
        "Reply asking for proof",
        "Forward it to friends",
      ],
      answer: 1,
      explanation:
        "Urgency is the standard pressure technique. Verifying through a channel you established independently defeats almost every version of this approach.",
    },
    {
      id: "os-4",
      prompt: "Money has just left your account through a fraud. What matters most in the first hours?",
      options: [
        "Waiting to see if it returns",
        "Reporting to your bank and the police promptly, and preserving evidence",
        "Posting about it publicly first",
        "Deleting the messages",
      ],
      answer: 1,
      explanation:
        "Funds are easiest to trace early. Preserve the evidence — full screenshots showing account names and timestamps, transaction references — rather than cropping or deleting.",
    },
    {
      id: "os-5",
      prompt: "What does personal data mean under the Nigeria Data Protection Act 2023?",
      options: [
        "Only financial information",
        "Information relating to an identifiable individual",
        "Only what a person marks confidential",
        "Only government records",
      ],
      answer: 1,
      explanation:
        "It is defined broadly. A phone number, a photograph or an address relating to an identifiable person is personal data, whoever holds it.",
    },
    {
      id: "os-6",
      prompt: "A group admin forwards a member's phone number to a marketing list without asking. What is engaged?",
      options: [
        "Nothing at all",
        "Data protection obligations, because personal data is being processed for a new purpose",
        "Only the platform's rules",
        "Copyright",
      ],
      answer: 1,
      explanation:
        "Using personal data for a purpose incompatible with the one it was provided for runs against the core principles of the NDP Act, whoever is doing it.",
    },
    {
      id: "os-7",
      prompt: "Sharing an intimate image of another person without consent is:",
      options: [
        "Acceptable if you took the photograph",
        "A serious matter engaging both criminal law and the constitutional protection of private life",
        "Only a platform violation",
        "Legal after a relationship ends",
      ],
      answer: 1,
      explanation:
        "Ownership of a file is not consent to publish. The conduct can engage criminal provisions as well as civil claims, and the harm to the person depicted is treated seriously.",
    },
    {
      id: "os-8",
      prompt: "What is the most useful evidence when reporting an online scam?",
      options: [
        "A cropped screenshot of the message text",
        "Full screenshots showing the account identity and timestamps, transaction references, and the original messages kept intact",
        "A description written from memory",
        "The scammer's promise",
      ],
      answer: 1,
      explanation:
        "Investigators and banks work from identifiers and timing. A crop that removes the account handle or the timestamp removes most of the value.",
    },
    {
      id: "os-9",
      prompt: "Which statement about the Cybercrimes Act's provisions on messages is most accurate?",
      options: [
        "They are settled and uncontroversial",
        "They have been heavily litigated and criticised for reaching expression protected by Chapter IV, and remain a developing area",
        "They apply only to companies",
        "They have been repealed",
      ],
      answer: 1,
      explanation:
        "This is the most contested part of the Act. Anyone facing or considering a complaint under those provisions should take advice on the current state of the law rather than rely on a summary.",
    },
    {
      id: "os-10",
      prompt: "An online seller takes payment and disappears. Which is the accurate framing?",
      options: [
        "It is only bad luck",
        "It can be both a criminal matter and a civil claim, and both routes have evidence and cost consequences worth weighing",
        "Only the platform can act",
        "Nothing can be done once money moves",
      ],
      answer: 1,
      explanation:
        "Reporting to the police and pursuing recovery are different processes with different requirements. Deciding early which you are pursuing shapes what evidence you gather.",
    },
  ],
};

export const checklistItems: Record<string, ChecklistItem[]> = {
  "starting-a-business": [
    {
      id: "sab-1",
      group: "Before you register",
      label: "Decide what structure fits",
      detail:
        "Business name, private company, incorporated trustees or partnership. The choice affects liability, tax treatment, and how you take investment later.",
    },
    {
      id: "sab-2",
      group: "Before you register",
      label: "Agree ownership in writing before trading",
      detail:
        "Who owns what percentage, who decides what, what happens if someone leaves. Founders who skip this rarely disagree at the start — they disagree later.",
    },
    {
      id: "sab-3",
      group: "Before you register",
      label: "Check the name is available and not already someone's trademark",
      detail:
        "Availability at the registry and freedom to use as a brand are two separate questions.",
    },
    {
      id: "sab-4",
      group: "Before you register",
      label: "Confirm whether your activity needs a sector licence",
      detail:
        "Financial services, health, education, transport, food and several other sectors require permissions that incorporation does not supply.",
    },
    {
      id: "sab-5",
      group: "Registration",
      label: "Register with the Corporate Affairs Commission",
      detail:
        "Incorporation under CAMA 2020 creates the separate legal person. Keep the certificate and the registered particulars where you can find them.",
    },
    {
      id: "sab-6",
      group: "Registration",
      label: "Adopt articles that match how you actually intend to run it",
      detail:
        "Model articles are a starting point, not a decision. Share transfers, director appointment and deadlock deserve thought.",
    },
    {
      id: "sab-7",
      group: "Registration",
      label: "Record beneficial ownership",
      detail:
        "CAMA 2020 requires disclosure of persons with significant control. Get it right at the start rather than correcting it later.",
    },
    {
      id: "sab-8",
      group: "Registration",
      label: "Register for tax and obtain your tax identification",
      detail:
        "Registration obligations begin with the entity, not with profitability.",
    },
    {
      id: "sab-9",
      group: "Money and records",
      label: "Open a bank account in the company's name",
      detail:
        "Never run company money through a personal account. It undermines the separation the structure exists to create.",
    },
    {
      id: "sab-10",
      group: "Money and records",
      label: "Set up bookkeeping from the first transaction",
      detail:
        "Statutory registers, minutes and financial records are obligations and evidence at the same time.",
    },
    {
      id: "sab-11",
      group: "Money and records",
      label: "Keep a written record of every decision that matters",
      detail:
        "A short minute of who approved what, and when, costs minutes now and settles arguments later.",
    },
    {
      id: "sab-12",
      group: "People and agreements",
      label: "Put employment terms in writing before anyone starts",
      detail:
        "Role, pay, hours, leave, notice, confidentiality and intellectual property. Silence in a contract is where disputes begin.",
    },
    {
      id: "sab-13",
      group: "People and agreements",
      label: "Distinguish employees from contractors deliberately",
      detail:
        "The label on the document does not settle the question; the substance of the relationship matters.",
    },
    {
      id: "sab-14",
      group: "People and agreements",
      label: "Use written terms with customers and suppliers",
      detail:
        "Scope, price, payment timing, liability and termination. Agree whose terms govern before the first order, not during the first dispute.",
    },
    {
      id: "sab-15",
      group: "Obligations that follow you",
      label: "Map your data protection obligations",
      detail:
        "If you hold customer or staff personal data, the Nigeria Data Protection Act 2023 applies to you. Decide your lawful basis and your retention practice early.",
    },
    {
      id: "sab-16",
      group: "Obligations that follow you",
      label: "Diarise your recurring filings",
      detail:
        "Annual returns, tax filings and sector renewals. Put them in a calendar owned by a named person, not in someone's memory.",
    },
  ],
  "signing-a-contract": [
    {
      id: "sac-1",
      group: "Before you read a word",
      label: "Confirm who the other party actually is",
      detail:
        "The full registered name, not a trading name or a group brand. You can only enforce against the entity named in the document.",
    },
    {
      id: "sac-2",
      group: "Before you read a word",
      label: "Check the person signing has authority to bind them",
      detail:
        "A signature from someone without authority is a problem you discover at the worst possible moment.",
    },
    {
      id: "sac-3",
      group: "Before you read a word",
      label: "Make sure you have the complete document",
      detail:
        "Schedules, annexes and any terms incorporated by reference are part of what you are signing.",
    },
    {
      id: "sac-4",
      group: "The commercial core",
      label: "Read the description of what is being supplied",
      detail:
        "Ambiguity here becomes an argument about scope on the first day of performance.",
    },
    {
      id: "sac-5",
      group: "The commercial core",
      label: "Check price, what it excludes, and when it can change",
      detail:
        "Taxes, delivery, expenses and indexation clauses all change the number you thought you agreed.",
    },
    {
      id: "sac-6",
      group: "The commercial core",
      label: "Check payment timing and what happens on late payment",
      detail:
        "Interest, suspension rights and set-off. This is the clause most often used in practice.",
    },
    {
      id: "sac-7",
      group: "Risk",
      label: "Read the liability clause twice",
      detail:
        "What is capped, what is excluded, and what is carved out of the cap. This clause decides what a dispute is worth.",
    },
    {
      id: "sac-8",
      group: "Risk",
      label: "Find every indemnity and ask what triggers it",
      detail:
        "An uncapped indemnity can exceed the value of the entire contract.",
    },
    {
      id: "sac-9",
      group: "Risk",
      label: "Check what the force majeure clause actually lists",
      detail:
        "It works only for the events named and only with the consequences stated.",
    },
    {
      id: "sac-10",
      group: "Getting out",
      label: "Read the termination clause before signing, not when it is being used",
      detail:
        "Notice periods, termination for convenience, and whether the rights are reciprocal.",
    },
    {
      id: "sac-11",
      group: "Getting out",
      label: "Check what survives termination",
      detail:
        "Confidentiality, intellectual property, restrictions and accrued payment obligations usually continue.",
    },
    {
      id: "sac-12",
      group: "The fine print that bites",
      label: "Look for the entire agreement clause",
      detail:
        "If the assurance that persuaded you is not written into the document, this clause is designed to keep it out.",
    },
    {
      id: "sac-13",
      group: "The fine print that bites",
      label: "Check how variations must be made",
      detail:
        "Where the contract requires signed written variations, a chat message will not do it.",
    },
    {
      id: "sac-14",
      group: "The fine print that bites",
      label: "Read the governing law and dispute clause",
      detail:
        "It decides which law applies and where you would have to go. A distant arbitration seat can make a modest claim uneconomic to pursue.",
    },
  ],
  "buying-property": [
    {
      id: "bp-1",
      group: "Understand what is being sold",
      label: "Establish what interest the seller actually holds",
      detail:
        "Under the Land Use Act 1978 land in each state is vested in the Governor, and what a holder has is a right of occupancy rather than absolute ownership.",
    },
    {
      id: "bp-2",
      group: "Understand what is being sold",
      label: "Identify whether it is a statutory or customary right of occupancy",
      detail:
        "The distinction affects the documents you should expect and the authority that granted them.",
    },
    {
      id: "bp-3",
      group: "Understand what is being sold",
      label: "Trace the root of title and the whole chain since",
      detail:
        "How the seller came to hold the interest, and every transfer since, is the question that a certificate alone does not answer.",
    },
    {
      id: "bp-4",
      group: "Understand what is being sold",
      label: "Where family or community land is involved, establish who may deal with it",
      detail:
        "A signature from someone without authority to sell does not become good by being notarised.",
    },
    {
      id: "bp-5",
      group: "Searches and verification",
      label: "Conduct a search at the relevant lands registry",
      detail:
        "Search the registry yourself or through a lawyer. Do not rely on documents handed over by the seller.",
    },
    {
      id: "bp-6",
      group: "Searches and verification",
      label: "Confirm Governor's consent was obtained for prior transactions",
      detail:
        "Because the holder has a right of occupancy, transfers and mortgages generally require consent. Missing consent is a defect in title, not paperwork to tidy later.",
    },
    {
      id: "bp-7",
      group: "Searches and verification",
      label: "Check for encumbrances",
      detail:
        "Mortgages, charges, caveats, court processes and unpaid charges attach to the land, not to the person who created them.",
    },
    {
      id: "bp-8",
      group: "Searches and verification",
      label: "Check planning and zoning position",
      detail:
        "What you may lawfully build or operate is a separate question from who owns the land.",
    },
    {
      id: "bp-9",
      group: "Searches and verification",
      label: "Confirm the land is not subject to a government acquisition or setback",
      detail:
        "Acquisition, road schemes and setbacks are discovered far more cheaply before payment.",
    },
    {
      id: "bp-10",
      group: "On the ground",
      label: "Visit the land and confirm the physical identity",
      detail:
        "Match the survey plan to what is actually there. Boundaries in a document and boundaries on the ground are not always the same.",
    },
    {
      id: "bp-11",
      group: "On the ground",
      label: "Ask who is in occupation",
      detail:
        "Occupants, tenants and caretakers may hold rights that the seller did not mention.",
    },
    {
      id: "bp-12",
      group: "On the ground",
      label: "Ask neighbours and the local community about the land's history",
      detail:
        "Disputes are usually known locally long before they appear in any register.",
    },
    {
      id: "bp-13",
      group: "Paying and documenting",
      label: "Never pay in cash without a traceable record",
      detail:
        "Pay in a way that creates evidence of who received what and when.",
    },
    {
      id: "bp-14",
      group: "Paying and documenting",
      label: "Use a written agreement that states the interest being transferred",
      detail:
        "Parties, property description, consideration, timing, and what each side must do to complete.",
    },
    {
      id: "bp-15",
      group: "Paying and documenting",
      label: "Keep receipts and every version of every document",
      detail:
        "Including the drafts. A change between versions is sometimes the whole dispute.",
    },
    {
      id: "bp-16",
      group: "After completion",
      label: "Obtain the Governor's consent for your own transaction",
      detail:
        "This is the step buyers most often defer and most often regret deferring.",
    },
    {
      id: "bp-17",
      group: "After completion",
      label: "Perfect and register your title",
      detail:
        "Registration protects your position against later dealings by others.",
    },
    {
      id: "bp-18",
      group: "After completion",
      label: "Take possession and secure the property",
      detail:
        "Unattended land invites the encroachment that becomes the next owner's litigation.",
    },
  ],
};
