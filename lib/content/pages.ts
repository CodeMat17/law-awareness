import { serialiseItems, type PageBlock } from "@/lib/cms/blocks";

/**
 * Seed content for the `pages` collection.
 *
 * These pages used to be hardcoded JSX in app/(site)/about/. They live here as
 * data so that the same copy can be loaded into Convex and edited, while the
 * route files become thin renderers. This file is the origin of that content,
 * not its home: once seeded, Convex is the source of truth, and editing here
 * changes nothing on a deployment that has already been seeded.
 *
 * The authoring helpers below exist so this file reads as prose rather than as
 * serialised block data. `items` fields are JSON at the storage boundary (see
 * lib/cms/blocks.ts); nobody should have to hand-write that.
 */

export interface PageSeed {
  /** Stable record id, carried into Convex. */
  id: string;
  path: string;
  title: string;
  eyebrow: string;
  lede: string;
  layout: "standard" | "policy";
  /** ISO date, shown on platform documents. */
  updated?: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks: PageBlock[];
}

let sequence = 0;

/** Block keys need only be stable within a page, and unique across a session. */
function key(type: string): string {
  sequence += 1;
  return `${type}-${sequence}`;
}

function prose(data: {
  eyebrow?: string;
  heading: string;
  description?: string;
  bodyLeft: string;
  bodyRight?: string;
  tone?: "default" | "surface" | "forest";
}): PageBlock {
  return {
    key: key("prose"),
    type: "prose",
    data: {
      eyebrow: data.eyebrow ?? "",
      heading: data.heading,
      description: data.description ?? "",
      bodyLeft: data.bodyLeft,
      bodyRight: data.bodyRight ?? "",
      tone: data.tone ?? "default",
    },
  };
}

function cards(data: {
  eyebrow?: string;
  heading: string;
  description?: string;
  columns?: "2" | "3";
  items: { title: string; body: string }[];
  tone?: "default" | "surface" | "forest";
}): PageBlock {
  return {
    key: key("cards"),
    type: "cards",
    data: {
      eyebrow: data.eyebrow ?? "",
      heading: data.heading,
      description: data.description ?? "",
      columns: data.columns ?? "3",
      items: serialiseItems(data.items),
      tone: data.tone ?? "default",
    },
  };
}

function labels(data: {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: { title: string; body: string }[];
  tone?: "default" | "surface" | "forest";
}): PageBlock {
  return {
    key: key("labels"),
    type: "labels",
    data: {
      eyebrow: data.eyebrow ?? "",
      heading: data.heading,
      description: data.description ?? "",
      items: serialiseItems(data.items),
      tone: data.tone ?? "default",
    },
  };
}

function cta(data: {
  eyebrow?: string;
  heading: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "default" | "surface" | "forest";
}): PageBlock {
  return {
    key: key("cta"),
    type: "cta",
    data: {
      eyebrow: data.eyebrow ?? "",
      heading: data.heading,
      body: data.body ?? "",
      primaryLabel: data.primaryLabel ?? "",
      primaryHref: data.primaryHref ?? "",
      secondaryLabel: data.secondaryLabel ?? "",
      secondaryHref: data.secondaryHref ?? "",
      tone: data.tone ?? "default",
    },
  };
}

/**
 * A numbered section of a platform document. `paragraphs` are joined with
 * blank lines because that is the separator the editor's textarea uses.
 */
