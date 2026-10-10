import type { Article, ArticleSection, NewsDesk } from "./types";

/** The News desks in the order the filters show them. */
export const newsDesks: { value: NewsDesk; label: string }[] = [
  { value: "law", label: "Law" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
];

export function deskOf(article: Article): NewsDesk {
  return article.desk ?? "law";
}

export function deskLabel(article: Article): string {
  const desk = deskOf(article);
  return newsDesks.find((item) => item.value === desk)?.label ?? "Law";
}

/**
 * Only law stories carry a legal review: who checked it, when, and against
 * what source. Sports and entertainment news shows none of that.
 */
export function isLegalStory(article: Article): boolean {
  return deskOf(article) === "law";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Writes the seed's heading-and-paragraphs articles as the HTML the rich-text
 * editor produces, so seeded stories open in the editor like any other.
 */
export function sectionsToHtml(sections: ArticleSection[]): string {
  return sections
    .map(
      (section) =>
        (section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : "") +
        section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")
    )
    .join("");
}
