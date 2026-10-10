/**
 * The wording of the Contact and Donate pages.
 *
 * These two pages keep layouts of their own - a contact form beside the desks
 * that read it, a giving panel beside the case for giving - so they are not
 * composed from blocks the way About and the platform documents are. What an
 * editor changes is the words in each part, and the CMS offers exactly that:
 * one record per page, with a field for every heading, paragraph and card.
 *
 * This file is the seed for those records and the offline fallback, not the
 * source the site renders from once Convex is configured.
 */

/** A card that sends a reader somewhere else on the site. */
export interface LinkedCard {
  title: string;
  body: string;
  href: string;
  /** The link's own wording, e.g. "Ask a question". */
  linkLabel: string;
}

export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ContactPageContent {
  eyebrow: string;
  title: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  routes: SectionCopy & { items: LinkedCard[] };
  form: SectionCopy;
  desks: { heading: string; items: LinkedCard[] };
}

export interface DonatePageContent {
  eyebrow: string;
  title: string;
  lede: string;
  badges: string[];
  metaTitle: string;
  metaDescription: string;
  why: SectionCopy & { paragraphs: string[] };
  give: {
    heading: string;
    body: string;
    /** Where the Donate button goes. Empty means no button is shown. */
    url: string;
    buttonLabel: string;
    pendingHeading: string;
    pendingBody: string;
    pendingLinkLabel: string;
    note: string;
  };
  funds: SectionCopy & { items: { icon: string; title: string; body: string }[] };
  boundaries: { eyebrow: string; title: string; intro: string; items: LinkedCard[] };
  otherWays: SectionCopy & { items: LinkedCard[] };
}

export const contactPage: ContactPageContent = {
  eyebrow: "Contact",
  title: "Talk to us",
  lede: "A person reads every message. Before you write, check whether one of the routes below answers your question faster — most do.",
  metaTitle: "Contact",
  metaDescription:
    "Reach Law Awareness TV — corrections, accessibility problems, press and partnership enquiries, and general questions about the platform.",
  routes: {
    eyebrow: "Faster than a message",
    title: "Three things we are asked most",
    description:
      "These have dedicated routes because a contact form is the slowest way to get any of them answered.",
    items: [
      {
        title: "A question about the law",
        body: "General legal questions go through the moderated public Q&A, where the answer helps everyone who has the same question. It is the fastest route, and the only one that produces a published answer.",
        href: "/ask",
        linkLabel: "Ask a question",
      },
      {
        title: "A legal problem happening now",
        body: "If something is already under way — a deadline, a demand, a court date — start with the guided pathway. It points at the area of law and the kind of help the situation calls for.",
        href: "/legal-help/problem",
        linkLabel: "Describe the problem",
      },
      {
        title: "You need a practitioner",
        body: "We do not take instructions and we do not represent anyone. The legal-aid routes are where to look for someone who can.",
        href: "/legal-help/legal-aid",
        linkLabel: "Find help",
      },
    ],
  },
  form: {
    eyebrow: "Send a message",
    title: "Everything else",
    description:
      "Corrections, accessibility, press, partnerships and general enquiries about the platform.",
  },
  desks: {
    heading: "Who picks it up",
    items: [
      {
        title: "Corrections",
        body: "Something we published is wrong, out of date or unclear. Point us at the page and the provision you are reading — corrections are treated as defects, not opinions.",
        href: "/about/editorial-policy",
        linkLabel: "Editorial policy",
      },
      {
        title: "Accessibility",
        body: "Any barrier that stopped you getting to something. Tell us the page, what you were doing, and the browser or assistive technology you were using.",
        href: "/about/accessibility",
        linkLabel: "Accessibility commitment",
      },
      {
        title: "Privacy and data",
        body: "Access, correction, deletion or any other request about personal data we hold about you.",
        href: "/about/privacy",
        linkLabel: "Privacy policy",
      },
      {
        title: "Press, partnerships and contributors",
        body: "Media enquiries, distribution and sponsorship conversations, and practitioners who would like to write, review or appear.",
        href: "/about",
        linkLabel: "About Law Awareness TV",
      },
    ],
  },
};

