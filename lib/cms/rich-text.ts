import sanitizeHtml from "sanitize-html";
import { imageUrl, isCloudinaryUrl } from "@/lib/media/cloudinary";

/**
 * The one gate rich text passes through, on the way in and on the way out.
 *
 * An article body is HTML written in the browser, and anything that reaches a
 * server action can be hand-made, so nothing about it is trusted. This is an
 * allow-list, not a block-list: a tag, attribute or URL scheme that is not
 * named here does not survive, whatever it is. That is what removes scripts,
 * event handlers (`onerror=`), `javascript:` links, iframes, forms, inline
 * styles and tracking pixels - none of them needs a rule of its own.
 *
 * It runs twice. On save, so what Convex stores is already clean. And again
 * on render, because Convex can be written by more than this form (seed
 * scripts, the dashboard, a future importer), and the page is the last place
 * a bad record could be stopped.
 */

/** Generous for a long read; a body bigger than this is a paste gone wrong. */
export const MAX_RICH_TEXT_LENGTH = 200_000;

const ALLOWED_TAGS = [
  "p",
  "br",
  "h2",
  "h3",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "hr",
  "img",
];

function baseOptions(): sanitizeHtml.IOptions {
  return {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    // Only real web links and email. No javascript:, data:, vbscript:, and no
    // protocol-relative "//host" that would borrow the page's scheme.
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    // Script and style bodies are dropped with their tags, not left as text.
    disallowedTagsMode: "discard",
    transformTags: {
      // Pasted documents bring their own vocabulary; it is mapped onto ours
      // rather than lost, so a heading from Word stays a heading.
      b: "strong",
      i: "em",
      strike: "s",
      del: "s",
      h1: "h2",
      h4: "h3",
      h5: "h3",
      h6: "h3",
      div: "p",
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href);
        return {
          tagName,
          attribs: {
            href,
            // An external link never gets a handle on this window, and never
            // passes ranking credit to whoever an editor linked to.
            ...(external
              ? { target: "_blank", rel: "noopener noreferrer nofollow" }
              : {}),
          },
        };
      },
    },
    // A photo must be one uploaded through the CMS. Anything else - a hotlink
    // pasted from another site, a tracking pixel - is dropped.
    exclusiveFilter: (frame) =>
      frame.tag === "img" && !isCloudinaryUrl(frame.attribs.src ?? ""),
  };
}

/**
 * Empty paragraphs from a double Enter add nothing but a gap; spacing between
 * paragraphs is the stylesheet's job, so they are dropped.
 */
function dropEmptyParagraphs(html: string): string {
  return html.replace(/<p>(\s|&nbsp;| |<br \/>)*<\/p>/g, "").trim();
}

/** Cleans editor HTML for storage. */
export function sanitizeRichText(html: string): string {
  return dropEmptyParagraphs(sanitizeHtml(html, baseOptions()));
}

/**
 * How many photos the editor sent that were not ours. Lets the save action
 * tell an editor their pasted image was removed, instead of it quietly
 * vanishing from the story.
 */
export function countForeignImages(html: string): number {
  let foreign = 0;
  sanitizeHtml(html, {
    allowedTags: ["img"],
    allowedAttributes: { img: ["src"] },
    exclusiveFilter: (frame) => {
      if (frame.tag === "img" && !isCloudinaryUrl(frame.attribs.src ?? "")) {
        foreign += 1;
      }
      return false;
    },
  });
  return foreign;
}

export interface RichTextHeading {
  id: string;
  label: string;
}

/** Stable anchor for a heading, so "On this page" and the page agree. */
function anchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Sanitises stored HTML for the page and prepares it to be read: photos are
 * served through Cloudinary's resizer and load lazily, and every section
 * heading gets an anchor so the page can list them.
 */
export function renderRichText(html: string): {
  html: string;
  headings: RichTextHeading[];
} {
  const clean = dropEmptyParagraphs(sanitizeHtml(html, {
    ...baseOptions(),
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "loading", "decoding"],
    },
    transformTags: {
      ...baseOptions().transformTags,
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          src: imageUrl(attribs.src ?? "", { width: 1280 }),
          alt: attribs.alt ?? "",
          loading: "lazy",
          decoding: "async",
        },
      }),
    },
  }));

  const headings: RichTextHeading[] = [];
  const used = new Set<string>();
  // Safe to match with a pattern: the sanitiser has just written every <h2>
  // itself, with no attributes, so there is exactly one shape to find.
  const withAnchors = clean.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const label = decodeEntities(inner.replace(/<[^>]*>/g, "")).trim();
    let id = anchor(label) || "section";
    for (let n = 2; used.has(id); n += 1) id = `${anchor(label) || "section"}-${n}`;
    used.add(id);
    headings.push({ id, label });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  return { html: withAnchors, headings };
}