function section(data: {
  heading: string;
  paragraphs?: string[];
  list?: { term?: string; body: string }[];
}): PageBlock {
  return {
    key: key("policy"),
    type: "policySection",
    data: {
      heading: data.heading,
      paragraphs: (data.paragraphs ?? []).join("\n\n"),
      items: serialiseItems(
        (data.list ?? []).map((entry) => ({
          term: entry.term ?? "",
          body: entry.body,
        }))
      ),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

const about: PageSeed = {
  id: "page-about",
  path: "/about",
  eyebrow: "About",
  title: "Africa's first full-fledged law-dedicated television",
  lede: "The law, in its complex entirety, engagingly captured, dissected, simplified and made accessible to a wide range of the global audience through inclusive and dynamic programmes.",
  layout: "standard",
  metaTitle: "About — Africa's first full-fledged law-dedicated television",
  metaDescription:
    "Law Awareness TV captures, dissects and simplifies the law for a global audience through inclusive, dynamic programming across online, terrestrial and satellite platforms.",
  blocks: [
    prose({
      eyebrow: "Our purpose",
      heading: "Broadening access to a conservative and technical field",
      description:
        "The mission of Law Awareness TV is to open up the law through innovation and dynamic programming.",
      bodyLeft:
        "Given how integral the law is to society, we believe that making it accessible to a greater number of people holds great promise — not only for the empowerment of individuals and organisations, but for society as a whole.",
      bodyRight:
        "The media is a powerful tool for fostering meaningful and productive relationships among people, connecting people to opportunities, and uniting people around common ideals. Law TV will play this role in a niche market which it intends not only to dominate, but to define.",
    }),
    cards({
      eyebrow: "What we cover",
      heading: "Every layer of a widely encompassing field",
      description:
        "From courtroom news and judicial administration reporting to law making, law enforcement, corporate law and regulation, Law TV brings unique and refreshing perspectives to each layer of the law.",
      tone: "surface",
      items: [
        {
          title: "Courtroom news",
          body: "Proceedings, judgments and the working reality of the courts, reported for people who were never trained to read them.",
        },
        {
          title: "Judicial administration",
          body: "How the machinery of justice is run, resourced and reformed — the layer that shapes every case before it is heard.",
        },
        {
          title: "Law making",
          body: "Bills, debates and the path an idea travels before it becomes an instrument that binds everyone.",
        },
        {
          title: "Law enforcement",
          body: "Powers, limits and accountability, covered with the same care on both sides of the badge.",
        },
        {
          title: "Corporate law & regulation",
          body: "The rules that govern how businesses form, trade, disclose and answer to their regulators.",
        },
        {
          title: "Sports law & beyond",
          body: "Ample room for the lesser-known corners of the field, alongside engrossing law-based entertainment.",
        },
      ],
    }),
    labels({
      eyebrow: "Distribution",
      heading: "A tripartite content distribution model",
      description:
        "Online, terrestrial and satellite. Law TV is billed to become one of the most sought-after TV stations in Africa and the world — dominating its niche, and competing favourably with some of the best names in news globally.",
      items: [
        {
          title: "Online",
          body: "On-demand programming, live streams and a searchable legal knowledge layer, open wherever the audience already is.",
        },
        {
          title: "Terrestrial",
          body: "Broadcast reach into homes that the internet has not yet reached, and never on its own terms alone.",
        },
        {
          title: "Satellite",
          body: "Continental and global distribution, carrying the niche well past the borders it started in.",
        },
      ],
    }),
    cta({
      eyebrow: "Start watching",
      heading: "The programming is the point",
      body: "Everything here begins as something to watch, listen to or follow live. The knowledge layer exists to carry it further.",
      primaryLabel: "Watch",
      primaryHref: "/watch",
      secondaryLabel: "Live",
      secondaryHref: "/live",
    }),
  ],
};

/* -------------------------------------------------------------------------- */
/* Platform documents                                                          */
/* -------------------------------------------------------------------------- */

const editorialPolicy: PageSeed = {
  id: "page-editorial-policy",
  path: "/about/editorial-policy",
  eyebrow: "Editorial Policy",
  title: "How we decide what the law says here",
  lede: "Everything we publish is written to be understood by someone who was never trained to read a statute — without becoming inaccurate in the simplifying.",
  layout: "policy",
  updated: "2026-09-09",
  metaTitle: "Editorial Policy",
  metaDescription:
    "How Law Awareness TV sources, writes, badges and reviews its legal education content, and how to tell us when something is wrong.",
  blocks: [
    section({
      heading: "What we publish",
      paragraphs: [
        "Law Awareness TV publishes general legal education, awareness and legal-media content for a public audience. We explain what the law generally provides, how a process usually works, and where a reader can look next.",
        "We do not publish legal advice, and nothing here is written for the facts of any individual case.",
      ],
    }),
    section({
      heading: "Our sources",
      paragraphs: [
        "Our explanatory content is grounded in named, publicly available Nigerian instruments and the official bodies that administer them.",
      ],
      list: [
        {
          term: "Primary instruments",
          body: "Legislation such as the Constitution of the Federal Republic of Nigeria 1999 (as amended), the Companies and Allied Matters Act 2020, the Nigeria Data Protection Act 2023, the Federal Competition and Consumer Protection Act 2018, the Cybercrimes Act 2015, the Administration of Criminal Justice Act 2015, the Labour Act, the Land Use Act 1978 and the Copyright Act 2022.",
        },
        {
          term: "Official bodies",
          body: "Guidance, published notices and public materials from the regulators and agencies that administer those instruments.",
        },
        {
          term: "What we will not do",
          body: "We do not invent citations, case names, section numbers, judgments, filing deadlines or professional profiles. If we cannot point to a real source, we describe the position generally or we do not publish it.",
        },
      ],
    }),
    section({
      heading: "Credibility badges",
      paragraphs: [
        "Content carries a badge that states exactly how far it has been checked. The badge is set from the content record itself and is never inferred.",
      ],
      list: [
        {
          term: "Educational",
          body: "A general explanation written by our editorial team. This is the default.",
        },
        {
          term: "Reviewed",
          body: "Checked by a named qualified legal practitioner, whose name and review date are recorded. This badge is only ever shown where a human reviewer is actually recorded against the item.",
        },
        {
          term: "Updated",
          body: "Revised after publication to reflect a change in the law or a correction.",
        },
        {
          term: "Archived",
          body: "Retained for reference but superseded. Do not rely on it as current.",
        },
      ],
    }),
    section({
      heading: "Automated and interactive tools",
      paragraphs: [
        "Our questionnaires, triage pathways, health checks and calendars are educational aids that help a reader organise a situation and find the right area of law. They do not assess a case, and their output is not a legal opinion.",
      ],
    }),
    section({
      heading: "Independence",
      paragraphs: [
        "Editorial decisions are made by the editorial team. Sponsored, promotional or partner content is labelled as such and is never presented as an independent explanation of the law.",
      ],
    }),
    section({
      heading: "Corrections",
      paragraphs: [
        "The law changes, and we get things wrong. When we correct a substantive error we revise the item, update its review date and mark it as updated rather than quietly editing it.",
        "If something here is inaccurate, out of date or unclear, tell us through the contact page and point us at the provision you are reading.",
      ],
    }),
  ],
};

const privacy: PageSeed = {
  id: "page-privacy",
  path: "/about/privacy",
  eyebrow: "Privacy",
  title: "What we collect, and what we do not",
  lede: "We ask for as little as the platform needs to work. This page states plainly what that is, why we hold it, and how you can have it removed.",
  layout: "policy",
  updated: "2026-09-09",
  metaTitle: "Privacy Policy",
  metaDescription:
    "What personal data Law Awareness TV collects, why we collect it, how long we keep it, and the rights you have over it under the Nigeria Data Protection Act 2023.",
  blocks: [
    section({
      heading: "Who we are",
      paragraphs: [
        "Law Awareness TV operates this platform and is the data controller for personal data collected through it. Our processing of personal data in Nigeria is governed by the Nigeria Data Protection Act 2023.",
      ],
    }),
    section({
      heading: "What we collect",
      list: [
        {
          term: "Questions you submit",
          body: "Where you send a question through the Ask a Question form, we hold the question text and the topic and state you select. Please do not include names, case details or anything else that identifies you or another person.",
        },
        {
          term: "Messages you send us",
          body: "Where you write through the contact form, we hold your name, email address, the reason you chose and the message itself, so that we can reply and route it to the right person.",
        },
        {
          term: "Newsletter sign-ups",
          body: "Your email address and the subject interests you choose, held so we can send what you asked for.",
        },
        {
          term: "Tool responses",
          body: "Answers you give to the legal health check, problem triage and similar tools, used to produce your result on the page.",
        },
        {
          term: "Technical and usage data",
          body: "Standard server and analytics data such as pages viewed and approximate region, used to keep the platform working and to understand which content is useful.",
        },
        {
          term: "Preferences stored on your device",
          body: "Settings such as your light or dark theme choice are kept in your own browser and are not sent to us.",
        },
      ],
    }),
    section({
      heading: "What we do not want",
      paragraphs: [
        "This platform is not a confidential channel. Do not send us privileged information, case documents, identity documents, financial details, or personal data about someone else. Anything you send is not covered by legal professional privilege, and we may remove material that should not have been sent to us.",
      ],
    }),
    section({
      heading: "Why we process it",
      list: [
        {
          term: "To provide the platform",
          body: "Answering questions, running the interactive tools, and delivering the content you request.",
        },
        {
          term: "With your consent",
          body: "Sending the newsletter, which you can withdraw from at any time using the unsubscribe link in any message.",
        },
        {
          term: "Our legitimate interests",
          body: "Keeping the platform secure and reliable, and improving what we publish based on aggregate usage.",
        },
        {
          term: "Legal obligation",
          body: "Where we are required to retain or disclose information by law.",
        },
      ],
    }),
    section({
      heading: "Publishing questions",
      paragraphs: [
        "Questions sent to us may inform published explainers or programming. Where that happens, we use the question as a general theme and edit out anything that could identify the sender. We do not publish your email address.",
      ],
    }),
    section({
      heading: "Sharing",
      paragraphs: [
        "We do not sell personal data. We share it only with service providers who operate the platform on our behalf — hosting, email delivery and analytics — under terms that require them to process it only on our instructions, and with authorities where the law requires disclosure.",
      ],
    }),
    section({
      heading: "Retention",
      paragraphs: [
        "We keep personal data only as long as the purpose it was collected for requires. Newsletter records are kept until you unsubscribe; contact messages are kept while the enquiry is open and for a reasonable period afterwards; submitted questions are kept while they remain editorially useful and are then deleted or stripped of anything identifying.",
      ],
    }),
    section({
      heading: "Your rights",
      paragraphs: [
        "Under the Nigeria Data Protection Act 2023 you may request access to the personal data we hold about you, ask us to correct or delete it, object to or restrict processing, withdraw consent, and lodge a complaint with the Nigeria Data Protection Commission.",
        "To make a request, contact us through the contact page. We will respond within the period the Act allows.",
      ],
    }),
    section({
      heading: "Children",
      paragraphs: [
        "The platform is intended for a general adult audience. We do not knowingly collect personal data from children. If you believe a child has sent us personal data, contact us and we will remove it.",
      ],
    }),
    section({
      heading: "Changes",
      paragraphs: [
        "When this policy changes materially we revise the date at the top of this page. Continued use after a change means you accept the revised policy.",
      ],
    }),
  ],
};

const terms: PageSeed = {
  id: "page-terms",
  path: "/about/terms",
  eyebrow: "Terms",
  title: "Terms of use",
  lede: "The terms on which we make this platform, its content and its programming available to you.",
  layout: "policy",
  updated: "2026-09-09",
  metaTitle: "Terms of Use",
  metaDescription:
    "The terms on which Law Awareness TV makes this platform and its programming available, including acceptable use, intellectual property and liability.",
  blocks: [
    section({
      heading: "Accepting these terms",
      paragraphs: [
        "By using this platform you agree to these terms. If you do not agree with them, please do not use the platform.",
      ],
    }),
    section({
      heading: "What the platform is",
      paragraphs: [
        "Law Awareness TV is a legal education, awareness and legal-media platform. It provides general information and programming about the law. It does not provide legal advice, and using it does not create a lawyer-client relationship.",
      ],
    }),
    section({
      heading: "Acceptable use",
      list: [
        {
          term: "Use it lawfully",
          body: "Do not use the platform for any unlawful purpose, or in a way that infringes the rights of others.",
        },
        {
          term: "Do not disrupt it",
          body: "Do not attempt to gain unauthorised access to any part of the platform, interfere with its operation, or scrape it at a scale that degrades service for others.",
        },
        {
          term: "Do not misrepresent it",
          body: "Do not present our content as legal advice, as your own work, or as an endorsement of a person, product or position.",
        },
      ],
    }),
    section({
      heading: "Content you submit",
      paragraphs: [
        "You are responsible for anything you send us — questions, feedback or other material. Do not submit anything unlawful, defamatory, confidential, privileged, or containing personal data about another person.",
        "By submitting material you grant us a non-exclusive, royalty-free licence to use it to operate and improve the platform and to inform our programming, in the anonymised way described in the privacy policy. You confirm you are entitled to grant that licence.",
      ],
    }),
    section({
      heading: "Intellectual property",
      paragraphs: [
        "The content, programming, design, branding and code of this platform are owned by Law Awareness TV or its licensors and are protected by the Copyright Act 2022 and related law.",
        "You may read, share and link to our content, and quote short extracts with attribution. You may not republish substantial portions, redistribute our programming, or use our name and branding commercially without written permission.",
      ],
    }),
    section({
      heading: "Third-party links and directories",
      paragraphs: [
        "The platform links to external sites and may list practitioners and organisations. Those listings are not endorsements, and we are not responsible for third-party content, services or conduct.",
      ],
    }),
    section({
      heading: "Availability",
      paragraphs: [
        "We aim to keep the platform available and current, but we provide it on an 'as is' basis. We may change, suspend or withdraw any part of it, including individual content or tools, at any time.",
      ],
    }),
    section({
      heading: "Liability",
      paragraphs: [
        "To the fullest extent permitted by law, Law Awareness TV is not liable for any loss or damage arising from your use of, or reliance on, this platform or its content. Nothing in these terms excludes liability that cannot lawfully be excluded.",
      ],
    }),
    section({
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of the Federal Republic of Nigeria, and the Nigerian courts have jurisdiction over any dispute arising from them.",
      ],
    }),
    section({
      heading: "Changes to these terms",
      paragraphs: [
        "We may revise these terms. The date at the top of this page shows when they were last changed, and continued use after a change means you accept the revised terms.",
      ],
    }),
  ],
};

const accessibility: PageSeed = {
  id: "page-accessibility",
  path: "/about/accessibility",
  eyebrow: "Accessibility",
  title: "The law should not be gated by how you read",
  lede: "Broadening access to the law means the platform itself has to be usable — by keyboard, by screen reader, on a small screen, on a slow connection.",
  layout: "policy",
  updated: "2026-09-09",
  metaTitle: "Accessibility",
  metaDescription:
    "How Law Awareness TV works towards WCAG 2.2 AA — keyboard access, contrast, reduced motion, captions and plain language — and how to report a barrier.",
  blocks: [
    section({
      heading: "Our target",
      paragraphs: [
        "We build towards the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. That is a target we work against continuously rather than a certification we claim.",
      ],
    }),
    section({
      heading: "What is in place",
      list: [
        {
          term: "Keyboard access",
          body: "Every interactive control can be reached and operated by keyboard, with a visible focus indicator and a logical order through the page.",
        },
        {
          term: "Structure for screen readers",
          body: "Pages use real headings, landmarks, breadcrumbs and labelled form controls, so the document can be navigated by structure rather than by sight.",
        },
        {
          term: "Contrast and themes",
          body: "Text and interface colours are chosen to meet AA contrast in both the light and dark themes, and the theme can be switched from the footer.",
        },
        {
          term: "Reduced motion",
          body: "Animation is decorative and respects the operating system 'reduce motion' setting. With it enabled, entrances and background movement are dropped rather than merely shortened.",
        },
        {
          term: "Responsive layout",
          body: "Content reflows down to small screens and at increased zoom, without horizontal scrolling of the page.",
        },
        {
          term: "Plain language",
          body: "An accessibility measure in its own right: legal terms are explained where they first appear and gathered in the glossary.",
        },
      ],
    }),
    section({
      heading: "Media",
      paragraphs: [
        "Our programming spans video, audio and live streams. We are working towards captions on all recorded video, transcripts for podcast episodes, and meaningful descriptions for images that carry information. Not all of our back catalogue has caught up with that standard yet, and we will say so on items that have not.",
      ],
    }),
    section({
      heading: "Known limitations",
      paragraphs: [
        "Some interactive tools and embedded third-party players do not yet meet the standard we hold our own pages to. Where an external player or provider limits what we can fix, we look for an accessible alternative route to the same content.",
      ],
    }),
    section({
      heading: "Tell us about a barrier",
      paragraphs: [
        "If any part of this platform stopped you from getting to something, we want to hear it — it is treated as a defect, not a suggestion. Contact us through the contact page with the page address, what you were trying to do, and the browser or assistive technology you were using.",
        "If you need something we publish in a different format, ask and we will find a way to get it to you.",
      ],
    }),
  ],
};

/**
 * Every editable page, in the order they appear in the admin list.
 *
 * The order also decides nothing on the public site: each page is fetched by
 * its own path, because a page's route is fixed in the file system and cannot
 * be reordered by an editor.
 */
export const pageSeeds: PageSeed[] = [
  about,
  editorialPolicy,
  privacy,
  terms,
  accessibility,
];

export function pageSeedByPath(path: string): PageSeed | undefined {
  return pageSeeds.find((page) => page.path === path);
}