export const donatePage: DonatePageContent = {
  eyebrow: "Donate",
  title: "Keep legal knowledge free for everyone",
  lede: "Not knowing the law is expensive, and it costs most the people least able to pay for an answer. Law Awareness TV has no paywall and never will. Donations are what make that sustainable.",
  badges: ["No paywall", "No reader data sold", "Editorially independent"],
  metaTitle: "Donate to Law Awareness TV",
  metaDescription:
    "Law Awareness TV is free to read and has no paywall. Donations pay for the research, legal review and production behind every explanation — and never buy influence over one.",
  why: {
    eyebrow: "Why it needs funding",
    title: "Free to read is not free to make",
    description:
      "Every explanation here is researched against the primary source, reviewed by someone qualified to catch an error, and kept current as the law changes.",
    paragraphs: [
      "The work that makes a legal explanation trustworthy is the work nobody sees: checking a section number, confirming an amendment is in force, deciding a guide is now wrong enough to take down. It is slow, it is skilled, and it is the reason this platform is worth reading rather than being one more summary of a summary.",
      "We could pay for it with a paywall, and the people who most need to know their rights would be the first ones locked out. We could pay for it by selling attention, and the incentive would quietly bend towards whatever gets clicked rather than whatever is accurate. Reader donations are the funding model that does not pull against the mission.",
    ],
  },
  give: {
    heading: "Give to Law Awareness TV",
    body: "Any amount helps, and a small monthly gift helps most — it is what lets us commit to review work months ahead instead of reacting to whatever arrives.",
    // Never invented: a giving destination that is wrong or stale is worse
    // than none, so the seed carries no link and the page routes through
    // /contact until an editor sets a real one.
    url: "",
    buttonLabel: "Donate now",
    pendingHeading: "Online giving is being set up",
    pendingBody:
      "We would rather publish no payment details than details we cannot stand behind. Message us and we will send the current giving route directly.",
    pendingLinkLabel: "Get in touch to give",
    note: "Donations are not tax-deductible and are not a fee for any service. If you need a receipt for a gift, ask and we will issue one.",
  },
  funds: {
    eyebrow: "Where it goes",
    title: "What your donation pays for",
    description: "Four costs, in the order they consume the budget.",
    items: [
      {
        icon: "scale",
        title: "Legal review",
        body: "Every explanation is checked against the provision it describes before it publishes, and checked again when the law moves. Review is the largest cost on the platform and the one that cannot be automated away.",
      },
      {
        icon: "video",
        title: "Video and audio production",
        body: "Law explained in the formats people actually use — shot, edited, subtitled and captioned. Reaching people who will not read long English text costs more per person, not less.",
      },
      {
        icon: "circle-question",
        title: "The public Q&A",
        body: "Questions arrive faster than they can be answered well. Funding here is what turns a backlog into published answers that help everyone who had the same question.",
      },
      {
        icon: "shield",
        title: "Keeping it free and open",
        body: "No paywall, no registration wall, no selling reader data. Hosting, accessibility work and keeping the archive online are paid for by the people who give, not the people who read.",
      },
    ],
  },
  boundaries: {
    eyebrow: "What it does not buy",
    title: "The line donations never cross",
    intro:
      "A platform that explains the law is only useful if readers can trust that the explanation was not bought. These limits apply to every donor, at every amount, without exception.",
    items: [
      {
        title: "Donations do not influence what we publish",
        body: "Editorial decisions are made by the editorial team alone. No donor sees a piece before publication, reviews a draft, or gets a subject covered or dropped because they gave.",
        href: "/about/editorial-policy",
        linkLabel: "Editorial policy",
      },
      {
        title: "We publish who funds us",
        body: "Institutional grants and sponsorships are disclosed alongside the work they support, and sponsored material is labelled as such. Individual gifts stay private unless you ask to be named.",
        href: "/about",
        linkLabel: "About Law Awareness TV",
      },
    ],
  },
  otherWays: {
    eyebrow: "Other ways to help",
    title: "If you cannot give money",
    description:
      "These are not consolation prizes. A correction from a reader who knows the area has kept more people right than most donations.",
    items: [
      {
        title: "Tell us what is wrong",
        body: "A correction is worth more than a small donation. If a page is out of date, unclear or simply wrong, point us at it and at the provision you are reading.",
        href: "/contact",
        linkLabel: "Report a correction",
      },
      {
        title: "Lend your expertise",
        body: "Practitioners who can write, review or appear on camera close the gap between what the law says and what people understand it to say.",
        href: "/contact",
        linkLabel: "Offer to contribute",
      },
      {
        title: "Pass it on",
        body: "Send the page that answered your question to the person who needs it next. Most people arrive here because someone they trust shared something.",
        href: "/know-the-law",
        linkLabel: "Find something to share",
      },
    ],
  },
};
